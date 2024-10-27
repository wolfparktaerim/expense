<!-- RecipeCard.vue -->
<!-- Recipe Card Display under Search Results and Favorites -->

<template>
    <!-- Display Recipe Results using cards -->
    <div v-for="recipe in recipes" :key="recipe.id" class="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between mx-auto relative" style="width: 250px; height: 350px;">

        <!-- Recipe Image -->
        <div class="relative" style="padding-top: 75%; position: relative;">
            <img :src="recipe.image" alt="Recipe Image" class="absolute top-0 left-0 w-full h-full object-cover">
        </div>

        <!-- Title Section -->
        <div class="p-4 flex-1">
            <h3 class="text-sm font-bold text-purple-600 line-clamp-2">{{ recipe.title }}</h3>
        </div>

        <!-- Healthy Icon with background -->
        <div v-if="recipe.veryHealthy" class="absolute top-3 right-3 bg-green-300 rounded-full p-2 group" style="background-size: cover;">
            <img src="../../public/icon/healthy.png" width="24px" height="24px" alt="Healthy Icon">
            <!-- Hidden text, shown on hover -->
            <div class="absolute left-1/2 transform -translate-x-1/2 top-10 bg-green-600 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Healthy choice!
            </div>
        </div>

        <!-- Button Section:  add to favorite + view recipe details-->
        <div class="p-4 flex justify-between">

            <!-- !!!!!!!! WARNING: THIS ADD/REMOVE FAVORITE IS NOT COMPLETED, IT NEEDS USER BACKEND DATA ABOUT FAVORITES -->
            <!-- add/remove favorite -->
            <img
                @click="toggleFavorite(recipe)"
                :src="checkIsFavorite(recipe.id) ? '/icon/remove_favorite.png' : '/icon/add_favorite.png'"
                width="35"
                height="auto"
                alt="Favorite Icon"
                class="cursor-pointer transition-transform duration-200 hover:scale-110"
                :title="checkIsFavorite(recipe.id) ? 'Remove from Favorites' : 'Add to Favorites'"
            />
              <!-- loading indicator -->
              <div v-if="isLoading" class="text-center flex justify-center items-center h-32 mt-3">
                <PulseLoader :color="loadingColor"></PulseLoader>
            </div>
            
            <!-- Error message display -->
            <div v-if="error" class="text-red-500 text-sm mt-2">
                {{ error }}
            </div>

             <!-- View recipe details button and spinner -->
                <button @click="viewRecipeDetails(recipe)" class="bg-purple-600 text-white py-2 px-3 ml-5 rounded w-full hover:bg-purple-700 transition-colors duration-200 text-sm">
                    View Recipe Details
                </button>
                <PulseLoader v-if="isLoading" :color="loadingColor" class="absolute inset-0 m-auto" />
            </div>

    </div>
</template>


<script>
import { useFavoritesStore } from '../stores/favorites';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

export default {
  props: {
    recipes: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      error: null,
      favorites: [],
      loading: false,
      favoritesStore: null,
      isLoading: false, // Spinner control for viewing recipe details
      loadingColor: '#805ad5'
    };
  },

  created() {
    // Initialize the store
    this.favoritesStore = useFavoritesStore();
    
    // Sync the store's state with component data
    this.favorites = this.favoritesStore.favorites;
    this.loading = this.favoritesStore.loading;
  },

  mounted() {
    // Load favorites when component mounts and user is authenticated
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.loadFavorites();
      }
    });

    // Watch store changes
    this.watchStoreChanges();
  },

  methods: {
    watchStoreChanges() {
      // Manual store watching since we're not using storeToRefs
      this.favoritesStore.$subscribe((mutation, state) => {
        this.favorites = state.favorites;
        this.loading = state.loading;
      });
    },

    loadFavorites() {
      this.favoritesStore.loadFavorites();
    },

async viewRecipeDetails(recipe) {
      this.isLoading = true; // Start spinner
      try {
        await this.$router.push({ path: `/recipe/${recipe.id}` });
      } catch (error) {
        console.error('Error navigating to recipe details:', error);
      } finally {
        this.isLoading = false; // Stop spinner
      }
    },

    async toggleFavorite(recipe) {
      try {
        const auth = getAuth();
        if (!auth.currentUser) {
          // Handle unauthenticated user - redirect to login
          this.$router.push('/login');
          return;
        }

        if (this.checkIsFavorite(recipe.id)) {
          await this.favoritesStore.removeFromFavorites(recipe.id);
        } else {
          await this.favoritesStore.addToFavorites(recipe);
        }
      } catch (error) {
        this.error = error.message;
        console.error('Error toggling favorite:', error);
      }
    },

    checkIsFavorite(recipeId) {
      return this.favoritesStore.isFavorite(recipeId);
    }
  },

  computed: {
    isLoading() {
      return this.loading;
    }
  },

  // Clean up subscriptions when component is destroyed
  beforeDestroy() {
    if (this.favoritesStore.$subscribe) {
      this.favoritesStore.$subscribe()();
    }
  }
};
</script>

<style scoped>
/* Additional styles for button decorations */
    button {
    display: flex;
    align-items: center;
    justify-content: center;
    }

    button:hover img {
    filter: brightness(1.2); /* Brighten the icon on hover */
    }

    button:hover {
    transform: scale(1.05); /* Slightly enlarge the button on hover */
    }

    .line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    }
</style>