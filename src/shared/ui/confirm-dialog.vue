<script setup lang="ts">
interface Props {
  modelValue: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  busy?: boolean
}

withDefaults(defineProps<Props>(), {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  busy: false,
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
    <div v-if="modelValue" class="dialog-backdrop" @click="!busy && cancel()" />

    <div v-if="modelValue" class="dialog" role="dialog" aria-modal="true">
      <h3>{{ title }}</h3>

      <p>{{ message }}</p>

      <slot />

      <div class="actions">
        <button class="secondary" :disabled="busy" @click="cancel">{{ cancelLabel }}</button>
        <button class="danger" :disabled="busy" @click="confirm">{{ confirmLabel }}</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
p {
  color: var(--secondary);
  line-height: 1.4;
}
</style>
