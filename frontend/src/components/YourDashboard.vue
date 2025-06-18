<template>
  <div
    class="dashboard-container max-w-full overflow-x-hidden pb-8 bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 min-h-screen">

    <!-- Loading State for Entire Dashboard -->
    <div v-if="isLoading" class="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="flex flex-col items-center gap-6">
        <div class="relative">
          <!-- Outer rotating ring -->
          <div class="w-20 h-20 border-4 border-green-200 rounded-full animate-spin border-t-green-500"></div>
          <!-- Inner pulsing dot -->
          <div
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-green-500 rounded-full animate-pulse">
          </div>
        </div>
        <div class="text-center select-none">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Loading Your Dashboard</h3>
          <p class="text-gray-600 animate-pulse">Fetching your financial data...</p>
        </div>
      </div>
    </div>

    <!-- Enhanced Header with Green Gradient -->
    <div
      class="relative p-8 bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 shadow-2xl mb-8 overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full animate-pulse"></div>
        <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full animate-bounce"
          style="animation-duration: 3s;"></div>
        <div class="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full animate-ping"
          style="animation-duration: 4s;"></div>
      </div>

      <!-- Header Content -->
      <div class="relative z-10 select-none">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
          Your
          <span class="inline-block relative">
            Da<span class="text-green-300 animate-pulse">$</span>hboard
            <div
              class="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full">
            </div>
          </span>
        </h1>

        <!-- Enhanced Time Period Selector -->
        <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <!-- Period Selector -->
          <div class="relative group">
            <select v-model="selectedPeriod" @change="applyDateFilter" class="appearance-none px-6 py-3 bg-white/90 backdrop-blur-sm border-2 border-white/20 
                     rounded-full text-sm font-semibold text-green-900 shadow-lg 
                     focus:outline-none focus:ring-4 focus:ring-green-300/50 focus:border-white
                     transition-all duration-300 cursor-pointer hover:bg-white hover:shadow-xl
                     pr-10 min-w-[180px]">
              <option value="all">🌐 All Time</option>
              <option value="year">📅 This Year</option>
              <option value="6month">📊 Last 6 Months</option>
              <option value="3month">📈 Last 3 Months</option>
              <option value="month">🗓️ This Month</option>
              <option value="week">⏰ This Week</option>
              <option value="custom">🎯 Custom Range</option>
            </select>
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg class="w-5 h-5 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>

          <!-- Custom Date Range -->
          <div v-if="selectedPeriod === 'custom'"
            class="flex flex-col sm:flex-row items-center gap-3 animate-in slide-in-from-top duration-300">
            <div class="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <label class="text-sm font-medium text-green-900">From:</label>
              <input type="date" v-model="customStartDate"
                class="bg-transparent border-none focus:outline-none text-green-900 font-medium" />
            </div>
            <div class="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <label class="text-sm font-medium text-green-900">To:</label>
              <input type="date" v-model="customEndDate"
                class="bg-transparent border-none focus:outline-none text-green-900 font-medium" />
            </div>
            <button @click="applyCustomDateRange" class="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full 
                     font-semibold hover:from-green-600 hover:to-blue-600 transform hover:scale-105 
                     transition-all duration-300 shadow-lg hover:shadow-xl">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Statistics Cards with Better Shadows -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 mb-10">
      <!-- Total Expense Card -->
      <div class="group relative bg-gradient-to-br from-red-50 to-pink-100 border border-red-100 rounded-2xl p-6 
                  hover:from-red-100 hover:to-pink-200 transition-all duration-500 transform hover:scale-105 
                  hover:shadow-2xl cursor-pointer overflow-hidden shadow-lg hover:shadow-red-200/50">
        <!-- Background Pattern -->
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-red-200/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700">
        </div>

        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-red-700 text-sm font-bold uppercase tracking-wider select-none">Total Expense</h3>
            <div class="p-2 bg-red-200/50 rounded-full">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3">
                </path>
              </svg>
            </div>
          </div>

          <h1
            class="text-red-700 text-3xl md:text-4xl font-black mb-4 group-hover:scale-110 transition-transform duration-300">
            {{ formatCurrency(totalExpense) }}
          </h1>

          <div class="flex items-center text-sm font-semibold select-none">
            <span v-if="expenseChange > 0" class="flex items-center text-red-600 bg-red-100 px-3 py-1 rounded-full">
              <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +{{ Math.abs(expenseChange) }}%
            </span>
            <span v-else-if="expenseChange < 0"
              class="flex items-center text-green-600 bg-green-100 px-3 py-1 rounded-full">
              <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
              </svg>
              {{ Math.abs(expenseChange) }}%
            </span>
            <span v-else class="text-gray-600 bg-gray-100 px-3 py-1 rounded-full">No change</span>
          </div>
        </div>
      </div>

      <!-- Total Income Card -->
      <div class="group relative bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-100 rounded-2xl p-6 
                  hover:from-emerald-100 hover:to-green-200 transition-all duration-500 transform hover:scale-105 
                  hover:shadow-2xl cursor-pointer overflow-hidden">
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700">
        </div>

        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-emerald-700 text-sm font-bold uppercase tracking-wider select-none">Total Income</h3>
            <div class="p-2 bg-emerald-200/50 rounded-full">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18">
                </path>
              </svg>
            </div>
          </div>

          <h1
            class="text-emerald-700 text-3xl md:text-4xl font-black mb-4 group-hover:scale-110 transition-transform duration-300">
            {{ formatCurrency(totalIncome) }}
          </h1>

          <div class="flex items-center text-sm font-semibold select-none">
            <span v-if="incomeChange > 0" class="flex items-center text-green-600 bg-green-100 px-3 py-1 rounded-full">
              <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +{{ Math.abs(incomeChange) }}%
            </span>
            <span v-else-if="incomeChange < 0" class="flex items-center text-red-600 bg-red-100 px-3 py-1 rounded-full">
              <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
              </svg>
              {{ Math.abs(incomeChange) }}%
            </span>
            <span v-else class="text-gray-600 bg-gray-100 px-3 py-1 rounded-full">No change</span>
          </div>
        </div>
      </div>

      <!-- Net Income Card -->
      <div class="group relative bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-100 rounded-2xl p-6 
                  hover:from-amber-100 hover:to-yellow-200 transition-all duration-500 transform hover:scale-105 
                  hover:shadow-2xl cursor-pointer overflow-hidden shadow-lg hover:shadow-amber-200/50">
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700">
        </div>

        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-amber-700 text-sm font-bold uppercase tracking-wider select-none">Net Income</h3>
            <div class="p-2 bg-amber-200/50 rounded-full">
              <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1">
                </path>
              </svg>
            </div>
          </div>

          <h1
            class="text-amber-700 text-3xl md:text-4xl font-black mb-4 group-hover:scale-110 transition-transform duration-300"
            :class="netIncome >= 0 ? 'text-emerald-700' : 'text-red-700'">
            {{ formatCurrency(netIncome) }}
          </h1>

          <div class="flex items-center text-sm font-semibold select-none">
            <span v-if="netIncomeChange > 0"
              class="flex items-center text-green-600 bg-green-100 px-3 py-1 rounded-full">
              <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +{{ Math.abs(netIncomeChange) }}%
            </span>
            <span v-else-if="netIncomeChange < 0"
              class="flex items-center text-red-600 bg-red-100 px-3 py-1 rounded-full">
              <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
              </svg>
              {{ Math.abs(netIncomeChange) }}%
            </span>
            <span v-else class="text-gray-600 bg-gray-100 px-3 py-1 rounded-full">No change</span>
          </div>
        </div>
      </div>

      <!-- Most Spent Category Card -->
      <div class="group relative bg-gradient-to-br from-purple-50 to-indigo-100 border border-purple-100 rounded-2xl p-6 
                  hover:from-purple-100 hover:to-indigo-200 transition-all duration-500 transform hover:scale-105 
                  hover:shadow-2xl cursor-pointer overflow-hidden shadow-lg hover:shadow-purple-200/50">
        <div
          class="absolute top-0 right-0 w-32 h-32 bg-purple-200/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700">
        </div>

        <div class="relative z-10">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-purple-700 text-sm font-bold uppercase tracking-wider select-none">Top Category</h3>
            <div class="p-2 bg-purple-200/50 rounded-full">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                </path>
              </svg>
            </div>
          </div>

          <h1
            class="text-purple-700 text-2xl md:text-3xl font-black mb-2 group-hover:scale-110 transition-transform duration-300 truncate">
            {{ mostSpentCategory }}
          </h1>

          <div class="space-y-2">
            <div class="text-purple-700 text-lg font-bold">
              {{ formatCurrency(mostSpentCategoryAmount) }}
            </div>
            <div
              class="text-purple-600 text-sm font-medium bg-purple-100 px-3 py-1 rounded-full inline-block select-none">
              {{ mostSpentCategoryPercentage }}% of expenses
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Chart Tabs -->
    <div class="chart-tabs mt-8 px-6 mb-8">
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <nav class="flex overflow-x-auto scrollbar-hide" aria-label="Tabs">
          <button v-for="(tab, index) in chartTabs" :key="index" @click="setActiveTab(tab.id)" :class="[
            activeTab === tab.id
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
            'flex-1 min-w-max px-6 py-4 font-bold text-sm transition-all duration-300 relative'
          ]">
            <span class="relative z-10 flex items-center justify-center gap-2 select-none">
              <span v-if="tab.id === 'trends'">📈</span>
              <span v-else-if="tab.id === 'categories'">🏷️</span>
              <span v-else-if="tab.id === 'monthly'">📊</span>
              {{ tab.name }}
            </span>

            <!-- Active tab indicator -->
            <div v-if="activeTab === tab.id"
              class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full">
            </div>
          </button>
        </nav>
      </div>
    </div>

    <!-- Enhanced Chart Containers -->
    <div class="charts-container px-6 w-full">
      <!-- Trends Tab Content -->
      <div v-show="activeTab === 'trends'" class="space-y-8 animate-in fade-in duration-500">
        <!-- First Row of Charts -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <!-- Expense Trend Chart -->
          <div class="chart-card group relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden 
                      hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <!-- Card Header -->
            <div
              class="flex items-center justify-between p-6 bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100">
              <div class="flex items-center gap-3">
                <div class="p-3 bg-red-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6 6"></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-red-800 select-none">Expense Trend</h2>
              </div>
              <div class="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg select-none">
                📉 Expenses
              </div>
            </div>

            <!-- Chart Content -->
            <div class="p-6 mb-[100px]">
              <div class="relative">
                <line-chart v-if="expenseTrendData.datasets.length > 0" :data="expenseTrendData"
                  class="transition-opacity duration-300" @filter-changed="onExpenseFilterChange" :showDetails="true" />
                <div v-else
                  class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl">
                  <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                    </path>
                  </svg>
                  <p class="text-lg font-medium select-none">No expense data available</p>
                  <p class="text-sm select-none">Add some transactions to see trends</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Income Trend Chart -->
          <div class="chart-card group relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden 
                      hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <!-- Card Header -->
            <div
              class="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
              <div class="flex items-center gap-3">
                <div class="p-3 bg-emerald-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-emerald-800 select-none">Income Trend</h2>
              </div>
              <div class="bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg select-none">
                📈 Income
              </div>
            </div>

            <!-- Chart Content -->
            <div class="p-6 mb-[100px]">
              <div class="relative">
                <line-chart v-if="incomeTrendData.datasets.length > 0" :data="incomeTrendData"
                  class="transition-opacity duration-300" @filter-changed="onIncomeFilterChange" :showDetails="true" />
                <div v-else
                  class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl">
                  <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                    </path>
                  </svg>
                  <p class="text-lg font-medium select-none">No income data available</p>
                  <p class="text-sm select-none">Add some transactions to see trends</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Second Row of Charts -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <!-- Net Income Chart -->
          <div class="chart-card group relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden 
                      hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <!-- Card Header -->
            <div
              class="flex items-center justify-between p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100">
              <div class="flex items-center gap-3">
                <div class="p-3 bg-amber-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1">
                    </path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-amber-800 select-none">Net Income</h2>
              </div>
              <div class="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg select-none">
                💰 Net
              </div>
            </div>

            <!-- Chart Content -->
            <div class="p-6 mb-[100px]">
              <div class="relative">
                <line-chart v-if="netIncomeTrendData.datasets.length > 0" :data="netIncomeTrendData"
                  class="transition-opacity duration-300" @filter-changed="onNetIncomeFilterChange"
                  :showDetails="true" />
                <div v-else
                  class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl">
                  <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                    </path>
                  </svg>
                  <p class="text-lg font-medium select-none">No net income data available</p>
                  <p class="text-sm select-none">Add some transactions to see trends</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Income vs Expense Chart -->
          <div class="chart-card group relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden 
                      hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <!-- Card Header -->
            <div
              class="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
              <div class="flex items-center gap-3">
                <div class="p-3 bg-purple-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                    </path>
                  </svg>
                </div>
                <h2 class="text-2xl font-bold text-purple-800 select-none">Income vs Expenses</h2>
              </div>
              <div class="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg select-none">
                ⚖️ Compare
              </div>
            </div>

            <!-- Chart Content -->
            <div class="p-6 mb-[100px]">
              <div class="relative">
                <line-chart v-if="incomeVsExpenseData.datasets.length > 0" :data="incomeVsExpenseData"
                  class="transition-opacity duration-300" @filter-changed="onComparisonFilterChange"
                  :showDetails="true" />
                <div v-else
                  class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl">
                  <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                    </path>
                  </svg>
                  <p class="text-lg font-medium select-none">No comparison data available</p>
                  <p class="text-sm select-none">Add some transactions to see comparison</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Tab Content -->
      <div v-show="activeTab === 'categories'" class="space-y-8 animate-in fade-in duration-500">
        <!-- Category Breakdown Table -->
        <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
            <div class="flex items-center gap-3 mb-4 sm:mb-0">
              <div class="p-3 bg-indigo-100 rounded-2xl">
                <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                  </path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-indigo-800 select-none">Category Breakdown</h2>
            </div>
            <div class="flex items-center gap-3">
              <button @click="toggleTableView('expense')"
                class="px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 select-none" :class="tableView === 'expense'
                  ? 'bg-red-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
                💸 Expenses
              </button>
              <button @click="toggleTableView('income')"
                class="px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 select-none" :class="tableView === 'income'
                  ? 'bg-green-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
                💰 Income
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider select-none">
                    🏷️ Category
                  </th>
                  <th class="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider select-none">
                    💵 Amount
                  </th>
                  <th class="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider select-none">
                    📊 % of Total
                  </th>
                  <th class="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider select-none">
                    🔢 Transactions
                  </th>
                  <th class="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider select-none">
                    📈 Avg. Amount
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(category, index) in getCategoryBreakdown" :key="index"
                  class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-3 h-3 rounded-full mr-3"
                        :style="{ backgroundColor: `rgb(${getCategoryColor(category.name)})` }"></div>
                      <span class="text-sm font-bold text-gray-900 select-none">{{ category.name }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-bold select-none"
                    :class="tableView === 'expense' ? 'text-red-600' : 'text-green-600'">
                    {{ formatCurrency(category.amount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="flex items-center justify-end">
                      <div class="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div class="h-2 rounded-full transition-all duration-500 select-none"
                          :class="tableView === 'expense' ? 'bg-red-500' : 'bg-green-500'"
                          :style="{ width: `${category.percentage}%` }"></div>
                      </div>
                      <span class="text-sm font-bold text-gray-700 select-none">{{ category.percentage }}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 font-medium select-none">
                    {{ category.count }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700 font-medium select-none">
                    {{ formatCurrency(category.avgAmount) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Monthly Analysis Tab Content -->
      <div v-show="activeTab === 'monthly'" class="space-y-8 animate-in fade-in duration-500">
        <!-- Monthly Summary Table -->
        <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
            <div class="flex items-center gap-3 mb-4 sm:mb-0">
              <div class="p-3 bg-cyan-100 rounded-2xl">
                <svg class="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-cyan-800 select-none">Monthly Summary</h2>
            </div>
            <div class="flex gap-2">
              <select v-model="selectedYear" class="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-bold border border-cyan-200 
                             focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all duration-300">
                <option v-for="year in availableYears" :key="year" :value="year">
                  📅 {{ year }}
                </option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider select-none">
                    📅 Month
                  </th>
                  <th class="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider select-none">
                    💰 Income
                  </th>
                  <th class="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider select-none">
                    💸 Expenses
                  </th>
                  <th class="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider select-none">
                    📊 Net
                  </th>
                  <th class="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider select-none">
                    📈 Savings Rate
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(month, index) in monthlyBreakdown" :key="index"
                  class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 select-none">
                    {{ month.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-bold select-none">
                    {{ formatCurrency(month.income) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-bold select-none">
                    {{ formatCurrency(month.expenses) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-bold select-none"
                    :class="month.net >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ formatCurrency(month.net) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right select-none">
                    <div class="flex items-center justify-end">
                      <div class="w-20 bg-gray-200 rounded-full h-3 mr-3 shadow-inner">
                        <div class="h-3 rounded-full transition-all duration-500 shadow-sm"
                          :class="month.savingsRate >= 0 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-red-500'"
                          :style="{ width: `${Math.min(Math.max(Math.abs(month.savingsRate), 0), 100)}%` }"></div>
                      </div>
                      <span class="font-bold text-gray-700 min-w-[3rem]">{{ month.savingsRate }}%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { userTransactions } from "../stores/transactions";
import LineChart from "../components/LineChart.vue";
import {
  startOfMonth, endOfMonth, startOfYear, endOfYear,
  subMonths, subWeeks, format, parseISO, differenceInDays,
  getDaysInMonth, isSameMonth, isSameYear
} from "date-fns";

export default {
  components: { LineChart },
  setup() {
    const transactions = ref([]);
    const store = userTransactions();

    // UI State
    const activeTab = ref('trends');
    const selectedPeriod = ref('all');
    const customStartDate = ref('');
    const customEndDate = ref('');
    const categoryChartType = ref('pie');
    const selectedCategoryForTrend = ref('');
    const tableView = ref('expense');
    const monthlyViewType = ref('bar');
    const selectedYear = ref(new Date().getFullYear());

    const isLoading = ref(true);

    // Chart Tabs
    const chartTabs = [
      { id: 'trends', name: 'Trends' },
      { id: 'categories', name: 'Categories' },
      { id: 'monthly', name: 'Monthly Analysis' }
    ];

    // Set active tab
    const setActiveTab = (tabId) => {
      activeTab.value = tabId;
    };

    // Date filters
    const applyDateFilter = () => {
      if (selectedPeriod.value === 'custom' && (!customStartDate.value || !customEndDate.value)) {
        return;
      }
    };

    // Custom date range
    const applyCustomDateRange = () => {
      if (customStartDate.value && customEndDate.value) {
        selectedPeriod.value = 'custom';
        applyDateFilter();
      }
    };

    // Toggle table view
    const toggleTableView = (view) => {
      tableView.value = view;
    };

    // Format currency 
    const formatCurrency = (value) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);

    // Fetch transactions on mount with loading state
    onMounted(async () => {
      isLoading.value = true;
      try {
        await store.loadTransactions();
        transactions.value = store.transactions;

        if (transactions.value.length > 0) {
          const categories = [...new Set(transactions.value.map(t => t.category))];
          if (categories.length > 0) {
            selectedCategoryForTrend.value = categories[0];
          }

          const years = [...new Set(transactions.value.map(t =>
            new Date(t.date).getFullYear()
          ))].sort((a, b) => b - a);

          if (years.length > 0) {
            selectedYear.value = years[0];
          }
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        // Add a small delay to show the loading animation
        setTimeout(() => {
          isLoading.value = false;
        }, 800);
      }
    });

    // Filter transactions by date range
    const filteredTransactions = computed(() => {
      let result = [...transactions.value];

      if (selectedPeriod.value !== 'all') {
        const now = new Date();
        let startDate;

        switch (selectedPeriod.value) {
          case 'year':
            startDate = startOfYear(now);
            break;
          case '6month':
            startDate = subMonths(now, 6);
            break;
          case '3month':
            startDate = subMonths(now, 3);
            break;
          case 'month':
            startDate = startOfMonth(now);
            break;
          case 'week':
            startDate = subWeeks(now, 1);
            break;
          case 'custom':
            if (customStartDate.value && customEndDate.value) {
              startDate = new Date(customStartDate.value);
              const endDate = new Date(customEndDate.value);
              endDate.setHours(23, 59, 59, 999);
              result = result.filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate >= startDate && transactionDate <= endDate;
              });
              return result;
            }
            break;
        }

        if (startDate) {
          result = result.filter(t => new Date(t.date) >= startDate);
        }
      }

      return result;
    });

    // Computed values for dashboard metrics
    const totalExpense = computed(() =>
      filteredTransactions.value
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    );

    const totalIncome = computed(() =>
      filteredTransactions.value
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0)
    );

    const netIncome = computed(() => totalIncome.value - totalExpense.value);

    // Previous period stats for comparison
    const previousPeriodStats = computed(() => {
      if (selectedPeriod.value === 'all' || selectedPeriod.value === 'custom') {
        return { income: 0, expense: 0, net: 0 };
      }

      const now = new Date();
      let currentStart, currentEnd, previousStart, previousEnd;

      switch (selectedPeriod.value) {
        case 'year':
          currentStart = startOfYear(now);
          currentEnd = now;
          previousStart = new Date(currentStart);
          previousStart.setFullYear(previousStart.getFullYear() - 1);
          previousEnd = new Date(currentStart);
          previousEnd.setDate(previousEnd.getDate() - 1);
          break;
        case '6month':
          currentStart = subMonths(now, 6);
          currentEnd = now;
          previousStart = subMonths(currentStart, 6);
          previousEnd = new Date(currentStart);
          previousEnd.setDate(previousEnd.getDate() - 1);
          break;
        case '3month':
          currentStart = subMonths(now, 3);
          currentEnd = now;
          previousStart = subMonths(currentStart, 3);
          previousEnd = new Date(currentStart);
          previousEnd.setDate(previousEnd.getDate() - 1);
          break;
        case 'month':
          currentStart = startOfMonth(now);
          currentEnd = now;
          previousStart = startOfMonth(subMonths(now, 1));
          previousEnd = endOfMonth(subMonths(now, 1));
          break;
        case 'week':
          currentStart = subWeeks(now, 1);
          currentEnd = now;
          previousStart = subWeeks(currentStart, 1);
          previousEnd = new Date(currentStart);
          previousEnd.setDate(previousEnd.getDate() - 1);
          break;
      }

      const previousTransactions = transactions.value.filter(t => {
        const date = new Date(t.date);
        return date >= previousStart && date <= previousEnd;
      });

      const prevIncome = previousTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

      const prevExpense = previousTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      return {
        income: prevIncome,
        expense: prevExpense,
        net: prevIncome - prevExpense
      };
    });

    // Calculate percentage changes
    const calculatePercentageChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round((current - previous) / previous * 100);
    };

    const expenseChange = computed(() =>
      calculatePercentageChange(totalExpense.value, previousPeriodStats.value.expense)
    );

    const incomeChange = computed(() =>
      calculatePercentageChange(totalIncome.value, previousPeriodStats.value.income)
    );

    const netIncomeChange = computed(() => {
      const current = netIncome.value;
      const previous = previousPeriodStats.value.net;

      if (previous === 0) return current > 0 ? 100 : (current < 0 ? -100 : 0);

      if ((current < 0 && previous > 0) || (current > 0 && previous < 0)) {
        return -calculatePercentageChange(Math.abs(current), Math.abs(previous));
      }

      return calculatePercentageChange(Math.abs(current), Math.abs(previous)) * (current < 0 ? -1 : 1);
    });

    const mostSpentCategory = computed(() => {
      const categoryTotals = filteredTransactions.value.reduce((acc, t) => {
        if (t.amount < 0) {
          acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        }
        return acc;
      }, {});

      const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
      return sortedCategories.length > 0 ? sortedCategories[0][0] : "None";
    });

    const mostSpentCategoryAmount = computed(() => {
      const categoryTotals = filteredTransactions.value.reduce((acc, t) => {
        if (t.amount < 0) {
          acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        }
        return acc;
      }, {});

      const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
      return sortedCategories.length > 0 ? sortedCategories[0][1] : 0;
    });

    const mostSpentCategoryPercentage = computed(() => {
      if (totalExpense.value === 0) return 0;
      return Math.round((mostSpentCategoryAmount.value / totalExpense.value) * 100);
    });

    // Available categories and years
    const availableCategories = computed(() => {
      return [...new Set(transactions.value.map(t => t.category))];
    });

    const availableYears = computed(() => {
      const years = [...new Set(transactions.value.map(t =>
        new Date(t.date).getFullYear()
      ))];
      return years.sort((a, b) => b - a);
    });

    // Helper function to generate colors
    const getCategoryColor = (category, alpha = 1) => {
      let hash = 0;
      for (let i = 0; i < category.length; i++) {
        hash = category.charCodeAt(i) + ((hash << 5) - hash);
      }

      const r = Math.abs(hash) % 200 + 55;
      const g = Math.abs(hash >> 8) % 200 + 55;
      const b = Math.abs(hash >> 16) % 200 + 55;

      return `${r}, ${g}, ${b}, ${alpha}`;
    };

    // Category breakdown for the table
    const getCategoryBreakdown = computed(() => {
      const isExpenseView = tableView.value === 'expense';

      const categoryData = filteredTransactions.value.reduce((acc, t) => {
        if ((isExpenseView && t.amount >= 0) || (!isExpenseView && t.amount <= 0)) {
          return acc;
        }

        const category = t.category;
        const amount = Math.abs(t.amount);

        if (!acc[category]) {
          acc[category] = {
            name: category,
            amount: 0,
            count: 0,
            avgAmount: 0
          };
        }

        acc[category].amount += amount;
        acc[category].count += 1;

        return acc;
      }, {});

      const totalAmount = Object.values(categoryData).reduce((sum, cat) => sum + cat.amount, 0);

      const result = Object.values(categoryData).map(cat => {
        cat.avgAmount = cat.count > 0 ? cat.amount / cat.count : 0;
        cat.percentage = totalAmount > 0 ? Math.round((cat.amount / totalAmount) * 100) : 0;
        return cat;
      });

      return result.sort((a, b) => b.amount - a.amount);
    });

    // Monthly breakdown for the table
    const monthlyBreakdown = computed(() => {
      const yearTransactions = filteredTransactions.value.filter(t => {
        const date = new Date(t.date);
        return date.getFullYear() === selectedYear.value;
      });

      const months = [];
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(selectedYear.value, i, 1);
        months.push({
          name: format(monthDate, 'MMMM'),
          income: 0,
          expenses: 0,
          net: 0,
          savingsRate: 0
        });
      }

      yearTransactions.forEach(t => {
        const date = new Date(t.date);
        const monthIndex = date.getMonth();

        if (t.amount > 0) {
          months[monthIndex].income += t.amount;
        } else {
          months[monthIndex].expenses += Math.abs(t.amount);
        }
      });

      months.forEach(month => {
        month.net = month.income - month.expenses;
        month.savingsRate = month.income > 0 ? Math.round((month.net / month.income) * 100) : 0;
      });

      return months;
    });

    // Chart data preparations
    const expenseTrendData = computed(() => {
      const sortedData = filteredTransactions.value
        .filter(t => t.amount < 0)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      return {
        datasets: [
          {
            label: "Expense",
            data: sortedData.map((t) => ({
              x: new Date(t.date),
              y: Math.abs(t.amount),
            })),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            pointBackgroundColor: 'rgb(239, 68, 68)',
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: true
          },
        ]
      };
    });

    const incomeTrendData = computed(() => {
      const sortedData = filteredTransactions.value
        .filter(t => t.amount > 0)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      return {
        datasets: [
          {
            label: "Income",
            data: sortedData.map((t) => ({
              x: new Date(t.date),
              y: t.amount,
            })),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            pointBackgroundColor: 'rgb(34, 197, 94)',
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: true
          },
        ]
      };
    });

    const netIncomeTrendData = computed(() => {
      const dateMap = new Map();

      filteredTransactions.value.forEach(t => {
        const dateStr = t.date.substring(0, 10);
        const amount = t.amount;

        if (dateMap.has(dateStr)) {
          dateMap.set(dateStr, dateMap.get(dateStr) + amount);
        } else {
          dateMap.set(dateStr, amount);
        }
      });

      const netByDate = Array.from(dateMap.entries())
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      return {
        datasets: [
          {
            label: "Net Income",
            data: netByDate.map((item) => ({
              x: new Date(item.date),
              y: item.amount,
            })),
            borderColor: 'rgb(234, 179, 8)',
            backgroundColor: 'rgba(234, 179, 8, 0.1)',
            pointBackgroundColor: (context) => {
              const value = context.raw.y;
              return value >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)';
            },
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: true
          },
        ]
      };
    });

    const incomeVsExpenseData = computed(() => {
      const monthlyData = new Map();

      filteredTransactions.value.forEach(t => {
        const date = new Date(t.date);
        const monthDate = new Date(date.getFullYear(), date.getMonth(), 15);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = format(date, 'MMM yyyy');

        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
            month: monthName,
            monthKey,
            date: monthDate,
            income: 0,
            expense: 0
          });
        }

        const entry = monthlyData.get(monthKey);
        if (t.amount > 0) {
          entry.income += t.amount;
        } else {
          entry.expense += Math.abs(t.amount);
        }
      });

      const monthlyArray = Array.from(monthlyData.values())
        .sort((a, b) => a.date - b.date);

      return {
        datasets: [
          {
            label: "Income",
            data: monthlyArray.map(m => ({ x: m.date, y: m.income })),
            backgroundColor: 'rgba(34, 197, 94, 0.7)',
            borderColor: 'rgb(34, 197, 94)',
            borderWidth: 1,
            borderRadius: 4,
            order: 2
          },
          {
            label: "Expense",
            data: monthlyArray.map(m => ({ x: m.date, y: m.expense })),
            backgroundColor: 'rgba(239, 68, 68, 0.7)',
            borderColor: 'rgb(239, 68, 68)',
            borderWidth: 1,
            borderRadius: 4,
            order: 3
          },
          {
            type: 'line',
            label: "Net",
            data: monthlyArray.map(m => ({ x: m.date, y: m.income - m.expense })),
            borderColor: 'rgb(234, 179, 8)',
            backgroundColor: 'rgba(234, 179, 8, 0.1)',
            borderWidth: 2,
            pointBackgroundColor: (context) => {
              const value = context.raw.y;
              return value >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)';
            },
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            order: 1,
            yAxisID: 'y1'
          }
        ]
      };
    });

    // Filter event handlers
    const onExpenseFilterChange = (filter) => {
      console.log('Expense filter changed:', filter);
    };

    const onIncomeFilterChange = (filter) => {
      console.log('Income filter changed:', filter);
    };

    const onNetIncomeFilterChange = (filter) => {
      console.log('Net income filter changed:', filter);
    };

    const onComparisonFilterChange = (filter) => {
      console.log('Comparison filter changed:', filter);
    };

    const onCategoryTrendFilterChange = (filter) => {
      console.log('Category trend filter changed:', filter);
    };

    // Watch for changes
    watch(selectedCategoryForTrend, (newValue) => {
      console.log('Selected category changed:', newValue);
    });

    watch(selectedYear, (newValue) => {
      console.log('Selected year changed:', newValue);
    });

    return {
      // State
      transactions,
      activeTab,
      selectedPeriod,
      customStartDate,
      customEndDate,
      categoryChartType,
      selectedCategoryForTrend,
      tableView,
      monthlyViewType,
      selectedYear,
      isLoading,

      // Computed values
      filteredTransactions,
      totalExpense,
      totalIncome,
      netIncome,
      expenseChange,
      incomeChange,
      netIncomeChange,
      mostSpentCategory,
      mostSpentCategoryAmount,
      mostSpentCategoryPercentage,
      availableCategories,
      availableYears,
      chartTabs,
      expenseTrendData,
      incomeTrendData,
      netIncomeTrendData,
      incomeVsExpenseData,
      getCategoryBreakdown,
      monthlyBreakdown,

      // Methods
      setActiveTab,
      applyDateFilter,
      applyCustomDateRange,
      toggleTableView,
      formatCurrency,
      getCategoryColor,
      onExpenseFilterChange,
      onIncomeFilterChange,
      onNetIncomeFilterChange,
      onComparisonFilterChange,
      onCategoryTrendFilterChange
    };
  }
};
</script>

<style scoped>
/* Scrollbar hide utility */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Animation utilities */
.animate-in {
  animation: fadeInUp 0.5s ease-out;
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}

.slide-in-from-top {
  animation: slideInFromTop 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dashboard specific styles */
.dashboard-container {
  animation: fadeIn 1s ease-in-out;
  max-width: 100vw;
}

.chart-card {
  transition: all 0.3s ease;
  overflow: hidden;
  break-inside: avoid;
  position: relative;
}

.chart-tabs button {
  transition: all 0.2s ease;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .dashboard-container {
    padding-bottom: 2rem;
  }

  .chart-tabs {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }

  .chart-tabs nav {
    padding-bottom: 0.5rem;
  }

  .chart-card {
    min-height: 550px;
    width: 100%;
    margin-bottom: 2rem;
  }

  .charts-container {
    margin-top: 1rem;
    padding: 0.5rem;
  }

  /* Make stat cards stack better on mobile */
  .grid-cols-1 {
    gap: 1rem;
  }
}

@media (max-width: 640px) {

  /* Adjust font sizes for mobile */
  h1 {
    font-size: 2.5rem !important;
  }

  h2 {
    font-size: 1.5rem !important;
  }

  /* Better spacing on very small screens */
  .space-y-8>*+* {
    margin-top: 1.5rem;
  }

  .gap-8 {
    gap: 1.5rem;
  }

  .chart-card {
    min-height: 450px;
  }

  .chart-card .h-\[450px\] {
    height: 350px !important;
  }
}

/* Custom gradient backgrounds */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Enhanced hover effects */
.chart-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Better button states */
button:active {
  transform: scale(0.98);
}

/* Table improvements */
table {
  border-collapse: separate;
  border-spacing: 0;
}

tbody tr:hover {
  transform: translateX(4px);
}

/* Progress bar animations */
.h-2,
.h-3 {
  transition: width 0.5s ease-in-out;
}

/* Card background patterns */
.group:hover .absolute {
  transform: scale(1.5);
  transition: transform 0.7s ease;
}
</style>