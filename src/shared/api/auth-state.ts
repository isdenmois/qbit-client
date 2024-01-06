import { atom, computed } from 'nanostores'

type AuthState = 'init' | 'logged-in' | 'logged-out'

const state = atom<AuthState>('init')
export const initialized = computed(state, (state) => state !== 'init')
export const isLoggedIn = computed(state, (state) => state === 'logged-in')

export const setAuthState = (newState: AuthState) => state.set(newState)
