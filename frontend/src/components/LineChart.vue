<template>
    <div class="line-chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import { onMounted, ref, onBeforeUnmount, watch } from "vue";
  import Chart from "chart.js/auto";
  import "chartjs-adapter-date-fns"; // Import date adapter
  
  export default {
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const chartCanvas = ref(null);
        let chartInstance = null;

        const initializeChart = () => {
            if (chartCanvas.value) {
                const ctx = chartCanvas.value.getContext("2d");
                if (ctx) {
                    if (props.data && props.data.datasets && props.data.datasets.length > 0) {
                        // Merge default options with provided options
                        const chartOptions = {
                            responsive: true,
                            maintainAspectRatio: false,
                            ...props.data.options // Merge with provided options
                        };

                        chartInstance = new Chart(ctx, {
                            type: "line",
                            data: {
                                datasets: props.data.datasets
                            },
                            options: chartOptions
                        });
                    }
                }
            }
        };

        // Watch for data changes
        watch(
            () => props.data,
            (newData) => {
                if (chartInstance) {
                    chartInstance.data.datasets = newData.datasets;
                    chartInstance.options = {
                        ...chartInstance.options,
                        ...newData.options
                    };
                    chartInstance.update();
                } else {
                    initializeChart();
                }
            },
            { deep: true }
        );

        onMounted(() => {
            initializeChart();
        });

        onBeforeUnmount(() => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        });

        return {
            chartCanvas,
        };
    },
};
  </script>
  
  <style scoped>
  .line-chart-container {
    position: relative;
    width: 100%;
    height: 400px;
  }
  </style> 