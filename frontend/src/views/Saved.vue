<template>
        <Navigation />
      <!-- Header Section -->
      <div class="mt-8 mb-8 text-center">
        <h1 class="text-3xl font-bold text-purple-600 mb-2">Saved Recipes</h1>
        <p class="text-gray-600">Your favorite recipes all in one place</p>
      </div>
  
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <PulseLoader :color="loadingColor"></PulseLoader>
      </div>
  
      <!-- Error State -->
      <div v-else-if="error" class="text-center text-red-500 p-4">
        {{ error }}
      </div>
  
      <!-- No Favorites State -->
      <div v-else-if="!savedRecipes.length" class="text-center py-12">
        <img src="../../public/icon/remove_favorite.png" alt="No favorites" class="w-24 h-24 mx-auto mb-4">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">No Saved Recipes Yet</h2>
        <p class="text-gray-600 mb-4">Start exploring and save your favorite recipes!</p>
        <router-link 
          to="/search" 
          class="inline-block bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          Discover Recipes
        </router-link>
      </div>
  
      <!-- Recipes Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <RecipeCard
          v-for="recipe in savedRecipes"
          :key="recipe.id"
          :recipes="[recipe]"
          @view-details="handleViewDetails"
          @toggle-favorite="handleToggleFavorite"
        />
  
      <!-- Confirmation Modal -->
      <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4">Remove Recipe?</h3>
          <p class="text-gray-600 mb-6">Are you sure you want to remove this recipe from your saved recipes?</p>
          <div class="flex justify-end space-x-4">
            <button 
              @click="showConfirmModal = false" 
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button 
              @click="confirmRemove" 
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
  import Navigation from "../components/Navigation.vue";
  import RecipeCard from '../components/RecipeCard.vue';
  import { useFavoritesStore } from '../stores/favorites';
  import { mapState, mapActions } from 'pinia';
  
  export default {
    name: 'SavedPage',
    
    components: {
      RecipeCard,
      PulseLoader,
      Navigation,
    },
  
    data() {
      return {
        loading: false,
        error: null,
        loadingColor: '#7C3AED', // Purple-600
        showConfirmModal: false,
        recipeToRemove: null
      };
    },
  
    computed: {
      ...mapState(useFavoritesStore, ['favorites']),
      
      savedRecipes() {
        return this.favorites;
      }
    },
  
    methods: {
      ...mapActions(useFavoritesStore, ['loadFavorites', 'removeFromFavorites']),
  
      async fetchSavedRecipes() {
        try {
          this.loading = true;
          this.error = null;
          await this.loadFavorites();
        } catch (error) {
          this.error = 'Failed to load saved recipes. Please try again later.';
          console.error('Error loading saved recipes:', error);
        } finally {
          this.loading = false;
        }
      },
  
      handleViewDetails(recipe) {
        this.$router.push(`/recipe/${recipe.id}`);
      },
  
      handleToggleFavorite(recipe) {
        this.recipeToRemove = recipe;
        this.showConfirmModal = true;
      },
  
      async confirmRemove() {
        if (!this.recipeToRemove) return;
        
        try {
          await this.removeFromFavorites(this.recipeToRemove.id);
          this.showConfirmModal = false;
          this.recipeToRemove = null;
        } catch (error) {
          this.error = 'Failed to remove recipe. Please try again.';
          console.error('Error removing recipe:', error);
        }
      }
    },
  
    async created() {
      await this.fetchSavedRecipes();
    },
  
    beforeUnmount() {
      // Clean up any remaining state
      this.showConfirmModal = false;
      this.recipeToRemove = null;
    }
  };
  </script>