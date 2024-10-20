<template>
  <div>
    <div v-if="isModalVisible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 sm:mx-auto" @click.stop>
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="mx-auto text-4xl font-bold">{{ title }}</h2>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700 text-3xl">&times;</button>
          </div>
          
          <p class="mb-4">{{ description }}</p>

          <div v-if="loginMethod" class="space-y-4">
            <button @click="selectMethod('email')" class="w-full py-2 px-4 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition duration-200">
              Email
            </button>
            <button @click="selectMethod('google')" class="w-full py-2 px-4 bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray-100 transition duration-200 flex items-center justify-center">
              <img src="../assets/google.svg" alt="Google logo" class="w-5 h-5 mr-2">
              Sign in with Google
            </button>
          </div>

          <div class='space-y-4' v-if="emailLogin">
            <p>Email</p>
            <input 
              ref="emailInput"
              @keyup.enter="checkEmail"
              v-model="email"
              @blur="validateEmail"
              @input="resetValidation"
              placeholder='Bob@mail.com' 
              :class="['w-full px-4 py-2 text-gray-700 border rounded transition duration-200 outline-none', 
                      emailError ? 'border-red-500' : 'border-purple-500']"
              type="email"
              required
            >
            <p v-if="emailError" class="text-red-500 text-sm mt-1">{{ emailError }}</p>
            
            <div v-if="showPasswordField" class="space-y-4">
              <div>
                <p>Password</p>
                <input 
                  v-model="password"
                  @keyup.enter="handleSubmit"
                  type="password" 
                  placeholder="Enter your password"
                  :class="['w-full px-4 py-2 text-gray-700 border rounded transition duration-200 outline-none', 
                        passwordErrors.length > 0 ? 'border-red-500' : 'border-purple-500']"
                  required
                >
              </div>
              
              <div v-if="isNewUser" class="mt-4">
                <p>Confirm Password</p>
                <input 
                  v-model="confirmPassword"
                  @keyup.enter="handleSubmit"
                  type="password" 
                  placeholder="Confirm your password"
                  :class="['w-full px-4 py-2 text-gray-700 border rounded transition duration-200 outline-none', 
                          passwordErrors.length > 0 ? 'border-red-500' : 'border-purple-500']"
                  required
                >
              </div>
              
              <div v-if="passwordErrors.length > 0" class="mt-2">
                <p v-for="error in passwordErrors" :key="error" class="text-red-500 text-sm">{{ error }}</p>
              </div>
              
              <a v-if="!isNewUser" href="#" @click.prevent="forgotPassword" class="text-indigo-600 hover:text-indigo-800 text-sm">Forgot your password?</a>
            </div>

            <button @click="handleSubmit" class="w-full py-2 px-4 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition duration-200 flex items-center justify-center">
              <span v-if="!isLoading">{{ isNewUser ? 'Create Account' : 'Login' }}</span>
              <div v-else class="spinner"></div>
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';
import router from '../router';

export default {
  data() {
    return {
      loginMethod: true,
      title: 'Choose login method',
      description: 'If you do not already have an account with us you will have to register.',
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
    }
  },
  methods: {
    openModal() {
      this.isModalVisible = true
    },
    closeModal() {
      this.isModalVisible = false
      this.selectedMethod = null
      this.$emit('close')
    },
    async signInWithGoogle() {
      this.isLoading = true;
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      try {
        const result = await signInWithPopup(auth, provider)
        console.log(result)
        console.log(this.getCurrentUser());
        router.push('/search')
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false;
      }
    },
    getCurrentUser() {
      const auth = getAuth()
      return auth.currentUser
    },
    selectMethod(method) {
      this.selectedMethod = method
      console.log(`Login with ${method}`)
      if(this.selectedMethod == 'email'){
        this.emailLogin = true;
        this.loginMethod = false;
        this.title = 'Log in or register';
        this.$nextTick(() => {
          this.$refs.emailInput.focus();
        });
      }
      else{
        this.signInWithGoogle();
        console.log("signed in with google ");
      }
    },
    validateEmail() {
      if (!this.email) {
        this.emailError = 'Required';
      } else if (!this.isValidEmail(this.email)) {
        this.emailError = 'Invalid email address';
      } else {
        this.emailError = '';
      }
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
      this.validateEmail();
      if (!this.emailError) {
        this.isLoading = true;
        const auth = getAuth();
        try {
          const signInMethods = await fetchSignInMethodsForEmail(auth, this.email);
          console.log(signInMethods);

          if (signInMethods.length === 0) {
            // Email doesn't exist, show registration fields
            this.isNewUser = true;
            this.title = 'Create an account';
          } else {
            // Email exists, show login fields
            this.isNewUser = false;
            this.title = 'Log in';
          }
          this.showPasswordField = true;
        } catch (error) {
          console.error('Error checking email:', error);
          this.emailError = 'An error occurred while checking the email. Please try again.';
        } finally {
          this.isLoading = false;
        }
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
      if (this.isNewUser) {
        try {
          await createUserWithEmailAndPassword(auth, this.email, this.password);
          console.log('User created successfully');
          // TODO: Add Toastify for success and failure notifications 
          router.push('/search');
        } catch (error) {
          console.error('Error creating user:', error);
          this.passwordErrors.push(error.message);
        } finally {
          this.isLoading = false;
        }
      } else {
        try {
          await signInWithEmailAndPassword(auth, this.email, this.password);
          console.log('User logged in successfully');
          router.push('/search');
        } catch (error) {
          console.error('Error logging in:', error);
          this.passwordErrors.push('Invalid password');
        } finally {
          this.isLoading = false;
        }
      }
    },
    async forgotPassword() {
      this.isLoading = true;
      const auth = getAuth();
      try {
        await sendPasswordResetEmail(auth, this.email);
        console.log('Password reset email sent');
        // TODO: Add a success message (use toastify or similar)
      } catch (error) {
        console.error('Error sending password reset email:', error);
        // TODO: Add an error message (use toastify or similar)
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.spinner {
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid #ffffff;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>