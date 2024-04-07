import 'uno.css'
import '@unocss/reset/eric-meyer.css'
// import '@fontsource/roboto'
// import '@fontsource/roboto/300.css'
import '@dannymichel/proxima-nova'
import 'shared/ui'
import App from './app.svelte'

const app = new App({
  target: document.getElementById('app')!,
})

export default app
