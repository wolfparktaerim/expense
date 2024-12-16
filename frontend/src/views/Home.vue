<!-- Home.vue -->
<template>
  <div class="relative">
    <!-- Login Modal -->
     <!-- <component :is="components.LoginModal-->
      <!-- This syntax dynamically loads the component by referencing it from components in data(). -->
    <component :is="components.LoginModal" v-if="showLogin" @close="showLogin = false" />
    
    
    <!-- Background container -->
    <div class="fixed inset-0 ">
      <div class="absolute -right-20 top-1/4 h-96 w-96 rounded-full "></div>
      <div class="absolute -left-20 top-1/3 h-72 w-72 rounded-full "></div>
      <div class="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full "></div>
    </div>

    <!-- Content container -->
    <div class="relative min-h-screen">
      <Navigation />
      
      <main class="relative">
        <div class="animated-container">
          <TagLine 
            class="animate-up" 
            @show-login="showLogin = true"
          />
          <RentFooter class="animate-up" />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import RentFooter from "../components/RentFooter.vue";
import Navigation from "../components/Navigation.vue";
import TagLine from "../components/TagLine.vue";

// Import LoginModal and VideoModal
import LoginModal from "../components/LoginModal.vue";

export default {
  components: {
    RentFooter,
    Navigation,
    TagLine
  },
  data() {
    return {
      showLogin: false,
      components: { // Register components here for use with <component :is="">
        LoginModal,
      }
    };
  },
  methods: {
    animateComponents() {
      const components = document.querySelectorAll('.animate-up');
      components.forEach((component, index) => {
        component.style.animationDelay = `${index * 0.2}s`;
      });
    }
  },
  mounted() {
    this.animateComponents();
  }
};
</script>

<style scoped>
.animated-container {
  overflow: hidden;
}

.animate-up {
  animation: slideUp 1s ease-out forwards;
  opacity: 0;
  transform: translateY(50px);
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
