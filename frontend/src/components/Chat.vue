<template>
    <div>
      <!-- Chat Icon -->
      <button 
        class="fixed bottom-4 right-4 bg-purple-700 text-white rounded-full p-3"
        @click="toggleChat"
        :title="isChatOpen ? 'Close Chat' : 'Open Chat'"
      >
        <span v-if="isChatOpen">✖</span>
        <span v-else>💬</span>
      </button>
  
      <!-- Chat Window -->
      <div
        v-if="isChatOpen"
        class="fixed bottom-16 right-4 bg-white shadow-lg rounded-lg w-72 p-4"
      >
        <h2 class="text-lg font-semibold mb-4 text-purple-700">Chat with Us</h2>
        
        <!-- Predefined User Prompt Buttons -->
        <button
          v-for="prompt in prompts"
          :key="prompt"
          @click="sendPrompt(prompt)"
          class="w-full bg-purple-600 text-white py-2 mb-2 rounded-md"
        >
          {{ prompt }}
        </button>
        
        <!-- Chat Content -->
        <div v-if="chatMessages.length > 0" class="mt-4 overflow-y-auto max-h-64">
          <div v-for="(message, index) in chatMessages" :key="index" :class="{'text-left': message.user, 'text-right': !message.user}">
            <p class="p-2 rounded-lg my-1" :class="message.user ? 'bg-gray-200' : 'bg-purple-200'">
              {{ message.text }}
            </p>
          </div>
        </div>
      </div>
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
        // Add user's message to chat
        this.chatMessages.push({ text: prompt, user: true });
  
        // Call ChatGPT API
        const response = await this.fetchChatGPTResponse(prompt);
        if (response) {
          this.chatMessages.push({ text: response, user: false });
        }
      },
      async fetchChatGPTResponse(prompt) {
        // This is where you'd use the actual API endpoint and your API key
        try {
          const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_CHAT_GPT_API_KEY}`,
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
  /* Custom styles for the chat icon and window */
  .fixed { position: fixed; }
  .right-4 { right: 1rem; }
  .bottom-4 { bottom: 1rem; }
  .bottom-16 { bottom: 4rem; }
  </style>