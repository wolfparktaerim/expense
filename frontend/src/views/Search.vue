<template>
    <Navigation />
    <RecipeSearch />
</template>
  
  <script>
<<<<<<< HEAD
  import Search from "../components/SearchFxn.vue";
  import Navigation from "../components/Navigation.vue";
=======
  import SubNavigation from "../components/SubNavigation.vue";
>>>>>>> e3900a85ba37b9fb8c851c3f8c77acd9c0b2962b
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