<template>
    <Navigation />
    <RentFooter></RentFooter>
</template>
  
  <script>
  import RentFooter from "../components/RentFooter.vue";
  import Navigation from "../components/Navigation.vue";
  
  export default {
    name: 'App', 
    //  Local Component Registration
    components: {
      RentFooter,
      Navigation,
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