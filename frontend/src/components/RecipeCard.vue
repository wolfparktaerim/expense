<template>
    <div v-for="recipe in recipes" 
         :key="recipe.id" 
         class="recipe-card bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col mx-auto relative">
      
      <!-- Recipe Image Container -->
      <div class="recipe-image-container">
          <img :src="recipe.image" 
               :alt="recipe.title" 
               class="w-full h-full object-cover transition-transform duration-300 hover:scale-110">
          
          <!-- Image Overlay -->
          <div v-if="hasQuickInfo(recipe)"
               class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
              <div class="text-white text-center p-4">
                  <p v-if="recipe.readyInMinutes" class="font-medium mb-2">{{ recipe.readyInMinutes }} mins</p>
                  <p v-if="recipe.servings" class="text-sm">{{ recipe.servings }} servings</p>
              </div>
          </div>
      </div>

      <!-- Badges Section -->
      <div class="absolute top-3 right-3 flex flex-col gap-2">
          <div v-if="recipe.veryHealthy" 
               class="badge-container group">
              <div class="bg-white rounded-full p-2 shadow-md border border-gray-300">
                  <img src="/icon/healthy.png" width="24" height="24" alt="Healthy">
              </div>
              <span class="badge-tooltip">Healthy Choice!</span>
          </div>
          
          <!-- Vegetarian Badge -->
          <div v-if="recipe.vegan" 
               class="badge-container group">
              <div class="bg-white rounded-full p-2 shadow-md border border-gray-300">
                <img src="/icon/vegan.png" width="24" height="24" alt="Vegan">
              </div>
              <span class="badge-tooltip">Vegan Dish</span>
          </div>

          <!-- Popular Badge -->
          <div v-if="recipe.popular" 
               class="badge-container group">
              <div class="bg-white rounded-full p-2 shadow-md border border-gray-300">
                <img src="/icon/popular.png" width="24" height="24" alt="Popular">
              </div>
              <span class="badge-tooltip">Popular Dish</span>
          </div>

          <!-- Cheap Badge -->
          <div v-if="recipe.cheap" 
               class="badge-container group">
              <div class="bg-white rounded-full p-2 shadow-md border border-gray-300">
                <img src="/icon/cheap.png" width="24" height="24" alt="Cheap">
              </div>
              <span class="badge-tooltip">Cheap to make</span>
          </div>
      </div>

      <!-- Content Section -->
      <div class="recipe-content p-4">
          <h3 class="text-lg font-bold text-purple-600 line-clamp-2 mb-2 hover:text-purple-700 cursor-pointer"
              @click="viewRecipeDetails(recipe)">
              {{ recipe.title }}
          </h3>
          <p v-if="recipe.cuisines && recipe.cuisines.length" 
             class="text-sm text-gray-600 mb-2 line-clamp-1">
              {{ recipe.cuisines.join(', ') }}
          </p>
      </div>

      <!-- Action Buttons -->
      <div class="recipe-actions p-4 flex justify-between items-center border-t border-gray-100">
          <button @click="toggleFavorite(recipe)"
                  class="favorite-btn"
                  :class="{ 'is-favorite': checkIsFavorite(recipe.id) }"
                  :disabled="isLoading">
              <img :src="checkIsFavorite(recipe.id) ? '/icon/remove_favorite.png' : '/icon/add_favorite.png'"
                   width="35"
                   height="35"
                   :alt="checkIsFavorite(recipe.id) ? 'Remove from Favorites' : 'Add to Favorites'"
                   class="transition-transform duration-200">
          </button>

          <button @click="viewRecipeDetails(recipe)"
                  class="view-recipe-btn bg-purple-600 text-white py-2 px-4 rounded-lg flex-grow ml-4 hover:bg-purple-700 transition-colors duration-200"
                  :disabled="isLoading">
              <span v-if="!isLoading">View Recipe</span>
              <PulseLoader v-else :color="'#ffffff'" :size="'8px'" />
          </button>
      </div>
    </div>
</template>

<style scoped>
.recipe-card {
  width: 100%; /* Instead of fixed 320px */
  max-width: 320px; /* Maintain maximum width */
  height: 380px;
  backface-visibility: hidden;
}

.recipe-card.loading {
  pointer-events: none;
  opacity: 0.7;
}

.recipe-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.recipe-content {
  height: 100px;
  overflow: hidden;
}

.recipe-actions {
  height: 80px;
}

.badge-container {
  position: relative;
}

.badge-tooltip {
  position: absolute;
  left: -100%;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  transition: all 0.2s ease;
  pointer-events: none;
  white-space: nowrap;
}

.badge-container:hover .badge-tooltip {
  opacity: 1;
  left: -120%;
}

.favorite-btn {
  position: relative;
  overflow: hidden;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.favorite-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.favorite-btn:hover::before {
  opacity: 1;
}

.favorite-btn.is-favorite img {
  filter: drop-shadow(0 0 2px rgba(168, 85, 247, 0.5));
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.view-recipe-btn:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.favorite-btn.is-favorite:hover img {
  animation: pulse 1s infinite;
}
</style>

<script>
import { useFavoritesStore } from '../stores/favorites';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import { useToast } from 'vue-toastification';

export default {
  name: 'RecipeCard',
  components: {
      PulseLoader
  },
  props: {
      recipes: {
          type: Array,
          required: true,
          validator: (value) => {
              return value.every(recipe => 
                  recipe.id && 
                  recipe.title && 
                  recipe.image
              );
          }
      }
  },
  emits: ['view-details', 'toggle-favorite'],
  data() {
      return {
          error: null,
          favorites: [],
          loading: false,
          favoritesStore: null,
          isLoading: false,
          loadingColor: '#805ad5',
          toast: useToast(),
          toastConfig: {
              position: "top-right",
              timeout: 2000,
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
          }
      };
  },
  created() {
      this.favoritesStore = useFavoritesStore();
      this.favorites = this.favoritesStore.favorites;
      this.loading = this.favoritesStore.loading;
  },
  mounted() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
          if (user) this.loadFavorites();
      });
      this.watchStoreChanges();
  },
  methods: {
      hasQuickInfo(recipe) {
          return Boolean(recipe.readyInMinutes || recipe.servings);
      },
      watchStoreChanges() {
          this.favoritesStore.$subscribe((mutation, state) => {
              this.favorites = state.favorites;
              this.loading = state.loading;
          });
      },
      loadFavorites() {
          this.favoritesStore.loadFavorites();
      },
      async viewRecipeDetails(recipe) {
          if (this.isLoading) return;
          
          this.isLoading = true;
          try {
              await this.$router.push({ 
                  path: `/recipe/${recipe.id}`,
                  query: { source: 'card' }
              });
              this.$emit('view-details', recipe);
          } catch (error) {
              this.toast.error('Failed to load recipe details', this.toastConfig);
              console.error('Navigation error:', error);
          } finally {
              this.isLoading = false;
          }
      },
      async toggleFavorite(recipe) {
          if (this.isLoading) return;

          const auth = getAuth();
          if (!auth.currentUser) {
              this.toast.info('Please log in to save favorites', this.toastConfig);
              this.$router.push('/login');
              return;
          }

          try {
              if (this.checkIsFavorite(recipe.id)) {
                  await this.favoritesStore.removeFromFavorites(recipe.id);
                  this.toast.success('Removed from favorites', this.toastConfig);
              } else {
                  await this.favoritesStore.addToFavorites(recipe);
                  this.toast.success('Added to favorites', this.toastConfig);
              }
              this.$emit('toggle-favorite', recipe);
          } catch (error) {
              this.toast.error('Failed to update favorites', this.toastConfig);
              console.error('Favorite toggle error:', error);
          }
      },
      checkIsFavorite(recipeId) {
          return this.favoritesStore.isFavorite(recipeId);
      }
  },
  beforeDestroy() {
      if (this.favoritesStore.$subscribe) {
          this.favoritesStore.$subscribe()();
      }
  }
};
</script>