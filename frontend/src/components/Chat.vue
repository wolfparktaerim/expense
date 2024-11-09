<template>
  <div class="font-sans">
    <!-- Chat Toggle Button -->
    <button
      @click="isChatOpen = !isChatOpen"
      class="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 z-50"
      title="Recipe Assistant"
    >
      <MessageCircle v-if="!isChatOpen" class="w-6 h-6 text-white" />
      <X v-else class="w-6 h-6 text-white" />
    </button>

    <!-- Chat Window -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="isChatOpen"
        class="fixed bottom-24 right-6 w-96 max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl overflow-hidden z-40 flex flex-col"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
          <div class="flex items-center">
            <!-- Back Button - Only show in ingredient selection view -->
            <button
              v-if="showIngredientSelection"
              @click="handleBack"
              class="mr-2 p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <ArrowLeft class="w-5 h-5 text-white" />
            </button>

            <MessageSquare class="w-6 h-6 text-white mr-2" />
            <h2 class="text-xl font-semibold text-white">
              {{
                showIngredientSelection
                  ? "Select Ingredients"
                  : "Recipe Assistant"
              }}
            </h2>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col min-h-0">
          <div
            v-if="showIngredientSelection"
            class="flex-1 flex flex-col p-4 overflow-hidden"
          >
            <!-- Search Bar -->
            <div class="mb-4">
              <div class="relative">
                <Search
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                />
                <input
                  v-model="searchTerm"
                  type="text"
                  placeholder="Search ingredients..."
                  class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Ingredients List -->
            <div class="flex-1 overflow-y-auto space-y-2 min-h-0">
              <TransitionGroup
                enter-active-class="transition-all duration-200 ease-out"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
              >
                <div
                  v-for="ingredient in filteredIngredients"
                  :key="ingredient.name"
                  class="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                >
                  <input
                    type="checkbox"
                    v-model="selectedIngredients[ingredient.name]"
                    class="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span class="flex-1">
                    {{ ingredient.amount }} {{ ingredient.unit }}
                    {{ ingredient.name }}
                  </span>
                  <Check
                    v-if="selectedIngredients[ingredient.name]"
                    class="w-4 h-4 text-purple-600"
                  />
                </div>
              </TransitionGroup>
            </div>

            <!-- Find Substitutes Button -->
            <button
              @click="findSubstitutes"
              class="mt-4 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity duration-200 flex items-center justify-center"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Find Substitutes</span>
              <Loader v-else class="w-5 h-5 animate-spin" />
            </button>
          </div>

          <div v-else class="flex-1 flex flex-col min-h-0">
            <!-- Prompt Buttons -->
            <div class="p-4 space-y-2">
              <button
                v-for="prompt in prompts"
                :key="prompt.id"
                @click="handlePromptClick(prompt)"
                class="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-colors duration-200"
              >
                <span class="flex items-center">
                  <span class="mr-2">{{ prompt.icon }}</span>
                  {{ prompt.text }}
                </span>
                <ChevronRight class="w-4 h-4 text-purple-600" />
              </button>
            </div>

            <!-- Chat Messages -->
            <div
              ref="chatContainer"
              class="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
            >
              <TransitionGroup
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-4"
                enter-to-class="opacity-100 translate-y-0"
              >
                <div
                  v-for="(message, index) in chatMessages"
                  :key="index"
                  class="flex"
                  ref="messages"
                  :class="message.isUser ? 'justify-end' : 'justify-start'"
                >
                  <div
                    class="max-w-[80%] p-3 rounded-lg"
                    :class="
                      message.isUser
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    "
                  >
                    <template v-if="message.isFormatted">
                      <div v-html="formatMessage(message.text)"></div>
                    </template>
                    <template v-else>
                      {{ message.text }}
                    </template>
                  </div>
                </div>
              </TransitionGroup>

              <!-- Loading Indicator -->
              <div v-if="isLoading" class="flex justify-start">
                <div class="bg-gray-100 p-3 rounded-lg">
                  <Loader class="w-4 h-4 animate-spin text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import {
  MessageCircle,
  X,
  Search,
  Check,
  ChevronRight,
  Loader,
  MessageSquare,
  ArrowLeft,
} from "lucide-vue-next";
import axios from "axios";

export default {
  components: {
    MessageCircle,
    X,
    Search,
    Check,
    ChevronRight,
    Loader,
    MessageSquare,
    ArrowLeft,
  },

  props: {
    ingredients: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      isChatOpen: false,
      showIngredientSelection: false,
      selectedIngredients: {},
      chatMessages: [],
      isLoading: false,
      searchTerm: "",
      prompts: [
        { id: 1, text: "Make this recipe healthier", icon: "🥗" },
        { id: 2, text: "Suggest substitutions", icon: "🔄" },
        { id: 3, text: "What are the nutrition benefits?", icon: "📊" },
      ],
    };
  },

  computed: {
    filteredIngredients() {
      return this.ingredients.filter((ingredient) =>
        ingredient.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
  },

  watch: {
  chatMessages: {
    handler() {
      this.$nextTick(() => {
        const messages = this.$refs.messages;
        if (messages && messages.length) {
          const lastMessage = messages[messages.length - 1];
          lastMessage.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        });
      },
      deep: true,
    },
  },

  methods: {
    formatMessage(text) {
      if (!text) return "";

      // Split the text into lines
      const lines = text.split("\n");
      let formattedHtml = "";

      lines.forEach((line) => {
        line = line.trim();
        if (line.endsWith(":")) {
          // Headers
          formattedHtml += `<div class="font-bold mt-2 mb-1">${line}</div>`;
        } else if (line.startsWith("-")) {
          // Bullet points
          formattedHtml += `<div class="ml-4 my-1">${line}</div>`;
        } else if (line) {
          // Regular text
          formattedHtml += `<div class="my-1">${line}</div>`;
        }
      });

      return formattedHtml;
    },
    handleBack() {
      this.showIngredientSelection = false;
      this.searchTerm = "";
      // Reset selected ingredients
      this.selectedIngredients = {};
    },
    handlePromptClick(prompt) {
      if (prompt.text === "Suggest substitutions") {
        this.showIngredientSelection = true;
        this.ingredients.forEach((ingredient) => {
          this.$set(this.selectedIngredients, ingredient.name, false);
        });
      } else {
        this.sendMessage(prompt.text);
      }
    },

    async findSubstitutes() {
      const selected = Object.entries(this.selectedIngredients)
        .filter(([_, isSelected]) => isSelected)
        .map(([name]) => {
          const ingredient = this.ingredients.find((i) => i.name === name);
          return `${ingredient.amount} ${ingredient.unit} of ${name}`;
        });

      if (selected.length === 0) {
        this.chatMessages.push({
          text: "Please select at least one ingredient to find substitutes for.",
          isUser: false,
        });
        this.scrollToLatestMessage();
        return;
      }

      await this.sendMessage(`Find substitutes for: ${selected.join(", ")}`);
      this.showIngredientSelection = false;

      this.scrollToLatestMessage();
    },

    scrollToLatestMessage() {
    this.$nextTick(() => {
      const messages = this.$refs.messages;
      if (messages && messages.length) {
        const lastMessage = messages[messages.length - 1];
        lastMessage.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      });
    },

    async sendMessage(text) {
      this.chatMessages.push({ text, isUser: true });
      this.isLoading = true;

      try {
        const response = await this.fetchChatGPTResponse(text);
        if (response) {
          this.chatMessages.push({
            text: response,
            isUser: false,
            isFormatted: true,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        this.chatMessages.push({
          text: "Sorry, there was an error. Please try again.",
          isUser: false,
        });
      } finally {
        this.isLoading = false;
      }
    },

    async fetchChatGPTResponse(prompt) {
      const ingredientsList = this.ingredients
        .map(
          (ingredient) =>
            `${ingredient.amount} ${ingredient.unit} of ${ingredient.name}`
        )
        .join(", ");
      const servingSize = this.servingsize;

      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: `
                  Based on the given recipe ingredients: 
                  ${ingredientsList}. 
                  The current serving size for the ingredients used: ${servingSize}.
                  Prompt: ${prompt}.
                  If the prompt is 'Make this recipe healthier'/'Suggest substitutions', you must state decrease in calories (in kcal per serving, divide by serving size).
                  If the prompt is 'What are the nutrition benefits', state the approximate nutrition amount (fiber, vitamins, minerals, etc) for each ingredient, and do not suggest subsitutes.
                  If the recipe is healthy enough/you cannot come up with a healthier one, response accordingly.
                  Return the output in this format:
                  (If ask for ingredients) Ingredients Used:
                  - [Ingredient 1] - [Ingredient Quantity][in metric]
                  - [Ingredient 2] - [Ingredient Quantity][in metric]
                  ...
                  (If ask for instructions) Instructions:
                  - [Instruction 1 including ingredients and equipment]
                  - [Instruction 2 including ingredients and equipment]
                  ...
                  Do not include any markdown, make it as concise as possible.
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
        // console.log(response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
      } catch (error) {
        throw error;
      }
    },
  },
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
