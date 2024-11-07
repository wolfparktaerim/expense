<template class="game-session">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <Navigation></Navigation>
    <div class="game-container flex flex-col items-center min-h-screen bg-gray-100" >
      
    <!-- Scoreboard above the game area -->
    <div class="health-score flex items-center justify-between w-full max-w-lg p-2 bg-white rounded-lg shadow-md mt-1">
      <!-- Health bar -->
      <div class="flex flex-col items-center">
          <span class="text-sm font-medium text-gray-500">Health</span>
          <div class="w-24 bg-gray-200 rounded-full h-3 mt-1">
            <div class="rounded-full h-3" :class="healthColor"  :style="{ width: `${health}%` }"></div>
          </div>
        </div>

      <!-- Health Image (Fixed Width Container) -->
      <div class="flex items-center justify-center mr-14" > <!-- Fixed width for image container -->
        <img :src="healthStageImage" alt="Health Stage" class="health-stage-image" style="height: 100%;max-height:60px;width: auto;" />
      </div>

      <!-- Score Display (Fixed Width Container) -->
      <div class="flex flex-col items-center">
          <span class="text-sm font-medium text-gray-500">Score</span>
          <span class="text-lg font-bold text-purple-600">{{ score }}</span>
      </div>
    </div>
  
      <div ref="gameArea" class="game-area relative w-full max-w-sm md:max-w-md lg:max-w-lg h-64 md:h-72 lg:h-80 bg-blue-200 border-4 border-gray-400 rounded-lg overflow-hidden shadow-lg">
         <!-- Show instructions if game not started -->
        <!-- Start Screen -->
      <div v-if="!isGameStarted" 
        class="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-6">
        <h1 class="text-2xl font-bold mb-4">NutriCatch</h1>
        <h2 class="text-2xl font-bold mb-4">Ready to Eat Healthy?</h2>
        <ul class="text-center mb-6 space-y-2">
          <li>🏃‍♂️ Use arrow keys or buttons to move</li>
          <li>🥗 Catch healthy foods for points</li>
          <li>🍔 Avoid junk foods to stay healthy</li>
          <li>⏸️ Press 'P' to pause anytime</li>
        </ul>
        <button 
          @click="startGame"
          class="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all"
        >
          Start Game!
        </button>
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
      <div class="controls mt-6 flex justify-center space-x-4">
        <button @click="moveBasket('left')" :disabled="isPaused||!isGameStarted" class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed" >⬅️ Move Left</button>

        <button @click="togglePause" class="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        :disabled="!isGameStarted">
          {{ isPaused ? 'Resume' : 'Pause' }}
        </button>
    
        <button @click="moveBasket('right')" :disabled="isPaused||!isGameStarted" class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">➡️ Move Right</button>
      </div>
    </div>
  </template>
  
  <script>
  import Navigation from '../components/Navigation.vue';
  import { useToast } from 'vue-toastification';

  export default {
    components: {
      Navigation,
    },
    data() {
      return {
        toast: useToast(),
          toastConfig: {
              position: "top-right",
              timeout: 5000,
              closeOnClick: true,
              pauseOnFocusLoss: true,
              pauseOnHover: true,
              draggable: true,
              draggablePercent: 0.6,
              showCloseButtonOnHover: true,
              hideProgressBar: true,
              closeButton: "button",
              icon: true,
              rtl: false
          },

        score: 0,
        health: 100, // Starting health
        basketPositionX:50, // Initial basket position
        foods: [],
        basketWidth: 50, // Adjusted basket width
        gameWidth: 500, // Width of the game area
        dropSpeed : 5,

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

      healthColor(){
        if (this.health >= 60) {
          return 'bg-green-500';
        } else if (this.health >= 30) {
          return 'bg-yellow-500';
        } else {
          return 'bg-red-500';
        }
      }
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
          food.y += this.dropSpeed; 
          if (food.y >= 400) { // Set to bottom boundary of game area
            this.checkCollision(food, index);
          }
        });
      },
  
      // Check if food collides with the basket
      checkCollision(food, index) {
        const basketLeft = this.basketPositionX - this.basketWidth;
        const basketRight = this.basketPositionX;
  
        if (
          food.y < 440 &&
          food.y >= 380 && 
          food.x >= basketLeft && 
          food.x <= basketRight
        ) {
          // Collision detected, update score or health
          if (food.isHealthy) {
            if(this.health <= 98){
              this.health += 2; // Regain some health after consuming some healthy food
            }
            this.score += Math.floor(Math.random() * 10) + 5;  // Get a random score
            this.playPointSound();
          } else {
            this.health -= 10;
            this.playHurtSound();
            if (this.health <= 0) {
              this.endGame(); 
              this.playOverSound(); // Play Game Over sound effect
            }
          }
          // Remove food from array after collision
          this.foods.splice(index, 1);
        }
      },
  
      // End game function
      endGame() {
        this.toast.error("Game Over! Your Score: " + this.score, this.toastConfig);
        this.resetGame();
      },
  
      // Reset game
      resetGame() {
        this.health = 100;
        this.score = 0;
        this.foods = [];
        this.dropSpeed = 5;
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
          else if (event.key === "Enter" && !this.isGameStarted){
            this.startGame();
          }
        },

      // Toggle pause state
      togglePause() {
        this.isPaused = !this.isPaused;
      },
      resizeGameArea() {
        // Set the game width dynamically based on window width
        if (window.innerWidth < 600) {
          this.gameWidth = window.innerWidth * 0.9; // e.g., 90% of window width for small screens
        } else {
          this.gameWidth = 500; // Default width for larger screens
        }
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
        window.addEventListener("keydown", this.handleKeyDown); // Add event listener for keydown
        this.bgm = new Audio('/game/sound/gameBGM.mp3');
        this.bgm.loop = true; 
        this.startSound = new Audio('/game/sound/gameStart.mp3');
        this.pointSound = new Audio('/game/sound/getHealthyFood.mp3');
        this.hurtSound = new Audio('/game/sound/getUnhealthyFood.mp3');
        this.overSound = new Audio('/game/sound/gameOver.mp3');

        this.resizeGameArea(); // reset game size based on screen
        window.addEventListener('resize', this.resizeGameArea); 
    },
    beforeRouteLeave(to, from, next) {
      // Call cleanup function to kill component processes before leaving
      this.cleanupGame();
      window.removeEventListener('resize', this.resizeGameArea);
      next();
    },
    beforeDestroy() {
        window.removeEventListener("keydown", this.handleKeyDown); // Clean up the event listener
        clearInterval(this.foodGenerationInterval);
        clearInterval(this.foodDropInterval);
        this.cleanupGame();
        window.removeEventListener('resize', this.resizeGameArea);
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
    margin-bottom: 5px; /* Space between scoreboard and game area */
  }
  
  .game-area {
    max-width: 500px;
    width: 90%; 
    height: 500px;
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

  @media (max-width: 600px) {
    .basket-image{
      width: 40px,
    }
    .basket {
      width: 40px;
    }
    .food {
      width : 40px;
    }
  }


  </style>