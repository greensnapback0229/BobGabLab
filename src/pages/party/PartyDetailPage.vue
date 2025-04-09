<template>
  <div class="container text-center my-5">
    <h2><span class="title-launch">LAUNCH</span> 파티 모집 🎈</h2>
  </div>
  <div class="party-details">
    <p><strong>제목:</strong> {{ party.title }}</p>
    <p><strong>주최자:</strong> {{ party.owner }}</p>
    <p><strong>약속 장소:</strong> {{ party.location }}</p>
    <p><strong>약속 시간:</strong> {{ formattedTime }}</p>
    <p><strong>참여자 수:</strong> {{ participants.length }}명</p>

    <ul>
      <li v-for="(user, index) in participants" :key="index">
        {{ user.username }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const partyId = route.params.party_id;
const party = ref({});
const participants = ref([]);

const fetchParty = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/lunchParty/${partyId}`);
    party.value = res.data;
    await fetchParticipants();
  } catch (e) {
    console.error('파티 정보를 불러오는 중 오류 발생:', e);
  }
};

const fetchParticipants = async () => {
  if (!party.value.participation) return;

  const ids = party.value.participation;
  const promises = ids.map((id) =>
    axios.get(`http://localhost:3000/user/${id}`).then((res) => res.data)
  );

  try {
    const results = await Promise.all(promises);
    participants.value = results;
  } catch (e) {
    console.error('참여자 정보를 불러오는 중 오류 발생:', e);
  }
};

onMounted(fetchParty);

const formattedTime = computed(() => {
  if (!party.value.promiseTime) return '';
  const date = new Date(party.value.promiseTime);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});
</script>

<style scoped>
.party-details {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 2px solid #4caf50;
  border-radius: 12px;
  background: #f8fff8;
}
.party-details p {
  margin: 0.5rem 0;
}
</style>
