<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    confirmLabel: string
    initialName?: string
    initialSavePath?: string
    nameReadonly?: boolean
    busy?: boolean
  }>(),
  { initialName: '', initialSavePath: '', nameReadonly: false, busy: false },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [name: string, savePath: string]
}>()

const name = ref(props.initialName ?? '')
const savePath = ref(props.initialSavePath ?? '')

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      name.value = props.initialName ?? ''
      savePath.value = props.initialSavePath ?? ''
    }
  },
)

const valid = computed(() => name.value.trim() !== '' && savePath.value.trim() !== '')

const close = () => {
  emit('update:modelValue', false)
}

const confirm = () => {
  if (!valid.value) return
  emit('confirm', name.value, savePath.value)
  close()
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="backdrop" @click="!busy && close()" />

    <div v-if="modelValue" class="dialog">
      <h3>{{ title }}</h3>

      <form class="flex flex-col gap-4" @submit.prevent="confirm">
        <label>
          Name
          <input v-model="name" type="text" :readonly="nameReadonly || busy" :disabled="nameReadonly || busy">
        </label>

        <label>
          Save Path
          <input v-model="savePath" type="text" :disabled="busy">
        </label>

        <div class="actions">
          <button class="secondary" type="button" :disabled="busy" @click="close">Cancel</button>
          <button type="submit" :disabled="!valid || busy">{{ confirmLabel }}</button>
        </div>
      </form>
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background-color: var(--black);
  opacity: 0.7;
  z-index: 100;
}

.dialog {
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
  .dialog {
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

label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--secondary);
  font-size: 14px;
}

input[readonly] {
  opacity: 0.6;
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
