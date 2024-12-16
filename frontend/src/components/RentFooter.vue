<template>
  <footer class="bg-gray-800 text-white py-8 mt-auto">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div v-for="section in footerSections" :key="section.title">
          <h5 class="font-semibold mb-4">{{ section.title }}</h5>
          <ul class="space-y-2">
            <li v-for="item in section.items" :key="item">
              <a href="#" class="hover:text-gray-300">{{ item }}</a>
            </li>
          </ul>
        </div>
        <div>
          <h5 class="font-semibold mb-4">Follow Us</h5>
          <div class="flex space-x-4">
            <a v-for="icon in socialIcons" :key="icon.name" href="#" class="hover:text-gray-300">
              <component :is="icon.component" class="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
      <div class="mt-8 text-center text-gray-400">
        <p>&copy; {{ currentYear }} Muneh Thracker</p>
      </div>
    </div>
  </footer>
</template>

<script>
import { FacebookIcon, TwitterIcon, InstagramIcon } from 'lucide-vue-next'

export default {
  data() {
    return {
      footerSections: [
        {
          title: 'About',
          items: ['About Us', 'Careers', 'Press']
        },
        {
          title: 'Support',
          items: ['Help Center', 'Safety', 'Cancellation Options']
        },
        {
          title: 'Legal',
          items: ['Terms of Service', 'Privacy Policy', 'Cookie Policy']
        }
      ],
      socialIcons: [
        { name: 'Facebook', component: FacebookIcon },
        { name: 'Twitter', component: TwitterIcon },
        { name: 'Instagram', component: InstagramIcon }
      ]
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>