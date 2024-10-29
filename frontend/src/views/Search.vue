<template>
    <Navigation />
    <RecipeSearch />
</template>
  
  <script>
  import Navigation from "../components/Navigation.vue";
  import RecipeSearch from "../components/RecipeSearch.vue";
  
  export default {
    name: 'SearchPage', 
    //  Local Component Registration
    components: {
      Navigation,
      RecipeSearch,
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