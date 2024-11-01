<!-- Home.vue -->
<template>
  <div class="relative">
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
          <TagLine class="animate-up" />
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

export default {
  name: 'HomePage',
  components: {
    HowItWorks,
    RentFooter,
    Carousel,
    TagLine,
    Navigation,
  },
  mounted() {
    this.animateComponents();
  },
  methods: {
    animateComponents() {
      const components = document.querySelectorAll('.animate-up');
      components.forEach((component, index) => {
        component.style.animationDelay = `${index * 0.2}s`;
      });
    }
  }
}
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

/* Animated background elements */
@keyframes gradientShift {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(30px, 20px) rotate(7.5deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

.bg-purple-100\/30 {
  animation: gradientShift 15s ease-in-out infinite;
}

.bg-purple-100\/20 {
  animation: gradientShift 20s ease-in-out infinite reverse;
}
</style>