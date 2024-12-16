<!-- TagLine.vue -->
<template>
  <section
    class="relative overflow-hidden to-white py-20"
  >
    <!-- Background decoration -->
    <!-- <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -right-10 top-1/4 h-64 w-64 rounded-full bg-purple-100/50"
      ></div>
      <div
        class="absolute -left-10 top-1/3 h-48 w-48 rounded-full bg-purple-100/30"
      ></div>
    </div> -->

    <!-- Main content -->
    <div class="relative mx-auto max-w-7xl px-4">
      <div class="flex flex-col items-center justify-center">
        <!-- Heading -->
        <h1 class="mb-6 text-center">
          <span
            class="block text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl"
          >
            <span class="gradient">Track Your Spending,</span>
          </span>
          <span
            class="mt-2 block text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl"
          >
            <span class="gradient">Shape Your Financial Future!</span>
          </span>
        </h1>

        <!-- Subheading -->
        <p class="mb-12 max-w-2xl text-center text-lg text-gray-600 md:text-xl">
          Easily manage your expenses and income to stay on top of your financial goals. Join us in taking control of your money every day.
        </p>

        <!-- CTA Buttons -->
        <div
          class="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0"
        >
          <button
            @click="handleGetStarted"
            class="button-primary inline-flex items-center justify-center rounded-xl bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-green-800 hover:shadow-green-200 hover:-translate-y-1 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 relative overflow-hidden group"
          >
            <span class="relative z-10">Get Started Now!</span>
            <div
              class="absolute inset-0 bg-gradient-to-r from-green-500 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="ml-2 h-5 w-5 relative z-10 transition-all duration-300 group-hover:scale-125"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        
        </div>

        <!-- Social Proof section remains the same -->
      </div>
    </div>
  </section>
</template>

<script>
import { useAuthStore } from "../stores/auth";

export default {
  name: "TagLine",

  emits: ["show-login", "show-video"],

  data() {
    return {
      authStore: null,
    };
  },

  computed: {
    isAuthenticated() {
      return this.authStore?.isAuthenticated;
    },
  },

  created() {
    this.authStore = useAuthStore();
  },

  methods: {
    handleGetStarted() {
      if (this.isAuthenticated) {
        this.$router.push("/track");
      } else {
        this.$emit("show-login");
      }
    },
  },
};
</script>
<style scoped>
.gradient {
  background: linear-gradient(to right, #65f56cd4, #32b234);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 8s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}


.button-primary::before,
.button-secondary::before {
  content: "";
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  transform: scaleX(1);
  transform-origin: 0 50%;
  transition-property: transform;
  transition-duration: 0.3s;
  transition-timing-function: ease-out;
}

.button-primary:hover::before,
.button-secondary:hover::before {
  transform: scaleX(1.05);
}
/* Add specific transitions for the Watch Demo button */
button:hover svg {
  transform: scale(1.25);
}
</style>
