<template>
  <div>
    <!-- 고정 배너 추가 -->
    <div class="banner-wrapper mt-3 mb-3 d-flex justify-content-center">
      <a
        href="https://www.multicampus.com/main"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img :src="staticBanner" alt="IT's Your Life" class="banner-img" />
      </a>
    </div>

    <!-- Title -->
    <div class="container text-center my-5">
      <h2 class="fw-bold">
        <span class="title-launch">LAUNCH</span> 파티 모집 🎈
      </h2>
    </div>

    <!-- Table -->
    <div class="container">
      <div class="d-flex justify-content-end mb-2">
        <router-link to="/party/register">
          <button class="btn btn-outline-success">등록</button>
        </router-link>
      </div>
      <table class="table table-bordered table-hover align-middle text-center">
        <thead class="table-light">
          <tr>
            <th>No.</th>
            <th>Title</th>
            <th>약속 시간</th>
            <th>게시자</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(party, index) in parties" :key="index">
            <td>{{ party.no }}</td>
            <td class="text-start" :title="party.title">
              <router-link
                :to="party.link"
                class="text-decoration-none text-dark"
              >
                {{ truncate(party.title, 20) }}
              </router-link>
            </td>
            <td>{{ party.date }} - {{ party.time }}</td>
            <td :title="party.posted">{{ truncate(party.posted, 10) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';

export default {
  name: 'PartyList',
  data() {
    return {
      parties: [],
      staticBanner: new URL(
        '@/assets/banners/static-banner.png',
        import.meta.url
      ).href,
    };
  },
  methods: {
    truncate(text, maxLength) {
      const str = String(text || '');
      return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
    },
  },
  async created() {
    try {
      const response = await axios.get(
        'https://server.meallab.site/lunchParty'
      );
      const allParties = response.data;

      // 최신순으로 정렬
      const sorted = allParties.sort(
        (a, b) => new Date(b.promiseTime) - new Date(a.promiseTime)
      );

      // 게시자 이름 포함한 데이터 구성
      const partiesWithUsernames = await Promise.all(
        sorted.map(async (party, index) => {
          const promise = dayjs(party.promiseTime);
          let username = '알 수 없음';

          try {
            const userRes = await axios.get(
              `https://server.meallab.site/user/${party.owner}`
            );
            username = userRes.data.username;
          } catch (err) {
            console.warn(
              `Failed to fetch user for owner ID ${party.owner}`,
              err
            );
          }

          return {
            no: index + 1,
            title: party.title,
            date: promise.format('YYYY-MM-DD'),
            time: promise.format('HH:mm'),
            posted: username,
            link: `/party/details/${party.id}`,
          };
        })
      );

      this.parties = partiesWithUsernames;
    } catch (err) {
      console.error('Error fetching lunch parties:', err);
    }
  },
};
</script>

<style scoped>
body {
  background-color: #f5f5f1;
  font-family: 'Noto Sans KR', sans-serif;
}
.banner-wrapper {
  width: 100%;
  overflow: hidden;
}
.banner-img {
  width: 80%;
  max-width: 1500px;
  object-fit: cover;
  display: block;
  margin: 0 auto;
}

.logo-text {
  font-weight: bold;
  font-size: 24px;
  color: #1d5722;
}
.title-launch {
  font-weight: bold;
  font-size: 32px;
  color: #5db85c;
}
.table-hover tbody tr:hover {
  background-color: #eaf7ea;
}
.btn-register {
  background-color: #6cba53;
  color: white;
}
.btn-register:hover {
  background-color: #589944;
}
:global(body) {
  background-color: #faf8f3;
}
</style>
