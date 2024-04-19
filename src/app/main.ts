import 'uno.css'
import '@unocss/reset/eric-meyer.css'
import '@dannymichel/proxima-nova'
import 'shared/ui'
import App from './app.svelte'

const app = new App({
  target: document.getElementById('app')!,
})

const mobileQuery = matchMedia('(max-width: 640px)')
const setMobile = () => {
  document.body.id = mobileQuery.matches ? 'mobile' : ''
}

mobileQuery.addEventListener('change', setMobile)

export default app
