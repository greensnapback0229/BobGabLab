<template>
  <div
    class="container d-flex flex-column align-items-center justify-content-center min-vh-100"
  >
    <img alt="BobGabLab Logo" src="@/components/icons/logo2.png" class="mb-4" />
    <div style="width: 40%">
      <div class="mb-2">
        <input
          type="text"
          placeholder="이름"
          class="form-control form-control-lg"
          v-model.trim="username"
        />
      </div>
      <div class="mb-3">
        <input
          type="password"
          placeholder="비밀번호"
          class="form-control form-control-lg"
          v-model.trim="password"
        />
      </div>
      <button
        class="btn bg-custom-green btn-lg w-100 mt-3 mb-3"
        @click="handleLogin"
      >
        로그인
      </button>
      <p class="text-center">
        <RouterLink to="/signup" class="text-decoration-underline text-dark">
          회원가입
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  const success = await auth.login(username.value, password.value);
  if (success) {
    router.push('/');
  } else {
    alert('로그인 실패: 아이디 또는 비밀번호가 틀립니다.');
  }
  console.log(username.value);
};
</script>
<style></style>
