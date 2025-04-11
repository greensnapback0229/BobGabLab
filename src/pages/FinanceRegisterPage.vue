<template>
  <div class="form-page">
    <div class="form-container">
      <h2 class="costom_title">거래 내역 등록</h2>
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

        <!-- 음식 관련 항목은 지출일 때만 표시 -->
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

        <div class="mb-3" v-if="form.type === 'OUTPUT'">
          <label for="food">음식 이름</label>
          <input
            v-model="form.food"
            type="text"
            id="food"
            class="form-control form-input"
            :required="form.type === 'OUTPUT'"
            maxlength="10"
            placeholder="최대 10자까지 입력"
          />
        </div>

        <div class="mb-3">
          <label for="description">메모</label>
          <textarea
            v-model="form.description"
            id="description"
            class="form-control form-input"
            maxlength="100"
            placeholder="최대 100자까지 입력"
          ></textarea>
        </div>

        <div class="d-flex justify-content-center mt-4">
          <button type="submit" class="btn btn-save me-2">저장</button>
          <router-link to="/finance/list" class="btn btn-cancel"
            >취소</router-link
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFinanceStore } from '@/stores/finance';

const router = useRouter();
const financeStore = useFinanceStore();

const form = ref({
  type: 'OUTPUT', // 기본은 지출
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

const submitFinance = async () => {
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    alert('로그인이 필요합니다.');
    return;
  }

  const newFinance = {
    userId,
    type: form.value.type,
    date: form.value.date,
    amount: parseFloat(form.value.amount),
    foodType: form.value.foodType,
    food: form.value.food,
    description: form.value.description,
  };

  console.log('보낼 financeData:', newFinance);

  const success = await financeStore.addFinance(newFinance);

  if (success) {
    await financeStore.loadFinances(userId);
    router.push('/finance/list');
  } else {
    alert('거래 내역 저장에 실패했습니다. 다시 시도해주세요.');
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
