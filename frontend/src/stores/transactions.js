import { defineStore } from 'pinia';
import { getDatabase, ref, set, remove, get, query, orderByChild, child, update } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


export const userTransactions = defineStore('transactions', {
  state: () => ({
    lastTransaction: null,
    transactions: [],
    loading: false,
    error: null
  }),

  actions: {
    async addTransaction(transaction) {
      try {
        const auth = getAuth();
        const userId = auth.currentUser?.uid;

        if (!userId) {
          this.error = 'User not authenticated';
          throw new Error(this.error);
        }

        const db = getDatabase();
        const transactionRef = ref(db, `users/${userId}/transactions/${transaction.id}`);

        // for periodic transactions
        let nextDueDate = "";
        let transactionDate = new Date(transaction.date).getTime();
        if (transaction.periodic) {
          nextDueDate = this.calculateNextDueDate(transaction.period, transactionDate);
          if (!nextDueDate || isNaN(nextDueDate)) {
            this.error = 'Invalid nextDueDate';
            throw new Error(this.error);
          }

        }

        const transactionData = {
          id: transaction.id,
          activity: transaction.activity,
          category: transaction.category,
          amount: transaction.amount,
          description: transaction.description,
          periodic: transaction.periodic,
          period: transaction.period,
          date: transaction.date,
          timestamp: Date.now(),
          nextDueDate: nextDueDate  // Store the next due date for periodic transactions

        };

        // Save to Firebase Realtime DB
        await set(transactionRef, transactionData);

        // Update local state
        this.transactions = [...this.transactions, transactionData];
        this.error = null;
      } catch (error) {
        console.error('Error adding new transaction:', error);
        this.error = error.message;
        throw error;
      }
    },
    async autoAddPeriodicTransactions() {
      try {
        // Get current timestamp
        const now = Date.now();
        console.log(`[autoAddPeriodicTransactions] Current time: ${now}`);

        // Filter periodic transactions that are overdue
        const periodicTransactions = this.transactions.filter(
          (transaction) => transaction.periodic
        );

        console.log(`[autoAddPeriodicTransactions] Found ${periodicTransactions.length} periodic transactions due.`);

        console.log(`[autoAddPeriodicTransactions] Periodic Transaction List: .`, periodicTransactions);

        const db = getDatabase();
        const userId = getAuth().currentUser?.uid;
        if (!userId) {
          console.error('[autoAddPeriodicTransactions] User is not authenticated!');
          throw new Error('User not authenticated');
        }

        for (const transaction of periodicTransactions) {
          let oldDueDate = transaction.nextDueDate;
          console.log('Due Date date: ',new Date(oldDueDate).toISOString() );

          // Generate missed dates sequentially
          while (oldDueDate <= now) {
            const nextDueDate = this.calculateNextDueDate(transaction.period, oldDueDate);

            console.log(`[autoAddPeriodicTransactions] Adding instance for date: ${new Date(oldDueDate).toISOString()}`);

            // Add a new instance of the transaction for this period
            const newTransaction = {
              ...transaction,
              id: Date.now(), // Generate unique ID
              date: new Date(oldDueDate).toISOString().split('T')[0], // Format date
              timestamp: Date.now(),
              periodic: false, // Disable periodic flag for new transactions
              nextDueDate: null, // Not applicable for non-periodic transactions
              description: "(Auto-added by the system due to periodic nature) " + transaction.description,
            };

            await this.addTransaction(newTransaction);

            // Update `oldDueDate` to prevent duplicate processing
            oldDueDate = nextDueDate;
          }

          // Update the original transaction's `nextDueDate` in the database
          const parentTransactionRef = ref(db, `users/${userId}/transactions/${transaction.id}`);
          await set(parentTransactionRef, { ...transaction, nextDueDate: oldDueDate });

          console.log(
            `[autoAddPeriodicTransactions] Updated parent transaction's nextDueDate to: ${new Date(
              oldDueDate
            ).toISOString()}`
          );
        }
      } catch (error) {
        console.error(`[autoAddPeriodicTransactions] Error processing periodic transactions:`, error);
        throw error;
      }
    },

    // Helper function to calculate next due date
    calculateNextDueDate(period, currentDueDate) {
      const msInDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
      const msInWeek = msInDay * 7;       // Milliseconds in a week

      // Parse the current due date
      const dueDate = new Date(currentDueDate);
      if (isNaN(dueDate.getTime())) {
        console.error("[calculateNextDueDate] Invalid currentDueDate provided:", currentDueDate);
        return Number.MAX_SAFE_INTEGER; // Return "infinite" timestamp if currentDueDate is invalid
      }

      let nextDueDate;
      switch (period) {
        case 'Daily':
          nextDueDate = dueDate.getTime() + msInDay;
          break;
        case 'Weekly':
          nextDueDate = dueDate.getTime() + msInWeek;
          break;
        case 'Bi-Weekly':
          nextDueDate = dueDate.getTime() + msInWeek * 2;
          break;
        case 'Monthly':
          nextDueDate = new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, dueDate.getDate()).getTime();
          break;
        case 'Quarterly':
          nextDueDate = new Date(dueDate.getFullYear(), dueDate.getMonth() + 3, dueDate.getDate()).getTime();
          break;
        case 'Semi-Annually':
          nextDueDate = new Date(dueDate.getFullYear(), dueDate.getMonth() + 6, dueDate.getDate()).getTime();
          break;
        case 'Yearly':
          nextDueDate = new Date(dueDate.getFullYear() + 1, dueDate.getMonth(), dueDate.getDate()).getTime();
          break;
        default:
          console.warn(`[calculateNextDueDate] Invalid period "${period}" provided. Returning infinite timestamp.`);
          return Number.MAX_SAFE_INTEGER; // Infinite timestamp for invalid period
      }

      return nextDueDate;
    },

    async removeTransaction(transactionId) {
      try {
        const auth = getAuth();
        const userId = auth.currentUser?.uid;

        if (!userId) {
          this.error = 'User not authenticated';
          throw new Error(this.error);
        }

        const db = getDatabase();
        const transactionRef = ref(db, `users/${userId}/transactions/${transactionId}`);

        // Remove from Firebase Realtime DB
        await remove(transactionRef);

        // Update local state
        this.transactions = this.transactions.filter(transaction => transaction.id !== transactionId);
        this.error = null;
      } catch (error) {
        console.error('Error removing transaction:', error);
        this.error = error.message;
        throw error;
      }
    },

    async updateTransaction(updatedTransaction) {
      try {
        const db = getDatabase();
        const userId = getAuth().currentUser?.uid;

        if (!userId) {
          throw new Error("User is not authenticated.");
        }

        const transactionRef = ref(db, `users/${userId}/transactions/${updatedTransaction.id}`);
        await update(transactionRef, updatedTransaction);

        // Update local store (optimistic update)
        const index = this.transactions.findIndex(t => t.id === updatedTransaction.id);
        if (index !== -1) {
          this.transactions[index] = updatedTransaction;
        }
      } catch (error) {
        console.error(`[updateTransaction] Failed to update transaction:`, error);
        throw error;
      }
    },

    async loadTransactions() {
      try {
        this.loading = true;
        const auth = getAuth();
        const userId = auth.currentUser?.uid;

        console.log('user ID : ', userId)

        if (!userId) {
          console.error('No authenticated user');
          this.loading = false;
          return;
        }

        const db = getDatabase();
        const transactionsRef = ref(db, `users/${userId}/transactions`);

        try {
          const snapshot = await get(transactionsRef);

          console.log('Snapshot Details:', {
            exists: snapshot.exists(),
            value: snapshot.val()
          });

          if (snapshot.exists()) {
            const transactionsData = snapshot.val();
            console.log('Raw Transactions Data:', transactionsData);

            // Check if transactionsData is an object before converting
            if (typeof transactionsData === 'object' && transactionsData !== null) {
              // Convert object to array and sort
              this.transactions = Object.values(transactionsData)
                .filter(transaction => transaction !== null)
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

              console.log('Processed Transactions:', this.transactions);
            } else {
              console.log('Transactions data is not in expected format');
              this.transactions = [];
            }
          } else {
            console.log('No transactions found for this user.');
            this.transactions = [];
          }
        } catch (getError) {
          console.error('Error during database get:', getError);
          this.transactions = [];
        }
      } catch (error) {
        console.error('Comprehensive Load Error:', error);
        this.transactions = [];
      } finally {
        this.loading = false;
      }
    },

    async loadLastTransaction() {
      try {
        this.loading = true;
        const auth = getAuth();
        const userId = auth.currentUser?.uid;

        console.log('user ID:', userId);

        if (!userId) {
          console.error('No authenticated user');
          this.loading = false;
          return;
        }

        const db = getDatabase();
        const transactionsRef = ref(db, `users/${userId}/transactions`);

        try {
          const snapshot = await get(transactionsRef);

          console.log('Snapshot Details:', {
            exists: snapshot.exists(),
            value: snapshot.val()
          });

          if (snapshot.exists()) {
            const transactionsData = snapshot.val();
            console.log('Raw Transactions Data:', transactionsData);

            // Check if transactionsData is an object before proceeding
            if (typeof transactionsData === 'object' && transactionsData !== null) {
              // Convert object to array
              const transactionsArray = Object.values(transactionsData)
                .filter(transaction => transaction !== null);

              // Sort by timestamp and get the most recent transaction (first element)
              this.lastTransaction = transactionsArray
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))[0];

              console.log('Most Recent Transaction:', this.lastTransaction);
            } else {
              console.log('Transactions data is not in expected format');
              this.lastTransaction = null;
            }
          } else {
            console.log('No transactions found for this user.');
            this.lastTransaction = null;
          }
        } catch (getError) {
          console.error('Error during database get:', getError);
          this.lastTransaction = null;
        }
      } catch (error) {
        console.error('Comprehensive Load Error:', error);
        this.lastTransaction = null;
      } finally {
        this.loading = false;
      }
    },

    // Diagnostic method to inspect database structure
    async inspectDatabaseStructure() {
      try {
        const auth = getAuth();
        const userId = auth.currentUser?.uid;

        if (!userId) {
          console.error('No authenticated user');
          return;
        }

        const db = getDatabase();

        // Check full user node
        const userRef = ref(db, `users/${userId}`);
        const userSnapshot = await get(userRef);

        console.log('Full User Node Structure:', {
          exists: userSnapshot.exists(),
          value: userSnapshot.val()
        });

        // Log all child nodes under user
        const fullUserData = userSnapshot.val();
        console.log('User Node Children:', Object.keys(fullUserData || {}));
      } catch (error) {
        console.error('Database Structure Inspection Error:', error);
      }
    }


  }
});