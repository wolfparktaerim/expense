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
        <div v-on:click="test" class="card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
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
        { id: 1, name: "Pad Kra Pao", cuisine: "Thai", image: "food/Pad Kra Pao.jpg" },
        { id: 2, name: "Chicken Rice", cuisine: "Singaporean", image: "food/Chicken Rice.jpg" },
        { id: 3, name: "Margherita Pizza", cuisine: "Italian", image: "food/Margherita Pizza.jpg" },
        { id: 4, name: "Acai", cuisine: "Brazilian", image: "food/Acai.jpg" },
        { id: 5, name: "Tikka Masala", cuisine: "Indian", image: "food/Tikka Masala.jpg" },
        { id: 6, name: "Paella", cuisine: "Spanish", image: "food/Paella.jpg" },
        { id: 7, name: "Pho", cuisine: "Vietnamese", image: "food/Pho.jpg" },
        { id: 8, name: "Tacos al Pastor", cuisine: "Mexican", image: "food/Tacos al Pastor.jpg" },
        { id: 9, name: "Croissant", cuisine: "French", image: "food/Croissant.jpg" },
        { id: 10, name: "Egg Fried Rice", cuisine: "Chinese", image: "food/Egg Fried Rice.jpg" },
        { id: 11, name: "Ravioli", cuisine: "Italian", image: "food/Ravioli.jpg" },
        { id: 12, name: "Schnitzel", cuisine: "German", image: "food/Schnitzel.jpg" },
        { id: 13, name: "Gyros", cuisine: "Greek", image: "food/Gyros.jpg" },
        { id: 14, name: "Pad Thai", cuisine: "Thai", image: "food/Pad Thai.jpg" },
        { id: 15, name: "Tom Yam Goong", cuisine: "Thai", image: "food/Tom Yam Goong.jpg" },
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
    test(){
      console.log("test");
      alert("TEst")
    },
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