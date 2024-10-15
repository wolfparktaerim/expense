<template>
  <section class="py-24 bg-gradient-to-b from-gray-50 to-white">
    <div class="container mx-auto px-4">
      <h3 class="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800">
        How it <span class="text-purple-600">Works</span>
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-center">
        <div 
          v-for="(step, index) in steps" 
          :key="step.title" 
          class="step-item flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          :class="{ 'is-visible': step.isVisible }"
          @mouseenter="activeStep = index"
          @mouseleave="activeStep = null"
        >
          <div class="relative mb-8 transition-transform duration-300" :class="{ 'scale-110': activeStep === index }">
            <div class="absolute inset-0 bg-purple-100 rounded-full scale-150 opacity-50"></div>
            <component 
              :is="step.icon" 
              class="h-16 w-16 text-purple-600 relative z-10" 
            />
          </div>
          <!-- Center the title text on smaller screens -->
          <h4 class="text-xl font-semibold mb-4 text-gray-800 sm:text-center">{{ step.title }}</h4>
          <!-- Center the description text on smaller screens -->
          <p class="text-gray-600 sm:text-center">{{ step.description }}</p>
          <div class="step-number mt-6 flex items-center justify-center">
            <span class="text-3xl font-bold text-purple-600 mr-2">{{ index + 1 }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { SearchIcon, CookingPotIcon, BookmarkIcon } from 'lucide-vue-next'

export default {
  components: {
    SearchIcon,
    CookingPotIcon,
    BookmarkIcon
  },
  setup() {
    const activeStep = ref(null)
    const steps = ref([
      {
        icon: SearchIcon,
        title: 'Create Recipes',
        description: 'Generate personalized recommendations based on your health goals, dietary requirements and culinary preferences',
        isVisible: false
      },
      {
        icon: CookingPotIcon,
        title: 'View Recipe Details',
        description: 'Get a complete breakdown of time taken, ingredients, cooking steps, and nutritional information for your chosen recipe',
        isVisible: false
      },
      {
        icon: BookmarkIcon,
        title: 'Save Your Favorites',
        description: 'Once you\'re happy with a recipe, save it to your collection for easy access in the future',
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
  .step-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    height: 100%;
  }

  .step-item.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .step-number {
    margin-top: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .step-item:hover .relative {
    transform: scale(1.1);
  }

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
</style>