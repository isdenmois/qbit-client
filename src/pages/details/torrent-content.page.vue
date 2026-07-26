<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { maindata } from '@/entities/stats'
import { api } from '@/shared/api'
import type { TorrentFile } from '@/shared/api/torrent'
import { formatNumber } from '@/shared/lib/format'
import { compare } from '@/shared/lib/utils'
import { Icon, icons, ModalContent } from '@/shared/ui'

const route = useRoute()
const id = route.params.id as string

interface Node {
  name: string
  children: Array<Node | TorrentFile>
}

const path = ref<string[]>([])
const tree = ref<Node>({
  name: 'root',
  children: [],
})
const nodeCompare = compare<Node | TorrentFile>((n) => n.name.toLocaleLowerCase())
const cmp = (a: Node | TorrentFile, b: Node | TorrentFile) => {
  const isAdir = 'children' in a
  const isBdir = 'children' in b
  if (isAdir && !isBdir) {
    return -1
  }
  if (!isAdir && isBdir) {
    return 1
  }

  return nodeCompare(a, b)
}

const selected = ref(new Set<TorrentFile>())

onMounted(async () => {
  const files = await api.torrent.files(id)
  files.sort(cmp)
  const newTree: Node = { name: 'root', children: [] }

  files.forEach((file) => {
    const filePath = file.name.split('/')
    let node = newTree

    while (filePath.length > 1) {
      const folder = filePath.shift() ?? ''
      let subnode = node.children.find((n) => n.name === folder) as Node

      if (!subnode) {
        subnode = {
          name: folder,
          children: [],
        }
        node.children.push(subnode)
        node.children.sort(cmp)
      }

      node = subnode
    }

    file.name = filePath[0]
    node.children.push(file)
  })

  tree.value = newTree

  if (tree.value.children.length === 1 && 'children' in tree.value.children[0]) {
    openFolder(tree.value.children[0])
  }
})

const torrent = computed(() => (maindata.value ? maindata.value.torrents[id] : undefined))

const currentNode = computed(() =>
  path.value.reduce((node, name) => node.children.find((item) => item.name === name) as Node, tree.value),
)

const getFileIcon = (node: TorrentFile) => {
  if (selected.value.has(node)) {
    return icons.documentCheck
  }

  if (node.priority > 1) {
    return icons.documentSpeed
  }

  return node.priority ? icons.file : icons.documentCross
}

const goUp = () => {
  if (selected.value.size) return

  path.value = path.value.slice(0, -1)
}

const openFolder = (node: Node | TorrentFile) => {
  if (selected.value.size) return

  if ('children' in node) {
    path.value = [...path.value, node.name]
  }
}

const selectFile = (node: TorrentFile) => {
  if (selected.value.has(node)) {
    selected.value.delete(node)
  } else {
    selected.value.add(node)
  }

  selected.value = new Set(selected.value)
}

const setPriority = async (priority: number) => {
  await api.torrent.setPriority(id, [...selected.value], priority)

  for (const node of selected.value.values()) {
    node.priority = priority
  }

  selected.value = new Set()
}
</script>

<template>
  <ModalContent :title="torrent?.name ?? ''">
    <ul :class="{ selection: selected.size }" class="flex flex-col gap-4">
      <template v-if="path.length > 0">
        <li>{{ path.join('/') }}</li>

        <li class="up" @click="goUp"><Icon :icon="icons.arrowUp" /> ..</li>
      </template>

      <template v-for="node in currentNode.children" :key="node.name">
        <li v-if="'children' in node" class="folder" @click="openFolder(node)">
          <Icon :icon="icons.folder" />
          {{ node.name }}
        </li>

        <li v-else class="file" :class="{ selected: selected.has(node) }" @click="selectFile(node)">
          <Icon :icon="getFileIcon(node)" />
          <span>{{ node.name }}</span>

          <span v-if="node.progress < 1" class="shrink-0">{{ formatNumber(node.progress * 100) }}%</span>
        </li>
      </template>
    </ul>

    <template #bottom>
      <div class="bottom flex gap-2 justify-center md:justify-start md:px-8 py-2">
        <template v-if="selected.size">
          <button @click="setPriority(0)"><Icon :icon="icons.documentCross" /></button>
          <button @click="setPriority(1)"><Icon :icon="icons.file" /></button>
          <button @click="setPriority(7)"><Icon :icon="icons.documentSpeed" /></button>
        </template>
      </div>
    </template>
  </ModalContent>
</template>

<style scoped>
li {
  display: flex;
  min-height: 2rem;
  gap: 0.5rem;
  word-break: break-word;
  user-select: none;
  cursor: pointer;
}

.selection li.file {
  opacity: 0.6;
}

.selection li.selected {
  opacity: 1;
  font-weight: bold;
}

.selection li.up,
.selection li.folder {
  opacity: 0.1;
  cursor: unset;
}
</style>
