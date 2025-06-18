<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl">
      </div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-3xl">
      </div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl">
      </div>
    </div>

    <Navigation />

    <div class="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div class="relative">
          <PulseLoader :color="loadingColor" class="mb-4"></PulseLoader>
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl"></div>
        </div>
        <div class="text-center space-y-2">
          <p class="text-xl font-semibold text-slate-700 animate-pulse select-none">Loading your profile...</p>
          <p class="text-sm text-slate-500 select-none">Please wait while we fetch your data</p>
        </div>
      </div>

      <!-- Error State with Retry -->
      <div v-else-if="error" class="flex items-center justify-center min-h-[60vh]">
        <div class="max-w-md w-full mx-4">
          <div class="bg-white/90 backdrop-blur-sm border border-red-200 rounded-2xl p-8 shadow-2xl animate-shake"
            role="alert">
            <div class="text-center space-y-4">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle class="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-800 mb-2 select-none">Oops! Something went wrong</h3>
                <p class="text-slate-600 text-sm ">{{ error }}</p>
              </div>
              <button @click="fetchUserData"
                class="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                <RefreshCw class="w-5 h-5 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Content -->
      <div v-else class="max-w-4xl mx-auto space-y-8">
        <!-- Profile Header Card -->
        <div
          class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 lg:p-10 transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]"
          :class="{ 'animate-bounce-small': isHeaderAnimating }" @mouseenter="startHeaderAnimation">
          <div class="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
            <!-- Interactive Profile Avatar -->
            <div class="relative group" @click="toggleAvatarAnimation">
              <div
                class="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300">
              </div>
              <div
                class="relative w-32 h-32 lg:w-28 lg:h-28 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center transform transition-all duration-300 cursor-pointer group-hover:rotate-12 shadow-xl"
                :class="{ 'animate-pulse': isAvatarAnimating }">
                <span v-if="user?.email" class="text-4xl lg:text-3xl font-bold text-white drop-shadow-lg select-none">
                  {{ getUserInitials }}
                </span>
              </div>
              <div
                class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>

            <!-- User Info -->
            <div class="flex-1 space-y-3">
              <div class="space-y-2">
                <h1
                  class="text-left text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 select-none">
                  Welcome back, {{ user?.email?.split("@")[0] || "User" }}!
                </h1>
                <p
                  class="text-slate-600 text-lg break-all group-hover:text-indigo-600 transition-colors duration-300 font-medium">
                  {{ user?.email }}
                </p>
              </div>
              <div class="flex flex-wrap justify-center lg:justify-start gap-3 mt-4">
                <span
                  class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm font-medium rounded-full select-none">
                  <div class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Active Account
                </span>
                <span
                  class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-medium rounded-full select-none">
                  <UserCircle class="w-4 h-4 mr-2" />
                  Verified User
                </span>
              </div>
            </div>

            <!-- Logout Button -->
            <div class="flex flex-col space-y-3">
              <button @click="confirmLogout"
                class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group select-none">
                <LogOut class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <!-- Recent Activity Card -->
          <div
            class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 transform hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden select-none"
            @click="navigateToTransactions">

            <!-- Background gradient overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl">
            </div>

            <div class="relative z-10">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <CircleDollarSign class="w-6 h-6 text-white" />
                  </div>
                  <h2 class="text-xl font-bold text-slate-800">Recent Activity</h2>
                </div>
                <ChevronRight
                  class="w-6 h-6 text-slate-400 group-hover:text-green-600 group-hover:translate-x-2 transition-all duration-300" />
              </div>

              <div class="space-y-4">
                <div
                  class="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl group-hover:bg-green-50/50 transition-colors duration-300">
                  <div class="flex items-center space-x-3">
                    <Wallet class="w-5 h-5 text-slate-500 group-hover:text-green-600 transition-colors duration-300" />
                    <span class="font-semibold text-slate-700">Last Activity</span>
                  </div>
                  <span class="text-slate-600 font-medium">{{ lastActivity }}</span>
                </div>

                <div
                  class="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl group-hover:bg-green-50/50 transition-colors duration-300">
                  <div class="flex items-center space-x-3">
                    <Coins class="w-5 h-5 text-slate-500 group-hover:text-green-600 transition-colors duration-300" />
                    <span class="font-semibold text-slate-700">Amount</span>
                  </div>
                  <span class="text-lg font-bold text-slate-800">{{ formattedCurrency(lastActivityAmt) }}</span>
                </div>

                <div
                  class="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl group-hover:bg-green-50/50 transition-colors duration-300">
                  <div class="flex items-center space-x-3">
                    <Calendar
                      class="w-5 h-5 text-slate-500 group-hover:text-green-600 transition-colors duration-300" />
                    <span class="font-semibold text-slate-700">Date</span>
                  </div>
                  <span class="text-slate-600 font-medium">{{ lastActivityDate }}</span>
                </div>
              </div>

              <div
                class="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-200/50">
                <p class="text-green-700 font-semibold text-center flex items-center justify-center space-x-2">
                  <span>View all transactions</span>
                  <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </p>
              </div>
            </div>
          </div>

          <!-- Account Info Card -->
          <div
            class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 transform hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 group relative overflow-hidden select-none">

            <!-- Background gradient overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl">
            </div>

            <div class="relative z-10 h-full flex flex-col">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ClipboardList class="w-6 h-6 text-white" />
                  </div>
                  <h2 class="text-xl font-bold text-slate-800">Account Information</h2>
                </div>
                <UserCircle
                  class="w-8 h-8 text-blue-500 transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
              </div>

              <div class="space-y-4">
                <div
                  class="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl group-hover:bg-blue-50/50 transition-colors duration-300">
                  <div class="flex items-center space-x-3">
                    <Calendar class="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-colors duration-300" />
                    <span class="font-semibold text-slate-700">Member Since</span>
                  </div>
                  <span class="text-slate-600 font-medium text-right">{{ memberSince }}</span>
                </div>

                <div
                  class="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl group-hover:bg-blue-50/50 transition-colors duration-300">
                  <div class="flex items-center space-x-3">
                    <Clock class="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-colors duration-300" />
                    <span class="font-semibold text-slate-700">Last Login</span>
                  </div>
                  <span class="text-slate-600 font-medium text-right">{{ lastLogin }}</span>
                </div>
              </div>
              <!-- This div will grow to fill available space -->
              <div class="flex-grow"></div>
              <div
                class="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl border border-blue-200/50">
                <p class=" text-blue-700 font-semibold text-center flex items-center justify-center space-x-2">
                  <Heart class="w-4 h-4" />
                  <span>Thank you for being with us!</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Delete Account Section -->
        <div
          class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-red-200/50 p-8 relative group overflow-hidden">
          <!-- Warning background -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl">
          </div>

          <div class="relative z-10">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div class="space-y-3">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <AlertTriangle class="w-6 h-6 text-white" />
                  </div>
                  <h2 class="text-xl font-bold text-slate-800 select-none">Danger Zone</h2>
                </div>
                <p
                  class="text-slate-600 group-hover:text-slate-700 transition-colors duration-300 max-w-md select-none">
                  Once you delete your account, there is no going back. Please be certain about this action.
                </p>
              </div>

              <div class="flex-shrink-0">
                <button @click="showDeleteConfirm = true"
                  class="inline-flex items-center space-x-2 px-6 py-3 text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 font-semibold border-2 border-red-500 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg select-none">
                  <Trash2 class="w-5 h-5" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Account Confirmation Modal -->
      <TransitionRoot appear :show="showDeleteConfirm" as="template">
        <Dialog as="div" @close="showDeleteConfirm = false" class="relative z-50">
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
                  class="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl max-w-md mx-4 transform transition-all border border-white/50">
                  <div class="text-center space-y-6">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <AlertTriangle class="w-8 h-8 text-red-500" />
                    </div>

                    <div class="space-y-3">
                      <DialogTitle class="text-2xl font-bold text-slate-80 select-none0">
                        Delete Account?
                      </DialogTitle>
                      <p class="text-slate-600 leading-relaxed select-none">
                        Are you absolutely sure you want to delete your account? This action cannot be undone and all
                        your data will be permanently lost.
                      </p>
                    </div>

                    <div class="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                      <button @click="showDeleteConfirm = false"
                        class="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 border border-slate-200">
                        <X class="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                      <button @click="handleDeleteAccount"
                        class="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl select-none">
                        <Trash2 class="w-4 h-4" />
                        <span>Delete Account</span>
                      </button>
                    </div>
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
                        Confirm Logout
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
                        <span>Logout</span>
                      </button>
                    </div>
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
import { userTransactions } from '../stores/transactions.js';
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import Navigation from "../components/Navigation.vue";
import { mapState, mapActions } from "pinia";
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import {
  UserCircle,
  LogOut,
  Heart,
  AlertCircle,
  AlertTriangle,
  ClipboardList,
  Calendar,
  Clock,
  ChevronRight,
  RefreshCw,
  Trash2,
  CircleDollarSign,
  X,
  Wallet,
  Coins,
} from 'lucide-vue-next';
import { useToast } from 'vue-toastification';

export default {
  name: "ProfilePage",

  components: {
    PulseLoader,
    Navigation,
    UserCircle,
    LogOut,
    Heart,
    AlertCircle,
    AlertTriangle,
    ClipboardList,
    Calendar,
    Clock,
    ChevronRight,
    RefreshCw,
    Trash2,
    CircleDollarSign,
    X,
    Wallet,
    Coins,
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
      loadingColor: "#3B82F6",
      showDeleteConfirm: false,
      showLogoutConfirm: false,
      user: null,

      transactionsStore: null,
      lastActivity: null,
      lastActivityAmt: null,
      lastActivityDate: null,

      lastLogin: null,
      memberSince: null,

      isRecipesAnimating: false,
      isAvatarAnimating: false,
      isHeaderAnimating: false,
      isBudgetAnimating: false,
      displayedCount: 0,
      countInterval: null,
      tooltipVisible: false,
      toast: useToast()
    };
  },

  computed: {
    getUserInitials() {
      if (!this.user?.email) return "";
      const email = this.user.email.split("@")[0];
      return email.substring(0, 2).toUpperCase();
    },
  },

  methods: {
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
        } else {
          this.error = "User is not logged in.";
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
        this.toast.success('Signed Out Succesfully', {
          closeButton: false,
          hideProgressBar: true,
          timeout: 2000
        });
        this.toast.updateDefaults(this.updated);
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
        this.toast.error('Account Deleted', {
          closeButton: false,
          hideProgressBar: true,
          timeout: 2000
        });
        this.toast.updateDefaults(this.updated);
      } catch (error) {
        console.error("Error deleting account:", error);
        this.error = "Failed to delete account. Please try again.";
      } finally {
        this.showDeleteConfirm = false;
      }
    },

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

    navigateToTransactions() {
      this.isRecipesAnimating = true;
      setTimeout(() => {
        this.isRecipesAnimating = false;
        this.$router.push("/table");
      }, 100);
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
    },

    formattedCurrency(value) {
      if (typeof value !== 'number') {
        return '';
      }
      const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);

      return formattedValue;
    },
  },

  async created() {
    await this.fetchUserData();

    // Initialize the transaction store
    this.transactionsStore = userTransactions();
    this.transactionsStore.loadLastTransaction().then(() => {
      // Access the most recent transaction
      const lastTransaction = this.transactionsStore.lastTransaction;
      this.lastActivity = lastTransaction.activity;
      this.lastActivityAmt = lastTransaction.amount;
      this.lastActivityDate = lastTransaction.date;
    })

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
/* Enhanced animations and effects */
.animate-bounce-small {
  animation: bounce-small 0.6s ease-in-out;
}

.animate-shake {
  animation: shake 0.6s ease-in-out;
}

@keyframes bounce-small {

  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-8px) scale(1.02);
  }
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-8px);
  }

  75% {
    transform: translateX(8px);
  }
}

/* Glass morphism effect */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #3b82f6, #6366f1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #2563eb, #4f46e5);
}

/* Mobile responsiveness enhancements */
@media (max-width: 640px) {
  .min-h-screen {
    min-height: 100vh;
  }
}

/* Improved focus states for accessibility */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Enhanced hover states */
.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

.group:hover .group-hover\:translate-x-2 {
  transform: translateX(0.5rem);
}

.group:hover .group-hover\:rotate-12 {
  transform: rotate(12deg);
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}
</style>