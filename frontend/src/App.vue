// App.vue
<template>
  <div class="app-container relative">
    <!-- Show loading state while auth initializes -->
    <div
      v-if="!authStore.authInitialized"
      class="fixed inset-0 flex items-center justify-center"
    >
      <div
        class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"
      ></div>
    </div>

    <!-- Main content -->
    <template v-else>
      <div :class="{ 'pointer-events-none': shouldDisableInteraction }">
        <router-view />
      </div>

      <LoginModal
        v-if="authStore.showLoginModal"
        :dismissible="false"
        @close="handleModalClose"
      />

      <div
        v-if="shouldDisableInteraction && !authStore.showLoginModal"
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
      ></div>
    </template>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { computed } from "vue";
import { useRoute } from "vue-router";

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
