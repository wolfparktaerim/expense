<template>
    <div class="food-joke-container">
      <h1 class="text-3xl font-bold text-center my-8">Random Food Joke Generator</h1>
      <div class="joke-box">
        <p v-if="joke" class="joke-text text-lg text-center">{{ joke }}</p>
        <p v-else class="text-center text-gray-500">Press the button to get a joke!</p>
      </div>
      <button @click="generateJoke" class="generate-button">
        Generate Joke
      </button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        joke: '',
      };
    },
    methods: {
      generateJoke() {
        axios.get('https://api.spoonacular.com/food/jokes/random', {
          params: {
            apiKey: import.meta.env.VITE_SPOON_API_KEY,
          },
        })
        .then(response => {
            console.log(response.data)
            this.joke = response.data.text;
        })
        .catch(error => {
            console.error(error);
            this.joke = "Oops! Something went wrong.";
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .food-joke-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 2px solid #805ad5;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .joke-box {
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
  
  .joke-text {
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