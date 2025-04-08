<template>
  <div class="div-custom-beige min-vh-100">
    <div class="container py-5 d-flex flex-column align-items-center">
      <!-- 프로필 타이틀 -->
      <h2 class="fw-bold text-custom-green mb-5 mt-5">프로필 수정</h2>

      <!-- 아바타 -->
      <img
        src="@/components/icons/profile.png"
        alt="profile"
        class="mb-3"
        style="width: 170px"
      />

      <!-- 이름 -->
      <h5 class="mb-5">{{ user.username }}</h5>

      <!-- 차수 선택 -->
      <div class="mb-3 w-100" style="max-width: 400px">
        <label class="form-label">차수</label>
        <select v-model="classNum" class="form-select form-select-lg">
          <option disabled value="">선택</option>
          <option v-for="n in 10" :key="n" :value="n + 10">{{ n + 10 }}</option>
        </select>
      </div>

      <!-- 비밀번호 재설정 -->
      <div class="mb-5 w-100" style="max-width: 400px">
        <input
          type="password"
          v-model="newPassword"
          class="form-control form-control-lg"
          placeholder="비밀번호 재설정"
        />
      </div>

      <!-- 저장/취소 버튼 -->
      <div class="d-flex gap-3 w-50 justify-content-center">
        <button class="btn bg-custom-green px-4 w-25" @click="saveChanges">
          저장
        </button>
        <button class="btn bg-custom-green-op px-4 w-25" @click="cancelChanges">
          취소
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute, useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const user = computed(() => auth.user);
const classNum = ref('');
const newPassword = ref('');

onMounted(async () => {
  // localStorage에서 userId 기반으로 사용자 정보 불러오기
  const res = await auth.getUsernameByStoredId();
  if (res) {
    auth.user = res;
  }
});

const saveChanges = async () => {
  try {
    const success = await auth.updateProfile({
      class: parseInt(classNum.value),
      ...(newPassword.value && { password: newPassword.value }),
    });

    if (success) {
      alert('저장되었습니다.');
      router.push('/');
    } else {
      alert('저장 실패');
    }
  } catch (e) {
    console.error('저장 중 오류:', e);
    alert('오류 발생');
  }
};

const cancelChanges = () => {
  classNum.value = user.value.class;
  newPassword.value = '';
  router.push('/');
};
</script>
