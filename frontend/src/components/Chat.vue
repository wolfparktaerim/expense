<template>
    <div>
      <!-- Chat Icon -->
      <button 
        class="fixed bottom-6 right-6 bg-purple-700 text-white rounded-full p-5 shadow-lg z-50 transition-transform duration-300 hover:scale-110"
        @click="toggleChat"
        :title="isChatOpen ? 'Close Chat' : 'Open Chat'"
      >
        <span v-if="isChatOpen">
            <img src="../../public/icon/close.png" alt="close icon" class="w-8 h-8">
        </span>
        <span v-else>
            <img src="../../public/icon/chat.png" alt="chat icon" class="w-8 h-8">
        </span>
      </button>
  
      <!-- Chat Window with Animation and Positioning -->
    <transition name="fade-slide">
      <div
        v-if="isChatOpen"
        class="fixed bottom-20 right-6 bg-white shadow-xl rounded-lg w-96 h-96 p-6 z-50 overflow-hidden"
      >
        <h2 class="text-lg font-semibold mb-4 text-purple-700">Chat with Us</h2>
        
        <!-- Predefined User Prompt Buttons -->
        <button
          v-for="prompt in prompts"
          :key="prompt"
          @click="sendPrompt(prompt)"
          class="w-full bg-purple-600 text-white py-2 mb-2 rounded-md transition-transform duration-200 hover:scale-105"
        >
          {{ prompt }}
        </button>
        
        <!-- Chat Content -->
        <div v-if="chatMessages.length > 0" class="mt-4 overflow-y-auto max-h-48">
          <div v-for="(message, index) in chatMessages" :key="index" :class="{'text-left': message.user, 'text-right': !message.user}">
            <p class="p-2 rounded-lg my-1" :class="message.user ? 'bg-gray-200' : 'bg-purple-200'">
              {{ message.text }}
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isChatOpen: false,
      chatMessages: [],
      prompts: [
        'Make this recipe healthier',
        'Suggest substitutions',
        'What are the nutrition benefits?',
      ]
    };
  },
  methods: {
    toggleChat() {
      this.isChatOpen = !this.isChatOpen;
    },
    async sendPrompt(prompt) {
      this.chatMessages.push({ text: prompt, user: true });
      const response = await this.fetchChatGPTResponse(prompt);
      if (response) {
        this.chatMessages.push({ text: response, user: false });
      }
    },
    async fetchChatGPTResponse(prompt) {
      try {
        const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_API_KEY`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
          }),
        });
        const data = await response.json();
        return data.choices[0].message.content;
      } catch (error) {
        console.error('Error fetching response:', error);
        return "Sorry, there was an error. Please try again.";
      }
    },
  },
};
</script>

<style scoped>
/* Custom styles for chat icon, chat window, and animation */
.fixed {
  position: fixed;
}
.right-6 {
  right: 1.5rem;
}
.bottom-6 {
  bottom: 1.5rem;
}
.bottom-20 {
  bottom: 5rem;
}
.z-50 {
  z-index: 50;
}

/* Fade and slide animation */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>