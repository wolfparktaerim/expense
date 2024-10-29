<template>
    <Navigation></Navigation>

    <div class="food-trivia-container" style="margin-top: 5%">
      <h1 class="font-bold text-center mb-4 relative overflow-hidden">
        <span class="gradient">Food Trivia Generator</span>
      </h1>
      <div class="trivia-box">
        <p v-if="trivia" class="trivia-text text-lg text-center">{{ trivia }}</p>
        <p v-else class="text-center text-gray-500">Press the button below to get a random food trivia!</p>
      </div>
      <div class="text-right mt-4">
        <button @click="generateTrivia" class="generate-button">
          Generate trivia
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Navigation from '../components/Navigation.vue';

  export default {
    name: 'SearchPage', 
    //  Local Component Registration
    components: {
      Navigation,
    },
    data() {
      return {
        trivia: '',
      };
    },
    methods: {
      generateTrivia() {
        axios.get('https://api.spoonacular.com/food/trivia/random', {
          params: {
            apiKey: import.meta.env.VITE_SPOON_API_KEY,
          },
        })
        .then(response => {
            console.log(response.data)
            this.trivia = response.data.text;
        })
        .catch(error => {
            console.error(error);
            this.trivia = "Oops! Something went wrong.";
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .gradient {
    background: linear-gradient(to right, #D8B4FE, #8B5CF6); 
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: background 0.3s ease;
  }

  .food-trivia-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 2px solid #805ad5;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .trivia-box {
    min-height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    border: 1px dashed #805ad5;
    border-radius: 8px;
    padding: 15px;
    background-color: #fff;
  }
  
  .trivia-text {
    font-style: italic;
  }
  
  .generate-button {
    background-color: #805ad5;
    color: white;
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .generate-button:hover {
    background-color: #6b4f9d;
  }
  </style>