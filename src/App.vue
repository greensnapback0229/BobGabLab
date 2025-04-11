<template>
  <div class="app">
    <!-- 로그인/회원가입 경로가 아니라면 Navbar 표시 -->
    <Navbar v-if="!['/login', '/signup'].includes(route.path)" />
    <!-- 콘텐츠 영역: Navbar가 고정되어 있으므로 margin-top을 줘서 겹치지 않게 함 -->
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import './assets/main.css'; // main.css: 전역 스타일 (예: .bg-custom-green 등)
import Navbar from './components/Navbar.vue';

const route = useRoute();
const router = useRouter();
const isLoggedIn = ref(false);

onMounted(() => {
  const isLoggedIn = localStorage.getItem('auth') === 'true';
  const currentPath = router.currentRoute.value.path;

  if (!isLoggedIn && currentPath !== '/login') {
    router.replace('/login');
  }

  if (isLoggedIn && currentPath === '/login') {
    router.replace('/');
  }
});
</script>

<style>
.app {
  position: relative;
}

.content {
  /* 헤더 높이 90px만큼 여백 처리 */
  margin-top: 90px;
}

/* 폰트 및 기타 전역 스타일 */
@font-face {
  font-family: 'Pretendard-Regular';
  src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff')
    format('woff');
  font-weight: 400;
  font-style: normal;
}
html,
body {
  font-family: 'Pretendard-Regular', sans-serif !important;
}
</style>
