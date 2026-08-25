<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { maindata } from '@/entities/stats'
import { api } from '@/shared/api'
import { Priority, type TorrentFile } from '@/shared/api/torrent'
import { formatNumber } from '@/shared/lib/format'
import { compare } from '@/shared/lib/utils'
import { Icon, icons, ModalContent } from '@/shared/ui'

const route = useRoute()
const id = route.params.id as string

interface Node {
  name: string
  priority: Priority
  children: Array<Node | TorrentFile>
}

const path = ref<string[]>([])
const tree = ref<Node>({
  name: 'root',
  priority: Priority.Normal,
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

const selected = ref(new Set<Node | TorrentFile>())

onMounted(async () => {
  const files = await api.torrent.files(id)
  files.sort(cmp)
  const newTree: Node = { name: 'root', priority: Priority.Normal, children: [] }

  files.forEach((file) => {
    const filePath = file.name.split('/')
    let node = newTree

    while (filePath.length > 1) {
      const folder = filePath.shift() ?? ''
      let subnode = node.children.find((n) => n.name === folder) as Node

      if (!subnode) {
        subnode = {
          name: folder,
          priority: file.priority,
          children: [],
        }
        node.children.push(subnode)
        node.children.sort(cmp)
      }

      node = subnode
    }

    file.name = filePath[0]
    node.children.push(file)

    if (node.priority !== file.priority) {
      node.priority = Priority.Normal
    }
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

  if (node.priority > Priority.Normal) {
    return icons.documentSpeed
  }

  return node.priority ? icons.file : icons.documentCross
}

const getFolderIcon = (node: Node) => {
  if (isSelected(node)) {
    return icons.folderCheck
  }

  if (node.priority > Priority.Normal) {
    return icons.folderSpeed
  }

  return node.priority ? icons.folder : icons.folderCross
}

const goUp = () => {
  if (selected.value.size) return

  path.value = path.value.slice(0, -1)
}

const openFolder = (node: Node | TorrentFile) => {
  if (selected.value.size) {
    return toggleSelectNode(node)
  }

  if ('children' in node) {
    path.value = [...path.value, node.name]
  }
}

const isSelected = (node: Node | TorrentFile) => selected.value.has(node)

const toggleSelectNode = (node: Node | TorrentFile) => {
  if (selected.value.has(node)) {
    selected.value.delete(node)
  } else {
    selected.value.add(node)
  }

  selected.value = new Set(selected.value)
}

const selectFile = (node: TorrentFile) => {
  if (selected.value.has(node)) {
    selected.value.delete(node)
  } else {
    selected.value.add(node)
  }

  selected.value = new Set(selected.value)
}

const expandToFiles = (items: Iterable<Node | TorrentFile>): TorrentFile[] => {
  const files: TorrentFile[] = []

  for (const item of items) {
    if ('children' in item) {
      files.push(...expandToFiles(item.children))
    } else {
      files.push(item)
    }
  }

  return files
}

const updateTreePriorities = (node: Node) => {
  if (node.children?.length) {
    for (const subnode of node.children) {
      if ('children' in subnode) {
        updateTreePriorities(subnode)
      }
    }

    let priority = node.children[0].priority

    for (const subnode of node.children) {
      if (subnode.priority !== priority) {
        priority = Priority.Normal
      }
    }

    node.priority = priority
  }
}

const setPriority = async (priority: Priority) => {
  const files = expandToFiles(selected.value)
  await api.torrent.setPriority(id, files, priority)

  for (const node of files) {
    node.priority = priority
  }

  updateTreePriorities(tree.value)

  selected.value = new Set()
}
</script>

<template>
  <ModalContent :title="torrent?.name ?? ''">
    <ul :class="{ selection: selected.size }" class="flex flex-col">
      <template v-if="path.length > 0">
        <li>{{ path.join('/') }}</li>

        <li class="up pt-4 pb-2" @click="goUp"><Icon :icon="icons.arrowUp" /> ..</li>
      </template>

      <template v-for="node in currentNode.children" :key="node.name">
        <li
          v-if="'children' in node"
          class="folder py-2"
          :class="{ selected: isSelected(node) }"
          @click="openFolder(node)"
          @contextmenu.prevent="toggleSelectNode(node)"
        >
          <Icon :icon="getFolderIcon(node)" />
          <span class="name">{{ node.name }}</span>
        </li>

        <li
          v-else
          class="file py-2"
          :class="{ selected: selected.has(node) }"
          @click="selectFile(node)"
          @contextmenu.prevent="selectFile(node)"
        >
          <Icon :icon="getFileIcon(node)" />
          <span class="name">{{ node.name }}</span>

          <span v-if="node.progress < 1" class="shrink-0">{{ formatNumber(node.progress * 100) }}%</span>
        </li>
      </template>
    </ul>

    <template #bottom>
      <div class="bottom flex gap-2 justify-center md:justify-start md:px-8 py-2">
        <template v-if="selected.size">
          <button aria-label="Skip file" @click="setPriority(Priority.None)">
            <Icon :icon="icons.documentCross" />
          </button>
          <button aria-label="Set normal priority" @click="setPriority(Priority.Normal)">
            <Icon :icon="icons.file" />
          </button>
          <button aria-label="Set maximum priority" @click="setPriority(Priority.Maximum)">
            <Icon :icon="icons.documentSpeed" />
          </button>
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

.name {
  flex: 1;
  align-self: center;
}

.selection li.file,
.selection li.folder {
  opacity: 0.6;
}

.selection li.selected {
  opacity: 1;
  font-weight: bold;
}

.selection li.up {
  opacity: 0.1;
  cursor: unset;
}
</style>
