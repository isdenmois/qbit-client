<script setup lang="ts">
import { computed, ref } from 'vue'
import { categories, loadCategories } from '@/entities/torrents/model/categories'
import { category, filters } from '@/entities/torrents/model/torrents'
import { api } from '@/shared/api'
import { ConfirmDialog, Modal, ModalContent, showToast } from '@/shared/ui'
import CategoryFormDialog from './category-form-dialog.vue'

const sorted = computed(() => [...categories.value].sort((a, b) => a.name.localeCompare(b.name)))

const showForm = ref(false)
const showConfirm = ref(false)
const editing = ref<string | null>(null)
const deleting = ref<string | null>(null)
const pending = ref(false)

const openAdd = () => {
  editing.value = null
  showForm.value = true
}

const openEdit = (id: string) => {
  editing.value = id
  showForm.value = true
}

const openDelete = (id: string) => {
  deleting.value = id
  showConfirm.value = true
}

const editTarget = computed(() => {
  if (!editing.value) return { name: '', savePath: '' }
  const found = categories.value.find((cat) => cat.id === editing.value)
  return { name: found?.name ?? '', savePath: found?.savePath ?? '' }
})

const deleteTarget = computed(() => deleting.value ?? '')

const submitForm = async (name: string, savePath: string) => {
  pending.value = true
  try {
    if (editing.value) {
      await api.torrent.editCategory(name, savePath)
      showToast('Category updated', 'success')
    } else {
      await api.torrent.createCategory(name, savePath)
      showToast('Category added', 'success')
    }
    await loadCategories()
  } catch {
    showToast(editing.value ? 'Failed to update category' : 'Failed to add category', 'error')
  } finally {
    pending.value = false
  }
}

const confirmDelete = async (name: string) => {
  pending.value = true
  try {
    await api.torrent.removeCategories(name)
    showToast('Category removed', 'success')

    if (category.value === name) {
      category.value = ''
    }

    if (filters.value.category === name) {
      filters.value = { ...filters.value, category: '' }
    }

    await loadCategories()
  } catch {
    showToast('Failed to remove category', 'error')
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <Modal parent="/settings">
    <ModalContent title="Categories">
      <ul class="flex flex-col gap-2 mt-4">
        <li v-for="cat in sorted" :key="cat.id" class="row">
          <div class="info">
            <span class="name">{{ cat.name }}</span>
            <span class="path">{{ cat.savePath }}</span>
          </div>

          <div class="actions">
            <button class="secondary" @click="openEdit(cat.id)">Edit</button>
            <button class="danger" @click="openDelete(cat.id)">Delete</button>
          </div>
        </li>
      </ul>

      <button class="mt-4" @click="openAdd">Add Category</button>
    </ModalContent>

    <CategoryFormDialog
      v-model="showForm"
      :title="editing ? 'Edit Category' : 'Add Category'"
      :confirm-label="editing ? 'Save' : 'Add'"
      :initial-name="editTarget.name"
      :initial-save-path="editTarget.savePath"
      :name-readonly="Boolean(editing)"
      :busy="pending"
      @confirm="submitForm"
    />

    <ConfirmDialog
      v-model="showConfirm"
      title="Delete Category"
      :message="`Remove category '${deleteTarget}'? Torrents keep their files but lose this category.`"
      confirm-label="Delete"
      :busy="pending"
      @confirm="confirmDelete(deleteTarget)"
    />
  </Modal>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 1px solid var(--card);
  padding: 0.75rem 1rem;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.name {
  color: var(--primary);
  font-weight: bold;
  overflow-wrap: anywhere;
}

.path {
  color: var(--secondary);
  font-size: 14px;
  overflow-wrap: anywhere;
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.actions button {
  padding: 0.5rem 1rem;
  font-size: 14px;
}

@screen lt-sm {
  .row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
