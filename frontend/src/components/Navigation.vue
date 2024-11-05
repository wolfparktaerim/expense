<!-- Navigation.vue -->
<template>
  <LoginModal @close="showLogin = false" v-if="showLogin" />
  <header
    :class="[
      'sticky top-0 w-full z-20 transition-all duration-300 border-b border-gray-200',
      { 'bg-white/70 backdrop-blur-sm': isScrolled }
    ]"
  >
    <!-- Rest of the header content remains the same until the logout button -->
    <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center">
        <RouterLink 
          to="/" 
          class="text-2xl font-bold text-purple-600 hover:text-purple-700 transition-colors duration-300"
        >
          DishGenie
        </RouterLink>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-6">
        <!-- Search is available for both logged-in and logged-out users -->
        <RouterLink 
          to="/search"
          class="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold"
        >
          <Search class="w-4 h-4" />
          <span>Search</span>
        </RouterLink>

        <!-- Logged out navigation -->
        <template v-if="!isAuthenticated">
          <a 
            href="#HowItWorks"
            class="text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold"
          >
            How It Works
          </a>
          <button
            @click="login"
            class="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Log In
          </button>
        </template>

        <!-- Logged in navigation -->
        <template v-else>
          <RouterLink 
            to="/discover"
            class="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold">
          <Globe class="w-4 h-4" />
            <span>Discover</span>
          </RouterLink>
          <RouterLink 
            to="/saved"
            class="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold">
          <Bookmark class="w-4 h-4" />
            <span>Saved</span>
          </RouterLink>
          <RouterLink 
            to="/minigame"
            class="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-all duration-300 ease-in-out hover:font-bold">
            <Gamepad2 class="w-4 h-4"/>
            <span>Mini Game</span>
          </RouterLink>
          
          <!-- Profile Dropdown -->
          <div class="relative" v-click-outside="closeProfileMenu">
            <button
              @click="toggleProfileMenu"
              class="flex items-center space-x-1 text-gray-600 hover:text-purple-600 focus:outline-none"
            >
              <User class="w-6 h-6" />
              <ChevronDown 
                :class="['w-4 h-4 transition-transform duration-200', { 'rotate-180': profileMenuOpen }]"
              />
            </button>
          
            <!-- Profile Dropdown Menu -->
            <div
              v-if="profileMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
            >
              <RouterLink
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
              >
                Your Profile
              </RouterLink>
              <button
                @click="confirmLogout"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600"
              >
                Log Out
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Mobile Navigation Toggle -->
      <div class="md:hidden">
        <button
          @click="toggleMobileMenu"
          class="text-gray-600 hover:text-purple-600 focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>
    </nav>

    <!-- Mobile Navigation Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden bg-white px-4 py-2 shadow-md"
      >
        <RouterLink
          to="/search"
          class="flex items-center space-x-2 py-2 text-gray-600 hover:text-purple-600"
          @click="mobileMenuOpen = false"
        >
          <Search class="w-4 h-4" />
          <span>Search</span>
        </RouterLink>

        <!-- Logged out mobile navigation -->
        <template v-if="!isAuthenticated">
          <a
            href="#HowItWorks"
            class="block py-2 text-gray-600 hover:text-purple-600"
            @click="mobileMenuOpen = false"
          >
            How It Works
          </a>
          <button
            @click="login"
            class="w-full mt-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300"
          >
            Log In
          </button>
        </template>

        <!-- Logged in mobile navigation -->
        <template v-else>
          <RouterLink 
          to="/discover"
          class="flex items-center space-x-2 py-2 text-gray-600 hover:text-purple-600"
          @click="mobileMenuOpen = false"
          >
            <Globe class="w-4 h-4" />
            <span>Discover</span>
          </RouterLink>

          <RouterLink 
          to="/saved"
          class="flex items-center space-x-2 py-2 text-gray-600 hover:text-purple-600"
          @click="mobileMenuOpen = false"
          >
            <Bookmark class="w-4 h-4" />
            <span>Saved</span>
          </RouterLink>

          <RouterLink 
          to="/minigame"
          class="flex items-center space-x-2 py-2 text-gray-600 hover:text-purple-600"
          @click="mobileMenuOpen = false"
          >
            <Gamepad2 class="w-4 h-4" />
            <span>Mini Game</span>
          </RouterLink>

          <RouterLink
            v-for="(item, index) in loggedInMenuItems"
            :key="index"
            :to="item.path"
            class="block py-2 text-gray-600 hover:text-purple-600"
            @click="mobileMenuOpen = false"
          >
            {{ item.name }}
          </RouterLink>
          <button
            @click="confirmLogout"
            class="w-full mt-2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300"
          >
            Log Out
          </button>
        </template>
      </div>
    </transition>
  </header>

  <!-- Logout Confirmation Modal -->
  <TransitionRoot appear :show="showLogoutConfirm" as="template">
    <Dialog as="div" @close="showLogoutConfirm = false" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-50" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="bg-white p-6 rounded-xl shadow-xl max-w-md mx-4">
              <DialogTitle class="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <LogOut class="w-5 h-5 text-purple-600 mr-2" />
                Confirm Log Out
              </DialogTitle>
              <p class="text-gray-600 mb-6">
                Are you sure you want to log out of your account?
              </p>
              <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  @click="showLogoutConfirm = false"
                  class="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  <X class="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  @click="handleLogout"
                  class="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
                >
                  <LogOut class="w-4 h-4 mr-2" />
                  Log Out
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import { Search, Globe, Bookmark, User, ChevronDown, Menu, X, LogOut, Gamepad2 } from 'lucide-vue-next'
import LoginModal from './LoginModal.vue'
import { getAuth, signOut } from 'firebase/auth'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useToast } from 'vue-toastification'

// Auth store
const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)
const router = useRouter()
const toast = useToast()

// State
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)
const showLogin = ref(false)
const profileMenuOpen = ref(false)
const showLogoutConfirm = ref(false)

// Menu items for logged-in users
const loggedInMenuItems = [
  { name: 'Profile', path: '/profile' }
]

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

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>