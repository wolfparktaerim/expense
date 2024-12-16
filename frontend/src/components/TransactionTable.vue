<template>
    <div class="p-6 rounded-lg shadow-md">
        <h1 class="text-3xl font-extrabold mb-6 text-center text-gray-800 tracking-wide underline decoration-green-500">
            Tran<span class='text-green-700'>$</span>action Table
        </h1>

        <!-- Table -->
        <div v-if="transactions.length > 0" class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500 table-auto">
                <thead class="text-xs text-gray-700 uppercase bg-gray-200">
                    <tr>
                        <th scope="col" class="px-6 py-3">Activity</th>
                        <th scope="col" class="px-6 py-3">Amount</th>
                        <th scope="col" class="px-6 py-3">Category</th>
                        <th scope="col" class="px-6 py-3">Date</th>
                        <th scope="col" class="px-6 py-3">Periodic</th>
                        <th scope="col" class="px-6 py-3">Description</th>
                        <th scope="col" class="px-6 py-3"> </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="transaction in paginatedTransactions" :key="transaction.id"
                        class="bg-white border-b hover:bg-gray-100">

                        <!-- Activity Name -->
                        <td class="px-6 py-4">{{ transaction.activity }}</td>

                        <!-- Amount -->
                        <td class="px-6 py-4 font-bold"
                            :class="transaction.amount < 0 ? 'text-red-500' : 'text-green-500'">
                            {{ transaction.amount < 0 ? transaction.amount.toFixed(2) : '+' +
                                transaction.amount.toFixed(2) }} </td>

                        <!-- Category -->
                        <td class="px-6 py-4">{{ transaction.category }}</td>

                        <!-- Date -->
                        <td class="px-6 py-4">
                            {{ transaction.date }}
                        </td>

                        <!-- Periodic options -->
                        <td class="px-6 py-4">
                            <template v-if="editingPeriodicId === transaction.id">
                                <!-- Dropdown for editing -->
                                <div class="flex items-center space-x-2">
                                    <select v-model="temporaryPeriodic"
                                        class="border rounded px-2 py-1">
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Bi-Weekly">Bi-Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                        <option value="Quarterly">Quarterly</option>
                                        <option value="Semi-Annually">Semi-Annually</option>
                                        <option value="Yearly">Yearly</option>
                                        <option value="">None</option>
                                    </select>

                                    <!-- Save button -->
                                    <button @click="savePeriodicChange(transaction)"
                                        class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                                        Save
                                    </button>
                                    <!-- Cancel button -->
                                    <button @click="cancelEdit"
                                        class="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">
                                        Cancel
                                    </button>
                                </div>
                            </template>
                            <template v-else>
                                <span   v-if="transaction.periodic && transaction.period != ''"  @click="editPeriodic(transaction)"
                                    class="cursor-pointer hover:underline text-blue-500">
                                    {{ transaction.periodic ? transaction.period : '-' }}
                                </span>
                            </template>
                        </td>

                        <!-- Description column -->
                        <td class="px-6 py-4">
                            <template v-if="transaction.description">
                                <div v-if="transaction.description.length > 50" class="relative">
                                    <span :class="{
                                        'line-clamp-2': !isDescriptionExpanded(transaction.id),
                                        'whitespace-pre-wrap': isDescriptionExpanded(transaction.id)
                                    }">
                                        {{ getDescriptionText(transaction) }}
                                    </span>
                                    <button @click="toggleDescription(transaction.id)"
                                        class="text-blue-500 hover:underline ml-2 text-sm">
                                        {{ isDescriptionExpanded(transaction.id) ? '(-) Collapse' : '(+) Expand' }}
                                    </button>
                                </div>
                                <span v-else>{{ transaction.description }}</span>
                            </template>
                            <span v-else>-</span>
                        </td>

                        <!-- Delete Button -->
                        <td class="px-6 py-4">
                            <button @click="confirmDelete(transaction.id)"
                                class="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">
                                Delete
                            </button>
                        </td>

                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="text-gray-500 text-center">
            No transactions yet.
        </div>

        <!-- Pagination Controls -->
        <div class="flex items-center justify-between mt-4" v-if="transactions.length > rowsPerPage">
            <div class="flex items-center space-x-2">
                <button @click="goToPage(1)" :disabled="currentPage === 1"
                    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    title="Go to first page">
                    « First
                </button>
                <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    title="Go to previous page">
                    Prev </button>
            </div>

            <div class="text-gray-700">
                Page {{ currentPage }} of {{ totalPages }}

                <!-- Go to Page -->
                <span v-if="transactions.length > rowsPerPage" class="mt-4 flex items-center space-x-2">
                    <input v-model.number="gotoPageInput" type="number" class="w-16 px-2 py-1 border rounded"
                        placeholder="Page" />
                    <button @click="goToPage(gotoPageInput)"
                        class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        Go
                    </button>
                </span>
            </div>

            <div class="flex items-center space-x-2">
                <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    title="Go to next page">
                    Next
                </button>
                <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages"
                    class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    title="Go to last page">
                    Last »
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
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>