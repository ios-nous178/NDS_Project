/* NoticeAlert — 인라인 안내/주의/에러 박스 (DS notice 패턴 구현체).
   Figma: 캐포비 Notice Alert (7dCJU5lNPfgcAjFPwbbLIu node 3902:1212).
   info/caution = 중립 회색 배경, notice/success/error = 상태 tinted 배경.
   error 만 본문 텍스트도 상태색(레드). 아이콘 색은 variant 별 status 토큰. */
import { cv, fontFamily, fontWeight, radius, typeScale } from "@nudge-design/tokens";

const NA_CLASS = "nds-notice-alert";
const NA_ICON_CLASS = `${NA_CLASS}__icon`;
const NA_MESSAGE_CLASS = `${NA_CLASS}__message`;

export const noticeAlertStyles = `
  :where(.${NA_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    width: 100%;
    min-height: 48px;
    padding: var(--semantic-inset-input) var(--semantic-inset-card);
    /* radius 슬롯 — 브랜드(지니어트 Alert 가이드 1054:30 = Shape/MD 8)가 override. 기본 lg(12). */
    border-radius: var(--nds-notice-alert-radius, ${radius.lg}px);
    box-sizing: border-box;
    font-family: ${fontFamily.web};
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body3.lineHeight}px;
  }

  /* ── variant 별 컨테이너 배경 / 본문 색 ── */
  :where(.${NA_CLASS}[data-variant="info"]) {
    background: ${cv.surface.section};
    color: ${cv.textRole.strong};
  }
  :where(.${NA_CLASS}[data-variant="notice"]) {
    background: ${cv.surface.statusInfo};
    color: ${cv.textRole.strong};
  }
  :where(.${NA_CLASS}[data-variant="caution"]) {
    background: ${cv.surface.section};
    color: ${cv.textRole.strong};
  }
  :where(.${NA_CLASS}[data-variant="success"]) {
    background: ${cv.surface.statusSuccess};
    color: ${cv.textRole.strong};
  }
  :where(.${NA_CLASS}[data-variant="error"]) {
    background: ${cv.surface.statusError};
    color: ${cv.textRole.statusError};
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
    color: ${cv.textRole.statusInfo};
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
