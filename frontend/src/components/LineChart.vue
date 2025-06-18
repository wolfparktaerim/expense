<template>
  <div class="line-chart-container relative">
    <!-- Loading State -->
    <div v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-20 rounded-2xl">
      <div class="flex flex-col items-center gap-4">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p class="text-gray-600 font-medium animate-pulse select-none">Loading chart data...</p>
      </div>
    </div>

    <!-- Enhanced Chart Controls -->
    <div
      class="chart-controls mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 shadow-sm">
      <!-- First Row: Time Range and Chart Type -->
      <div class="flex flex-col lg:flex-row gap-4 mb-4">
        <!-- Time Range Filter -->
        <div class="filter-group flex-1">
          <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2 select-none">
            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Time Range
          </label>
          <select v-model="selectedTimeRange" class="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-sm font-medium shadow-sm 
                   focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 
                   transition-all duration-300 hover:border-gray-400" @change="applyFilters">
            <option value="all">🌐 All Time</option>
            <option value="year">📅 This Year</option>
            <option value="6month">📊 Last 6 Months</option>
            <option value="month">🗓️ This Month</option>
            <option value="week">⏰ This Week</option>
          </select>
        </div>

        <!-- Chart Type Toggle -->
        <div class="chart-type-toggle flex-1">
          <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2 select-none">
            <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
              </path>
            </svg>
            Chart Type
          </label>
          <div class="flex rounded-xl border-2 border-gray-300 overflow-hidden bg-white shadow-sm">
            <button @click="toggleChartType('line')"
              class="flex-1 px-4 py-3 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 select-none"
              :class="chartType === 'line'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              Line
            </button>
            <button @click="toggleChartType('bar')"
              class="flex-1 px-4 py-3 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 select-none"
              :class="chartType === 'bar'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                </path>
              </svg>
              Bar
            </button>
          </div>
        </div>
      </div>

      <!-- Second Row: Cumulative Toggle and Category Filter -->
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Cumulative Toggle -->
        <div class="chart-options flex-1">
          <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2 select-none">
            <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
            </svg>
            View Mode
          </label>
          <button @click="toggleCumulative" class="w-full px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 
                   border-2 shadow-sm transform hover:scale-105 flex items-center justify-center gap-2 select-none"
            :class="isCumulative
              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-purple-500 shadow-lg'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400'">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                :d="isCumulative ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'">
              </path>
            </svg>
            {{ isCumulative ? '📈 Cumulative' : '📊 Individual' }}
          </button>
        </div>

        <!-- Category Filter -->
        <div v-if="hasCategories" class="filter-group flex-1">
          <label class="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2 select-none">
            <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
              </path>
            </svg>
            Category
          </label>
          <select v-model="selectedCategory" class="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-sm font-medium shadow-sm 
                   focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 
                   transition-all duration-300 hover:border-gray-400" @change="applyFilters">
            <option value="all">🏷️ All Categories</option>
            <option v-for="category in availableCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Chart Container with Enhanced Styling and Better Layout -->
    <div class="chart-container relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-visible">

      <!-- Chart Canvas with Proper Spacing -->
      <div class="p-4 mr-4">
        <canvas :id="chartId" ref="chartCanvas" class="w-full h-auto block"></canvas>
      </div>

      <!-- No Data State -->
      <div v-if="!hasData"
        class="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
        <div class="text-center p-8">
          <svg class="w-20 h-20 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
            </path>
          </svg>
          <h3 class="text-xl font-bold text-gray-400 mb-2 select-none">No Data Available</h3>
          <p class="text-gray-500 select-none">Add some transactions to see your chart</p>
        </div>
      </div>
    </div>

    <!-- Enhanced Chart Statistics -->
    <div v-if="showDetails && hasData"
      class="chart-details mt-6 p-6 bg-gradient-to-r from-blue-50 via-white to-green-50 rounded-2xl border border-gray-200 shadow-sm">
      <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 select-none">
        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
          </path>
        </svg>
        Chart Statistics
      </h3>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total -->
        <div v-if="chartStats.total"
          class="stat-card bg-white rounded-xl p-4 shadow-sm border border-blue-100 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-bold text-blue-600 uppercase tracking-wide select-none">Total</span>
            <div class="p-1 bg-blue-100 rounded-full">
              <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1">
                </path>
              </svg>
            </div>
          </div>
          <div class="text-xl font-black text-blue-700 ">{{ formatValue(chartStats.total) }}</div>
        </div>

        <!-- Average -->
        <div v-if="chartStats.average"
          class="stat-card bg-white rounded-xl p-4 shadow-sm border border-green-100 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-bold text-green-600 uppercase tracking-wide select-none">Average</span>
            <div class="p-1 bg-green-100 rounded-full">
              <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z">
                </path>
              </svg>
            </div>
          </div>
          <div class="text-xl font-black text-green-700">{{ formatValue(chartStats.average) }}</div>
        </div>

        <!-- Highest -->
        <div v-if="chartStats.max"
          class="stat-card bg-white rounded-xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-bold text-orange-600 uppercase tracking-wide select-none">Highest</span>
            <div class="p-1 bg-orange-100 rounded-full">
              <svg class="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>
          <div class="text-xl font-black text-orange-700">{{ formatValue(chartStats.max) }}</div>
          <div class="text-xs text-orange-600 font-medium mt-1">{{ chartStats.maxDate }}</div>
        </div>

        <!-- Lowest -->
        <div v-if="chartStats.min"
          class="stat-card bg-white rounded-xl p-4 shadow-sm border border-red-100 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-bold text-red-600 uppercase tracking-wide select-none">Lowest</span>
            <div class="p-1 bg-red-100 rounded-full">
              <svg class="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6 6"></path>
              </svg>
            </div>
          </div>
          <div class="text-xl font-black text-red-700">{{ formatValue(chartStats.min) }}</div>
          <div class="text-xs text-red-600 font-medium mt-1">{{ chartStats.minDate }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, onBeforeUnmount, watch, computed } from "vue";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { addDays, subMonths, subWeeks, startOfYear, startOfMonth, startOfWeek, format } from "date-fns";

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    showDetails: {
      type: Boolean,
      default: true
    },
    hasCategories: {
      type: Boolean,
      default: false
    },
    availableCategories: {
      type: Array,
      default: () => []
    }
  },
  emits: ['filter-changed'],
  setup(props, { emit }) {
    const chartCanvas = ref(null);
    const loading = ref(false);
    const chartType = ref('line');
    const isCumulative = ref(false);
    const selectedTimeRange = ref('all');
    const selectedCategory = ref('all');

    // Check if chart has data
    const hasData = computed(() => {
      return props.data &&
        props.data.datasets &&
        props.data.datasets.length > 0 &&
        props.data.datasets[0].data &&
        props.data.datasets[0].data.length > 0;
    });

    // Computed statistics for the current chart data
    const chartStats = computed(() => {
      if (!hasData.value) {
        return {};
      }

      const dataset = props.data.datasets[0];
      if (!dataset.data || dataset.data.length === 0) return {};

      const values = dataset.data.map(d => d.y);
      const total = values.reduce((sum, val) => sum + val, 0);
      const average = total / values.length;

      const maxValue = Math.max(...values);
      const minValue = Math.min(...values);
      const maxIndex = values.indexOf(maxValue);
      const minIndex = values.indexOf(minValue);

      const maxDate = maxIndex >= 0 ? format(new Date(dataset.data[maxIndex].x), 'MMM d, yyyy') : '';
      const minDate = minIndex >= 0 ? format(new Date(dataset.data[minIndex].x), 'MMM d, yyyy') : '';

      return {
        total,
        average,
        max: maxValue,
        min: minValue,
        maxDate,
        minDate
      };
    });

    // Format currency value or standard number
    const formatValue = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    };

    // Filter data based on selected time range and category
    const filterData = (baseData) => {
      if (!baseData || !baseData.datasets || baseData.datasets.length === 0) {
        return baseData;
      }

      const result = JSON.parse(JSON.stringify(baseData)); // Deep clone

      // Apply time filters
      result.datasets.forEach(dataset => {
        let filteredData = [...dataset.data];

        if (selectedTimeRange.value !== 'all') {
          const now = new Date();
          let cutoffDate;

          switch (selectedTimeRange.value) {
            case 'year':
              cutoffDate = startOfYear(now);
              break;
            case '6month':
              cutoffDate = subMonths(now, 6);
              break;
            case 'month':
              cutoffDate = startOfMonth(now);
              break;
            case 'week':
              cutoffDate = startOfWeek(now);
              break;
            default:
              cutoffDate = null;
          }

          if (cutoffDate) {
            filteredData = filteredData.filter(item => new Date(item.x) >= cutoffDate);
          }
        }

        // Apply category filter if applicable
        if (props.hasCategories && selectedCategory.value !== 'all' && dataset.categoryData) {
          filteredData = filteredData.filter(item => {
            const matchingCategoryItem = dataset.categoryData.find(catItem =>
              new Date(catItem.date).getTime() === new Date(item.x).getTime() &&
              catItem.category === selectedCategory.value
            );
            return !!matchingCategoryItem;
          });
        }

        // Apply cumulative calculation if needed
        if (isCumulative.value && filteredData.length > 0) {
          filteredData.sort((a, b) => new Date(a.x) - new Date(b.x));

          let runningTotal = 0;
          filteredData = filteredData.map(item => {
            runningTotal += item.y;
            return {
              x: item.x,
              y: runningTotal
            };
          });
        }

        dataset.data = filteredData;
      });

      return result;
    };

    const applyFilters = () => {
      updateChart();
      emit('filter-changed', {
        timeRange: selectedTimeRange.value,
        category: selectedCategory.value,
        chartType: chartType.value,
        isCumulative: isCumulative.value
      });
    };

    const toggleChartType = (type) => {
      chartType.value = type;
      updateChart();
    };

    const toggleCumulative = () => {
      isCumulative.value = !isCumulative.value;
      updateChart();
    };

    const updateChart = () => {
      if (!chartCanvas.value || !hasData.value) return;

      if (!chartInstance) {
        initializeChart();
        return;
      }

      loading.value = true;

      try {
        setTimeout(() => {
          try {
            const filteredData = filterData(props.data);

            // Check if chart still exists
            if (!chartInstance) {
              initializeChart();
              return;
            }

            chartInstance.data.datasets = filteredData.datasets;

            // Update chart type
            chartInstance.config.type = chartType.value;

            // Update chart options for different types
            if (chartType.value === 'bar') {
              chartInstance.options.scales.x.stacked = false;
              chartInstance.options.scales.y.stacked = false;

              chartInstance.data.datasets.forEach(dataset => {
                dataset.backgroundColor = dataset.borderColor;
                dataset.borderWidth = 1;
                dataset.borderRadius = 6;
                dataset.borderSkipped = false;
              });
            } else {
              chartInstance.data.datasets.forEach(dataset => {
                dataset.backgroundColor = dataset.backgroundColor || 'rgba(75, 192, 192, 0.2)';
                dataset.borderWidth = 3;
                dataset.pointRadius = 5;
                dataset.pointHoverRadius = 8;
                dataset.tension = 0.4;
              });
            }

            chartInstance.update('none');
            loading.value = false;
          } catch (error) {
            console.error('Error updating chart:', error);
            cleanupChart();
            initializeChart();
          }
        }, 100);
      } catch (error) {
        console.error('Error in updateChart:', error);
        loading.value = false;
      }
    };

    const getResponsiveChartOptions = () => {
      const isMobile = window.innerWidth <= 768;
      const isVerySmall = window.innerWidth <= 480;

      const bottomPadding = isVerySmall ? 60 : (isMobile ? 50 : 40);
      const leftPadding = isMobile ? 15 : 10;
      const rightPadding = isMobile ? 15 : 10;
      const topPadding = 20;
      const maxTicksLimit = isVerySmall ? 4 : (isMobile ? 6 : 12);
      const labelRotation = isVerySmall ? 45 : 0;
      const yAxisPadding = isMobile ? 25 : 15;

      return {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart',
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: (props.data?.datasets?.length || 0) > 1,
            position: 'top',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              boxHeight: 8,
              padding: 20,
              font: {
                family: "'Inter', sans-serif",
                size: isMobile ? 11 : 13,
                weight: '600'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            padding: 16,
            cornerRadius: 12,
            titleFont: {
              family: "'Inter', sans-serif",
              size: 15,
              weight: 'bold'
            },
            bodyFont: {
              family: "'Inter', sans-serif",
              size: 13,
              weight: '500'
            },
            boxPadding: 6,
            usePointStyle: true,
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
                const value = formatValue(context.raw.y);
                return `${context.dataset.label}: ${value}`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            grid: {
              display: !isVerySmall,
              color: 'rgba(0, 0, 0, 0.04)',
              tickColor: 'rgba(0, 0, 0, 0.1)',
              drawBorder: false
            },
            border: {
              display: false
            },
            ticks: {
              font: {
                family: "'Inter', sans-serif",
                size: isMobile ? 10 : 12,
                weight: '500'
              },
              color: 'rgba(0, 0, 0, 0.7)',
              maxRotation: labelRotation,
              minRotation: labelRotation,
              autoSkip: true,
              maxTicksLimit: maxTicksLimit,
              padding: isMobile ? 15 : 12
            },
            time: {
              unit: 'day',
              displayFormats: {
                day: isVerySmall ? 'MMM d' : 'MMM d, yyyy'
              },
              tooltipFormat: 'MMM d, yyyy'
            },
            offset: true
          },
          y: {
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.04)',
              tickColor: 'rgba(0, 0, 0, 0.1)',
              drawBorder: false
            },
            border: {
              display: false
            },
            position: 'left',
            ticks: {
              font: {
                family: "'Inter', sans-serif",
                size: isMobile ? 10 : 12,
                weight: '500'
              },
              color: 'rgba(0, 0, 0, 0.7)',
              padding: yAxisPadding,
              callback: function (value) {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  notation: isVerySmall ? 'compact' : 'standard',
                  maximumFractionDigits: 0
                }).format(value);
              },
              maxTicksLimit: isMobile ? 6 : 8
            },
            beginAtZero: true
          }
        },
        layout: {
          padding: {
            left: leftPadding,
            right: rightPadding,
            top: topPadding,
            bottom: bottomPadding
          }
        }
      };
    };

    const chartId = ref(`chart-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
    let chartInstance = null;
    let destroyInProgress = false;

    const cleanupChart = () => {
      if (destroyInProgress) return;

      if (chartInstance) {
        destroyInProgress = true;
        try {
          chartInstance.destroy();
        } catch (error) {
          console.error('Error destroying chart:', error);
        } finally {
          chartInstance = null;
          destroyInProgress = false;
        }
      }
    };

    const initializeChart = () => {
      cleanupChart();

      setTimeout(() => {
        if (!chartCanvas.value || !hasData.value) return;

        try {
          const ctx = chartCanvas.value.getContext("2d");
          if (!ctx) return;

          const filteredData = filterData(props.data);
          const chartOptions = getResponsiveChartOptions();

          chartInstance = new Chart(ctx, {
            type: chartType.value,
            data: {
              datasets: filteredData.datasets
            },
            options: chartOptions
          });

          loading.value = false;
        } catch (error) {
          console.error('Error creating chart:', error);
          loading.value = false;
        }
      }, 100);
    };

    // Debounced resize handler
    let resizeTimeout = null;
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = setTimeout(() => {
        if (chartInstance) {
          chartInstance.resize();
        }
      }, 300);
    };

    // Watch for data changes
    watch(() => props.data, (newData) => {
      if (newData && newData.datasets && newData.datasets.length > 0) {
        cleanupChart();
        setTimeout(() => {
          initializeChart();
        }, 100);
      }
    }, { deep: true });

    onMounted(() => {
      setTimeout(() => {
        if (hasData.value) {
          initializeChart();
        }
      }, 200);

      window.addEventListener('resize', handleResize);
    });

    onBeforeUnmount(() => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      cleanupChart();
      window.removeEventListener('resize', handleResize);
    });

    return {
      chartCanvas,
      loading,
      chartType,
      isCumulative,
      selectedTimeRange,
      selectedCategory,
      chartStats,
      hasData,
      formatValue,
      applyFilters,
      toggleChartType,
      toggleCumulative,
      chartId
    };
  },
};
</script>

<style scoped>
.line-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 450px;
  margin-bottom: 20px;
}

.chart-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart-details {
  border-radius: 1rem;
}

.stat-card {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-card:hover {
  transform: translateY(-2px);
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: .5;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .line-chart-container {
    min-height: 450px;
  }

  .chart-container {
    height: 400px;
    margin-bottom: 30px;
  }

  .chart-controls {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .chart-details {
    margin-top: 1.5rem;
    padding: 1rem;
  }

  .stat-card {
    padding: 0.75rem;
  }

  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .line-chart-container {
    min-height: 400px;
  }

  .chart-container {
    height: 350px;
    margin-bottom: 40px;
  }

  .chart-controls {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .chart-details {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .stat-card {
    padding: 0.5rem;
  }
}

/* Enhanced button styles */
button {
  transition: all 0.2s ease;
}

button:active {
  transform: scale(0.98);
}

button:focus {
  outline: none;
}

/* Select dropdown enhancements */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

select:focus {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%233b82f6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
}

/* Gradient backgrounds */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Custom scrollbar for mobile */
.chart-controls::-webkit-scrollbar {
  display: none;
}

.chart-controls {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>