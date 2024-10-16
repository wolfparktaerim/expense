<template>
    <div class="outer-container">
      <div class="content__container">
        <div class="heading">
          Let's eat <span class="highlight">dog</span> today!
        </div>
        <div class="subheading">
          Create something delicious with what you have at home!
        </div>
        <div class="bp3-form-group" style="display:flex;  text-align:center; justify-content: center;">
          <div class="bp3-form-content">
            <div class="bp3-input bp3-tag-input bp3-large">
              <div class="bp3-tag-input-values">
                <input style="text-align: center; border: 1px;"
                  placeholder="meow meow"
                  class="bp3-input-ghost input-field"
                  v-model="ingredientInput"
                  @keydown="handleKeyDown"
                  @focus="moveUp = true"
                  @blur="handleBlur"
                />
              </div>
              <!-- <button type="button" class="bp3-button bp3-minimal" @click="clearText">
                <span icon="cross" class="bp3-icon bp3-icon-cross">
                  <svg data-icon="cross" width="16" height="16" viewBox="0 0 16 16">
                    <desc>cross</desc>
                    <path d="M9.41 8l3.29-3.29c.19-.18.3-.43.3-.71a1.003 1.003 0 00-1.71-.71L8 6.59l-3.29-3.3a1.003 1.003 0 00-1.42 1.42L6.59 8 3.3 11.29c-.19.18-.3.43-.3.71a1.003 1.003 0 001.71.71L8 9.41l3.29 3.29c.18.19.43.3.71.3a1.003 1.003 0 00.71-1.71L9.41 8z" fill-rule="evenodd"></path>
                  </svg>
                </span>
              </button> -->
            </div>
          </div>
        </div>
        <button
          type="button"
          :disabled="!ingredientInput"
          class="search-button"
          @click="handleSearch"
        >
          Search
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        ingredientInput: '',
        moveUp: false,
      };
    },
    methods: {
      handleKeyDown(event) {
        if (event.key === ',' || event.key === 'Enter') {
          event.preventDefault();
          this.ingredientInput = ''; // Clear input after adding
        }
      },
      clearText() {
        this.ingredientInput = '';
      },
      handleBlur() {
        if (!this.ingredientInput) {
          this.moveUp = false; // Adjust if input is empty
        }
      },
      handleSearch() {
        // Trigger search action
        console.log(`Searching for: ${this.ingredientInput}`);
        // Implement the search functionality here
      },
    },
  };
  </script>
  
  <style scoped>
  .input-field {
    border: 2px solid black; /* Add a border to the input */
    border-radius: 5px; /* Optional: rounded corners */
    padding: 10px; /* Optional: padding inside the input */
    transition: border-color 0.3s; /* Optional: smooth transition on focus */
  }

  .input-field:focus {
    border-color: #0073a8; /* Change border color on focus */
    outline: none; /* Remove default outline */
  }

  .outer-container {
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    height: 100vh; /* Full viewport height */
    text-align: center; /* Center text */
  }
  
  .content__container {
    /* Adjust width as necessary */
    max-width: 600px; 
  }
  
  .heading {
    font-size: calc(5px + 5vmin);
    font-family: Maison, sans-serif;
    font-weight: 800;
    color: rgb(0, 73, 104);
    margin-bottom: calc(1vmin);
  }
  
  .highlight {
    font-weight: bold; /* Make "fridge" stand out */
  }
  
  .subheading {
    font-size: calc(7px + 1vmin);
    font-family: Maison, sans-serif;
    font-weight: 800;
    color: rgb(0, 73, 104);
    margin-bottom: calc(10px + 2vmin);
  }
  
  .search-button {
    margin-top: calc(5px + 1vmin);
    padding: 10px 100px;
    border-radius: 30px;
    font-size: calc(10px + 1vmin);
    background-color: #0073a8; /* Example button color */
    color: white; /* Button text color */
    border: none;
    cursor: pointer;
  }
  
  .search-button:disabled {
    background-color: #ccc; /* Disable button color */
    cursor: not-allowed;
  }
  </style>
  