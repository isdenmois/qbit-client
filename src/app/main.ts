import 'uno.css'
import '@unocss/reset/eric-meyer.css'
import 'shared/ui'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app')!,
})

export default app
