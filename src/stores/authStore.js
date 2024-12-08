import { defineStore } from 'pinia';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { auth } from '@/config/firebase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  actions: {
    async login(email, password) {
      this.loading = true;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        this.user = userCredential.user;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async register(email, password) {
      this.loading = true;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        this.user = userCredential.user;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      try {
        await signOut(auth);
        this.user = null;
      } catch (error) {
        this.error = error.message;
      }
    }
  }
});