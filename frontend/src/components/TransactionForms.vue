<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-8 track-container pb-12">

    <div class="text-center">
      <!-- Message to User -->
      <p class="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">Manage Your Finances Today!</p>
      <p class="text-lg sm:text-xl font-bold text-gray-800 mb-6 mx-4">
        Press the buttons below & fill up the form to add your <span class='text-red-500'>expense</span>/<span
          class='text-green-500'>income</span>!
      </p>

      <!-- Buttons to Add Expense or Income -->
      <div class="flex justify-center gap-2 sm:gap-4 mb-9">
        <button
          class="px-4 py-2 text-sm sm:px-8 sm:py-4 sm:text-lg bg-red-500 text-white font-bold rounded-full shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 whitespace-nowrap"
          @click="openForm('expense')">
          Add Expense $--
        </button>
        <button
          class="px-4 py-2 text-sm sm:px-8 sm:py-4 sm:text-lg bg-green-500 text-white font-bold rounded-full shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 whitespace-nowrap"
          @click="openForm('income')">
          Add Income $++
        </button>
      </div>

      <!-- Transaction Form Modal -->
      <div v-if="showForm" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div
          class="relative bg-white rounded-xl shadow-2xl w-11/12 sm:w-11/12 md:w-1/2 lg:w-1/3 p-8 max-h-[80vh] overflow-y-auto">
          <!-- Close Button -->
          <button class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            @click="closeForm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header -->
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800">
              {{ formType === 'expense' ? 'Add Expense' : 'Add Income' }}
            </h2>
            <p class="text-sm text-gray-500 mt-1">Fill in the details below. (Fields with <span
                class="text-red-500">*</span> are required.)</p>
          </div>

          <form @submit.prevent="handleAddTransaction" class="space-y-6">
            <!-- Activity Input -->
            <div class="space-y-2">
              <label for="activity" class="block text-sm font-semibold text-gray-700">Activity<span
                  class="text-red-500">*</span></label>
              <input type="text" id="activity" v-model="transaction.activity"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 transition-colors duration-200"
                placeholder="Enter activity name (eg: Buy books, buy coffee, etc)" required />
            </div>

            <!-- Category Input -->
            <div class="space-y-2">
              <label for="category" class="block text-sm font-semibold text-gray-700">Category<span
                  class="text-red-500">*</span></label>
              <select id="category" v-model="transaction.category"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 transition-colors duration-200"
                required>
                <option disabled value="">Select category</option>
                <option v-for="category in (formType === 'expense' ? expenseCats : incomeCats)" :key="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <!-- Amount Input -->
            <div class="space-y-2">
              <label for="amount" class="block text-sm font-semibold text-gray-700">Amount<span
                  class="text-red-500">*</span></label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input type="number" id="amount" v-model.number="transaction.amount" step="0.01"
                  class="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 transition-colors duration-200"
                  placeholder="0.00" required />
              </div>
            </div>

            <!-- Date Input -->
            <div class="space-y-2">
              <label for="date" class="block text-sm font-semibold text-gray-700">Date<span
                  class="text-red-500">*</span></label>
              <input type="date" id="date" v-model="transaction.date"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 transition-colors duration-200"
                required />
            </div>

            <!-- Description Input -->
            <div class="space-y-2">
              <label for="description" class="block text-sm font-semibold text-gray-700">Description</label>
              <textarea id="description" v-model="transaction.description" rows="3"
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 transition-colors duration-200"
                placeholder="Add a brief description (optional)"></textarea>
            </div>

            <!-- Periodic Checkbox and Frequency Options -->
            <div class="space-y-3 p-4 bg-gray-50 rounded-lg">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" v-model="transaction.periodic"
                  class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" />
                <span class="text-sm font-medium text-gray-700">Periodic Transaction</span>
              </label>
              <div v-if="transaction.periodic" class="ml-8 space-y-2">
                <label v-for="period in periods" :key="period"
                  class="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors duration-200">
                  <input type="radio" :value="period" v-model="transaction.period"
                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer" />
                  <span class="text-sm font-medium text-gray-700">{{ period }}</span>
                </label>
              </div>
            </div>

            <!-- Form Buttons -->
            <div class="flex justify-end items-center gap-4 pt-4 border-t">
              <button type="button" @click="closeForm"
                class="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 font-medium transition-colors duration-200">
                Cancel
              </button>
              <button type="submit"
                class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 font-medium transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <!-- Form Model ends here -->

    </div>
  </div>
</template>

<script>
import { userTransactions } from '../stores/transactions';
import { useToast } from 'vue-toastification';

export default {
  name: 'AddTransaction',
  data() {
    return {
      showForm: false,
      formType: 'expense', // 'expense' or 'income'
      transaction: {
        activity: '',
        category: '',
        amount: null,
        description: '',
        date: "",
        periodic: false,
        period: '',
        timestamp: Date.now(),
        nextDueDate: ''
      },
      periods: [
        'Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly', 'Semi-Annually', 'Yearly'
      ],
      expenseCats: [
        "Food & Drink", "Housing", "Transportation", "Entertainment", "Health & Fitness", "Clothing & Apparel", "Personal Care", "Education & Learning", "Insurance", "Gift & Donation", "Debt Repayment", "Family", "Miscellaneous", "Others"
      ],
      incomeCats: [
        "Salary", "Freelance", "Investment", "Business Income", "Rental Income", "Passive Income", "Pension Income", "Government Assistance", "Gift", "Inheritances", "Scholarship", "Miscellaneous", "Others"
      ]
    };
  },
  setup() {
    const transactionsStore = userTransactions();
    const toast = useToast();
    return { transactionsStore, toast };
  },
  methods: {
    openForm(type) {
      this.formType = type;
      this.showForm = true;
      this.resetForm();
    },
    closeForm() {
      this.showForm = false;
    },
    async handleAddTransaction() {
      try {
        const id = Date.now().toString();
        const amount = this.formType === 'expense' ? -Math.abs(this.transaction.amount) : Math.abs(this.transaction.amount);

        await this.transactionsStore.addTransaction({
          ...this.transaction,
          id,
          amount,
        });
        this.toast.success('Transaction added successfully!');
        this.closeForm();
      } catch (error) {
        console.error('Failed to add transaction:', error);
        this.toast.error('Failed to add transaction.');
      }
    },
    resetForm() {
      this.transaction = {
        activity: '',
        category: '',
        amount: null,
        description: '',
        date: '',
        periodic: false,
        period: '',
      };
    },
  },
};
</script>

<style scoped>
@media (max-width: 640px) {
  .text-4xl {
    font-size: 2.25rem;
    /* Adjust for smaller screens */
  }

  .text-lg {
    font-size: 1rem;
    /* Adjust for smaller screens */
  }

  .px-8,
  .py-4 {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  .space-x-6 {
    gap: 1rem;
    /* Reduce gap between buttons on smaller screens */
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Focus styles for better accessibility */
:focus-visible {
  outline: 2px solid #805ad5;
  outline-offset: 2px;
}

/* Custom scrollbar for better visual feedback */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f7fafc;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

.track-container {
  animation: fadeIn 0.5s ease-in-out;
}


@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes popIn {
  from {
    transform: scale(0.95);
  }

  to {
    transform: scale(1);
  }
}
</style>