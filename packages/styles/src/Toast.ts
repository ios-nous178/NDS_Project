/* CSS SSOT for Toast — shared by @nudge-design/react <Toast> and @nudge-design/html <nds-toast>. */
import { cv, fontFamily, fontWeight, radius, spacing, transition, typeScale, zIndex } from "@nudge-design/tokens";

const TOAST_CLASS = "nds-toast";
const TOAST_VIEWPORT_CLASS = `${TOAST_CLASS}__viewport`;
const TOAST_ITEM_CLASS = `${TOAST_CLASS}__item`;
const TOAST_MESSAGE_CLASS = `${TOAST_CLASS}__message`;

export const toastStyles = `
  :where(.${TOAST_VIEWPORT_CLASS}) {
    position: fixed;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--semantic-gap-default);
    z-index: ${zIndex.toast};
    pointer-events: none;
    box-sizing: border-box;
  }

  /* PC · 상단 중앙 · safe area 상단 80 · 좌우 auto (Figma Position=Top). */
  :where(.${TOAST_VIEWPORT_CLASS}[data-position="top"]) {
    top: 0;
    padding-top: ${spacing[80]}px;
  }

  /* 모바일 · 하단 중앙 · safe area 하단 96 · 좌우 16 (Figma Position=Bottom). */
  :where(.${TOAST_VIEWPORT_CLASS}[data-position="bottom"]) {
    bottom: 0;
    padding-bottom: 96px;
    padding-left: ${spacing[16]}px;
    padding-right: ${spacing[16]}px;
  }

  /*
   * Toast item — 단일 다크 스타일 (Figma 1330:2). 색 변형(success/error…) 없음:
   * 비차단형 피드백 전용이며 심각한 알림은 Modal/Alert 로 라우팅한다.
   * bg/shadow(#212121·0.92 / y8 blur12 18%)는 role-based 시멘틱 변수(Figma SSOT) 집합 밖이라
   * --nds-toast-* 컴포넌트 슬롯으로 토큰화 — 값 SSOT 는 tokens/src/brands/nudge-eap.ts (:root emit).
   */
  :where(.${TOAST_ITEM_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
    max-width: 400px;
    padding: var(--semantic-inset-input) var(--semantic-inset-card-large);
    border-radius: 24px;
    background: var(--nds-toast-bg);
    color: ${cv.textRole.inverse};
    box-shadow: var(--nds-toast-shadow);
    font-family: ${fontFamily.web};
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: ${typeScale.body3.lineHeight}px;
    pointer-events: auto;
    box-sizing: border-box;
  }

  /* PC(top) 는 pill + 더 큰 패딩/타이포 (Figma Position=Top: pill · 16/32 · body2). */
  :where(.${TOAST_VIEWPORT_CLASS}[data-position="top"] .${TOAST_ITEM_CLASS}) {
    border-radius: ${radius.pill}px;
    padding: var(--semantic-inset-card) ${spacing[32]}px;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
  }

  :where(.${TOAST_ITEM_CLASS}[data-entering="true"]) {
    animation: nds-toast-enter ${transition.default};
  }

  :where(.${TOAST_ITEM_CLASS}[data-exiting="true"]) {
    animation: nds-toast-exit 0.4s ease forwards;
  }

  :where(.${TOAST_MESSAGE_CLASS}) {
    flex: 1;
    min-width: 0;
    text-align: center;
    white-space: pre-line;
  }

  @keyframes nds-toast-enter {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes nds-toast-exit {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(8px); }
  }
`;
