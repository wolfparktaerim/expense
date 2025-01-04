<template>
    <div class="p-6 rounded-lg shadow-md generator-container">

        <!-- Header -->
        <div class="p-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-md shadow-lg mb-6">
            <h1 class="text-4xl font-extrabold text-center text-white">Generate <span
                    class="text-green-700">$</span>tatment Report</h1>
        </div>

        <!-- Filters Section -->
        <div
            class="space-y-6 bg-gray-50/50 p-6 rounded-xl border border-gray-200 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
            <div class="flex gap-6">
                <div class="w-1/2">
                    <label for="type" class="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                    <select id="type" v-model="filters.type" @change="updateCategories"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-gray-400 transition-colors duration-200">
                        <option value="all">All</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
                <div class="w-1/2">
                    <label for="category" class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select id="category" v-model="filters.category"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-gray-400 transition-colors duration-200">
                        <option value="">All</option>
                        <option v-for="category in categories" :key="category" :value="category">
                            {{ category }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="flex gap-6">
                <div class="w-1/2">
                    <label for="startDate" class="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                    <input type="date" id="startDate" v-model="filters.startDate"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-gray-400 transition-colors duration-200" />
                </div>
                <div class="w-1/2">
                    <label for="endDate" class="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                    <input type="date" id="endDate" v-model="filters.endDate"
                        class="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:border-gray-400 transition-colors duration-200" />
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end mt-6">
            <button @click="generateReport"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 active:shadow-inner transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Generate Report
            </button>
        </div>

        <!-- Report Preview -->
        <div v-if="generatedReport.length > 0" class="report-preview mt-6">
            <h2 class="text-lg font-medium mb-2 text-center">{{ reportTitle }}</h2>
            <p class="text-center text-sm mb-4 mt-4" v-if="filters.startDate && filters.endDate">
                Start Date: {{ filters.startDate }} &nbsp; &nbsp; End Date: {{ filters.endDate }}
            </p>
            <hr class="mb-4 mt-4" />
            <div>
                <table class="w-full border-collapse border border-gray-200 mb-6">
                    <thead>
                        <tr>
                            <th class="border border-gray-200 px-4 py-2">Activity</th>
                            <th class="border border-gray-200 px-4 py-2">Category</th>
                            <th class="border border-gray-200 px-4 py-2">Date</th>
                            <th class="border border-gray-200 px-4 py-2">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="transaction in generatedReport" :key="transaction.id">
                            <td class="border border-gray-200 px-4 py-2">{{ transaction.activity }}</td>
                            <td class="border border-gray-200 px-4 py-2">{{ transaction.category }}</td>
                            <td class="border border-gray-200 px-4 py-2">{{ transaction.date }}</td>
                            <td class="border border-gray-200 px-4 py-2">{{ formattedCurrency(transaction.amount) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="filters.type !== 'all'" class="text-right font-bold">
                    Total {{ filters.type === 'expense' ? 'Expense' : 'Income' }}:
                    <span class="ml-4">{{ formattedCurrency(totalAmount) }}</span>
                </p>
            </div>
            <p v-if="filters.type === 'all'" class="text-right font-bold mt-4">
                Net Income: <span class="ml-4">{{ formattedCurrency(netIncome) }}</span>
            </p>
        </div>
        <div v-else class="mt-4">
            <p v-if="pressed" class="text-center">No transaction available.</p>
        </div>

        <!-- Export Buttons -->
        <div v-if="generatedReport.length > 0" class="flex gap-4 mt-6">
            <button @click="exportToPDF"
                class="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 active:shadow-inner transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Export to PDF
            </button>
            <button @click="exportToExcel"
                class="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-yellow-500 hover:to-yellow-600 active:shadow-inner transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export to Excel
            </button>
            <button @click="exportToImage"
                class="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-purple-600 hover:to-purple-700 active:shadow-inner transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Export to Image
            </button>
        </div>
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

            this.totalAmount = this.generatedReport.reduce(
                (sum, t) => sum + t.amount,
                0
            );

            const income = this.transactions
                .filter((t) => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0);
            const expense = this.transactions
                .filter((t) => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            this.netIncome = income - expense;
        },

        exportToPDF() {
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

        // helper function to present the amount nicely
        formattedCurrency(value) {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(Math.abs(value));
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
}

.filters {
    border: 1px solid #e5e5e5;
    padding: 1rem;
    border-radius: 8px;
}

.actions {
    text-align: right;
}

.report-preview {
    overflow-x: auto;
}

.export-actions {
    display: flex;
    gap: 1rem;
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