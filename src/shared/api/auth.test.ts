import { describe, it, expect, vi, beforeEach } from 'vitest'
import { auth } from './auth'
import { setAuthState, initialized, isLoggedIn } from './auth-state'
import { app } from './app'

vi.mock('./app', () => ({
  app: {
    version: vi.fn().mockResolvedValue(true),
  },
}))

describe('auth module', () => {
  const http = {
    ok: true,
    text: vi.fn(),
  }

  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue(http as unknown as Response)
    setAuthState('init')
  })

  it('should login successfully', async () => {
    // arrange
    http.text.mockResolvedValueOnce('Ok.')

    // act
    await auth.login('testuser', 'testpassword')

    // assert
    expect(fetch).toHaveBeenCalledWith('/api/v2/auth/login', expect.anything())
    expect(initialized.get()).toBeTruthy()
    expect(isLoggedIn.get()).toBeTruthy()
  })

  it('should throw an error on failed login', async () => {
    // arrange
    http.text.mockResolvedValueOnce('Error.')

    // act
    const result = auth.login('testuser', 'testpassword')

    // assert
    await expect(result).rejects.toThrow('Auth failed')
    expect(fetch).toHaveBeenCalledWith('/api/v2/auth/login', expect.anything())
    expect(initialized.get()).toBeFalsy()
    expect(isLoggedIn.get()).toBeFalsy()
  })

  it('should logout successfully', async () => {
    // arrange
    setAuthState('logged-in')

    // act
    await auth.logout()

    // assert
    expect(fetch).toHaveBeenCalledWith('/api/v2/auth/logout', expect.anything())
    expect(isLoggedIn.get()).toBeFalsy()
  })

  it('should set auth state to "logged-in" if response is truthy', async () => {
    // arrange
    vi.mocked(app.version).mockResolvedValue('1.0.0')

    // act
    await auth.init()

    // assert
    expect(isLoggedIn.get()).toBeTruthy()
    expect(initialized.get()).toBeTruthy()
  })

  it('should set auth state to "logged-out" if response is falsy', async () => {
    // arrange
    vi.mocked(app.version).mockResolvedValue('')

    // act
    await auth.init()

    // assert
    expect(isLoggedIn.get()).toBeFalsy()
    expect(initialized.get()).toBeTruthy()
  })
})
