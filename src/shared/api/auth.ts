import { app } from './app'
import { initialized, isLoggedIn, setAuthState } from './auth-state'
import { http } from './client'

const login = async (username: string, password: string) => {
  const res = await http.url('/auth/login').formData({ username, password }).post().res()

  if (res?.ok) {
    setAuthState('logged-in')
    return true
  }

  throw 'Auth failed'
}

const logout = () => {
  setAuthState('logged-out')

  return http.url('/auth/logout').post().res()
}

const init = async () => {
  const response = await app.version()

  setAuthState(response ? 'logged-in' : 'logged-out')
}

export const auth = {
  init,
  login,
  logout,
  initialized,
  isLoggedIn,
}
