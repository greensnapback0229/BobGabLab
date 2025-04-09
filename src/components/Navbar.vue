<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
    <div
      class="container-fluid d-flex align-items-center justify-content-between"
    >
      <!-- 로고 (텍스트 제거됨) -->
      <router-link to="/" class="navbar-brand me-4">
        <img src="@/components/icons/logo1.png" alt="로고" height="36" />
      </router-link>

      <!-- 네비 메뉴: 아이콘 + 텍스트 수평 정렬 -->
      <ul
        class="navbar-nav d-flex flex-row align-items-center mb-0"
        style="gap: 5rem"
      >
        <li class="nav-item">
          <router-link
            to="/finance/list"
            class="nav-link d-flex align-items-center"
          >
            <img src="@/components/icons/nav/list.png" alt="list" />
            <i class="fas fa-list me-1"></i> 거래 내역
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/party/list"
            class="nav-link d-flex align-items-center"
          >
            <img src="@/components/icons/nav/party.png" alt="party" />
            <i class="fas fa-users me-1"></i> 파티 모집
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/profile" class="nav-link d-flex align-items-center">
            <img src="@/components/icons/nav/profile.png" alt="profile" />
            <i class="fas fa-user me-1"></i> 프로필 수정
          </router-link>
        </li>
      </ul>

      <!-- 등록하기 버튼 -->
      <router-link to="/finance/register" class="btn custom-register-btn">
        + 등록하기
      </router-link>
    </div>
  </nav>
</template>

<script setup>
// 없음
</script>

<style scoped>
.navbar {
  height: 90px;
}

.nav-link {
  font-weight: 700;
  color: #333;
  display: flex;
  align-items: center;
}

.nav-link.router-link-active {
  color: #003d0f;
  font-weight: bold;
}

/* ✅ 등록하기 버튼 스타일 */
.custom-register-btn {
  background-color: #71b548;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  padding: 8px 16px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.custom-register-btn:hover {
  background-color: #003d0f;
  color: #fff;
}
</style>
