/* Auto-generated from packages/react/src/GreetingHeader.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-eap/tokens";

const GH_CLASS = "nds-greeting-header";
const GH_TOP_CLASS = `${GH_CLASS}__top`;
const GH_GREETING_CLASS = `${GH_CLASS}__greeting`;
const GH_TITLE_CLASS = `${GH_CLASS}__title`;
const GH_QUESTION_CLASS = `${GH_CLASS}__question`;
const GH_ACTIONS_CLASS = `${GH_CLASS}__actions`;
const GH_TRAILING_CLASS = `${GH_CLASS}__trailing`;

export const ghStyles = `
  :where(.${GH_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-loose);
    padding: var(--inset-modal);
    background: ${cv.surface.default};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${GH_CLASS}[data-tone="primary"]) {
    background: var(--semantic-bg-status-info);
  }

  :where(.${GH_TOP_CLASS}) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--gap-loose);
  }

  :where(.${GH_GREETING_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.textRole.subtle};
    margin: 0 0 ${spacing[4]}px 0;
  }

  :where(.${GH_TITLE_CLASS}) {
    font-size: ${typeScale.headline2.fontSize}px;
    line-height: ${typeScale.headline2.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${GH_QUESTION_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.subtle};
    margin: ${spacing[8]}px 0 0 0;
  }

  :where(.${GH_TRAILING_CLASS}) {
    flex-shrink: 0;
  }

  :where(.${GH_ACTIONS_CLASS}) {
    margin-top: ${spacing[8]}px;
  }
`;
