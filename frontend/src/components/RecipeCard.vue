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
                :src="isFavorite ? '../../public/icon/remove_favorite.png' : '../../public/icon/add_favorite.png'"
                width="35"
                height="auto"
                alt="Favorite Icon"
                class="cursor-pointer transition-transform duration-200 hover:scale-110"
                :title="isFavorite ? 'Remove from Favorites' : 'Add to Favorites'"
            />

            <!-- view recipe details button -->
            <button @click="viewRecipeDetails(recipe)" class="bg-purple-600 text-white py-2 px-3 ml-5 rounded w-full hover:bg-purple-700 transition-colors duration-200 text-sm">
                View Recipe Details
            </button>
        </div>
    </div>
</template>


<script>
    export default {
        data(){
            return{
            isFavorite : false,
        }},
        props: {
            recipes: {
                type: Array,
                required: true,
            },
        },
        methods: {
            viewRecipeDetails(recipe){
                this.$router.push({ path: `/recipe/${recipe.id}` });
            },
            toggleFavorite() {

                // temp add to favorite toggle
                this.isFavorite = !this.isFavorite;
                console.log('Favorite button clicked!');
            },
        },
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