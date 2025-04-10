<template>
  <div
    class="finance-home d-flex flex-column div-custom-beige min-vh-100 py-1 px-3"
  >
    <!-- 배너 -->
    <div class="banner-wrapper">
      <RouterLink to="/random">
        <template v-if="selectedBanner.endsWith('.mp4')">
          <video
            class="banner-img w-100 shadow"
            autoplay
            muted
            loop
            playsinline
          >
            <source :src="selectedBanner" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </template>
        <template v-else>
          <img
            :src="selectedBanner"
            alt="배너"
            class="banner-img img-fluid w-100 shadow"
          />
        </template>
      </RouterLink>
    </div>

    <div class="container py-5 d-flex flex-column flex-grow-1">
      <!-- 요약 카드 -->
      <div class="row text-center mb-4 g-3">
        <div class="col-12 col-md-4">
          <div class="summary-card border-success text-success">
            <div class="summary-title">총 수입</div>
            <div class="summary-amount">
              {{ totalInput.toLocaleString() }} 원
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="summary-card border-danger text-danger">
            <div class="summary-title">총 지출</div>
            <div class="summary-amount">
              {{ totalOutput.toLocaleString() }} 원
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="summary-card border-primary text-primary">
            <div class="summary-title">총 수익</div>
            <div class="summary-amount">
              {{ totalProfit.toLocaleString() }} 원
            </div>
          </div>
        </div>
      </div>

      <!-- 최근 거래 내역 + 최근 파티 목록 -->
      <div class="row mt-4 g-4">
        <!-- 최근 거래 내역 -->
        <div class="col-12 col-lg-6">
          <h4 class="text-start mb-3 fw-bold">📋 최근 거래 내역</h4>
          <div class="d-flex flex-column gap-3">
            <div
              v-for="item in recentFinances"
              :key="item.id"
              class="recent-card p-3 rounded border bg-white shadow-sm"
            >
              <div class="d-flex justify-content-between mb-1">
                <span class="fw-bold">{{ formatDate(item.date) }}</span>
                <span
                  :class="
                    item.type === 'INPUT' ? 'text-success' : 'text-danger'
                  "
                >
                  {{ item.type === 'INPUT' ? '수입' : '지출' }}
                </span>
              </div>

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

        <!-- 최근 파티 목록 -->
        <div class="col-12 col-lg-6">
          <h4 class="text-start mb-3 fw-bold">🎉 최근 파티 목록</h4>
          <div class="d-flex flex-column gap-3">
            <div
              v-for="party in recentParties"
              :key="party.id"
              class="recent-card p-3 rounded border bg-white shadow-sm"
            >
              <div class="d-flex justify-content-between mb-1">
                <span class="fw-bold">{{ party.title }}</span>
                <span class="text-muted">{{
                  formatPromiseTime(party.promiseTime)
                }}</span>
              </div>
              <div><strong>장소:</strong> {{ party.location }}</div>
              <div>
                <strong>참여자:</strong> {{ party.participation.length }}명
              </div>
            </div>
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
const recentParties = ref([]);

// 배너 이미지 로딩
const banners = [
  new URL('@/assets/banners/banner1.mp4', import.meta.url).href,
  new URL('@/assets/banners/banner2.mp4', import.meta.url).href,
  new URL('@/assets/banners/banner3.mp4', import.meta.url).href,
];
const selectedBanner = ref('');
onMounted(() => {
  selectedBanner.value = banners[Math.floor(Math.random() * banners.length)];
});

// 거래 내역과 파티 불러오기
onMounted(async () => {
  const userId = authStore.user?.id || localStorage.getItem('userId');
  if (userId) {
    await financeStore.loadFinances(userId);
    await loadRecentParties();
  }
});

const getStartAndEndOfCurrentMonth = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start, end };
};

const currentMonthFinances = computed(() => {
  const { start, end } = getStartAndEndOfCurrentMonth();
  return financeStore.finances.filter((item) => {
    const date = new Date(item.date);
    return date >= start && date <= end;
  });
});

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

const recentFinances = computed(() => {
  return [...financeStore.finances]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 1);
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
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

const loadRecentParties = async () => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const res = await fetch(`https://server.meallab.site/user/${userId}`);
    const user = await res.json();

    const partyIds = user.lunchParty || [];
    const lastTwoIds = partyIds.slice(-2);

    const partyPromises = lastTwoIds.map((id) =>
      fetch(`https://server.meallab.site/lunchParty/${id}`).then((res) =>
        res.json()
      )
    );

    recentParties.value = await Promise.all(partyPromises);
  } catch (err) {
    console.error('최근 파티 불러오기 실패:', err);
  }
};

const formatPromiseTime = (dateStr) => {
  const date = new Date(dateStr);
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${hour}:${minute}`;
};
</script>

<style scoped>
.banner-wrapper {
  width: 100%;
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
  padding: 16px 12px;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  min-height: 100px;
}

.summary-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 6px;
}
.summary-amount {
  font-size: 1.25rem;
  font-weight: bold;
}

.recent-card {
  width: 100%;
}
</style>
