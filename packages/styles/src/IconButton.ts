/* Auto-generated from packages/react/src/IconButton.tsx during the @nudge-design/styles split. */
import { cv, radius, transition } from "@nudge-design/tokens";

const ICON_BUTTON_CLASS = "nds-icon-button";

export const iconButtonStyles = `
  :where(.${ICON_BUTTON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--nds-icon-button-size, 32px);
    height: var(--nds-icon-button-size, 32px);
    padding: 0;
    border: none;
    border-radius: ${radius.sm}px;
    background: transparent;
    color: var(--nds-icon-button-color, ${cv.iconRole.strong});
    cursor: pointer;
    transition:
      background-color ${transition.default},
      color ${transition.default};
  }

  :where(.${ICON_BUTTON_CLASS}:disabled) {
    cursor: default;
    color: ${cv.textRole.muted};
  }

  :where(.${ICON_BUTTON_CLASS}:not(:disabled):hover) {
    background: var(--nds-icon-button-hover-bg, ${cv.surface.subtle});
  }

  :where(.${ICON_BUTTON_CLASS}:focus) {
    outline: none;
  }

  :where(.${ICON_BUTTON_CLASS}:focus-visible) {
    outline: 2px solid var(--nds-icon-button-focus-ring-color, ${cv.borderRole.focus});
    outline-offset: var(--nds-icon-button-focus-ring-offset, 2px);
  }

  :where(.${ICON_BUTTON_CLASS} svg) {
    width: var(--nds-icon-button-icon-size, 24px);
    height: var(--nds-icon-button-icon-size, 24px);
  }
`;
