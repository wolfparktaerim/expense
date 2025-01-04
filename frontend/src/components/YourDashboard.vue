<template>
    <div class="dashboard-container p-6">

        <!-- Header -->
        <div class="p-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-md shadow-lg mb-6">
            <h1 class="text-4xl font-extrabold text-center text-white">Your Da<span
                    class="text-green-700">$</span>hboard</h1>
        </div>

        <!-- Statistic Boxes -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-4">
            <div
                class="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col space-y-4 hover:bg-blue-100 transition-all duration-300 ease-in-out group">
                <h3 class="text-blue-600 text-sm font-medium uppercase tracking-wider">Total Expense</h3>
                <h1 class="text-blue-700 text-4xl font-bold group-hover:scale-105 transition-transform pb-5">
                    {{ formatCurrency(totalExpense) }}
                </h1>
            </div>

            <div
                class="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex flex-col space-y-4 hover:bg-emerald-100 transition-all duration-300 ease-in-out group">
                <h3 class="text-emerald-600 text-sm font-medium uppercase tracking-wider">Total Income</h3>
                <h1 class="text-emerald-700 text-4xl font-bold group-hover:scale-105 transition-transform pb-5">
                    {{ formatCurrency(totalIncome) }}
                </h1>
            </div>

            <div
                class="bg-amber-50 border border-amber-100 rounded-xl p-6 flex flex-col space-y-4 hover:bg-amber-100 transition-all duration-300 ease-in-out group">
                <h3 class="text-amber-600 text-sm font-medium uppercase tracking-wider">Net Income</h3>
                <h1 class="text-amber-700 text-4xl font-bold group-hover:scale-105 transition-transform pb-5">
                    {{ formatCurrency(netExpense) }}
                </h1>
            </div>

            <div
                class="bg-rose-50 border border-rose-100 rounded-xl p-6 flex flex-col space-y-4 hover:bg-rose-100 transition-all duration-300 ease-in-out group">
                <h3 class="text-rose-600 text-sm font-medium uppercase tracking-wider">Most Spent Category</h3>
                <h1 class="text-rose-700 text-4xl font-bold group-hover:scale-105 transition-transform pb-5">
                    {{ mostSpentCategory }}
                </h1>
            </div>
        </div>

        <!-- Chart and Graph -->
        <div class="charts-container mt-10">
            <div class="flex flex-col lg:flex-row gap-6">
                <!-- Expense Trend Chart -->
                <div
                    class="chart-box bg-white p-6 rounded-lg shadow-lg flex-1 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-100">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-red-800 font-sans tracking-tight">Expense Trend</h2>
                        <div class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                            Expenses
                        </div>
                    </div>
                    <div class="h-[400px] relative">
                        <line-chart v-if="expenseTrendData.datasets.length > 0" :data="expenseTrendData"
                            class="transition-opacity duration-300" />
                        <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
                            No expense data available
                        </div>
                    </div>
                </div>

                <!-- Income Trend Chart -->
                <div
                    class="chart-box bg-white p-6 rounded-lg shadow-lg flex-1 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-100">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-green-800 font-sans tracking-tight">Income Trend</h2>
                        <div class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                            Income
                        </div>
                    </div>
                    <div class="h-[400px] relative">
                        <line-chart v-if="incomeTrendData.datasets.length > 0" :data="incomeTrendData"
                            class="transition-opacity duration-300" />
                        <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
                            No income data available
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { userTransactions } from "../stores/transactions";
import LineChart from "../components/LineChart.vue"; // Reusable line chart component

export default {
    components: { LineChart },
    setup() {
        const transactions = ref([]);
        const store = userTransactions();

        // Fetch transactions on mount
        onMounted(async () => {
            await store.loadTransactions(); // Ensure this fetches data
            transactions.value = store.transactions;
            console.log('Loaded transactions from "YourDashboard.vue":', transactions.value);
        });

        // Computed values for dashboard metrics
        const totalExpense = computed(() =>
            transactions.value
                .filter((t) => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        );

        const totalIncome = computed(() =>
            transactions.value
                .filter((t) => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0)
        );

        const netExpense = computed(() => totalIncome.value - totalExpense.value);

        const mostSpentCategory = computed(() => {
            const categoryTotals = transactions.value.reduce((acc, t) => {
                if (t.amount < 0) {
                    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
                }
                return acc;
            }, {});
            const [maxCategory] = Object.entries(categoryTotals).sort(
                (a, b) => b[1] - a[1]
            )[0] || ["None", 0];
            return maxCategory;
        });

        // Format currency 
        const formatCurrency = (value) =>
            new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(value);

        // Trend chart data
        const expenseTrendData = computed(() => {
            const sortedData = transactions.value
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
                        pointRadius: 6,
                        pointHoverRadius: 8,
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
                                color: 'rgba(0, 0, 0, 0.1)',
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
                                tooltipFormat: 'MMM d, yyyy' // This removes the time from tooltips
                            },
                            ticks: {
                                font: {
                                    family: 'Inter, sans-serif',
                                    size: 12
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
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
                                    // Format the date without time
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

        // Make similar updates for incomeTrendData
        const incomeTrendData = computed(() => {
            const sortedData = transactions.value
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
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        tension: 0.3,
                        fill: true
                    },
                ],
                options: {
                    // Copy the same options configuration from expenseTrendData
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
                                color: 'rgba(0, 0, 0, 0.1)',
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
                                color: 'rgba(0, 0, 0, 0.1)',
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

        return {
            transactions,
            totalExpense,
            totalIncome,
            netExpense,
            mostSpentCategory,
            expenseTrendData,
            incomeTrendData,
            formatCurrency,
        };
    },
};
</script>

<style scoped>
.dashboard-container {
    animation: fadeIn 1s ease-in-out;
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
</style>