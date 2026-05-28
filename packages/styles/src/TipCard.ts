/* Auto-generated from packages/react/src/TipCard.tsx during the @nudge-design/styles split. */
import {
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const TC_CLASS = "nds-tip-card";
const TC_ICON_CLASS = `${TC_CLASS}__icon`;
const TC_BODY_CLASS = `${TC_CLASS}__body`;
const TC_LABEL_CLASS = `${TC_CLASS}__label`;
const TC_TITLE_CLASS = `${TC_CLASS}__title`;
const TC_DESC_CLASS = `${TC_CLASS}__desc`;
const TC_ACTION_CLASS = `${TC_CLASS}__action`;

const TONE_BG = {
  info: "var(--semantic-bg-status-info)",
  success: "var(--semantic-bg-status-success)",
  warning: "var(--semantic-bg-status-caution)",
  neutral: "var(--semantic-bg-section-default)",
};

const TONE_FG = {
  info: "var(--semantic-text-status-info)",
  success: "var(--semantic-text-status-success)",
  warning: "var(--semantic-text-status-caution)",
  neutral: "var(--semantic-text-subtle-default)",
};

const TONE_ICON_BG = {
  info: "var(--semantic-fill-brand-default)",
  success: "var(--semantic-icon-status-success)",
  warning: "var(--semantic-icon-status-caution)",
  neutral: "var(--semantic-text-muted-default)",
};

export const tcStyles = `
  :where(.${TC_CLASS}) {
    display: flex;
    align-items: flex-start;
    gap: var(--semantic-gap-comfortable);
    padding: var(--semantic-inset-card);
    background: var(--nds-tip-bg, ${TONE_BG.info});
    color: var(--nds-tip-fg, ${TONE_FG.info});
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    transition: opacity ${transition.default};
    box-sizing: border-box;
  }

  :where(.${TC_CLASS}[data-clickable="true"]) { cursor: pointer; }
  :where(.${TC_CLASS}[data-clickable="true"]:hover) { opacity: 0.85; }

  :where(.${TC_ICON_CLASS}) {
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    background: var(--nds-tip-icon-bg, ${TONE_ICON_BG.info});
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  :where(.${TC_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  :where(.${TC_LABEL_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    font-weight: ${fontWeight.semibold};
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: 0.8;
    margin: 0 0 ${spacing[4]}px 0;
  }

  :where(.${TC_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.bold};
    margin: 0;
  }

  :where(.${TC_DESC_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    margin: ${spacing[4]}px 0 0 0;
    opacity: 0.85;
  }

  :where(.${TC_ACTION_CLASS}) {
    border: none;
    background: transparent;
    color: inherit;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
    cursor: pointer;
    padding: 0 ${spacing[4]}px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 2px;
    align-self: center;
  }

  :where(.${TC_ACTION_CLASS}:hover) { text-decoration: underline; }
`;
