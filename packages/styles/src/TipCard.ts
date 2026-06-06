/* Auto-generated from packages/react/src/TipCard.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const TC_CLASS = "nds-tip-card";
const TC_META_CLASS = `${TC_CLASS}__meta`;
const TC_LABEL_CLASS = `${TC_CLASS}__label`;
const TC_BODY_CLASS = `${TC_CLASS}__body`;
const TC_TITLE_CLASS = `${TC_CLASS}__title`;
const TC_DESC_CLASS = `${TC_CLASS}__description`;
const TC_ACTION_CLASS = `${TC_CLASS}__action`;

export const tipCardStyles = `
  :where(.${TC_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--nds-tip-card-gap, ${spacing[8]}px);
    width: 100%;
    padding: var(--nds-tip-card-padding, ${spacing[16]}px);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    border-radius: var(--nds-tip-card-radius, ${radius.lg}px);
    border: 1px solid var(--nds-tip-card-border, ${cv.borderRole.subtle});
    border-left-width: 4px;
    border-left-color: var(--nds-tip-card-accent, ${cv.textRole.brand});
    background: var(--nds-tip-card-background, ${cv.surface.default});
    transition: background-color ${transition.default}, border-color ${transition.default};
  }

  :where(.${TC_CLASS}[data-tone="success"]) {
    --nds-tip-card-accent: ${cv.textRole.success};
  }

  :where(.${TC_CLASS}[data-tone="warning"]) {
    --nds-tip-card-accent: ${cv.textRole.caution};
  }

  :where(.${TC_CLASS}[data-tone="neutral"]) {
    --nds-tip-card-accent: ${cv.textRole.muted};
  }

  :where(.${TC_CLASS}[data-clickable="true"]) {
    cursor: pointer;
  }

  :where(.${TC_CLASS}[data-clickable="true"]:hover) {
    background: ${cv.surface.page};
  }

  :where(.${TC_META_CLASS}) {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: ${spacing[4]}px;
    padding: 2px 8px;
    border-radius: ${radius.pill}px;
    border: 1px solid var(--nds-tip-card-accent, ${cv.textRole.brand});
    color: var(--nds-tip-card-accent, ${cv.textRole.brand});
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: ${typeScale.caption1.lineHeight}px;
  }

  :where(.${TC_BODY_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[4]}px;
    min-width: 0;
  }

  :where(.${TC_TITLE_CLASS}) {
    font-size: ${typeScale.headline5.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: ${typeScale.headline5.lineHeight}px;
    color: ${cv.textRole.strong};
    word-break: break-word;
  }

  :where(.${TC_DESC_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.subtle};
    word-break: break-word;
  }

  :where(.${TC_ACTION_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
    margin-top: ${spacing[8]}px;
    color: var(--nds-tip-card-accent, ${cv.textRole.brand});
    font-size: ${typeScale.body1.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: ${typeScale.body1.lineHeight}px;
    background: none;
    border: none;
    padding: 0;
    font-family: inherit;
    text-decoration: none;
    cursor: pointer;
  }

  :where(.${TC_ACTION_CLASS}:hover) {
    text-decoration: underline;
  }
`;
