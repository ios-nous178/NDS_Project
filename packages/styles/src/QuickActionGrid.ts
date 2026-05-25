/* Auto-generated from packages/react/src/QuickActionGrid.tsx during the @nudge-eap/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

const QA_CLASS = "nds-quick-action-grid";
const QA_ITEM_CLASS = `${QA_CLASS}__item`;
const QA_ICON_CLASS = `${QA_CLASS}__icon`;
const QA_LABEL_CLASS = `${QA_CLASS}__label`;
const QA_BADGE_CLASS = `${QA_CLASS}__badge`;

export const qaStyles = `
  :where(.${QA_CLASS}) {
    display: grid;
    gap: var(--nds-quick-action-gap, var(--gap-comfortable));
    grid-template-columns: repeat(var(--nds-quick-action-cols, 4), 1fr);
    width: 100%;
    font-family: ${fontFamily.web};
  }

  :where(.${QA_ITEM_CLASS}) {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-default);
    padding: var(--inset-input) ${spacing[4]}px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: ${radius.md}px;
    transition: background-color ${transition.default};
    font-family: inherit;
  }

  :where(.${QA_ITEM_CLASS}:hover:not([disabled])) {
    background: ${cv.surface.section};
  }

  :where(.${QA_ITEM_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${QA_ITEM_CLASS}[disabled]) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :where(.${QA_ICON_CLASS}) {
    width: 48px;
    height: 48px;
    border-radius: ${radius.md}px;
    background: var(--nds-quick-action-icon-bg, var(--semantic-bg-status-info));
    color: ${cv.textRole.brand};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }

  :where(.${QA_LABEL_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.normal};
    font-weight: ${fontWeight.medium};
    text-align: center;
    word-break: keep-all;
  }

  :where(.${QA_BADGE_CLASS}) {
    position: absolute;
    top: 4px;
    right: 8px;
    padding: 2px 6px;
    min-width: 18px;
    height: 18px;
    border-radius: 9999px;
    background: var(--semantic-fill-status-error);
    color: #fff;
    font-size: 10px;
    line-height: 14px;
    font-weight: ${fontWeight.bold};
    text-align: center;
    box-sizing: border-box;
  }
`;
