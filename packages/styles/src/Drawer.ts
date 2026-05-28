/* Auto-generated from packages/react/src/Drawer.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  shadow,
  spacing,
  typeScale,
  zIndex,
} from "@nudge-design/tokens";

const DR_CLASS = "nds-drawer";
const DR_ROOT_CLASS = `${DR_CLASS}__root`;
const DR_OVERLAY_CLASS = `${DR_CLASS}__overlay`;
const DR_CONTENT_CLASS = `${DR_CLASS}__content`;
const DR_HEADER_CLASS = `${DR_CLASS}__header`;
const DR_HEADER_TITLE_CLASS = `${DR_CLASS}__header-title`;
const DR_HEADER_DESC_CLASS = `${DR_CLASS}__header-desc`;
const DR_CLOSE_CLASS = `${DR_CLASS}__close`;
const DR_BODY_CLASS = `${DR_CLASS}__body`;
const DR_FOOTER_CLASS = `${DR_CLASS}__footer`;

export const drawerStyles = `
  :where(.${DR_ROOT_CLASS}) {
    position: fixed;
    inset: 0;
    z-index: ${zIndex.modal};
    display: flex;
    font-family: ${fontFamily.web};
  }

  :where(.${DR_ROOT_CLASS}[data-side="left"]) {
    justify-content: flex-start;
  }

  :where(.${DR_ROOT_CLASS}[data-side="right"]) {
    justify-content: flex-end;
  }

  :where(.${DR_OVERLAY_CLASS}) {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    animation: nds-drawer-fade-in 0.2s ease-out;
  }

  :where(.${DR_ROOT_CLASS}[data-closing="true"] .${DR_OVERLAY_CLASS}) {
    animation: nds-drawer-fade-out 0.2s ease-out forwards;
  }

  :where(.${DR_CONTENT_CLASS}) {
    position: relative;
    display: flex;
    flex-direction: column;
    width: var(--nds-drawer-width, 400px);
    max-width: 100vw;
    height: 100%;
    background: ${cv.surface.default};
    box-shadow: ${shadow["3"]};
    box-sizing: border-box;
  }

  :where(.${DR_ROOT_CLASS}[data-side="left"] .${DR_CONTENT_CLASS}) {
    animation: nds-drawer-slide-in-left 0.22s ease-out;
  }

  :where(.${DR_ROOT_CLASS}[data-side="right"] .${DR_CONTENT_CLASS}) {
    animation: nds-drawer-slide-in-right 0.22s ease-out;
  }

  :where(.${DR_ROOT_CLASS}[data-side="left"][data-closing="true"] .${DR_CONTENT_CLASS}) {
    animation: nds-drawer-slide-out-left 0.2s ease-in forwards;
  }

  :where(.${DR_ROOT_CLASS}[data-side="right"][data-closing="true"] .${DR_CONTENT_CLASS}) {
    animation: nds-drawer-slide-out-right 0.2s ease-in forwards;
  }

  :where(.${DR_HEADER_CLASS}) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--semantic-gap-comfortable);
    padding: var(--semantic-inset-card-large) var(--semantic-inset-card-large) var(--semantic-inset-card);
    border-bottom: 1px solid ${cv.borderRole.subtle};
  }

  :where(.${DR_HEADER_CLASS}[data-empty="true"]) {
    border-bottom: none;
    padding-bottom: 0;
  }

  :where(.${DR_HEADER_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.headline5.fontSize}px;
    line-height: ${typeScale.headline5.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
  }

  :where(.${DR_HEADER_DESC_CLASS}) {
    margin-top: ${spacing[4]}px;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${DR_CLOSE_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin: -4px -4px -4px 0;
    border: none;
    background: transparent;
    cursor: pointer;
    color: ${cv.iconRole.normal};
    border-radius: 6px;
  }

  :where(.${DR_CLOSE_CLASS}:hover) {
    background: ${cv.surface.subtle};
    color: ${cv.iconRole.strong};
  }

  :where(.${DR_CLOSE_CLASS} svg) {
    width: 16px;
    height: 16px;
  }

  :where(.${DR_BODY_CLASS}) {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: var(--semantic-inset-card-large);
    box-sizing: border-box;
  }

  :where(.${DR_FOOTER_CLASS}) {
    display: flex;
    gap: var(--semantic-gap-default);
    padding: var(--semantic-inset-card) var(--semantic-inset-card-large);
    border-top: 1px solid ${cv.borderRole.subtle};
  }

  @keyframes nds-drawer-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes nds-drawer-fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes nds-drawer-slide-in-right {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  @keyframes nds-drawer-slide-out-right {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
  }
  @keyframes nds-drawer-slide-in-left {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }
  @keyframes nds-drawer-slide-out-left {
    from { transform: translateX(0); }
    to { transform: translateX(-100%); }
  }
`;
