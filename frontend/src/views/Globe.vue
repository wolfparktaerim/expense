<!-- views/Globe.vue -->
<template>
  <Navigation />
  <InteractiveGlobe />
</template>

<script>
import Navigation from "../components/Navigation.vue";
import InteractiveGlobe from "../components/globe/index.vue";  // Updated import path

export default {
name: 'SearchPage',
components: {
  Navigation,
  InteractiveGlobe  // Updated component name to match the exported one
},
}
</script>