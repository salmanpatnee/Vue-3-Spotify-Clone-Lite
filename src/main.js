import './assets/base.css'
import './assets/main.css'
import 'nprogress/nprogress.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VeeValidatePlugin from '@/includes/validation'
import i18n from './includes/i18n'
import { auth } from '@/includes/firebase'
import Icon from '@/directives/icon'
import { registerSW } from 'virtual:pwa-register'
import progressBar from './includes/progress-bar'

import App from './App.vue'
import router from './router'

registerSW({ immediate: true })

progressBar(router)

let app

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)

    app.use(createPinia())
    app.use(router)
    app.use(VeeValidatePlugin)
    app.use(i18n)
    app.directive('icon', Icon)
    app.mount('#app')
  }
})
