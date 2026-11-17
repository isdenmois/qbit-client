import type { Page } from '@playwright/test'

export interface DeployedVersionMock {
  count: number
}

export const mockDeployedVersion = async (page: Page, version: string) => {
  const state: DeployedVersionMock = { count: 0 }

  await page.route('/version.json', (route) => {
    state.count++
    return route.fulfill({ json: { version } })
  })

  return state
}
