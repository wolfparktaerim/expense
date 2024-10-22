<!-- RecipeDetails.vue -->

<template>

    <SubNavigation />

    <!-- Recipe Full Information -->
    <div class="container mx-auto mt-8 p-6 bg-gray-50 shadow-lg rounded-lg">

        <!-- Recipe title -->
        <h1 class="text-4xl font-bold text-purple-700 text-center mb-8">{{ recipe.title }}</h1>

        <!-- Row 1: Image & Description -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

            <!-- Column 1: Recipe Image -->
            <div class="flex justify-center">
                <img :src="recipe.image" alt="Recipe Image" class="w-full h-auto max-w-sm rounded-lg shadow-lg" />
            </div>

            <!-- Column 2: Short Description and Icons -->
            <div class="bg-white p-6 rounded-lg shadow-md flex flex-col justify-center space-y-6">
                <!-- Serving Size -->
                <p class="text-lg text-gray-700">Serving Size: {{ recipe.servings }}</p>
                <!-- Preparation Time -->
                <p v-if="recipe.preparationMinutes!=null" class="text-lg text-gray-700">Preparation Time (minutes): {{ recipe.preparationMinutes }}</p>
                <!-- Preparation Time -->
                <p class="text-lg text-gray-700">Health score: {{ recipe.healthScore }}</p>
                <!-- Meal types -->
                <span>
                    <p class="text-lg text-gray-700">Dish Type: </p>
                    <span v-for="dishType in recipe.dishTypes">
                        {{ dishType }} &nbsp;&nbsp;
                    </span>
                </span>

                <!-- Icons for vegan, popularity, etc. -->
                <div class="flex space-x-4">

                    <!-- Vegan icon for vegan recipes -->
                    <div v-if="recipe.vegan" class="flex items-center space-x-2 relative group">
                        <img src="../../public/icon/vegan.png" alt="Vegan Icon" class="w-8 h-8">
                        <!-- Hidden text, shown on hover -->
                        <div class="absolute left-1/2 transform -translate-x-1/2 top-10 bg-green-600 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            100% Vegan!
                        </div>
                    </div>

                    <!-- Popular icon for very popular recipes -->
                    <div v-if="recipe.veryPopular" class="flex items-center space-x-2 relative group">
                        <img src="../../public/icon/popular.png" alt="Popular Icon" class="w-8 h-8">
                        <!-- Hidden text, shown on hover -->
                        <div class="absolute left-1/2 transform -translate-x-1/2 top-10 bg-red-600 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            Very popular!
                        </div>
                    </div>

                    <!-- Cheap icon for cheap recipes -->
                    <div v-if="recipe.isCheap" class="flex items-center space-x-2 relative group">
                        <img src="../../public/icon/cheap.png" alt="Cheap Icon" class="w-8 h-8">
                        <!-- Hidden text, shown on hover -->
                        <div class="absolute left-1/2 transform -translate-x-1/2 top-10 bg-yellow-600 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            Very cheap!
                        </div>
                    </div>

                    <!-- Healthy icon for healthy recipes -->
                    <div v-if="recipe.veryHealthy" class="flex items-center space-x-2 relative group">
                        <img src="../../public/icon/healthy.png" alt="Healthy Icon" class="w-8 h-8">
                        <!-- Hidden text, shown on hover -->
                        <div class="absolute left-1/2 transform -translate-x-1/2 top-10 bg-green-600 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            Healthy Choice!
                        </div>
                    </div>
                </div>
                <!-- Icons end -->

                <!-- Reserved spot for 'add to favorites' -->
                 <!-- Reserved spot end -->
            </div>
        </div>

        <!-- Row 2: Instructions, Ingredients, and Nutrition -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">

            <!-- Column 1: Instructions Section -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-4 text-purple-600">Instructions</h2>
                <ul class="space-y-4">
                    <li v-for="step in recipe.instructions" :key="step.number" class="p-4 bg-gray-100 rounded-lg shadow">
                        <p class="text-lg font-semibold">Step {{ step.number }}:</p>
                        <p>{{ step.step }}</p>

                        <!-- Ingredients used in each step -->
                        <div v-if="step.ingredients.length > 0" class="mt-4">
                            <h4 class="font-semibold">Ingredients:</h4>
                            <ul class="list-disc pl-6 text-gray-600">
                                <li v-for="ingredient in step.ingredients" :key="ingredient.id">{{ ingredient.name }}</li>
                            </ul>
                        </div>

                        <!-- Equipment used in each step -->
                        <div v-if="step.equipment.length > 0" class="mt-4">
                            <h4 class="font-semibold">Equipment:</h4>
                            <div class="flex space-x-4">
                                <div v-for="equipment in step.equipment" :key="equipment.id" class="flex items-center">
                                    <img :src="equipment.image" :alt="equipment.name" class="w-12 h-12 rounded-full mr-2">
                                    <p class="text-sm">{{ equipment.name }}</p>
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
                <div class="bg-white p-6 rounded-lg shadow-md">

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
                    <p class="text-sm text-gray-700 mb-2 font-semibold">% Daily Value*</p>

                    <!-- Total Fat -->
                    <div class="flex justify-between text-sm py-1 border-t">
                        <span>Total Fat {{ (recipeNutrition.totalNutrients.FAT.quantity / recipe.servings).toFixed(1) }} g</span>
                        <span>{{ (recipeNutrition.totalDaily.FAT.quantity / recipe.servings).toFixed(0) }} %</span>
                    </div>

                    <!-- Saturated Fat -->
                    <div class="flex justify-between text-sm py-1">
                        <span>Saturated Fat {{ (recipeNutrition.totalNutrients.FASAT.quantity / recipe.servings).toFixed(1) }} g</span>
                        <span>{{ (recipeNutrition.totalDaily.FASAT.quantity / recipe.servings).toFixed(1)}} %</span>
                    </div>

                    <!-- Trans Fat (No Daily Value) -->
                    <div class="flex justify-between text-sm py-1">
                        <span>Trans Fat {{ (recipeNutrition.totalNutrients.FATRN.quantity / recipe.servings).toFixed(1) }} g</span>
                        <span></span>
                    </div>

                    <!-- Cholesterol -->
                    <div class="flex justify-between text-sm py-1">
                        <span>Cholesterol {{ (recipeNutrition.totalNutrients.CHOLE.quantity / recipe.servings).toFixed(1) }} mg</span>
                        <span>{{ (recipeNutrition.totalDaily.CHOLE.quantity / recipe.servings).toFixed(1) }} %</span>
                    </div>

                    <!-- Sodium -->
                    <div class="flex justify-between text-sm py-1">
                        <span>Sodium {{ (recipeNutrition.totalNutrients.NA.quantity / recipe.servings).toFixed(1) }} mg</span>
                        <span>{{ (recipeNutrition.totalDaily.NA.quantity / recipe.servings).toFixed(1) }} %</span>
                    </div>

                    <!-- Total Carbohydrate -->
                    <div class="flex justify-between text-sm py-1 border-t">
                        <span>Total Carbohydrate {{ (recipeNutrition.totalNutrients.CHOCDF.quantity / recipe.servings).toFixed(1) }} g</span>
                        <span>{{ (recipeNutrition.totalDaily.CHOCDF.quantity / recipe.servings).toFixed(1) }} %</span>
                    </div>

                    <!-- Dietary Fiber -->
                    <div class="flex justify-between text-sm py-1">
                        <span>Dietary Fiber {{ (recipeNutrition.totalNutrients.FIBTG.quantity / recipe.servings).toFixed(1) }} g</span>
                        <span>{{ (recipeNutrition.totalDaily.FIBTG.quantity / recipe.servings).toFixed(1) }} %</span>
                    </div>

                    <!-- Total Sugars -->
                    <div class="flex justify-between text-sm py-1">
                        <span>Total Sugars {{ (recipeNutrition.totalNutrients.SUGAR.quantity / recipe.servings).toFixed(1) }} g</span>
                        <span></span>
                    </div>

                    <!-- Protein -->
                    <div class="flex justify-between text-sm py-1 border-t">
                        <span>Protein {{ (recipeNutrition.totalNutrients.PROCNT.quantity / recipe.servings).toFixed(1) }} g</span>
                        <span>{{ (recipeNutrition.totalDaily.PROCNT.quantity / recipe.servings).toFixed(1) }} %</span>
                    </div>

                    <!-- Vitamin D -->
                    <div class="flex justify-between text-sm py-1 border-t">
                        <span>Vitamin D {{ (recipeNutrition.totalNutrients.VITD.quantity / recipe.servings).toFixed(1) }} µg</span>
                        <span>{{ (recipeNutrition.totalDaily.VITD.quantity / recipe.servings).toFixed(1) }} %</span>
                    </div>

                    <!-- Calcium -->
                    <div class="flex justify-between text-sm py-1">
                        <span>Calcium {{ (recipeNutrition.totalNutrients.CA.quantity / recipe.servings).toFixed(1) }} mg</span>
                        <span>{{ (recipeNutrition.totalDaily.CA.quantity / recipe.servings).toFixed(1) }} %</span>
                    </div>

                    <!-- Iron -->
                    <div class="flex justify-between text-sm py-1">
                        <span>Iron {{ (recipeNutrition.totalNutrients.FE.quantity / recipe.servings).toFixed(1) }} mg</span>
                        <span>{{ (recipeNutrition.totalDaily.FE.quantity / recipe.servings).toFixed(1) }} %</span>
                    </div>

                    <!-- Potassium -->
                    <div class="flex justify-between text-sm py-1">
                        <span>Potassium {{ (recipeNutrition.totalNutrients.K.quantity / recipe.servings).toFixed(1) }} mg</span>
                        <span>{{ (recipeNutrition.totalDaily.K.quantity / recipe.servings).toFixed(1) }} %</span>
                    </div>
                

                    <!-- Visual Representation -->
                    <div class="mt-4 flex space-x-4 justify-center">
                        <div class="w-24 h-24 bg-blue-300 flex items-center justify-center rounded-lg shadow-md">Carbs: g</div>
                        <div class="w-24 h-24 bg-green-300 flex items-center justify-center rounded-lg shadow-md">Protein: g</div>
                        <div class="w-24 h-24 bg-yellow-300 flex items-center justify-center rounded-lg shadow-md">Fat: g</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- temp console log button for debugging-->
    <hr>
    <br><br>
    <!-- console log button -->
    <button @click="consoleButton">Console Log</button>



</template>
  
<script>

    import RecipeSearch from "../components/RecipeSearch.vue";
import SubNavigation from "../components/SubNavigation.vue";
    import axios from 'axios';
  
    export default {
        components: {
            SubNavigation,
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
            };
        },
        created(){
            // Fetch the recipe details based on the route ID
            const recipeId = this.$route.params.id;
            this.id = recipeId;
            axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
                params: {
                    // my api key
                    apiKey : import.meta.env.VITE_SPOON_API_KEY,
                }
            })
                .then(response => {
                    console.log(response.data);
                    var recipeInfo = response.data;

                    // extracting some useful information for later processes...
                    this.recipe.title = recipeInfo.title;
                    this.recipe.image = recipeInfo.image;
                    this.recipe.instructions = recipeInfo.analyzedInstructions[0].steps;
                    this.recipe.healthScore = recipeInfo.healthScore;
                    this.recipe.extendedIngredients = recipeInfo.extendedIngredients;
                    this.recipe.vegan = recipeInfo.vegan;
                    this.recipe.vegetarian = recipeInfo.vegetarian;
                    this.recipe.veryPopular = recipeInfo.veryPopular;
                    this.recipe.veryHealthy = recipeInfo.veryHealthy;
                    this.recipe.servings = recipeInfo.servings;
                    this.recipe.preparationMinutes = recipeInfo.preparationMinutes;
                    this.recipe.dishTypes = recipeInfo.dishTypes;
                    this.recipe.isCheap = recipeInfo.cheap;
                    this.recipe.received = true;

                    // Fetch the nutrition information based on the ingredients used (after recipe is fully loaded)
                    if(this.recipe.received){
                        this.fetchNutritionAnalysis();
                    }
                })
                .catch( error => {
                    console.error(error);
                });
        },
        computed:{
            // Produce a ingredient array that can pass to the nutrition analysis API (the API requires ingredients in array)
            ingredientsInArr(){
                var output = [];

                // test case:
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
                        console.error(error);
                    });
                } else {
                    console.error("Ingredients array is empty or not properly formatted.");
                }
            },
            consoleButton() {
                console.log('Result: ', this.ingredientsInArr);
            }
        }
    };
</script>