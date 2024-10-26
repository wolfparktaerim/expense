// stores/favorites.js
import { defineStore } from 'pinia';
import { getDatabase, ref, set, remove, get, child } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const db = getDatabase();

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [],
    loading: false
  }),

  actions: {
    async addToFavorites(recipe) {
      try {
        const auth = getAuth();
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        // Store minimal recipe data
        const recipeData = {
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          veryHealthy: recipe.veryHealthy,
          timestamp: Date.now()
        };

        // Save to Firebase Realtime DB
        await set(ref(db, `users/${userId}/favorites/${recipe.id}`), recipeData);
        
        // Update local state
        this.favorites.push(recipeData);
      } catch (error) {
        console.error('Error adding favorite:', error);
        throw error;
      }
    },

    async removeFromFavorites(recipeId) {
      try {
        const auth = getAuth();
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not authenticated');

        // Remove from Firebase Realtime DB
        await remove(ref(db, `users/${userId}/favorites/${recipeId}`));
        
        // Update local state
        this.favorites = this.favorites.filter(recipe => recipe.id !== recipeId);
      } catch (error) {
        console.error('Error removing favorite:', error);
        throw error;
      }
    },

    async loadFavorites() {
      try {
        this.loading = true;
        const auth = getAuth();
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        // Get favorites from Firebase Realtime DB
        const snapshot = await get(child(ref(db), `users/${userId}/favorites`));
        
        if (snapshot.exists()) {
          const favoritesData = snapshot.val();
          this.favorites = Object.values(favoritesData);
        } else {
          this.favorites = [];
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    isFavorite(recipeId) {
      return this.favorites.some(recipe => recipe.id === recipeId);
    }
  }
})