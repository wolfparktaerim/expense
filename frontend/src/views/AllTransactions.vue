<!-- views/Globe.vue -->
<template>
    <Navigation />
    <TransactionTable :transactions="transactions" :rowsPerPage="8" @transaction-deleted="handleTransactionDeleted" />
  
  </template>
  
  <script>
  import Navigation from "../components/Navigation.vue";
  import TransactionTable from "../components/TransactionTable.vue";
  import { userTransactions } from '../stores/transactions.js';
  import { useToast } from 'vue-toastification';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { getDatabase, ref, set, remove, get, query, orderByChild, child } from 'firebase/database';
  
  export default {
    name: 'SearchPage',
    components: {
      Navigation,
      TransactionTable,
    },
    data() {
      return {
        error: null,
        transactions: [],
        loading: false,
        transactionStore: null,
        isLoading: false,
        loadingColor: '#805ad5',
        toast: useToast(),
        toastConfig: {
          position: "top-right",
          timeout: 2000,
          closeOnClick: true,
          pauseOnFocusLoss: true,
          pauseOnHover: true,
          draggable: true,
          draggablePercent: 0.6,
          showCloseButtonOnHover: true,
          hideProgressBar: true,
          closeButton: "button",
          icon: true,
          rtl: false
        }
      };
    },
    created() {
      // Initialize the transaction store
      this.transactionsStore = userTransactions();
      this.transactionsStore.loadTransactions().then(() => {
        // console.log('Loaded Transactions:', this.transactionsStore.transactions);  // Debugging line
        this.transactions = this.transactionsStore.transactions;
        this.loading = this.transactionsStore.loading;
      }).catch((error) => {
        console.error('Error loading transactions:', error);
      });
  
      // Call inspectDatabaseStructure to check the database structure
      this.transactionsStore.inspectDatabaseStructure();
    },
    methods: {
      handleTransactionDeleted(transactionId) {
        this.transactions = this.transactions.filter(
          (transaction) => transaction.id !== transactionId
        );
      },
    },
  
  };
  </script>
  