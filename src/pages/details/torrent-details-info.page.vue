<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MainDataPollerKey, maindata } from '@/entities/stats'
import {
  decreasePriority,
  deleteTorrent,
  increasePriority,
  isPaused,
  maxPriority,
  pauseTorrent,
  resumeTorrent,
} from '@/entities/torrents'
import { api } from '@/shared/api'
import { formatBytes, formatDate, formatEta, formatNumber } from '@/shared/lib/format'
import { isEtaVisible, parseHtmlLinks, sanitize } from '@/shared/lib/utils'
import { ConfirmDialog, Icon, icons, ModalContent, Value } from '@/shared/ui'

const route = useRoute()
const router = useRouter()
const poller = inject(MainDataPollerKey)
const id = route.params.id as string

const torrent = computed(() => (maindata.value ? maindata.value.torrents[id] : undefined))

interface TorrentProperties {
  comment: string
}

const properties = ref<TorrentProperties | null>(null)

watch(
  () => id,
  async () => {
    properties.value = await api.torrent.properties(id)
  },
  { immediate: true },
)

const resume = () => resumeTorrent(id)

const pause = () => pauseTorrent(id)

const upPriority = async () => {
  await increasePriority(id)
  poller?.refresh()
}

const downPriority = async () => {
  await decreasePriority(id)
  poller?.refresh()
}

const showDeleteConfirm = ref(false)
const deleteFiles = ref(false)

const remove = () => {
  deleteFiles.value = true
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  await deleteTorrent(id, deleteFiles.value)

  router.replace('/')
}
</script>

<template>
  <ConfirmDialog
    v-model="showDeleteConfirm"
    title="Delete torrent"
    message="Are you sure you want to delete this torrent?"
    confirm-label="Delete"
    @confirm="confirmDelete"
  >
    <label class="delete-files">
      <input v-model="deleteFiles" type="checkbox">
      Delete files too
    </label>
  </ConfirmDialog>

  <ModalContent v-if="torrent" :title="torrent.name">
    <h1>Information</h1>

    <div class="mt-4 flex flex-col gap-4">
      <Value title="Total Size">{{ formatBytes(torrent.size) }}</Value>
      <Value title="Added On">{{ formatDate(torrent.added_on) }}</Value>
      <Value v-if="torrent.priority" title="Priority">#{{ torrent.priority }}</Value>
      <Value title="Save Path">{{ torrent.save_path }}</Value>
      <Value title="Uploaded">{{ formatBytes(torrent.uploaded) }}</Value>
      <Value title="Share Ratio">{{ formatNumber(torrent.ratio) }}</Value>
      <Value title="Popularity">{{ formatNumber(torrent.popularity) }}</Value>

      <template v-if="torrent.progress < 1">
        <Value title="Download Speed">{{ formatBytes(torrent.dlspeed) }}</Value>
        <Value title="Downloaded">{{ formatBytes(torrent.downloaded) }}</Value>
        <Value title="Progress">{{ formatNumber(torrent.progress * 100) }}%</Value>
        <Value title="Seeds">{{ torrent.num_seeds }}</Value>
      </template>
      <template v-else>
        <Value title="Completed On">{{ formatDate(torrent.completion_on) }}</Value>
        <Value title="Upload Speed">{{ formatBytes(torrent.upspeed) }}</Value>
        <Value title="Seeds">{{ torrent.num_complete }}</Value>
        <Value title="Leechs">{{ torrent.num_leechs }}</Value>
      </template>

      <Value v-if="isEtaVisible(torrent.eta)" title="ETA">{{ formatEta(torrent.eta) }}</Value>

      <Value v-if="properties?.comment" title="Comment">
        <span v-html="parseHtmlLinks(sanitize(properties.comment))" />
      </Value>
    </div>

    <template #bottom>
      <div class="bottom flex flex-wrap gap-4 px-4 md:px-8 py-2">
        <button v-if="isPaused(torrent)" @click="resume">
          <Icon :icon="icons.play" />
        </button>
        <button v-else @click="pause">
          <Icon :icon="icons.pause" />
        </button>

        <button aria-label="Increase priority" :disabled="torrent.priority <= 1" @click="upPriority">
          <Icon :icon="icons.arrowUp" />
        </button>
        <button aria-label="Decrease priority" :disabled="torrent.priority >= maxPriority" @click="downPriority">
          <Icon :icon="icons.arrowDown" />
        </button>

        <button aria-label="Delete" class="danger" @click="remove">
          <Icon :icon="icons.trash" />
        </button>
      </div>
    </template>
  </ModalContent>

  <div v-else-if="maindata">Not Found</div>
</template>

<style scoped>
.delete-files {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary);
  cursor: pointer;
}
</style>
