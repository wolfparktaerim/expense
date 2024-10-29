<template>
    <Navigation />
    <Globe />
</template>

<script>
import Navigation from "../components/Navigation.vue";
import Globe from "../components/Globe.vue";

export default {
  name: 'SearchPage', 
  //  Local Component Registration
  components: {
    Navigation,
    Globe,
    
  },
}
</script>