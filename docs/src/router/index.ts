import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/generator',
      name: 'generator',
      component: () => import('../views/GeneratorView.vue')
    }
  ]
})

export default router
