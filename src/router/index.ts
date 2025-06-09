import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/StartScreen.vue'
import StartScreen from '../views/StartScreen.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'start',
      component: StartScreen,
    },
    // We can add more routes later, like a /game path
    // {
    //   path: '/game',
    //   name: 'gameplay',
    //   component: () => import('../views/GamePlayScreen.vue') // Example for future lazy loading
    // }
  ],
})

export default router
