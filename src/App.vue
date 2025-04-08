<template>
  <div>
    <RouterView />
  </div>
</template>

<script setup>
import './assets/main.css';

import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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
