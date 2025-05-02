<template>
    <div class="generator-container shadow-lg overflow-hidden bg-white max-w-6xl mx-auto">
        <!-- Header with improved gradient and spacing -->
        <div class="p-8 bg-gradient-to-r from-blue-600 to-green-500 shadow-lg">
            <h1 class="text-3xl md:text-4xl font-extrabold text-center text-white tracking-tight drop-shadow-md">
                Generate <span class="text-green-200 animate-pulse">$</span>tatement Report
            </h1>
        </div>

        <!-- Filters Section - redesigned with better spacing and visual hierarchy -->
        <div class="p-8 bg-gray-50 border-b border-gray-200">
            <div class="max-w-4xl mx-auto">
                <h2 class="text-xl font-semibold text-gray-700 mb-6">Report Filters</h2>

                <div class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label for="type" class="block text-sm font-medium text-gray-700">Report Type</label>
                            <div class="relative">
                                <select id="type" v-model="filters.type" @change="updateCategories" class="appearance-none w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 
                                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-gray-400 
                                        transition-colors duration-200">
                                    <option value="all">All Transactions</option>
                                    <option value="income">Income Only</option>
                                    <option value="expense">Expenses Only</option>
                                </select>
                                <div
                                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                            <div class="relative">
                                <select id="category" v-model="filters.category" class="appearance-none w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 
                                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-gray-400 
                                        transition-colors duration-200">
                                    <option value="">All Categories</option>
                                    <option v-for="category in categories" :key="category" :value="category">
                                        {{ category }}
                                    </option>
                                </select>
                                <div
                                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <input type="date" id="startDate" v-model="filters.startDate" class="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 
                                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-gray-400 
                                        transition-colors duration-200" />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label for="endDate" class="block text-sm font-medium text-gray-700">End Date</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <input type="date" id="endDate" v-model="filters.endDate" class="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 
                                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-gray-400 
                                        transition-colors duration-200" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Button - Centered with improved styling -->
                <div class="flex justify-center mt-8">
                    <button @click="generateReport" class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold 
                            rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Generate Report
                    </button>
                </div>
            </div>
        </div>

        <!-- Report Preview Section with improved table styling -->
        <div v-if="generatedReport.length > 0" class="p-8">
            <div class="report-preview max-w-4xl mx-auto">
                <div class="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                    <!-- Report Header -->
                    <div class="bg-gray-50 p-6 border-b border-gray-200">
                        <h2 class="text-2xl font-bold text-center text-gray-800">{{ reportTitle }}</h2>
                        <p class="text-center text-sm text-gray-600 mt-3" v-if="filters.startDate && filters.endDate">
                            <span class="font-medium">Period:</span> {{ filters.startDate }} to {{ filters.endDate }}
                        </p>
                    </div>

                    <!-- Report Data -->
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th
                                        class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Activity
                                    </th>
                                    <th
                                        class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Category
                                    </th>
                                    <th
                                        class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Date
                                    </th>
                                    <th
                                        class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="transaction in generatedReport" :key="transaction.id"
                                    class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                        {{ transaction.activity }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {{ transaction.category }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {{ transaction.date }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium"
                                        :class="transaction.amount < 0 ? 'text-red-600' : 'text-green-600'">
                                        {{ formattedCurrency(transaction.amount) }}
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot class="bg-gray-50">
                                <tr>
                                    <td colspan="3" class="px-6 py-4 text-right text-sm font-bold text-gray-700">
                                        {{ filters.type !== 'all' ?
                                            `Total ${filters.type === 'expense' ? 'Expense' : 'Income'}:` : 'Net Income:' }}
                                    </td>
                                    <td class="px-6 py-4 text-right text-sm font-bold" :class="filters.type === 'expense' || (filters.type === 'all' && netIncome < 0) ?
                                        'text-red-600' : 'text-green-600'">
                                        {{ formattedCurrency(filters.type !== 'all' ? totalAmount : netIncome) }}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Export Buttons with improved layout and styling -->
            <div class="max-w-4xl mx-auto mt-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button @click="exportToPDF"
                        class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold 
                            rounded-lg shadow-md hover:shadow-lg hover:from-red-600 hover:to-pink-600 transform hover:-translate-y-0.5 
                            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Export to PDF
                    </button>

                    <button @click="exportToExcel"
                        class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold 
                            rounded-lg shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 transform hover:-translate-y-0.5 
                            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export to Excel
                    </button>

                    <button @click="exportToImg"
                        class="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold 
                            rounded-lg shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-purple-700 transform hover:-translate-y-0.5 
                            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Export to Image
                    </button>
                </div>
            </div>
        </div>

        <!-- Empty state with better presentation -->
        <div v-else-if="pressed"
            class="p-16 flex flex-col items-center justify-center bg-gray-50 border-t border-gray-200">
            <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="text-xl font-medium text-gray-700 mb-2">No transactions found</h3>
            <p class="text-gray-500 text-center max-w-md">
                No transactions match your current filter criteria. Try adjusting your filters or adding new
                transactions.
            </p>
        </div>

        <!-- Bottom space -->
        <div class="h-8"></div>
    </div>
</template>

<script>
import { userTransactions } from "../stores/transactions.js";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';

export default {
    data() {
        return {
            filters: {
                type: "all",
                startDate: "",
                endDate: "",
                category: "",
                amountLower: '',
                amountHigher: '',
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
                // All transactions: Include all unique categories
                this.categories = Array.from(new Set(this.transactions.map((t) => t.category)));
            } else if (type === "income") {
                // Income transactions: Amount > 0
                this.categories = Array.from(
                    new Set(this.transactions.filter((t) => t.amount > 0).map((t) => t.category))
                );
            } else if (type === "expense") {
                // Expense transactions: Amount < 0
                this.categories = Array.from(
                    new Set(this.transactions.filter((t) => t.amount < 0).map((t) => t.category))
                );
            }
        },
        generateReport() {
            const { startDate, endDate, category, type } = this.filters;
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
                return matchesType && matchesDate && matchesCategory;
            });

            // Calculate totalAmount from the filtered generatedReport
            this.totalAmount = Math.abs(
                this.generatedReport.reduce(
                    (sum, t) => sum + t.amount,
                    0
                )
            )

            // FIXED VERSION: Calculate net income from filtered data
            // Use the already filtered generatedReport instead of filtering transactions again
            const filteredIncome = this.generatedReport
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0);

            const filteredExpense = this.generatedReport
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);

            // Net income calculation remains the same
            this.netIncome = filteredIncome - filteredExpense;
        },

        async exportToPDF() {
            const pdf = new jsPDF("p", "mm", "a4");

            // Title
            pdf.setFontSize(16);
            pdf.text(this.reportTitle, 105, 20, { align: "center" });

            // Start Date and End Date
            pdf.setFontSize(12);
            if (this.filters.startDate && this.filters.endDate) {
                pdf.text(
                    `Start Date: ${this.filters.startDate}   End Date: ${this.filters.endDate}`,
                    105,
                    30,
                    { align: "center" }
                );
            } else {
                pdf.text(
                    ` `,
                    105,
                    30,
                    { align: "center" }
                );
            }

            autoTable(pdf, {
                head: [["Activity", "Category", "Date", "Amount"]],
                body: this.generatedReport.map((t) => [
                    t.activity,
                    t.category,
                    t.date,
                    this.formattedCurrency(t.amount),
                ]),
                startY: 40,
            });

            if (this.filters.type !== "all") {
                pdf.text(`Total ${this.filters.type === "expense" ? "Expense" : "Income"}: ${this.formattedCurrency(this.totalAmount)}`, 200, pdf.lastAutoTable.finalY + 10, { align: "right" });
            } else {
                pdf.text(`Net Income: ${this.formattedCurrency(this.netIncome)}`, 200, pdf.lastAutoTable.finalY + 10, { align: "right" });
            }

            pdf.save("statement_report.pdf");
        },
        async exportToExcel() {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Report');

            // Set column headers with custom width for each column
            worksheet.columns = [
                { header: 'Activity', key: 'activity', width: 30 },
                { header: 'Category', key: 'category', width: 20 },
                { header: 'Date', key: 'date', width: 15 },
                { header: 'Amount', key: 'amount', width: 15 },
            ];

            // Apply header style (bold and centered)
            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).alignment = { horizontal: 'center' };

            // Add rows of data
            this.generatedReport.forEach((transaction) => {
                worksheet.addRow({
                    activity: transaction.activity,
                    category: transaction.category,
                    date: transaction.date,
                    amount: this.formattedCurrency(transaction.amount),
                });
            });

            // Add Total or Net Income at the end
            const totalRow = this.filters.type !== "all" ?
                `Total ${this.filters.type === 'expense' ? 'Expense' : 'Income'}` : 'Net Income';

            worksheet.addRow([totalRow, "", "", this.formattedCurrency(this.filters.type !== "all" ? this.totalAmount : this.netIncome)]);

            // Apply borders to every cell
            worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                });
            });

            // Write the workbook to a file
            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'statement_report.xlsx';
                link.click();
            });
        },

        async exportToImg() {
            // Capture the report preview section by its class
            const reportElement = this.$el.querySelector('.report-preview');

            // Ensure the element is fully visible, not clipped
            reportElement.style.overflow = 'visible'; // Make sure content is not hidden

            // Use html2canvas with custom options to ensure full capture
            html2canvas(reportElement, {
                scrollX: 0,
                scrollY: 0,
                width: reportElement.scrollWidth + 20,  // Add padding to ensure it fits
                height: reportElement.scrollHeight + 20, // Add padding
                x: 0,
                y: 0,
                scale: 3,  // Increase scale for higher resolution capture
                useCORS: true, // Enable CORS to load external resources like images
                logging: true, // Enable logging to help debug if needed
                allowTaint: true, // Allow tainting of images
                backgroundColor: '#ffffff', // Ensure the background is white for better contrast
            }).then((canvas) => {
                // Create an image from the canvas
                const imgData = canvas.toDataURL('image/png');

                // Create a link element to trigger the download
                const link = document.createElement('a');
                link.href = imgData;
                link.download = 'report.png';  // Name of the file to be downloaded

                // Simulate a click to trigger the download
                link.click();
            }).catch((error) => {
                console.error("Error exporting to image:", error);
            });
        },

        // helper function to present the amount nicely
        formattedCurrency(value) {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(value);
        },
    },

    mounted() {
        this.fetchTransactions();
    },
};
</script>

<style scoped>
.generator-container {
    animation: fadeIn 0.5s ease-in-out;
    max-width: 100%;
}

/* Input field styling improvements */
input[type="date"]::-webkit-calendar-picker-indicator {
    background-color: transparent;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.5);
}

/* Select field styling */
select {
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}

/* Table responsiveness */
.report-preview {
    overflow-x: auto;
}

/* Animations */
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

/* Button hover effects */
button {
    position: relative;
    overflow: hidden;
}

button::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateX(-100%);
    transition: transform 0.3s ease-out;
}

button:hover::after {
    transform: translateX(0);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .generator-container {
        border-radius: 0;
    }

    button {
        width: 100%;
    }
}
</style>