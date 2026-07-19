<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Icon from './icon.vue'
import { icons } from './icons'

const props = withDefaults(
  defineProps<{ accept: string; files: FileList | null; autoselect?: boolean; multiple?: boolean }>(),
  {
    autoselect: false,
    multiple: false,
  },
)

const emit = defineEmits<{ 'update:files': [files: FileList | null] }>()

const inputRef = ref<HTMLInputElement | null>(null)
const hasFile = computed(() => Boolean(props.files?.length))

onMounted(() => {
  if (props.autoselect) {
    inputRef.value?.click()
  }
})

const onChange = (event: Event) => {
  emit('update:files', (event.target as HTMLInputElement).files)
}
</script>

<template>
  <label :class="{ selected: hasFile }">
    <input ref="inputRef" class="hidden" type="file" :multiple="multiple" :accept="accept" @change="onChange">

    <div class="flex items-center gap-2" :class="{ 'flex-col': !hasFile }">
      <template v-if="files?.length">
        <Icon :icon="icons.file" />

        <div class="flex flex-col gap-3">
          <div v-for="file in [...files]" :key="file.name">{{ file.name }}</div>
        </div>
      </template>
      <template v-else>
        <Icon :icon="icons.documentPlus" />

        <div>Choose a file or drag here</div>
      </template>
    </div>
  </label>
</template>

<style scoped>
label {
  border: 1px dashed var(--secondary);
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
}

label.selected {
  border-width: 0;
  padding: 0;
}
</style>
