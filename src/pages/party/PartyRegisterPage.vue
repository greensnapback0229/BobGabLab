<template>
  <br /><br />
  <h1 class="title"><span class="launch">LAUNCH</span> 파티 등록 🎈</h1>

  <div class="register-container">
    <form class="form">
      <div class="form-group">
        <label for="title"><strong>TITLE</strong></label>
        <input v-model="title" type="text" id="title" />
      </div>

      <div class="form-group">
        <label><strong>When To Meet</strong></label>
        <div class="time-selects">
          <select v-model="day">
            <option>오늘</option>
            <option>내일</option>
          </select>
          <select v-model="hour">
            <option v-for="h in 24" :key="h">{{ h }}시</option>
          </select>
          <select v-model="minute">
            <option>00분</option>
            <option>10분</option>
            <option>20분</option>
            <option>30분</option>
            <option>40분</option>
            <option>50분</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="place"><strong>Where To Eat</strong></label>
        <input v-model="place" type="text" id="place" />
      </div>

      <div class="form-group">
        <textarea
          v-model="description"
          rows="6"
          placeholder="설명을 입력하세요"
        />
      </div>

      <div class="button-wrapper">
        <button type="button" @click="registerParty">등록</button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import axios from 'axios';

const title = ref('');
const day = ref('오늘');
const hour = ref('12'); // ex: "12"
const minute = ref('00분'); // ex: "00분"
const place = ref('');
const description = ref('');

const userId = 'user-1'; // 임시 고정

const registerParty = async () => {
  // 날짜 계산
  const today = new Date();
  if (day.value === '내일') today.setDate(today.getDate() + 1);

  // ✅ '시', '분' 제거 후 padStart로 포맷 맞춤
  const rawHour = hour.value.replace('시', '');
  const rawMinute = minute.value.replace('분', '');

  const h = rawHour.toString().padStart(2, '0');
  const m = rawMinute.toString().padStart(2, '0');

  console.log('hour:', h);
  console.log('minute:', m);

  const isoTime = new Date(
    `${today.toISOString().split('T')[0]}T${h}:${m}:00`
  ).toISOString();

  const partyData = {
    owner: userId,
    location: place.value,
    promiseTime: isoTime,
    participation: [userId],
  };

  try {
    const res = await axios.post('http://localhost:3000/lunchParty', partyData);
    alert('파티가 등록되었습니다!');
    console.log(res.data);
  } catch (err) {
    console.error('등록 실패:', err);
    alert('등록 중 오류 발생!');
  }
};
</script>

<style scoped>
.register-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fcfbf7;
  border: 2px solid #66bb44;
  border-radius: 10px;
}

.title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 24px;
}

.launch {
  color: #66bb44;
  font-weight: bold;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input,
select,
textarea {
  border: 1px solid #66bb44;
  border-radius: 4px;
  padding: 8px;
  font-size: 16px;
}

.time-selects {
  display: flex;
  gap: 8px;
}

textarea {
  background-color: #f0f9f0;
  resize: none;
}

.button-wrapper {
  text-align: right;
}

button {
  padding: 6px 16px;
  background: white;
  border: 2px solid #66bb44;
  color: #66bb44;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #66bb44;
  color: white;
}
</style>
