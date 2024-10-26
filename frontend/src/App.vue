// App.vue
<template>
  <div class="app-container relative">
    <!-- Show loading state while auth is initializing -->
    <div
      v-if="!authStore.isInitialized"
      class="fixed inset-0 flex items-center justify-center bg-white"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
      ></div>
    </div>

    <!-- Only show main content once auth is initialized -->
    <template v-else>
      <div :class="{ 'pointer-events-none': shouldDisableInteraction }">
        <RouterView />
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