<template>
  <section class="py-12 bg-gradient-to-b from-gray-50 to-white">
    <div class="container mx-auto px-4">
      <h3 class="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
        How it <span class="text-purple-600">Works</span>
      </h3>
      <div class="flex flex-col sm:flex-row justify-between items-stretch gap-8 mb-16">
        <div v-for="(step, index) in steps" :key="step.title"
          class="step-item flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex-1"
          :class="{ 'is-visible': step.isVisible }" @mouseenter="activeStep = index" @mouseleave="activeStep = null">
          <div class="relative mb-8 transition-transform duration-300" :class="{ 'scale-110': activeStep === index }">
            <div class="absolute inset-0 bg-purple-100 rounded-full scale-150 opacity-50"></div>
            <component :is="step.icon" class="h-16 w-16 text-purple-600 relative z-10" />
          </div>
          <h4 class="text-xl text-center font-semibold mb-4 text-gray-800">{{ step.title }}</h4>
          <p class="text-gray-600 text-center flex-grow">{{ step.description }}</p>
          <div class="mt-2 flex items-center justify-center">
            <span class="text-3xl font-bold text-purple-600 mr-2">{{ index + 1 }}</span>
          </div>
        </div>
      </div>
      <!-- Full-width Image Placeholder Section -->
      <div class="mt-16">
        <h4 class="text-2xl font-semibold mb-8 text-center text-gray-800">Placeholder img title if needed</h4>
        <div class="bg-gray-200 rounded-lg overflow-hidden w-full" style="height: 400px;">
          <img src="https://westcoastdocs.com/wp-content/uploads/2018/06/image-placeholder-large.jpg" alt="How it works demonstration" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>


    <!-- The Rising Issue of Obesity in Singapore -->
    <div class="bg-gray-100 p-8 rounded-lg max-w-full mx-auto px-10">

      <!-- Divider -->
      <div class="mx-10">

      <!-- Title and Subtitle -->
      <h1 class="text-4xl font-bold text-gray-800 mb-2">
        <span class="text-purple-600">Obesity</span> in Singapore</h1>
      <h2 class="text-2xl font-bold text-gray-800 mb-6">"A Growing Global Concern"</h2>

      <!-- Divider -->
      <div class="w-16 border-b-2 border-gray-800 mb-4"></div>

      <!-- Paragraph -->
      <p class="text-gray-700 mb-8">
        Obesity is a growing global issue, with rates more than doubling since 1980. In Singapore, the 2021/2022
        National Population Health Survey revealed a rise in obesity among residents aged 18 to 74, increasing from
        10.5% in 2019/2020 to 11.6% in 2022, with higher rates observed in males and those aged 40 to 49. This trend
        highlights the need for healthier lifestyle choices. Our platform supports this by helping users create
        nutritious meals from available ingredients, promoting balanced eating habits in line with initiatives like "My
        Healthy Plate" to combat rising obesity.
      </p>

      <!-- Stats Section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Stat 1 -->
        <div class="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <h3 class="text-3xl font-bold text-gray-800 mb-2">
            <NumberCounter end-value="11.6" suffix="%" :decimals="1" />
          </h3>
          <p class="text-gray-600">Crude obesity prevalence in Singapore (2022)</p>
        </div>

        <!-- Stat 2 -->
        <div class="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <h3 class="text-3xl font-bold text-gray-800 mb-2">
            <NumberCounter end-value="40" :decimals="0" />-<NumberCounter end-value="49" :decimals="0" /> years
          </h3>
          <p class="text-gray-600">Age group with highest obesity rates (15%)</p>
        </div>

        <!-- Stat 3 -->
        <div class="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <h3 class="text-3xl font-bold text-gray-800 mb-2">
            <NumberCounter end-value="2" :decimals="0" />x
          </h3>
          <p class="text-gray-600">Global obesity rates since 1980</p>
        </div>
      </div>
      </div>
    </div>

    <div class="my-10"></div>

      <div
    class="bg-gray-100 p-6 rounded-lg max-w-full mx-auto flex flex-col md:flex-row items-center md:items-center">
    <!-- Image taking up a little less than half the width -->
    <div class="w-8/12 sm:w-6/12 md:w-3/12 mb-4 ml-6 md:mb-0 md:mr-6">
      <img src="https://ch-api.healthhub.sg/api/public/content/4635b79d3a70405d9957c9e8e479c623?v=89e95a67"
        alt="Healthy Plate Image" class="rounded-lg shadow-md w-full h-auto object-cover mxy-auto min-w-52" />
    </div>
    <!-- Text content taking up the rest of the container -->
    <div class="w-full sm:w-6/12 md:w-9/12 mx-6">
      <!-- Title -->
      <h2 class="text-2xl font-bold text-gray-800 mb-2">My Healthy Plate Initiative</h2>

      <!-- Horizontal Line -->
      <div class="w-16 border-b-2 border-gray-800 mb-4"></div>

      <!-- Paragraph -->
      <p class="text-gray-700 mb-6">
        The "My Healthy Plate" initiative, created by Singapore's Health Promotion Board, provides a simple visual
        guide to encourage balanced, healthy eating. It emphasizes the importance of eating a wide variety of foods in
        the right amounts to meet daily nutritional needs. 
        <br>
        <br>
        The concept of "Quarter, Quarter, Half" is a key takeaway:
        a quarter of your plate should be whole grains, a quarter should be good sources of protein, and half should
        be filled with fruits and vegetables. This approach helps individuals maintain a well-balanced diet, manage
        their weight, and reduce the risk of chronic diseases.
      </p>

      <!-- Button -->
      <a href="https://www.healthhub.sg/programmes/nutrition-hub/eat-more#my-healthy-plate"
        class="inline-block bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300 items-center" target="_blank" rel="noopener noreferrer">
        Find Out More
      </a>
    </div>
  </div>





  </section>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { SearchIcon, CookingPotIcon, BookmarkIcon } from 'lucide-vue-next'
import NumberCounter from './NumberCounter.vue'

export default {
  components: {
    SearchIcon,
    CookingPotIcon,
    BookmarkIcon,
    NumberCounter,
  },
  setup() {
    const activeStep = ref(null)
    const steps = ref([
      {
        icon: SearchIcon,
        title: 'Create Recipes',
        description: 'Generate personalized recommendations based on your health goals, dietary requirements and culinary preferences.',
        isVisible: false
      },
      {
        icon: CookingPotIcon,
        title: 'View Recipe Details',
        description: 'Get a complete breakdown of time taken, ingredients, cooking steps, and nutritional information for your chosen recipe.',
        isVisible: false
      },
      {
        icon: BookmarkIcon,
        title: 'Save Your Favorites',
        description: 'Once you\'re happy with a recipe, save it to your collection for easy access in the future.',
        isVisible: false
      }
    ])

    let observer
    
    onMounted(() => {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = steps.value.findIndex(step => step.title === entry.target.querySelector('h4').textContent)
            if (index !== -1) {
              steps.value[index].isVisible = true
            }
          }
        })
      }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' })
      document.querySelectorAll('.step-item').forEach((el) => {
        observer.observe(el)
      })
    })

    onUnmounted(() => {
      if (observer) {
        observer.disconnect()
      }
    })

    return {
      activeStep,
      steps
    }
  }
}
</script>

<style scoped>
@media (max-width: 640px) {
  .step-item {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  .step-item.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
}
.step-item:hover .relative {
  transform: scale(1.1);
}
</style>