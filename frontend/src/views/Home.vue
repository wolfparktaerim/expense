<template>
  <Navigation />
  <Carousel></Carousel>
  <TagLine />
  <HowItWorks id="HowItWorks"/>
  <Globe id="About"/>
  <RentFooter></RentFooter>
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
  //  Local Component Registration
  components: {
    HowItWorks,
    RentFooter,
    Carousel,
    TagLine,
    Navigation,
    Globe,
  },
}
</script>

<style scoped>
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