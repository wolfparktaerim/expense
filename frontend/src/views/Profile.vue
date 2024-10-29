<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <Navigation />
      
      <!-- Loading State -->
      <div class="mx-auto px-4 py-8 max-w-7xl">
        <div v-if="loading" class="flex flex-col items-center justify-center h-64 space-y-4">
          <PulseLoader :color="loadingColor"></PulseLoader>
          <p class="text-purple-600 animate-pulse">Loading your profile...</p>
        </div>
  
        <!-- Error State with Retry -->
        <div v-else-if="error" class="text-center p-4 mt-4">
          <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r relative animate-shake" role="alert">
            <div class="flex items-center">
              <AlertCircle class="w-5 h-5 mr-2" />
              <strong class="font-bold">Error!</strong>
              <span class="block sm:inline ml-2">{{ error }}</span>
            </div>
            <button 
              @click="fetchUserData" 
              class="mt-3 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <RefreshCw class="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
  
        <!-- Profile Content -->
        <div v-else class="max-w-2xl mx-auto space-y-6">
          <!-- Profile Header Card -->
          <div 
            class="bg-white rounded-xl shadow-lg p-6"
            :class="{ 'animate-bounce-small': isHeaderAnimating }"
            @mouseenter="startHeaderAnimation"
          >
            <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <!-- Interactive Profile Avatar -->
              <div
                class="relative group"
                @click="toggleAvatarAnimation"
              >
                <div
                  class="w-24 h-24 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center transform transition-all duration-300 cursor-pointer group-hover:rotate-12"
                  :class="{ 'animate-pulse': isAvatarAnimating }"
                >
                  <span v-if="user?.email" class="text-3xl font-bold text-white">
                    {{ getUserInitials }}
                  </span>
                </div>
       
              </div>
  
              <!-- User Info with Tooltip -->
              <div class="flex-1 text-center sm:text-left relative group">
                <h1 class="text-2xl text-left font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-1">
                  {{ user?.email?.split("@")[0] || "User" }}
                </h1>
                <p class="text-gray-600 break-all group-hover:text-purple-600 transition-colors duration-300">
                  {{ user?.email }}
                </p>
              </div>
  
              <!-- Logout Button with Icon -->
              <button
                @click="confirmLogout"
                class="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <LogOut class="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
  
          <!-- Statistics Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Saved Recipes Card with Counter Animation -->
            <div 
              class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300 cursor-pointer relative group"
              @click="navigateToSaved"
            >
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-800 flex items-center">
                  <BookmarkPlus class="w-5 h-5 mr-2 text-purple-600" />
                  Saved Recipes
                </h2>
                <Heart 
                  class="w-6 h-6 text-pink-500 transform transition-transform duration-300 group-hover:scale-125 group-hover:text-pink-600"
                  :class="{ 'animate-bounce': isRecipesAnimating }"
                />
              </div>
              <p class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {{ displayedCount }}
              </p>
              <p class="text-purple-600 group-hover:text-purple-700 text-sm mt-2 flex items-center">
                View all saved recipes 
                <ChevronRight class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" />
              </p>
              <div class="absolute inset-0 bg-purple-600 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
            </div>
  
            <!-- Account Info Card -->
            <div class="bg-white rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-all duration-300 relative group">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-800 flex items-center">
                  <ClipboardList class="w-5 h-5 mr-2 text-purple-600" />
                  Account Info
                </h2>
                <UserCircle 
                  class="w-6 h-6 text-purple-600 transform transition-all duration-300 group-hover:rotate-12"
                />
              </div>
              <div class="space-y-3">
                <p class="text-sm text-gray-600 flex items-center group-hover:text-purple-600 transition-colors duration-300">
                  <Calendar class="w-4 h-4 mr-2" />
                  <span class="font-medium">Member since:</span>
                  <span class="ml-2">{{ memberSince }}</span>
                </p>
                <p class="text-sm text-gray-600 flex items-center group-hover:text-purple-600 transition-colors duration-300">
                  <Clock class="w-4 h-4 mr-2" />
                  <span class="font-medium">Last login:</span>
                  <span class="ml-2">{{ lastLogin }}</span>
                </p>
              </div>
              <div class="absolute inset-0 bg-purple-600 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300"></div>
            </div>
          </div>
  
          <!-- Delete Account Section -->
          <div class="bg-white rounded-xl shadow-lg p-6 relative group">
            <div class="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
            <div class="relative"> 
                <div class="flex items-center mb-4">
                    <AlertTriangle class="w-5 h-5 text-red-500 mr-2" />
                    <h2 class="text-lg font-semibold text-gray-800">Danger Zone</h2>
                </div>
                <p class="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">Once you delete your account, there is no going back. Please be certain.</p>
                <button @click="showDeleteConfirm = true" class="text-red-500 hover:text-red-600 font-medium hover:underline transition-all duration-300 flex items-center">
                    <Trash2 class="w-4 h-4 mr-2" />Delete Account</button>
                </div>
            </div>
        </div>
  
        <!-- Delete Account Confirmation Modal -->
        <TransitionRoot appear :show="showDeleteConfirm" as="template">
          <Dialog as="div" @close="showDeleteConfirm = false" class="relative z-50">
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
                  <DialogPanel class="bg-white p-6 rounded-xl shadow-xl max-w-md mx-4 transform transition-all">
                    <DialogTitle class="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                      <AlertTriangle class="w-5 h-5 text-red-500 mr-2" />
                      Delete Account?
                    </DialogTitle>
                    <p class="text-gray-600 mb-6">
                      Are you sure you want to delete your account? This action cannot be undone.
                    </p>
                    <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                      <button
                        @click="showDeleteConfirm = false"
                        class="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-300 flex items-center justify-center"
                      >
                        <X class="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                      <button
                        @click="handleDeleteAccount"
                        class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
                      >
                        <Trash2 class="w-4 h-4 mr-2" />
                        Delete Account
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>
  
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
                      Confirm Logout
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
                        Logout
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>
      </div>
    </div>
  </template>

<script>
import { getAuth, signOut } from "firebase/auth";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import Navigation from "../components/Navigation.vue";
import { useFavoritesStore } from "../stores/favorites";
import { mapState, mapActions } from "pinia";
import { 
  UserCircle, 
  LogOut, 
  Heart, 
  Camera, 
  AlertCircle,
  AlertTriangle,
  BookmarkPlus,
  Calendar,
  Clock,
  ChevronRight,
  ClipboardList,
  RefreshCw,
  Trash2,
  X
} from 'lucide-vue-next';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';

export default {
  name: "ProfilePage",

  components: {
    PulseLoader,
    Navigation,
    UserCircle,
    LogOut,
    Heart,
    Camera,
    AlertCircle,
    AlertTriangle,
    BookmarkPlus,
    Calendar,
    Clock,
    ChevronRight,
    ClipboardList,
    RefreshCw,
    Trash2,
    X,
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild
  },

  data() {
    return {
      loading: false,
      error: null,
      loadingColor: "#7C3AED",
      showDeleteConfirm: false,
      showLogoutConfirm: false,
      user: null,
      lastLogin: null,
      memberSince: null,
      isAvatarAnimating: false,
      isHeaderAnimating: false,
      isRecipesAnimating: false,
      displayedCount: 0,
      countInterval: null,
      tooltipVisible: false,
    };
  },

  computed: {
    ...mapState(useFavoritesStore, ["favorites"]),

    savedRecipesCount() {
      return this.favorites?.length || 0;
    },

    getUserInitials() {
      if (!this.user?.email) return "";
      const email = this.user.email.split("@")[0];
      return email.substring(0, 2).toUpperCase();
    },
  },

  watch: {
    savedRecipesCount: {
      immediate: true,
      handler(newVal) {
        this.animateCounter(newVal);
      }
    }
  },

  methods: {
    ...mapActions(useFavoritesStore, ["loadFavorites"]),

    async fetchUserData() {
      try {
        this.loading = true;
        this.error = null;
        const auth = getAuth();
        this.user = auth.currentUser;

        if (this.user) {
          const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          };
          
          this.memberSince = new Date(this.user.metadata.creationTime)
            .toLocaleDateString(undefined, options);
          this.lastLogin = new Date(this.user.metadata.lastSignInTime)
            .toLocaleDateString(undefined, options);

          await this.loadFavorites();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        this.error = "Failed to load user data. Please try again later.";
      } finally {
        this.loading = false;
      }
    },

    confirmLogout() {
      this.showLogoutConfirm = true;
    },

    async handleLogout() {
      try {
        const auth = getAuth();
        await signOut(auth);
        this.$router.push("/");
      } catch (error) {
        console.error("Error signing out:", error);
        this.error = "Failed to sign out. Please try again.";
      } finally {
        this.showLogoutConfirm = false;
      }
    },

    async handleDeleteAccount() {
      try {
        const auth = getAuth();
        await auth.currentUser.delete();
        this.$router.push("/");
      } catch (error) {
        console.error("Error deleting account:", error);
        this.error = "Failed to delete account. Please try again.";
      } finally {
        this.showDeleteConfirm = false;
      }
    },
    // async handleDeleteAccount() {
    //     try {
    //         const auth = getAuth();
    //         const user = auth.currentUser;
                
    //         await user.delete();
    //         await signOut(auth); // Ensure proper cleanup
    //         this.$router.push("/");
    //     } catch (error) {
    //         console.error("Error deleting account:", error);
    //         if (error.code === 'auth/requires-recent-login') {
    //         this.error = "Please log out and log back in before deleting your account.";
    //         } else {
    //         this.error = "Failed to delete account. Please try again.";
    //         }
    //     } finally {
    //         this.showDeleteConfirm = false;
    //     }
    //     },

    toggleAvatarAnimation() {
      this.isAvatarAnimating = true;
      setTimeout(() => {
        this.isAvatarAnimating = false;
      }, 1000);
    },

    startHeaderAnimation() {
      if (!this.isHeaderAnimating) {
        this.isHeaderAnimating = true;
        setTimeout(() => {
          this.isHeaderAnimating = false;
        }, 1000);
      }
    },

    navigateToSaved() {
      this.isRecipesAnimating = true;
      setTimeout(() => {
        this.isRecipesAnimating = false;
        this.$router.push("/saved");
      }, 800);
    },

    animateCounter(target) {
      if (this.countInterval) {
        clearInterval(this.countInterval);
      }

      const duration = 1000; // Animation duration in milliseconds
      const start = this.displayedCount;
      const difference = target - start;
      const steps = 60; // Number of steps in the animation
      const stepValue = difference / steps;
      let currentStep = 0;

      this.countInterval = setInterval(() => {
        currentStep++;
        this.displayedCount = Math.round(start + (stepValue * currentStep));

        if (currentStep >= steps) {
          this.displayedCount = target;
          clearInterval(this.countInterval);
        }
      }, duration / steps);
    },

    showTooltip() {
      this.tooltipVisible = true;
    },

    hideTooltip() {
      this.tooltipVisible = false;
    }
  },

  async created() {
    await this.fetchUserData();
  },

  beforeUnmount() {
    this.showDeleteConfirm = false;
    this.showLogoutConfirm = false;
    if (this.countInterval) {
      clearInterval(this.countInterval);
    }
  },
};
</script>
<style scoped>
.animate-bounce-small {
  animation: bounce-small 0.5s;
}

.animate-shake {
  animation: shake 0.5s;
}

@keyframes bounce-small {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}
</style>