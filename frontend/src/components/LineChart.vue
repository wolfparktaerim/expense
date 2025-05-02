<template>
  <div class="line-chart-container">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
      <div class="animate-pulse text-gray-500">Loading chart data...</div>
    </div>
    <div class="chart-controls mb-4 flex flex-wrap gap-2">
      <div class="filter-group">
        <select v-model="selectedTimeRange"
          class="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="applyFilters">
          <option value="all">All Time</option>
          <option value="year">This Year</option>
          <option value="6month">Last 6 Months</option>
          <option value="month">This Month</option>
          <option value="week">This Week</option>
        </select>
      </div>

      <div class="chart-type-toggle ml-2">
        <button @click="toggleChartType('line')"
          class="px-3 py-2 bg-white border border-gray-300 rounded-l-md text-sm hover:bg-gray-50"
          :class="{ 'bg-blue-100 text-blue-700 border-blue-300': chartType === 'line' }">
          Line
        </button>
        <button @click="toggleChartType('bar')"
          class="px-3 py-2 bg-white border border-gray-300 rounded-r-md text-sm hover:bg-gray-50 border-l-0"
          :class="{ 'bg-blue-100 text-blue-700 border-blue-300': chartType === 'bar' }">
          Bar
        </button>
      </div>

      <div class="chart-options ml-2">
        <button @click="toggleCumulative"
          class="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          :class="{ 'bg-green-100 text-green-700 border-green-300': isCumulative }">
          {{ isCumulative ? 'Cumulative' : 'Individual' }}
        </button>
      </div>

      <div v-if="hasCategories" class="ml-auto">
        <select v-model="selectedCategory"
          class="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          @change="applyFilters">
          <option value="all">All Categories</option>
          <option v-for="category in availableCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </div>

    <div class="chart-container relative">
      <canvas :id="chartId" ref="chartCanvas"></canvas>
    </div>

    <div class="chart-details mt-4 text-sm text-gray-500" v-if="showDetails">
      <div v-if="chartStats.average" class="stat-item">
        Average: {{ formatValue(chartStats.average) }}
      </div>
      <div v-if="chartStats.total" class="stat-item">
        Total: {{ formatValue(chartStats.total) }}
      </div>
      <div v-if="chartStats.max" class="stat-item">
        Highest: {{ formatValue(chartStats.max) }} ({{ chartStats.maxDate }})
      </div>
      <div v-if="chartStats.min" class="stat-item">
        Lowest: {{ formatValue(chartStats.min) }} ({{ chartStats.minDate }})
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, onBeforeUnmount, watch, computed } from "vue";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns"; // Import date adapter
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


    // Computed statistics for the current chart data
    const chartStats = computed(() => {
      if (!props.data || !props.data.datasets || props.data.datasets.length === 0) {
        return {};
      }

      // Get values from the first dataset
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
      if (!chartCanvas.value) return;

      if (!chartInstance) {
        initializeChart();
        return;
      }

      loading.value = true;

      try {
        setTimeout(() => {
          try {
            const filteredData = filterData(props.data);

            // Check if chart still exists (could have been destroyed during timeout)
            if (!chartInstance) {
              initializeChart();
              return;
            }

            chartInstance.data.datasets = filteredData.datasets;

            // Update chart type
            chartInstance.config.type = chartType.value;

            // Update chart options
            if (chartType.value === 'bar') {
              // Adjust options specific to bar charts
              chartInstance.options.scales.x.stacked = false;
              chartInstance.options.scales.y.stacked = false;

              chartInstance.data.datasets.forEach(dataset => {
                dataset.backgroundColor = dataset.borderColor;
                dataset.borderWidth = 1;
              });
            } else {
              // Reset line chart defaults
              chartInstance.data.datasets.forEach(dataset => {
                dataset.backgroundColor = dataset.backgroundColor || 'rgba(75, 192, 192, 0.2)';
                dataset.borderWidth = 2;
              });
            }

            chartInstance.update();
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
      // Calculate responsive values based on screen size
      const isMobile = window.innerWidth <= 768;
      const isVerySmall = window.innerWidth <= 480;

      // Determine appropriate settings based on screen size
      const bottomPadding = isVerySmall ? 70 : (isMobile ? 50 : 30);
      const leftPadding = isMobile ? 15 : 10;
      const rightPadding = isMobile ? 15 : 10;
      const maxTicksLimit = isVerySmall ? 4 : (isMobile ? 6 : 12);
      const labelRotation = isVerySmall ? 50 : 45;
      const yAxisPadding = isMobile ? 25 : 10;

      return {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 800,
          easing: 'easeOutQuart',
        },
        plugins: {
          legend: {
            display: (props.data?.datasets?.length || 0) > 1,
            position: 'top',
            labels: {
              usePointStyle: true,
              boxWidth: 6,
              font: {
                family: "'Inter', sans-serif",
                size: isMobile ? 10 : 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            padding: 12,
            titleFont: {
              family: "'Inter', sans-serif",
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              family: "'Inter', sans-serif",
              size: 12
            },
            cornerRadius: 6,
            boxPadding: 4
          }
        },
        scales: {
          x: {
            type: 'time',  // Make sure this is explicitly set
            grid: {
              display: !isMobile,
              color: 'rgba(0, 0, 0, 0.05)',
              tickColor: 'rgba(0, 0, 0, 0.15)'
            },
            border: {
              display: true,
              width: 1,
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              font: {
                family: "'Inter', sans-serif",
                size: isMobile ? 9 : 11
              },
              color: 'rgba(0, 0, 0, 0.6)',
              maxRotation: labelRotation,
              minRotation: labelRotation,
              autoSkip: true,
              maxTicksLimit: maxTicksLimit,
              padding: isMobile ? 12 : 8
            },
            // Add these time options to control date formatting
            time: {
              unit: 'day',
              displayFormats: {
                day: 'MMM d, yyyy'  // Format as "Jan 1, 2023"
              },
              tooltipFormat: 'MMM d, yyyy'
            },
            offset: true
          },
          y: {
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)',
              tickColor: 'rgba(0, 0, 0, 0.15)'
            },
            border: {
              display: true,
              width: 1,
              color: 'rgba(0, 0, 0, 0.1)'
            },
            position: 'left',
            ticks: {
              font: {
                family: "'Inter', sans-serif",
                size: isMobile ? 9 : 11
              },
              color: 'rgba(0, 0, 0, 0.6)',
              padding: yAxisPadding, // Add padding for y-axis labels
              callback: function (value) {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  notation: 'compact',
                  maximumFractionDigits: 1
                }).format(value);
              },
              maxTicksLimit: isMobile ? 6 : 8 // Fewer ticks on mobile
            },
            beginAtZero: true
          }
        },
        // Increase overall padding
        layout: {
          padding: {
            left: leftPadding,
            right: rightPadding,
            top: 10,
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
      // Clean up first
      cleanupChart();

      // Wait for DOM to be ready and prevent race conditions
      setTimeout(() => {
        if (!chartCanvas.value) return;

        try {
          const ctx = chartCanvas.value.getContext("2d");
          if (!ctx) return;

          if (!props.data || !props.data.datasets || props.data.datasets.length === 0) return;

          // Filter data based on current settings
          const filteredData = filterData(props.data);

          // Generate responsive options
          const chartOptions = getResponsiveChartOptions();

          // Create the new chart instance
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
      }, 50);
    };

    // Debounced resize handler
    let resizeTimeout = null;
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = setTimeout(() => {
        cleanupChart();
        initializeChart();
      }, 300);
    };

    // Watch for data changes
    watch(() => props.data, (newData) => {
      if (newData && newData.datasets) {
        // Cleanup first
        cleanupChart();

        // Then initialize 
        setTimeout(() => {
          initializeChart();
        }, 50);
      }
    }, { deep: true });

    onMounted(() => {
      // Wait for DOM to be ready
      setTimeout(() => {
        initializeChart();
      }, 100);

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
      formatValue,
      applyFilters,
      toggleChartType,
      toggleCumulative
    };
  },
};
</script>

<style scoped>
.line-chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 350px;
  margin-bottom: 40px;
}

.chart-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 16px;
}

.chart-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 0.375rem;
  background-color: rgba(0, 0, 0, 0.025);
  margin-top: 10px;
}

.stat-item {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 120px;
}

@media (max-width: 768px) {
  .line-chart-container {
    min-height: 350px;
  }

  .chart-container {
    height: 300px;
    margin-bottom: 60px;
  }

  .chart-details {
    margin-top: 20px;
    gap: 0.75rem;
  }

  .chart-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 20px;
  }

  .chart-controls>div {
    width: 100%;
    margin-left: 0 !important;
  }

  .stat-item {
    min-width: 0;
    width: calc(50% - 0.5rem);
  }
}

@media (max-width: 480px) {
  .line-chart-container {
    min-height: 300px;
  }

  .chart-container {
    height: 250px;
    margin-bottom: 80px;
  }

  .chart-details {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
    font-size: 0.75rem;
  }

  .stat-item {
    width: 100%;
  }
}
</style>