import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'
import Search from '../views/Search.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/search', component: Search },

]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  })

export default router