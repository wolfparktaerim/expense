// App.vue
<template>
  <div class="app-container relative">
    <!-- Wrap RouterView in a div that can be disabled -->
    <div :class="{ 'pointer-events-none': shouldDisableInteraction }">
      <RouterView />
    </div>

    <!-- Login modal outside the disabled wrapper -->
    <LoginModal 
      v-if="authStore.showLoginModal" 
      :dismissible="false"
      @close="handleModalClose"
    />

    <!-- Optional overlay to prevent clicking through when modal is shown -->
    <div 
      v-if="shouldDisableInteraction && !authStore.showLoginModal" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
    ></div>
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
    return;
  }
  authStore.showLoginModal = false;
};
</script>

<style scoped>
.app-container {
  min-height: 100vh;
}
</style>