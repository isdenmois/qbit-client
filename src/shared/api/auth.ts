import { http } from './client'
import { setAuthState, initialized, isLoggedIn } from './auth-state'
import { app } from './app'

const login = async (username: string, password: string) => {
  const response = await http.url('/auth/login').formData({ username, password }).post().text()

  if (response === 'Ok.') {
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
