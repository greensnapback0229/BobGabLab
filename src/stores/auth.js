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
        user.value = found;
        localStorage.setItem('auth', 'true');
        localStorage.setItem('userId', found.id);
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
        const newUser = postRes.data;
        isAuthenticated.value = true;
        user.value = newUser;

        localStorage.setItem('auth', 'true');
        localStorage.setItem('userId', newUser.id);
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

      // 수정 요청 (json-server 기준 PATCH)
      const res = await axios.patch(`${corsUrl}/${id}`, updatedFields);

      if (res.status === 200) {
        // user 객체 갱신
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
      const id = localStorage.getItem('userId');
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
