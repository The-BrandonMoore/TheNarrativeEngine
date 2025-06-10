import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { loadGameData } from './services/dataLoader'

const app = createApp(App)

loadGameData()
  .then(() => {
    app.use(createPinia())
    app.use(router)

    app.mount('#app')
  })
  .catch((err) => {
    console.error('Fatal Error: could not load game Data. App will not start.', err)
    document.body.innerHTML = '<h1>Error loading game data. Please try again later.</h1>'
  })
