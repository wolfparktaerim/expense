<template>
  <div class='min-h-screen '>

    <Navigation />
    <TransactionForms/>
  </div>
</template>
  
  <script>
  import Navigation from "../components/Navigation.vue";
  import TransactionForms from "../components/TransactionForms.vue";
  
  export default {
    name: 'SearchPage', 
    //  Local Component Registration
    components: {
      Navigation,
      TransactionForms
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