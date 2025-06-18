<template>
    <div class="generator-container bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
        <!-- Enhanced Header with animated gradient -->
        <div class="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-500 to-teal-600 mb-10">
            <div class="absolute inset-0 bg-gradient-to-r from-emerald-800/20 to-teal-800/20"></div>

            <!-- Animated background elements -->
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full animate-pulse"></div>
                <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full animate-bounce"
                    style="animation-duration: 3s;"></div>
                <div class="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-ping"
                    style="animation-duration: 4s;"></div>
            </div>

            <div class="relative px-6 py-12">
                <div class="max-w-7xl mx-auto text-center select-none">
                    <h1
                        class="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
                        Generate <span class="text-yellow-300 animate-pulse drop-shadow-lg">$</span>tatement Report
                    </h1>
                </div>
            </div>
        </div>

        <!-- Enhanced Filters Section with glass morphism -->
        <div class="max-w-7xl mx-auto px-4 md:px-6 mb-10">
            <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div class="bg-gradient-to-r from-slate-50/80 to-blue-50/80 px-8 py-6 border-b border-gray-200/50">
                    <h2 class="text-xl font-bold text-gray-800 flex items-center gap-3 select-none">
                        <div
                            class="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                            </svg>
                        </div>
                        Report Configuration
                    </h2>
                </div>

                <div class="p-8 space-y-8">
                    <!-- Report Type and Category Row -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Enhanced Report Type -->
                        <div class="group">
                            <label for="type" class="block text-sm font-semibold text-gray-700 mb-3 select-none">Report
                                Type</label>
                            <div class="relative">
                                <select id="type" v-model="filters.type" @change="updateCategories"
                                    class="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 focus:bg-white appearance-none cursor-pointer shadow-inner hover:border-gray-300">
                                    <option value="all">All Transactions</option>
                                    <option value="income">Income Only</option>
                                    <option value="expense">Expenses Only</option>
                                </select>
                                <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <svg class="h-6 w-6 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Enhanced Category Filter -->
                        <div class="group">
                            <label for="category"
                                class="block text-sm font-semibold text-gray-700 mb-3 select-none">Category</label>
                            <div class="relative">
                                <select id="category" v-model="filters.category"
                                    class="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50 focus:bg-white appearance-none cursor-pointer shadow-inner hover:border-gray-300">
                                    <option value="">All Categories</option>
                                    <option v-for="category in categories" :key="category" :value="category">
                                        {{ category }}
                                    </option>
                                </select>
                                <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <svg class="h-6 w-6 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Date Range Row -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Enhanced Start Date -->
                        <div class="relative group">
                            <label for="startDate"
                                class="block text-sm font-semibold text-gray-700 mb-3 select-none">Start
                                Date</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input type="date" id="startDate" v-model="filters.startDate"
                                    class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-inner hover:border-gray-300" />
                            </div>
                        </div>

                        <!-- Enhanced End Date -->
                        <div class="relative group">
                            <label for="endDate" class="block text-sm font-semibold text-gray-700 mb-3 select-none">End
                                Date</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input type="date" id="endDate" v-model="filters.endDate"
                                    class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-inner hover:border-gray-300" />
                            </div>
                        </div>
                    </div>

                    <!-- Enhanced Amount Range Row -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Amount Lower Bound -->
                        <div class="relative group">
                            <label for="amountLower"
                                class="block text-sm font-semibold text-gray-700 mb-3 select-none">Minimum
                                Amount</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span
                                        class="text-gray-400 group-focus-within:text-emerald-500 transition-colors">$</span>
                                </div>
                                <input type="number" id="amountLower" v-model.number="filters.amountLower" step="0.01"
                                    placeholder="0.00"
                                    class="w-full pl-8 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-inner hover:border-gray-300" />
                            </div>
                        </div>

                        <!-- Amount Upper Bound -->
                        <div class="relative group">
                            <label for="amountHigher"
                                class="block text-sm font-semibold text-gray-700 mb-3 select-none">Maximum
                                Amount</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span
                                        class="text-gray-400 group-focus-within:text-emerald-500 transition-colors">$</span>
                                </div>
                                <input type="number" id="amountHigher" v-model.number="filters.amountHigher" step="0.01"
                                    placeholder="0.00"
                                    class="w-full pl-8 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-inner hover:border-gray-300" />
                            </div>
                        </div>
                    </div>

                    <!-- Enhanced Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button @click="generateReport"
                            class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 select-none">
                            <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Generate Report
                        </button>

                        <button @click="clearFilters"
                            class="inline-flex items-center px-6 py-4 bg-gradient-to-r from-gray-500 to-slate-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/20 select-none">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Enhanced Report Preview Section -->
        <div v-if="generatedReport.length > 0" class="max-w-7xl mx-auto px-4 md:px-6 mb-10">
            <div
                class="report-preview bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <!-- Enhanced Report Header -->
                <div class="bg-gradient-to-r from-slate-50/80 to-blue-50/80 px-8 py-6 border-b border-gray-200/50">
                    <h2 class="text-3xl font-bold text-center text-gray-800 mb-2 select-none">{{ reportTitle }}</h2>
                    <div class="text-center space-y-2">
                        <p class="text-sm text-gray-600" v-if="filters.startDate && filters.endDate">
                            <span class="font-semibold select-none">Period:</span>
                            {{ formatDate(filters.startDate) }} to {{ formatDate(filters.endDate) }}
                        </p>
                        <div class="flex justify-center gap-4 text-sm">
                            <span class="text-emerald-800 font-semibold select-none">
                                {{ generatedReport.length }} Transaction{{ generatedReport.length !== 1 ? 's' : '' }}
                            </span>
                            <span v-if="filters.category" class="text-blue-800 font-semibold select-none">
                                Category: {{ filters.category }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Enhanced Table -->
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-gradient-to-r from-gray-50/80 to-slate-50/80 border-b border-gray-200/50">
                            <tr>
                                <th
                                    class="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider select-none">
                                    Activity
                                </th>
                                <th
                                    class="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider select-none">
                                    Category
                                </th>
                                <th
                                    class="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider select-none">
                                    Date
                                </th>
                                <th
                                    class="px-8 py-6 text-right text-xs font-bold text-gray-700 uppercase tracking-wider select-none">
                                    Amount
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white/50 divide-y divide-gray-200/30">
                            <tr v-for="transaction in generatedReport" :key="transaction.id"
                                class="hover:bg-white/70 transition-all duration-200 group">
                                <td
                                    class="px-8 py-6 font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                    {{ transaction.activity }}
                                </td>
                                <td class="px-8 py-6">
                                    <span
                                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200">
                                        {{ transaction.category }}
                                    </span>
                                </td>
                                <td class="px-8 py-6 text-gray-600 font-medium">
                                    {{ formatDate(transaction.date) }}
                                </td>
                                <td class="px-8 py-6 text-right font-bold text-lg"
                                    :class="transaction.amount < 0 ? 'text-red-600' : 'text-green-600'">
                                    <div class="inline-flex items-center px-4 py-2 rounded-full"
                                        :class="transaction.amount < 0
                                            ? 'bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-200'
                                            : 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200'">
                                        {{ formattedCurrency(transaction.amount) }}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot class="bg-gradient-to-r from-slate-50/80 to-blue-50/80 border-t-2 border-gray-300">
                            <tr>
                                <td colspan="3" class="px-8 py-6 text-right text-lg font-bold text-gray-800">
                                    {{ filters.type !== 'all' ?
                                        `Total ${filters.type === 'expense' ? 'Expense' : 'Income'}:` : 'Net Income:' }}
                                </td>
                                <td class="px-8 py-6 text-right">
                                    <div class="inline-flex items-center px-6 py-3 rounded-2xl text-xl font-bold shadow-lg"
                                        :class="(filters.type === 'expense' || (filters.type === 'all' && netIncome < 0)) ?
                                            'bg-gradient-to-r from-red-500 to-pink-500 text-white' :
                                            'bg-gradient-to-r from-green-500 to-emerald-500 text-white'">
                                        {{ formattedCurrency(filters.type !== 'all' ? totalAmount : netIncome) }}
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <!-- Enhanced Export Buttons with reduced animation -->
            <div class="mt-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button @click="exportToPDF"
                        class="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-500/20 select-none">
                        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Export to PDF
                    </button>

                    <button @click="exportToExcel"
                        class="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 select-none">
                        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export to Excel
                    </button>

                    <button @click="exportToImg"
                        class="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 select-none">
                        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Export to Image
                    </button>
                </div>
            </div>
        </div>

        <!-- Enhanced Empty State -->
        <div v-else-if="pressed" class="max-w-7xl mx-auto px-4 md:px-6 mb-10">
            <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div class="text-center py-20 px-10">
                    <div
                        class="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-gray-100 to-slate-100 rounded-full flex items-center justify-center shadow-inner">
                        <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4 select-none">No transactions found</h3>
                    <p class="text-gray-500 mb-8 max-w-md mx-auto text-lg leading-relaxed select-none">
                        No transactions match your current filter criteria. Try adjusting your filters or adding new
                        transactions.
                    </p>
                    <button @click="clearFilters"
                        class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 select-none">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { userTransactions } from "../stores/transactions.js";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image-more';

export default {
    data() {
        return {
            filters: {
                type: "all",
                startDate: "",
                endDate: "",
                category: "",
                amountLower: null,
                amountHigher: null,
            },
            transactions: [],
            categories: [],
            generatedReport: [],
            totalAmount: 0,
            netIncome: 0,
            pressed: false,
        };
    },
    computed: {
        reportTitle() {
            if (this.filters.type === "income") return "Income Statement";
            if (this.filters.type === "expense") return "Expense Statement";
            return "Income and Expense Statement";
        },
    },
    methods: {
        async fetchTransactions() {
            const store = userTransactions();
            await store.loadTransactions();
            this.transactions = store.transactions;
            this.updateCategories();
        },

        updateCategories() {
            const { type } = this.filters;
            if (type === "all") {
                this.categories = Array.from(new Set(this.transactions.map((t) => t.category)));
            } else if (type === "income") {
                this.categories = Array.from(
                    new Set(this.transactions.filter((t) => t.amount > 0).map((t) => t.category))
                );
            } else if (type === "expense") {
                this.categories = Array.from(
                    new Set(this.transactions.filter((t) => t.amount < 0).map((t) => t.category))
                );
            }
        },

        generateReport() {
            const { startDate, endDate, category, type, amountLower, amountHigher } = this.filters;
            this.pressed = true;

            // Filter transactions based on criteria
            this.generatedReport = this.transactions.filter((t) => {
                const matchesType =
                    type === "all" ||
                    (type === "income" && t.amount > 0) ||
                    (type === "expense" && t.amount < 0);
                const matchesDate =
                    (!startDate || t.date >= startDate) &&
                    (!endDate || t.date <= endDate);
                const matchesCategory = !category || t.category === category;

                // Enhanced amount filtering
                const matchesAmountLower = amountLower === null || amountLower === '' || Math.abs(t.amount) >= amountLower;
                const matchesAmountHigher = amountHigher === null || amountHigher === '' || Math.abs(t.amount) <= amountHigher;

                return matchesType && matchesDate && matchesCategory && matchesAmountLower && matchesAmountHigher;
            });

            // Calculate totalAmount from the filtered generatedReport
            this.totalAmount = Math.abs(
                this.generatedReport.reduce(
                    (sum, t) => sum + t.amount,
                    0
                )
            );

            // Calculate net income from filtered data
            const filteredIncome = this.generatedReport
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0);

            const filteredExpense = this.generatedReport
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);

            this.netIncome = filteredIncome - filteredExpense;
        },

        clearFilters() {
            this.filters = {
                type: "all",
                startDate: "",
                endDate: "",
                category: "",
                amountLower: null,
                amountHigher: null,
            };
            this.pressed = false;
            this.generatedReport = [];
            this.updateCategories();
        },

        async exportToPDF() {
            const pdf = new jsPDF("p", "mm", "a4");

            // Enhanced Title with styling
            pdf.setFontSize(20);
            pdf.setFont("helvetica", "bold");
            pdf.text(this.reportTitle, 105, 20, { align: "center" });

            // Enhanced Date Range
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "normal");
            if (this.filters.startDate && this.filters.endDate) {
                pdf.text(
                    `Period: ${this.formatDate(this.filters.startDate)} to ${this.formatDate(this.filters.endDate)}`,
                    105,
                    30,
                    { align: "center" }
                );
            }

            // Additional filter info
            let yPosition = 35;
            if (this.filters.category) {
                pdf.text(`Category: ${this.filters.category}`, 105, yPosition, { align: "center" });
                yPosition += 5;
            }

            if (this.filters.amountLower !== null || this.filters.amountHigher !== null) {
                let amountRange = "Amount Range: ";
                if (this.filters.amountLower !== null) amountRange += `${this.filters.amountLower}`;
                amountRange += " - ";
                if (this.filters.amountHigher !== null) amountRange += `${this.filters.amountHigher}`;
                pdf.text(amountRange, 105, yPosition, { align: "center" });
                yPosition += 5;
            }

            // Enhanced table with better styling
            autoTable(pdf, {
                head: [["Activity", "Category", "Date", "Amount"]],
                body: this.generatedReport.map((t) => [
                    t.activity,
                    t.category,
                    this.formatDate(t.date),
                    this.formattedCurrency(t.amount),
                ]),
                startY: yPosition + 10,
                theme: 'striped',
                headStyles: {
                    fillColor: [59, 130, 246], // Blue color
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252] // Light gray
                },
                styles: {
                    fontSize: 10,
                    cellPadding: 3
                }
            });

            // Enhanced total/net income display
            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            const finalY = pdf.lastAutoTable.finalY + 15;

            if (this.filters.type !== "all") {
                pdf.text(
                    `Total ${this.filters.type === "expense" ? "Expense" : "Income"}: ${this.formattedCurrency(this.totalAmount)}`,
                    200,
                    finalY,
                    { align: "right" }
                );
            } else {
                pdf.text(
                    `Net Income: ${this.formattedCurrency(this.netIncome)}`,
                    200,
                    finalY,
                    { align: "right" }
                );
            }

            // Add generation timestamp
            pdf.setFontSize(8);
            pdf.setFont("helvetica", "normal");
            pdf.text(
                `Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
                105,
                finalY + 10,
                { align: "center" }
            );

            pdf.save(`${this.reportTitle.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
        },

        async exportToExcel() {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Financial Report');

            // Enhanced worksheet setup
            worksheet.columns = [
                { header: 'Activity', key: 'activity', width: 35 },
                { header: 'Category', key: 'category', width: 25 },
                { header: 'Date', key: 'date', width: 15 },
                { header: 'Amount', key: 'amount', width: 18 },
            ];

            // Enhanced header styling
            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true, size: 12, color: { argb: 'FFFFFF' } };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '3B82F6' }
            };
            headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
            headerRow.height = 25;

            // Add report metadata
            worksheet.insertRow(1, [`${this.reportTitle}`]);
            worksheet.insertRow(2, [`Generated on: ${new Date().toLocaleDateString()}`]);
            if (this.filters.startDate && this.filters.endDate) {
                worksheet.insertRow(3, [`Period: ${this.formatDate(this.filters.startDate)} to ${this.formatDate(this.filters.endDate)}`]);
            }
            worksheet.insertRow(4, ['']); // Empty row for spacing

            // Style the title
            const titleRow = worksheet.getRow(1);
            titleRow.font = { bold: true, size: 16 };
            titleRow.alignment = { horizontal: 'center' };

            // Merge title cells
            worksheet.mergeCells('A1:D1');
            worksheet.mergeCells('A2:D2');
            if (this.filters.startDate && this.filters.endDate) {
                worksheet.mergeCells('A3:D3');
            }

            // Add data rows with enhanced formatting
            this.generatedReport.forEach((transaction, index) => {
                const row = worksheet.addRow({
                    activity: transaction.activity,
                    category: transaction.category,
                    date: this.formatDate(transaction.date),
                    amount: transaction.amount,
                });

                // Alternate row colors
                if (index % 2 === 0) {
                    row.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'F8FAFC' }
                    };
                }

                // Color code amounts
                const amountCell = row.getCell(4);
                amountCell.numFmt = '"$"#,##0.00_);("$"#,##0.00)';
                amountCell.font = {
                    color: { argb: transaction.amount < 0 ? 'DC2626' : '059669' },
                    bold: true
                };
            });

            // Add total/net income row
            const totalRow = worksheet.addRow([
                this.filters.type !== "all" ?
                    `Total ${this.filters.type === 'expense' ? 'Expense' : 'Income'}` :
                    'Net Income',
                "",
                "",
                this.filters.type !== "all" ? this.totalAmount : this.netIncome
            ]);

            totalRow.font = { bold: true, size: 12 };
            totalRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'E5E7EB' }
            };

            const totalAmountCell = totalRow.getCell(4);
            totalAmountCell.numFmt = '"$"#,##0.00_);("$"#,##0.00)';
            totalAmountCell.font = {
                bold: true,
                size: 12,
                color: { argb: (this.filters.type === 'expense' || (this.filters.type === 'all' && this.netIncome < 0)) ? 'DC2626' : '059669' }
            };

            // Apply borders to all cells
            worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                if (rowNumber > 4) { // Skip metadata rows
                    row.eachCell({ includeEmpty: true }, (cell) => {
                        cell.border = {
                            top: { style: 'thin', color: { argb: 'D1D5DB' } },
                            left: { style: 'thin', color: { argb: 'D1D5DB' } },
                            bottom: { style: 'thin', color: { argb: 'D1D5DB' } },
                            right: { style: 'thin', color: { argb: 'D1D5DB' } },
                        };
                    });
                }
            });

            // Generate filename with timestamp
            const filename = `${this.reportTitle.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;

            // Export file
            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();
            });
        },

        async exportToImg() {
            const node = this.$el.querySelector('.report-preview');
            if (!node) return;

            try {
                const scale = 2;

                // Step 1: Generate the full image first
                const fullDataUrl = await domtoimage.toPng(node, {
                    quality: 1,
                    bgcolor: '#ffffff',
                    width: node.scrollWidth * scale,
                    height: node.scrollHeight * scale,
                    style: {
                        transform: 'scale(1)',
                        transformOrigin: 'top left',
                        backgroundColor: '#ffffff',
                    },
                    cacheBust: true,
                    pixelRatio: scale,
                });

                // Step 2: Find the actual content bounds by analyzing the image
                const croppedDataUrl = await this.cropImageToContent(fullDataUrl);

                // Step 3: Download the cropped image
                const link = document.createElement('a');
                link.download = `report-${new Date().toISOString().slice(0, 10)}.png`;
                link.href = croppedDataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            } catch (err) {
                console.error('Export failed:', err);
                alert('Failed to export image. Please try again.');
            }
        },

        async cropImageToContent(dataUrl) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Draw the full image to analyze it
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    // Get image data to find content bounds
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;

                    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

                    // Scan for non-white pixels to find content bounds
                    for (let y = 0; y < canvas.height; y++) {
                        for (let x = 0; x < canvas.width; x++) {
                            const idx = (y * canvas.width + x) * 4;
                            const r = data[idx];
                            const g = data[idx + 1];
                            const b = data[idx + 2];
                            const a = data[idx + 3];

                            // Check if pixel is not white/transparent (has content)
                            if (!(r === 255 && g === 255 && b === 255) || a < 255) {
                                minX = Math.min(minX, x);
                                minY = Math.min(minY, y);
                                maxX = Math.max(maxX, x);
                                maxY = Math.max(maxY, y);
                            }
                        }
                    }

                    // Add some padding around the content
                    const padding = 40; // 20px padding at original scale, doubled for high DPI
                    minX = Math.max(0, minX - padding);
                    minY = Math.max(0, minY - padding);
                    maxX = Math.min(canvas.width, maxX + padding);
                    maxY = Math.min(canvas.height, maxY + padding);

                    // Create cropped canvas
                    const cropWidth = maxX - minX;
                    const cropHeight = maxY - minY;

                    if (cropWidth <= 0 || cropHeight <= 0) {
                        // Fallback: use a reasonable default crop
                        resolve(dataUrl);
                        return;
                    }

                    const croppedCanvas = document.createElement('canvas');
                    const croppedCtx = croppedCanvas.getContext('2d');

                    croppedCanvas.width = cropWidth;
                    croppedCanvas.height = cropHeight;

                    // Fill with white background
                    croppedCtx.fillStyle = '#ffffff';
                    croppedCtx.fillRect(0, 0, cropWidth, cropHeight);

                    // Draw the cropped portion
                    croppedCtx.drawImage(
                        canvas,
                        minX, minY, cropWidth, cropHeight,
                        0, 0, cropWidth, cropHeight
                    );

                    resolve(croppedCanvas.toDataURL('image/png', 1.0));
                };

                img.src = dataUrl;
            });
        },

        // Helper method to clean up styles that cause visual issues
        cleanupNodeForExport(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                // Remove problematic styles
                node.style.outline = 'none';
                node.style.boxShadow = 'none';

                // Remove debug borders (common in development)
                if (node.style.border && (
                    node.style.border.includes('1px solid red') ||
                    node.style.border.includes('1px solid blue') ||
                    node.style.border.includes('debug')
                )) {
                    node.style.border = 'none';
                }

                // Ensure proper box-sizing
                node.style.boxSizing = 'border-box';

                // Fix common spacing issues
                if (node.style.margin === 'auto') {
                    node.style.margin = '0';
                }
            }

            // Recursively clean child nodes
            for (let child of node.childNodes) {
                this.cleanupNodeForExport(child);
            }
        },

        // Enhanced helper function for currency formatting
        formattedCurrency(value) {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(value);
        },

        // Enhanced date formatting
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },
    },

    mounted() {
        this.fetchTransactions();
    },
};
</script>

<style scoped>
/* Enhanced animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Enhanced glassmorphism effects */
.backdrop-blur-xl {
    backdrop-filter: blur(16px);
}

/* Enhanced hover effects */
.group:hover .group-hover\:rotate-12 {
    transform: rotate(12deg);
}

.group-focus-within\:text-blue-500:focus-within {
    color: rgb(59 130 246);
}

/* Enhanced button animations */
.hover\:scale-105:hover {
    transform: scale(1.05);
}

/* Enhanced shadows */
.shadow-inner {
    box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
}

/* Enhanced focus states */
.focus\:ring-4:focus {
    --tw-ring-width: 4px;
}

.focus\:ring-blue-500\/20:focus {
    --tw-ring-color: rgb(59 130 246 / 0.2);
}

/* Enhanced transitions */
.transition-all {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom date input styling */
input[type="date"]::-webkit-calendar-picker-indicator {
    background-color: transparent;
    cursor: pointer;
    filter: invert(0.5);
}

input[type="date"]::-webkit-calendar-picker-indicator:hover {
    filter: invert(0.3);
}

/* Enhanced select styling */
select {
    background-position: right 0.75rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 3rem;
}

/* Enhanced table styling */
.report-preview table {
    border-collapse: separate;
    border-spacing: 0;
}

/* Mobile responsiveness enhancements */
@media (max-width: 768px) {
    .text-5xl {
        font-size: 2.5rem;
    }

    .text-6xl {
        font-size: 3rem;
    }

    .text-7xl {
        font-size: 3.5rem;
    }

    .px-8 {
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .py-12 {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
}

/* Enhanced animation keyframes */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: .8;
    }
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-25%);
    }
}

@keyframes ping {

    75%,
    100% {
        transform: scale(2);
        opacity: 0;
    }
}

/* Enhanced component animations */
.generator-container {
    animation: fadeIn 0.6s ease-out;
}

.report-preview {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    margin: 0 !important;
}

.report-preview * {
    border: none !important;
    outline: none !important;
}
</style>