<template>
  <div class="form-page">
    <div class="form-container">
      <h3 class="text-center fw-bold mb-4 costom_title">거래 내역 등록</h3>

      <!-- 수입/지출 선택 버튼 -->
      <div class="d-flex justify-content-center mb-4">
        <button
          type="button"
          class="btn me-2"
          :class="
            form.type === 'INPUT'
              ? 'btn-type-active-input'
              : 'btn-type-outline-input'
          "
          @click="form.type = 'INPUT'"
        >
          수입
        </button>
        <button
          type="button"
          class="btn"
          :class="
            form.type === 'OUTPUT'
              ? 'btn-type-active-output'
              : 'btn-type-outline-output'
          "
          @click="form.type = 'OUTPUT'"
        >
          지출
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label class="form-label">날짜</label>
          <input
            v-model="form.date"
            type="date"
            class="form-control form-input"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">카테고리</label>
          <select
            v-model="form.foodType"
            class="form-select form-input"
            required
          >
            <option disabled value="">선택</option>
            <option value="간식">간식</option>
            <option value="식사">식사</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">금액</label>
          <input
            v-model.number="form.amount"
            type="number"
            min="1"
            class="form-control form-input"
            required
          />
        </div>

        <div class="mb-4">
          <label class="form-label">메모</label>
          <input
            v-model="form.description"
            type="text"
            class="form-control form-input"
          />
        </div>

        <div class="text-center">
          <button type="submit" class="btn btn-save me-2 px-4">저장</button>
          <button type="button" @click="cancel" class="btn btn-cancel px-4">
            취소
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFinanceStore } from '@/stores/financeStore';

const router = useRouter();
const financeStore = useFinanceStore();

const form = ref({
  date: new Date().toISOString().slice(0, 10),
  foodType: '',
  amount: 0,
  description: '',
  type: 'OUTPUT',
});

const handleSubmit = async () => {
  if (!form.value.foodType || form.value.amount <= 0) {
    alert('모든 항목을 입력하세요.');
    return;
  }

  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    alert('로그인이 필요합니다.');
    router.push('/login');
    return;
  }

  const user = JSON.parse(storedUser);
  const userId = user?.id;

  if (!userId) {
    alert('사용자 정보가 올바르지 않습니다.');
    return;
  }

  const data = {
    ...form.value,
    userId,
    date: new Date(form.value.date).toISOString(),
  };

  await financeStore.addFinance(data);
  router.push('/history');
};

const cancel = () => router.back();
</script>

<style scoped>
.costom_title {
  color: #003d0f;
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

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.btn-type-active-input {
  border: 2px solid navy;
  background-color: navy;
  color: white;
  font-weight: bold;
  width: 100px;
  padding: 10px 0;
  text-align: center;
}

.btn-type-outline-input {
  border: 2px solid navy;
  color: navy;
  background-color: transparent;
  width: 100px;
  padding: 10px 0;
  text-align: center;
}

.btn-type-active-output {
  border: 2px solid brown;
  background-color: brown;
  color: white;
  font-weight: bold;
  width: 100px;
  padding: 10px 0;
  text-align: center;
}

.btn-type-outline-output {
  border: 2px solid brown;
  color: brown;
  background-color: transparent;
  width: 100px;
  padding: 10px 0;
  text-align: center;
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
