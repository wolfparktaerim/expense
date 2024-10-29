// src/router/index.js
import { createWebHistory, createRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { useAuthStore } from '../stores/auth'
import Home from '../views/Home.vue'
import Search from '../views/Search.vue'
import Recipe from '../views/Recipe.vue'
import Globe from '../views/Globe.vue'
import FoodTrivia from '../views/FoodTrivia.vue'
import Saved from '../views/Saved.vue'
import Profile from '../views/Profile.vue'
import { watch } from 'vue'

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
  },
  {
    path: '/foodtrivia',
    component: FoodTrivia,
    meta : { requiresAuth: true }
  },
  {
    path: '/saved',
    component: Saved,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    component: Profile,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    document.getElementById('app').scrollIntoView({behavior:'smooth'});
  }
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      authStore.pendingRoute = to
      authStore.showLoginModal = true
      next()
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router