import { createMemoryHistory, createRouter } from 'vue-router'

import Home from '../views/home.vue'


const routes = [
  { path: '/Home', component: Home },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

export default router