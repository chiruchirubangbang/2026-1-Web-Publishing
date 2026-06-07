/* ============================================================
   a.p. coffee&bakery — main.js
   ============================================================ */

/* ──────────────────────────────────────────
   1. 내비게이션 바: 스크롤 감지
────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* ──────────────────────────────────────────
   2. 갤러리 스크롤 애니메이션
────────────────────────────────────────── */
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 0.07}s`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

galleryItems.forEach((item) => observer.observe(item));


/* ──────────────────────────────────────────
   3. 내비게이션 링크: 현재 페이지 활성화 표시
────────────────────────────────────────── */
const navLinks = document.querySelectorAll('.nav-link');
const currentPath = window.location.pathname.split('/').pop();

navLinks.forEach((link) => {
  if (link.getAttribute('href') === currentPath) {
    link.classList.add('active');
  }
});


/* ──────────────────────────────────────────
   4. 이미지 로드 실패 시 플레이스홀더 처리
────────────────────────────────────────── */
const galleryImages = document.querySelectorAll('.img-item img');

galleryImages.forEach((img) => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
    img.parentElement.style.background = '#e8e4dc';
    img.parentElement.style.display = 'flex';
    img.parentElement.style.alignItems = 'center';
    img.parentElement.style.justifyContent = 'center';

    const placeholder = document.createElement('span');
    placeholder.textContent = '📷 사진 준비 중';
    placeholder.style.cssText = `
      font-family: sans-serif;
      font-size: 13px;
      color: #aaa;
      letter-spacing: 0.05em;
    `;
    img.parentElement.appendChild(placeholder);
  });
});


/* ──────────────────────────────────────────
   5. 커스텀 마우스 포인터
   ✏️ 커서 이미지 경로는 HTML의 id="custom-cursor" img src 속성에서 설정하세요.
   호버 효과: 링크·버튼 위에서 .is-hovering 클래스가 붙어 커서가 살짝 커집니다.
   CSS의 #custom-cursor.is-hovering { transform: ... scale(1.3); } 에서 크기 조절 가능.
────────────────────────────────────────── */
const cursor = document.getElementById('custom-cursor');

// 마우스 이동 시 커서 위치 업데이트
document.addEventListener('mousemove', (e) => {
  // style.left/top 대신 CSS transform으로 위치 지정 → 더 부드럽게 움직임
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

// 클릭 가능한 요소(a, button, [data-lightbox]) 위에서 커서 모양 변경
const hoverTargets = document.querySelectorAll('a, button, [data-lightbox], .program-card');

hoverTargets.forEach((el) => {
  el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
});

// 페이지 밖으로 마우스가 나가면 커서 숨김
document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });


/* ──────────────────────────────────────────
   6. 라이트박스 (사진 크게 보기)
   ✏️ 각 사진 div의 data-caption 속성에 출처를 적으면 사진 아래에 표시됩니다.
      예: data-caption="ⓒ a.p. coffee&bakery"
   ✏️ 라이트박스를 열지 않을 항목: data-lightbox 속성을 추가하지 않으면 제외됩니다.
      (현재 item-logotype은 data-lightbox 없이 제외되어 있어요.)
────────────────────────────────────────── */
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightbox-img');
const lightboxCap  = document.getElementById('lightbox-caption');
const btnClose     = document.getElementById('lightbox-close');
const btnPrev      = document.getElementById('lightbox-prev');
const btnNext      = document.getElementById('lightbox-next');

// data-lightbox 속성이 있는 사진 아이템만 수집 (순서대로)
const lightboxItems = Array.from(document.querySelectorAll('[data-lightbox]'));
let currentIndex = 0;

/* 라이트박스 열기 */
function openLightbox(index) {
  currentIndex = index;
  const item    = lightboxItems[currentIndex];
  const imgEl   = item.querySelector('img');
  const caption = item.dataset.caption || '';

  // 사진 교체 시 페이드 애니메이션을 위해 클래스 초기화
  lightboxImg.classList.remove('is-loaded');

  lightboxImg.src = imgEl.src;
  lightboxImg.alt = imgEl.alt;
  lightboxCap.textContent = caption;

  // 이미지 로드 완료 후 페이드인
  lightboxImg.onload = () => lightboxImg.classList.add('is-loaded');
  // 이미 캐시된 경우 onload가 안 터질 수 있어서 바로 체크
  if (lightboxImg.complete) lightboxImg.classList.add('is-loaded');

  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden'; // 뒷 배경 스크롤 잠금
}

/* 라이트박스 닫기 */
function closeLightbox() {
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

/* 이전/다음 이동 */
function showPrev() {
  currentIndex = (currentIndex - 1 + lightboxItems.length) % lightboxItems.length;
  openLightbox(currentIndex);
}

function showNext() {
  currentIndex = (currentIndex + 1) % lightboxItems.length;
  openLightbox(currentIndex);
}

/* 갤러리 사진 클릭 → 라이트박스 열기 */
lightboxItems.forEach((item, index) => {
  item.style.cursor = 'none'; // 커스텀 커서 유지
  item.addEventListener('click', () => openLightbox(index));
});

/* 버튼 이벤트 */
btnClose.addEventListener('click', closeLightbox);
btnPrev.addEventListener('click', showPrev);
btnNext.addEventListener('click', showNext);

/* 오버레이 배경 클릭 시 닫기 (사진/버튼 클릭은 제외) */
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* 키보드 단축키 지원
   ESC → 닫기 / 왼쪽 화살표 → 이전 / 오른쪽 화살표 → 다음 */
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showPrev();
  if (e.key === 'ArrowRight') showNext();
});


/* ──────────────────────────────────────────
   7. 탭 뷰 전환 (홈 ↔ 메뉴 ↔ 프로그램)
   ─ nav-link를 클릭하면 href에 따라 해당 #view-* 섹션을 표시합니다.
   ─ href가 외부 URL(http)이거나 대응하는 뷰가 없으면 기본 링크로 동작합니다.
   ─ 뷰 id 규칙: href="menu.html" → id="view-menu"
                  href="program.html" → id="view-program"
                  href="index.html"   → id="view-home"
────────────────────────────────────────── */

// href → view id 매핑 테이블
const VIEW_MAP = {
  'index.html': 'view-home',
  'menu.html':  'view-menu',
  'program.html': 'view-program',
};

const allViews   = document.querySelectorAll('.page-view');
const allNavLinks = document.querySelectorAll('.nav-link');

function switchView(targetViewId, clickedLink) {
  // 모든 뷰 숨기기
  allViews.forEach(v => v.classList.remove('is-active'));
  // 모든 nav-link 활성 해제
  allNavLinks.forEach(l => l.classList.remove('is-current'));

  // 타겟 뷰 표시
  const targetView = document.getElementById(targetViewId);
  if (targetView) {
    targetView.classList.add('is-active');
    // 뷰 전환 시 맨 위로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 클릭한 링크 활성화
  if (clickedLink) clickedLink.classList.add('is-current');
}

// nav-link 클릭 이벤트 등록
allNavLinks.forEach(link => {
  const href = link.getAttribute('href');
  const viewId = VIEW_MAP[href];

  if (viewId) {
    // 내부 뷰 전환 링크
    link.addEventListener('click', (e) => {
      e.preventDefault();          // 페이지 이동 차단
      switchView(viewId, link);
    });
  }
  // viewId가 없으면 (외부 URL 등) 기본 동작 유지
});

// 페이지 첫 진입 시 홈 뷰를 기본 활성화
switchView('view-home', document.querySelector('.nav-link[href="index.html"]'));


/* ──────────────────────────────────────────
   8. 프로그램 세부 페이지 (별도 뷰 이동)
   ─ 포스터(.program-card[data-program-trigger])를 클릭하면
     그리드 뷰(#view-program) 대신 #view-program-detail 뷰로 이동합니다.
   ─ 데이터는 <template id="program-data-N"> 요소의 data-* 속성에서 읽어옵니다.
   ─ '← 목록으로' 버튼을 누르면 다시 포스터 그리드로 돌아갑니다.
────────────────────────────────────────── */
const programDetailImg  = document.getElementById('program-detail-img');
const programDetailName = document.getElementById('program-detail-name');
const programDetailMeta = document.getElementById('program-detail-meta');
const programDetailDesc = document.getElementById('program-detail-desc');
const programDetailBack = document.getElementById('program-detail-back');

// Program 탭 nav-link — 세부 페이지에서도 'Program'을 현재 탭으로 유지하기 위해 사용
const programNavLink = document.querySelector('.nav-link[href="program.html"]');

/* HTML 엔티티(&lt; &gt;)를 실제 HTML 태그로 복원하는 헬퍼 */
function unescapeHtml(str) {
  return str
    .replace(/&lt;/g,  '<')
    .replace(/&gt;/g,  '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .trim();
}

/* 세부 페이지 내용 채우고 해당 뷰로 이동 */
function openProgramDetail(id) {
  const tmpl = document.getElementById('program-data-' + id);
  if (!tmpl) return;

  const d = tmpl.dataset;

  // 포스터 이미지
  programDetailImg.src = d.programImg || '';
  programDetailImg.alt = d.programImgAlt || '';

  // 프로그램 이름
  programDetailName.textContent = d.programName || '';

  // 중요 정보 / 소개 내용: data-* 속성값(&lt;p&gt;...&lt;/p&gt;)을 실제 HTML로 변환해 주입
  programDetailMeta.innerHTML = unescapeHtml(d.programMeta || '');
  programDetailDesc.innerHTML = unescapeHtml(d.programDesc || '');

  // 별도 뷰로 전환 (switchView는 위 7번 섹션에 정의되어 있음)
  // 두 번째 인자로 Program 링크를 넘겨 'Program' 탭을 현재 탭으로 표시
  switchView('view-program-detail', programNavLink);
}

/* 포스터 카드 클릭 → 세부 페이지로 이동 */
document.querySelectorAll('[data-program-trigger]').forEach(card => {
  card.addEventListener('click', () => {
    openProgramDetail(card.dataset.programTrigger);
  });
});

/* '← 목록으로' 버튼 → 포스터 그리드 뷰로 복귀 */
if (programDetailBack) {
  programDetailBack.addEventListener('click', () => {
    switchView('view-program', programNavLink);
  });
}
