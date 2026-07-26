import { createApp } from 'vue'
import App from './app.vue'
import { setMobile } from './model'
import { router } from './router'

setMobile()

createApp(App).use(router).mount('#app')
