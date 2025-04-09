<template>
  <div class="div-custom-beige min-vh-100 py-1 px-3">
    <!-- 배너 -->
    <div class="banner-wrapper">
      <RouterLink to="/random">
        <img
          :src="selectedBanner"
          alt="배너"
          class="banner-img img-fluid w-100 shadow"
        />
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 배너 이미지 리스트
const banners = [
  new URL('@/assets/banners/banner1.jpg', import.meta.url).href,
  new URL('@/assets/banners/banner2.jpg', import.meta.url).href,
  new URL('@/assets/banners/banner3.jpg', import.meta.url).href,
];

const selectedBanner = ref('');

onMounted(() => {
  // 무작위 배너 선택
  selectedBanner.value = banners[Math.floor(Math.random() * banners.length)];
});
</script>

<style scoped>
.banner-wrapper {
  width: 100%;
  position: relative;
  top: 0;
  left: 0;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}
</style>
