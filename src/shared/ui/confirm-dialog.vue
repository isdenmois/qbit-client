<script setup lang="ts">
interface Props {
  modelValue: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}

withDefaults(defineProps<Props>(), {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const close = () => {
  emit('update:modelValue', false)
}

const cancel = () => {
  close()
  emit('cancel')
}

const confirm = () => {
  close()
  emit('confirm')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="confirm-dialog-backdrop" @click="cancel" />

    <div v-if="modelValue" class="confirm-dialog" role="dialog" aria-modal="true">
      <h3>{{ title }}</h3>

      <p>{{ message }}</p>

      <slot />

      <div class="actions">
        <button class="secondary" @click="cancel">{{ cancelLabel }}</button>
        <button class="danger" @click="confirm">{{ confirmLabel }}</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.confirm-dialog-backdrop {
  position: fixed;
  inset: 0;
  background-color: var(--black);
  opacity: 0.7;
  z-index: 100;
}

.confirm-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(24rem, calc(100% - 2rem));
  background-color: var(--background);
  border: 1px solid var(--card);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 101;
}

@screen lt-sm {
  .confirm-dialog {
    left: 1rem;
    right: 1rem;
    width: auto;
    transform: none;
    top: auto;
    bottom: 2rem;
  }
}

h3 {
  color: var(--primary);
  font-size: 16px;
  font-weight: bold;
}

p {
  color: var(--secondary);
  line-height: 1.4;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

button {
  padding: 0.75rem 1.25rem;
}
</style>
