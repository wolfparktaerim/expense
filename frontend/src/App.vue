// src/App.vue
<template>
  <div :class="{ 'pointer-events-none': shouldDisableInteraction }">
    <RouterView />
    <LoginModal 
      v-if="authStore.showLoginModal" 
      :dismissible="false"
      @close="handleModalClose"
    />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();

const shouldDisableInteraction = computed(() => {
  return route.meta.requiresAuth && !authStore.isAuthenticated;
});

const handleModalClose = () => {
  if (!authStore.isAuthenticated) {
    // Prevent modal from closing if user is not authenticated
    return;
  }
  authStore.showLoginModal = false;
};
</script>