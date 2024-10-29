<!-- Home.vue -->
<template>
  <Navigation />
  <div class="animated-container">
    <Carousel class="animate-up"></Carousel>
    <TagLine class="animate-up" />
    <HowItWorks id="HowItWorks" class="animate-up"/>
    <!-- <Globe id="About" class="animate-up"/> -->
    <RentFooter class="animate-up"></RentFooter>
  </div>
</template>

<script>
import HowItWorks from "../components/HowItWorks.vue";
import RentFooter from "../components/RentFooter.vue";
import Carousel from "../components/Carousel.vue";
import Navigation from "../components/Navigation.vue";
import Globe from "../components/Globe.vue";
import TagLine from "../components/TagLine.vue";

export default {
  name: 'HomePage', 
  components: {
    HowItWorks,
    RentFooter,
    Carousel,
    TagLine,
    Navigation,
    // Globe,
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