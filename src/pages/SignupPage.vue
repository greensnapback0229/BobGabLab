<template>
  <div
    class="container d-flex flex-column align-items-center justify-content-center min-vh-100"
  >
    <!-- 로고 -->
    <img
      src="@/components/icons/logo2.png"
      alt="logo"
      class="mb-4"
      width="300"
    />

    <!-- 회원가입 폼 -->
    <div style="width: 40%">
      <!-- 차수 선택 -->
      <div class="mb-3">
        <label for="class" class="form-label">차수</label>
        <select
          v-model="classNum"
          id="class"
          class="form-select form-select-lg"
        >
          <option disabled value="">선택</option>
          <option v-for="n in 10" :key="n" :value="n + 10">{{ n + 10 }}</option>
        </select>
      </div>

      <!-- 이름 입력 -->
      <div class="mb-3">
        <input
          type="text"
          placeholder="이름"
          v-model="username"
          class="form-control form-control-lg"
        />
      </div>

      <!-- 비밀번호 입력 -->
      <div class="mb-4">
        <input
          type="password"
          placeholder="비밀번호"
          v-model="password"
          class="form-control form-control-lg"
        />
      </div>

      <!-- 버튼 -->
      <button class="btn bg-custom-green btn-lg w-100" @click="handleSignup">
        회원가입
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const username = ref('');
const password = ref('');
const classNum = ref('');
const router = useRouter();
const auth = useAuthStore();

const handleSignup = async () => {
  if (!username.value || !password.value || !classNum.value) {
    alert('모든 항목을 입력해주세요.');
    return;
  }

  const newUser = {
    username: username.value,
    password: password.value,
    class: parseInt(classNum.value),
    mode: '',
    total: 0,
    lunchParty: [],
    lastLunch: '',
  };

  const success = await auth.signup(newUser);

  if (success) {
    router.push('/');
  }
};
</script>
