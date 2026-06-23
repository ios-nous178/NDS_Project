/**
 * Layout primitives — 어드민/CMS/대시보드 목업에서 페이지 composition 시 반복적으로
 * 작성되던 raw CSS를 클래스로 흡수. mock-test/src 의 ~70% 가량을 차지하던 페이지
 * shell · section · form-row 패턴을 nds-* 클래스로 추출한 것.
 *
 * 컴포넌트 web-component (nds-shell 같은) 없이 **클래스만** 제공한다 — tree-shake
 * 손해는 있지만 web component 보일러플레이트 없이 즉시 적용 가능. 더 무거운 추상화가
 * 필요해지면 packages/html 쪽 컴포넌트로 승격.
 *
 * 사용:
 *   <div class="nds-shell">
 *     <aside class="nds-shell__sidebar">...</aside>
 *     <main class="nds-shell__main">
 *       <header class="nds-shell__topbar">
 *         <div class="nds-shell__topbar-title-group">
 *           <h1 class="nds-shell__topbar-title">제목</h1>
 *           <p class="nds-shell__topbar-subtitle">부제</p>
 *         </div>
 *         <div class="nds-shell__topbar-actions">...</div>
 *       </header>
 *       <div class="nds-shell__content">
 *         <section class="nds-section">
 *           <header class="nds-section__head">
 *             <h2 class="nds-section__title">섹션</h2>
 *             <p class="nds-section__caption">설명</p>
 *           </header>
 *           <div class="nds-section__body">
 *             <div class="nds-form-row">
 *               <label class="nds-form-row__label">필드</label>
 *               <div class="nds-form-row__control">...</div>
 *             </div>
 *           </div>
 *         </section>
 *       </div>
 *     </main>
 *   </div>
 */
import { cv, fontFamily, grid, radius, spacing } from "@nudge-design/tokens";

/* ─── Shell — 페이지 전체 레이아웃 (sidebar + main + topbar + content) ─── */

const SHELL_CLASS = "nds-shell";
const SHELL_SIDEBAR_CLASS = `${SHELL_CLASS}__sidebar`;
const SHELL_MAIN_CLASS = `${SHELL_CLASS}__main`;
const SHELL_TOPBAR_CLASS = `${SHELL_CLASS}__topbar`;
const SHELL_TOPBAR_TITLE_GROUP_CLASS = `${SHELL_CLASS}__topbar-title-group`;
const SHELL_TOPBAR_TITLE_CLASS = `${SHELL_CLASS}__topbar-title`;
const SHELL_TOPBAR_SUBTITLE_CLASS = `${SHELL_CLASS}__topbar-subtitle`;
const SHELL_TOPBAR_ACTIONS_CLASS = `${SHELL_CLASS}__topbar-actions`;
const SHELL_TABS_CLASS = `${SHELL_CLASS}__tabs`;
const SHELL_CONTENT_CLASS = `${SHELL_CLASS}__content`;

export const shellStyles = `
  :where(.${SHELL_CLASS}) {
    display: grid;
    /* 사이드바 트랙은 실제 사이드바 폭(nds-sidebar = 300px, collapsed 72px)에 맞춰 auto 로 사이징.
       과거 고정 240px 디폴트는 300px sidebar 가 트랙을 60px 넘쳐 본문을 가리는 회귀를 냈다
       (캐포비 어드민 '본문이 사이드바에 가려짐'). 커스텀 폭은 --nds-shell-sidebar-width 로 override. */
    grid-template-columns: var(--nds-shell-sidebar-width, auto) minmax(0, 1fr);
    min-height: 100vh;
    font-family: ${fontFamily.web};
    background: ${cv.surface.subtle};
    color: ${cv.textRole.normal};
  }

  /* sidebar slot — 폭만 정해주고 내용은 사용자가 (예: <nds-sidebar />) */
  :where(.${SHELL_SIDEBAR_CLASS}) {
    min-width: 0;
  }

  :where(.${SHELL_MAIN_CLASS}) {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  :where(.${SHELL_TOPBAR_CLASS}) {
    position: sticky;
    top: 0;
    z-index: 5;
    background: ${cv.surface.default};
    border-bottom: var(--stroke-default) solid ${cv.borderRole.normal};
    padding: var(--nds-shell-topbar-padding, 20px 32px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[24]}px;
  }

  :where(.${SHELL_TOPBAR_TITLE_GROUP_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[4]}px;
    min-width: 0;
  }

  :where(.${SHELL_TOPBAR_TITLE_CLASS}) {
    font-size: 24px;
    font-weight: 700;
    color: ${cv.textRole.strong};
    margin: 0;
    line-height: 1.3;
  }

  :where(.${SHELL_TOPBAR_SUBTITLE_CLASS}) {
    font-size: 14px;
    color: ${cv.textRole.subtle};
    margin: 0;
    line-height: 1.5;
  }

  :where(.${SHELL_TOPBAR_ACTIONS_CLASS}) {
    display: flex;
    gap: ${spacing[8]}px;
    align-items: center;
    flex-shrink: 0;
  }

  /* tabs slot — topbar 바로 아래 sticky 탭 영역 (선택) */
  :where(.${SHELL_TABS_CLASS}) {
    background: ${cv.surface.default};
    border-bottom: var(--stroke-default) solid ${cv.borderRole.normal};
    padding: 0 var(--nds-shell-content-padding-x, 32px);
  }

  /* content — main + 선택적 aside grid. data-aside="false" 또는 --single variant 로 단일 컬럼 */
  :where(.${SHELL_CONTENT_CLASS}) {
    padding: var(--nds-shell-content-padding, 32px);
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--nds-shell-aside-width, 320px);
    gap: ${spacing[24]}px;
    align-items: start;
  }

  :where(.${SHELL_CONTENT_CLASS}[data-aside="false"]),
  :where(.${SHELL_CONTENT_CLASS}.${SHELL_CONTENT_CLASS}--single) {
    grid-template-columns: minmax(0, 1fr);
  }

  @media (max-width: 1023px) {
    :where(.${SHELL_CLASS}) {
      grid-template-columns: 1fr;
    }
    :where(.${SHELL_CONTENT_CLASS}) {
      grid-template-columns: minmax(0, 1fr);
    }
  }
`;

/* ─── Section — 본문 안 흰 카드 (head / body / title / caption / stack 변형) ─── */

const SECTION_CLASS = "nds-section";
const SECTION_HEAD_CLASS = `${SECTION_CLASS}__head`;
const SECTION_TITLE_CLASS = `${SECTION_CLASS}__title`;
const SECTION_CAPTION_CLASS = `${SECTION_CLASS}__caption`;
const SECTION_BODY_CLASS = `${SECTION_CLASS}__body`;

export const sectionStyles = `
  :where(.${SECTION_CLASS}) {
    background: ${cv.surface.default};
    border: var(--stroke-default) solid ${cv.borderRole.normal};
    border-radius: var(--nds-section-radius, ${radius[12]}px);
    overflow: hidden;
    font-family: ${fontFamily.web};
  }

  /* --stack: 자식들 사이에 세로 간격 자동 부여 (margin-top trick) */
  :where(.${SECTION_CLASS}.${SECTION_CLASS}--stack) > * + * {
    margin-top: ${spacing[20]}px;
  }

  :where(.${SECTION_HEAD_CLASS}) {
    padding: var(--nds-section-head-padding, 20px 24px 4px);
  }

  :where(.${SECTION_TITLE_CLASS}) {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
    color: ${cv.textRole.strong};
    line-height: 1.4;
  }

  :where(.${SECTION_CAPTION_CLASS}) {
    font-size: 13px;
    color: ${cv.textRole.subtle};
    margin: ${spacing[4]}px 0 0;
    line-height: 1.5;
  }

  :where(.${SECTION_BODY_CLASS}) {
    padding: var(--nds-section-body-padding, 8px 24px 24px);
  }
`;

/* ─── FormRow — 라벨 + 컨트롤 2-컬럼 grid (admin/CMS 폼 행) ─── */

const FORM_ROW_CLASS = "nds-form-row";
const FORM_ROW_LABEL_CLASS = `${FORM_ROW_CLASS}__label`;
const FORM_ROW_CONTROL_CLASS = `${FORM_ROW_CLASS}__control`;
const FORM_ROW_HINT_CLASS = `${FORM_ROW_CLASS}__hint`;

export const formRowStyles = `
  :where(.${FORM_ROW_CLASS}) {
    display: grid;
    grid-template-columns: var(--nds-form-row-label-width, 140px) minmax(0, 1fr);
    align-items: flex-start;
    gap: var(--nds-form-row-gap, ${spacing[20]}px);
    padding: ${spacing[20]}px 0;
    border-top: var(--stroke-default) solid ${cv.borderRole.subtle};
    font-family: ${fontFamily.web};
  }

  :where(.${FORM_ROW_CLASS}:first-child) {
    border-top: 0;
  }

  :where(.${FORM_ROW_LABEL_CLASS}) {
    font-size: 14px;
    font-weight: 600;
    color: ${cv.textRole.normal};
    padding-top: ${spacing[12]}px;
    line-height: 1.4;
  }

  /* 필수 표시 — <span class="nds-form-row__label-required">*</span> */
  :where(.${FORM_ROW_LABEL_CLASS}-required) {
    color: ${cv.textRole.statusError};
    margin-left: ${spacing[2]}px;
  }

  :where(.${FORM_ROW_CONTROL_CLASS}) {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
  }

  :where(.${FORM_ROW_HINT_CLASS}) {
    font-size: 13px;
    color: ${cv.textRole.subtle};
    line-height: 1.5;
  }
`;

/* ─── Container — 컨텐츠 가로 폭을 viewport 안에 가두는 반응형 래퍼 (Figma 1385:13).
   PC ≥1024: max 1200 · 좌우 40 / Tablet 768~1023: max 768 · 좌우 24 / Mobile <768: 100% · 좌우 16.
   Layout primitive 컨벤션대로 web component 없이 클래스만 — `<div class="nds-container">…`.
   Section(세로 블록)은 컴포넌트화하지 않고 룰만 — get_guide({ topic: 'pattern:container-section' }).

   Trost device-variant 모디파이어 (Figma 5303:111, opt-in, 가산) — 기존 base 디폴트(1200/반응형)는
   그대로 두고 클래스 추가로만 적용한다. 다른 프로젝트는 base 를 그대로 쓰므로 영향 없음.
   - .nds-container--pc    : Trost PC 일반 컨텐츠 (max 1080 · 좌우 24)
   - .nds-container--wide  : Trost PC-Wide 테이블/대시보드 (max 1200 · 좌우 24)
   둘 다 모바일(<768)에서는 base 와 동일하게 100% / 좌우 16 으로 collapse. ─── */

const CONTAINER_CLASS = "nds-container";
const CONTAINER_PC_CLASS = `${CONTAINER_CLASS}--pc`;
const CONTAINER_WIDE_CLASS = `${CONTAINER_CLASS}--wide`;
const CONTAINER_RUNMILE_CLASS = `${CONTAINER_CLASS}--runmile`;
const SECTION_SURFACE_CLASS = "nds-section-surface";

export const containerStyles = `
  :where(.${CONTAINER_CLASS}) {
    width: 100%;
    max-width: ${grid.desktop.contentWidth}px;
    margin-inline: auto;
    padding-inline: ${spacing[40]}px;
    box-sizing: border-box;
  }

  /* Tablet — 768~1023 */
  @media (max-width: 1023px) {
    :where(.${CONTAINER_CLASS}) {
      max-width: 768px;
      padding-inline: ${spacing[24]}px;
    }
  }

  /* Mobile — <768 */
  @media (max-width: 767px) {
    :where(.${CONTAINER_CLASS}) {
      max-width: 100%;
      padding-inline: ${spacing[16]}px;
    }
  }

  /* ── Trost device-variant 모디파이어 (opt-in) ──
     base/Tablet 룰보다 source-order 뒤에 와 같은 0-특정성(:where)을 이긴다. */
  :where(.${CONTAINER_PC_CLASS}) {
    max-width: 1080px;
    padding-inline: ${spacing[24]}px;
  }

  :where(.${CONTAINER_WIDE_CLASS}) {
    max-width: ${grid.desktop.contentWidth}px;
    padding-inline: ${spacing[24]}px;
  }

  /* ── 런마일 device-variant 모디파이어 (opt-in) — Figma Section/Container (5070:2):
     콘텐츠 max 1280 · 좌우 패딩 PC 80 (모바일은 base 16 으로 collapse). ── */
  :where(.${CONTAINER_RUNMILE_CLASS}) {
    max-width: 1280px;
    padding-inline: ${spacing[80]}px;
  }

  /* 모바일(<768) — 모디파이어도 base 와 동일하게 full-bleed + 좌우 16 */
  @media (max-width: 767px) {
    :where(.${CONTAINER_PC_CLASS}),
    :where(.${CONTAINER_WIDE_CLASS}),
    :where(.${CONTAINER_RUNMILE_CLASS}) {
      max-width: 100%;
      padding-inline: ${spacing[16]}px;
    }
  }
`;

/* ─── Section surface — 가산 content-surface 헬퍼 (Figma 5303:111).
   Section(BG/Section/Default) 위에 올리는 흰 컨텐츠 카드(BG/Surface/Default + radius 16).
   .nds-container 자체에 bg/radius 를 굽지 않는다 — 필요할 때만 이 클래스를 붙인다.
   PC 16 radius / Mobile 0 은 페이지 디자인에서 모디파이어/래퍼로 선택(가이드 참조). ─── */

export const sectionSurfaceStyles = `
  :where(.${SECTION_SURFACE_CLASS}) {
    background: var(--semantic-bg-surface-default);
    border-radius: ${radius[16]}px;
  }
`;

/* ─── Grid — 다열 카드/타일 그리드 (홈·마이페이지·갤러리 등) ───
   목업 AI 가 그리드형 홈을 만들 때 매번 raw `display:grid` 를 손코딩하던 문제를 흡수.
   Layout primitive 컨벤션대로 web component 없이 클래스만 — `<div class="nds-grid" data-cols="3">…`.
   자식은 보통 <nds-card>/Card 셀. 패턴 가이드: get_guide({ topic: 'pattern:card-grid' }).

   API (전부 0-특정성 :where, 토큰 기반):
   - data-cols="2|3|4"  : 고정 열 수 (기본 2). 자동 반응형 — 태블릿(≤1023) 3·4열→2, 모바일(<768)→1열.
   - data-cols="auto"   : 미디어쿼리 없이 폭에 맞춰 auto-fill. 셀 최소폭 --nds-grid-min(기본 160px).
                          (모바일 1열 강제 제외 — 자연 collapse.)
   - --nds-grid-gap     : 간격 override (기본 --semantic-gap-loose=16). data-gap="wide" 로 24 즉시 적용.
   - --nds-grid-cols    : 인라인 custom prop 로 직접 박으면(예: style="--nds-grid-cols:2") 미디어쿼리(stylesheet)
                          를 이겨 열 수를 고정 — 모바일에서도 다열 유지가 필요한 quick-action 류 이스케이프 해치.
   item 은 minmax(0,1fr) 로 min-width:0 이 적용돼 긴 텍스트가 트랙을 밀어 깨지지 않는다.

   ⚠ 아이콘+라벨 "빠른 액션" 작은 셀 그리드는 모바일에서도 다열 유지가 보통이라 별도 패턴
   (get_guide({ topic: 'pattern:quick-action-grid' })) 를 쓴다 — 이 .nds-grid 는 콘텐츠 카드용. ─── */

const GRID_CLASS = "nds-grid";

export const gridStyles = `
  :where(.${GRID_CLASS}) {
    display: grid;
    gap: var(--nds-grid-gap, var(--semantic-gap-loose));
    grid-template-columns: repeat(var(--nds-grid-cols, 2), minmax(0, 1fr));
  }

  /* 간격 편의 모디파이어 */
  :where(.${GRID_CLASS}[data-gap="wide"]) {
    --nds-grid-gap: var(--semantic-gap-wide);
  }
  :where(.${GRID_CLASS}[data-gap="tight"]) {
    --nds-grid-gap: var(--semantic-gap-comfortable);
  }

  /* 고정 열 수 */
  :where(.${GRID_CLASS}[data-cols="2"]) { --nds-grid-cols: 2; }
  :where(.${GRID_CLASS}[data-cols="3"]) { --nds-grid-cols: 3; }
  :where(.${GRID_CLASS}[data-cols="4"]) { --nds-grid-cols: 4; }

  /* auto-fill — 미디어쿼리 없이 폭에 맞춰 열 수 자동 (반응형 카드 그리드에 가장 견고) */
  :where(.${GRID_CLASS}[data-cols="auto"]) {
    grid-template-columns: repeat(auto-fill, minmax(var(--nds-grid-min, 160px), 1fr));
  }

  /* 반응형 collapse — 태블릿에서 3·4열은 2열로 */
  @media (max-width: 1023px) {
    :where(.${GRID_CLASS}[data-cols="3"]),
    :where(.${GRID_CLASS}[data-cols="4"]) {
      --nds-grid-cols: 2;
    }
  }

  /* 모바일 — auto 모드 제외하고 1열 fallback (카드가 짓눌려 글자가 세로로 쪼개지는 것 방지) */
  @media (max-width: 767px) {
    :where(.${GRID_CLASS}:not([data-cols="auto"])) {
      --nds-grid-cols: 1;
    }
  }
`;
