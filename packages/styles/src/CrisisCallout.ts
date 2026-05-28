/* Auto-generated from packages/react/src/CrisisCallout.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const CC_CLASS = "nds-crisis-callout";
const CC_ICON_CLASS = `${CC_CLASS}__icon`;
const CC_CONTENT_CLASS = `${CC_CLASS}__content`;
const CC_TITLE_CLASS = `${CC_CLASS}__title`;
const CC_DESC_CLASS = `${CC_CLASS}__description`;
const CC_ACTIONS_CLASS = `${CC_CLASS}__actions`;
const CC_ACTION_CLASS = `${CC_CLASS}__action`;

export const crisisCalloutStyles = `
  :where(.${CC_CLASS}) {
    display: flex;
    align-items: flex-start;
    gap: var(--gap-comfortable);
    width: 100%;
    padding: var(--inset-card) var(--inset-card-large);
    background: ${cv.surface.statusError};
    border: 1px solid ${cv.borderRole.statusError};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${CC_CLASS}[data-tone="caution"]) {
    background: ${cv.surface.statusCaution};
    border-color: ${cv.borderRole.statusCaution};
  }

  :where(.${CC_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    color: ${cv.textRole.statusError};
  }

  :where(.${CC_CLASS}[data-tone="caution"]) .${CC_ICON_CLASS} {
    color: ${cv.textRole.statusCaution};
  }

  :where(.${CC_CONTENT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[6]}px;
    flex: 1;
    min-width: 0;
  }

  :where(.${CC_TITLE_CLASS}) {
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.statusError};
    margin: 0;
  }

  :where(.${CC_CLASS}[data-tone="caution"]) .${CC_TITLE_CLASS} {
    color: ${cv.textRole.statusCaution};
  }

  :where(.${CC_DESC_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.strong};
    margin: 0;
  }

  :where(.${CC_ACTIONS_CLASS}) {
    display: flex;
    gap: var(--gap-default);
    margin-top: ${spacing[8]}px;
    flex-wrap: wrap;
  }

  :where(.${CC_ACTION_CLASS}) {
    all: unset;
    display: inline-flex;
    align-items: center;
    gap: ${spacing[6]}px;
    padding: var(--inset-chip) var(--inset-input);
    background: ${cv.fill.statusError};
    color: ${cv.textRole.inverse};
    border-radius: ${radius.md}px;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: ${typeScale.body3.lineHeight}px;
    cursor: pointer;
    transition: opacity ${transition.default};
    box-sizing: border-box;
  }

  :where(.${CC_CLASS}[data-tone="caution"]) .${CC_ACTION_CLASS} {
    background: ${cv.fill.statusCaution};
  }

  :where(.${CC_ACTION_CLASS}:hover) {
    opacity: 0.9;
  }

  :where(.${CC_ACTION_CLASS}[data-variant="outlined"]) {
    background: transparent;
    color: ${cv.textRole.statusError};
    border: 1px solid ${cv.borderRole.statusError};
  }

  :where(.${CC_CLASS}[data-tone="caution"]) .${CC_ACTION_CLASS}[data-variant="outlined"] {
    color: ${cv.textRole.statusCaution};
    border-color: ${cv.borderRole.statusCaution};
  }
`;
