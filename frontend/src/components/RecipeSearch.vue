    <template>

        <!-- Search Engine -->
        <div class="container mx-auto py-8 px-4 mt-12">
            <Typewriter />

            <!-- Filter function -->

            <!-- Background Overlay -->
            <div v-if="showDrawer" 
                class="fixed inset-0 bg-gray-900 bg-opacity-50 z-40" 
                @click="showDrawer = false">
            </div>

            <!-- Filter Drawer -->
            <div v-if="showDrawer" 
                class="fixed inset-x-0 top-1/2 transform -translate-y-1/2 bg-white z-50 w-3/4 max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-semibold text-gray-800">Filter Recipes</h2>
                    <button @click="showDrawer = false" class="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <!-- First Row: Cuisine and Diet Filters -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <!-- Cuisine Filter -->
                    <div class="text-left">
                        <label class="text-sm text-gray-600 mb-2 block">Filter by Cuisine</label>
                        <select v-model="selectedCuisine" 
                                class="w-full border border-gray-300 rounded-md py-2 px-4 bg-white text-gray-700 focus:ring-2 focus:ring-purple-500">
                            <option value="">Any Cuisine</option>
                            <option v-for="cuisine in cuisines" :value="cuisine">{{ cuisine }}</option>
                        </select>
                    </div>

                    <!-- Diet Filter -->
                    <div class="text-left">
                        <label class="text-sm text-gray-600 mb-2 block">Filter by Diet</label>
                        <select v-model="selectedDiet" 
                                class="w-full border border-gray-300 rounded-md py-2 px-4 bg-white text-gray-700 focus:ring-2 focus:ring-purple-500">
                            <option value="">Any Diet</option>
                            <option v-for="diet in diets" :value="diet">{{ diet }}</option>
                        </select>
                    </div>
                </div>

                <!-- Second Row: Intolerance Checkboxes -->
                <div class="text-left">
                    <label class="text-sm text-gray-600 mb-2 block">Filter by Intolerances</label>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <div v-for="intolerance in intolerances" :key="intolerance" class="flex items-center">
                            <input type="checkbox" :value="intolerance" v-model="selectedIntolerances" 
                                class="form-checkbox text-purple-600 focus:ring-2 focus:ring-purple-500">
                            <span class="ml-2 text-gray-700">{{ intolerance }}</span>
                        </div>
                    </div>
                </div>

                <!-- Apply Filters Button -->
                <div class="mt-6 flex justify-end">
                    <button @click="applyFilters" 
                            class="bg-purple-600 text-white font-bold py-2 px-6 rounded hover:bg-purple-700 focus:ring-2 focus:ring-purple-600">
                        Apply Filters
                    </button>
                </div>
            </div>


            <!-- Ingredients Search Input -->
            <div class="mb-6">

                <label for="search" class="block text-gray-600 text-lg mb-2" style="text-align: center;">Enter Ingredients (press "," or press 'Enter' to separate different ingredients):</label>
                <div class="flex justify-center mt-4">
                    <input type="text" id="search" class="w-1/2 border border-gray-300 rounded-md py-2 px-4 text-gray-600 focus:ring-2 focus:ring-purple-500" 
                        v-model="searchInput" @keydown.enter.prevent="addIngredient" @input="addOnComma" placeholder="Apple, broccoli, chicken...">
                    &nbsp;&nbsp;
                    <!-- Filter Drawer Button -->
                    <button @click="showDrawer = true" 
                            class="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 focus:ring-2 focus:ring-purple-600">
                        Add Filter
                    </button>
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


            <div v-if="isLoading" class="text-center flex justify-center items-center h-32 mt-3">
                <PulseLoader :color="loadingColor"></PulseLoader>
            </div>
            
            <div v-else>
                <!-- Show "No Results Found" if no data retrieved from the API -->
                <div v-if="searchTriggered && (searchNum == 5151 || searchNum == 0) && recipes===[]" class="flex justify-center items-center h-64 mt-3">
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

                    // Selected intolerances
                    selectedIntolerances : [],
                    // Predfined list of intolerances (from spoonacular API)
                    intolerances : ['Dairy', 'Egg', 'Peanut', 'Gluten', 'Grain', 'Seafood', 'Sesame', 'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'],

                    // Selected diets 
                    selectedDiet : "",
                    // Predefined list of diets (from spoonacular API)
                    diets : ['Gluten Free', 'Ketogenic', 'Vegetarian', 'Lacto-Vegetarian', 'Ovo-Vegetarian', 'Vegan', 'Pescetarian', 'Paleo', 'Primal', 'Low FODMAP'],

                    // Recipe results
                    recipes: [],

                    // tags for random recipe
                    includeTags : "",

                    // has user search anything yet?
                    searchTriggered : false,
                    isLoading: false,
                    loadingColor: '#805ad5',
                    searchNum: 0,
                    showDrawer: false,

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
                    const intoleranceQuery = this.selectedIntolerances.join(',');
                    const dietQuery = this.selectedDiets;

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
                                number : 8,
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
                        this.searchTriggered = true;
                        this.searchNum = 1;
                        // store the search result
                        sessionStorage.setItem('lastSearchResults', JSON.stringify(this.recipes));
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
                },
                applyFilters() {
                    this.showDrawer = false;
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