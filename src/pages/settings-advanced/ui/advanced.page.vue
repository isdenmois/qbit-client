<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loadPreferences, preferences, updatePreferences } from '@/entities/preferences'
import { Loading, Modal, ModalContent, showToast } from '@/shared/ui'
import {
  ADVANCED_DEFAULTS,
  type AdvancedForm,
  type AdvancedValues,
  type AutorunMode,
  buildPreferencesPatch,
  isNumericValueValid,
  isWebhookUrlValid,
  NUMERIC_RULES,
  type NumericPreferenceKey,
  parseAdvancedForm,
  resolveAdvancedPreferences,
  toAdvancedForm,
} from '../model'

const router = useRouter()

const FIELD_LABELS: Record<NumericPreferenceKey, string> = {
  max_connec: 'Max connections',
  max_connec_per_torrent: 'Max connections per torrent',
  max_uploads: 'Max uploads',
  max_uploads_per_torrent: 'Max uploads per torrent',
  max_active_downloads: 'Max active downloads',
  max_active_uploads: 'Max active uploads',
  max_active_torrents: 'Max active torrents',
  async_io_threads: 'Async I/O threads',
}

const CONNECTION_FIELDS: NumericPreferenceKey[] = [
  'max_connec',
  'max_connec_per_torrent',
  'max_uploads',
  'max_uploads_per_torrent',
]

const QUEUE_FIELDS: NumericPreferenceKey[] = ['max_active_downloads', 'max_active_uploads', 'max_active_torrents']

const AUTORUN_MODES: { value: AutorunMode; label: string }[] = [
  { value: 'off', label: 'Off' },
  { value: 'webhook', label: 'Webhook' },
  { value: 'custom', label: 'Custom' },
]

const loading = ref(true)
const saving = ref(false)
const baseline = ref<AdvancedValues>({ ...ADVANCED_DEFAULTS })
const form = ref<AdvancedForm>(toAdvancedForm(ADVANCED_DEFAULTS))

const parsed = computed(() => parseAdvancedForm(form.value))
const patch = computed(() => (parsed.value ? buildPreferencesPatch(parsed.value, baseline.value) : null))
const hasChanges = computed(() => Boolean(patch.value && Object.keys(patch.value).length > 0))
const canSave = computed(() => !loading.value && !saving.value && Boolean(parsed.value) && hasChanges.value)
const webhookPreview = computed(() => `curl -X POST "${form.value.autorun_webhook.trim()}"`)

const fieldHint = (key: NumericPreferenceKey) => {
  if (key === 'async_io_threads') return '1–1024'
  return NUMERIC_RULES[key].min === -1 ? '-1 = unlimited' : ''
}

const leave = () => {
  if (history.state.back) {
    router.back()
  } else {
    router.replace('/settings')
  }
}

onMounted(async () => {
  try {
    await loadPreferences()
    baseline.value = resolveAdvancedPreferences(preferences.value)
  } catch {
    showToast('Failed to load advanced settings', 'error')
    baseline.value = { ...ADVANCED_DEFAULTS }
  } finally {
    form.value = toAdvancedForm(baseline.value)
    loading.value = false
  }
})

const save = async () => {
  if (!canSave.value || !patch.value) return

  saving.value = true
  try {
    await updatePreferences(patch.value)
    showToast('Advanced settings updated', 'success')
    leave()
  } catch {
    showToast('Failed to update advanced settings', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Modal parent="/settings">
    <ModalContent title="Advanced Settings">
      <div v-if="loading" class="loading">
        <Loading />
      </div>

      <form v-else class="flex flex-col gap-8" @submit.prevent="save">
        <section>
          <h3>Connections</h3>

          <div class="fields mt-3">
            <label v-for="key in CONNECTION_FIELDS" :key="key" class="field">
              <span>{{ FIELD_LABELS[key] }}</span>
              <input
                v-model.number="form[key]"
                :aria-label="FIELD_LABELS[key]"
                :class="{ invalid: !isNumericValueValid(key, form[key]) }"
                :max="NUMERIC_RULES[key].max"
                :min="NUMERIC_RULES[key].min"
                :name="key"
                step="1"
                type="number"
              >
              <span v-if="fieldHint(key)" class="hint">{{ fieldHint(key) }}</span>
            </label>
          </div>
        </section>

        <section>
          <h3>Queueing</h3>

          <label class="checkbox mt-3">
            <input v-model="form.queueing_enabled" type="checkbox">
            Enable queueing
          </label>

          <p class="hint mt-1">Active limits apply only while queueing is enabled.</p>

          <div class="fields mt-3">
            <label v-for="key in QUEUE_FIELDS" :key="key" class="field">
              <span>{{ FIELD_LABELS[key] }}</span>
              <input
                v-model.number="form[key]"
                :aria-label="FIELD_LABELS[key]"
                :class="{ invalid: !isNumericValueValid(key, form[key]) }"
                :max="NUMERIC_RULES[key].max"
                :min="NUMERIC_RULES[key].min"
                :name="key"
                step="1"
                type="number"
              >
              <span v-if="fieldHint(key)" class="hint">{{ fieldHint(key) }}</span>
            </label>
          </div>
        </section>

        <section>
          <h3>Performance</h3>

          <div class="fields mt-3">
            <label class="field">
              <span>{{ FIELD_LABELS.async_io_threads }}</span>
              <input
                v-model.number="form.async_io_threads"
                :aria-label="FIELD_LABELS.async_io_threads"
                :class="{ invalid: !isNumericValueValid('async_io_threads', form.async_io_threads) }"
                :max="NUMERIC_RULES.async_io_threads.max"
                :min="NUMERIC_RULES.async_io_threads.min"
                name="async_io_threads"
                step="1"
                type="number"
              >
              <span class="hint">{{ fieldHint('async_io_threads') }}</span>
            </label>
          </div>
        </section>

        <section>
          <h3>AutoRun</h3>

          <div class="tabs mt-3" role="group" aria-label="AutoRun mode">
            <button
              v-for="mode in AUTORUN_MODES"
              :key="mode.value"
              :aria-pressed="form.autorun_mode === mode.value"
              :class="{ selected: form.autorun_mode === mode.value }"
              class="secondary"
              type="button"
              @click="form.autorun_mode = mode.value"
            >
              {{ mode.label }}
            </button>
          </div>

          <label v-if="form.autorun_mode === 'webhook'" class="field mt-3">
            <span>Webhook URL</span>
            <input
              v-model="form.autorun_webhook"
              aria-label="Webhook URL"
              :class="{ invalid: !isWebhookUrlValid(form.autorun_webhook.trim()) }"
              :disabled="saving"
              name="autorun_webhook"
              placeholder="https://example.com/hook"
              type="url"
            >
            <span class="hint">Saved as: {{ webhookPreview }}</span>
          </label>

          <label v-else-if="form.autorun_mode === 'custom'" class="field mt-3">
            <span>Custom command</span>
            <input
              v-model="form.autorun_command"
              aria-label="Custom command"
              :class="{ invalid: form.autorun_command.trim() === '' }"
              :disabled="saving"
              name="autorun_program"
              placeholder="notify-send %n"
              type="text"
            >
          </label>
        </section>

        <div class="actions">
          <button class="secondary" type="button" :disabled="saving" @click="leave">Cancel</button>
          <button type="submit" :disabled="!canSave">{{ saving ? 'Saving...' : 'Save' }}</button>
        </div>
      </form>
    </ModalContent>
  </Modal>
</template>

<style scoped>
.loading {
  display: grid;
  place-items: center;
  padding: 4rem 0;
}

h3 {
  color: var(--secondary);
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem 2rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: var(--secondary);
  font-size: 14px;
}

.field input[type='number'] {
  width: 100%;
}

.field input.invalid {
  border-bottom-color: var(--error);
}

.field input:disabled {
  opacity: 0.5;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox input {
  width: 1rem;
  height: 1rem;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tabs button {
  padding: 0.5rem 1rem;
  font-size: 14px;
}

.hint {
  color: var(--secondary);
  font-size: 12px;
  opacity: 0.7;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

@screen lt-sm {
  .fields {
    grid-template-columns: 1fr;
  }
}
</style>
