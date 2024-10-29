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
        class="fixed bottom-20 right-20 bg-white shadow-xl rounded-lg w-120 h-96 p-6 z-50 overflow-hidden"
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
        
        <!-- Chat Content with Auto-scroll -->
        <div ref="chatContainer" v-if="chatMessages.length > 0" class="mt-4 overflow-y-auto max-h-80">
          <div 
            v-for="(message, index) in chatMessages" 
            :key="index" 
          >
            <p 
              class="p-2 rounded-lg my-1 whitespace-pre-line break-words"
              :class="message.user ? 'bg-gray-200' : 'bg-purple-200'"
            >
              {{ message.text }}
            </p>
          </div>
        </div>
        

      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props:{
    ingredients:{
      type: Array,
      required: true,
    }
  },
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
    scrollToLatestMessage() {
      const chatContainer = this.$refs.chatContainer;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    },
    async sendPrompt(prompt) {
      this.chatMessages.push({ text: prompt, user: true });
      this.$nextTick(this.scrollToLatestMessage);


      const response = await this.fetchChatGPTResponse(prompt);
      if (response) {
        this.chatMessages.push({ text: response, user: false });
        this.$nextTick(this.scrollToLatestMessage);
      }
    },
    async fetchChatGPTResponse(prompt) {
      const ingredientsList = this.ingredients
      .map(ingredient => `${ingredient.amount} ${ingredient.unit} of ${ingredient.name}`)
      .join(', ');
      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: `
                  Do not include any markdown.
                  Keep it concise.
                  Based on the given recipe ingredients: 
                  ${ingredientsList}. 
                  ${prompt}. (<- Answer to this prompt only, do not add anything not necessary)
                  Return the output in this format: (make sure you add /n /t appropriately):
                  Ingredients Used:
                  - [Ingredient 1] - [Ingredient Quantity][Unit]
                  - [Ingredient 2] - [Ingredient Quantity][Unit]
                  - [Ingredient 3] - [Ingredient Quantity][Unit]
                  ...
                  Instructions:
                  - [Instruction 1 including ingredients and equipment]
                  - [Instruction 2 including ingredients and equipment]
                  - [Instruction 3 including ingredients and equipment]
                  ...
                  `,
              },
            ],
            temperature: 0.1,
          },
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_CHAT_GPT_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data.choices[0].message.content;
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

/* Larger chat window */
.w-120 {
  width: 30rem; /* Adjusted width */
}
.h-96 {
  height: 40rem; /* Adjusted height */
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