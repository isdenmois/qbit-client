import { expect, test } from 'vitest'
import { formatBytes } from './format-bytes'

test('formatBytes', () => {
  expect(formatBytes(0)).toBe('0 B')
  expect(formatBytes(1)).toBe('1 B')
  expect(formatBytes(10)).toBe('10 B')

  expect(formatBytes(1000)).toBe('1000 B')
  expect(formatBytes(1023)).toBe('1023 B')
  expect(formatBytes(1024)).toBe('1 KB')
  expect(formatBytes(10000)).toBe('9,77 KB')
  expect(formatBytes(10240)).toBe('10 KB')

  expect(formatBytes(1_000_000)).toBe('977 KB')
  expect(formatBytes(1_048_575)).toBe('1 024 KB')
  expect(formatBytes(1_048_576)).toBe('1 MB')
  expect(formatBytes(10_000_000)).toBe('9,54 MB')

  expect(formatBytes(1_000_000_000)).toBe('954 MB')
  expect(formatBytes(1_073_741_823)).toBe('1 024 MB')
  expect(formatBytes(1_073_741_824)).toBe('1 GB')
  expect(formatBytes(10_000_000_000)).toBe('9,31 GB')

  expect(formatBytes(1_000_000_000_000)).toBe('931 GB')
  expect(formatBytes(1_099_511_627_775)).toBe('1 024 GB')
  expect(formatBytes(1_099_511_627_776)).toBe('1 TB')
  expect(formatBytes(10_000_000_000_000)).toBe('9,09 TB')

  expect(formatBytes(1_000_000_000_000_000)).toBe('909 TB')
})
