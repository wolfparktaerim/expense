<!-- Home.vue -->
<template>
  <div class="relative">
    <!-- Login Modal -->
     <!-- <component :is="components.LoginModal-->
      <!-- This syntax dynamically loads the component by referencing it from components in data(). -->
    <component :is="components.LoginModal" v-if="showLogin" @close="showLogin = false" />
    
    <!-- Video Modal -->
    <component
      :is="components.VideoModal"
      v-model="showVideo"
      :video-id="videoId"
      title="Discover Healthy Recipes Demo"
      description="Learn how to find, save, and prepare delicious healthy recipes that match your dietary preferences and nutritional goals."
    />
    
    <!-- Background container -->
    <div class="fixed inset-0 bg-gradient-to-b from-purple-50 to-white">
      <div class="absolute -right-20 top-1/4 h-96 w-96 rounded-full bg-purple-100/30 blur-3xl"></div>
      <div class="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-purple-100/20 blur-3xl"></div>
      <div class="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-purple-100/20 blur-3xl"></div>
    </div>

    <!-- Content container -->
    <div class="relative min-h-screen">
      <Navigation />
      
      <main class="relative">
        <div class="animated-container">
          <Carousel class="animate-up" />
          <TagLine 
            class="animate-up" 
            @show-login="showLogin = true"
            @show-video="showVideo = true"
          />
          <HowItWorks id="HowItWorks" class="animate-up" />
          <RentFooter class="animate-up" />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import HowItWorks from "../components/HowItWorks.vue";
import RentFooter from "../components/RentFooter.vue";
import Carousel from "../components/Carousel.vue";
import Navigation from "../components/Navigation.vue";
import TagLine from "../components/TagLine.vue";

// Import LoginModal and VideoModal
import LoginModal from "../components/LoginModal.vue";
import VideoModal from "../components/VideoModal.vue";

export default {
  components: {
    HowItWorks,
    RentFooter,
    Carousel,
    Navigation,
    TagLine
  },
  data() {
    return {
      showLogin: false,
      showVideo: false,
      videoId: 'zw8Ao6VfDog',
      components: { // Register components here for use with <component :is="">
        LoginModal,
        VideoModal
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
