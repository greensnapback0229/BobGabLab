<template>
  <div class="form-page">
    <div class="form-container">
      <h2 class="costom_title">거래 내역 수정</h2>
      <form @submit.prevent="handleSubmit">
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
            v-model.number="form.amount"
            type="number"
            id="amount"
            min="1"
            class="form-control form-input"
            required
          />
        </div>

        <div class="mb-3">
          <label>음식 종류</label>
          <div class="d-flex justify-content-between flex-wrap">
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

        <div class="mb-3">
          <label for="food">음식 이름</label>
          <input
            v-model="form.food"
            type="text"
            id="food"
            class="form-control form-input"
            required
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
          <button type="button" @click="cancel" class="btn btn-cancel">
            취소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

import { useAuthStore } from '@/stores/auth';
import { useFinanceStore } from '@/stores/finance';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const financeStore = useFinanceStore();

const form = ref({
  date: '',
  foodType: 'KOREAN',
  food: '',
  amount: 0,
  description: '',
  type: 'OUTPUT',
});

const foodTypes = [
  { label: '한식', value: 'KOREAN' },
  { label: '중식', value: 'CHINESE' },
  { label: '일식', value: 'JAPANESE' },
  { label: '기타', value: 'ETC' },
];

const financeId = route.params.id;

onMounted(async () => {
  const existing = await financeStore.finances.find((f) => f.id == financeId);
  if (!existing) return alert('수정할 데이터를 찾을 수 없습니다.');

  form.value = {
    date: existing.date.slice(0, 10),
    foodType: existing.foodType,
    food: existing.food,
    amount: existing.amount,
    description: existing.description,
    type: existing.type,
  };
});

const handleSubmit = async () => {
  if (!form.value.food || form.value.amount <= 0) {
    alert('모든 항목을 입력하세요.');
    return;
  }

  const updatedData = {
    ...form.value,
    userId: authStore.user?.id || localStorage.getItem('userId'),
    date: new Date(form.value.date).toISOString(),
  };

  try {
    await axios.patch(`/api/finance/${financeId}`, updatedData);
    await financeStore.loadFinances(updatedData.userId);
    router.push('/finance/list');
  } catch (err) {
    console.error('수정 실패:', err);
    alert('수정에 실패했습니다.');
  }
};

const cancel = () => router.push('/finance/list');
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
  width: 80px;
  padding: 8px 0;
  margin: 4px;
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
