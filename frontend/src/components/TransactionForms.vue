<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-8">
    <div class="text-center">
      <!-- Message to User -->
      <p class="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">Manage Your Finances Today!</p>
      <p class="text-lg sm:text-xl font-bold text-gray-800 mb-6">
        Press the buttons below & fill up the form to add your <span class='text-red-500'>expense</span>/<span class='text-green-500'>income</span>!
      </p>

      <!-- Buttons to Add Expense or Income -->
      <div class="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-9">
        <button
          class="px-8 py-4 text-lg sm:text-xl bg-red-500 text-white font-bold rounded-full shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
          @click="openForm('expense')">
          Add Your Expense $--
        </button>
        <button
          class="px-8 py-4 text-lg sm:text-xl bg-green-500 text-white font-bold rounded-full shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
          @click="openForm('income')">
          Add Your Income $++
        </button>
      </div>

      <!-- Transaction Form Modal -->
      <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div
          class="relative bg-white rounded-lg shadow-lg w-11/12 sm:w-11/12 md:w-1/2 lg:w-1/3 p-6 max-h-[75vh] overflow-y-auto">
          <!-- Close Button -->
          <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-800" @click="closeForm">
            ✕
          </button>

          <h2 class="text-xl font-bold text-gray-800 mb-4">
            {{ formType === 'expense' ? 'Add Expense' : 'Add Income' }}
          </h2>

          <form @submit.prevent="handleAddTransaction" class="space-y-4">
            <!-- Activity Input -->
            <div>
              <label for="activity" class="block text-sm font-medium text-gray-700 w-1/3 text-left">Activity*</label>
              <input type="text" id="activity" v-model="transaction.activity"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter activity name (eg: Buy book, eat at hawker center, salary...)" required />
            </div>

            <!-- Category Input -->
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 w-1/3 text-left">Category*</label>
              <select id="category" v-model="transaction.category"
                class="mt-1 block w-2/3 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required>
                <option disabled value="">Select category</option>
                <option v-for="category in (formType === 'expense' ? expenseCats : incomeCats)" :key="category">{{
                  category }}</option>
              </select>
            </div>

            <!-- Amount Input -->
            <div>
              <label for="amount" class="block text-sm font-medium text-gray-700 w-1/3 text-left">Amount*</label>
              <input type="number" id="amount" v-model.number="transaction.amount" step="0.01"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter amount" required />
            </div>

            <!-- Date Input -->
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700 w-1/3 text-left">Date*</label>
              <input type="date" id="date" v-model="transaction.date"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required />
            </div>

            <!-- Description Input -->
            <div>
              <label for="description"
                class="block text-sm font-medium text-gray-700 w-1/3 text-left">Description</label>
              <textarea id="description" v-model="transaction.description"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Add a brief description (this is optional)"></textarea>
            </div>

            <!-- Periodic Checkbox and Frequency Options -->
            <div>
              <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="transaction.periodic"
                  class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <span class="text-sm font-medium text-gray-700">Periodic Transaction</span>
              </label>
              <div v-if="transaction.periodic" class="mt-2 space-y-2">
                <label v-for="period in periods" :key="period" class="flex items-center space-x-2">
                  <input type="radio" :value="period" v-model="transaction.period"
                    class="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                  <span class="text-sm font-medium text-gray-700">{{ period }}</span>
                </label>
              </div>
            </div>

            <!-- Form Buttons -->
            <div class="flex justify-between items-center mt-4 space-x-2">
              <button type="button" @click="closeForm"
                class="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 text-sm sm:text-base">
                Cancel
              </button>
              <button type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 text-sm sm:text-base">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
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
</style>