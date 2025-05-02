<template>
  <div class="dashboard-container max-w-full overflow-x-hidden pb-6">
    <!-- Header -->
    <div class="p-6 bg-gradient-to-r from-green-400 to-blue-500 shadow-lg mb-8">
      <h1 class="text-4xl font-extrabold text-center text-white">Your Da<span class="text-green-700">$</span>hboard</h1>

      <!-- Time period selector -->
      <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
        <select v-model="selectedPeriod" @change="applyDateFilter" class="px-3 py-1.5 bg-white bg-opacity-80 backdrop-blur-sm border border-gray-100 
                rounded-full text-sm font-medium text-blue-800 shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          <option value="all">All Time</option>
          <option value="year">This Year</option>
          <option value="6month">Last 6 Months</option>
          <option value="3month">Last 3 Months</option>
          <option value="month">This Month</option>
          <option value="week">This Week</option>
          <option value="custom">Custom Range</option>
        </select>

        <div class="date-range flex flex-wrap items-center gap-2" v-if="selectedPeriod === 'custom'">
          <input type="date" v-model="customStartDate" class="px-3 py-1.5 bg-white bg-opacity-80 backdrop-blur-sm border border-gray-100 
                  rounded-full text-sm font-medium text-blue-800 shadow-sm" />
          <span class="text-white">to</span>
          <input type="date" v-model="customEndDate" class="px-3 py-1.5 bg-white bg-opacity-80 backdrop-blur-sm border border-gray-100 
                  rounded-full text-sm font-medium text-blue-800 shadow-sm" />
          <button @click="applyCustomDateRange" class="px-3 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium 
                  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
            Apply
          </button>
        </div>
      </div>
    </div>

    <!-- Statistic Boxes -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 p-4 mb-8">
      <div
        class="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col space-y-4 hover:bg-blue-100 transition-all duration-300 ease-in-out group">
        <h3 class="text-blue-600 text-sm font-medium uppercase tracking-wider">Total Expense</h3>
        <h1 class="text-blue-700 text-3xl md:text-4xl font-bold group-hover:scale-105 transition-transform pb-2">
          {{ formatCurrency(totalExpense) }}
        </h1>
        <div class="text-blue-500 text-sm font-medium flex items-center">
          <span v-if="expenseChange > 0" class="text-red-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {{ Math.abs(expenseChange) }}% increase
          </span>
          <span v-else-if="expenseChange < 0" class="text-green-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
            </svg>
            {{ Math.abs(expenseChange) }}% decrease
          </span>
          <span v-else class="text-gray-500">No change</span>
        </div>
      </div>

      <div
        class="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex flex-col space-y-4 hover:bg-emerald-100 transition-all duration-300 ease-in-out group">
        <h3 class="text-emerald-600 text-sm font-medium uppercase tracking-wider">Total Income</h3>
        <h1 class="text-emerald-700 text-4xl font-bold group-hover:scale-105 transition-transform pb-2">
          {{ formatCurrency(totalIncome) }}
        </h1>
        <div class="text-emerald-500 text-sm font-medium flex items-center">
          <span v-if="incomeChange > 0" class="text-green-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {{ Math.abs(incomeChange) }}% increase
          </span>
          <span v-else-if="incomeChange < 0" class="text-red-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
            </svg>
            {{ Math.abs(incomeChange) }}% decrease
          </span>
          <span v-else class="text-gray-500">No change</span>
        </div>
      </div>

      <div
        class="bg-amber-50 border border-amber-100 rounded-xl p-6 flex flex-col space-y-4 hover:bg-amber-100 transition-all duration-300 ease-in-out group">
        <h3 class="text-amber-600 text-sm font-medium uppercase tracking-wider">Net Income</h3>
        <h1 class="text-amber-700 text-4xl font-bold group-hover:scale-105 transition-transform pb-2">
          {{ formatCurrency(netIncome) }}
        </h1>
        <div class="text-amber-500 text-sm font-medium flex items-center">
          <span v-if="netIncomeChange > 0" class="text-green-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {{ Math.abs(netIncomeChange) }}% increase
          </span>
          <span v-else-if="netIncomeChange < 0" class="text-red-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
            </svg>
            {{ Math.abs(netIncomeChange) }}% decrease
          </span>
          <span v-else class="text-gray-500">No change</span>
        </div>
      </div>

      <div
        class="bg-rose-50 border border-rose-100 rounded-xl p-6 flex flex-col space-y-4 hover:bg-rose-100 transition-all duration-300 ease-in-out group">
        <h3 class="text-rose-600 text-sm font-medium uppercase tracking-wider">Most Spent Category</h3>
        <h1 class="text-rose-700 text-4xl font-bold group-hover:scale-105 transition-transform pb-2">
          {{ mostSpentCategory }}
        </h1>
        <div class="text-rose-600 text-sm font-medium">
          {{ formatCurrency(mostSpentCategoryAmount) }}
          <span class="text-gray-500 ml-1">({{ mostSpentCategoryPercentage }}% of expenses)</span>
        </div>
      </div>
    </div>
    <!-- Chart Tabs -->
    <div class="chart-tabs mt-8 px-4 mb-6">
      <div class="border-b border-gray-200 flex justify-center">
        <nav class="flex -mb-px space-x-8" aria-label="Tabs">
          <button v-for="(tab, index) in chartTabs" :key="index" @click="setActiveTab(tab.id)" :class="[
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm'
          ]" :aria-current="activeTab === tab.id ? 'page' : undefined">
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Chart and Graph Containers -->
    <div class="charts-container mt-6 px-4 w-full overflow-x-hidden">
      <!-- Trends Tab Content -->
      <div v-show="activeTab === 'trends'" class="flex flex-col gap-10 w-full">
        <!-- First Row of Charts -->
        <div class="flex flex-col lg:flex-row gap-10 w-full">
          <!-- Expense Trend Chart -->
          <div
            class="chart-box bg-white p-6 rounded-lg shadow-lg flex-1 w-full lg:w-1/2 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl md:text-2xl font-bold text-red-800 font-sans tracking-tight">Expense Trend</h2>
              <div class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                Expenses
              </div>
            </div>
            <div class="h-[300px] md:h-[400px] relative">
              <line-chart v-if="expenseTrendData.datasets.length > 0" :data="expenseTrendData"
                class="transition-opacity duration-300" @filter-changed="onExpenseFilterChange" :showDetails="true" />
              <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
                No expense data available
              </div>
            </div>
          </div>

          <!-- Income Trend Chart -->
          <div
            class="chart-box bg-white p-6 rounded-lg shadow-lg flex-1 w-full lg:w-1/2 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl md:text-2xl font-bold text-green-800 font-sans tracking-tight">Income Trend</h2>
              <div class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                Income
              </div>
            </div>
            <div class="h-[300px] md:h-[400px] relative">
              <line-chart v-if="incomeTrendData.datasets.length > 0" :data="incomeTrendData"
                class="transition-opacity duration-300" @filter-changed="onIncomeFilterChange" :showDetails="true" />
              <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
                No income data available
              </div>
            </div>
          </div>
        </div>

        <!-- Second Row of Charts -->
        <div class="flex flex-col lg:flex-row gap-10 w-full">
          <!-- Net Income Chart -->
          <div
            class="chart-box bg-white p-6 rounded-lg shadow-lg flex-1 w-full lg:w-1/2 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl md:text-2xl font-bold text-amber-800 font-sans tracking-tight">Net Income</h2>
              <div class="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-sm font-medium">
                Net
              </div>
            </div>
            <div class="h-[300px] md:h-[400px] relative">
              <line-chart v-if="netIncomeTrendData.datasets.length > 0" :data="netIncomeTrendData"
                class="transition-opacity duration-300" @filter-changed="onNetIncomeFilterChange" :showDetails="true" />
              <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
                No net income data available
              </div>
            </div>
          </div>

          <!-- Income vs Expense Chart -->
          <div
            class="chart-box bg-white p-6 rounded-lg shadow-lg flex-1 w-full lg:w-1/2 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl md:text-2xl font-bold text-purple-800 font-sans tracking-tight">Income vs Expenses</h2>
              <div class="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                Comparison
              </div>
            </div>
            <div class="h-[300px] md:h-[400px] relative">
              <line-chart v-if="incomeVsExpenseData.datasets.length > 0" :data="incomeVsExpenseData"
                class="transition-opacity duration-300" @filter-changed="onComparisonFilterChange"
                :showDetails="true" />
              <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
                No comparison data available
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Tab Content -->
      <div v-show="activeTab === 'categories'" class="flex flex-col gap-10 w-full">
        <!-- Category Breakdown -->
        <!-- <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full"> -->

        <!-- Expense by Category Chart -->
        <!-- <div
            class="chart-box bg-white p-6 rounded-lg shadow-lg flex-1 w-full transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border border-gray-100">
            <div class="flex flex-wrap items-center justify-between mb-4 gap-2">
              <h2 class="text-xl md:text-2xl font-bold text-indigo-800 font-sans tracking-tight">Expense by Category
              </h2>
              <div class="flex gap-2">
                <select v-model="categoryChartType"
                  class="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium border border-indigo-100">
                  <option value="pie">Pie Chart</option>
                  <option value="doughnut">Doughnut Chart</option>
                  <option value="bar">Bar Chart</option>
                </select>
              </div>
            </div>
            <div class="h-[300px] md:h-[400px] relative">
              <line-chart v-if="expenseByCategoryData.datasets.length > 0" :data="expenseByCategoryData"
                class="transition-opacity duration-300" />
              <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
                No category data available
              </div>
            </div> -->

        <!-- Top Categories List -->
        <!-- <div class="mt-4">
              <h3 class="text-lg font-semibold text-gray-700 mb-2">Top Categories</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div v-for="(category, index) in topExpenseCategories" :key="index"
                  class="flex items-center justify-between p-2 rounded-lg"
                  :style="{ backgroundColor: `rgba(${getCategoryColor(category.name, 0.1)})` }">
                  <span class="font-medium truncate mr-2" :style="{ color: `rgb(${getCategoryColor(category.name)})` }">
                    {{ category.name }}
                  </span>
                  <span class="text-gray-700 whitespace-nowrap">{{ formatCurrency(category.amount) }}</span>
                </div>
              </div>
            </div>
          </div> -->

        <!-- Category Trend Over Time -->
        <!-- <div
            class="chart-box bg-white p-6 rounded-lg shadow-lg flex-1 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-teal-800 font-sans tracking-tight">Category Trends</h2>
              <div class="flex gap-2">
                <select v-model="selectedCategoryForTrend"
                  class="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-sm font-medium border border-teal-100">
                  <option v-for="category in availableCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
            </div>
            <div class="h-[400px] relative">
              <line-chart v-if="categoryTrendData.datasets.length > 0" :data="categoryTrendData"
                class="transition-opacity duration-300" @filter-changed="onCategoryTrendFilterChange" />
              <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
                No trend data available for this category
              </div>
            </div>
          </div> -->
        <!-- </div> -->

        <!-- Category Breakdown Table -->
        <div class="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-800 font-sans tracking-tight">Category Breakdown</h2>
            <div class="flex items-center gap-2">
              <button @click="toggleTableView('expense')" class="px-3 py-1 rounded-full text-sm font-medium"
                :class="tableView === 'expense' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'">
                Expenses
              </button>
              <button @click="toggleTableView('income')" class="px-3 py-1 rounded-full text-sm font-medium"
                :class="tableView === 'income' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'">
                Income
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % of Total
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transactions
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Amount
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(category, index) in getCategoryBreakdown" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ category.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                    {{ formatCurrency(category.amount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {{ category.percentage }}%
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {{ category.count }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {{ formatCurrency(category.avgAmount) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Monthly Analysis Tab Content -->
      <div v-show="activeTab === 'monthly'" class="flex flex-col gap-6">
        <!-- Monthly Overview -->
        <!-- <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"> -->
        <!-- Monthly Income & Expenses -->
        <!-- <div
            class="chart-box bg-white p-6 rounded-lg shadow-lg flex-1 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-blue-800 font-sans tracking-tight">Monthly Overview</h2>
              <div class="flex gap-2">
                <select v-model="monthlyViewType"
                  class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium border border-blue-100">
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                </select>
              </div>
            </div>
            <div class="h-[400px] relative">
              <line-chart v-if="monthlyOverviewData.datasets.length > 0" :data="monthlyOverviewData"
                class="transition-opacity duration-300" />
              <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
                No monthly data available
              </div>
            </div>
          </div> -->

        <!-- Monthly Savings Rate -->
        <!-- <div
            class="chart-box bg-white p-6 rounded-lg shadow-lg flex-1 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-cyan-800 font-sans tracking-tight">Savings Rate</h2>
              <div class="bg-cyan-100 text-cyan-600 px-3 py-1 rounded-full text-sm font-medium">
                {{ averageSavingsRate }}% avg
              </div>
            </div>
            <div class="h-[400px] relative">
              <line-chart v-if="savingsRateData.datasets.length > 0" :data="savingsRateData"
                class="transition-opacity duration-300" />
              <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
                No savings data available
              </div>
            </div>
          </div>
        </div> -->

        <!-- Monthly Summary Table -->
        <div class="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-800 font-sans tracking-tight">Monthly Summary</h2>
            <div class="flex gap-2">
              <select v-model="selectedYear"
                class="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-sm font-medium border border-gray-200">
                <option v-for="year in availableYears" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Income
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Savings Rate
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(month, index) in monthlyBreakdown" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ month.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-medium">
                    {{ formatCurrency(month.income) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-medium">
                    {{ formatCurrency(month.expenses) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium"
                    :class="month.net >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ formatCurrency(month.net) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    <div class="flex items-center justify-end">
                      <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div class="h-2 rounded-full" :class="month.savingsRate >= 0 ? 'bg-green-500' : 'bg-red-500'"
                          :style="{ width: `${Math.min(Math.max(month.savingsRate, 0), 100)}%` }"></div>
                      </div>
                      {{ month.savingsRate }}%
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
import LineChart from "../components/LineChart.vue"; // Enhanced line chart component
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
      // Filter transactions based on selected period
      if (selectedPeriod.value === 'custom' && (!customStartDate.value || !customEndDate.value)) {
        // If custom period is selected but dates aren't set, don't apply filter yet
        return;
      }

      // Apply the filter - the filtered transactions computed property will handle the logic
    };

    // Custom date range
    const applyCustomDateRange = () => {
      if (customStartDate.value && customEndDate.value) {
        // Apply the custom date range
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


    // Fetch transactions on mount
    onMounted(async () => {
      await store.loadTransactions(); // Ensure this fetches data
      transactions.value = store.transactions;

      // Initialize default values
      if (transactions.value.length > 0) {
        const categories = [...new Set(transactions.value.map(t => t.category))];
        if (categories.length > 0) {
          selectedCategoryForTrend.value = categories[0];
        }

        // Initialize year if transactions exist
        const years = [...new Set(transactions.value.map(t =>
          new Date(t.date).getFullYear()
        ))].sort((a, b) => b - a); // Sort descending

        if (years.length > 0) {
          selectedYear.value = years[0]; // Set to most recent year
        }
      }
    });

    // Expense by Category Data
    const expenseByCategoryData = computed(() => {
      // Group expenses by category
      const categoryTotals = filteredTransactions.value.reduce((acc, t) => {
        if (t.amount < 0) {
          const category = t.category;
          acc[category] = (acc[category] || 0) + Math.abs(t.amount);
        }
        return acc;
      }, {});

      // Convert to array and sort by amount
      const categoryArray = Object.entries(categoryTotals)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);

      // Prepare chart data based on selected chart type
      if (categoryChartType.value === 'pie' || categoryChartType.value === 'doughnut') {
        return {
          type: categoryChartType.value,
          datasets: [
            {
              data: categoryArray.map(c => c.amount),
              backgroundColor: categoryArray.map(c =>
                `rgba(${getCategoryColor(c.name)})`
              ),
              borderColor: 'rgba(255, 255, 255, 0.7)',
              borderWidth: 2,
              hoverOffset: 10,
              label: 'Amount'
            }
          ],
          labels: categoryArray.map(c => c.name),
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  font: {
                    family: 'Inter, sans-serif',
                    size: 12
                  },
                  padding: 20
                }
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const value = context.raw;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);

                    return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                  }
                }
              }
            }
          }
        };
      } else {
        // Bar chart
        return {
          type: 'bar',
          datasets: [
            {
              data: categoryArray.map(c => ({ x: c.name, y: c.amount })),
              backgroundColor: categoryArray.map(c =>
                `rgba(${getCategoryColor(c.name, 0.7)})`
              ),
              borderColor: categoryArray.map(c =>
                `rgb(${getCategoryColor(c.name)})`
              ),
              borderWidth: 1,
              borderRadius: 4,
              label: 'Expense Amount'
            }
          ],
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // Horizontal bar chart
            scales: {
              x: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => {
                    return new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      notation: 'compact'
                    }).format(value);
                  }
                }
              },
              y: {
                grid: {
                  display: false
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return formatCurrency(context.raw.y);
                  }
                }
              }
            }
          }
        };
      }
    });


    // Category Trend Data
    const categoryTrendData = computed(() => {
      if (!selectedCategoryForTrend.value) return { datasets: [] };

      // Group by month for the selected category
      const monthlyData = new Map();

      filteredTransactions.value
        .filter(t => t.category === selectedCategoryForTrend.value)
        .forEach(t => {
          const date = new Date(t.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthName = format(date, 'MMM yyyy');

          if (!monthlyData.has(monthKey)) {
            monthlyData.set(monthKey, {
              month: monthName,
              monthKey,
              amount: 0
            });
          }

          const entry = monthlyData.get(monthKey);
          entry.amount += Math.abs(t.amount);
        });

      // Convert to array and sort by date
      const monthlyArray = Array.from(monthlyData.values())
        .sort((a, b) => {
          const [aYear, aMonth] = a.monthKey.split('-').map(Number);
          const [bYear, bMonth] = b.monthKey.split('-').map(Number);
          return (aYear - bYear) || (aMonth - bMonth);
        });

      return {
        type: 'line',
        datasets: [
          {
            label: selectedCategoryForTrend.value,
            data: monthlyArray.map(m => ({ x: m.month, y: m.amount })),
            borderColor: `rgb(${getCategoryColor(selectedCategoryForTrend.value)})`,
            backgroundColor: `rgba(${getCategoryColor(selectedCategoryForTrend.value, 0.1)})`,
            borderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: true
          }
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => {
                  return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    notation: 'compact'
                  }).format(value);
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `${context.dataset.label}: ${formatCurrency(context.raw.y)}`;
                }
              }
            }
          }
        }
      };
    });

    // Category breakdown for the table
    const getCategoryBreakdown = computed(() => {
      const isExpenseView = tableView.value === 'expense';

      // Group by category
      const categoryData = filteredTransactions.value.reduce((acc, t) => {
        // Skip entries that don't match the current view (expense vs income)
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

      // Calculate additional metrics
      const totalAmount = Object.values(categoryData).reduce((sum, cat) => sum + cat.amount, 0);

      // Convert to array and add calculated fields
      const result = Object.values(categoryData).map(cat => {
        cat.avgAmount = cat.count > 0 ? cat.amount / cat.count : 0;
        cat.percentage = totalAmount > 0 ? Math.round((cat.amount / totalAmount) * 100) : 0;
        return cat;
      });

      // Sort by amount descending
      return result.sort((a, b) => b.amount - a.amount);
    });

    // Monthly chart data
    const monthlyOverviewData = computed(() => {
      // Group transactions by month
      const monthlyData = new Map();

      filteredTransactions.value.forEach(t => {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = format(date, 'MMM yyyy');

        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
            month: monthName,
            monthKey,
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

      // Convert to array and sort by date
      const monthlyArray = Array.from(monthlyData.values())
        .sort((a, b) => {
          const [aYear, aMonth] = a.monthKey.split('-').map(Number);
          const [bYear, bMonth] = b.monthKey.split('-').map(Number);
          return (aYear - bYear) || (aMonth - bMonth);
        });

      if (monthlyViewType.value === 'bar') {
        return {
          type: 'bar',
          labels: monthlyArray.map(m => m.month),
          datasets: [
            {
              label: 'Income',
              data: monthlyArray.map(m => m.income),
              backgroundColor: 'rgba(34, 197, 94, 0.7)',
              borderColor: 'rgb(34, 197, 94)',
              borderWidth: 1,
              borderRadius: 4
            },
            {
              label: 'Expenses',
              data: monthlyArray.map(m => m.expense),
              backgroundColor: 'rgba(239, 68, 68, 0.7)',
              borderColor: 'rgb(239, 68, 68)',
              borderWidth: 1,
              borderRadius: 4
            }
          ],
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => {
                    return new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      notation: 'compact'
                    }).format(value);
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                  }
                }
              }
            }
          }
        };
      } else {
        return {
          type: 'line',
          labels: monthlyArray.map(m => m.month),
          datasets: [
            {
              label: 'Income',
              data: monthlyArray.map(m => m.income),
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderWidth: 2,
              pointRadius: 4,
              tension: 0.3,
              fill: true
            },
            {
              label: 'Expenses',
              data: monthlyArray.map(m => m.expense),
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderWidth: 2,
              pointRadius: 4,
              tension: 0.3,
              fill: true
            }
          ],
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => {
                    return new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      notation: 'compact'
                    }).format(value);
                  }
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                  }
                }
              }
            }
          }
        };
      }
    });

    // Savings Rate Data
    const savingsRateData = computed(() => {
      // Group transactions by month
      const monthlyData = new Map();

      filteredTransactions.value.forEach(t => {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = format(date, 'MMM yyyy');

        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
            month: monthName,
            monthKey,
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

      // Calculate savings rate and convert to array
      const monthlyArray = Array.from(monthlyData.values())
        .map(m => {
          const savingsRate = m.income > 0 ? Math.round(((m.income - m.expense) / m.income) * 100) : 0;
          return { ...m, savingsRate };
        })
        .sort((a, b) => {
          const [aYear, aMonth] = a.monthKey.split('-').map(Number);
          const [bYear, bMonth] = b.monthKey.split('-').map(Number);
          return (aYear - bYear) || (aMonth - bMonth);
        });

      return {
        type: 'bar',
        labels: monthlyArray.map(m => m.month),
        datasets: [
          {
            label: 'Savings Rate',
            data: monthlyArray.map(m => m.savingsRate),
            backgroundColor: monthlyArray.map(m =>
              m.savingsRate >= 0 ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'
            ),
            borderColor: monthlyArray.map(m =>
              m.savingsRate >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
            ),
            borderWidth: 1,
            borderRadius: 4
          }
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              ticks: {
                callback: (value) => {
                  return `${value}%`;
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `Savings Rate: ${context.raw}%`;
                }
              }
            }
          }
        }
      };
    });

    // Average Savings Rate
    const averageSavingsRate = computed(() => {
      // Calculate from all monthly data
      const monthlyData = new Map();

      filteredTransactions.value.forEach(t => {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
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

      // Calculate average savings rate
      let totalSavingsRate = 0;
      let monthsWithIncome = 0;

      monthlyData.forEach(m => {
        if (m.income > 0) {
          totalSavingsRate += ((m.income - m.expense) / m.income) * 100;
          monthsWithIncome++;
        }
      });

      return monthsWithIncome > 0 ? Math.round(totalSavingsRate / monthsWithIncome) : 0;
    });

    // Monthly breakdown for the table
    const monthlyBreakdown = computed(() => {
      // Filter for selected year
      const yearTransactions = filteredTransactions.value.filter(t => {
        const date = new Date(t.date);
        return date.getFullYear() === selectedYear.value;
      });

      // Initialize array for all months
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

      // Fill with data
      yearTransactions.forEach(t => {
        const date = new Date(t.date);
        const monthIndex = date.getMonth();

        if (t.amount > 0) {
          months[monthIndex].income += t.amount;
        } else {
          months[monthIndex].expenses += Math.abs(t.amount);
        }
      });

      // Calculate net and savings rate
      months.forEach(month => {
        month.net = month.income - month.expenses;
        month.savingsRate = month.income > 0 ? Math.round((month.net / month.income) * 100) : 0;
      });

      return months;
    });

    // Filter event handlers
    const onExpenseFilterChange = (filter) => {
      // Handle expense chart filter changes
      console.log('Expense filter changed:', filter);
    };

    const onIncomeFilterChange = (filter) => {
      // Handle income chart filter changes
      console.log('Income filter changed:', filter);
    };

    const onNetIncomeFilterChange = (filter) => {
      // Handle net income chart filter changes
      console.log('Net income filter changed:', filter);
    };

    const onComparisonFilterChange = (filter) => {
      // Handle comparison chart filter changes
      console.log('Comparison filter changed:', filter);
    };

    const onCategoryTrendFilterChange = (filter) => {
      // Handle category trend chart filter changes
      console.log('Category trend filter changed:', filter);
    };

    // Watch for changes in selectedCategoryForTrend
    watch(selectedCategoryForTrend, (newValue) => {
      console.log('Selected category changed:', newValue);
    });

    // Watch for changes in selectedYear
    watch(selectedYear, (newValue) => {
      console.log('Selected year changed:', newValue);
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
      // Special handling for net income which can be negative
      const current = netIncome.value;
      const previous = previousPeriodStats.value.net;

      if (previous === 0) return current > 0 ? 100 : (current < 0 ? -100 : 0);

      // If signs are different, it's a special case
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


    // Available categories
    const availableCategories = computed(() => {
      return [...new Set(transactions.value.map(t => t.category))];
    });

    // Available years for filters
    const availableYears = computed(() => {
      const years = [...new Set(transactions.value.map(t =>
        new Date(t.date).getFullYear()
      ))];
      return years.sort((a, b) => b - a); // Sort descending
    });

    // Helper function to generate gradient colors
    const getCategoryColor = (category, alpha = 1) => {
      // Hash the category name to get a consistent color
      let hash = 0;
      for (let i = 0; i < category.length; i++) {
        hash = category.charCodeAt(i) + ((hash << 5) - hash);
      }

      // Generate RGB components
      const r = Math.abs(hash) % 200 + 55; // Avoid too dark/light colors
      const g = Math.abs(hash >> 8) % 200 + 55;
      const b = Math.abs(hash >> 16) % 200 + 55;

      return `${r}, ${g}, ${b}, ${alpha}`;
    };

    // Chart data preparations

    // Expense Trend Data
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
        ],
        options: {
          scales: {
            y: {
              type: 'linear',
              beginAtZero: true,
              ticks: {
                stepSize: 1000,
                maxTicksLimit: 8,
                callback: (value) => {
                  return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    notation: 'compact',
                    maximumFractionDigits: 1
                  }).format(value);
                },
                font: {
                  family: 'Inter, sans-serif',
                  size: 12
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false
              }
            },
            x: {
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'MMM d, yyyy'
                },
                tooltipFormat: 'MMM d, yyyy'
              },
              ticks: {
                font: {
                  family: 'Inter, sans-serif',
                  size: 12
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false
              }
            }
          },
          plugins: {
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleFont: {
                family: 'Inter, sans-serif',
                size: 14
              },
              bodyFont: {
                family: 'Inter, sans-serif',
                size: 13
              },
              padding: 12,
              callbacks: {
                title: (tooltipItems) => {
                  const date = new Date(tooltipItems[0].raw.x);
                  return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                },
                label: (context) => {
                  return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(context.raw.y);
                }
              }
            }
          }
        }
      };
    });

    // Income Trend Data
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
        ],
        options: {
          scales: {
            y: {
              type: 'linear',
              beginAtZero: true,
              ticks: {
                stepSize: 1000,
                maxTicksLimit: 8,
                callback: (value) => {
                  return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    notation: 'compact',
                    maximumFractionDigits: 1
                  }).format(value);
                },
                font: {
                  family: 'Inter, sans-serif',
                  size: 12
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false
              }
            },
            x: {
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'MMM d, yyyy'
                },
                tooltipFormat: 'MMM d, yyyy'
              },
              ticks: {
                font: {
                  family: 'Inter, sans-serif',
                  size: 12
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false
              }
            }
          },
          plugins: {
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleFont: {
                family: 'Inter, sans-serif',
                size: 14
              },
              bodyFont: {
                family: 'Inter, sans-serif',
                size: 13
              },
              padding: 12,
              callbacks: {
                title: (tooltipItems) => {
                  const date = new Date(tooltipItems[0].raw.x);
                  return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                },
                label: (context) => {
                  return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(context.raw.y);
                }
              }
            }
          }
        }
      };
    });

    // Net Income Trend Data
    const netIncomeTrendData = computed(() => {
      // Group transactions by date and calculate net for each date
      const dateMap = new Map();

      filteredTransactions.value.forEach(t => {
        const dateStr = t.date.substring(0, 10); // YYYY-MM-DD format
        const amount = t.amount;

        if (dateMap.has(dateStr)) {
          dateMap.set(dateStr, dateMap.get(dateStr) + amount);
        } else {
          dateMap.set(dateStr, amount);
        }
      });

      // Convert to array of date-net objects and sort by date
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
              // Color point based on positive/negative value
              const value = context.raw.y;
              return value >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)';
            },
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: true
          },
        ],
        options: {
          scales: {
            y: {
              type: 'linear',
              beginAtZero: false, // Allow showing negative values
              ticks: {
                stepSize: 1000,
                maxTicksLimit: 8,
                callback: (value) => {
                  return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    notation: 'compact',
                    maximumFractionDigits: 1
                  }).format(value);
                },
                font: {
                  family: 'Inter, sans-serif',
                  size: 12
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false
              }
            },
            x: {
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'MMM d, yyyy'
                },
                tooltipFormat: 'MMM d, yyyy'
              },
              ticks: {
                font: {
                  family: 'Inter, sans-serif',
                  size: 12
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false
              }
            }
          },
          plugins: {
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleFont: {
                family: 'Inter, sans-serif',
                size: 14
              },
              bodyFont: {
                family: 'Inter, sans-serif',
                size: 13
              },
              padding: 12,
              callbacks: {
                title: (tooltipItems) => {
                  const date = new Date(tooltipItems[0].raw.x);
                  return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                },
                label: (context) => {
                  const value = context.raw.y;
                  const formattedValue = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(value);

                  return `Net: ${formattedValue}`;
                }
              }
            }
          }
        }
      };
    });
    // Top Expense Categories for display
    const topExpenseCategories = computed(() => {
      // Group expenses by category
      const categoryTotals = filteredTransactions.value.reduce((acc, t) => {
        if (t.amount < 0) {
          const category = t.category;
          acc[category] = (acc[category] || 0) + Math.abs(t.amount);
        }
        return acc;
      }, {});

      // Convert to array and sort by amount
      const categoryArray = Object.entries(categoryTotals)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);

      return categoryArray.slice(0, 6); // Show top 6 categories
    });

    
    // Income vs Expense Comparison Data
    const incomeVsExpenseData = computed(() => {
      // Group transactions by month
      const monthlyData = new Map();

      filteredTransactions.value.forEach(t => {
        const date = new Date(t.date);
        // Create the middle of the month date for better positioning
        const monthDate = new Date(date.getFullYear(), date.getMonth(), 15);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = format(date, 'MMM yyyy');

        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
            month: monthName,
            monthKey,
            date: monthDate, // Store the actual date object
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

      // Convert to array and sort by date
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
            yAxisID: 'y1' // Use a secondary y-axis
          }
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time', // Specify that this is a time axis
              time: {
                unit: 'month',
                displayFormats: {
                  month: 'MMM yyyy' // Format as "Jan 2023"
                },
                tooltipFormat: 'MMM yyyy'
              },
              grid: {
                display: false
              }
            },
            y: {
              type: 'linear',
              position: 'left',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Amount ($)',
                font: {
                  family: 'Inter, sans-serif',
                  size: 12
                }
              },
              ticks: {
                callback: (value) => {
                  return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    notation: 'compact'
                  }).format(value);
                }
              }
            },
            y1: {
              type: 'linear',
              position: 'right',
              beginAtZero: false,
              grid: {
                drawOnChartArea: false
              },
              title: {
                display: true,
                text: 'Net ($)',
                font: {
                  family: 'Inter, sans-serif',
                  size: 12
                }
              },
              ticks: {
                callback: (value) => {
                  return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    notation: 'compact'
                  }).format(value);
                }
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: (context) => {
                  const value = context.raw.y;
                  const formattedValue = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(value);

                  return `${context.dataset.label}: ${formattedValue}`;
                }
              }
            }
          }
        }
      };
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
      expenseByCategoryData,
      topExpenseCategories,
      categoryTrendData,
      getCategoryBreakdown,
      monthlyOverviewData,
      savingsRateData,
      averageSavingsRate,
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

I'll help you fix the issue with the date labels being cut off at the bottom of the charts. Looking at both your
YourDashboard component and the LineChart component, I can see several ways to improve this.
The issue is likely related to the chart scaling and margin/padding settings. Here's how we can fix it:
html<!-- Changes for the YourDashboard.vue template -->
<style scoped>
.dashboard-container {
  animation: fadeIn 1s ease-in-out;
  max-width: 100vw;
}

.stat-box {
  animation: popIn 0.5s ease-out;
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

.chart-box {
  transition: all 0.3s ease;
  overflow: hidden;
  break-inside: avoid;
  position: relative;
  /* Add padding at the bottom to account for x-axis labels */
  padding-bottom: 30px;
}

.chart-tabs button {
  transition: all 0.2s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-container {
    padding-bottom: 2rem;
  }

  .chart-tabs {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
  }

  .chart-tabs::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
  }

  .chart-tabs nav {
    padding-bottom: 0.5rem;
  }

  .chart-box {
    min-height: 350px;
    width: 100%;
    margin-bottom: 1.5rem;
    /* More padding for mobile */
    padding-bottom: 40px;
  }

  .charts-container {
    margin-top: 1rem;
    padding: 0.5rem;
  }
}

/* Better chart spacing */
.gap-10 {
  gap: 2.5rem;
}

@media (max-width: 640px) {
  .gap-10 {
    gap: 1.5rem;
  }
}
</style>