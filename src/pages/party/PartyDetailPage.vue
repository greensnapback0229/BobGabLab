<template>
  <div class="container text-center my-5">
    <h2 class="fw-bold">
      <br />
      <span class="title-launch">LAUNCH</span> 파티 상세 🎈
    </h2>
  </div>
  <div class="party-details">
    <p><strong>제목:</strong> {{ party.title }}</p>
    <p v-if="participants[0]">
      <strong>주최자:</strong> {{ participants[0].username }}
    </p>

    <p><strong>음식:</strong> {{ party.location }}</p>
    <p><strong>약속 시간:</strong> {{ formattedTime }}</p>
    <p><strong>참여자 수:</strong> {{ participants.length }}명</p>

    <ul>
      <li v-for="(user, index) in participants" :key="index">
        {{ user.username }}
      </li>
    </ul>

    <br />
    {{ party.description }}
  </div>
  <!-- 참여하기 버튼 -->
  <div class="text-center mt-4">
    <button class="btn btn-success" @click="handleJoin">참여하기</button>
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
    const res = await axios.get(
      `https://server.meallab.site/lunchParty/${partyId}`
    );
    party.value = res.data;
    await fetchParticipants();
    console.log('🚀 ~ fetchParty ~ party:', party);
  } catch (e) {
    console.error('파티 정보를 불러오는 중 오류 발생:', e);
  }
};

const fetchParticipants = async () => {
  if (!party.value.participation) return;

  const ids = party.value.participation;
  const promises = ids.map((id) =>
    axios.get(`https://server.meallab.site/user/${id}`).then((res) => res.data)
  );

  try {
    const results = await Promise.all(promises);
    participants.value = results;
  } catch (e) {
    console.error('참여자 정보를 불러오는 중 오류 발생:', e);
  }
};

// ✅ 여기서 mount 시 실행
onMounted(fetchParty);

// ✅ 약속시간 포맷
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

// ✅ 참여하기 버튼
const handleJoin = async () => {
  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    alert('로그인이 필요합니다!');
    return;
  }

  if (party.value.participation.includes(userId)) {
    alert('이미 참여한 파티입니다!');
    return;
  }

  const updatedParticipants = [...party.value.participation, userId];

  try {
    // ✅ 1. lunchParty 참여 업데이트
    await axios.patch(`https://server.meallab.site/lunchParty/${partyId}`, {
      participation: updatedParticipants,
    });

    party.value.participation = updatedParticipants;
    await fetchParticipants();

    // ✅ 2. user 정보 가져오기
    const userRes = await axios.get(
      `https://server.meallab.site/user/${userId}`
    );
    const user = userRes.data;

    // ✅ 3. lunchParty 배열 업데이트 + lastLunch 설정
    const updatedUser = {
      lunchParty: [...(user.lunchParty || []), partyId],
      lastLunch: Number(partyId),
    };

    // ✅ 4. user 정보 PATCH 요청
    await axios.patch(
      `https://server.meallab.site/user/${userId}`,
      updatedUser
    );

    alert('참여 완료!');
  } catch (err) {
    console.error('참여 중 오류 발생:', err);
    alert('참여 중 문제가 발생했습니다.');
  }
};
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
.title-launch {
  font-weight: bold;
  font-size: 32px;
  color: #5db85c;
}

:global(body) {
  background-color: #faf8f3;
}
</style>
