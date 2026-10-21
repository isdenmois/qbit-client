import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// vitest runs from the repo root
const publicDir = `${join(process.cwd(), 'public')}/`
const manifest = JSON.parse(readFileSync(`${publicDir}manifest.webmanifest`, 'utf8'))

const pngSignature = [0x89, 0x50, 0x4e, 0x47]

const expectPng = (src: string) => {
  const file = `${publicDir}${src.replace(/^\//, '')}`

  expect(existsSync(file)).toBe(true)
  expect([...readFileSync(file).subarray(0, 4)]).toEqual(pngSignature)
}

describe('web app manifest', () => {
  it('declares the app identity and standalone launch', () => {
    // assert
    expect(manifest.id).toBe('/')
    expect(manifest.name).toBe('qBit')
    expect(manifest.short_name).toBe('qBit')
    expect(manifest.start_url).toBe('/')
    expect(manifest.scope).toBe('/')
    expect(manifest.display).toBe('standalone')
    expect(manifest.display_override).toEqual(['standalone'])
    expect(manifest.orientation).toBe('any')
    expect(manifest.launch_handler).toEqual({ client_mode: 'navigate-existing' })
  })

  it('uses the app surface color for theme and splash', () => {
    // assert
    expect(manifest.theme_color).toBe('#191724')
    expect(manifest.background_color).toBe('#191724')
  })

  it('declares any-purpose and maskable icons that exist on disk', () => {
    // arrange
    const { icons } = manifest

    // act
    const purposes = icons.map((icon: { purpose: string }) => icon.purpose)
    const sizes = icons.map((icon: { sizes: string }) => icon.sizes)

    // assert
    expect(icons).toHaveLength(3)
    expect(purposes).toEqual(['any', 'any', 'maskable'])
    expect(sizes).toEqual(['192x192', '512x512', '512x512'])
    for (const icon of icons) expectPng(icon.src)
  })

  it('declares search and add shortcuts with 96x96 icons that exist on disk', () => {
    // arrange
    const { shortcuts } = manifest

    // act
    const urls = shortcuts.map((shortcut: { url: string }) => shortcut.url)
    const names = shortcuts.map((shortcut: { name: string }) => shortcut.name)

    // assert
    expect(shortcuts).toHaveLength(2)
    expect(urls).toEqual(['/search', '/add'])
    expect(names).toEqual(['Search', 'Add torrent'])
    for (const shortcut of shortcuts) {
      expect(shortcut.short_name).toBeTruthy()
      expect(shortcut.icons[0].sizes).toBe('96x96')
      expectPng(shortcut.icons[0].src)
    }
  })
})
