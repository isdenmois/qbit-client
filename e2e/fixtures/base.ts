import { test as base, expect } from '@playwright/test'
import { applyDefaultMocks } from '../mocks/handlers'

export const test = base.extend({
  page: async ({ page }, use) => {
    await applyDefaultMocks(page)
    await use(page)
  },
})

export { expect }
