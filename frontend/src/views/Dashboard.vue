<!-- views/Globe.vue -->
<template>
  <Navigation />
  <YourDashboard />
</template>

<script>
import Navigation from "../components/Navigation.vue";
import YourDashboard from "../components/YourDashboard.vue";
import TransactionTable from "../components/TransactionTable.vue";
import { useToast } from 'vue-toastification';

export default {
  name: 'SearchPage',
  components: {
    Navigation,
    TransactionTable,
    YourDashboard,
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


};
</script>
