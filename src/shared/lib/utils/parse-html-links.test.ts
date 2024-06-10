import { expect, test } from 'vitest'
import { parseHtmlLinks } from './parse-html-links'

test('parseHtmlLinks', () => {
  expect(parseHtmlLinks('link: https://github.com/')).toBe(
    "link: <a target='_blank' rel='noopener noreferrer' href='https://github.com/'>https://github.com/</a>",
  )

  expect(parseHtmlLinks('https://rutracker.org/forum/viewtopic.php?t=6312925')).toBe(
    "<a target='_blank' rel='noopener noreferrer' href='https://rutracker.org/forum/viewtopic.php?t=6312925'>https://rutracker.org/forum/viewtopic.php?t=6312925</a>",
  )
})
