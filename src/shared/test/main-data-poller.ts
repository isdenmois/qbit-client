import { ref } from 'vue'
import type { MainDataPoller } from '@/entities/stats'

// Pages inject the poller optionally via MainDataPollerKey; the provider lives in app.vue,
// so page tests use this no-op stub to keep Vue's missing-injection warning quiet.
export const mainDataPollerStub: MainDataPoller = {
  start: () => {},
  stop: () => {},
  refresh: () => {},
  isPolling: ref(false),
}
