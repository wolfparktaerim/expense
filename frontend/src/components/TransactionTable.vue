<template>
    <div class="transactions-container shadow-lg overflow-hidden max-w-full pb-6 bg-white">
        <!-- Header -->
        <div class="p-6 bg-gradient-to-r from-blue-600 to-green-400 mb-6">
            <h1 class="text-3xl md:text-4xl font-extrabold text-center text-white drop-shadow-md">
                All Tran<span class="text-green-200 animate-pulse">$</span>actions
            </h1>
        </div>

        <!-- Table -->
        <div v-if="transactions.length > 0" class="overflow-x-auto mx-4 md:mx-6 rounded-lg border border-gray-200">
            <table class="w-full text-sm text-left text-gray-600 table-auto">
                <thead class="text-xs uppercase bg-gray-100 sticky top-0">
                    <tr class="border-b border-gray-300">
                        <th scope="col" class="px-4 md:px-6 py-4 font-semibold">Activity</th>
                        <th scope="col" class="px-4 md:px-6 py-4 font-semibold">Amount</th>
                        <th scope="col" class="px-4 md:px-6 py-4 font-semibold">Category</th>
                        <th scope="col" class="px-4 md:px-6 py-4 font-semibold">Date</th>
                        <th scope="col" class="px-4 md:px-6 py-4 font-semibold">Periodic</th>
                        <th scope="col" class="px-4 md:px-6 py-4 font-semibold">Description</th>
                        <th scope="col" class="px-4 md:px-6 py-4 text-center font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="transaction in paginatedTransactions" :key="transaction.id"
                        class="bg-white hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0">

                        <!-- Activity Name -->
                        <td class="px-4 md:px-6 py-4 font-medium">{{ transaction.activity }}</td>

                        <!-- Amount -->
                        <td class="px-4 md:px-6 py-4 font-bold text-base"
                            :class="transaction.amount < 0 ? 'text-red-500' : 'text-emerald-500'">
                            <span class="flex items-center">
                                <span v-if="transaction.amount > 0">+</span>{{ transaction.amount.toFixed(2) }}
                            </span>
                        </td>

                        <!-- Category -->
                        <td class="px-4 md:px-6 py-4">
                            <span class="px-2.5 py-0.5 rounded-full text-gray-500 font-medium ">
                                {{ transaction.category }}
                            </span>
                        </td>

                        <!-- Date -->
                        <td class="px-4 md:px-6 py-4 text-gray-500">
                            {{ transaction.date }}
                        </td>

                        <!-- Periodic options -->
                        <td class="px-4 md:px-6 py-4">
                            <template v-if="editingPeriodicId === transaction.id">
                                <!-- Dropdown for editing -->
                                <div class="flex flex-col md:flex-row md:items-center gap-2">
                                    <select v-model="temporaryPeriodic" 
                                        class="block w-full rounded-md border-gray-300 shadow-sm 
                                               focus:border-blue-500 focus:ring focus:ring-blue-200 
                                               focus:ring-opacity-50 text-sm py-1.5 px-3">
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Bi-Weekly">Bi-Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Quarterly">Quarterly</option>
                                        <option value="Semi-Annually">Semi-Annually</option>
                                        <option value="Yearly">Yearly</option>
                                        <option value="">None</option>
                                    </select>

                                    <div class="flex gap-1">
                                        <!-- Save button -->
                                        <button @click="savePeriodicChange(transaction)"
                                            class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 
                                                   transition-colors focus:outline-none focus:ring-2 
                                                   focus:ring-green-400 focus:ring-opacity-50 text-xs">
                                            Save
                                        </button>
                                        <!-- Cancel button -->
                                        <button @click="cancelEdit"
                                            class="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 
                                                   transition-colors focus:outline-none focus:ring-2 
                                                   focus:ring-gray-400 focus:ring-opacity-50 text-xs">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <span v-if="transaction.periodic && transaction.period != ''"
                                    @click="editPeriodic(transaction)"
                                    class="cursor-pointer hover:underline text-blue-600 inline-flex items-center gap-1 
                                           py-1 px-2 bg-blue-50 rounded-full text-xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" 
                                         stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" 
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {{ transaction.periodic ? transaction.period : '-' }}
                                </span>
                                <span v-else class="text-gray-400">-</span>
                            </template>
                        </td>

                        <!-- Description column -->
                        <td class="px-4 md:px-6 py-4 max-w-xs">
                            <template v-if="transaction.description">
                                <div v-if="transaction.description.length > 50" class="relative">
                                    <span class="text-gray-600" :class="{
                                        'line-clamp-2': !isDescriptionExpanded(transaction.id),
                                        'whitespace-pre-wrap': isDescriptionExpanded(transaction.id)
                                    }">
                                        {{ getDescriptionText(transaction) }}
                                    </span>
                                    <button @click="toggleDescription(transaction.id)"
                                        class="text-blue-600 hover:text-blue-800 hover:underline ml-1 text-xs font-medium">
                                        {{ isDescriptionExpanded(transaction.id) ? '(-) Collapse' : '(+) Expand' }}
                                    </button>
                                </div>
                                <span v-else class="text-gray-600">{{ transaction.description }}</span>
                            </template>
                            <span v-else class="text-gray-400">-</span>
                        </td>

                        <!-- Delete Button -->
                        <td class="px-4 md:px-6 py-4 text-center">
                            <button @click="confirmDelete(transaction.id)"
                                class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-white 
                                       bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 
                                       focus:ring-red-400 focus:ring-opacity-50 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" 
                                     viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" 
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="text-gray-500 text-center bg-gray-50 py-12 px-4 mx-6 rounded-lg border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" 
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                <path stroke-linecap="round" stroke-linejoin="round" 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="text-lg font-medium">No transactions yet.</p>
            <p class="text-sm mt-2">Start adding transactions to track your finances.</p>
        </div>

        <!-- Pagination Controls -->
        <div class="w-full overflow-x-auto">
            <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-8 px-4 min-w-max"
                v-if="transactions.length > rowsPerPage">
                <!-- Navigation Buttons -->
                <button @click="goToPage(1)" :disabled="currentPage === 1"
                    class="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Go to first page">
                    <span class="hidden sm:inline">« First</span>
                    <span class="sm:hidden">«</span>
                </button>
                <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                    class="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Go to previous page">
                    <span class="hidden sm:inline">Previous</span>
                    <span class="sm:hidden">‹</span>
                </button>

                <!-- Current Page Info and Go to Page -->
                <div class="flex items-center px-3 py-2 bg-gray-100 rounded-md">
                    <span class="text-sm text-gray-700 whitespace-nowrap">
                        Page <span class="font-medium">{{ currentPage }}</span> of <span class="font-medium">{{ totalPages }}</span>
                    </span>
                </div>

                <div class="flex items-center gap-2">
                    <input v-model.number="gotoPageInput" type="number" min="1" :max="totalPages"
                        class="w-16 sm:w-20 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Page" />
                    <button @click="goToPage(gotoPageInput)"
                        class="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors">
                        Go
                    </button>
                </div>

                <!-- Navigation Buttons -->
                <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                    class="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Go to next page">
                    <span class="hidden sm:inline">Next</span>
                    <span class="sm:hidden">›</span>
                </button>
                <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages"
                    class="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Go to last page">
                    <span class="hidden sm:inline">Last »</span>
                    <span class="sm:hidden">»</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { userTransactions } from "../stores/transactions";
import { useToast } from 'vue-toastification';
export default {
    props: {
        transactions: {
            type: Array,
            required: true,
        },
        rowsPerPage: {
            type: Number,
            default: 10,
        },
    },
    setup() {
        const toast = useToast(); // Initialize toast
        return { toast };
    },
    data() {
        return {
            currentPage: 1,
            expandedDescriptions: [],
            gotoPageInput: 1,
            editingPeriodicId: null, // Track which transaction is being edited
            temporaryPeriodic: "", // Hold temporary value for editing
            error: "", // Validation error message
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.transactions.length / this.rowsPerPage);
        },
        paginatedTransactions() {
            const start = (this.currentPage - 1) * this.rowsPerPage;
            const end = start + this.rowsPerPage;
            return this.transactions.slice(start, end);
        },
    },
    methods: {
        async confirmDelete(transactionId) {
            if (confirm("Are you sure you want to delete this transaction?")) {
                await this.deleteTransaction(transactionId);
            }
        },
        async deleteTransaction(transactionId) {
            try {
                const store = userTransactions();
                await store.removeTransaction(transactionId);
                this.$emit("transaction-deleted", transactionId); // Notify parent to update data
                this.toast.success(
                    "Transaction deleted successfully!",
                    {
                        transitionDuration: 200, // Quick fade-in/out (200ms)
                        timeout: 1000,          // Shorter display time (2 seconds)
                        closeOnClick: true,
                    }
                ); // Success toast
            } catch (error) {
                console.error(`[deleteTransaction] Error deleting transaction:`, error);
                this.toast.error("Failed to delete transaction. Please try again."); // Error toast
            }
        },
        goToPage(page) {
            if (page < 1) page = 1;
            if (page > this.totalPages) page = this.totalPages;
            this.currentPage = page;
        },
        getDescriptionText(transaction) {
            if (this.isDescriptionExpanded(transaction.id)) {
                return transaction.description
            }
            return transaction.description.length > 50
                ? transaction.description.slice(0, 50) + '...'
                : transaction.description
        },
        toggleDescription(transactionId) {
            const index = this.expandedDescriptions.indexOf(transactionId)
            if (index > -1) {
                // If already expanded, remove from expanded list
                this.expandedDescriptions.splice(index, 1)
            } else {
                // If not expanded, add to expanded list
                this.expandedDescriptions.push(transactionId)
            }
        },
        isDescriptionExpanded(transactionId) {
            return this.expandedDescriptions.includes(transactionId)
        },
        // Allow user to edit the periodic field
        editPeriodic(transaction) {
            this.editingPeriodicId = transaction.id;
            this.temporaryPeriodic = transaction.period || ""; // Pre-fill with current value
        },

        cancelEdit() {
            this.editingPeriodicId = null;
            this.temporaryPeriodic = "";
            this.error = "";
        },

        async savePeriodicChange(transaction) {
            if (!this.validatePeriodicField(this.temporaryPeriodic)) {
                this.error = "Invalid periodic value. Please select a valid option.";
                return;
            }

            try {
                const store = userTransactions();
                this.error = ""; // Clear any previous error
                this.editingPeriodicId = null; // Exit edit mode

                const updatedTransaction = {
                    ...transaction,
                    periodic: this.temporaryPeriodic !== "", // Determine if periodic based on field value
                    period: this.temporaryPeriodic || null, // Null if non-periodic
                };

                // Show visual feedback during the update
                await store.updateTransaction(updatedTransaction);

                this.toast.success("Periodic field updated successfully!", {
                    transitionDuration: 200,
                    timeout: 1000,
                    closeOnClick: true,
                });
            } catch (error) {
                console.error(`[savePeriodicChange] Error updating periodic field:`, error);
                this.toast.error("Failed to update periodic field. Please try again.");
            }
        },

        validatePeriodicField(value) {
            // Ensure the value is one of the allowed periodic options or empty
            const validValues = ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly', 'Semi-Annually', 'Yearly', ""];
            return validValues.includes(value);
        },
    }
};
</script>

<style scoped>
.transactions-container {
    animation: fadeIn 0.5s ease-in-out;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
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

/* Fix for select boxes in mobile view */
select {
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}

/* Responsive table adjustments */
@media (max-width: 768px) {
    th, td {
        padding-left: 10px;
        padding-right: 10px;
    }
    
    .transactions-container {
        border-radius: 0.5rem;
        margin: 0 auto;
    }

    /* Ensure the table doesn't overflow the container */
    .overflow-x-auto {
        -webkit-overflow-scrolling: touch;
    }
}

/* Pagination styles for better visibility */
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

input[type="number"] {
    -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>