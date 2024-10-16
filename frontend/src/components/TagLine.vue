<template>
    <section class="flex flex-col items-center justify-center py-12 bg-gradient-to-b from-gray-50 to-white">
      <h1 class="text-3xl md:text-4xl font-bold text-center mb-4 relative overflow-hidden">
        <span class="hover-gradient">Discover Healthy Recipes Today for a Healthier Tomorrow!</span>
      </h1>
      <div class="flex space-x-4 mb-4">
        <button class="bg-purple-600 text-white py-2 px-4 rounded-lg text-lg transition-transform transform hover:scale-105">
          Sign Up
        </button>
        <button class="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg text-lg transition-transform transform hover:scale-105">
          Log In
        </button>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'HeroSection'
  }
  </script>
  
  <style scoped>
  .hover-gradient {
    background: linear-gradient(to right, #C79CD1, #8B5BCA); /* Darker starting color */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: background 0.3s ease;
  }
  </style>  