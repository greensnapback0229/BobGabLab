import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

const CORS_URL = 'https://server.meallab.site';
const apiUrl = CORS_URL + '/finance';
const userApiUrl = CORS_URL + '/user';

export const useFinanceStore = defineStore('finance', () => {
  const finances = ref([]);

  const loadFinances = async (userId) => {
    try {
      const res = await axios.get(`${apiUrl}?userId=${userId}`);
      finances.value = res.data;
    } catch (err) {
      console.error('데이터 로드 실패:', err);
    }
  };

  const addFinance = async (financeData) => {
    try {
      const res = await axios.post(apiUrl, financeData);
      finances.value.push(res.data);

      const userRes = await axios.get(`${userApiUrl}/${financeData.userId}`);
      const currentUser = userRes.data;

      let updatedTotal = currentUser.total;
      updatedTotal +=
        financeData.type === 'INPUT' ? financeData.amount : -financeData.amount;

      await axios.patch(`${userApiUrl}/${financeData.userId}`, {
        total: updatedTotal,
      });

      return true;
    } catch (error) {
      console.error('데이터 저장 실패:', error);
      return false;
    }
  };

  const deleteFinance = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      finances.value = finances.value.filter((f) => f.id !== id);
    } catch (error) {
      console.error('데이터 삭제 실패:', error);
    }
  };

  return {
    finances,
    loadFinances,
    addFinance,
    deleteFinance,
  };
});
