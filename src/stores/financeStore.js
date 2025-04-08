// store/financeStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    finances: [],
  }),
  actions: {
    async fetchFinances(userId) {
      const res = await axios.get(
        `http://localhost:5175/foodFinance?userId=${userId}`
      );
      this.finances = res.data;
    },
    async addFinance(data) {
      await axios.post('http://localhost:5175/foodFinance', data);
      await this.fetchFinances(data.userId);
    },
  },
});
