/* Auto-generated from packages/react/src/FAB.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, spacing, transition, typeScale } from "@nudge-eap/tokens";

const FB_CLASS = "nds-fab";
const FB_LABEL_CLASS = `${FB_CLASS}__label`;
const FB_ICON_CLASS = `${FB_CLASS}__icon`;

export const fabStyles = `
  :where(.${FB_CLASS}) {
    height: var(--nds-fab-size, 48px);
    min-width: var(--nds-fab-size, 48px);
    padding: 0 var(--nds-fab-padding, 0);
    border: none;
    border-radius: 9999px;
    background: var(--nds-fab-bg, ${cv.surface.brand});
    color: var(--nds-fab-fg, #fff);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18), 0 2px 4px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-default);
    font-family: ${fontFamily.web};
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
    line-height: ${typeScale.body3.lineHeight}px;
    transition: transform ${transition.default}, box-shadow ${transition.default};
    z-index: 50;
  }

  :where(.${FB_CLASS}:hover) {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.22), 0 3px 6px rgba(0, 0, 0, 0.1);
  }

  :where(.${FB_CLASS}:active) {
    transform: translateY(0);
  }

  :where(.${FB_CLASS}:focus-visible) {
    outline: 3px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${FB_CLASS}[disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  :where(.${FB_CLASS}[data-position="bottom-right"]) {
    position: fixed;
    right: var(--nds-fab-offset, ${spacing[16]}px);
    bottom: var(--nds-fab-offset, ${spacing[16]}px);
  }

  :where(.${FB_CLASS}[data-position="bottom-left"]) {
    position: fixed;
    left: var(--nds-fab-offset, ${spacing[16]}px);
    bottom: var(--nds-fab-offset, ${spacing[16]}px);
  }

  :where(.${FB_CLASS}[data-position="bottom-center"]) {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: var(--nds-fab-offset, ${spacing[16]}px);
  }

  :where(.${FB_CLASS}[data-position="bottom-center"]:hover) {
    transform: translate(-50%, -1px);
  }

  :where(.${FB_ICON_CLASS}) {
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  :where(.${FB_LABEL_CLASS}) {
    white-space: nowrap;
  }
`;
