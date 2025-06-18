<!-- Navigation.vue -->
<template>
  <LoginModal @close="showLogin = false" v-if="showLogin" />
  <header :class="[
    'sticky top-0 w-full z-20 transition-all duration-300 border-b',
    isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-gray-200' : 'bg-white border-transparent'
  ]">
    <nav class="container mx-auto px-4 py-3 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center">
        <RouterLink to="/"
          class="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors duration-300 font-sans flex items-center select-none">
          Muneh Thracker
        </RouterLink>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-6">
        <!-- Track button - available for all -->
        <RouterLink to="/track"
          class="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-green-50 select-none"
          :class="{ 'bg-green-50 text-green-600 font-medium': $route.path === '/track' }">
          <ListPlus class="w-5 h-5" />
          <span>Track</span>
        </RouterLink>

        <!-- Logged out navigation -->
        <template v-if="!isAuthenticated">
          <button @click="login"
            class="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 transform active:scale-95 font-medium flex items-center select-none">
            <User class="w-4 h-4 mr-2" />
            Log In
          </button>
        </template>

        <!-- Logged in navigation -->
        <template v-else>
          <RouterLink to="/dashboard"
            class="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-green-50 select-none"
            :class="{ 'bg-green-50 text-green-600 font-medium': $route.path === '/dashboard' }">
            <Presentation class="w-5 h-5" />
            <span>Dashboard</span>
          </RouterLink>

          <RouterLink to="/table"
            class="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-green-50 select-none"
            :class="{ 'bg-green-50 text-green-600 font-medium': $route.path === '/table' }">
            <CircleDollarSign class="w-5 h-5" />
            <span>Transactions</span>
          </RouterLink>

          <RouterLink to="/report"
            class="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-green-50 select-none"
            :class="{ 'bg-green-50 text-green-600 font-medium': $route.path === '/report' }">
            <ClipboardMinus class="w-5 h-5" />
            <span>Reports</span>
          </RouterLink>

          <!-- Profile Dropdown -->
          <div class="relative" v-click-outside="closeProfileMenu">
            <button @click="toggleProfileMenu"
              class="flex items-center space-x-1 text-gray-600 hover:text-green-600 focus:outline-none py-1 px-2 rounded-lg select-none"
              :class="{ 'bg-green-50': profileMenuOpen }">
              <div
                class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold select-none">
                {{ userInitial }}
              </div>
              <ChevronDown :class="['w-4 h-4 transition-transform duration-200', { 'rotate-180': profileMenuOpen }]" />
            </button>

            <!-- Profile Dropdown Menu -->
            <div v-if="profileMenuOpen"
              class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
              <div class="px-4 py-2 border-b border-gray-100 mb-1">
                <p class="text-sm font-medium text-gray-900">{{ userEmail }}</p>
                <p class="text-xs text-gray-500 select-none">Logged in</p>
              </div>

              <RouterLink to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center select-none">
                <User class="w-4 h-4 mr-2 text-gray-400 " />
                Your Profile
              </RouterLink>

              <button @click="confirmLogout"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center select-none">
                <LogOut class="w-4 h-4 mr-2 text-gray-400" />
                Log Out
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Mobile Navigation Toggle -->
      <div class="md:hidden">
        <button @click="toggleMobileMenu"
          class="p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-green-50 focus:outline-none transition-colors duration-200"
          aria-label="Toggle mobile menu">
          <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>
    </nav>

    <!-- Mobile Navigation Menu -->
    <transition enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in" leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0">
      <div v-if="mobileMenuOpen" class="md:hidden bg-white px-4 py-3 shadow-lg border-t border-gray-100">
        <RouterLink to="/track"
          class="flex items-center space-x-2 py-3 px-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-all duration-200 select-none"
          :class="{ 'bg-green-50 text-green-600 font-medium': $route.path === '/track' }"
          @click="mobileMenuOpen = false">
          <ListPlus class="w-5 h-5" />
          <span>Track</span>
        </RouterLink>

        <!-- Logged out mobile navigation -->
        <template v-if="!isAuthenticated">
          <button @click="login"
            class="w-full mt-3 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center font-medium select-none">
            <User class="w-5 h-5 mr-2" />
            Log In
          </button>
        </template>

        <!-- Logged in mobile navigation -->
        <template v-else>
          <RouterLink to="/dashboard"
            class="flex items-center space-x-2 py-3 px-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-all duration-200 select-none"
            :class="{ 'bg-green-50 text-green-600 font-medium': $route.path === '/dashboard' }"
            @click="mobileMenuOpen = false">
            <Presentation class="w-5 h-5" />
            <span>Dashboard</span>
          </RouterLink>

          <RouterLink to="/table"
            class="flex items-center space-x-2 py-3 px-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-all duration-200 select-none"
            :class="{ 'bg-green-50 text-green-600 font-medium': $route.path === '/table' }"
            @click="mobileMenuOpen = false">
            <CircleDollarSign class="w-5 h-5" />
            <span>Transactions</span>
          </RouterLink>

          <RouterLink to="/report"
            class="flex items-center space-x-2 py-3 px-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-all duration-200 select-none"
            :class="{ 'bg-green-50 text-green-600 font-medium': $route.path === '/report' }"
            @click="mobileMenuOpen = false">
            <ClipboardMinus class="w-5 h-5" />
            <span>Reports</span>
          </RouterLink>

          <RouterLink to="/profile"
            class="flex items-center space-x-2 py-3 px-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-all duration-200 select-none"
            :class="{ 'bg-green-50 text-green-600 font-medium': $route.path === '/profile' }"
            @click="mobileMenuOpen = false">
            <User class="w-5 h-5" />
            <span>Profile</span>
          </RouterLink>

          <div class="border-t border-gray-100 my-2"></div>

          <div class="px-2 py-2">
            <p class="text-sm text-gray-500 select-none">Signed in as</p>
            <p class="text-sm font-medium text-gray-900">{{ userEmail }}</p>
          </div>

          <button @click="confirmLogout"
            class="w-full mt-3 flex items-center px-2 py-3 text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 font-medium select-none">
            <LogOut class="w-5 h-5 mr-2" />
            Log Out
          </button>
        </template>
      </div>
    </transition>
  </header>

  <!-- Logout Confirmation Modal -->
  <TransitionRoot appear :show="showLogoutConfirm" as="template">
    <Dialog as="div" @close="showLogoutConfirm = false" class="relative z-50">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl max-w-md mx-4 border border-white/50">
              <div class="text-center space-y-6">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <LogOut class="w-8 h-8 text-green-600" />
                </div>

                <div class="space-y-3">
                  <DialogTitle class="text-2xl font-bold text-slate-800 select-none">
                    Confirm Log Out
                  </DialogTitle>
                  <p class="text-slate-600 leading-relaxed select-none">
                    Are you sure you want to log out of your account? You'll need to sign in again to access your
                    profile.
                  </p>
                </div>

                <div class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <button @click="showLogoutConfirm = false"
                    class="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 border border-slate-200 select-none">
                    <X class="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button @click="handleLogout"
                    class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl select-none">
                    <LogOut class="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { Search, Globe, Bookmark, User, ChevronDown, Menu, X, LogOut, Gamepad2, Info, ClipboardMinus, ListPlus, Presentation, CircleDollarSign } from 'lucide-vue-next'
import LoginModal from './LoginModal.vue'
import { getAuth, signOut } from 'firebase/auth'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useToast } from 'vue-toastification'

// Auth store
const authStore = useAuthStore()
const { isAuthenticated, user } = storeToRefs(authStore)
const router = useRouter()
const route = useRoute()
const toast = useToast()

// State
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)
const showLogin = ref(false)
const profileMenuOpen = ref(false)
const showLogoutConfirm = ref(false)

// Computed properties for user information
const userEmail = computed(() => {
  return user.value?.email || 'User'
})

const userInitial = computed(() => {
  if (!user.value?.email) return 'U'
  return user.value.email.charAt(0).toUpperCase()
})

// Methods
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value
}

const closeProfileMenu = () => {
  profileMenuOpen.value = false
}

const login = () => {
  showLogin.value = true
  mobileMenuOpen.value = false
}

const confirmLogout = () => {
  showLogoutConfirm.value = true
  profileMenuOpen.value = false
  mobileMenuOpen.value = false
}

const handleLogout = async () => {
  try {
    const auth = getAuth()
    await signOut(auth)
    router.push('/')
    toast.success('Logged out successfully', {
      closeButton: false,
      hideProgressBar: true,
      timeout: 2000
    })
  } catch (error) {
    console.error('Error signing out:', error)
    toast.error('Failed to log out. Please try again', {
      closeButton: false,
      hideProgressBar: true,
      timeout: 2000
    })
  } finally {
    showLogoutConfirm.value = false
  }
}

// Scroll handler
const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Close mobile menu when route changes
router.afterEach(() => {
  mobileMenuOpen.value = false
})

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Check scroll position on mount
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.router-link-active {
  font-weight: 500;
}
</style>