/* Auto-generated from packages/react/src/Toast.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, transition, typeScale, zIndex } from "@nudge-design/tokens";

const TOAST_CLASS = "nds-toast";
const TOAST_VIEWPORT_CLASS = `${TOAST_CLASS}__viewport`;
const TOAST_ITEM_CLASS = `${TOAST_CLASS}__item`;
const TOAST_MESSAGE_CLASS = `${TOAST_CLASS}__message`;
const TOAST_ACTION_CLASS = `${TOAST_CLASS}__action`;

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

  @keyframes nds-toast-enter {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes nds-toast-exit {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(8px); }
  }
`;
