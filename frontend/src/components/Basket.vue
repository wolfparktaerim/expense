<template>
    <div class="basket" :style="{ left: position + '%' }">
        <img src="../../public/game/others/basket.png" width="80px" height="auto" alt="Basket" />
        
    </div>
    <button @click="$emit('moveLeft')">⬅️Left</button>
    <button @click="$emit('moveRight')">➡️Right</button>
  </template>
  
  <script>
  export default {
    props: ['position'],
  };
  </script>
  
  <style>
  .basket {
    position: absolute;
    bottom: 20px;
  }
  </style>