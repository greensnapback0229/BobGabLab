<template>
  <div
    class="finance-home d-flex flex-column div-custom-beige min-vh-100 py-1 px-3"
  >
    <!-- 배너 -->
    <div class="banner-wrapper">
      <RouterLink to="/random">
        <img
          :src="selectedBanner"
          alt="배너"
          class="banner-img img-fluid w-100 shadow"
        />
      </RouterLink>
    </div>

    <div class="container py-5 d-flex flex-column flex-grow-1">
      <!-- 요약 카드 -->
      <div class="row text-center mb-4">
        <div class="col-md-4">
          <div class="summary-card border-success text-success">
            <div class="summary-title">총 수입</div>
            <div class="summary-amount">
              {{ totalInput.toLocaleString() }} 원
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="summary-card border-danger text-danger">
            <div class="summary-title">총 지출</div>
            <div class="summary-amount">
              {{ totalOutput.toLocaleString() }} 원
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="summary-card border-primary text-primary">
            <div class="summary-title">총 수익</div>
            <div class="summary-amount">
              {{ totalProfit.toLocaleString() }} 원
            </div>
          </div>
        </div>
      </div>

      <!-- 최근 거래 내역 -->
      <div class="mt-5">
        <h4 class="text-start mb-3">📋 최근 거래 내역</h4>
        <div class="d-flex flex-column align-items-start gap-2">
          <div
            v-for="item in recentFinances"
            :key="item.id"
            class="recent-card p-2 rounded border bg-white shadow-sm"
          >
            <div class="d-flex justify-content-between mb-1">
              <span class="fw-bold">{{ formatDate(item.date) }}</span>
              <span
                :class="item.type === 'INPUT' ? 'text-success' : 'text-danger'"
              >
                {{ item.type === 'INPUT' ? '수입' : '지출' }}
              </span>
            </div>

            <!-- 음식 정보는 지출일 경우에만 표시 -->
            <div v-if="item.type === 'OUTPUT'">
              <strong>음식:</strong> {{ item.food }} ({{
                formatFoodType(item.foodType)
              }})
            </div>

            <div>
              <strong>금액:</strong> {{ item.amount.toLocaleString() }}원
            </div>
            <div><strong>메모:</strong> {{ item.description || '-' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useFinanceStore } from '@/stores/finance';
import { useAuthStore } from '@/stores/auth';

const financeStore = useFinanceStore();
const authStore = useAuthStore();

// 배너 이미지
const banners = [
  new URL('@/assets/banners/banner1.jpg', import.meta.url).href,
  new URL('@/assets/banners/banner2.jpg', import.meta.url).href,
  new URL('@/assets/banners/banner3.jpg', import.meta.url).href,
];
const selectedBanner = ref('');
onMounted(() => {
  selectedBanner.value = banners[Math.floor(Math.random() * banners.length)];
});

// 거래 내역 불러오기
onMounted(async () => {
  const userId = authStore.user?.id || localStorage.getItem('userId');
  if (userId) {
    await financeStore.loadFinances(userId);
  }
});

// 현재 달 시작/끝 계산
const getStartAndEndOfCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return { start, end };
};

// 이번 달 거래 필터링
const currentMonthFinances = computed(() => {
  const { start, end } = getStartAndEndOfCurrentMonth();
  return financeStore.finances.filter((item) => {
    const date = new Date(item.date);
    return date >= start && date <= end;
  });
});

// 통계
const totalInput = computed(() =>
  currentMonthFinances.value
    .filter((item) => item.type === 'INPUT')
    .reduce((sum, item) => sum + Number(item.amount), 0)
);
const totalOutput = computed(() =>
  currentMonthFinances.value
    .filter((item) => item.type === 'OUTPUT')
    .reduce((sum, item) => sum + Number(item.amount), 0)
);
const totalProfit = computed(() => totalInput.value - totalOutput.value);

// 최근 거래 2건
const recentFinances = computed(() => {
  return [...financeStore.finances]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 2);
});

// 날짜 포맷
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}월 ${String(date.getDate()).padStart(2, '0')}일`;
};

// 음식 종류 포맷
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
</script>

<style scoped>
.banner-wrapper {
  width: 100%;
  position: relative;
  top: 0;
  left: 0;
  overflow: hidden;
}
.banner-img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}

.finance-home {
  background-color: #f3f5f9;
  min-height: 100vh;
}

.summary-card {
  border: 2px solid;
  border-radius: 10px;
  padding: 12px 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 90px;
}
.summary-title {
  font-size: 0.95rem;
  font-weight: bold;
  margin-bottom: 4px;
}
.summary-amount {
  font-size: 1.2rem;
  font-weight: bold;
}

.recent-card {
  width: 50%;
  min-width: 280px;
}
</style>
