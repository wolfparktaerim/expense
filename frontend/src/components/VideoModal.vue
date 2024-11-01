<!-- VideoModal.vue -->
<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" @close="$emit('update:modelValue', false)" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/75" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-4xl overflow-hidden rounded-2xl bg-white">
              <div class="relative">
                <!-- Close button -->
                <button
                  @click="$emit('update:modelValue', false)"
                  class="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <X class="h-6 w-6" />
                </button>

                <!-- Video container with 16:9 aspect ratio -->
                <div class="relative w-full" style="padding-top: 56.25%;">
                  <iframe
                    :src="`https://www.youtube.com/embed/${videoId}`"
                    class="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>

                <!-- Video info -->
                <div class="px-6 py-4">
                  <DialogTitle as="h3" class="text-xl font-semibold leading-6 text-gray-900">
                    {{ title }}
                  </DialogTitle>
                  <p class="mt-2 text-gray-600">
                    {{ description }}
                  </p>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { X } from 'lucide-vue-next'

export default {
  name: 'VideoModal',
  
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    X
  },

  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    videoId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },

  emits: ['update:modelValue']
}
</script>