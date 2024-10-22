<template>

    <!-- Search Engine -->
    <div class="container mx-auto py-8 px-4 mt-12">
        <Typewriter />

        <!-- Cuisine Dropdown -->
        <div class="mb-4 text-right">
            <label class="text-sm text-gray-600 mr-2">Filter by cuisine</label>
            <select v-model="selectedCuisine" class="border border-gray-300 rounded-md py-2 px-4 bg-white text-gray-700 focus:ring-2 focus:ring-purple-500">
                <option value="">Any Cuisine</option>
                <option v-for="cuisine in cuisines" :value="cuisine">{{ cuisine }}</option>
            </select>
        </div>

        <!-- Ingredients Search Input -->
        <div class="mb-6">
            <label for="search" class="block text-gray-700 text-sm mb-2" style="text-align: center;">Enter Ingredients (press "," or press 'Enter' or press space to separate different ingredients):</label>
            <div class="flex justify-center mt-4">
                <input type="text" id="search" class="w-1/2 border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:ring-2 focus:ring-purple-500" 
                    v-model="searchInput" @keydown.enter.prevent="addIngredient" @keydown.space.prevent="addIngredient" @input="addOnComma" placeholder="e.g., Carrot, Broccoli, Chicken">
            </div>

            <!-- Display ingredients as tags -->
            <div class="flex flex-wrap mt-4 justify-center">
                <div v-for="(ingredient, index) in ingredients" class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full m-1 inline-flex items-center">
                    {{ ingredient }}
                    <button @click="removeIngredient(index)" class="ml-2 text-purple-700 hover:text-purple-900">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Search & Feeling Lucky Buttons -->
        <div class="flex justify-center space-x-4 mt-4">
            <button class="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed" 
                @click="searchRecipes" :disabled="ingredients.length === 0" style="max-width: 25%;max-height:10%;">
                Search Recipes
            </button>
            <button class="bg-purple-400 text-white font-bold py-2 px-4 rounded hover:bg-purple-500 focus:ring-2 focus:ring-purple-400 max-w-xs" 
                @click="feelingLucky" style="max-width: 25%;max-height:10%;">
                I'm Feeling Lucky
            </button>
        </div>

        <!-- Display Recipe Results -->
        <!-- <div v-if="recipes.length > 0" class="mt-8">
            <h5 class="text-lg font-bold text-purple-600 mb-4">Recipes Found:</h5>
            <div v-for="recipe in recipes" class="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center">
                <img :src="recipe.image" alt="Recipe image" class="w-16 h-16 rounded-md mr-4">
                <h6 class="text-gray-800 font-semibold">{{ recipe.title }}</h6>
            </div>
        </div> -->


        <!-- Display Recipe Results using cards -->
        <div v-if="recipes.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4 mt-8 justify-center">

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

            <!-- View Details Button -->
            <div class="p-4">
                <button @click="viewRecipeDetails(recipe)" class="bg-purple-600 text-white py-2 px-3 rounded w-full hover:bg-purple-700 transition-colors duration-200 text-sm">
                    View Recipe Details
                </button>
            </div>
        </div>
        </div>

        <!-- Show "No Results Found" if no data retrieved from the API -->
        <div v-if="searchTriggered && recipes.length === 0" class="flex justify-center items-center h-64 mt-3">
            <p class="text-lg font-bold text-purple-600 ">No Results Found</p>
        </div>

    </div>

</template>

<script>
    import axios from 'axios';
    import Typewriter from './Typewriter.vue';
    const apiKey = import.meta.env.VITE_SPOON_API_KEY;
    export default{
        components: {
            Typewriter,
        },
        data() {
            return {
                // Input for ingredients
                searchInput: '',

                // Selected ingredients list
                ingredients: [],

                // Selected cuisine
                selectedCuisine: '',

                // Predefined list of cuisines (available cuisines from spoonacular API)
                cuisines: ['African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'],

                // Recipe results
                recipes: [],

                // tags for random recipe
                includeTags : "",

                // has user search anything yet?
                searchTriggered : false,

            };
        },
        computed : {
        },
        methods: {
            // Add ingredient when pressing Enter or comma
            addIngredient() {
                const trimmedInput = this.searchInput.trim();
                if (trimmedInput !== '' && !this.ingredients.includes(trimmedInput)) {
                    this.ingredients.push(trimmedInput);
                }
                this.searchInput = '';  // Clear input field
            },

            // Automatically add ingredient when user types a comma
            addOnComma() {
                if (this.searchInput.includes(',')) {
                    const terms = this.searchInput.split(',').map(term => term.trim());
                    terms.forEach(term => {
                        if (term && !this.ingredients.includes(term)) {
                            this.ingredients.push(term);
                        }
                    });
                    this.searchInput = '';  // Clear input field after processing
                }
            },

            // Remove ingredient by index
            removeIngredient(index) {
                this.ingredients.splice(index, 1);
            },

            // Search recipes using ingredients and cuisine
            searchRecipes() {
                this.searchTriggered = true;
                const ingredientQuery = this.ingredients.join(',');
                const cuisineQuery = this.selectedCuisine;
                const intoleranceQuery = "";
                const dietQuery = "";

                if (ingredientQuery) {
                    axios.get('https://api.spoonacular.com/recipes/complexSearch', {
                        params: {
                            apiKey : import.meta.env.VITE_SPOON_API_KEY,
                            query: "",
                            includeIngredients : ingredientQuery,
                            cuisine: cuisineQuery,
                            intolerances : intoleranceQuery,
                            diet : dietQuery,
                            addRecipeInformation : true,
                            instructionsRequired: true,

                            // change the number of expected results shown
                            number : 40,
                        }
                    })
                    .then(response => {
                        console.log(response.data);
                        this.recipes = response.data.results;
                        this.recipes.sort(function(a, b){return b.healthScore - a.healthScore;}) ;
                        console.log(this.recipes);

                    })
                    .catch(error => {
                        console.error(error);
                    });
                } else {
                    alert("Please enter at least one ingredient.");
                }
            },

            // I'm feeling lucky (random recipe)
            feelingLucky() {
                axios.get('https://api.spoonacular.com/recipes/random', {
                    params: {
                        apiKey: import.meta.env.VITE_SPOON_API_KEY,
                        'include-tags' : this.includeTags,
                    }
                })
                .then(response => {
                    console.log(response.data);
                    this.recipes = [response.data.recipes[0]];  // Pick the first random recipe
                })
                .catch(error => {
                    console.error(error);
                });
            },

            // Go to the recipe details page for the specific recipe
            viewRecipeDetails(recipe){
                this.$router.push({ path: `/recipe/${recipe.id}` });
            },

        }
    }


</script>