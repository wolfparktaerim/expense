import { createWebHistory, createRouter } from 'vue-router'
import Home from '../views/Home.vue'
import Search from '../views/Search.vue'
import Recipe from '../views/Recipe.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/search', component: Search },
  { path: '/recipe/:id', component: Recipe },

]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  })

export default router