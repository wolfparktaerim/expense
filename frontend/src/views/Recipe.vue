<!-- RecipeDetails.vue -->

<template>
    <Navigation v-if="!isLoading"/>
    <Chat></Chat>
    <!-- Loading + Did you know section -->
    <div v-if="isLoading">
        <div class="text-center flex flex-col justify-center items-center mt-3">
            <h2 class="text-4xl text-gray-800 font-bold my-8">Did You Know?</h2>
            <p v-if="trivia" class="text-center text-purple-600 columns-lg my-8" style="max-width: 50%">{{ trivia }}</p>
            <p v-else class="text-center text-gray-500 my-8">Fetching a fun food trivia...</p>
            <SquareLoader :color="loadingColor" class="mt-3" />
        </div>
    </div>

    <!-- Recipe Full Information -->
    <div v-else class="container mx-auto p-6 bg-gray-50 shadow-lg rounded-lg">

        <!-- Title and Favorite Icon Row -->
        <div class="flex items-center justify-center mb-8">
            <h1 class="text-4xl font-bold text-purple-600 mr-4">{{ recipe.title }}</h1>
            
            <!-- HAVE BUG NOW !!! DISABLED FOR NOW-->
            <!-- Favorite Icon -->
            <!-- <img
                @click="toggleFavorite(recipe)"
                :src="checkIsFavorite(recipe.id) ? '/icon/remove_favorite.png' : '/icon/add_favorite.png'"
                width="35"
                height="auto"
                alt="Favorite Icon"
                class="cursor-pointer transition-transform duration-200 hover:scale-110"
                :title="checkIsFavorite(recipe.id) ? 'Remove from Favorites' : 'Add to Favorites'"
            /> -->
        </div>

        <!-- Row 1: Image & Description -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

            <!-- Column 1: Recipe Image -->
            <div class="flex justify-center">
                <img :src="recipe.image" alt="Recipe Image" class="w-full h-auto max-w-sm rounded-lg shadow-lg" />
            </div>

            <!-- Column 2: Short Description and Icons -->
            <div class="bg-white p-6 rounded-lg shadow-md flex flex-col justify-center space-y-6">
                <!-- Serving Size -->
                <div class="text-lg">
                    <span class="text-gray-800">Serving Size:</span> <span class="text-gray-700">{{ recipe.servings }}</span>
                </div>
                <!-- Preparation Time -->
                <div v-if="recipe.preparationMinutes!=null">
                    <span class="text-lg text-gray-800">Preparation Time (minutes):</span> <span class="text-lg text-gray-700">{{ recipe.preparationMinutes }}</span>
                </div>
                <!-- Health Score -->
                <div class="text-lg">
                    <span class="text-gray-800">Health score:</span> <span class="text-gray-700">{{ recipe.healthScore }}</span>
                </div>
                <!-- Meal types -->
                <div>
                    <span class="text-lg text-gray-800">Dish Type: </span>
                    <span v-for="dishType in recipe.dishTypes" class="text-lg text-gray-700">
                        {{ dishType }} &nbsp;&nbsp;
                    </span>
                </div>

                <!-- Icons for vegan, popularity, etc. -->
                <div class="flex space-x-4">

                    <!-- Vegan icon for vegan recipes -->
                    <div v-if="recipe.vegan" class="flex items-center space-x-2 relative group">
                        <img src="/icon/vegan.png" alt="Vegan Icon" class="w-8 h-8">
                        <!-- Hidden text, shown on hover -->
                        <div class="absolute left-1/2 transform -translate-x-1/2 top-10 bg-green-600 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            100% Vegan!
                        </div>
                    </div>

                    <!-- Popular icon for very popular recipes -->
                    <div v-if="recipe.veryPopular" class="flex items-center space-x-2 relative group">
                        <img src="/icon/popular.png" alt="Popular Icon" class="w-8 h-8">
                        <!-- Hidden text, shown on hover -->
                        <div class="absolute left-1/2 transform -translate-x-1/2 top-10 bg-red-600 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            Very popular!
                        </div>
                    </div>

                    <!-- Cheap icon for cheap recipes -->
                    <div v-if="recipe.isCheap" class="flex items-center space-x-2 relative group">
                        <img src="/icon/cheap.png" alt="Cheap Icon" class="w-8 h-8">
                        <!-- Hidden text, shown on hover -->
                        <div class="absolute left-1/2 transform -translate-x-1/2 top-10 bg-yellow-600 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            Very cheap!
                        </div>
                    </div>

                    <!-- Healthy icon for healthy recipes -->
                    <div v-if="recipe.veryHealthy" class="flex items-center space-x-2 relative group">
                        <img src="/icon/healthy.png" alt="Healthy Icon" class="w-8 h-8">
                        <!-- Hidden text, shown on hover -->
                        <div class="absolute left-1/2 transform -translate-x-1/2 top-10 bg-green-600 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            Healthy Choice!
                        </div>
                    </div>
                </div>
                <!-- Icons end -->
            </div>
        </div>

        <!-- Row 2: Instructions, Ingredients, and Nutrition -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">

            <!-- Column 1: Instructions Section -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-4 text-purple-600">Instructions</h2>
                <ul class="space-y-4">
                    <li v-for="step in recipe.instructions" :key="step.number" class="p-4 bg-gray-100 rounded-lg shadow">
                        <p class="text-lg font-semibold text-gray-800">Step {{ step.number }}:</p>
                        <p class="text-gray-700">{{ step.step }}</p>

                        <!-- Ingredients used in each step -->
                        <div v-if="step.ingredients.length > 0" class="mt-4">
                            <h4 class="font-semibold text-gray-800">Ingredients:</h4>
                            <ul class="list-disc pl-6 text-gray-700">
                                <li v-for="ingredient in step.ingredients" :key="ingredient.id">{{ ingredient.name }}</li>
                            </ul>
                        </div>

                        <!-- Equipment used in each step -->
                        <div v-if="step.equipment.length > 0" class="mt-4">
                            <h4 class="font-semibold text-gray-800">Equipment:</h4>
                            <div class="flex space-x-4">
                                <div v-for="equipment in step.equipment" :key="equipment.id" class="flex items-center">
                                    <img :src="equipment.image" :alt="equipment.name" class="w-12 h-12 rounded-full mr-2">
                                    <p class="text-gray-700">{{ equipment.name }}</p>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- Column 2: Ingredients & Nutrition Information -->
            <div class="space-y-8">
                <!-- Ingredients Used -->
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h2 class="text-2xl font-bold mb-4 text-purple-600">Ingredients Used</h2>
                    <ul class="list-disc pl-6 space-y-2 text-gray-700">
                        <li v-for="ingredient in recipe.extendedIngredients" :key="ingredient.id">
                            {{ ingredient.name }} - {{ ingredient.amount }} {{ ingredient.unit }}
                        </li>
                    </ul>
                </div>

                <!-- Nutrition Information -->
                <div class="bg-white p-6 rounded-lg shadow-md text-gray-800">

                    <!-- Title -->
                    <h2 class="text-2xl font-bold mb-4 text-purple-600">Nutrition Label</h2>

                    <!-- Amount Per Serving -->
                    <p class="text-lg font-bold mb-2">Amount Per Serving</p>

                    <!-- Calories per Serving -->
                    <p class="flex justify-between text-lg font-semibold border-b pb-2 mb-2">
                        <span>Calories</span>
                        <span>{{ (recipeNutrition.calories / recipe.servings).toFixed(0) }}</span>
                    </p>

                     <!-- % Daily Value* Header -->
                    <p class="text-sm text-gray-800 mb-2 font-bold text-right">% Daily Value*</p>

                    <!-- Total Fat -->
                    <div class="flex justify-between text-sm py-1 border-t">
                        <div class="flex">
                            <span class="font-bold">Total Fat</span>
                            <span class="ml-1">{{ (recipeNutrition.totalNutrients.FAT.quantity / recipe.servings).toFixed(1) }}g</span>
                        </div>
                        <span class="font-bold">{{ (recipeNutrition.totalDaily.FAT.quantity / recipe.servings).toFixed(1) }}%</span>
                    </div>

                    <!-- Saturated Fat -->
                    <div class="flex justify-between text-sm py-1 ml-5">
                        <span>Saturated Fat {{ (recipeNutrition.totalNutrients.FASAT.quantity / recipe.servings).toFixed(1) }}g</span>
                        <span>{{ (recipeNutrition.totalDaily.FASAT.quantity / recipe.servings).toFixed(1)}}%</span>
                    </div>

                    <!-- Trans Fat (No Daily Value) -->
                    <div class="flex justify-between text-sm py-1 ml-5">
                        <span>Trans Fat {{ (recipeNutrition.totalNutrients.FATRN.quantity / recipe.servings).toFixed(1) }}g</span>
                        <span></span>
                    </div>

                    <!-- Cholesterol -->
                    <div class="flex justify-between text-sm py-1 border-t">
                        <div class="flex">
                            <span class="font-bold">Cholesterol</span>
                            <span class="ml-1">{{ (recipeNutrition.totalNutrients.CHOLE.quantity / recipe.servings).toFixed(1) }}mg</span>
                        </div>
                        <span class="font-bold">{{ (recipeNutrition.totalDaily.CHOLE.quantity / recipe.servings).toFixed(1) }}%</span>
                    </div>

                    <!-- Sodium -->
                    <div class="flex justify-between text-sm py-1 border-t">
                        <div class="flex">
                            <span class="font-bold">Sodium</span>
                            <span class="ml-1">{{ (recipeNutrition.totalNutrients.NA.quantity / recipe.servings).toFixed(1) }}mg</span>
                        </div>
                        <span class="font-bold">{{ (recipeNutrition.totalDaily.NA.quantity / recipe.servings).toFixed(1) }}%</span>
                    </div>

                    <!-- Total Carbohydrate -->
                    <div class="flex justify-between text-sm py-1 border-t">
                        <div class="flex">
                            <span class="font-bold">Total Carbohydrate</span>
                            <span class="ml-1"> {{ (recipeNutrition.totalNutrients.CHOCDF.quantity / recipe.servings).toFixed(1) }}g</span>
                        </div>
                        <span class="font-bold">{{ (recipeNutrition.totalDaily.CHOCDF.quantity / recipe.servings).toFixed(1) }}%</span>
                    </div>

                    <!-- Dietary Fiber -->
                    <div class="flex justify-between text-sm py-1 ml-5">
                        <span>Dietary Fiber {{ (recipeNutrition.totalNutrients.FIBTG.quantity / recipe.servings).toFixed(1) }}g</span>
                        <span>{{ (recipeNutrition.totalDaily.FIBTG.quantity / recipe.servings).toFixed(1) }}%</span>
                    </div>

                    <!-- Total Sugars -->
                    <div class="flex justify-between text-sm py-1 ml-5">
                        <span>Total Sugars {{ (recipeNutrition.totalNutrients.SUGAR.quantity / recipe.servings).toFixed(1) }}g</span>
                        <span></span>
                    </div>

                    <!-- Protein -->
                    <div class="flex justify-between text-sm py-1 border-t">
                        <div class="flex">
                            <span class="font-bold">Protein</span>
                            <span class="ml-1">{{ (recipeNutrition.totalNutrients.PROCNT.quantity / recipe.servings).toFixed(1) }}g</span>
                        </div>
                        <span class="font-bold">{{ (recipeNutrition.totalDaily.PROCNT.quantity / recipe.servings).toFixed(1) }}%</span>
                    </div>

                    <!-- Vitamin D -->
                    <div class="flex justify-between text-sm py-1 border-t">
                        <span>Vitamin D {{ (recipeNutrition.totalNutrients.VITD.quantity / recipe.servings).toFixed(1) }}µg</span>
                        <span>{{ (recipeNutrition.totalDaily.VITD.quantity / recipe.servings).toFixed(1) }}%</span>
                    </div>

                    <!-- Calcium -->
                    <div class="flex justify-between text-sm py-1 border-t">
                        <span>Calcium {{ (recipeNutrition.totalNutrients.CA.quantity / recipe.servings).toFixed(1) }}mg</span>
                        <span>{{ (recipeNutrition.totalDaily.CA.quantity / recipe.servings).toFixed(1) }}%</span>
                    </div>

                    <!-- Iron -->
                    <div class="flex justify-between text-sm py-1 border-t">
                        <span>Iron {{ (recipeNutrition.totalNutrients.FE.quantity / recipe.servings).toFixed(1) }}mg</span>
                        <span>{{ (recipeNutrition.totalDaily.FE.quantity / recipe.servings).toFixed(1) }}%</span>
                    </div>

                    <!-- Potassium -->
                    <div class="flex justify-between text-sm py-1 border-b border-t">
                        <span>Potassium {{ (recipeNutrition.totalNutrients.K.quantity / recipe.servings).toFixed(1) }}mg</span>
                        <span>{{ (recipeNutrition.totalDaily.K.quantity / recipe.servings).toFixed(1) }}%</span>
                    </div>

                    <!-- note -->
                    <div class="flex justify-between text-sm py-1">
                        *The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
                    </div>
                

                    <!-- Visual Representation of 3 main nutritions-->
                    <p class="text-lg font-bold mb-4 mt-4">Macronutrient Breakdown</p>
                    <div class="relative h-8 w-full bg-gray-200 rounded-full overflow-hidden">
                        <!-- Carbohydrates -->
                        <div
                            class="absolute top-0 left-0 h-full bg-blue-500 text-white text-sm flex items-center justify-center"
                            :style="{ width: carbPercentage + '%' }"
                        >
                            {{ carbPercentage.toFixed(0) }}%
                        </div>

                        <!-- Protein -->
                        <div
                            class="absolute top-0 h-full bg-green-500 text-white text-sm flex items-center justify-center"
                            :style="{ width: proteinPercentage + '%', left: carbPercentage + '%' }"
                        >
                            {{ proteinPercentage.toFixed(0) }}%
                        </div>

                        <!-- Fat -->
                        <div
                            class="absolute top-0 h-full bg-yellow-500 text-white text-sm flex items-center justify-center"
                            :style="{ width: fatPercentage + '%', left: (carbPercentage + proteinPercentage) + '%' }"
                        >
                            {{ fatPercentage.toFixed(0) }}%
                        </div>
                    </div>

                    <!-- Legend for Macronutrient Colors -->
                    <div class="flex justify-around text-sm mt-2">
                        <div class="flex items-center space-x-2">
                            <span class="h-4 w-4 bg-blue-500 inline-block rounded"></span>
                            <span>Carbohydrate</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="h-4 w-4 bg-green-500 inline-block rounded"></span>
                            <span>Protein</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="h-4 w-4 bg-yellow-500 inline-block rounded"></span>
                            <span>Fat</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- pass the ingredient info to chat -->
        <Chat :ingredients="recipe.extendedIngredients" />
    </div>

    <!-- temp console log button for debugging-->
    <!-- <hr>
    <br><br>
    <button @click="consoleButton">Console Log</button> -->



</template>
  
<script>
    import Navigation from "../components/Navigation.vue";
    import axios from 'axios';
    import SquareLoader from 'vue-spinner/src/SquareLoader.vue';
    import { useFavoritesStore } from '../stores/favorites';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import Chat from "../components/Chat.vue";
  
    export default {
        components: {
            SquareLoader,
            Navigation,
            Chat
        },
        data() {
            return {
                recipe: {
                    id: 0,
                    title: "",
                    image: "",
                    instructions : [],
                    healthScore : "",
                    extendedIngredients : [],
                    vegan: false,
                    vegetarian: false,
                    veryPopular: true,
                    veryHealthy: true,
                    isCheap: false,

                    servings: 1,
                    preparationMinutes: null,
                    dishTypes: [],

                    received : false,
                },
                recipeNutrition : null,
                isLoading: false, // Spinner control for viewing recipe details
                loadingColor: '#805ad5',
                favorites :[],
                favoritesStore: null,
                trivia: ''
            };
        },
        created(){
            // Initialize the store
            this.favoritesStore = useFavoritesStore();

            // Fetch the recipe details based on the route ID
            const recipeId = this.$route.params.id;
            this.id = recipeId;
            this.isLoading = true;

            // Create a delay of 5 seconds
            const delay = new Promise(resolve => setTimeout(resolve, 3000));

            // Trivia fetch promise
            const fetchTrivia = axios.get('https://api.spoonacular.com/food/trivia/random', {
                params: { apiKey: import.meta.env.VITE_SPOON_API_KEY }
            })
            .then(response => {
                this.trivia = response.data.text;
                console.log(this.trivia)
            })
            .catch(error => {
                console.error(error);
                this.trivia = "Oops! Something went wrong fetching the trivia.";
            });

            // Recipe fetch promise
            const fetchRecipe = axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
                params: { apiKey: import.meta.env.VITE_SPOON_API_KEY }
            })
            .then(response => {
                const recipeInfo = response.data;
                this.recipe = { 
                    title: recipeInfo.title,
                    image: recipeInfo.image,
                    instructions: recipeInfo.analyzedInstructions[0]?.steps || [],
                    healthScore: recipeInfo.healthScore,
                    extendedIngredients: recipeInfo.extendedIngredients,
                    vegan: recipeInfo.vegan,
                    vegetarian: recipeInfo.vegetarian,
                    veryPopular: recipeInfo.veryPopular,
                    veryHealthy: recipeInfo.veryHealthy,
                    servings: recipeInfo.servings,
                    preparationMinutes: recipeInfo.preparationMinutes,
                    dishTypes: recipeInfo.dishTypes,
                    isCheap: recipeInfo.cheap,
                    received: true
                };
            })
            .catch(error => {
                console.error(error);
            });

            // Wait for both trivia, recipe, and delay before setting isLoading to false
            Promise.all([fetchTrivia, fetchRecipe, delay])
                .then(() => {
                    this.isLoading = false;
                    // Optionally, fetch additional nutrition info here if needed
                    if (this.recipe.received) {
                        this.fetchNutritionAnalysis();
                    }
                });    
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
        computed:{
            // Produce a ingredient array that can pass to the nutrition analysis API (the API requires ingredients in array)
            ingredientsInArr(){
                var output = [];

                // test cases:
                // output.push('8 slices of bacon');
                // output.push("3 lbs of russet potatoes");
                // output.push("1 of onion");
                // output.push("2 t of thyme");
                
                for(let ingredient of this.recipe.extendedIngredients){
                    let amt = ingredient.amount.toString();
                    let unit = ingredient.unit ? ingredient.unit + " " : "";
                    let ingrName = ingredient.name;
                    let ingrText = `${amt} ${unit}of ${ingrName}`.trim();
                    ingrText.toString();
                    output.push(ingrText);
                }
                return output;
            },

            // calculate the main nutrition: carb, protein, fat in calories and %
            carbCalories() {
                return this.recipeNutrition.totalNutrients.CHOCDF.quantity * 4;
            },
            proteinCalories() {
                return this.recipeNutrition.totalNutrients.PROCNT.quantity * 4;
            },
            fatCalories() {
                return this.recipeNutrition.totalNutrients.FAT.quantity * 9;
            },
            totalMacroCalories() {
                return this.carbCalories + this.proteinCalories + this.fatCalories;
            },
                // Calculate percentages for each macronutrient
            carbPercentage() {
                return (this.carbCalories / this.totalMacroCalories) * 100;
            },
            proteinPercentage() {
                return (this.proteinCalories / this.totalMacroCalories) * 100;
            },
            fatPercentage() {
                return (this.fatCalories / this.totalMacroCalories) * 100;
            }
        },

        methods:{

            fetchNutritionAnalysis() {
                // Ensure ingredients are available
                if (this.ingredientsInArr.length > 0) {
                    axios.post('https://api.edamam.com/api/nutrition-details', {
                        title: this.recipe.title,
                        ingr: this.ingredientsInArr,
                    }, {
                        params: {
                            // ensure to disable before git commit and push, must save api usage
                            app_id: import.meta.env.VITE_EDAMAM_API_ID,
                            app_key: import.meta.env.VITE_EDAMAM_API_KEY,
                            
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .then(response => {
                        console.log(response.data);
                        this.recipeNutrition = response.data;
                    })
                    .catch(error => {
                        console.log(this.recipe.title);
                        console.log(this.ingredientsInArr);
                        console.error(error);
                    });
                } else {
                    console.error("Ingredients array is empty or not properly formatted.");
                }
            },
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
            checkIsFavorite(recipeId) {
                return this.favoritesStore.isFavorite(recipeId);
                        },async toggleFavorite(recipe) {
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
            // console log button to check certain data, will disable it eventually
            consoleButton() {
                console.log('Result: ', this.ingredientsInArr);
            }
        }
    };
</script>