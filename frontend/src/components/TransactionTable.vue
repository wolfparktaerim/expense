<template>
    <div class="transactions-container bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
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
                        Tran<span class="text-yellow-300 animate-pulse drop-shadow-lg">$</span>action Hub
                    </h1>
                </div>
            </div>
        </div>

        <!-- Enhanced Filters Section with glass morphism -->
        <div class="max-w-7xl mx-auto px-4 md:px-6 mb-10">
            <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div class="bg-gradient-to-r from-slate-50/80 to-emerald-50/80 px-8 py-6 border-b border-gray-200/50">
                    <h2 class="text-xl font-bold text-gray-800 flex items-center gap-3 select-none">
                        <div
                            class="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                            </svg>
                        </div>
                        Filter & Search
                    </h2>
                </div>

                <div class="p-8 space-y-8">
                    <!-- Search and Category Filter Row -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <!-- Enhanced Search Input with floating label -->
                        <div class="lg:col-span-1 group">
                            <label class="block text-sm font-semibold text-gray-700 mb-3 select-none">Search
                                Transactions</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input v-model="searchQuery" type="text" placeholder="Search activity or description..."
                                    class="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-inner hover:border-gray-300">
                                <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-4 flex items-center">
                                    <button @click="searchQuery = ''"
                                        class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Enhanced Category Filter -->
                        <div class="group">
                            <label class="block text-sm font-semibold text-gray-700 mb-3 select-none">Category</label>
                            <div class="relative">
                                <select v-model="selectedCategory"
                                    class="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-gray-50/50 focus:bg-white appearance-none cursor-pointer shadow-inner hover:border-gray-300">
                                    <option value="">All Categories</option>
                                    <option v-for="category in uniqueCategories" :key="category" :value="category">
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

                        <!-- Enhanced Amount Type Filter with modern toggle -->
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-3 select-none">Amount
                                Type</label>
                            <div class="flex rounded-2xl border-2 border-gray-200 bg-gray-50/50 p-1.5 shadow-inner">
                                <button @click="amountFilter = ''" :class="[
                                    'flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 transform select-none',
                                    amountFilter === ''
                                        ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg scale-105'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/80'
                                ]">
                                    All
                                </button>
                                <button @click="amountFilter = 'positive'" :class="[
                                    'flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 transform select-none',
                                    amountFilter === 'positive'
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/80'
                                ]">
                                    Income
                                </button>
                                <button @click="amountFilter = 'negative'" :class="[
                                    'flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 transform select-none',
                                    amountFilter === 'negative'
                                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-white/80'
                                ]">
                                    Expense
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Date Range and Periodic Filter Row -->
                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <!-- Enhanced Date Range with floating labels -->
                        <div class="lg:col-span-2">
                            <label class="block text-sm font-semibold text-gray-700 mb-3 select-none">Date Range</label>
                            <div class="grid grid-cols-2 gap-3">
                                <div class="relative group">
                                    <input v-model="dateFrom" type="date"
                                        class="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-inner hover:border-gray-300">
                                    <label
                                        class="absolute -top-3 left-4 bg-white px-2 text-xs font-semibold text-emerald-600">From</label>
                                </div>
                                <div class="relative group">
                                    <input v-model="dateTo" type="date"
                                        class="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-gray-50/50 focus:bg-white shadow-inner hover:border-gray-300">
                                    <label
                                        class="absolute -top-3 left-4 bg-white px-2 text-xs font-semibold text-emerald-600">To</label>
                                </div>
                            </div>
                        </div>

                        <!-- Enhanced Periodic Filter -->
                        <div class="group">
                            <label class="block text-sm font-semibold text-gray-700 mb-3 select-none">Transaction
                                Type</label>
                            <div class="relative">
                                <select v-model="periodicFilter"
                                    class="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 bg-gray-50/50 focus:bg-white appearance-none cursor-pointer shadow-inner hover:border-gray-300">
                                    <option value="">All Types</option>
                                    <option value="periodic">Recurring</option>
                                    <option value="one-time">One-time</option>
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

                        <!-- Enhanced Clear Filters Button -->
                        <div class="flex items-end">
                            <button @click="clearFilters"
                                class="w-full px-6 py-4 bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-2xl hover:from-gray-600 hover:to-slate-700 transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105 group select-none">
                                <svg class="w-5 h-5 group-hover:rotate-180 transition-transform duration-300"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Clear All
                            </button>
                        </div>
                    </div>

                    <!-- Enhanced Multi-select Actions with glass morphism -->
                    <div v-if="selectedTransactions.length > 0"
                        class="bg-gradient-to-r from-emerald-50/80 to-green-50/80 backdrop-blur-sm border-2 border-emerald-200/50 rounded-2xl p-6 animate-in fade-in duration-300 shadow-lg">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span class="text-lg font-bold text-emerald-800 select-none">
                                    {{ selectedTransactions.length }} transaction{{ selectedTransactions.length !== 1 ?
                                        's' : '' }} selected
                                </span>
                            </div>
                            <div class="flex gap-3">
                                <button @click="clearSelection"
                                    class="px-6 py-3 text-sm bg-white/80 text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-white hover:border-gray-400 transition-all duration-200 font-semibold shadow-md hover:shadow-lg select-none">
                                    Clear Selection
                                </button>
                                <button @click="confirmBulkDelete"
                                    class="px-6 py-3 text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 select-none">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Selected
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Enhanced Table Container -->
        <div class="max-w-7xl mx-auto px-4 md:px-6 mb-10">
            <!-- Enhanced Loading Skeleton -->
            <div v-if="isLoading"
                class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                <div class="bg-gradient-to-r from-slate-50/80 to-emerald-50/80 px-8 py-6 border-b border-gray-200/50">
                    <div class="flex items-center justify-between">
                        <div class="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-64 animate-pulse"></div>
                        <div class="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-40 animate-pulse"></div>
                    </div>
                </div>

                <div class="overflow-x-auto" :class="{ 'overflow-x-scroll': editingTransactionId !== null }">
                    <table class="w-full text-sm">
                        <thead class="bg-gradient-to-r from-gray-50/80 to-slate-50/80 border-b border-gray-200/50">
                            <tr>
                                <th class="px-8 py-6 w-12">
                                    <div
                                        class="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse">
                                    </div>
                                </th>
                                <th v-for="i in 7" :key="i" class="px-8 py-6">
                                    <div
                                        class="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24 animate-pulse">
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white/50 divide-y divide-gray-200/50">
                            <tr v-for="i in rowsPerPage" :key="i" class="animate-pulse">
                                <td class="px-8 py-6">
                                    <div class="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-36"></div>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="h-8 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full w-24">
                                    </div>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="h-7 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20"></div>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-28"></div>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="h-7 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full w-24">
                                    </div>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="space-y-2">
                                        <div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full">
                                        </div>
                                        <div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4">
                                        </div>
                                    </div>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="flex gap-3 justify-center">
                                        <div class="h-8 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg w-16">
                                        </div>
                                        <div class="h-8 bg-gradient-to-r from-red-200 to-pink-200 rounded-lg w-18">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Actual Table Content -->
            <div v-else-if="filteredTransactions.length > 0"
                class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                <!-- Table Header Info -->
                <div class="bg-gradient-to-r from-slate-50/80 to-emerald-50/80 px-8 py-6 border-b border-gray-200/50">
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl font-bold text-gray-800 select-none">
                            {{ filteredTransactions.length }} Transaction{{ filteredTransactions.length !== 1 ? 's' : ''
                            }} Found
                        </h3>
                        <div class="text-sm font-medium text-gray-600 bg-white/60 px-4 py-2 rounded-xl select-none">
                            Showing {{ Math.min((currentPage - 1) * rowsPerPage + 1, filteredTransactions.length) }} -
                            {{ Math.min(currentPage * rowsPerPage, filteredTransactions.length) }} of {{
                                filteredTransactions.length }}
                        </div>
                    </div>
                </div>

                <!-- Enhanced Table -->
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-gradient-to-r from-gray-50/80 to-slate-50/80 border-b border-gray-200/50">
                            <tr>
                                <th scope="col" class="px-8 py-6 w-12">
                                    <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll"
                                        class="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-emerald-500 focus:ring-2">
                                </th>
                                <th scope="col"
                                    class="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[140px] select-none">
                                    Activity
                                </th>
                                <th scope="col"
                                    class="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] select-none">
                                    Amount
                                </th>
                                <th scope="col"
                                    class="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] select-none">
                                    Category
                                </th>
                                <th scope="col"
                                    class="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] select-none">
                                    Date
                                </th>
                                <th scope="col"
                                    class="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] select-none">
                                    Type
                                </th>
                                <th scope="col"
                                    class="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[200px] select-none">
                                    Description
                                </th>
                                <th scope="col"
                                    class="px-8 py-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[120px] select-none">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white/50 divide-y divide-gray-200/30">
                            <tr v-for="transaction in paginatedTransactions" :key="transaction.id"
                                class="hover:bg-white/70 transition-all duration-200 group"
                                :class="{ 'bg-emerald-50/80 border-l-4 border-l-emerald-400 shadow-lg': selectedTransactions.includes(transaction.id) }">
                                <!-- Enhanced Checkbox -->
                                <td class="px-8 py-6">
                                    <input type="checkbox" :value="transaction.id" v-model="selectedTransactions"
                                        class="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-emerald-500 focus:ring-2">
                                </td>

                                <!-- Enhanced Activity Name -->
                                <td class="px-8 py-6">
                                    <template v-if="editingTransactionId === transaction.id">
                                        <input v-model="editForm.activity" type="text"
                                            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all duration-200">
                                    </template>
                                    <template v-else>
                                        <div
                                            class="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                            {{ transaction.activity }}</div>
                                    </template>
                                </td>

                                <!-- Enhanced Amount -->
                                <td class="px-8 py-6">
                                    <template v-if="editingTransactionId === transaction.id">
                                        <input v-model.number="editForm.amount" type="number" step="0.01"
                                            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all duration-200">
                                    </template>
                                    <template v-else>
                                        <div class="flex items-center gap-2">
                                            <div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-md"
                                                :class="transaction.amount < 0
                                                    ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-2 border-red-200'
                                                    : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-200'">
                                                <span v-if="transaction.amount > 0" class="mr-1">+</span>
                                                <span v-else class="mr-1">-</span>
                                                ${{ Math.abs(transaction.amount).toFixed(2) }}
                                            </div>
                                        </div>
                                    </template>
                                </td>

                                <!-- Enhanced Category with Dynamic Dropdown -->
                                <td class="px-8 py-6">
                                    <template v-if="editingTransactionId === transaction.id">
                                        <div class="relative">
                                            <select v-model="editForm.category"
                                                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white appearance-none cursor-pointer transition-all duration-200">
                                                <option value="">Select Category</option>
                                                <option v-for="category in getAvailableCategories(editForm.amount)"
                                                    :key="category" :value="category">
                                                    {{ category }}
                                                </option>
                                            </select>
                                            <div
                                                class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <span
                                            class="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-2 border-gray-200 shadow-sm">
                                            {{ transaction.category }}
                                        </span>
                                    </template>
                                </td>

                                <!-- Enhanced Date -->
                                <td class="px-8 py-6">
                                    <template v-if="editingTransactionId === transaction.id">
                                        <input v-model="editForm.date" type="date"
                                            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all duration-200">
                                    </template>
                                    <template v-else>
                                        <div class="text-sm font-medium text-gray-600">{{ transaction.date }}</div>
                                    </template>
                                </td>

                                <!-- Enhanced Periodic -->
                                <td class="px-8 py-6">
                                    <template v-if="editingTransactionId === transaction.id">
                                        <select v-model="editForm.period"
                                            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white appearance-none cursor-pointer transition-all duration-200">
                                            <option value="">None</option>
                                            <option value="Daily">Daily</option>
                                            <option value="Weekly">Weekly</option>
                                            <option value="Bi-Weekly">Bi-Weekly</option>
                                            <option value="Monthly">Monthly</option>
                                            <option value="Quarterly">Quarterly</option>
                                            <option value="Semi-Annually">Semi-Annually</option>
                                            <option value="Yearly">Yearly</option>
                                        </select>
                                    </template>
                                    <template v-else-if="editingPeriodicId === transaction.id">
                                        <div class="space-y-3">
                                            <select v-model="temporaryPeriodic"
                                                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white text-sm transition-all duration-200">
                                                <option value="Daily">Daily</option>
                                                <option value="Weekly">Weekly</option>
                                                <option value="Bi-Weekly">Bi-Weekly</option>
                                                <option value="Monthly">Monthly</option>
                                                <option value="Quarterly">Quarterly</option>
                                                <option value="Semi-Annually">Semi-Annually</option>
                                                <option value="Yearly">Yearly</option>
                                                <option value="">None</option>
                                            </select>
                                            <div class="flex gap-2">
                                                <button @click="savePeriodicChange(transaction)"
                                                    class="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-xs font-semibold shadow-md hover:shadow-lg">
                                                    Save
                                                </button>
                                                <button @click="cancelEdit"
                                                    class="flex-1 px-4 py-2 bg-gradient-to-r from-gray-500 to-slate-500 text-white rounded-xl hover:from-gray-600 hover:to-slate-600 transition-all duration-200 text-xs font-semibold shadow-md hover:shadow-lg">
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <span v-if="transaction.periodic && transaction.period"
                                            @click="editPeriodic(transaction)"
                                            class="cursor-pointer hover:bg-blue-100 transition-all duration-200 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-xs font-semibold border-2 border-blue-200 shadow-sm hover:shadow-md transform hover:scale-105">
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {{ transaction.period }}
                                        </span>
                                        <span v-else class="text-gray-400 text-sm font-medium">One-time</span>
                                    </template>
                                </td>

                                <!-- Enhanced Description -->
                                <td class="px-8 py-6 max-w-xs">
                                    <template v-if="editingTransactionId === transaction.id">
                                        <textarea v-model="editForm.description" rows="3"
                                            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none bg-white transition-all duration-200"></textarea>
                                    </template>
                                    <template v-else-if="transaction.description">
                                        <div v-if="transaction.description.length > 50" class="relative">
                                            <div class="text-gray-600 text-sm font-medium" :class="{
                                                'line-clamp-2': !isDescriptionExpanded(transaction.id),
                                                'whitespace-pre-wrap': isDescriptionExpanded(transaction.id)
                                            }">
                                                {{ getDescriptionText(transaction) }}
                                            </div>
                                            <button @click="toggleDescription(transaction.id)"
                                                class="text-emerald-600 hover:text-emerald-800 hover:underline mt-2 text-xs font-semibold inline-flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg transition-all duration-200 hover:bg-emerald-100">
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        :d="isDescriptionExpanded(transaction.id) ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'" />
                                                </svg>
                                                {{ isDescriptionExpanded(transaction.id) ? 'Show less' : 'Show more' }}
                                            </button>
                                        </div>
                                        <div v-else class="text-gray-600 text-sm font-medium">{{ transaction.description
                                        }}</div>
                                    </template>
                                    <span v-else class="text-gray-400 text-sm italic font-medium">No description</span>
                                </td>

                                <!-- Enhanced Actions -->
                                <td class="px-8 py-6 text-center">
                                    <template v-if="editingTransactionId === transaction.id">
                                        <div class="flex gap-3 justify-center">
                                            <button @click="saveTransaction"
                                                class="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 select-none">
                                                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                Save
                                            </button>
                                            <button @click="cancelTransactionEdit"
                                                class="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-gray-500 to-slate-500 rounded-xl hover:from-gray-600 hover:to-slate-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 select-none">
                                                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Cancel
                                            </button>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div class="flex gap-3 justify-center">
                                            <button @click="editTransaction(transaction)"
                                                class="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 select-none">
                                                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button @click="confirmSingleDelete(transaction.id)"
                                                class="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 select-none">
                                                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </template>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Enhanced No Results Message -->
            <div v-else
                class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div class="text-center py-20 px-10">
                    <div
                        class="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-gray-100 to-slate-100 rounded-full flex items-center justify-center shadow-inner">
                        <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">
                        {{ transactions.length === 0 ? 'No transactions yet' : 'No transactions found' }}
                    </h3>
                    <p class="text-gray-500 mb-8 max-w-md mx-auto text-lg leading-relaxed">
                        {{ transactions.length === 0
                            ? 'Start by adding your first transaction to track your finances effectively.'
                            : 'Try adjusting your filter criteria to find the transactions you\'re looking for.'
                        }}
                    </p>
                    <button v-if="transactions.length > 0" @click="clearFilters"
                        class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105">
                        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>

        <!-- Enhanced Pagination Controls -->
        <div v-if="filteredTransactions.length > rowsPerPage" class="max-w-7xl mx-auto px-4 md:px-6 mb-10">
            <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                <div class="px-8 py-6">
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <!-- Page Info -->
                        <div
                            class="text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 px-4 py-2 rounded-xl border border-gray-200">
                            Showing <span class="font-bold text-emerald-600">{{ Math.min((currentPage - 1) * rowsPerPage
                                + 1,
                                filteredTransactions.length) }}</span> to
                            <span class="font-bold text-emerald-600">{{ Math.min(currentPage * rowsPerPage,
                                filteredTransactions.length) }}</span> of
                            <span class="font-bold text-emerald-600">{{ filteredTransactions.length }}</span> results
                        </div>

                        <!-- Pagination Controls -->
                        <div class="flex items-center gap-3">
                            <!-- First Page -->
                            <button @click="goToPage(1)" :disabled="currentPage === 1"
                                class="inline-flex items-center px-4 py-3 text-sm font-semibold text-gray-500 bg-white/60 border-2 border-gray-300 rounded-xl hover:bg-white hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                                title="First page">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                </svg>
                            </button>

                            <!-- Previous Page -->
                            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                                class="inline-flex items-center px-4 py-3 text-sm font-semibold text-gray-500 bg-white/60 border-2 border-gray-300 rounded-xl hover:bg-white hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                                title="Previous page">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <!-- Current Page Indicator -->
                            <div
                                class="inline-flex items-center px-6 py-3 text-sm font-bold text-emerald-600 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl shadow-md">
                                {{ currentPage }} of {{ totalPages }}
                            </div>

                            <!-- Go to Page Input -->
                            <div class="flex items-center gap-2">
                                <input v-model.number="gotoPageInput" type="number" min="1" :max="totalPages"
                                    class="w-20 px-3 py-3 text-sm text-center border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white transition-all duration-200"
                                    placeholder="Page" />
                                <button @click="goToPage(gotoPageInput)"
                                    class="px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl hover:from-emerald-700 hover:to-green-700 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 shadow-lg hover:shadow-xl">
                                    Go
                                </button>
                            </div>

                            <!-- Next Page -->
                            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                                class="inline-flex items-center px-4 py-3 text-sm font-semibold text-gray-500 bg-white/60 border-2 border-gray-300 rounded-xl hover:bg-white hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                                title="Next page">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <!-- Last Page -->
                            <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages"
                                class="inline-flex items-center px-4 py-3 text-sm font-semibold text-gray-500 bg-white/60 border-2 border-gray-300 rounded-xl hover:bg-white hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                                title="Last page">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Enhanced Delete Modal with glass morphism -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div
                class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full transform transition-all border border-white/20">
                <div class="p-8">
                    <!-- Modal Header -->
                    <div
                        class="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-100 to-pink-100 rounded-full shadow-inner">
                        <svg class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>

                    <!-- Modal Content -->
                    <div class="text-center mb-8">
                        <h3 class="text-2xl font-bold text-gray-900 mb-4">
                            {{ deleteModalTitle }}
                        </h3>
                        <p class="text-gray-600 text-lg leading-relaxed">
                            {{ deleteModalMessage }}
                        </p>
                    </div>

                    <!-- Modal Actions -->
                    <div class="flex gap-4">
                        <button @click="cancelDelete"
                            class="flex-1 px-6 py-4 text-sm font-semibold text-gray-700 bg-gray-100/80 border-2 border-gray-300 rounded-2xl hover:bg-gray-200/80 focus:ring-4 focus:ring-gray-500/20 transition-all duration-200 shadow-lg hover:shadow-xl">
                            Cancel
                        </button>
                        <button @click="confirmDelete"
                            class="flex-1 px-6 py-4 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 border-2 border-transparent rounded-2xl hover:from-red-700 hover:to-pink-700 focus:ring-4 focus:ring-red-500/20 transition-all duration-200 shadow-lg hover:shadow-xl">
                            Delete
                        </button>
                    </div>
                </div>
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
        isLoading: {
            type: Boolean,
            default: false,
        },
    },
    setup() {
        const toast = useToast();
        return { toast };
    },
    data() {
        return {
            currentPage: 1,
            expandedDescriptions: [],
            gotoPageInput: 1,
            editingPeriodicId: null,
            temporaryPeriodic: "",
            error: "",

            // Fixed Categories
            expenseCats: [
                "Childcare",
                "Clothing & Apparel",
                "Debt Repayment",
                "Education & Learning",
                "Electronics & Gadgets",
                "Emergency Expenses",
                "Entertainment",
                "Family",
                "Food & Drink",
                "Gift & Donation",
                "Health & Fitness",
                "Hobbies",
                "Home Maintenance",
                "Housing",
                "Insurance",
                "Legal Fees",
                "Miscellaneous",
                "Office Supplies",
                "Others",
                "Personal Care",
                "Pets",
                "Subscriptions & Memberships",
                "Taxes",
                "Transportation",
                "Travel",
                "Utilities"
            ],

            incomeCats: [
                "Alimony & Child Support",
                "Business Income",
                "Cashback & Rewards",
                "Consulting",
                "Crowdfunding",
                "Dividends",
                "Freelance",
                "Gift",
                "Government Assistance",
                "Grants",
                "Inheritances",
                "Insurance Payout",
                "Investment",
                "Miscellaneous",
                "Others",
                "Passive Income",
                "Pension Income",
                "Rental Income",
                "Royalties",
                "Salary",
                "Scholarship",
                "Sale of Assets",
                "Side Hustle",
                "Tax Refund"
            ],

            // Filtering
            searchQuery: "",
            selectedCategory: "",
            amountFilter: "",
            dateFrom: "",
            dateTo: "",
            periodicFilter: "",

            // Multi-select
            selectedTransactions: [],

            // Editing
            editingTransactionId: null,
            editForm: {
                activity: "",
                amount: 0,
                category: "",
                date: "",
                period: "",
                description: ""
            },

            // Delete modal
            showDeleteModal: false,
            deleteAction: null,
            deleteModalTitle: "",
            deleteModalMessage: ""
        };
    },
    computed: {
        uniqueCategories() {
            const categories = [...new Set(this.transactions.map(t => t.category))];
            return categories.filter(Boolean).sort();
        },

        filteredTransactions() {
            let filtered = this.transactions;

            // Search filter
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(t =>
                    t.activity.toLowerCase().includes(query) ||
                    (t.description && t.description.toLowerCase().includes(query))
                );
            }

            // Category filter
            if (this.selectedCategory) {
                filtered = filtered.filter(t => t.category === this.selectedCategory);
            }

            // Amount filter
            if (this.amountFilter === 'positive') {
                filtered = filtered.filter(t => t.amount > 0);
            } else if (this.amountFilter === 'negative') {
                filtered = filtered.filter(t => t.amount < 0);
            }

            // Date range filter
            if (this.dateFrom) {
                filtered = filtered.filter(t => t.date >= this.dateFrom);
            }
            if (this.dateTo) {
                filtered = filtered.filter(t => t.date <= this.dateTo);
            }

            // Periodic filter
            if (this.periodicFilter === 'periodic') {
                filtered = filtered.filter(t => t.periodic && t.period);
            } else if (this.periodicFilter === 'one-time') {
                filtered = filtered.filter(t => !t.periodic || !t.period);
            }

            return filtered;
        },

        totalPages() {
            return Math.ceil(this.filteredTransactions.length / this.rowsPerPage);
        },

        paginatedTransactions() {
            const start = (this.currentPage - 1) * this.rowsPerPage;
            const end = start + this.rowsPerPage;
            return this.filteredTransactions.slice(start, end);
        },

        isAllSelected() {
            return this.paginatedTransactions.length > 0 &&
                this.paginatedTransactions.every(t => this.selectedTransactions.includes(t.id));
        }
    },

    watch: {
        filteredTransactions() {
            // Reset to first page when filters change
            this.currentPage = 1;
            // Clear selections when filters change
            this.selectedTransactions = [];
        }
    },

    methods: {
        // NEW METHOD: Get available categories based on transaction amount
        getAvailableCategories(amount) {
            if (amount >= 0) {
                return this.incomeCats;
            } else {
                return this.expenseCats;
            }
        },

        // Filtering methods
        clearFilters() {
            this.searchQuery = "";
            this.selectedCategory = "";
            this.amountFilter = "";
            this.dateFrom = "";
            this.dateTo = "";
            this.periodicFilter = "";
        },

        // Multi-select methods
        toggleSelectAll() {
            if (this.isAllSelected) {
                // Deselect all on current page
                this.paginatedTransactions.forEach(t => {
                    const index = this.selectedTransactions.indexOf(t.id);
                    if (index > -1) {
                        this.selectedTransactions.splice(index, 1);
                    }
                });
            } else {
                // Select all on current page
                this.paginatedTransactions.forEach(t => {
                    if (!this.selectedTransactions.includes(t.id)) {
                        this.selectedTransactions.push(t.id);
                    }
                });
            }
        },

        clearSelection() {
            this.selectedTransactions = [];
        },

        // Editing methods
        editTransaction(transaction) {
            this.editingTransactionId = transaction.id;
            this.editForm = {
                activity: transaction.activity,
                amount: transaction.amount,
                category: transaction.category,
                date: transaction.date,
                period: transaction.period || "",
                description: transaction.description || ""
            };
        },

        cancelTransactionEdit() {
            this.editingTransactionId = null;
            this.editForm = {
                activity: "",
                amount: 0,
                category: "",
                date: "",
                period: "",
                description: ""
            };
        },

        async saveTransaction() {
            try {
                const store = userTransactions();
                const updatedTransaction = {
                    id: this.editingTransactionId,
                    activity: this.editForm.activity,
                    amount: this.editForm.amount,
                    category: this.editForm.category,
                    date: this.editForm.date,
                    periodic: this.editForm.period !== "",
                    period: this.editForm.period || null,
                    description: this.editForm.description
                };

                await store.updateTransaction(updatedTransaction);
                this.editingTransactionId = null;
                this.$emit("transaction-updated", updatedTransaction);

                this.toast.success("Transaction updated successfully!", {
                    transitionDuration: 200,
                    timeout: 1000,
                    closeOnClick: true,
                });
            } catch (error) {
                console.error(`[saveTransaction] Error updating transaction:`, error);
                this.toast.error("Failed to update transaction. Please try again.");
            }
        },

        // Delete methods
        confirmSingleDelete(transactionId) {
            this.deleteAction = () => this.deleteSingleTransaction(transactionId);
            this.deleteModalTitle = "Delete Transaction";
            this.deleteModalMessage = "Are you sure you want to delete this transaction? This action cannot be undone.";
            this.showDeleteModal = true;
        },

        confirmBulkDelete() {
            this.deleteAction = () => this.deleteBulkTransactions();
            this.deleteModalTitle = "Delete Selected Transactions";
            this.deleteModalMessage = `Are you sure you want to delete ${this.selectedTransactions.length} selected transaction(s)? This action cannot be undone.`;
            this.showDeleteModal = true;
        },

        cancelDelete() {
            this.showDeleteModal = false;
            this.deleteAction = null;
            this.deleteModalTitle = "";
            this.deleteModalMessage = "";
        },

        async confirmDelete() {
            if (this.deleteAction) {
                await this.deleteAction();
            }
            this.cancelDelete();
        },

        async deleteSingleTransaction(transactionId) {
            try {
                const store = userTransactions();
                await store.removeTransaction(transactionId);
                this.$emit("transaction-deleted", transactionId);

                // Remove from selection if it was selected
                const index = this.selectedTransactions.indexOf(transactionId);
                if (index > -1) {
                    this.selectedTransactions.splice(index, 1);
                }

                this.toast.success("Transaction deleted successfully!", {
                    transitionDuration: 200,
                    timeout: 1000,
                    closeOnClick: true,
                });
            } catch (error) {
                console.error(`[deleteSingleTransaction] Error deleting transaction:`, error);
                this.toast.error("Failed to delete transaction. Please try again.");
            }
        },

        async deleteBulkTransactions() {
            try {
                const store = userTransactions();
                const deletePromises = this.selectedTransactions.map(id =>
                    store.removeTransaction(id)
                );

                await Promise.all(deletePromises);

                this.selectedTransactions.forEach(id => {
                    this.$emit("transaction-deleted", id);
                });

                const count = this.selectedTransactions.length;
                this.selectedTransactions = [];

                this.toast.success(`${count} transaction(s) deleted successfully!`, {
                    transitionDuration: 200,
                    timeout: 1000,
                    closeOnClick: true,
                });
            } catch (error) {
                console.error(`[deleteBulkTransactions] Error deleting transactions:`, error);
                this.toast.error("Failed to delete some transactions. Please try again.");
            }
        },

        // Legacy delete method (keep for backward compatibility)
        async confirmDelete(transactionId) {
            this.confirmSingleDelete(transactionId);
        },

        async deleteTransaction(transactionId) {
            await this.deleteSingleTransaction(transactionId);
        },

        // Pagination methods
        goToPage(page) {
            if (page < 1) page = 1;
            if (page > this.totalPages) page = this.totalPages;
            this.currentPage = page;
        },

        // Description methods
        getDescriptionText(transaction) {
            if (this.isDescriptionExpanded(transaction.id)) {
                return transaction.description;
            }
            return transaction.description.length > 50
                ? transaction.description.slice(0, 50) + '...'
                : transaction.description;
        },

        toggleDescription(transactionId) {
            const index = this.expandedDescriptions.indexOf(transactionId);
            if (index > -1) {
                this.expandedDescriptions.splice(index, 1);
            } else {
                this.expandedDescriptions.push(transactionId);
            }
        },

        isDescriptionExpanded(transactionId) {
            return this.expandedDescriptions.includes(transactionId);
        },

        // Periodic editing methods
        editPeriodic(transaction) {
            this.editingPeriodicId = transaction.id;
            this.temporaryPeriodic = transaction.period || "";
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
                this.error = "";
                this.editingPeriodicId = null;

                const updatedTransaction = {
                    ...transaction,
                    periodic: this.temporaryPeriodic !== "",
                    period: this.temporaryPeriodic || null,
                };

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
}

.animate-in {
    animation: fadeIn 0.3s ease-in-out;
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

/* Enhanced glassmorphism effects */
.backdrop-blur-xl {
    backdrop-filter: blur(16px);
}

.backdrop-blur-md {
    backdrop-filter: blur(12px);
}

.backdrop-blur-sm {
    backdrop-filter: blur(4px);
}

/* Enhanced animations */
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

/* Custom hover effects */
.group:hover .group-hover\:rotate-180 {
    transform: rotate(180deg);
}

.group:hover .group-hover\:text-emerald-700 {
    color: rgb(4 120 87);
}

.group-focus-within\:text-emerald-500:focus-within {
    color: rgb(16 185 129);
}

/* Enhanced shadow effects */
.shadow-inner {
    box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
}

/* Improved form focus states */
.focus\:ring-4:focus {
    --tw-ring-width: 4px;
}

.focus\:ring-emerald-500\/20:focus {
    --tw-ring-color: rgb(16 185 129 / 0.2);
}

/* Enhanced button hover states */
.hover\:scale-105:hover {
    transform: scale(1.05);
}

/* Improved transitions */
.transition-all {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced responsive design */
@media (max-width: 768px) {
    .max-w-7xl {
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .text-5xl {
        font-size: 2.5rem;
    }

    .text-6xl {
        font-size: 3rem;
    }

    .text-7xl {
        font-size: 3.5rem;
    }
}

/* Custom gradient animations */
@keyframes gradient-shift {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.animate-gradient {
    background-size: 200% 200%;
    animation: gradient-shift 3s ease infinite;
}

.overflow-x-scroll {
    scroll-behavior: smooth;
}

.overflow-x-scroll::-webkit-scrollbar {
    height: 8px;
}

.overflow-x-scroll::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
}

.overflow-x-scroll::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
}

.overflow-x-scroll::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>