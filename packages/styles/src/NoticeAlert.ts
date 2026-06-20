/* NoticeAlert — 인라인 안내/주의/에러 박스 (DS notice 패턴 구현체).
   Figma: 캐포비 Notice Alert (7dCJU5lNPfgcAjFPwbbLIu node 984:6787) + 트로스트 Alert 가이드
   (gC7CyAVloVvU896avolddQ node 5283:206).
   notice.md 패턴 SSOT 정합: padding 16 · gap 8 · min-height 52 · Body3 Medium ·
   info=중립 회색 / Notice=블루 / Caution=옐로우 / Success=그린 / Error=레드.
   프로젝트 분기는 슬롯으로 — Notice 색·본문 텍스트색은 var() 슬롯이라 프로젝트(트로스트=중립 톤)가
   값만 덮는다. error 만 본문 텍스트 기본값이 상태색(레드). 아이콘 색은 variant 별 status 토큰. */
import { cv, fontFamily, fontWeight, radius, typeScale } from "@nudge-design/tokens";

const NA_CLASS = "nds-notice-alert";
const NA_ICON_CLASS = `${NA_CLASS}__icon`;
const NA_MESSAGE_CLASS = `${NA_CLASS}__message`;

export const noticeAlertStyles = `
  :where(.${NA_CLASS}) {
    display: flex;
    align-items: center;
    /* gap 8 · padding 16 — notice.md 패턴 정합 (구 gap-default 10 / inset-input 12 에서 정렬) */
    gap: var(--semantic-gap-label);
    width: 100%;
    min-height: 52px;
    padding: var(--semantic-inset-card);
    /* radius 슬롯 — 프로젝트(지니어트·트로스트 = Shape/MD 8)가 override. 기본 lg(12). */
    border-radius: var(--nds-notice-alert-radius, ${radius.lg}px);
    box-sizing: border-box;
    font-family: ${fontFamily.web};
    font-size: ${typeScale.body3.fontSize}px;
    /* Body3 Medium — notice.md 패턴 */
    font-weight: ${fontWeight.medium};
    line-height: ${typeScale.body3.lineHeight}px;
  }

  /* ── variant 별 컨테이너 배경 / 본문 색 ──
     본문 색은 --nds-notice-alert-text 슬롯으로 — 프로젝트(트로스트=Text/Normal 통일)가 한 번에 덮는다.
     기본값은 variant 별 현행 유지(대부분 strong, error 만 status-error). */
  :where(.${NA_CLASS}[data-variant="info"]) {
    background: ${cv.surface.section};
    color: var(--nds-notice-alert-text, ${cv.textRole.strong});
  }
  :where(.${NA_CLASS}[data-variant="notice"]) {
    /* Notice 배경 — 패턴 기본 블루, 슬롯으로 프로젝트(트로스트=중립 subtle) override */
    background: var(--nds-notice-alert-notice-bg, ${cv.surface.statusInfo});
    color: var(--nds-notice-alert-text, ${cv.textRole.strong});
  }
  :where(.${NA_CLASS}[data-variant="caution"]) {
    /* Caution = 옐로우 (notice.md 패턴 · Figma). 구현 drift(회색 section) 정정 */
    background: ${cv.surface.statusCaution};
    color: var(--nds-notice-alert-text, ${cv.textRole.strong});
  }
  :where(.${NA_CLASS}[data-variant="success"]) {
    background: ${cv.surface.statusSuccess};
    color: var(--nds-notice-alert-text, ${cv.textRole.strong});
  }
  :where(.${NA_CLASS}[data-variant="error"]) {
    background: ${cv.surface.statusError};
    color: var(--nds-notice-alert-text, ${cv.textRole.statusError});
  }

  /* ── 좌측 status 아이콘 (20×20). 색은 variant 별 — glyph 는 currentColor ── */
  :where(.${NA_CLASS} .${NA_ICON_CLASS}) {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }
  :where(.${NA_CLASS}[data-variant="notice"] .${NA_ICON_CLASS}) {
    /* Notice 아이콘 색 — 패턴 기본 블루, 슬롯으로 프로젝트(트로스트=중립) override */
    color: var(--nds-notice-alert-notice-icon, ${cv.textRole.statusInfo});
  }
  :where(.${NA_CLASS}[data-variant="caution"] .${NA_ICON_CLASS}) {
    color: ${cv.iconRole.statusCaution};
  }
  :where(.${NA_CLASS}[data-variant="success"] .${NA_ICON_CLASS}) {
    color: ${cv.iconRole.statusSuccess};
  }
  :where(.${NA_CLASS}[data-variant="error"] .${NA_ICON_CLASS}) {
    color: ${cv.iconRole.statusError};
  }

  /* ── 본문 메시지 (여러 줄 허용) ── */
  :where(.${NA_CLASS} .${NA_MESSAGE_CLASS}) {
    flex: 1;
    min-width: 0;
    word-break: break-word;
    white-space: pre-line;
  }
`;
