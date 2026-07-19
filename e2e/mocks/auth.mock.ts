import type { Page } from '@playwright/test'
import { parseForm } from '../utils/parse-form'

export const mockLoggedIn = async (page: Page) => {
  await page.route('/api/v2/app/version', (route) => route.fulfill({ body: 'v5.0.0' }))
  await page.route('/api/v2/auth/login', (route) => route.fulfill({ body: 'Ok.' }))
  await page.route('/api/v2/auth/logout', (route) => route.fulfill({ body: 'Ok.' }))
}

export const mockLoggedOut = async (page: Page) => {
  await page.route('/api/v2/app/version', (route) => route.fulfill({ body: '' }))
  await page.route('/api/v2/auth/login', async (route) => {
    const { username, password } = await parseForm(route.request())
    const body = username === 'admin' && password === 'admin' ? 'Ok.' : 'Fails.'
    return route.fulfill({ body })
  })
  await page.route('/api/v2/auth/logout', (route) => route.fulfill({ body: 'Ok.' }))
}
