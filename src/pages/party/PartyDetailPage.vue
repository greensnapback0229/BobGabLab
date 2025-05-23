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

  <!-- 댓글 표시 -->
  <div class="comment-section mt-5">
    <h4>💬 댓글</h4>
    <ul class="list-group mb-3">
      <li
        v-for="(c, index) in comments"
        :key="index"
        class="list-group-item text-start"
      >
        <strong>{{ c.name }}</strong
        >: {{ c.content }}
      </li>
    </ul>

    <!-- 댓글 입력 -->
    <div class="input-group mb-3">
      <input
        v-model="newComment"
        type="text"
        class="form-control"
        placeholder="댓글을 입력하세요 (최대 200자)"
        maxlength="200"
        @keyup.enter="handleCommentSubmit"
      />
      <button class="btn btn-primary" @click="handleCommentSubmit">작성</button>
    </div>
  </div>

  <!-- 참여하기 버튼 -->
  <div class="text-center mt-4">
    <button class="btn btn-success" @click="handleJoin">참여하기</button>
  </div>

  <!-- 삭제하기 버튼 (주최자만 보임) -->
  <div class="text-center mt-4" v-if="String(party.owner) === userId">
    <button class="btn btn-danger" @click="handleDelete">삭제하기</button>
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
const userId = sessionStorage.getItem('userId');
const newComment = ref('');

const fetchParty = async () => {
  try {
    const res = await axios.get(
      `https://server.meallab.site/lunchParty/${partyId}`
    );
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
    axios.get(`https://server.meallab.site/user/${id}`).then((res) => res.data)
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

const handleDelete = async () => {
  const confirmDelete = confirm('정말로 이 파티를 삭제하시겠습니까?');
  if (!confirmDelete) return;

  try {
    await axios.delete(`https://server.meallab.site/lunchParty/${partyId}`);
    alert('파티가 삭제되었습니다.');
    window.location.href = '/party-list';
  } catch (err) {
    console.error('삭제 중 오류 발생:', err);
    alert('삭제 중 문제가 발생했습니다.');
  }
};

const handleJoin = async () => {
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
    await axios.patch(`https://server.meallab.site/lunchParty/${partyId}`, {
      participation: updatedParticipants,
    });

    party.value.participation = updatedParticipants;
    await fetchParticipants();

    const userRes = await axios.get(
      `https://server.meallab.site/user/${userId}`
    );
    const user = userRes.data;

    const updatedUser = {
      lunchParty: [...(user.lunchParty || []), partyId],
      lastLunch: Number(partyId),
    };

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

const handleCommentSubmit = async () => {
  if (!userId) {
    alert('로그인이 필요합니다!');
    return;
  }

  if (!newComment.value.trim()) {
    alert('댓글을 입력해주세요!');
    return;
  }

  if (newComment.value.length > 200) {
    alert('댓글은 200자 이하로 작성해주세요!');
    return;
  }

  try {
    const userRes = await axios.get(
      `https://server.meallab.site/user/${userId}`
    );
    const username = userRes.data.username;

    const updatedComments = [
      ...(party.value.comment || []),
      {
        content: newComment.value,
        name: username,
      },
    ];

    await axios.patch(`https://server.meallab.site/lunchParty/${partyId}`, {
      comment: updatedComments,
    });

    party.value.comment = updatedComments;
    newComment.value = '';
  } catch (e) {
    console.error('댓글 등록 중 오류 발생:', e);
    alert('댓글 등록에 실패했습니다.');
  }
};

const comments = computed(() => party.value.comment || []);
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
.comment-section {
  max-width: 600px;
  margin: 2rem auto;
}
</style>
