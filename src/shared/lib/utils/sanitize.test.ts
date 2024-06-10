import { expect, test } from 'vitest'
import { sanitize } from './sanitize'

test('sanitize', () => {
  expect(sanitize('<script>alert("hello")</script>')).toBe('&lt;script&gt;alert(&quot;hello&quot;)&lt;/script&gt;')
  expect(sanitize('1 & 2')).toBe('1 &amp; 2')
})
