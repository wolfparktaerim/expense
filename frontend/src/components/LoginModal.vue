<template>
  <div>
    <div v-if="isModalVisible" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 sm:mx-auto" @click.stop>
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Choose login method</h2>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
          </div>
          <div class="space-y-4">
            <button @click="selectMethod('email')" class="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-200">
              Email
            </button>
            <button @click="selectMethod('google')" class="w-full py-2 px-4 bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray-50 transition duration-200 flex items-center justify-center">
              <img src="../assets/google.svg" alt="Google logo" class="w-5 h-5 mr-2">
              Sign in with Google
            </button>
            <!-- Uncomment and adjust as needed
            <button @click="selectMethod('apple')" class="w-full py-2 px-4 bg-black text-white rounded hover:bg-gray-900 transition duration-200 flex items-center justify-center">
              <img src="/path-to-apple-logo.png" alt="Apple logo" class="w-5 h-5 mr-2">
              Continue with Apple
            </button>
            -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isModalVisible: true,
      selectedMethod: null
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
    selectMethod(method) {
      this.selectedMethod = method
      console.log(`Login with ${method}`)
    }
  }
}
</script>