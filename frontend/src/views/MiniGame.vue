<template>
    <Navigation></Navigation>
    <div class="game-container flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <!-- Scoreboard above the game area -->
      <div class="health-score flex items-center justify-between w-full max-w-md p-4 mb-4 bg-white rounded-lg shadow-md">
        <span class="text-lg font-semibold"><p>Health: {{ health }}</p></span>
        <span><img :src="healthStageImage" alt="Health Stage" class="health-stage-image" /></span>
        <span class="text-lg font-semibold">Score: {{ score }}</span>
      </div>
  
      <div ref="gameArea" class="game-area relative w-80 h-80 sm:w-96 sm:h-96 bg-blue-200 border-4 border-gray-400 rounded-lg overflow-hidden shadow-lg">

         <!-- Show instructions if game not started -->
        <div v-if="!isGameStarted" class="instructions text-center p-6 text-gray-700" >
            <h2 class="text-2xl font-bold mb-4">Instructions</h2>
            <p>Use the left and right arrow keys or the buttons below to move the basket.</p>
            <p>You can press "P" or the button "Pause" to pause the game.</p>
            <p>Catch as many as healthy foods to gain points and avoid unhealthy foods to maintain your health!</p>
            <br>
            <br>
            <button @click="startGame" class="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">Start</button>
        </div>

        <!-- Basket -->
        <div v-if="isGameStarted"  class="basket absolute bottom-0 left-1/2 transform -translate-x-1/2" :style="{ left: basketPositionX + 'px' }">
          <img src="/game/others/basket.png" alt="Basket" class="basket-image w-12" />
        </div>
  
        <!-- Falling Foods -->
        <div v-if="isGameStarted" v-for="(food, index) in foods" :key="index" class="food absolute" :style="{ top: food.y + 'px', left: food.x + 'px' }">
          <img :src="food.src" alt="Food" class="w-10 h-10"/>
        </div>
      </div>
  
      <!-- Control Buttons below the game area -->
      <div class="controls mt-6 space-x-4">
        <button @click="moveBasket('left')" :disabled="isPaused" class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">⬅️ Move Left</button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button @click="moveBasket('right')" :disabled="isPaused" class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">➡️ Move Right</button>
        <br>
        <button @click="togglePause" class="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 mt-4 block mx-auto">{{ isPaused ? 'Resume' : 'Pause' }}</button>
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
        bgm: null,
        pointSound: null,
        hurtSound: null,
        startSound: null,
        overSound: null,
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
            this.health += 2;
            this.score += Math.floor(Math.random() * 10) + 5;
            this.playPointSound();
          } else {
            this.health -= 10;
            this.playHurtSound();
            if (this.health <= 0) {
              this.endGame();
              this.playOverSound();
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
        if (this.bgm) this.bgm.currentTime = 0; 
        if (this.bgm) this.bgm.pause();
      },
  
       // Start the game
      startGame() {
          this.isGameStarted = true;
          this.playStartSound();
          this.playBGM();
          this.foodGenerationInterval = setInterval(this.generateFood, 1000); // Generate food every second
          this.foodDropInterval = setInterval(this.dropFoods, 50); // Drop foods every 50ms
      },

      playBGM() {
        if (this.bgm) this.bgm.play();
      },
      pauseBGM() {
        if (this.bgm) this.bgm.pause();
      },
      playPointSound() {
        if (this.pointSound) this.pointSound.currentTime = 0; 
        this.pointSound.play();
      },
      playHurtSound() {
        if (this.hurtSound) this.hurtSound.currentTime = 0;
        this.hurtSound.play();
      },
      playStartSound(){
        if (this.startSound) this.startSound.currentTime = 0; 
        this.startSound.play();
      },
      playOverSound(){
        if (this.overSound) this.overSound.currentTime = 0; 
        this.overSound.play();
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

      cleanupGame() {
        // Stop all sounds
        if (this.bgm) this.bgm.pause();
        if (this.pointSound) this.pointSound.pause();
        if (this.hurtSound) this.hurtSound.pause();
        if (this.startSound) this.startSound.pause();
        if (this.overSound) this.overSound.pause();

        // Clear all intervals
        clearInterval(this.foodGenerationInterval);
        clearInterval(this.foodDropInterval);
        
        // Nullify audio objects to ensure no memory leaks
        this.bgm = null;
        this.pointSound = null;
        this.hurtSound = null;
        this.startSound = null;
        this.overSound = null;
      },
    },
    mounted() {
        setInterval(this.generateFood, 1000); // Generate food every second
        setInterval(this.dropFoods, 45); // Drop foods every 50ms
        window.addEventListener("keydown", this.handleKeyDown); // Add event listener for keydown
        this.bgm = new Audio('/game/sound/gameBGM.mp3');
        this.bgm.loop = true; 
        this.startSound = new Audio('/game/sound/gameStart.mp3');
        this.pointSound = new Audio('/game/sound/getHealthyFood.mp3');
        this.hurtSound = new Audio('/game/sound/getUnhealthyFood.mp3');
        this.overSound = new Audio('/game/sound/gameOver.mp3');
    },
    beforeRouteLeave(to, from, next) {
      // Call cleanup function to kill component processes before leaving
      this.cleanupGame();
      next();
    },
    beforeDestroy() {
        window.removeEventListener("keydown", this.handleKeyDown); // Clean up the event listener
        clearInterval(this.foodGenerationInterval);
        clearInterval(this.foodDropInterval);
        this.cleanupGame();
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