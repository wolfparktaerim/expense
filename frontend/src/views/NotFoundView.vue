<template>
    <Navigation />
    <div class="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
    style="background-image: url('https://images.unsplash.com/photo-1504660069764-2b37e279874a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')">
    <div class="max-w-md mx-auto text-center bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <div class="text-9xl font-bold text-green-600 mb-4">404</div>
        <h1 class="text-4xl font-bold text-gray-800 mb-6">Oops! Page Not Found</h1>
        <p class="text-lg text-gray-600 mb-8">The page you're looking for seems to have gone on a little adventure. Don't
        worry, we'll help you find your way back home.</p>
        <a href="/"
        class="inline-block bg-green-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-green-800 transition-colors duration-300">
        Go Back Home
        </a>
    </div>
    </div>
</template>

<script>
  import Navigation from "../components/Navigation.vue";
  
  export default {
    name: 'NotFound', 
    //  Local Component Registration
    components: {
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