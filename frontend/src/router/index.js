// src/router/index.js
import { createWebHistory, createRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { useAuthStore } from '../stores/auth'
import Home from '../views/Home.vue'
import Search from '../views/Search.vue'
import Recipe from '../views/Recipe.vue'
import Globe from '../views/Globe.vue'

const routes = [
  { 
    path: '/', 
    component: Home,
    meta: { requiresAuth: false }
  },
  { 
    path: '/search', 
    component: Search,
    meta: { requiresAuth: true }
  },
  { 
    path: '/recipe/:id', 
    component: Recipe,
    meta: { requiresAuth: true }
  },
  { 
    path: '/discover', 
    component: Globe,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    document.getElementById('app').scrollIntoView({behavior:'smooth'});
  }
})

router.beforeEach((to, from, next) => {
  const auth = getAuth()
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !auth.currentUser) {
    authStore.showLoginModal = true
    authStore.pendingRoute = to
    next()
  } else {
    authStore.showLoginModal = false
    next()
  }
})

export default router