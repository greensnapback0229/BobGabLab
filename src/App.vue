<template>
  <div>
    <!-- /login이 아닐 때만 Navbar 보여주기 -->
    <Navbar />

    <!-- 라우트에 따라 내용이 바뀜 -->
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import './assets/main.css';

import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from './components/Navbar.vue';

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

// login 경로에서는 navbar 숨기기
const showNavbar = computed(() => router.path !== '/login');
</script>

<style>
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
