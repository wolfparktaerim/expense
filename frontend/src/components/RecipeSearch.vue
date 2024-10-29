    <template>

        <!-- Search Engine -->
        <div class="container mx-auto py-8 px-4 mt-12">
            <Typewriter />
            <RecipeCard />

            <!-- Cuisine Dropdown -->
            <div class="mb-4 text-right">
                <label class="text-sm text-gray-600 mr-2">Select Cuisine</label>
                <select v-model="selectedCuisine" class="border border-gray-300 rounded-md py-2 px-4 bg-white text-gray-700 focus:ring-2 focus:ring-purple-500">
                    <option value="">Any Cuisine</option>
                    <option v-for="cuisine in cuisines" :value="cuisine">{{ cuisine }}</option>
                </select>
            </div>

            <!-- Ingredients Search Input -->
            <div class="mb-6">
                <label for="search" class="block text-gray-600 text-lg mb-2" style="text-align: center;">Enter Ingredients (press "," or press 'Enter' or press space to separate different ingredients):</label>
                <div class="flex justify-center mt-4">
                    <input type="text" id="search" class="w-1/2 border border-gray-300 rounded-md py-2 px-4 text-gray-600 focus:ring-2 focus:ring-purple-500" 
                        v-model="searchInput" @keydown.enter.prevent="addIngredient" @keydown.space.prevent="addIngredient" @input="addOnComma" placeholder="Apple, broccoli, chicken...">
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

            <div class="flex justify-center space-x-4 mt-4">
                <button class="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed sm:w-[35%] sm:h-[40px] sm:py-1.5 sm:px-6" 
                    @click="searchRecipes" :disabled="ingredients.length === 0">
                    Search Recipes
                </button>
                <button class="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 focus:ring-2 focus:ring-purple-600 sm:w-[35%] sm:h-[40px] sm:py-1.5 sm:px-6" 
                    @click="feelingLucky">
                    I'm Feeling Lucky
                </button>
            </div>


            <div v-if="isLoading" class="text-center flex justify-center items-center h-32 mt-3">
                <PulseLoader :color="loadingColor"></PulseLoader>
            </div>
            
            <div v-else>
                <!-- Show "No Results Found" if no data retrieved from the API -->
                <div v-if="searchTriggered && searchNum == 5151" class="flex justify-center items-center h-64 mt-3">
                    <p class="text-lg font-bold text-purple-600 ">No Results Found</p>
                </div>

                <!-- Display Recipe Results using cards -->
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
                    <RecipeCard :recipes="recipes"/>
                </div>
            </div>
        </div>

    </template>

    <script>
        import RecipeCard from './RecipeCard.vue';
        import axios from 'axios';
        import Typewriter from './Typewriter.vue';
        import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
        export default{
            components: {
                PulseLoader,
                Typewriter,
                RecipeCard,
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

                    isLoading: false,
                    loadingColor: '#805ad5',
                    searchNum: 0
                };
            },
            created(){
                // Check if there's existing search results in sessionStorage
                const storedRecipes = sessionStorage.getItem('lastSearchResults');
                const searchTriggered = sessionStorage.getItem('searchTriggered');

                if (storedRecipes) {
                    this.recipes = JSON.parse(storedRecipes);
                    this.searchTriggered = JSON.parse(searchTriggered);
                }
                
                // Clear sessionStorage on page refresh
                window.addEventListener('beforeunload', this.clearSessionStorage);
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

                    this.isLoading = true
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
                                number : 5,
                            }
                        })
                        .then(response => {
                            console.log(response.data);
                            this.recipes = response.data.results;
                            this.recipes.sort(function(a, b){return b.healthScore - a.healthScore;}) ;
                            console.log(this.recipes);
                            this.isLoading = false;
                            this.searchTriggered = true;
                            this.searchNum = response.data.totalResults;

                            // store the search results
                            sessionStorage.setItem('lastSearchResults', JSON.stringify(this.recipes));
                            this.searchTriggered = true;
                            sessionStorage.setItem('searchTriggered', JSON.stringify(this.searchTriggered));
                        
                        })
                        .catch(error => {
                            console.error(error);
                            this.isLoading = false;
                        });
                    } else {
                        alert("Please enter at least one ingredient.");
                    }
                },

                // I'm feeling lucky (random recipe)
                feelingLucky() {
                    this.isLoading = true
                    this.searchNum = 0;
                    axios.get('https://api.spoonacular.com/recipes/random', {
                        params: {
                            apiKey: import.meta.env.VITE_SPOON_API_KEY,
                            'include-tags' : this.includeTags,
                        }
                    })
                    .then(response => {
                        console.log(response.data);
                        this.recipes = [response.data.recipes[0]];  // Pick the first random recipe
                        this.isLoading = false;
                        // store the search result
                        sessionStorage.setItem('lastSearchResults', JSON.stringify(this.recipes));
                        this.searchTriggered = true;
                        sessionStorage.setItem('searchTriggered', JSON.stringify(this.searchTriggered));
                    })
                    .catch(error => {
                        console.error(error);
                        this.isLoading = false;
                    });
                },
                clearSessionStorage() {
                    sessionStorage.removeItem('lastSearchResults');
                    sessionStorage.removeItem('searchTriggered');
                }
            },
            beforeRouteLeave(to, from, next) {
                // Clear sessionStorage only if navigating away from the search page
                if (to.name !== 'Search') {
                    this.clearSessionStorage();
                }
                next();
            },
            beforeDestroy() {
                // Remove the event listener when the component is destroyed
                window.removeEventListener('beforeunload', this.clearSessionStorage);
            },
        }


    </script>