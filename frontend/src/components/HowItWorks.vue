<template>
  <section class="py-12 bg-gradient-to-b from-gray-50 to-white">
    <div class="container mx-auto px-4">
      <h3 class="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
        How it <span class="text-purple-600">Works</span>
      </h3>
      
      <!-- Steps Section -->
      <div class="flex flex-col sm:flex-row justify-between items-stretch gap-8 mb-16">
        <div v-for="(step, index) in steps" :key="step.title"
          class="step-item flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex-1 group"
          :class="{ 'is-visible': step.isVisible }" 
          @mouseenter="activeStep = index" 
          @mouseleave="activeStep = null">
          <div class="relative mb-8 transition-transform duration-500" :class="{ 'scale-110': activeStep === index }">
            <div class="absolute inset-0 bg-purple-100 rounded-full scale-150 opacity-50 group-hover:bg-purple-200 transition-colors duration-300"></div>
            <component :is="step.icon" class="h-16 w-16 text-purple-600 relative z-10 group-hover:text-purple-700 transition-colors duration-300" />
          </div>
          <h4 class="text-xl text-center font-semibold mb-4 text-gray-800">{{ step.title }}</h4>
          <p class="text-gray-600 text-center flex-grow">{{ step.description }}</p>
          <div class="mt-2 flex items-center justify-center">
            <span class="text-3xl font-bold text-purple-600 mr-2"></span>
          </div>
        </div>
      </div>

      <!-- Interactive Image Section -->
      <div class="my-16 flex flex-col items-center justify-center mx-auto max-w-5xl px-4 md:px-8 relative">
        <h4 class="text-2xl text-center text-gray-600 text-muted-foreground mb-8 max-w-3xl mx-auto">
          Endless Possibilities Await You...
        </h4>
        
        <!-- Responsive Image Container -->
        <div 
          ref="imageContainer" 
          class="relative bg-gray-200 rounded-lg overflow-hidden w-full"
        >
          <div class="aspect-video sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[2/1]">
            <img 
              src="/app_ss.png" 
              alt="How it works demonstration" 
              class="w-full h-full object-cover transition-all duration-500"
              :class="{ 'blur-[2px]': isModalVisible }"
            />
          </div>
          
          <!-- Responsive Modal -->
          <div 
            class="absolute left-1/2 -translate-x-1/2 transform transition-transform duration-700 ease-out bg-gradient-to-t from-purple-600/90 to-purple-600/80 backdrop-blur-sm rounded-t-lg"
            :class="[
              isModalVisible ? 'translate-y-0' : 'translate-y-full',
              'p-4 sm:p-6 text-white'
            ]"
            style="width: 90%; max-width: 500px; bottom: 20px;"
          >
            <div class="flex items-center justify-center h-full">
              <div class="text-center">
                <div class="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 animate-fadeIn">
                  100% Healthy
                </div>
                <p class="text-sm sm:text-base animate-fadeIn animation-delay-200">
                  Discover nutritious recipes that align perfectly with your health goals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Obesity Section -->
      <div class="bg-gray-100 p-8 rounded-lg max-w-full mx-auto px-4 sm:px-6 md:px-10">
        <div class="mx-auto max-w-7xl">
          <!-- Title and Subtitle -->
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            <span class="text-purple-600">Obesity</span> in Singapore
          </h1>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-6">"A Growing Global Concern"</h2>

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
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <!-- Stat 1 -->
            <div class="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                <NumberCounter end-value="11.6" suffix="%" :decimals="1" :delay="0" />
              </h3>
              <p class="text-gray-600">Crude obesity prevalence in Singapore (2022)</p>
            </div>

            <!-- Stat 2 -->
            <div class="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                <NumberCounter end-value="40" suffix="-" :decimals="0" :delay="200" />
                <NumberCounter end-value="49" suffix=" years" :decimals="0" :delay="400" />
              </h3>
              <p class="text-gray-600">Age group with highest obesity rates (15%)</p>
            </div>

            <!-- Stat 3 -->
            <div class="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <h3 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                <NumberCounter end-value="2" suffix="x" :decimals="0" :delay="600" />
              </h3>
              <p class="text-gray-600">Global obesity rates since 1980</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Healthy Plate Section -->
      <div class="my-10"></div>
      <div class="bg-gray-100 p-4 sm:p-6 rounded-lg max-w-full mx-auto flex flex-col md:flex-row items-center">
        <!-- Image -->
        <div class="w-full sm:w-8/12 md:w-3/12 mb-4 md:mb-0 md:mr-6">
          <img 
            src="https://ch-api.healthhub.sg/api/public/content/4635b79d3a70405d9957c9e8e479c623?v=89e95a67"
            alt="Healthy Plate Image" 
            class="rounded-lg shadow-md w-full h-auto object-cover mx-auto min-w-52" 
          />
        </div>
        
        <!-- Text content -->
        <div class="w-full md:w-9/12 px-4 sm:px-6">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">My Healthy Plate Initiative</h2>
          <div class="w-16 border-b-2 border-gray-800 mb-4"></div>
          <p class="text-gray-700 mb-6">
            The "My Healthy Plate" initiative, created by Singapore's Health Promotion Board, provides a simple visual
            guide to encourage balanced, healthy eating. It emphasizes the importance of eating a wide variety of foods in
            the right amounts to meet daily nutritional needs. 
            <br><br>
            The concept of "Quarter, Quarter, Half" is a key takeaway:
            a quarter of your plate should be whole grains, a quarter should be good sources of protein, and half should
            be filled with fruits and vegetables. This approach helps individuals maintain a well-balanced diet, manage
            their weight, and reduce the risk of chronic diseases.
          </p>
          <a 
            href="https://www.healthhub.sg/programmes/nutrition-hub/eat-more#my-healthy-plate"
            class="inline-block bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300 items-center" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Find Out More
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { SearchIcon, CookingPotIcon, BookmarkIcon, ScaleIcon } from 'lucide-vue-next'
import NumberCounter from './NumberCounter.vue'

// Steps data
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
    icon: ScaleIcon,
    title: 'Customize and Modify',
    description: 'Adjust ingredients, modify nutritional content, or get substitute recommendations to perfectly match your preferences.',
    isVisible: false
  },
  {
    icon: BookmarkIcon,
    title: 'Save Your Favorites',
    description: 'Once you\'re happy with a recipe, save it to your collection for easy access in the future.',
    isVisible: false
  },
  
])

// Interactive image section
const imageContainer = ref(null)
const isModalVisible = ref(false)

// Scroll handler for modal
const handleScroll = () => {
  if (!imageContainer.value) return
  
  const rect = imageContainer.value.getBoundingClientRect()
  const triggerPoint = window.innerHeight * 0.75 // Trigger when image is 75% visible
  
  if (rect.top < triggerPoint && rect.bottom > 0) {
    isModalVisible.value = true
  } else {
    isModalVisible.value = false
  }
}

// Intersection Observer for steps animation
let observer
onMounted(() => {
  // Set up scroll listener for modal
  window.addEventListener('scroll', handleScroll)
  handleScroll()

  // Set up intersection observer for steps
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
  window.removeEventListener('scroll', handleScroll)
  if (observer) {
    observer.disconnect()
  }
})
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

.animate-fadeIn {
  animation: fadeIn 0.8s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>