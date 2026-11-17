import { expect, test } from '../fixtures/base'
import { mockDeployedVersion } from '../mocks/version.mock'

test('reloads once when a newer build has been deployed', async ({ page }) => {
  // arrange
  const deployed = await mockDeployedVersion(page, 'newer-build')
  const loads: number[] = []
  page.on('load', () => loads.push(Date.now()))

  // act
  await page.goto('/')
  await expect.poll(() => loads.length).toBe(2)

  // assert
  await page.waitForTimeout(300)
  expect(loads).toHaveLength(2)
  expect(deployed.count).toBe(2)
})

test('does not reload when the running build is the latest', async ({ page, request }) => {
  // arrange
  const { version } = await (await request.get('/version.json')).json()
  const deployed = await mockDeployedVersion(page, version)
  let loads = 0
  page.on('load', () => loads++)

  // act
  await page.goto('/')
  await page.waitForTimeout(300)

  // assert
  expect(loads).toBe(1)
  expect(deployed.count).toBe(1)
})
