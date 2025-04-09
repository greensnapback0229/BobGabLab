<template>
  <div class="list-page">
    <div class="container mt-4">
      <h3 class="mb-4 text-center text-success fw-bold">거래 내역</h3>

      <!-- 필터 -->
      <div class="row g-2 mb-4">
        <div class="col-md-3">
          <label for="category" class="form-label">음식 종류</label>
          <select id="category" class="form-select" v-model="filters.category">
            <option value="">전체 음식 종류</option>
            <option value="KOREAN">한식</option>
            <option value="CHINESE">중식</option>
            <option value="JAPANESE">일식</option>
            <option value="ETC">기타</option>
          </select>
        </div>

        <div class="col-md-3">
          <label for="type" class="form-label">수입 / 지출</label>
          <select id="type" class="form-select" v-model="filters.type">
            <option value="">전체 타입</option>
            <option value="INPUT">수입</option>
            <option value="OUTPUT">지출</option>
          </select>
        </div>

        <div class="col-md-3">
          <label for="start-date" class="form-label">조회 시작일</label>
          <input
            id="start-date"
            type="date"
            class="form-control"
            v-model="filters.startDate"
          />
        </div>

        <div class="col-md-3">
          <label for="end-date" class="form-label">조회 종료일</label>
          <input
            id="end-date"
            type="date"
            class="form-control"
            v-model="filters.endDate"
          />
        </div>
      </div>

      <!-- 거래 없음 안내 -->
      <div v-if="filteredFinances.length === 0" class="text-center text-muted">
        조건에 맞는 거래 내역이 없습니다.
      </div>

      <!-- 거래 리스트 -->
      <div v-else class="d-flex flex-column gap-1">
        <div
          v-for="item in filteredFinances"
          :key="item.id"
          class="p-2 rounded border bg-white shadow-sm"
        >
          <div class="d-flex justify-content-between mb-1">
            <span class="fw-bold">{{ formatDate(item.date) }}</span>
            <span
              :class="item.type === 'INPUT' ? 'text-success' : 'text-danger'"
            >
              {{ item.type === 'INPUT' ? '수입' : '지출' }}
            </span>
          </div>

          <!-- 음식 관련 정보: 지출일 때만 표시 -->
          <div class="mb-1" v-if="item.type === 'OUTPUT'">
            <strong>음식 이름:</strong> {{ item.food }}
          </div>
          <div class="mb-1" v-if="item.type === 'OUTPUT'">
            <strong>음식 종류:</strong> {{ formatFoodType(item.foodType) }}
          </div>

          <div class="mb-1">
            <strong>금액:</strong> {{ item.amount.toLocaleString() }}원
          </div>
          <div class="mb-2">
            <strong>메모:</strong> {{ item.description || '-' }}
          </div>
          <div class="text-end">
            <router-link
              :to="`/finance/edit/${item.id}`"
              class="btn btn-sm btn-outline-primary me-2"
            >
              수정
            </router-link>
            <button
              @click="deleteItem(item.id)"
              class="btn btn-sm btn-outline-danger"
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useFinanceStore } from '@/stores/finance';
import { useAuthStore } from '@/stores/auth';

const financeStore = useFinanceStore();
const authStore = useAuthStore();
const route = useRoute();

const filters = ref({
  category: '',
  type: '',
  startDate: '',
  endDate: '',
});

watch(
  () => route.fullPath,
  async () => {
    const userId = authStore.user?.id || localStorage.getItem('userId');
    if (userId) {
      await financeStore.loadFinances(userId);
    }
  },
  { immediate: true }
);

const deleteItem = async (id) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    if (typeof financeStore.deleteFinance === 'function') {
      await financeStore.deleteFinance(id);
      await financeStore.loadFinances(
        authStore.user?.id || localStorage.getItem('userId')
      );
    } else {
      console.error('deleteFinance 함수가 정의되어 있지 않습니다.');
    }
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}월 ${String(date.getDate()).padStart(2, '0')}일`;
};

const formatFoodType = (value) => {
  return (
    {
      KOREAN: '한식',
      CHINESE: '중식',
      JAPANESE: '일식',
      ETC: '기타',
    }[value] || value
  );
};

const filteredFinances = computed(() => {
  return financeStore.finances.filter((item) => {
    const itemDate = item.date.split('T')[0];

    if (
      filters.value.category &&
      (item.type !== 'OUTPUT' || item.foodType !== filters.value.category)
    )
      return false;

    if (filters.value.type && item.type !== filters.value.type) return false;
    if (filters.value.startDate && itemDate < filters.value.startDate)
      return false;
    if (filters.value.endDate && itemDate > filters.value.endDate) return false;

    return true;
  });
});
</script>

<style scoped>
.list-page {
  background-color: #faf8f3;
  min-height: 100vh;
  padding-top: 40px;
}

.shadow-sm {
  padding: 10px !important;
  margin-bottom: 6px !important;
}
.shadow-sm .mb-1,
.shadow-sm .mb-2 {
  margin-bottom: 2px !important;
}
</style>
