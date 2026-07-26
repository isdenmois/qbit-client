import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/shared/api'
import { useLoginFormStore } from './login-form.store'

describe('login-form store', () => {
  let store: ReturnType<typeof useLoginFormStore>

  beforeEach(() => {
    vi.spyOn(api.auth, 'login').mockResolvedValue(true).mockClear()
    store = useLoginFormStore()
  })

  it('has empty credentials and is not submitting initially', () => {
    expect(store.username.value).toBe('')
    expect(store.password.value).toBe('')
    expect(store.submitting.value).toBe(false)
    expect(store.hasError.value).toBe(false)
    expect(store.errorClass.value).toEqual({ error: false })
    expect(store.submitDisabled.value).toBe(true)
  })

  it('disables submit when username is missing', () => {
    // act
    store.username.value = 'user'

    // assert
    expect(store.submitDisabled.value).toBe(true)
  })

  it('disables submit when password is missing', () => {
    // act
    store.password.value = 'pass'

    // assert
    expect(store.submitDisabled.value).toBe(true)
  })

  it('enables submit when both credentials are present', () => {
    // act
    store.username.value = 'user'
    store.password.value = 'pass'

    // assert
    expect(store.submitDisabled.value).toBe(false)
  })

  it('reflects error state in the error class', () => {
    // act
    store.hasError.value = true

    // assert
    expect(store.errorClass.value).toEqual({ error: true })
  })

  it('logs in and stops submitting', async () => {
    // arrange
    store.username.value = 'user'
    store.password.value = 'pass'

    // act
    await store.submit()

    // assert
    expect(api.auth.login).toHaveBeenCalledWith('user', 'pass')
    expect(store.submitting.value).toBe(false)
    expect(store.hasError.value).toBe(false)
  })

  it('sets an error and stops submitting when login fails', async () => {
    // arrange
    vi.spyOn(api.auth, 'login').mockRejectedValue(new Error('auth failed'))
    store.username.value = 'user'
    store.password.value = 'pass'

    // act
    await store.submit()

    // assert
    expect(api.auth.login).toHaveBeenCalledWith('user', 'pass')
    expect(store.hasError.value).toBe(true)
    expect(store.submitting.value).toBe(false)
  })

  it('does not call login when credentials are empty', async () => {
    // act
    await store.submit()

    // assert
    expect(api.auth.login).not.toHaveBeenCalled()
    expect(store.hasError.value).toBe(false)
    expect(store.submitting.value).toBe(false)
  })
})
