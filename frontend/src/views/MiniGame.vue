<template>
    <Navigation></Navigation>
    <div class="game-container">
      <!-- Scoreboard above the game area -->
      <div class="health-score">
        <span><p>Health: {{ health }}</p></span>
        <span><img :src="healthStageImage" alt="Health Stage" class="health-stage-image" /></span>
        <p>Score: {{ score }}</p>
      </div>
  
      <div ref="gameArea" class="game-area relative overflow-hidden">

         <!-- Show instructions if game not started -->
        <div v-if="!isGameStarted" class="instructions" style="text-align: center;" >
            <h2>Instructions</h2>
            <p>Use the left and right arrow keys or the buttons below to move the basket.</p>
            <p>You can press "P" or the button "Pause" to pause the game.</p>
            <p>Catch as many as healthy foods to gain points and avoid unhealthy foods to maintain your health!</p>
            <br>
            <br>
            <button @click="startGame">Start</button>
        </div>

        <!-- Basket -->
        <div v-if="isGameStarted" class="basket absolute bottom-0" :style="{ left: basketPositionX + 'px' }">
          <img src="/game/others/basket.png" alt="Basket" class="basket-image" />
        </div>
  
        <!-- Falling Foods -->
        <div v-if="isGameStarted" v-for="(food, index) in foods" :key="index" class="food absolute" :style="{ top: food.y + 'px', left: food.x + 'px' }">
          <img :src="food.src" alt="Food" />
        </div>
      </div>
  
      <!-- Control Buttons below the game area -->
      <div class="controls">
        <button @click="moveBasket('left')" :disabled="isPaused">⬅️ Move Left</button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button @click="moveBasket('right')" :disabled="isPaused">➡️ Move Right</button>
        <br>
        <button @click="togglePause">{{ isPaused ? 'Resume' : 'Pause' }}</button>
      </div>
    </div>
  </template>
  
  <script>
  import Navigation from '../components/Navigation.vue';
  export default {
    components: {
      Navigation,
    },
    data() {
      return {
        score: 0,
        health: 100, // Starting health
        basketPositionX: 200, // Initial basket position
        foods: [],
        basketWidth: 50, // Adjusted basket width
        gameWidth: 500, // Width of the game area
        healthyFoodSrc : [
            '/game/healthy/almond.png', '/game/healthy/apple.png', '/game/healthy/blueberry.png', '/game/healthy/brocolli.png', '/game/healthy/carrot.png', '/game/healthy/corn.png', '/game/healthy/egg.png', '/game/healthy/salmon.png', '/game/healthy/strawberry.png'
        ],
        unhealthyFoodSrc : [
            '/game/unhealthy/burger.png', '/game/unhealthy/candy.png', '/game/unhealthy/candy.png', '/game/unhealthy/cake-slice.png', '/game/unhealthy/chips.png', '/game/unhealthy/donut.png', '/game/unhealthy/french-fries.png', '/game/unhealthy/fried-chicken.png', '/game/unhealthy/pizza.png', '/game/unhealthy/sausages.png'
        ],
        isGameStarted: false,
        isPaused: false,
        foodGenerationInterval: null,
        foodDropInterval: null,
      };
    },
    computed: {
      healthStageImage() {
        if (this.health >= 60) {
          return '/game/others/stage_1.png';
        } else if (this.health >= 30) {
          return '/game/others/stage_2.png';
        } else {
          return '/game/others/stage_3.png';
        }
      },
    },
    methods: {
      // Generate food with random x-position within the game boundary
      generateFood() {
        if (this.isPaused || !this.isGameStarted) {// Stop dropping foods if paused/not started
            return; 
        }
        const isHealthy = Math.random() > 0.5;
        let foodList;
        if(isHealthy){
            foodList = this.healthyFoodSrc;
        }
        else{
            foodList = this.unhealthyFoodSrc;
        }
        let randomIndex = Math.floor(Math.random() * foodList.length);
        const food = {
          x: Math.random() * (this.gameWidth - 50), // Random position, adjusted for food width
          y: 0,
          src: foodList[randomIndex],
          isHealthy,
        };
        this.foods.push(food);
        console.log(food)
      },
  
      // Move the basket, with boundaries to keep it within game area
      moveBasket(direction) {
        const moveAmount = 30;
        if (direction === 'left') {
          this.basketPositionX = Math.max(0, this.basketPositionX - moveAmount);
        } else if (direction === 'right') {
          this.basketPositionX = Math.min(
            this.gameWidth - this.basketWidth,
            this.basketPositionX + moveAmount
          );
        }
      },
  
      // Move foods downward and check for boundary
      dropFoods() {
        if (this.isPaused || !this.isGameStarted) {// Stop dropping foods if paused/not started
            return; 
        }
        this.foods.forEach((food, index) => {
          food.y += 5; // Adjust for drop speed
          // Check if food reached the bottom or collides with the basket
          if (food.y >= 400) { // Set to bottom boundary of game area
            this.checkCollision(food, index);
          }
        });
      },
  
      // Check if food collides with the basket
      checkCollision(food, index) {
        const basketLeft = this.basketPositionX;
        const basketRight = this.basketPositionX + this.basketWidth;
  
        if (food.y >= 380 && food.x >= basketLeft && food.x <= basketRight) {
          // Collision detected, update score or health
          if (food.isHealthy) {
            this.score += Math.floor(Math.random() * 10) + 5;
          } else {
            this.health -= 10;
            if (this.health <= 0) {
              this.endGame();
            }
          }
          // Remove food from array after collision
          this.foods.splice(index, 1);
        }
      },
  
      // End game function
      endGame() {
        alert("Game Over! Your score: " + this.score);
        this.resetGame();
      },
  
      // Reset game
      resetGame() {
        this.health = 100;
        this.score = 0;
        this.foods = [];
        this.isGameStarted = false; // Reset game state
        clearInterval(this.foodGenerationInterval);
        clearInterval(this.foodDropInterval);
      },
  
       // Start the game
        startGame() {
            this.isGameStarted = true;
            this.foodGenerationInterval = setInterval(this.generateFood, 1000); // Generate food every second
            this.foodDropInterval = setInterval(this.dropFoods, 50); // Drop foods every 50ms
        },

        // Handle keyboard events
        handleKeyDown(event) {
            if (event.key === "ArrowLeft" && !this.isPaused) {
                this.moveBasket('left');
            } 
            else if (event.key === "ArrowRight" && !this.isPaused) {
                this.moveBasket('right');
            }
            else if (event.key === "p" || event.key === "P"){
                this.togglePause();
            }
        },

        // Toggle pause state
        togglePause() {
            this.isPaused = !this.isPaused;
        },
    },
    mounted() {
        setInterval(this.generateFood, 1000); // Generate food every second
        setInterval(this.dropFoods, 45); // Drop foods every 50ms
        window.addEventListener("keydown", this.handleKeyDown); // Add event listener for keydown
    },
    beforeDestroy() {
        window.removeEventListener("keydown", this.handleKeyDown); // Clean up the event listener
        clearInterval(this.foodGenerationInterval);
        clearInterval(this.foodDropInterval);
    },
  };
  </script>
  
  <style>
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
  }
  
  .health-score {
    font-weight: bold;
    margin-bottom: 10px; /* Space between scoreboard and game area */
  }
  
  .game-area {
    width: 500px;
    height: 500px; /* Increased height for the game area */
    background: lightblue;
    border: 2px solid #333;
    position: relative;
    overflow: hidden;
  }
  
  .basket-image {
    width: 50px; /* Adjusted basket size */
  }
  
  .controls {
    margin-top: 10px; /* Space between game area and controls */
  }
  
  .food {
    width: 40px;
    height: 40px;
  }
  
  .health-stage-image {
    height: 60px;
  }
  </style>