// src/router/index.js
import { createWebHistory, createRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { useAuthStore } from '../stores/auth'


import Home from '../views/Home.vue'
import Track from '../views/Track.vue'
import Dashboard from '../views/Dashboard.vue'
import Profile from '../views/Profile.vue'
import NotFoundView from '../views/NotFoundView.vue'
import Report from '../views/GenerateReport.vue'

const routes = [
  { 
    path: '/', 
    component: Home,
    meta: { requiresAuth: false }
  },
  { 
    path: '/track', 
    component: Track,
    meta: { requiresAuth: true }
  },
  { 
    path: '/dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/report',
    component: Report,
    meta: { requiresAuth: true }
  },
  {
    path: '/:catchAll(.*)',
    component: NotFoundView,
    meta: { requiresAuth: false }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    const element = document.getElementById('app');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Handle auth-required routes
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Coming from home page
      if (from.path === '/') {
        authStore.pendingRoute = to
        authStore.showLoginModal = true
        next()
      } else {
        // Coming from other pages
        authStore.showLoginModal = false
        next('/')
      }
    } else {
      // User is authenticated
      authStore.showLoginModal = false
      next()
    }
  } else {
    // Non-auth route
    authStore.showLoginModal = false
    authStore.pendingRoute = null
    next()
  }
})

export default router