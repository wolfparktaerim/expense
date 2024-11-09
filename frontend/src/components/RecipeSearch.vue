<template>
    <!-- <div class="min-h-screen bg-gradient-to-b from-purple-50 to-white"> -->
    <div>
      <!-- Main Container -->
      <div class="container mx-auto py-8 px-4 mt-8">
        <Typewriter />
  
        <!-- Search Section -->
        <section aria-label="Recipe Search" class="max-w-4xl mx-auto">
          <div class="mb-8">
            <label
              for="search"
              class="block text-xl font-medium text-gray-700 text-center mb-4"
            >
              Enter Your Ingredients
              <span class="block text-sm text-gray-500 mt-1"
                >Press Enter or comma to add multiple ingredients</span
              >
            </label>
  
            <!-- Search Input Group -->
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <div class="relative flex-grow max-w-2xl">
                <input
                  type="text"
                  id="search"
                  class="w-full border border-gray-200 rounded-lg py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all shadow-sm hover:border-gray-300"
                  v-model="searchInput"
                  @keydown.enter.prevent="addIngredient"
                  @input="addOnComma"
                  placeholder="e.g., apple, broccoli, chicken..."
                  aria-label="Ingredient search"
                />
                <div
                  v-if="searchInput"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                  @click="searchInput = ''"
                  aria-label="Clear search"
                >
                  X
                </div>
              </div>
  
              <!-- Filter Button -->
              <button
                @click="showDrawer = true"
                class="flex items-center justify-center gap-2 bg-white border-2 border-purple-600 text-purple-600 font-semibold py-3 px-6 rounded-lg hover:bg-purple-50 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                aria-label="Open filters"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clip-rule="evenodd"
                  />
                </svg>
                Filters
              </button>
            </div>
  
            <!-- Ingredient Tags -->
            <div
              class="flex flex-wrap gap-2 mt-4 justify-center"
              role="list"
              aria-label="Selected ingredients"
            >
              <div
                v-for="(ingredient, index) in ingredients"
                :key="index"
                class="group bg-purple-100 rounded-full pl-4 pr-2 py-2 flex items-center transition-all hover:bg-purple-200"
                role="listitem"
              >
                <span class="text-purple-700">{{ ingredient }}</span>
                <button
                  @click="removeIngredient(index)"
                  class="ml-2 p-1 text-purple-400 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full transition-colors"
                  aria-label="Remove ingredient"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
  
        <!-- Buttons: Search Recipe & I'm Feeling Lucky -->
        <div class="flex justify-center space-x-4 mt-4">
            <button class="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed" 
                @click="searchRecipes" :disabled="ingredients.length === 0" title="Search recipes with selected ingredients" style="max-width: 50%;max-height:10%;">
                Search Recipes
            </button>
            <button class="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 max-w-xs" 
                @click="feelingLucky" title="Get a completely random recipe!" style="max-width: 50%;max-height:10%;">
                I'm Feeling Lucky
            </button>
        </div>
        </section>
  
        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="flex flex-col items-center justify-center space-y-4 mt-12"
          role="status"
          aria-label="Loading recipes"
        >
          <PulseLoader :color="loadingColor" />
          <p class="text-gray-600">Finding perfect recipes...</p>
        </div>
  
        <!-- Results Section -->
        <section v-else aria-label="Recipe Results">
          <!-- No Results Message -->
          <div
            v-if="searchTriggered && (recipes.length === 0 || searchNum === 5151)"
            class="flex flex-col items-center justify-center h-64 mt-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 text-purple-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-lg font-medium text-gray-600">No recipes found</p>
            <p class="text-gray-500 mt-2">Try different ingredients or filters</p>
          </div>
  
          <!-- Recipe Grid -->
          <div
            v-if="recipes.length > 0 && searchNum !== 5151"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
            role="grid"
            aria-label="Recipe results"
          >
            <RecipeCard :recipes="recipes" />
          </div>
        </section>
      </div>
  
      <!-- Filter Drawer Backdrop -->
      <div
        v-if="showDrawer"
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity z-40"
        @click="showDrawer = false"
        aria-hidden="true"
      ></div>
  
      <!-- Filter Drawer -->
      <div
        v-if="showDrawer"
        class="fixed inset-x-0 bottom-0 transform transition-transform z-50 sm:top-1/2 sm:-translate-y-1/2 sm:max-w-2xl sm:mx-auto"
        role="dialog"
        aria-label="Recipe filters"
      >
        <div class="bg-white rounded-t-xl sm:rounded-xl shadow-xl p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-800">Filter Recipes</h2>
            <button
              @click="showDrawer = false"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close filters"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
  
          <!-- Filter Groups -->
          <div class="space-y-6">
            <!-- Cuisine & Diet Filters -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  for="cuisine"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Cuisine Type</label
                >
                <select
                  id="cuisine"
                  v-model="selectedCuisine"
                  class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Any Cuisine</option>
                  <option
                    v-for="cuisine in cuisines"
                    :key="cuisine"
                    :value="cuisine"
                  >
                    {{ cuisine }}
                  </option>
                </select>
              </div>
  
              <div>
                <label
                  for="diet"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Dietary Preference</label
                >
                <select
                  id="diet"
                  v-model="selectedDiet"
                  class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Any Diet</option>
                  <option v-for="diet in diets" :key="diet" :value="diet">
                    {{ diet }}
                  </option>
                </select>
              </div>
            </div>
  
            <!-- Intolerances -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3"
                >Intolerances</label
              >
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <label
                  v-for="intolerance in intolerances"
                  :key="intolerance"
                  class="flex items-center space-x-3 text-gray-600 hover:text-gray-900"
                >
                  <input
                    type="checkbox"
                    :value="intolerance"
                    v-model="selectedIntolerances"
                    class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span class="text-sm">{{ intolerance }}</span>
                </label>
              </div>
            </div>
          </div>
  
          <!-- Apply Filters Button -->
          <div class="mt-8">
            <button
              @click="applyFilters"
              class="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import RecipeCard from "./RecipeCard.vue";
  import axios from "axios";
  import Typewriter from "./Typewriter.vue";
  import PulseLoader from "vue-spinner/src/PulseLoader.vue";
  
  export default {
    components: {
      PulseLoader,
      Typewriter,
      RecipeCard,
    },
    data() {
      return {
        searchInput: "",
        ingredients: [],
        selectedCuisine: "",
        cuisines: [
          "African",
          "Asian",
          "American",
          "British",
          "Cajun",
          "Caribbean",
          "Chinese",
          "Eastern European",
          "European",
          "French",
          "German",
          "Greek",
          "Indian",
          "Irish",
          "Italian",
          "Japanese",
          "Jewish",
          "Korean",
          "Latin American",
          "Mediterranean",
          "Mexican",
          "Middle Eastern",
          "Nordic",
          "Southern",
          "Spanish",
          "Thai",
          "Vietnamese",
        ],
        selectedIntolerances: [],
        intolerances: [
          "Dairy",
          "Egg",
          "Gluten",
          "Grain",
          "Peanut",
          "Seafood",
          "Sesame",
          "Shellfish",
          "Soy",
          "Sulfite",
          "Tree Nut",
          "Wheat",
        ],
        selectedDiet: "",
        diets: [
          "Gluten Free",
          "Ketogenic",
          "Vegetarian",
          "Lacto-Vegetarian",
          "Ovo-Vegetarian",
          "Vegan",
          "Pescetarian",
          "Paleo",
          "Primal",
          "Low FODMAP",
        ],
        recipes: [],
        includeTags: "",
        maxNumberOutput: 16,
        searchTriggered: false,
        isLoading: false,
        loadingColor: "#805ad5",
        searchNum: 0,
        showDrawer: false,
      };
    },
    created() {
      const storedRecipes = sessionStorage.getItem("lastSearchResults");
      const searchTriggered = sessionStorage.getItem("searchTriggered");
  
      if (storedRecipes) {
        this.recipes = JSON.parse(storedRecipes);
        this.searchTriggered = JSON.parse(searchTriggered);
      }
  
      window.addEventListener("beforeunload", this.clearSessionStorage);
    },
    methods: {
      addIngredient() {
        const trimmedInput = this.searchInput.trim();
        if (trimmedInput && !this.ingredients.includes(trimmedInput)) {
          this.ingredients.push(trimmedInput);
          this.$nextTick(() => {
            // Announce to screen readers
            this.announceMessage(`Added ${trimmedInput} to ingredients`);
          });
        }
        this.searchInput = "";
      },
  
      addOnComma() {
        if (this.searchInput.includes(",")) {
          const terms = this.searchInput.split(",").map((term) => term.trim());
          terms.forEach((term) => {
            if (term && !this.ingredients.includes(term)) {
              this.ingredients.push(term);
              this.$nextTick(() => {
                this.announceMessage(`Added ${term} to ingredients`);
              });
            }
          });
          this.searchInput = "";
        }
      },
  
      removeIngredient(index) {
        const removedIngredient = this.ingredients[index];
        this.ingredients.splice(index, 1);
        this.$nextTick(() => {
          this.announceMessage(`Removed ${removedIngredient} from ingredients`);
        });
      },
  
      searchRecipes() {
        this.isLoading = true;
        this.announceMessage("Searching for recipes...");
  
        const ingredientQuery = this.ingredients.join(",");
        const cuisineQuery = this.selectedCuisine;
        const intoleranceQuery = this.selectedIntolerances.join(",");
        const dietQuery = this.selectedDiet;
  
        if (ingredientQuery) {
          axios
            .get("https://api.spoonacular.com/recipes/complexSearch", {
              params: {
                apiKey: import.meta.env.VITE_SPOON_API_KEY,
                query: "",
                includeIngredients: ingredientQuery,
                cuisine: cuisineQuery,
                intolerances: intoleranceQuery,
                diet: dietQuery,
                addRecipeInformation: true,
                instructionsRequired: true,
                number: this.maxNumberOutput,
              },
            })
            .then((response) => {
              this.recipes = response.data.results;
              this.recipes.sort((a, b) => b.healthScore - a.healthScore);
              this.isLoading = false;
              this.searchTriggered = true;
              this.searchNum = response.data.totalResults;
  
              // Store results and announce to screen readers
              if (this.searchNum < 2000) {
                sessionStorage.setItem(
                  "lastSearchResults",
                  JSON.stringify(this.recipes)
                );
                sessionStorage.setItem(
                  "searchTriggered",
                  JSON.stringify(this.searchTriggered)
                );
              }
  
              this.$nextTick(() => {
                this.announceMessage(`Found ${this.recipes.length} recipes`);
              });
            })
            .catch((error) => {
              console.error(error);
              this.isLoading = false;
              this.announceMessage("Error searching recipes. Please try again.");
            });
        } else {
          this.showNotification("Please enter at least one ingredient.");
        }
      },
  
      feelingLucky() {
        this.isLoading = true;
        this.searchNum = 0;
        this.announceMessage("Finding a random recipe...");
  
        axios
          .get("https://api.spoonacular.com/recipes/random", {
            params: {
              apiKey: import.meta.env.VITE_SPOON_API_KEY,
              "include-tags": this.includeTags,
            },
          })
          .then((response) => {
            this.recipes = [response.data.recipes[0]];
            this.isLoading = false;
            this.searchTriggered = true;
            this.searchNum = 1;
  
            if (this.searchNum < 2000) {
              sessionStorage.setItem(
                "lastSearchResults",
                JSON.stringify(this.recipes)
              );
              sessionStorage.setItem(
                "searchTriggered",
                JSON.stringify(this.searchTriggered)
              );
            }
  
            this.$nextTick(() => {
              this.announceMessage("Random recipe found");
            });
          })
          .catch((error) => {
            console.error(error);
            this.isLoading = false;
            this.announceMessage(
              "Error finding random recipe. Please try again."
            );
          });
      },
  
      clearSessionStorage() {
        sessionStorage.removeItem("lastSearchResults");
        sessionStorage.removeItem("searchTriggered");
      },
  
      applyFilters() {
        this.showDrawer = false;
        // Create a summary of applied filters for screen readers
        const filters = [];
        if (this.selectedCuisine)
          filters.push(`Cuisine: ${this.selectedCuisine}`);
        if (this.selectedDiet) filters.push(`Diet: ${this.selectedDiet}`);
        if (this.selectedIntolerances.length) {
          filters.push(`Intolerances: ${this.selectedIntolerances.join(", ")}`);
        }
  
        const message = filters.length
          ? `Filters applied: ${filters.join("; ")}`
          : "All filters cleared";
  
        this.announceMessage(message);
      },
  
      showNotification(message) {
        // Add visual notification
        const notification = document.createElement("div");
        notification.className =
          "fixed top-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 z-50";
        notification.textContent = message;
        document.body.appendChild(notification);
  
        // Remove after 3 seconds
        setTimeout(() => {
          notification.style.opacity = "0";
          setTimeout(() => {
            document.body.removeChild(notification);
          }, 500);
        }, 3000);
  
        // Announce to screen readers
        this.announceMessage(message);
      },
  
      announceMessage(message) {
        // Create or update aria-live region for screen reader announcements
        let announcer = document.getElementById("announcer");
        if (!announcer) {
          announcer = document.createElement("div");
          announcer.id = "announcer";
          announcer.setAttribute("aria-live", "polite");
          announcer.setAttribute("aria-atomic", "true");
          announcer.className = "sr-only";
          document.body.appendChild(announcer);
        }
        announcer.textContent = message;
      },
  
      handleKeyboardNavigation(event) {
        // Add keyboard navigation for the filter drawer
        if (this.showDrawer && event.key === "Escape") {
          this.showDrawer = false;
        }
      },
    },
  
    mounted() {
      document.addEventListener("keydown", this.handleKeyboardNavigation);
    },
  
    beforeDestroy() {
      window.removeEventListener("beforeunload", this.clearSessionStorage);
      document.removeEventListener("keydown", this.handleKeyboardNavigation);
    },
  };
  </script>
  
  <style scoped>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  /* Smooth transitions */
  .transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
  
  /* Focus styles for better accessibility */
  :focus-visible {
    outline: 2px solid #805ad5;
    outline-offset: 2px;
  }
  
  /* Custom scrollbar for better visual feedback */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f7fafc;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
  }
  </style>
   