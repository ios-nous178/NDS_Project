/* Auto-generated from packages/react/src/BottomSheet.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, radius, spacing, typeScale } from "@nudge-design/tokens";

const BS_CLASS = "nds-bottom-sheet";
const BS_ROOT_CLASS = `${BS_CLASS}__root`;
const BS_OVERLAY_CLASS = `${BS_CLASS}__overlay`;
const BS_CONTENT_CLASS = `${BS_CLASS}__content`;
const BS_HANDLE_CLASS = `${BS_CLASS}__handle`;
const BS_HEADER_CLASS = `${BS_CLASS}__header`;
const BS_HEADER_TITLE_CLASS = `${BS_CLASS}__header-title`;
const BS_CLOSE_CLASS = `${BS_CLASS}__close`;
const BS_BODY_CLASS = `${BS_CLASS}__body`;
const BS_FOOTER_CLASS = `${BS_CLASS}__footer`;

export const bottomSheetStyles = `
  :where(.${BS_ROOT_CLASS}) {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 1000;
  }

  :where(.${BS_OVERLAY_CLASS}) {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    animation: nds-bs-fade-in 0.2s ease-out;
  }

  :where(.${BS_ROOT_CLASS}[data-closing="true"] .${BS_OVERLAY_CLASS}) {
    animation: nds-bs-fade-out 0.2s ease-out forwards;
  }

  :where(.${BS_CONTENT_CLASS}) {
    position: relative;
    width: 100%;
    max-width: var(--nds-bottom-sheet-max-width, 664px);
    max-height: var(--nds-bottom-sheet-max-height, 85vh);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: var(--nds-bottom-sheet-radius, ${radius.lg}px) var(--nds-bottom-sheet-radius, ${radius.lg}px) 0 0;
    background-color: ${cv.surface.default};
    /* upward shadow — DS shadow 토큰은 모두 아래 방향이라 의도적으로 raw 사용 */
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
    animation: nds-bs-slide-up 0.2s ease-out;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${BS_ROOT_CLASS}[data-closing="true"] .${BS_CONTENT_CLASS}) {
    animation: nds-bs-slide-down 0.2s ease-out forwards;
  }

  :where(.${BS_HANDLE_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--semantic-inset-input) 0 ${spacing[4]}px;
    cursor: grab;
  }

  :where(.${BS_HANDLE_CLASS}::after) {
    content: "";
    width: var(--nds-bottom-sheet-handle-width, 36px);
    height: var(--nds-bottom-sheet-handle-height, 4px);
    border-radius: ${radius.pill}px;
    background: var(--nds-bottom-sheet-handle-color, ${cv.borderRole.normal});
  }

  :where(.${BS_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--semantic-gap-comfortable);
    padding: var(--semantic-inset-card) var(--semantic-inset-card-large);
  }

  :where(.${BS_HEADER_CLASS}[data-has-title="true"]) {
    border-bottom: 1px solid ${cv.borderRole.subtle};
  }

  :where(.${BS_HEADER_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.headline5.fontSize}px;
    font-weight: 700;
    line-height: ${typeScale.headline5.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${BS_CLOSE_CLASS}) {
    border: none;
    background: none;
    cursor: pointer;
    padding: 4px;
    font-size: 20px;
    line-height: 1;
    color: ${cv.textRole.muted};
  }

  :where(.${BS_BODY_CLASS}) {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: var(--semantic-inset-card-large);
    font-size: ${typeScale.body2.fontSize}px;
    line-height: 1.5;
    color: ${cv.textRole.subtle};
  }

  :where(.${BS_FOOTER_CLASS}) {
    display: flex;
    gap: var(--semantic-gap-default);
    padding: var(--semantic-inset-input) var(--semantic-inset-card-large);
    border-top: 1px solid ${cv.borderRole.subtle};
  }

  :where(.${BS_FOOTER_CLASS} > *) {
    flex: 1;
    min-width: 0;
  }

  @keyframes nds-bs-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes nds-bs-fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes nds-bs-slide-up {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  @keyframes nds-bs-slide-down {
    from { transform: translateY(0); }
    to { transform: translateY(100%); }
  }
`;
