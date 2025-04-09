<template>
  <div class="form-page">
    <div class="form-container">
      <h2 class="costom_title">거래 내역 수정</h2>
      <form @submit.prevent="submitFinance">
        <!-- 수입/지출 선택 버튼 -->
        <div class="d-flex justify-content-center mb-4">
          <button
            type="button"
            class="btn-type-input me-2"
            :class="{ active: form.type === 'INPUT' }"
            @click="form.type = 'INPUT'"
          >
            수입
          </button>
          <button
            type="button"
            class="btn-type-output"
            :class="{ active: form.type === 'OUTPUT' }"
            @click="form.type = 'OUTPUT'"
          >
            지출
          </button>
        </div>

        <div class="mb-3">
          <label for="date">날짜</label>
          <input
            v-model="form.date"
            type="date"
            id="date"
            class="form-control form-input"
            required
          />
        </div>

        <div class="mb-3">
          <label for="amount">금액</label>
          <input
            v-model="form.amount"
            type="number"
            id="amount"
            class="form-control form-input"
            required
          />
        </div>

        <!-- 음식 종류 (지출일 때만 표시) -->
        <div class="mb-3" v-if="form.type === 'OUTPUT'">
          <label>음식 종류</label>
          <div class="d-flex justify-content-center gap-2">
            <button
              v-for="type in foodTypes"
              :key="type.value"
              type="button"
              class="food-type-btn"
              :class="{ selected: form.foodType === type.value }"
              @click="form.foodType = type.value"
            >
              {{ type.label }}
            </button>
          </div>
        </div>

        <!-- 음식 이름 (지출일 때만 표시) -->
        <div class="mb-3" v-if="form.type === 'OUTPUT'">
          <label for="food">음식 이름</label>
          <input
            v-model="form.food"
            type="text"
            id="food"
            class="form-control form-input"
            :required="form.type === 'OUTPUT'"
          />
        </div>

        <div class="mb-3">
          <label for="description">메모</label>
          <textarea
            v-model="form.description"
            id="description"
            class="form-control form-input"
          ></textarea>
        </div>

        <div class="d-flex justify-content-center mt-4">
          <button type="submit" class="btn btn-save me-2">수정</button>
          <router-link to="/finance/list" class="btn btn-cancel"
            >취소</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFinanceStore } from '@/stores/finance';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const financeStore = useFinanceStore();
const financeId = route.params.id;

const form = ref({
  type: 'OUTPUT',
  date: '',
  amount: '',
  foodType: 'KOREAN',
  food: '',
  description: '',
});

const foodTypes = [
  { label: '한식', value: 'KOREAN' },
  { label: '중식', value: 'CHINESE' },
  { label: '일식', value: 'JAPANESE' },
  { label: '기타', value: 'ETC' },
];

// 기존 내역 불러오기
onMounted(async () => {
  try {
    const res = await axios.get(`/api/finance/${financeId}`);
    const data = res.data;
    form.value = {
      type: data.type,
      date: data.date,
      amount: data.amount,
      foodType: data.foodType || 'KOREAN',
      food: data.food || '',
      description: data.description || '',
    };
  } catch (err) {
    alert('데이터를 불러오지 못했습니다.');
  }
});

const submitFinance = async () => {
  const updatedData = {
    type: form.value.type,
    date: form.value.date,
    amount: parseFloat(form.value.amount),
    description: form.value.description,
    ...(form.value.type === 'OUTPUT' && {
      foodType: form.value.foodType,
      food: form.value.food,
    }),
  };

  try {
    await axios.put(`/api/finance/${financeId}`, updatedData);
    const userId = localStorage.getItem('userId');
    if (userId) {
      await financeStore.loadFinances(userId);
    }
    router.push('/finance/list');
  } catch (err) {
    alert('수정에 실패했습니다.');
  }
};
</script>

<style scoped>
.costom_title {
  color: #003d0f;
  text-align: center;
  font-weight: bold;
}

.form-page {
  background-color: #faf8f3;
  min-height: 100vh;
  padding-top: 40px;
}

.form-container {
  max-width: 400px;
  margin: auto;
  padding: 40px 30px;
}

.form-input {
  border-radius: 8px;
}

.btn-type-input,
.btn-type-output {
  background-color: transparent;
  font-weight: bold;
  border-radius: 8px;
  width: 100px;
  padding: 6px 0;
  transition: all 0.3s ease;
}

.btn-type-input {
  border: 2px solid #1b2f91 !important;
  color: #1b2f91 !important;
}

.btn-type-output {
  border: 2px solid #c01c1c !important;
  color: #c01c1c !important;
}

.btn-type-input.active {
  background-color: #1b2f91 !important;
  color: #fff !important;
}

.btn-type-output.active {
  background-color: #c01c1c !important;
  color: #fff !important;
}

.food-type-btn {
  border: 2px solid #71b548 !important;
  color: #71b548 !important;
  background-color: transparent;
  width: 70px;
  min-width: 60px;
  padding: 8px 0;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.food-type-btn:hover,
.food-type-btn.selected {
  background-color: #71b548 !important;
  color: white !important;
}

.btn-save {
  background-color: #71b548;
  color: #003d0f;
  font-weight: bold;
  border-radius: 8px;
}

.btn-cancel {
  background-color: rgba(113, 181, 72, 0.5);
  color: #003d0f;
  font-weight: bold;
  border-radius: 8px;
  padding: 8px 16px;
  border: none;
  transition: background-color 0.3s ease;
}
</style>
