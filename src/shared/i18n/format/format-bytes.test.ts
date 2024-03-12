import { expect, describe, it } from 'vitest'
import { formatBytes } from './format-bytes'

describe('formatBytes', () => {
  it('en', () => {
    expect(formatBytes(0, 'en')).toBe('0 B')
    expect(formatBytes(1, 'en')).toBe('1 B')
    expect(formatBytes(10, 'en')).toBe('10 B')

    expect(formatBytes(1000, 'en')).toBe('1000 B')
    expect(formatBytes(1023, 'en')).toBe('1023 B')
    expect(formatBytes(1024, 'en')).toBe('1 KB')
    expect(formatBytes(10000, 'en')).toBe('9,77 KB')
    expect(formatBytes(10240, 'en')).toBe('10 KB')

    expect(formatBytes(1_000_000, 'en')).toBe('977 KB')
    expect(formatBytes(1_048_575, 'en')).toBe('1 024 KB')
    expect(formatBytes(1_048_576, 'en')).toBe('1 MB')
    expect(formatBytes(10_000_000, 'en')).toBe('9,54 MB')

    expect(formatBytes(1_000_000_000, 'en')).toBe('954 MB')
    expect(formatBytes(1_073_741_823, 'en')).toBe('1 024 MB')
    expect(formatBytes(1_073_741_824, 'en')).toBe('1 GB')
    expect(formatBytes(10_000_000_000, 'en')).toBe('9,31 GB')

    expect(formatBytes(1_000_000_000_000, 'en')).toBe('931 GB')
    expect(formatBytes(1_099_511_627_775, 'en')).toBe('1 024 GB')
    expect(formatBytes(1_099_511_627_776, 'en')).toBe('1 TB')
    expect(formatBytes(10_000_000_000_000, 'en')).toBe('9,09 TB')

    expect(formatBytes(1_000_000_000_000_000, 'en')).toBe('909 TB')
  })

  it('ru', () => {
    expect(formatBytes(0, 'ru')).toBe('0 Б')
    expect(formatBytes(1, 'ru')).toBe('1 Б')
    expect(formatBytes(10, 'ru')).toBe('10 Б')

    expect(formatBytes(1000, 'ru')).toBe('1000 Б')
    expect(formatBytes(1023, 'ru')).toBe('1023 Б')
    expect(formatBytes(1024, 'ru')).toBe('1 Кб')
    expect(formatBytes(10000, 'ru')).toBe('9,77 Кб')
    expect(formatBytes(10240, 'ru')).toBe('10 Кб')

    expect(formatBytes(1_000_000, 'ru')).toBe('977 Кб')
    expect(formatBytes(1_048_575, 'ru')).toBe('1 024 Кб')
    expect(formatBytes(1_048_576, 'ru')).toBe('1 Мб')
    expect(formatBytes(10_000_000, 'ru')).toBe('9,54 Мб')

    expect(formatBytes(1_000_000_000, 'ru')).toBe('954 Мб')
    expect(formatBytes(1_073_741_823, 'ru')).toBe('1 024 Мб')
    expect(formatBytes(1_073_741_824, 'ru')).toBe('1 Гб')
    expect(formatBytes(10_000_000_000, 'ru')).toBe('9,31 Гб')

    expect(formatBytes(1_000_000_000_000, 'ru')).toBe('931 Гб')
    expect(formatBytes(1_099_511_627_775, 'ru')).toBe('1 024 Гб')
    expect(formatBytes(1_099_511_627_776, 'ru')).toBe('1 Тб')
    expect(formatBytes(10_000_000_000_000, 'ru')).toBe('9,09 Тб')

    expect(formatBytes(1_000_000_000_000_000, 'ru')).toBe('909 Тб')
  })
})
