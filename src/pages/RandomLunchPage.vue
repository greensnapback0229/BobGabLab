<template>
  <section class="home-page">
    <h2>오늘의 점심 메뉴는?</h2>

    <!-- 회전 컨테이너 -->
    <div class="roulette-container">
      <!-- 타원 궤도 상에 배치된 항목들 (현재는 텍스트만 표시) -->
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="roulette-item"
        :style="getItemStyle(idx)"
      >
        <div class="item-inner">
          <span class="food-text">{{ item.name }}</span>
        </div>
      </div>

      <!-- 빨간색 포인터 (타원 하단에서 2cm 아래로 지정) -->
      <div class="pointer"></div>
    </div>

    <!-- 회전 시작 버튼 -->
    <div class="controls">
      <button @click="startRotation" :disabled="isRotating">회전 시작</button>
    </div>

    <!-- 결과 (텍스트는 1cm 아래로 배치) -->
    <div class="result" v-if="selectedItem">
      오늘의 점심 메뉴는 <strong>{{ selectedItem.name }}</strong> 입니다!
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

/**
 * 항목 목록 – 현재는 이름(텍스트)만 사용하지만, 추후 사진을 삽입할 수 있도록 src 필드도 유지함
 */
const items = [
  {
    name: '김치찌개',
    src: new URL('@/assets/images/food1.png', import.meta.url).href,
  },
  {
    name: '돈까스',
    src: new URL('@/assets/images/food2.png', import.meta.url).href,
  },
  {
    name: '비빔밥',
    src: new URL('@/assets/images/food3.png', import.meta.url).href,
  },
  {
    name: '제육볶음',
    src: new URL('@/assets/images/food4.png', import.meta.url).href,
  },
  {
    name: '냉면',
    src: new URL('@/assets/images/food5.png', import.meta.url).href,
  },
  {
    name: '된장찌개',
    src: new URL('@/assets/images/food6.png', import.meta.url).href,
  },
];

const currentRotation = ref(0);
const isRotating = ref(false);
const selectedItem = ref(null);
let animationFrame = null;
const rotationDuration = 5000;
let startTime = null;

// 타원 궤도 (예: 가로 350, 세로 80)
const rx = 350;
const ry = 80;

// 스케일 범위
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
      const speed = 5 * (1 - t);
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
}
</script>

<style scoped>
.home-page {
  text-align: center;
  padding: 2rem;
  background-color: #faf8f3;
}

.home-page h2 {
  color: #003d0f;
}

.roulette-container {
  position: relative;
  margin: 0 auto;
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

/* 텍스트 항목 스타일 (현재 food-image 대신 food-text 클래스를 사용) */
.food-text {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: #003d0f;
}

/* 빨간색 포인터 (타원 하단에서 2cm 아래) */
.pointer {
  position: absolute;
  top: calc(50% + 80px + 2cm);
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 25px solid red;
}

.controls button {
  margin: 1rem;
  padding: 8px 16px;
  background-color: #71b548;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 8px;
}

.result {
  margin-top: 1cm;
  font-size: 1.2rem;
}
</style>
