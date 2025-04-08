<template>
  <div>
    <!-- Title -->
    <div class="container text-center my-5">
      <h2><span class="title-launch">LAUNCH</span> 파티 모집 🎈</h2>
    </div>

    <!-- Table -->
    <div class="container">
      <div class="d-flex justify-content-end mb-2">
        <button class="btn btn-outline-success">등록</button>
      </div>
      <table class="table table-bordered table-hover align-middle text-center">
        <thead class="table-light">
          <tr>
            <th>No.</th>
            <th>Title</th>
            <th>약속 시간</th>
            <th>게시일</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(party, index) in parties" :key="index">
            <td>{{ party.no }}</td>
            <td
              class="text-start"
              :class="{ 'text-success fw-semibold': party.highlight }"
            >
              <a
                v-if="party.link"
                :href="party.link"
                class="text-decoration-none text-success"
              >
                {{ party.title }}
              </a>
              <span v-else>{{ party.title }}</span>
            </td>
            <td>{{ party.date }}<br />{{ party.time }}</td>
            <td>{{ party.posted }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PartyList',
  data() {
    return {
      parties: [],
    };
  },
};
</script>

<style scoped>
body {
  background-color: #f5f5f1;
  font-family: 'Noto Sans KR', sans-serif;
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
</style>
