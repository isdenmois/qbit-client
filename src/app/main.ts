import { createApp } from 'vue'
import App from './app.vue'
import { router } from './router'

const mobileQuery = matchMedia('(max-width: 639px)')
const setMobile = () => {
  document.body.id = mobileQuery.matches ? 'mobile' : ''
}

mobileQuery.addEventListener('change', setMobile)
setMobile()

createApp(App).use(router).mount('#app')
