<template>
    <div :class="['food-item', type]" :style="{ left: position + '%', top: top + 'px' }">
      <img :src="iconSrc" />
    </div>
  </template>
  
  <script>
  export default {
    props: ['type', 'position'],
    data() {
      return {
        top: 0,
      };
    },
    computed: {
      iconSrc() {
        return this.type === 'healthy'
          ? require(`@/assets/healthy/almond.png`) // Replace with glob for random icons
          : require(`@/assets/unhealthy/burger.png`);
      },
    },
    mounted() {
      this.dropFood();
    },
    methods: {
      dropFood() {
        const interval = setInterval(() => {
          if (this.top < 400) {
            this.top += 5;
          } else {
            clearInterval(interval);
            this.$emit('caught');
          }
        }, 100);
      },
    },
  };
  </script>
  
  <style>
  .food-item {
    position: absolute;
    width: 30px;
  }
  </style>