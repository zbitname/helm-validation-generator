import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Main page',
      component: () => import('../views/MainView.vue'),
    },
    {
      path: '/generator',
      name: 'Generator',
      component: () => import('../views/GeneratorView.vue'),
    },
    {
      path: '/examples',
      name: 'Examples',
      component: () => import('../views/examples/List.vue'),
    },
    {
      path: '/examples/ref',
      name: 'Example of control comment "ref"',
      component: () => import('../views/examples/ReferencesView.vue'),
    },
    {
      path: '/examples/skip',
      name: 'Example of control comment "skip"',
      component: () => import('../views/examples/SkipView.vue'),
    },
    {
      path: '/examples/optional',
      name: 'Example of control comment "optional"',
      component: () => import('../views/examples/OptionalView.vue'),
    },
    {
      path: '/examples/deprecated',
      name: 'Example of control comment "deprecated"',
      component: () => import('../views/examples/DeprecatedView.vue'),
    },
  ]
})

export default router
