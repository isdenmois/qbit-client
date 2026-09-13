<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Priority, type TorrentFile } from '@/shared/api/torrent'
import { formatBytes, formatNumber } from '@/shared/lib/format'
import { Icon, icons, ModalContent } from '@/shared/ui'
import { type FolderNode, isFolder, showSizes, type TreeNode, useFileTree } from './model'

const route = useRoute()
const id = route.params.id as string

const { path, currentNode, torrent, selected, goUp, openFolder, toggleSelect, setPriority } = useFileTree(id)

const isSelected = (node: TreeNode) => selected.value.has(node)

const getFileIcon = (node: TorrentFile) => {
  if (isSelected(node)) {
    return icons.documentCheck
  }

  if (node.priority > Priority.Normal) {
    return icons.documentSpeed
  }

  return node.priority ? icons.file : icons.documentCross
}

const getFolderIcon = (node: FolderNode) => {
  if (isSelected(node)) {
    return icons.folderCheck
  }

  if (node.priority > Priority.Normal) {
    return icons.folderSpeed
  }

  return node.priority ? icons.folder : icons.folderCross
}
</script>

<template>
  <ModalContent :title="torrent?.name ?? ''">
    <template #actions>
      <button
        class="toggle-size"
        :class="{ selected: showSizes }"
        :aria-pressed="showSizes"
        aria-label="Show sizes"
        title="Show sizes"
        @click="showSizes = !showSizes"
      >
        <Icon :icon="icons.size" />
      </button>
    </template>

    <ul :class="{ selection: selected.size }" class="flex flex-col">
      <template v-if="path.length > 0">
        <li>{{ path.join('/') }}</li>

        <li class="up pt-4 pb-2" @click="goUp"><Icon :icon="icons.arrowUp" /> ..</li>
      </template>

      <template v-for="node in currentNode.children" :key="node.name">
        <li
          v-if="isFolder(node)"
          class="folder py-2"
          :class="{ selected: isSelected(node) }"
          @click="openFolder(node)"
          @contextmenu.prevent="toggleSelect(node)"
        >
          <Icon :icon="getFolderIcon(node)" />
          <span class="name">{{ node.name }}</span>

          <span v-if="showSizes" class="shrink-0">{{ formatBytes(node.size) }}</span>
          <span v-if="node.progress < 1" class="shrink-0">{{ formatNumber(node.progress * 100) }}%</span>
        </li>

        <li
          v-else
          class="file py-2"
          :class="{ selected: isSelected(node) }"
          @click="toggleSelect(node)"
          @contextmenu.prevent="toggleSelect(node)"
        >
          <Icon :icon="getFileIcon(node)" />
          <span class="name">{{ node.name }}</span>

          <span v-if="showSizes" class="shrink-0">{{ formatBytes(node.size) }}</span>
          <span v-if="node.priority !== Priority.None && node.progress < 1" class="shrink-0"
            >{{ formatNumber(node.progress * 100) }}%</span
          >
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
.toggle-size {
  padding: 0.5rem 1rem;
  background-color: transparent;
  margin-right: -1rem;
  color: var(--secondary);
}

.toggle-size.selected {
  color: var(--primary);
}

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
