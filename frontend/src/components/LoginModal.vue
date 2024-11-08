<template>
  <TransitionRoot appear :show="isModalVisible" as="template">
    <Dialog as="div" class="relative z-50" @close="handleBackdropClick">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
            <DialogPanel class="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 sm:mx-auto">
              <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                  <DialogTitle as="h2" class="mx-auto text-2xl font-semibold">
                    {{ title }}
                  </DialogTitle>
                  <button 
                    v-if="dismissible" 
                    @click="closeModal" 
                    class="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X class="w-5 h-5" />
                  </button>
                </div>

                <p class="text-gray-600 text-center mb-8">{{ description }}</p>

                <div v-if="loginMethod" class="space-y-4">
                  <button 
                    @click="selectMethod('email')" 
                    class="w-full py-3 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center gap-2"
                    :disabled="isLoading"
                  >
                    <Mail class="w-5 h-5" />
                    Continue with Email
                  </button>
                  <button 
                    @click="selectMethod('google')" 
                    class="w-full py-3 px-4 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                    :disabled="isLoading"
                  >
                    <img src="../assets/google.svg" alt="Google logo" class="w-5 h-5">
                    Continue with Google
                  </button>
                </div>

                <TransitionRoot
                  appear
                  :show="emailLogin"
                  as="template"
                  enter="transform transition duration-300"
                  enter-from="opacity-0 translate-y-4"
                  enter-to="opacity-100 translate-y-0"
                  leave="transform transition duration-200"
                  leave-from="opacity-100 translate-y-0"
                  leave-to="opacity-0 translate-y-4"
                >
                  <div v-if="emailLogin" class="space-y-4">
                    <form @submit.prevent="!showPasswordField ? checkEmail() : handleSubmit()">
                      <div class="space-y-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <div class="relative">
                            <input 
                              ref="emailInput"
                              v-model="email"
                              @blur="validateEmail"
                              @input="resetValidation"
                              placeholder="you@example.com"
                              :class="[
                                'w-full px-4 py-2 text-gray-700 border rounded-lg transition-colors duration-200 outline-none',
                                'focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                                emailError ? 'border-red-500' : 'border-gray-300'
                              ]"
                              type="email"
                              :disabled="isLoading || showPasswordField"
                              required
                            >
                            <Mail class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                          <p v-if="emailError" class="mt-1 text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle class="w-4 h-4" />
                            {{ emailError }}
                          </p>
                        </div>

                        <TransitionRoot
                          appear
                          :show="showPasswordField"
                          as="template"
                          enter="transform transition duration-300"
                          enter-from="opacity-0 translate-y-4"
                          enter-to="opacity-100 translate-y-0"
                          leave="transform transition duration-200"
                          leave-from="opacity-100 translate-y-0"
                          leave-to="opacity-0 translate-y-4"
                        >
                          <div v-if="showPasswordField" class="space-y-4">
                            <div>
                              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                              <div class="relative">
                                <input 
                                  v-model="password"
                                  type="password" 
                                  placeholder="Enter your password"
                                  :class="[
                                    'w-full px-4 py-2 text-gray-700 border rounded-lg transition-colors duration-200 outline-none',
                                    'focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                                    passwordErrors.length > 0 ? 'border-red-500' : 'border-gray-300'
                                  ]"
                                  :disabled="isLoading"
                                  required
                                >
                                <Lock class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                              </div>
                            </div>

                            <div v-if="isNewUser">
                              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                              <div class="relative">
                                <input 
                                  v-model="confirmPassword"
                                  type="password" 
                                  placeholder="Confirm your password"
                                  :class="[
                                    'w-full px-4 py-2 text-gray-700 border rounded-lg transition-colors duration-200 outline-none',
                                    'focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                                    passwordErrors.length > 0 ? 'border-red-500' : 'border-gray-300'
                                  ]"
                                  :disabled="isLoading"
                                  required
                                >
                                <Lock class="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                              </div>
                            </div>

                            <div v-if="passwordErrors.length > 0" class="space-y-1">
                              <p v-for="error in passwordErrors" :key="error" class="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle class="w-4 h-4" />
                                {{ error }}
                              </p>
                            </div>

                            <a 
                              v-if="!isNewUser" 
                              href="#" 
                              @click.prevent="forgotPassword" 
                              class="text-sm text-indigo-600 hover:text-indigo-800 transition-colors block"
                              :class="{ 'pointer-events-none opacity-50': isLoading }"
                            >
                              Forgot your password?
                            </a>
                          </div>
                        </TransitionRoot>

                        <button 
                          type="submit"
                          class="w-full py-3 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center gap-2"
                          :disabled="isLoading"
                        >
                          <span v-if="!isLoading" class="flex items-center gap-2">
                            {{ !showPasswordField ? 'Continue' : (isNewUser ? 'Create Account' : 'Login') }}
                            <ArrowRight v-if="!showPasswordField" class="w-5 h-5" />
                            <UserPlus v-if="showPasswordField && isNewUser" class="w-5 h-5" />
                            <LogIn v-if="showPasswordField && !isNewUser" class="w-5 h-5" />
                          </span>
                          <Loader2 v-else class="w-5 h-5 animate-spin" />
                        </button>
                      </div>
                    </form>
                  </div>
                </TransitionRoot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue';
import {
  Mail,
  Lock,
  X,
  AlertCircle,
  ArrowRight,
  UserPlus,
  LogIn,
  Loader2,
} from 'lucide-vue-next';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';

export default {
  name: 'LoginModal',
  
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
    Mail,
    Lock,
    X,
    AlertCircle,
    ArrowRight,
    UserPlus,
    LogIn,
    Loader2
  },
  
  props: {
    dismissible: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      loginMethod: true,
      title: 'Choose log in method',
      description: `Enter your email to log in or register`,
      emailLogin: false,
      isModalVisible: true,
      selectedMethod: null,
      email: '',
      emailError: '',
      password: '',
      passwordErrors: [],
      confirmPassword: '',
      showPasswordField: false,
      isNewUser: false,
      isLoading: false,
      toast: useToast(),
      updated: {
        transition: "Vue-Toastification__fade",
        maxToasts: 2,
        filterToasts: toasts => {
          const types = {};
          return toasts.reduce((aggToasts, toast) => {
            if (!types[toast.type]) {
              aggToasts.push(toast);
              types[toast.type] = true;
            }
            return aggToasts;
          }, []);
        }
      }
    };
  },

  methods: {
    handleBackdropClick() {
      if (this.dismissible) {
        this.handleModalClose();
      }
    },

    handleModalClose() {
      if (!this.dismissible && !this.authStore.isAuthenticated) {
        return;
      }
      
      const wasVisible = this.isModalVisible;
      this.isModalVisible = false;
      this.selectedMethod = null;
      this.$emit('close');
      
      this.authStore.showLoginModal = false;
      
      if (wasVisible && this.$router.currentRoute.value.path !== '/') {
        this.$router.push('/');
      }
      
      this.authStore.pendingRoute = null;
    },

    closeModal() {
      if (!this.dismissible && !this.authStore.isAuthenticated) {
        return;
      }
      this.isModalVisible = false;
      this.selectedMethod = null;
      this.$emit('close');
    },

    async signInWithGoogle() {
      this.isLoading = true;
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        console.log("success google login");
        this.closeModal();
        // this.$router.push('/search');
            // Add toast notification
        this.toast.success('Logged in successfully', {
        closeButton: false,
        hideProgressBar: true,
        timeout: 2000
      });
    this.toast.updateDefaults(this.updated);
      } catch (error) {
        console.error('Google sign-in error:', error);
        this.toast.error('Failed to login with Google', {
          closeButton: false,
          hideProgressBar: true,
          timeout: 2000
        });
      } finally {
        this.isLoading = false;
      }
    },

    selectMethod(method) {
      this.selectedMethod = method;
      if (this.selectedMethod === 'email') {
        this.emailLogin = true;
        this.loginMethod = false;
        this.title = 'Log in or register';
        this.$nextTick(() => {
          this.$refs.emailInput?.focus();
        });
      } else {
        this.signInWithGoogle();
      }
    },

    validateEmail() {
      if (!this.email) {
        this.emailError = 'Required';
        return false;
      } 
      if (!this.isValidEmail(this.email)) {
        this.emailError = 'Invalid email address';
        return false;
      }
      this.emailError = '';
      return true;
    },

    resetValidation() {
      this.emailError = '';
      this.passwordErrors = [];
    },

    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    async checkEmail() {
      if (!this.validateEmail()) {
        return;
      }

      this.isLoading = true;
      const auth = getAuth();
      try {
        const signInMethods = await fetchSignInMethodsForEmail(auth, this.email);

        if (signInMethods.length === 0) {
          this.isNewUser = true;
          this.title = 'Create an account';
        } else {
          this.isNewUser = false;
          this.title = 'Log in';
        }
        this.showPasswordField = true;
      } catch (error) {
        console.error('Error checking email:', error);
        this.emailError = 'An error occurred while checking the email. Please try again';
      } finally {
        this.isLoading = false;
      }
    },

    validatePassword() {
      this.passwordErrors = [];
      if (this.password.length < 6) {
        this.passwordErrors.push('Password needs to be at least 6 characters long');
      }
      if (this.isNewUser && this.password !== this.confirmPassword) {
        this.passwordErrors.push('Passwords do not match');
      }
      return this.passwordErrors.length === 0;
    },

    async handleSubmit() {
      if (!this.validatePassword()) {
        return;
      }

      this.isLoading = true;
      const auth = getAuth();
      try {
        if (this.isNewUser) {
          await createUserWithEmailAndPassword(auth, this.email, this.password);
          this.toast.success('Account created successfully', {
            closeButton: false,
            hideProgressBar: true,
            timeout: 2000
          });
          this.toast.updateDefaults(this.updated);
        } else {
          await signInWithEmailAndPassword(auth, this.email, this.password);
          this.toast.success('Logged in successfully', {
            closeButton: false,
            hideProgressBar: true,
            timeout: 2000
          });
          this.toast.updateDefaults(this.updated);
        }
        
        this.closeModal();
        
        if (this.authStore.pendingRoute) {
          this.$router.push(this.authStore.pendingRoute);
          this.authStore.pendingRoute = null;
        } else {
          // this.$router.push('/search');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        this.passwordErrors.push(
          error.code === 'auth/wrong-password' 
            ? 'Invalid password' 
            : error.message
        );
      } finally {
        this.isLoading = false;
      }
    },

    async forgotPassword() {
      if (!this.validateEmail()) {
        return;
      }

      this.isLoading = true;
      const auth = getAuth();
      try {
        await sendPasswordResetEmail(auth, this.email);
        this.toast.success('Password reset email sent', {
          closeButton: false,
          hideProgressBar: true,
          timeout: 2000
        });
        this.description = 'Password reset email sent. Please check your inbox';
      } catch (error) {
        console.error('Error sending password reset email:', error);
        this.toast.error('Failed to send password reset email', {
          closeButton: false,
          hideProgressBar: true,
          timeout: 2000
        });
      } finally {
        this.isLoading = false;
      }
    }
  },

  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    return {
      authStore,
      router
    };
  },

  mounted() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.dismissible) {
        this.handleModalClose();
      }
    });
  },

  beforeUnmount() {
    document.removeEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.dismissible) {
        this.handleModalClose();
      }
    });
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
