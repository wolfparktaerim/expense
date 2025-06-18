<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-8 pb-12">
    <div class="text-center max-w-4xl mx-auto">
      <!-- Enhanced Header with Better Typography -->
      <div class="mb-12 space-y-4">
        <div class="inline-flex items-center gap-3 mb-6">
          <h1
            class="text-4xl sm:text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Muneh Tracker
          </h1>
        </div>

        <p class="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
          Take control of your financial future
        </p>
        <p class="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Track your <span
            class='inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium select-none'>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd"
                d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm1 5a1 1 0 00-2 0v5.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 10-1.414-1.414L13 12.586V7z"
                clip-rule="evenodd" />
            </svg>
            expenses
          </span> and
          <span
            class='inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium select-none'>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd"
                d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm-1 12a1 1 0 102 0V8.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L11 8.414V14z"
                clip-rule="evenodd" />
            </svg>
            income
          </span> with ease
        </p>
      </div>

      <!-- Enhanced Action Buttons -->
      <div class="flex flex-col sm:flex-row justify-center gap-4 mb-16">
        <button
          class="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          @click="openForm('expense')">
          <div
            class="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          </div>
          <div class="relative flex items-center justify-center gap-3 select-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4M4 12l6 6M4 12l6-6" />
            </svg>
            <span class="text-lg">Add Expense</span>
            <span class="px-2 py-1 bg-white/20 rounded-lg text-sm">$--</span>
          </div>
        </button>

        <button
          class="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          @click="openForm('income')">
          <div
            class="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          </div>
          <div class="relative flex items-center justify-center gap-3 select-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12h16M12 4l8 8-8 8" />
            </svg>
            <span class="text-lg">Add Income</span>
            <span class="px-2 py-1 bg-white/20 rounded-lg text-sm">$++</span>
          </div>
        </button>
      </div>

      <!-- Enhanced Transaction Form Modal -->
      <div v-if="showForm"
        class="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
        <div
          class="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-scale-in">
          <!-- Enhanced Header -->
          <div class="relative px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <button
              class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-all duration-200"
              @click="closeForm">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div class="flex items-center gap-4">
              <div :class="[
                'w-12 h-12 rounded-2xl flex items-center justify-center',
                formType === 'expense' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              ]">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="formType === 'expense'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 12H4M4 12l6 6M4 12l6-6" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 12h16M12 4l8 8-8 8" />
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-800 select-none">
                  {{ formType === 'expense' ? 'Record Expense' : 'Record Income' }}
                </h2>
                <p class="text-sm text-gray-500 mt-1 select-none">
                  <span class="text-red-500">*</span> Required fields
                </p>
              </div>
            </div>
          </div>

          <!-- Enhanced Form Content -->
          <div class="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
            <form @submit.prevent="handleAddTransaction" class="space-y-6">
              <!-- Enhanced Activity Input -->
              <div class="space-y-2">
                <label for="activity" class="flex items-center gap-2 text-sm font-semibold text-gray-700 select-none">
                  <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.992 1.992 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Activity<span class="text-red-500 ml-1">*</span>
                </label>
                <input type="text" id="activity" v-model="transaction.activity"
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-gray-50 hover:bg-white transition-all duration-200 placeholder-gray-400"
                  :placeholder="formType === 'expense' ? 'e.g., Coffee at Starbucks, Grocery shopping' : 'e.g., Freelance payment, Salary deposit'"
                  required />
              </div>

              <!-- Enhanced Category Input -->
              <div class="space-y-2">
                <label for="category" class="flex items-center gap-2 text-sm font-semibold text-gray-700 select-none">
                  <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Category<span class="text-red-500 ml-1">*</span>
                </label>
                <select id="category" v-model="transaction.category"
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-gray-50 hover:bg-white transition-all duration-200"
                  required>
                  <option disabled value="">Choose a category</option>
                  <option v-for="category in (formType === 'expense' ? expenseCats : incomeCats)" :key="category">
                    {{ category }}
                  </option>
                </select>
              </div>

              <!-- Enhanced Amount Input -->
              <div class="space-y-2">
                <label for="amount" class="flex items-center gap-2 text-sm font-semibold text-gray-700 select-none">
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Amount<span class="text-red-500 ml-1">*</span>
                </label>
                <div class="relative">
                  <span
                    class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold text-lg">$</span>
                  <input type="number" id="amount" v-model.number="transaction.amount" step="0.01"
                    class="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-gray-50 hover:bg-white transition-all duration-200 text-lg font-semibold"
                    placeholder="0.00" required />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- Enhanced Date Input -->
                <div class="space-y-2">
                  <label for="date" class="flex items-center gap-2 text-sm font-semibold text-gray-700 select-none">
                    <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Date<span class="text-red-500 ml-1">*</span>
                  </label>
                  <input type="date" id="date" v-model="transaction.date"
                    class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-gray-50 hover:bg-white transition-all duration-200"
                    required />
                </div>

                <!-- Quick Date Buttons -->
                <div class="space-y-2">
                  <label class="text-sm font-semibold text-gray-700 select-none">Quick Select</label>
                  <div class="flex gap-2">
                    <button type="button" @click="setToday"
                      class="flex-1 px-3 py-2 text-xs bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors select-none">
                      Today
                    </button>
                    <button type="button" @click="setYesterday"
                      class="flex-1 px-3 py-2 text-xs bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors select-none">
                      Yesterday
                    </button>
                  </div>
                </div>
              </div>

              <!-- Enhanced Description Input -->
              <div class="space-y-2">
                <label for="description"
                  class="flex items-center gap-2 text-sm font-semibold text-gray-700 select-none">
                  <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Description <span class="text-gray-400">(optional)</span>
                </label>
                <textarea id="description" v-model="transaction.description" rows="3"
                  class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 bg-gray-50 hover:bg-white transition-all duration-200 placeholder-gray-400 resize-none"
                  placeholder="Add any additional notes or details...">
                </textarea>
              </div>

              <!-- Enhanced Periodic Options -->
              <div
                class="space-y-4 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                <label class="flex items-center gap-3 cursor-pointer group">
                  <div class="relative">
                    <input type="checkbox" v-model="transaction.periodic" class="sr-only peer" />
                    <div
                      class="w-6 h-6 bg-white border-2 border-gray-300 rounded-lg peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all duration-200 flex items-center justify-center">
                      <svg class="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <span
                      class="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors select-none">Recurring
                      Transaction</span>
                    <p class="text-xs text-gray-500 select-none">This will repeat automatically</p>
                  </div>
                </label>

                <div v-if="transaction.periodic" class="ml-9 grid grid-cols-2 gap-3">
                  <label v-for="period in periods" :key="period"
                    class="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-white/60 transition-all duration-200 border border-transparent hover:border-indigo-200">
                    <input type="radio" :value="period" v-model="transaction.period"
                      class="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                    <span class="text-sm font-medium text-gray-700 select-none">{{ period }}</span>
                  </label>
                </div>
              </div>

              <!-- Enhanced Form Buttons -->
              <div class="flex gap-4 pt-6 border-t border-gray-200">
                <button type="button" @click="closeForm"
                  class="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 select-none">
                  Cancel
                </button>
                <button type="submit"
                  class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg select-none">
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userTransactions } from '../stores/transactions';
import { useToast } from 'vue-toastification';
import { CircleArrowUp, CircleArrowDown } from 'lucide-vue-next';

export default {
  name: 'AddTransaction',
  data() {
    return {
      showForm: false,
      formType: 'expense',
      transaction: {
        activity: '',
        category: '',
        amount: null,
        description: '',
        date: this.getTodayDate(),
        periodic: false,
        period: '',
        timestamp: Date.now(),
        nextDueDate: ''
      },
      periods: [
        'Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly', 'Semi-Annually', 'Yearly'
      ],
      expenseCats: [
        "Childcare", "Clothing & Apparel", "Debt Repayment", "Education & Learning",
        "Electronics & Gadgets", "Emergency Expenses", "Entertainment", "Family",
        "Food & Drink", "Gift & Donation", "Health & Fitness", "Hobbies",
        "Home Maintenance", "Housing", "Insurance", "Legal Fees", "Miscellaneous",
        "Office Supplies", "Others", "Personal Care", "Pets", "Subscriptions & Memberships",
        "Taxes", "Transportation", "Travel", "Utilities"
      ],
      incomeCats: [
        "Alimony & Child Support", "Business Income", "Cashback & Rewards", "Consulting",
        "Crowdfunding", "Dividends", "Freelance", "Gift", "Government Assistance",
        "Grants", "Inheritances", "Insurance Payout", "Investment", "Miscellaneous",
        "Others", "Passive Income", "Pension Income", "Rental Income", "Royalties",
        "Salary", "Scholarship", "Sale of Assets", "Side Hustle", "Tax Refund"
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
        this.toast.success(`${this.formType === 'expense' ? 'Expense' : 'Income'} added successfully! 🎉`);
        this.closeForm();
      } catch (error) {
        console.error('Failed to add transaction:', error);
        this.toast.error('Failed to add transaction. Please try again.');
      }
    },
    resetForm() {
      this.transaction = {
        activity: '',
        category: '',
        amount: null,
        description: '',
        date: this.getTodayDate(),
        periodic: false,
        period: '',
      };
    },
    getTodayDate() {
      return new Date().toISOString().split('T')[0];
    },
    setToday() {
      this.transaction.date = this.getTodayDate();
    },
    setYesterday() {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      this.transaction.date = yesterday.toISOString().split('T')[0];
    }
  },
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus styles */
input:focus,
select:focus,
textarea:focus {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px -8px rgba(59, 130, 246, 0.5);
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Button hover effects */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Glassmorphism effect */
.bg-white\/60 {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Hide number input arrows */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Screen reader only */
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
</style>