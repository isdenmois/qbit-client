import { computed, ref } from 'vue'

type AuthState = 'init' | 'logged-in' | 'logged-out'

const state = ref<AuthState>('init')
export const initialized = computed(() => state.value !== 'init')
export const isLoggedIn = computed(() => state.value === 'logged-in')

export const setAuthState = (newState: AuthState) => {
  state.value = newState
}
