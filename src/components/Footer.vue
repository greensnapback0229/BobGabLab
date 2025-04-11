<template>
  <footer class="footer-wrapper">
    <div class="footer-content">
      <!-- 첫 번째 섹션: 로고(왼쪽), 회사 정보(오른쪽) -->
      <div class="footer-section company-info">
        <img
          src="@/components/icons/logo1.png"
          alt="MealLab 로고"
          class="footer-logo"
        />
        <div class="company-text">
          <p class="footer-title">MealLab</p>
          <p>
            상호명 및 호스팅 서비스 제공: 주식회사 meallab <br />
            대표이사: 서승준 <br />
            주소: 서울특별시 광진구 능동로 195-16 602호
          </p>
        </div>
      </div>

      <!-- 두 번째 섹션: 고객센터 -->
      <div class="footer-section">
        <p class="footer-title">고객센터</p>
        <p>
          고객 문의:
          <a href="mailto:help@meallab.site">help@meallab.site</a> <br />
          협업 문의:
          <a href="mailto:contact@meallab.site">contact@meallab.site</a> <br />
          마케팅 문의:
          <a href="mailto:marketing@meallab.site">marketing@meallab.site</a>
        </p>
      </div>

      <!-- 세 번째 섹션: 피드백 제출 -->
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

/* 세 섹션을 동일 간격으로 배치 및 gap: 8rem 유지 */
.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 8rem;
  justify-content: space-evenly;
  padding-bottom: 1.5rem;
}

/* 공통 섹션 스타일 */
.footer-section {
  flex: 1 1 300px;
  min-width: 260px;
}

/* 로고와 텍스트를 나란히 배치 */
.company-info {
  display: flex;
  align-items: flex-start;
  gap: 3rem;
}

/* 로고 크기 지정 및 음수 마진 제거 */
.footer-logo {
  width: 130px;
  height: 130px;
  object-fit: contain;
  margin-left: -5cm;
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
