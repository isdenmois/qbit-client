import transformerDirectives from '@unocss/transformer-directives'
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno({ preflight: false })],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      background: 'var(--background)',
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
      card: 'var(--card)',
      black: 'var(--black)',
      success: 'var(--success)',
      error: 'var(--error)',
      add: 'var(--add)',
      selected: 'var(--selected)',
    },
    boxShadow: {
      panel: '-8px 0px 16px -4px rgba(0, 0, 0, 0.1)',
    },
  },
})
