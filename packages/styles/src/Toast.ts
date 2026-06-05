/* Auto-generated from packages/react/src/Toast.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, transition, typeScale, zIndex } from "@nudge-design/tokens";

const TOAST_CLASS = "nds-toast";
const TOAST_VIEWPORT_CLASS = `${TOAST_CLASS}__viewport`;
const TOAST_ITEM_CLASS = `${TOAST_CLASS}__item`;
const TOAST_ICON_CLASS = `${TOAST_CLASS}__icon`;
const TOAST_MESSAGE_CLASS = `${TOAST_CLASS}__message`;
const TOAST_ACTION_CLASS = `${TOAST_CLASS}__action`;
const TOAST_CLOSE_CLASS = `${TOAST_CLASS}__close`;

export const toastStyles = `
  :where(.${TOAST_VIEWPORT_CLASS}) {
    position: fixed;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--semantic-gap-default);
    padding: var(--semantic-inset-card);
    z-index: ${zIndex.toast};
    pointer-events: none;
    box-sizing: border-box;
  }

  :where(.${TOAST_VIEWPORT_CLASS}[data-position="top"]) {
    top: 0;
  }

  :where(.${TOAST_VIEWPORT_CLASS}[data-position="bottom"]) {
    bottom: 0;
  }

  /* 우측 상단 고정 (캐포비 admin). 가로 중앙 정렬 대신 오른쪽 정렬 — viewport 패딩이 top/right 오프셋을 만든다. */
  :where(.${TOAST_VIEWPORT_CLASS}[data-position="top-right"]) {
    top: 0;
    align-items: flex-end;
  }

  :where(.${TOAST_ITEM_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
    max-width: var(--nds-toast-max-width, 400px);
    padding: var(--nds-toast-padding, var(--semantic-inset-input) var(--semantic-inset-card-large));
    border-radius: var(--nds-toast-radius, 22px);
    font-family: ${fontFamily.web};
    font-size: var(--nds-toast-font-size, ${typeScale.body3.fontSize}px);
    font-weight: var(--nds-toast-font-weight, ${fontWeight.regular});
    line-height: ${typeScale.body3.lineHeight}px;
    box-shadow: var(--nds-toast-shadow, none);
    pointer-events: auto;
    box-sizing: border-box;
  }

  :where(.${TOAST_ITEM_CLASS}[data-variant="default"]) {
    background: var(--nds-toast-background, rgba(17, 17, 17, 0.8));
    color: ${cv.textRole.inverse};
  }

  :where(.${TOAST_ITEM_CLASS}[data-variant="success"]) {
    background: ${cv.surface.statusSuccess};
    color: ${cv.iconRole.statusSuccess};
  }

  :where(.${TOAST_ITEM_CLASS}[data-variant="error"]) {
    background: ${cv.surface.statusError};
    color: ${cv.textRole.statusError};
  }

  :where(.${TOAST_ITEM_CLASS}[data-variant="warning"]) {
    background: ${cv.surface.statusCaution};
    color: ${cv.textRole.statusCaution};
  }

  :where(.${TOAST_ITEM_CLASS}[data-variant="info"]) {
    background: ${cv.surface.statusInfo};
    color: ${cv.textRole.brand};
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

  :where(.${TOAST_ACTION_CLASS}) {
    flex-shrink: 0;
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.bold};
    color: inherit;
    padding: 0;
    text-decoration: underline;
  }

  /* status 아이콘 / 닫기 X 는 기본 숨김 — base 다크 pill 외관 유지. 캐포비 흰 카드에서만 노출. */
  :where(.${TOAST_ICON_CLASS}),
  :where(.${TOAST_CLOSE_CLASS}) {
    display: none;
  }

  /* ── 캐포비(cashwalk-biz) admin 토스트 — 흰 카드 (Figma 3001:51644) ──
     base 는 다크 pill(radius 22)·state 별 옅은색 배경이지만, 캐포비는 모든 state 가
     '흰 배경 + 그림자 카드 + 좌측 status 아이콘(색만 state 별) + 검정 메시지'.
     data-brand="cashwalk-biz" cascade 로 흰 카드 토큰을 주입한다. */
  :where([data-brand="cashwalk-biz"]) {
    --nds-toast-background: ${cv.surface.default};
    --nds-toast-radius: 8px;
    --nds-toast-padding: 16px;
    --nds-toast-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    --nds-toast-font-size: ${typeScale.body2.fontSize}px;
    --nds-toast-font-weight: ${fontWeight.medium};
  }
  /* state 무관 흰 배경 + 검정 메시지(좌측 정렬). status 는 아이콘 색으로만 구분. */
  :where([data-brand="cashwalk-biz"] .${TOAST_ITEM_CLASS}) {
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    border: 1px solid ${cv.borderRole.subtle};
  }
  :where([data-brand="cashwalk-biz"] .${TOAST_ITEM_CLASS} .${TOAST_MESSAGE_CLASS}) {
    text-align: left;
    font-weight: ${fontWeight.bold};
  }
  /* 좌측 status 아이콘 노출 + 사이즈(24). 색은 state 별(currentColor 가 도형 fill). */
  :where([data-brand="cashwalk-biz"] .${TOAST_ICON_CLASS}) {
    display: inline-flex;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
  }
  :where([data-brand="cashwalk-biz"] .${TOAST_ITEM_CLASS}[data-variant="success"] .${TOAST_ICON_CLASS}) {
    color: ${cv.iconRole.statusSuccess};
  }
  :where([data-brand="cashwalk-biz"] .${TOAST_ITEM_CLASS}[data-variant="error"] .${TOAST_ICON_CLASS}) {
    color: ${cv.iconRole.statusError};
  }
  :where([data-brand="cashwalk-biz"] .${TOAST_ITEM_CLASS}[data-variant="warning"] .${TOAST_ICON_CLASS}) {
    color: ${cv.iconRole.statusCaution};
  }
  /* 우측 닫기 X 노출 — 회색, 버튼 리셋. */
  :where([data-brand="cashwalk-biz"] .${TOAST_CLOSE_CLASS}) {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    background: none;
    color: ${cv.iconRole.normal};
    cursor: pointer;
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
