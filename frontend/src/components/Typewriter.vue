<template>
  <div class="text-5xl text-gray-800 font-bold text-center mb-8">
    {{ currentStructure.prefix }}
    <span class="text-purple-600">{{ displayText }}<span class="cursor-blink">|</span></span>
    {{ currentStructure.suffix }}
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const baseStructures = [
  { prefix: "Got ", changing: ["leftovers", "ingredients", "groceries"], suffix: "?" },
  { prefix: "Craving ", changing: ["something spicy", "Asian food", "Italian"], suffix: "?" },
  { prefix: "Need a ", changing: ["quick dinner", "breakfast", "lunch"], suffix: " idea?" },
  { prefix: "Feeling ", changing: ["adventurous", "creative", "inspired"], suffix: "?" },
  { prefix: "What's in ", changing: ["season", "your pantry", "the fridge"], suffix: " now?" }
]

const structureIndex = ref(0)
const wordIndex = ref(0)
const displayText = ref('')
const isDeleting = ref(false)
let timeout = null
const currentStructure = ref(baseStructures[0])

const TYPING_SPEED = 100
const DELETING_SPEED = 50
const PAUSE_TIME = 2000

const typeText = () => {
  const currentWord = currentStructure.value.changing[wordIndex.value]
  
  if (!isDeleting.value) {
    if (displayText.value.length < currentWord.length) {
      displayText.value = currentWord.slice(0, displayText.value.length + 1)
      timeout = setTimeout(typeText, TYPING_SPEED)
    } else {
      timeout = setTimeout(() => {
        isDeleting.value = true
        typeText()
      }, PAUSE_TIME)
    }
  } else {
    if (displayText.value.length > 0) {
      displayText.value = displayText.value.slice(0, -1)
      timeout = setTimeout(typeText, DELETING_SPEED)
    } else {
      isDeleting.value = false
      wordIndex.value = (wordIndex.value + 1) % currentStructure.value.changing.length
      
      if (wordIndex.value === 0) {
        structureIndex.value = (structureIndex.value + 1) % baseStructures.length
        currentStructure.value = baseStructures[structureIndex.value]
      }
      
      timeout = setTimeout(typeText, TYPING_SPEED)
    }
  }
}

onMounted(() => {
  timeout = setTimeout(typeText, TYPING_SPEED)
})

onBeforeUnmount(() => {
  if (timeout) {
    clearTimeout(timeout)
  }
})
</script>

<style scoped>
@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.cursor-blink {
  animation: blink 1s step-end infinite;
}
</style>