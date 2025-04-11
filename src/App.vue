<template>
  <div class="app">
    <Navbar v-if="!['/login', '/signup'].includes(route.path)" />
    <div :class="['content', { 'with-margin': !isSpecialRoute }]">
      <RouterView />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import './assets/main.css'; // main.css: 전역 스타일 (예: .bg-custom-green 등)
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

const route = useRoute();
const router = useRouter();
const isLoggedIn = ref(false);

const noHeaderRoutes = ['/login', '/signup'];
const noHeaderPattern = /^\/party\/details\/\d+$/;

const isSpecialRoute = computed(() => {
  const path = route.path;
  return noHeaderRoutes.includes(path) || noHeaderPattern.test(path);
});

onMounted(() => {
  const isLoggedIn = sessionStorage.getItem('auth') === 'true';
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
  margin-top: 0;
}

.content.with-margin {
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
