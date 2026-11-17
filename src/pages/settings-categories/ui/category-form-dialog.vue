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
    <div v-if="modelValue" class="dialog-backdrop" @click="!busy && close()" />

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
</style>
