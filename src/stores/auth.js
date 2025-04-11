import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const user = ref({});

  const CORS_URL = 'https://server.meallab.site';
  const corsUrl = CORS_URL + '/user';

  async function login(username, password) {
    try {
      const res = await axios.get(corsUrl);
      const data = res.data;
      const found = data.find(
        (u) => u.username === username && u.password === password
      );

      if (found) {
        isAuthenticated.value = true;
        user.value = found;
        sessionStorage.setItem('auth', 'true');
        sessionStorage.setItem('userId', found.id);
        return true;
      } else {
        isAuthenticated.value = false;
        return false;
      }
    } catch (e) {
      console.error('로그인 실패 : ', e);
      return false;
    }
  }

  function logout() {
    isAuthenticated.value = false;
    user.value = {};
    sessionStorage.clear(); // ✅ sessionStorage 사용
  }

  async function signup(newUser) {
    try {
      // 1. 중복 검사
      const res = await axios.get(corsUrl);
      const exists = res.data.some((u) => u.username === newUser.username);

      if (exists) {
        alert('이미 존재하는 사용자입니다.');
        return false;
      }

      // 2. 회원가입 요청
      const postRes = await axios.post(corsUrl, newUser);

      if (postRes.status === 201) {
        const newUser = postRes.data;
        isAuthenticated.value = true;
        user.value = newUser;

        sessionStorage.setItem('auth', 'true');
        sessionStorage.setItem('userId', newUser.id);
        return true;
      } else {
        isAuthenticated.value = false;
        return false;
      }
    } catch (e) {
      console.error('회원가입 에러 :', e);
      return false;
    }
  }

  async function updateProfile(updatedFields) {
    try {
      const id = user.value.id;

      const res = await axios.patch(`${corsUrl}/${id}`, updatedFields);

      if (res.status === 200) {
        user.value = res.data;
        return true;
      } else {
        console.error('업데이트 실패:', res);
        return false;
      }
    } catch (err) {
      console.error('프로필 수정 에러:', err);
      return false;
    }
  }

  async function getUsernameByStoredId() {
    try {
      const id = sessionStorage.getItem('userId'); // ✅ sessionStorage에서 가져오기
      if (!id) return null;
      const res = await axios.get(`${corsUrl}/${id}`);
      return res.data;
    } catch (e) {
      console.error('유저 정보 가져오기 실패:', e);
      return null;
    }
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
    signup,
    updateProfile,
    getUsernameByStoredId,
  };
});
