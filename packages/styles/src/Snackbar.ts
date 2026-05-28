/* Auto-generated from packages/react/src/Snackbar.tsx during the @nudge-design/styles split. */
import {
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const SB_CLASS = "nds-snackbar";
const SB_ICON_CLASS = `${SB_CLASS}__icon`;
const SB_BODY_CLASS = `${SB_CLASS}__body`;
const SB_TITLE_CLASS = `${SB_CLASS}__title`;
const SB_DESC_CLASS = `${SB_CLASS}__desc`;
const SB_ACTION_CLASS = `${SB_CLASS}__action`;
const SB_CLOSE_CLASS = `${SB_CLASS}__close`;

export const snackbarStyles = `
  :where(.${SB_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
    padding: var(--semantic-inset-input) var(--semantic-inset-card);
    border-radius: var(--nds-snackbar-radius, ${radius.md}px);
    background: var(--nds-snackbar-bg, var(--semantic-bg-section-default));
    color: var(--nds-snackbar-fg, var(--semantic-text-normal-default));
    border: 1px solid var(--nds-snackbar-border, transparent);
    font-family: ${fontFamily.web};
    width: var(--nds-snackbar-width, auto);
    max-width: 480px;
    box-sizing: border-box;
  }

  :where(.${SB_CLASS}[data-variant="info"]),
  :where(.${SB_CLASS}[data-variant="success"]),
  :where(.${SB_CLASS}[data-variant="warning"]),
  :where(.${SB_CLASS}[data-variant="error"]) {
    border: 0;
  }

  :where(.${SB_CLASS}[data-has-desc="true"]) {
    align-items: flex-start;
  }

  :where(.${SB_ICON_CLASS}) {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--nds-snackbar-icon, currentColor);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${SB_CLASS}[data-has-desc="true"]) .${SB_ICON_CLASS} {
    margin-top: 1px;
  }

  :where(.${SB_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing[2]}px;
  }

  :where(.${SB_TITLE_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.bold};
    margin: 0;
  }

  :where(.${SB_DESC_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    margin: 0;
  }

  :where(.${SB_ACTION_CLASS}) {
    height: 28px;
    padding: 0 var(--semantic-inset-chip);
    border: none;
    background: rgba(255, 255, 255, 0.12);
    color: inherit;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.bold};
    cursor: pointer;
    flex-shrink: 0;
    border-radius: ${radius.sm}px;
    transition: background-color ${transition.default};
  }

  /* variant 액션 버튼: 배경 칩이 옅은 배경에서 묻혀버려서 text-only 강조 톤으로 전환.
     색은 variant 아이콘 색을 그대로 받아 variant 아이덴티티 강화. */
  :where(.${SB_CLASS}[data-variant="info"]) .${SB_ACTION_CLASS},
  :where(.${SB_CLASS}[data-variant="success"]) .${SB_ACTION_CLASS},
  :where(.${SB_CLASS}[data-variant="warning"]) .${SB_ACTION_CLASS},
  :where(.${SB_CLASS}[data-variant="error"]) .${SB_ACTION_CLASS} {
    background: transparent;
    color: var(--nds-snackbar-icon);
    padding: 0 ${spacing[6]}px;
  }

  :where(.${SB_ACTION_CLASS}:hover) { background: rgba(255, 255, 255, 0.2); }

  :where(.${SB_CLASS}[data-variant="info"]) .${SB_ACTION_CLASS}:hover,
  :where(.${SB_CLASS}[data-variant="success"]) .${SB_ACTION_CLASS}:hover,
  :where(.${SB_CLASS}[data-variant="warning"]) .${SB_ACTION_CLASS}:hover,
  :where(.${SB_CLASS}[data-variant="error"]) .${SB_ACTION_CLASS}:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  :where(.${SB_ACTION_CLASS}:focus-visible) {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  :where(.${SB_CLOSE_CLASS}) {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: opacity ${transition.default}, background-color ${transition.default};
  }

  :where(.${SB_CLOSE_CLASS}:hover) {
    opacity: 1;
    background: rgba(0, 0, 0, 0.06);
  }
`;
