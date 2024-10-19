<template>
    <section class="flex flex-col items-center justify-center py-12">
      <h1 class="text-4xl md:text-6xl font-bold text-center mb-4 relative overflow-hidden">
        <span class="gradient">Discover Healthy Recipes Today for a Healthier Tomorrow!</span>
      </h1>
      <p class='text-2xl text-center text-stone-500 text-muted-foreground mb-8 max-w-3xl mx-auto'>Personalized, nutritious recipes at your fingertips. Detailed instructions, health info, and easy saving. Your path to tasty wellness starts here!</p>
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
  .gradient {
    background: linear-gradient(to right, #D8B4FE, #8B5CF6); 
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: background 0.3s ease;
  }
  </style>  