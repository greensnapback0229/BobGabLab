<template>
  <section class="random-lunch-page min-vh-100">
    <h2>오늘의 점심 메뉴는?</h2>

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

const router = useRouter();

const items = [
  {
    name: '김치찌개',
    src: new URL('@/assets/images/food2.png', import.meta.url).href,
  },
  {
    name: '돈까스',
    src: new URL('@/assets/images/food3.png', import.meta.url).href,
  },
  {
    name: '제육볶음',
    src: new URL('@/assets/images/food4.png', import.meta.url).href,
  },
  {
    name: '부리또',
    src: new URL('@/assets/images/food5.png', import.meta.url).href,
  },
  {
    name: '짜장면',
    src: new URL('@/assets/images/food6.png', import.meta.url).href,
  },
  {
    name: '순쫄',
    src: new URL('@/assets/images/food1.png', import.meta.url).href,
  },
  {
    name: '감자탕',
    src: new URL('@/assets/images/food1.png', import.meta.url).href,
  },
  {
    name: '떡볶이',
    src: new URL('@/assets/images/food1.png', import.meta.url).href,
  },
  {
    name: '탕수육',
    src: new URL('@/assets/images/food1.png', import.meta.url).href,
  },
  {
    name: '볶음밥',
    src: new URL('@/assets/images/food1.png', import.meta.url).href,
  },
  {
    name: '스테이크',
    src: new URL('@/assets/images/food1.png', import.meta.url).href,
  },
  {
    name: '한식',
    src: new URL('@/assets/images/food1.png', import.meta.url).href,
  },
  {
    name: '햄버거',
    src: new URL('@/assets/images/food1.png', import.meta.url).href,
  },
  {
    name: '샐러드',
    src: new URL('@/assets/images/food2.png', import.meta.url).href,
  },
  {
    name: '짬뽕',
    src: new URL('@/assets/images/food2.png', import.meta.url).href,
  },
  {
    name: '따연초',
    src: new URL('@/assets/images/food2.png', import.meta.url).href,
  },
  {
    name: '라멘',
    src: new URL('@/assets/images/food2.png', import.meta.url).href,
  },
  {
    name: '규동',
    src: new URL('@/assets/images/food2.png', import.meta.url).href,
  },
  {
    name: '가츠동',
    src: new URL('@/assets/images/food2.png', import.meta.url).href,
  },
  {
    name: '칼국수',
    src: new URL('@/assets/images/food2.png', import.meta.url).href,
  },
];

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
  showRecommendations.value = false; // 추첨 시 추천 섹션 초기화
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
  // 랜덤 추첨 완료 후 추천 섹션 표시
  showRecommendations.value = true;
}

// 모든 추천 데이터를 음식 이름별로 분류 (예시)
const allRecommendations = {
  김치찌개: [
    {
      name: '칠순이네 김치찌개',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240128_65%2F1706436515520SbT2g_JPEG%2FIMG_3955.jpeg',
    },
  ],
  돈까스: [
    {
      name: '가츠시',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTA0MDVfMTAx%2FMDAxNzQzODQwMzE0NjQx.M3vXzquOLoZ2caBsbmr1CIsBAg17l0H23aBocYcexIYg.-UXDV_AuiJvOJZ_dG1ybyv6V4aYL11w6w5MpHK4P-icg.JPEG%2F20250319_150029.jpg.jpg%3Ftype%3Dw1500_60_sharpen',
    },
    {
      name: '쥰카츠',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240127_162%2F1706288292782IFG7W_JPEG%2F20240124_105127.jpg',
    },
  ],
  제육볶음: [
    {
      name: '채육식당 광진점',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20231009_264%2F16968410878922pd5z_JPEG%2FGJS03189.jpg',
    },
  ],
  부리또: [
    {
      name: '밀플랜비',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220331_143%2F164872020851258nHG_JPEG%2F24FECE52-6F35-4C30-B9AA-14F6D4F1A818.jpeg',
    },
  ],
  짜장면: [
    {
      name: '세종원',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTAzMjNfNDQg%2FMDAxNzQyNzA3Nzg1MjY4.mwMavRYzrDDQL9h7ymF8z8q9QmcjVXxxedWYhkISd6cg.oZFTHMAD52tImme7J2QvWnm4Gupm6bbLsXTCEKJ5CW0g.JPEG%2Fimage.jpg%3Ftype%3Dw1500_60_sharpen',
    },
    {
      name: '신국빈',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250215_256%2F1739584177563QS0V8_JPEG%2FImage_20250215103038.jpg',
    },
  ],
  짬뽕: [
    {
      name: '세종원',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTAzMjNfNDQg%2FMDAxNzQyNzA3Nzg1MjY4.mwMavRYzrDDQL9h7ymF8z8q9QmcjVXxxedWYhkISd6cg.oZFTHMAD52tImme7J2QvWnm4Gupm6bbLsXTCEKJ5CW0g.JPEG%2Fimage.jpg%3Ftype%3Dw1500_60_sharpen',
    },
    {
      name: '신국빈',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250215_256%2F1739584177563QS0V8_JPEG%2FImage_20250215103038.jpg',
    },
  ],
  순쫄: [
    {
      name: '세종대 학식 진관홀',
      image:
        'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzExMjdfMjQ5%2FMDAxNzAxMDY1NTUwNjYx.NnK1AJsOI-V-5qfJ_Uco1VibEQHYVJ6fuFycw9c5KKEg.fSFaA2nfUUONpXmSNUf4VZuK45DUIz5Op5OY-c6P8Akg.JPEG.soyoung8914%2FKakaoTalk_20231127_104028905_08.jpg&type=sc960_832',
    },
  ],
  감자탕: [
    {
      name: '신사골 감자탕',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20231011_159%2F1697013804508OqWwG_JPEG%2F%25B0%25A8%25C0%25DA%25C5%25C12.jpg',
    },
    {
      name: '통큰 감자탕',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240517_57%2F1715921176635b5S4V_JPEG%2FKakaoTalk_20240517_131054635_01.jpg',
    },
  ],
  떡볶이: [
    {
      name: '우동 연가',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240408_35%2F1712550532812a6kYq_JPEG%2F055A9169333.jpg',
    },
    {
      name: '세종김밥떡볶이',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210722_3%2F1626956787914DjuHS_JPEG%2Fhy3I-Wxf-ZhGI7g5B4LzX-iL.jpg',
    },
  ],
  탕수육: [
    {
      name: '세종원',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTAzMjNfNDQg%2FMDAxNzQyNzA3Nzg1MjY4.mwMavRYzrDDQL9h7ymF8z8q9QmcjVXxxedWYhkISd6cg.oZFTHMAD52tImme7J2QvWnm4Gupm6bbLsXTCEKJ5CW0g.JPEG%2Fimage.jpg%3Ftype%3Dw1500_60_sharpen',
    },
    {
      name: '신국빈',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250215_256%2F1739584177563QS0V8_JPEG%2FImage_20250215103038.jpg',
    },
  ],
  볶음밥: [
    {
      name: '세종원',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTAzMjNfNDQg%2FMDAxNzQyNzA3Nzg1MjY4.mwMavRYzrDDQL9h7ymF8z8q9QmcjVXxxedWYhkISd6cg.oZFTHMAD52tImme7J2QvWnm4Gupm6bbLsXTCEKJ5CW0g.JPEG%2Fimage.jpg%3Ftype%3Dw1500_60_sharpen',
    },
    {
      name: '신국빈',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20250215_256%2F1739584177563QS0V8_JPEG%2FImage_20250215103038.jpg',
    },
  ],
  스테이크: [
    {
      name: '모모 스테이크',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20160602_216%2F14648703811257s5mT_JPEG%2F35085200_09.jpg',
    },
  ],
  한식: [
    {
      name: '몽글몽글',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230911_191%2F169443195109263FhB_JPEG%2F1690586674616.jpg',
    },
  ],
  햄버거: [
    {
      name: '맥도날드',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20190101_154%2F1546339965758wk4SK_JPEG%2FDwYpQBJMebc0bq2XMQ78cliz.jpg',
    },
    {
      name: ' KFC',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240719_39%2F172138002661259Rma_PNG%2FKFC_Brand_image.png',
    },
  ],
  샐러드: [
    {
      name: '서브웨이',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200103_25%2F1578043665077PQ7DR_JPEG%2F0m0_I7X0TGHqVAadZ1R3VmM4.jpg',
    },
    {
      name: '프레퍼스',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20241119_261%2F17319812346511qOB4_JPEG%2FPREPPERS.jpg',
    },
  ],
  따연초: [
    {
      name: '스시붐',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTAzMTRfMjEz%2FMDAxNzQxOTU5MDY1MDcz.WqZc2YHxf3gwGygU9PiAuZxblVeKlioBL5g2EjZv1bIg.gfPhu5Ep67XsHrDsP0nExTzCqJx7fXjjbw5CVJVvzzkg.JPEG%2F6267D391-2175-472B-B8BC-FBC033006547.jpeg%3Ftype%3Dw1500_60_sharpen',
    },
  ],
  라멘: [
    {
      name: '멘츠루',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20241231_28%2F1735647300366jkSvq_JPEG%2FKakaoTalk_20241231_211347633_01.jpg',
    },
    {
      name: '혼다라멘',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTAzMTFfMjc3%2FMDAxNzQxNjcwMTY1OTYx.1O4sRIA987rS_3Bcbn-Ne8-yymDu8DbAVS_kcTvG_Q0g.0fs-Wey0jjJWSmTwUDudGcPtX6K0icbfuskyWfK2r-Qg.JPEG%2FA00EF444-841C-471D-B16F-449C6CAE888F.jpeg%3Ftype%3Dw1500_60_sharpen',
    },
  ],
  규동: [
    {
      name: '멘츠루',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20241231_28%2F1735647300366jkSvq_JPEG%2FKakaoTalk_20241231_211347633_01.jpg',
    },
    {
      name: '혼다라멘',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTAzMTFfMjc3%2FMDAxNzQxNjcwMTY1OTYx.1O4sRIA987rS_3Bcbn-Ne8-yymDu8DbAVS_kcTvG_Q0g.0fs-Wey0jjJWSmTwUDudGcPtX6K0icbfuskyWfK2r-Qg.JPEG%2FA00EF444-841C-471D-B16F-449C6CAE888F.jpeg%3Ftype%3Dw1500_60_sharpen',
    },
  ],
  가츠동: [
    {
      name: '동경규동',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240110_242%2F170485987679351Kip_JPEG%2F%25C7%25C3%25B7%25B9%25C0%25CC%25BD%25BA2.jpg',
    },
    {
      name: '혼다라멘',
      image:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNTAzMTFfMjc3%2FMDAxNzQxNjcwMTY1OTYx.1O4sRIA987rS_3Bcbn-Ne8-yymDu8DbAVS_kcTvG_Q0g.0fs-Wey0jjJWSmTwUDudGcPtX6K0icbfuskyWfK2r-Qg.JPEG%2FA00EF444-841C-471D-B16F-449C6CAE888F.jpeg%3Ftype%3Dw1500_60_sharpen',
    },
  ],
  칼국수: [
    {
      name: '고을 칼국수',
      image:
        'https://search.pstatic.net/common/?src=http%3A%2F%2Fimage.nmv.naver.net%2Fblog_2024_09_20_1799%2FvKQXfwXJZu_01.jpg',
    },
  ],
};

const currentRecommendations = computed(() => {
  if (!selectedItem.value) return [];
  return (
    allRecommendations[selectedItem.value.name] || allRecommendations.default
  );
});

function selectFood() {
  if (!selectedItem.value) return;
  const selectedFoodName = encodeURIComponent(selectedItem.value.name);
  router.push(`/party/register/${selectedFoodName}`);
}
</script>

<style scoped>
.random-lunch-page {
  text-align: center;
  padding: 2rem;
  background-color: #faf8f3;
  padding-top: calc(2rem);
}

.random-lunch-page h2 {
  color: #003d0f;
  margin-top: 0.5cm;
}

/* 결과 메시지: 컨트롤 버튼 영역 바로 아래 1cm 간격 (margin-top: 0.7cm) */
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

/* 기본 포인터 */
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

/* 컨트롤 버튼 영역: 현재 위치에서 0.5cm 상단으로 이동 */
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

/* 추천 음식점 카드형 섹션 */
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
  /* CSS 변수 사용: 카드의 가로 크기를 정하고, 이미지 높이는 이 값에서 1cm를 뺀 값으로 설정 */
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
