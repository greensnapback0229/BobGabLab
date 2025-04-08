import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false);
  const user = ref({});

  const CORS_URL = '/api';
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
        localStorage.setItem('auth', 'true');
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
    user.value = null;
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
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
        localStorage.setItem('auth', 'true');
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
  return {
    isAuthenticated,
    user,
    login,
    logout,
    signup,
  };
});
