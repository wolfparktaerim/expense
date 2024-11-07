<template>
  <Navigation />
  <div class="game-container min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-6">
    
    <!-- Game Header -->
    <div class="text-center mb-4">
      <h1 class="text-3xl font-bold text-purple-600 mb-2">NutriCatch</h1>
      <div class="text-sm text-gray-600">Level: {{ level }}</div>
    </div>

    <!-- Stats Bar -->
    <div class="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-4 mb-4">
      <div class="grid grid-cols-3 gap-4">
        <!-- Health -->
        <div class="flex flex-col items-center">
          <span class="text-sm font-medium text-gray-600 mb-1">Health</span>
          <div class="w-full bg-gray-200 rounded-full h-4">
            <div 
              class="h-4 rounded-full transition-all duration-300"
              :class="healthColor"
              :style="{ width: `${health}%` }"
            ></div>
          </div>
        </div>

        <!-- Character Status -->
        <div class="flex justify-center items-center">
          <img 
            :src="healthStageImage" 
            alt="Health Stage" 
            class="h-12 transition-all duration-300"
            :class="{ 'animate-bounce': health < 30 }"
          />
        </div>

        <!-- Score -->
        <div class="flex flex-col items-center">
          <span class="text-sm font-medium text-gray-600">Score</span>
          <div class="flex items-baseline">
            <span class="text-2xl font-bold text-purple-600">{{ score }}</span>
            <span class="text-sm text-gray-500 ml-1">pts</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Area -->
    <div 
      ref="gameArea" 
      class="relative mx-auto rounded-xl overflow-hidden shadow-xl border-4 border-gray-300"
      :class="{'opacity-75': isPaused}"
      :style="{ width: `${gameWidth}px`, height: `${gameHeight}px` }"
    >
      <!-- Background with parallax clouds -->
      <div class="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-200">
        <div v-for="(cloud, index) in clouds" :key="index"
          class="absolute"
          :style="{
            left: `${cloud.x}px`,
            top: `${cloud.y}px`,
            transform: `scale(${cloud.scale})`,
            opacity: cloud.opacity
          }"
        >
          ☁️
        </div>
      </div>

      <!-- Start Screen -->
      <div v-if="!isGameStarted" 
        class="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-6">
        <h2 class="text-2xl font-bold mb-4">Ready to Eat Healthy?</h2>
        <ul class="text-center mb-6 space-y-2">
          <li>🧺 Use arrow keys or buttons to move the basket</li>
          <li>🥗 Catch healthy food for points</li>
          <li>🍔 Avoid junk food to stay healthy</li>
          <li>⏸️ Press 'P' to pause anytime</li>
        </ul>
        <button 
          @click="startGame"
          class="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all"
        >
          Start Game!
        </button>
      </div>

      <!-- Pause Screen -->
      <div v-if="isPaused && isGameStarted" 
        class="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
        <h2 class="text-3xl font-bold mb-4">Paused</h2>
        <button 
          @click="togglePause"
          class="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-bold"
        >
          Resume
        </button>
      </div>

      <!-- Basket -->
      <div 
        v-if="isGameStarted"
        class="basket absolute bottom-0 transition-all duration-100"
        :style="{ left: `${basketPositionX}px` }"
      >
        <img 
          src="/game/others/basket.png" 
          alt="Basket" 
          class="w-16 h-16 object-contain"
        />
      </div>

  <!-- Updated Falling Foods section -->
  <div 
    v-for="(food, index) in foods" 
    :key="index"
    class="food-container absolute"
    :style="{ 
      top: `${food.y}px`, 
      left: `${food.x}px`
    }"
  >
    <img 
      :src="food.src" 
      alt="Food" 
      class="w-12 h-12 object-contain"
      :style="{
        transform: `rotate(${food.rotation}deg)`
      }"
    />
  </div>

      <!-- Score Popups -->
      <div 
        v-for="popup in scorePopups" 
        :key="popup.id"
        class="absolute text-lg font-bold transition-all duration-500"
        :style="{ 
          top: `${popup.y}px`, 
          left: `${popup.x}px`,
          opacity: popup.opacity,
          transform: `translateY(${-popup.age * 50}px)`
        }"
        :class="popup.isPositive ? 'text-green-500' : 'text-red-500'"
      >
        {{ popup.isPositive ? '+' : '-' }}{{ popup.score }}
      </div>
    </div>

    <!-- Controls -->
    <div class="flex justify-center space-x-4 mt-6">
      <button 
        @click="moveBasket('left')" 
        :disabled="isPaused || !isGameStarted"
        class="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-bold shadow-lg"
      >
        ⬅️ Left
      </button>
      
      <button 
        @click="togglePause"
        :disabled="!isGameStarted"
        class="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white rounded-lg font-bold shadow-lg"
      >
        {{ isPaused ? '▶️ Resume' : '⏸️ Pause' }}
      </button>

      <button 
        @click="moveBasket('right')" 
        :disabled="isPaused || !isGameStarted"
        class="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-bold shadow-lg"
      >
        Right ➡️
      </button>
    </div>
  </div>
</template>

<script>
import Navigation from '../components/Navigation.vue';
import { useToast } from 'vue-toastification';
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'NutriCatch',
  components: { Navigation },
  
  setup() {
    const toast = useToast();
    const gameArea = ref(null);
    
    return {
      toast,
      gameArea
    };
  },

  data() {
    return {
      score: 0,
      health: 100,
      level: 1,
      basketPositionX: 50,
      foods: [],
      scorePopups: [],
      clouds: [],
      basketWidth: 64,
      gameWidth: 500,
      gameHeight: 500,
      dropSpeed: 3,
      isPaused: false,
      isGameStarted: false,
      foodGenerationInterval: null,
      foodDropInterval: null,
      cloudInterval: null,
      
      healthyFoodSrc: [
        '/game/healthy/almond.png', '/game/healthy/apple.png', 
        '/game/healthy/blueberry.png', '/game/healthy/brocolli.png',
        '/game/healthy/carrot.png', '/game/healthy/corn.png',
        '/game/healthy/egg.png', '/game/healthy/salmon.png',
        '/game/healthy/strawberry.png'
      ],
      
      unhealthyFoodSrc: [
        '/game/unhealthy/burger.png', '/game/unhealthy/candy.png',
        '/game/unhealthy/cake-slice.png', '/game/unhealthy/chips.png',
        '/game/unhealthy/donut.png', '/game/unhealthy/french-fries.png',
        '/game/unhealthy/fried-chicken.png', '/game/unhealthy/pizza.png',
        '/game/unhealthy/sausages.png'
      ],

      sounds: {
        bgm: null,
        point: null,
        hurt: null,
        start: null,
        over: null,
      }
    };
  },

  computed: {
    healthStageImage() {
      if (this.health >= 60) return '/game/others/stage_1.png';
      if (this.health >= 30) return '/game/others/stage_2.png';
      return '/game/others/stage_3.png';
    },

    healthColor() {
      if (this.health >= 60) return 'bg-green-500';
      if (this.health >= 30) return 'bg-yellow-500';
      return 'bg-red-500';
    }
  },

  methods: {
    startGame() {
      this.isGameStarted = true;
      this.resetGame();
      this.initializeGameIntervals();
      this.playSound('start');
      this.playSound('bgm');
    },

    resetGame() {
      this.health = 100;
      this.score = 0;
      this.level = 1;
      this.foods = [];
      this.scorePopups = [];
      this.dropSpeed = 3;
      this.generateClouds();
    },

    initializeGameIntervals() {
      this.foodGenerationInterval = setInterval(this.generateFood, 1000);
      this.foodDropInterval = setInterval(this.updateGameState, 16);
      this.cloudInterval = setInterval(this.updateClouds, 50);
    },

    generateFood() {
      if (this.isPaused || !this.isGameStarted) return;

      const isHealthy = Math.random() > 0.4;
      const foodList = isHealthy ? this.healthyFoodSrc : this.unhealthyFoodSrc;
      const randomIndex = Math.floor(Math.random() * foodList.length);

      // Fixed initial position calculation
      const initialX = Math.random() * (this.gameWidth - 48);

      this.foods.push({
        x: initialX,  // This x position will remain constant during fall
        y: -48,
        src: foodList[randomIndex],
        isHealthy,
        rotation: 0,  // Start at 0 rotation
        speed: this.dropSpeed * (0.8 + Math.random() * 0.4),
        rotationSpeed: (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 3) // Random rotation speed and direction
      });
    },

    updateGameState() {
      if (this.isPaused || !this.isGameStarted) return;

      // Update foods
      this.foods.forEach((food, index) => {
        food.y += food.speed;  // Only update vertical position
        food.rotation += food.rotationSpeed;  // Smooth rotation
        
        if (food.y >= this.gameHeight) {
          this.foods.splice(index, 1);
          if (food.isHealthy) {
            this.updateHealth(-5);
            this.createScorePopup(food.x, food.y, 5, false);
          }
        }
        
        this.checkCollision(food, index);
      });

      // Update score popups
      this.scorePopups.forEach((popup, index) => {
        popup.age += 0.016;
        popup.opacity = 1 - popup.age;
        if (popup.age > 1) {
          this.scorePopups.splice(index, 1);
        }
      });

      // Level progression
      if (this.score > this.level * 100) {
        this.levelUp();
      }
    },

    checkCollision(food, index) {
      const basketLeft = this.basketPositionX;
      const basketRight = this.basketPositionX + this.basketWidth;
      
      if (
        food.y + 48 >= this.gameHeight - 50 &&
        food.x + 48 >= basketLeft &&
        food.x <= basketRight
      ) {
        this.foods.splice(index, 1);
        
        if (food.isHealthy) {
          const points = 10 + Math.floor(Math.random() * 5);
          this.score += points;
          this.updateHealth(5);
          this.createScorePopup(food.x, food.y, points, true);
          this.playSound('point');
        } else {
          this.updateHealth(-10);
          this.createScorePopup(food.x, food.y, 10, false);
          this.playSound('hurt');
        }
      }
    },

    updateHealth(amount) {
      this.health = Math.max(0, Math.min(100, this.health + amount));
      if (this.health <= 0) {
        this.endGame();
      }
    },

    createScorePopup(x, y, score, isPositive) {
      this.scorePopups.push({
        id: Date.now(),
        x,
        y: y - 20,
        score,
        isPositive,
        age: 0,
        opacity: 1
      });
    },

    levelUp() {
      this.level++;
      this.dropSpeed += 0.5;
      this.toast.success(`Level ${this.level}! Speed increased!`, {
        timeout: 2000
      });
    },

    generateClouds() {
      for (let i = 0; i < 5; i++) {
        this.clouds.push({
          x: Math.random() * this.gameWidth,
          y: Math.random() * (this.gameHeight / 2),
          speed: 0.2 + Math.random() * 0.3,
          scale: 0.5 + Math.random() * 1,
          opacity: 0.3 + Math.random() * 0.3
        });
      }
    },

    updateClouds() {
      this.clouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x < -50) {
          cloud.x = this.gameWidth + 50;
          cloud.y = Math.random() * (this.gameHeight / 2);
        }
      });
    },

    moveBasket(direction) {
        const moveAmount = 20;
        if (direction === 'left') {
          this.basketPositionX = Math.max(0, this.basketPositionX - moveAmount);
        } else {
          this.basketPositionX = Math.min(
            this.gameWidth - this.basketWidth,
            this.basketPositionX + moveAmount
          );
        }
      },

      togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
          this.pauseSound('bgm');
        } else {
          this.playSound('bgm');
        }
      },

      endGame() {
        this.isGameStarted = false;
        this.pauseSound('bgm');
        this.playSound('over');
        
        this.toast.error(
          `Game Over! Final Score: ${this.score} - Level ${this.level}`, 
          { timeout: 5000 }
        );
        
        clearInterval(this.foodGenerationInterval);
        clearInterval(this.foodDropInterval);
        clearInterval(this.cloudInterval);
      },

      handleKeyDown(event) {
        if (!this.isGameStarted) {
          if (event.key === 'Enter') {
            this.startGame();
          }
          return;
        }

        switch(event.key) {
          case 'ArrowLeft':
            if (!this.isPaused) this.moveBasket('left');
            break;
          case 'ArrowRight':
            if (!this.isPaused) this.moveBasket('right');
            break;
          case 'p':
          case 'P':
            this.togglePause();
            break;
        }
      },

      initializeSounds() {
        this.sounds = {
          bgm: new Audio('/game/sound/gameBGM.mp3'),
          point: new Audio('/game/sound/getHealthyFood.mp3'),
          hurt: new Audio('/game/sound/getUnhealthyFood.mp3'),
          start: new Audio('/game/sound/gameStart.mp3'),
          over: new Audio('/game/sound/gameOver.mp3')
        };
        
        this.sounds.bgm.loop = true;
        
        // Preload all sounds
        Object.values(this.sounds).forEach(sound => {
          sound.load();
        });
      },

      playSound(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
          sound.currentTime = 0;
          sound.play().catch(() => {
            // Ignore autoplay errors
          });
        }
      },

      pauseSound(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
          sound.pause();
        }
      },

      resizeGameArea() {
        const maxWidth = Math.min(window.innerWidth * 0.9, 500);
        this.gameWidth = maxWidth;
        this.gameHeight = Math.min(window.innerHeight * 0.6, 600);
        
        // Adjust basket position if it's now out of bounds
        this.basketPositionX = Math.min(
          this.basketPositionX,
          this.gameWidth - this.basketWidth
        );
      },

      cleanup() {
        // Stop all sounds
        Object.values(this.sounds).forEach(sound => {
          sound.pause();
          sound.currentTime = 0;
        });

        // Clear all intervals
        clearInterval(this.foodGenerationInterval);
        clearInterval(this.foodDropInterval);
        clearInterval(this.cloudInterval);

        // Remove event listeners
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('resize', this.resizeGameArea);
      }
    },

    mounted() {
      this.initializeSounds();
      this.resizeGameArea();
      this.generateClouds();
      
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('resize', this.resizeGameArea);
    },

    beforeUnmount() {
      this.cleanup();
    }
};
</script>

<style scoped>
.game-container {
  user-select: none;
  touch-action: manipulation;
}

.basket {
  transform-origin: bottom center;
  transition: transform 0.1s ease-out;
}

.basket:active {
  transform: scale(0.95);
}
/* Updated food styling */
.food-container {
  will-change: transform;
  pointer-events: none;
}
.food-container img {
  transform-origin: center center;
  transition: transform 0.016s linear;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.food {
  will-change: transform;
  transform-origin: center center; /* Ensure rotation happens around center */
}

/* Updated food positioning to ensure straight falls */
.food img {
  position: relative;
  transform-origin: center center;
}

@media (max-width: 640px) {
  .game-container {
    padding: 1rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}
</style>
