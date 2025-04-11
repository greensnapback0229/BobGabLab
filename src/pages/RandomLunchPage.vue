<template>

  <section class="random-lunch-page">

  <section class="random-lunch-page min-vh-100">

    <h2 class="fw-bold">오늘의 점심 메뉴는?</h2>

    <!-- 회전 컨테이너 -->
    <div class="roulette-container">
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="roulette-item"
        :class="{ selected: selectedItem && selectedItem.name === item.name }"
        :style="getItemStyle(idx)"
      >
        <div class="item-inner">
          <span class="food-text">{{ item.name }}</span>
        </div>
      </div>
      <div class="pointer" :class="{ 'animate-pointer': selectedItem }"></div>
    </div>

    <!-- 컨트롤 버튼 영역 -->
    <div class="controls">
      <button
        @click="startRotation"
        :disabled="isRotating"
        :class="{ rotating: isRotating }"
      >
        추첨
      </button>
      <button
        @click="selectFood"
        :disabled="!selectedItem"
        :class="{ 'disabled-btn': !selectedItem }"
        style="margin-left: 1cm"
      >
        선택
      </button>
    </div>

    <!-- 결과 메시지 -->
    <div class="result" v-if="selectedItem">
      오늘의 점심 메뉴는 <strong>{{ selectedItem.name }}</strong> 입니다!
    </div>

    <!-- 추천 음식점 카드형 섹션 -->
    <div class="recommendations" v-if="selectedItem && showRecommendations">
      <div class="cards">
        <div
          class="card"
          v-for="(restaurant, index) in currentRecommendations"
          :key="index"
        >
          <img :src="restaurant.image" alt="추천 음식점 이미지" />
          <div class="card-info">
            <h4>{{ restaurant.name }}</h4>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
// src/data/foods.json 파일 불러오기 (src 관련 정보는 제거된 상태)
import foodsData from '@/data/foods.json';

const router = useRouter();

// JSON에서 불러온 데이터를 그대로 사용
const items = foodsData.items;
const allRecommendations = foodsData.recommendations;

const currentRotation = ref(0);
const isRotating = ref(false);
const selectedItem = ref(null);
const showRecommendations = ref(false);
let animationFrame = null;
const rotationDuration = Math.floor(3000 + Math.random() * 1001);
let startTime = null;

const rx = 350;
const ry = 80;
const minScale = 0.5;
const maxScale = 1.2;

function getItemStyle(index) {
  const total = items.length;
  const angleStep = 360 / total;
  const baseAngle = angleStep * index - 90;
  const effectiveAngle = baseAngle + currentRotation.value;
  const rad = effectiveAngle * (Math.PI / 180);
  const x = rx * Math.cos(rad);
  const y = ry * Math.sin(rad);

  let diff = Math.abs(effectiveAngle - 90);
  diff = diff % 360;
  if (diff > 180) diff = 360 - diff;

  const normalized = (Math.cos((diff * Math.PI) / 180) + 1) / 2;
  const scale = minScale + normalized * (maxScale - minScale);
  const zIndex = Math.round(normalized * 100);

  return {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
    zIndex: zIndex,
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
}

function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;
  if (elapsed < rotationDuration) {
    if (elapsed < rotationDuration - 2000) {
      currentRotation.value -= 5;
    } else {
      const t = (elapsed - (rotationDuration - 2000)) / 2000;
      const speed = 10 * (1 - t);
      currentRotation.value -= speed;
    }
    animationFrame = requestAnimationFrame(animate);
  } else {
    stopRotation();
    determineSelectedItem();
  }
}

function startRotation() {
  if (isRotating.value) return;
  isRotating.value = true;
  selectedItem.value = null;
  showRecommendations.value = false;
  startTime = null;
  animationFrame = requestAnimationFrame(animate);
}

function stopRotation() {
  isRotating.value = false;
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
}

function determineSelectedItem() {
  const total = items.length;
  const angleStep = 360 / total;
  let minDiff = Infinity;
  let chosenIndex = 0;
  for (let i = 0; i < total; i++) {
    const baseAngle = angleStep * i - 90;
    let effective = baseAngle + currentRotation.value;
    effective = ((effective % 360) + 360) % 360;
    let diff = Math.abs(effective - 90);
    if (diff > 180) diff = 360 - diff;
    if (diff < minDiff) {
      minDiff = diff;
      chosenIndex = i;
    }
  }
  selectedItem.value = items[chosenIndex];
  const finalRotation = 90 - (angleStep * chosenIndex - 90);
  currentRotation.value = finalRotation;
  showRecommendations.value = true;
}

const currentRecommendations = computed(() => {
  if (!selectedItem.value) return [];
  return allRecommendations[selectedItem.value.name] || [];
});

function selectFood() {
  if (!selectedItem.value) return;
  const selectedFoodName = encodeURIComponent(selectedItem.value.name);
  router.push(`/party/register/${selectedFoodName}`);
}
</script>

<style scoped>
/* 이 컴포넌트만 적용되는 스타일 – 글로벌 html, body의 스크롤 숨김과 상관없이
   페이지 전체를 fixed로 고정하고 내부에서 스크롤되게 함 */
.random-lunch-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  text-align: center;
  padding: 2rem;
  background-color: #faf8f3;
  padding-top: calc(2rem);
}

.random-lunch-page h2 {
  color: #003d0f;
  margin-top: 0.5cm;
}

.result {
  margin-top: 0.7cm;
  font-size: 1.7rem;
}

.roulette-container {
  position: relative;
  margin: -1cm auto 0 auto;
  width: 750px;
  height: 400px;
  background: transparent;
  border: none;
}

.item-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.food-text {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: #003d0f;
}

.pointer {
  position: absolute;
  top: calc(50% + 80px + 2.2cm);
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 25px solid red;
}

.animate-pointer {
  animation: bounce 2s infinite ease-in-out;
}

@keyframes bounce {
  0% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-0.4cm);
  }
  100% {
    transform: translateX(-50%) translateY(0);
  }
}

.controls {
  margin-top: calc(1rem + 0.2cm - 0.5cm);
}

.controls button {
  margin: 0.5rem;
  padding: 8px 16px;
  background-color: #71b548;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.controls button:enabled:hover {
  background-color: #003d0f;
}

.controls button.rotating,
.controls button.disabled-btn {
  background-color: #ccc;
  cursor: default;
}

.roulette-item.selected {
  border: 3px solid #71b548;
}

.roulette-item.selected .food-text {
  font-weight: bold;
}

.recommendations {
  margin-top: 2rem;
  text-align: left;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  justify-content: center;
}

.card {
  --card-width: 200px;
  width: var(--card-width);
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-align: center;
}

.card img {
  width: 100%;
  height: calc(var(--card-width) - 2cm);
  object-fit: cover;
  display: block;
}

.card-info {
  padding: 0.5rem;
}

.card-info h4 {
  margin: 0.5rem 0;
  font-size: 1.2rem;
  color: #003d0f;
}

.card-info p {
  font-size: 0.9rem;
  color: #555;
}
</style>

<style>
/* Global CSS – 이 부분은 다른 페이지에도 적용되며, html, body에서 스크롤이 숨겨짐 */
.bg-custom-green {
  background-color: #71b548 !important;
}
.bg-custom-green-op {
  background-color: rgba(113, 181, 72, 0.5) !important;
}
.text-custom-green {
  color: #003d0f !important;
}
.div-custom-beige {
  background-color: #faf8f3 !important;
}
.nav-link img {
  height: 25px; /* 기존보다 살짝 작게 */
  margin-right: 8px; /* 아이콘 오른쪽 간격 확보 */
}
html,
body {
  overflow-y: hidden;
}
</style>
