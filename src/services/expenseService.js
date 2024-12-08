import { db } from '@/config/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc,
  doc
} from 'firebase/firestore';

export const expenseService = {
  async addExpense(userId, expenseData) {
    try {
      return await addDoc(collection(db, 'expenses'), {
        ...expenseData,
        userId,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  },
  
  async getExpensesByUser(userId) {
    const q = query(collection(db, 'expenses'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async deleteExpense(expenseId) {
    try {
      await deleteDoc(doc(db, 'expenses', expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }
};