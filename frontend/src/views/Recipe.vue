<!-- RecipeDetails.vue -->

<template>

    <SubNavigation />

    <!-- Recipe Full Information -->
    <div class="container mx-auto mt-8">

        <!-- Recipe title -->
        <h1 class="text-4xl font-bold text-purple-700 mb-10">{{ recipe.title }}</h1>

        <!-- Main Grid Layout -->
        <div class="flex flex-col md:flex-row">

            <!-- Column 1: Image and Instructions -->

                <!-- Recipe Image -->
            <div class="md:w-2/3 p-4">
                <img :src="recipe.image" alt="Recipe Image" class="w-full h-auto max-w-sm mx-auto rounded-lg shadow-md" />
                
                <!-- Instructions Section -->
                <div class="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 class="text-2xl font-bold mb-4">Instructions</h2>
                    <ul class="space-y-4">
                        <li v-for="step in recipe.instructions" :key="step.number" class="p-4 bg-white rounded-lg shadow">
                        <p class="text-lg"><strong>Step {{ step.number }}:</strong> {{ step.step }}</p>
                        <div v-if="step.ingredients.length > 0" class="mt-2">
                            <h4 class="font-semibold">Ingredients:</h4>
                            <ul class="list-disc pl-6">
                            <li v-for="ingredient in step.ingredients" :key="ingredient.id">{{ ingredient.name }}</li>
                            </ul>
                        </div>
                        <div v-if="step.equipment.length > 0" class="mt-2">
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
                <!-- instruction section ends -->
            </div>
            <!-- column 1 ends -->


            <!-- Column 2: Ingredients used -->
            <div class="md:w-1/3 p-4">
                <!-- ingredients used -->
                <div class="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 class="text-2xl font-bold mb-4">Ingredients Used</h2>
                    <ul class="list-disc pl-6 space-y-2">
                        <li v-for="ingredient in recipe.extendedIngredients" :key="ingredient.id" class="flex items-center">
                            <span class="text-lg">{{ ingredient.name }} - {{ ingredient.amount }} {{ ingredient.unit }}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- column 2 ends -->
     
            <!-- Row 2: Nutrition Information -->
            <div class="bg-white p-6 rounded-lg shadow-md mt-4">
                <h2 class="text-2xl font-bold mb-4">Nutrition Information</h2>
                <table class="w-full text-left table-auto">
                    <thead>
                        <tr>
                            <th class="border px-4 py-2">Nutrient</th>
                            <th class="border px-4 py-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border px-4 py-2">Carbs</td>
                            <td class="border px-4 py-2">{{ nutrition.carbs }}g</td>
                        </tr>
                        <tr>
                            <td class="border px-4 py-2">Protein</td>
                            <td class="border px-4 py-2">{{ nutrition.protein }}g</td>
                        </tr>
                        <tr>
                            <td class="border px-4 py-2">Fat</td>
                            <td class="border px-4 py-2">{{ nutrition.fat }}g</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Visual Representation of Nutrition -->
                <div class="mt-4">
                    <p class="font-semibold">Visual Representation:</p>
                    <div class="flex space-x-4">
                        <div class="w-24 h-24 bg-blue-300 flex items-center justify-center">Carbs: {{ nutrition.carbs }}g</div>
                        <div class="w-24 h-24 bg-green-300 flex items-center justify-center">Protein: {{ nutrition.protein }}g</div>
                        <div class="w-24 h-24 bg-yellow-300 flex items-center justify-center">Fat: {{ nutrition.fat }}g</div>
                    </div>
                </div>
            </div>


        </div>
    </div>
    <!-- Recipe Full information end -->

</template>
  
<script>

    import SubNavigation from "../components/SubNavigation.vue";
    import axios from 'axios';
    const apiKey = import.meta.env.VITE_SPOON_API_KEY;
  
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
                servings: 0,
                preparationMinutes: 0,
            },
            nutrition : {
                carbs: '',
                protein: '',
                fat: '',
            }
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
                    this.recipe.preparationMinutes = recipeInfo.preparationMinutes
                })
                .catch( error => {
                    console.error(error);
                });
            
            // Fetch the nutrition information based on the ingredients used
            axios.get('https://api.edamam.com/api/nutrition-details', {
                params: {
                    app_id : import.meta.env.VITE_EDAMAM_API_ID,
                    app_key : import.meta.env.VITE_EDAMAM_API_KEY,
                    ingr : this.recipe.extendedIngredients,
                }
            })
                .then(response => {
                    console.log(response.data);
                })
                .catch( error => {
                    console.error(error);
                });
                

        },
        methods:{
            
        }
    };
</script>