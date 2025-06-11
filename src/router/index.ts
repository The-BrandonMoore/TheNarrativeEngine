import { createRouter, createWebHistory } from 'vue-router'
import HomeScreen from '../views/HomeScreen.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeScreen,
    },
    {
      path: '/game',
      name: 'gameplay',
      component: () => import('../views/GamePlayScreen.vue'), // Lazy loading the GamePlayScreen component
    },
    {
      path: '/character-selection',
      name: 'character-selection',
      component: () => import('../views/CharacterSelectionScreen.vue'), // Lazy loading the SelectionScreen component
    },
    {
      path: '/gameover',
      name: 'gameover',
      component: () => import('../views/GameOverScreen.vue'),
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
