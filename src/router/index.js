import { createRouter, createWebHashHistory } from 'vue-router'

function lazyView(viewName) {
  return () => import(`@/views/${viewName}.vue`)
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: lazyView('main')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
