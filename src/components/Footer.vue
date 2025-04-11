<template>
  <footer class="footer-wrapper">
    <div class="footer-content">
      <!-- 첫 번째 섹션: 로고와 회사 정보 (텍스트만 가운데 정렬) -->
      <div class="footer-section company-info">
        <img
          src="@/components/icons/logo1.png"
          alt="MealLab 로고"
          class="footer-logo"
        />
        <div>
          <p class="footer-title">MealLab</p>
          <p>
            상호명 및 호스팅 서비스 제공: 주식회사 meallab <br />
            대표이사: Aiden Seo (@서승준_전공 15회차)<br />
            주소: 서울특별시 광진구 능동로 195-16 602호
          </p>
        </div>
      </div>

      <!-- 두 번째 섹션: 고객센터 -->
      <div class="footer-section">
        <p class="footer-title">고객센터</p>
        <p>
          Kevin Kim
          <a>: @김영오_전공 15회차</a> <br />
          Elodie Kim
          <a>: @김은지_전공 15회차</a> <br />
          Clara You
          <a>: @유예원_전공 15회차</a> <br />
        </p>
      </div>

      <!-- 세 번째 섹션: 고객의 소리 -->
      <div class="footer-section">
        <p class="footer-title">고객의 소리</p>
        <p>
          의견 제출:
          <a
            href="https://naver.me/xY4hDh9H"
            target="_blank"
            rel="noopener noreferrer"
            >https://naver.me/xY4hDh9H</a
          >
        </p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2025 MealLab. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
// 로직 없음
</script>

<style scoped>
.footer-wrapper {
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  padding: 2rem 1rem 1rem;
  color: #555;
  font-size: 0.9rem;
}

/* 각 섹션에 동일한 패딩 값 부여 */
.footer-section {
  padding: 1rem;
}

/* 섹션들을 가운데 정렬하며 gap: 8rem 유지 */
.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5rem;
  padding-bottom: 1.5rem;
}

/* 회사 정보 섹션 - 로고는 그대로, 텍스트는 가운데 정렬 */
.company-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.footer-logo {
  width: 130px;
  height: 130px;
  object-fit: contain;
  margin-left: -5cm; /* 사진은 그대로 */
  margin-right: 3cm;
}

/* 타이틀 스타일 */
.footer-title {
  font-weight: bold;
  margin-bottom: 0.8rem;
  color: #333;
}

/* 링크 스타일 (모든 .footer-section 내 a 태그에 적용) */
.footer-section a {
  color: #333;
  text-decoration: none;
}
.footer-section a:hover {
  text-decoration: underline;
}

/* 하단 copyright 영역 */
.footer-bottom {
  border-top: 1px solid #ccc;
  text-align: center;
  padding-top: 1rem;
  color: #999;
  font-size: 0.85rem;
}
</style>
