<template>
  <div 
    class="w-full overflow-hidden py-4"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div 
      ref="carouselRef"
      class="flex"
      :style="carouselStyle"
    >
      <div
        v-for="(item, index) in tripleItems" 
        :key="`${item.id}-${index}`"
        class="flex-shrink-0 w-[220px] px-2"
      >
        <div class="card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
          <img :src="item.image" :alt="item.name" class="w-full h-40 object-cover" />
          <div class="p-4">
            <h3 class="font-bold text-lg mb-1 text-purple-600">{{ item.name }}</h3>
            <p class="text-sm text-gray-600">{{ item.cuisine }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, name: "Korean Rice with Vegetables & Beef", cuisine: "Korean", image: "food/beef-bimbimbap.jpg" },
        { id: 2, name: "Cauliflower Fried Rice", cuisine: "Chinese", image: "food/cauliflower-fried-rice.jpg" },
        { id: 3, name: "Coconut Curry Mackeral Rice", cuisine: "Indian", image: "food/coconut-curry-mackerel.jpg" },
        { id: 4, name: "Pho with Zucchini Noodles", cuisine: "Vietnamese", image: "food/pho-with-zucchini-noodles.jpg" },
        { id: 5, name: "Salmon Quinoa Risotto", cuisine: "Italian", image: "food/salmon-quinoa-risotto.jpg" },
        { id: 6, name: "Slow Cooker Chicken Taco Soup", cuisine: "Mexican", image: "food/slow-cooker-chicken-taco-soup.jpg" },
        { id: 7, name: "Baked Sweet Potato Fries", cuisine: "American", image: "food/sweet-potato-fries.jpg" },
        { id: 8, name: "Teriyaki Chicken Soba", cuisine: "Japanese", image: "food/teriyaki-chicken-soba.jpg" },
        { id: 9, name: "Thai Green Mango Salad", cuisine: "Thai", image: "food/thai-green-mango-salad.jpg" },
        { id: 10, name: "Chicken, Sausage & Shrimp Paella", cuisine: "Spanish", image: "food/chicken-sausage-shrimp-paella.jpg" },
      ],
      hovering: false,
      translateX: 0,
      baseSpeed: 0.5,
      currentSpeed: 0.5,
    };
  },
  computed: {
    tripleItems() {
      return [...this.items, ...this.items, ...this.items];
    },
    carouselStyle() {
      return {
        transform: `translateX(${this.translateX}px)`,
        width: `${this.tripleItems.length * 220}px`,
        transition: 'transform 0.1s linear'
      };
    },
  },
  methods: {
    handleMouseEnter() {
      this.hovering = true;
      this.currentSpeed = this.baseSpeed / 4;
    },
    handleMouseLeave() {
      this.hovering = false;
      this.currentSpeed = this.baseSpeed;
    },
    animateCarousel() {
      this.translateX -= this.currentSpeed;
      
      const itemWidth = 220;
      const totalWidth = this.items.length * itemWidth;
      
      if (Math.abs(this.translateX) >= totalWidth) {
        this.translateX += totalWidth;
      }
      
      requestAnimationFrame(this.animateCarousel);
    },
    changeSpeed(newSpeed) {
      this.baseSpeed = newSpeed;
      if (!this.hovering) {
        this.currentSpeed = newSpeed;
      } else {
        this.currentSpeed = newSpeed / 4;
      }
    },
  },
  mounted() {
    requestAnimationFrame(this.animateCarousel);
  },
};
</script>

<style scoped>
.overflow-hidden {
  mask-image: none;
}

.card {
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
}

.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>