<script setup lang="ts">
import { icons, Modal, ModalButton, ModalPanel } from 'shared/ui'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id as string
</script>

<template>
  <Modal>
    <RouterView />

    <template #panel>
      <ModalPanel>
        <ModalButton :to="`/torrent/${id}`" title="Home" :icon="icons.search" />
        <ModalButton :to="`/torrent/${id}/content`" title="Content" :icon="icons.list" />
        <ModalButton :to="`/torrent/${id}/category`" title="Category" :icon="icons.folder" />
      </ModalPanel>
    </template>
  </Modal>
</template>
