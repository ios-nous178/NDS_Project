/* Auto-generated from packages/react/src/StepProgress.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, transition, typeScale } from "@nudge-design/tokens";

const SP_CLASS = "nds-step-progress";
const SP_ITEM_CLASS = `${SP_CLASS}__item`;
const SP_BAR_CLASS = `${SP_CLASS}__bar`;
const SP_LABEL_CLASS = `${SP_CLASS}__label`;
const SP_STEP_CLASS = `${SP_CLASS}__step`;
const SP_TITLE_CLASS = `${SP_CLASS}__title`;

export const stepProgressStyles = `
  :where(.${SP_CLASS}) {
    display: flex;
    align-items: flex-start;
    gap: var(--semantic-gap-default, 12px);
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SP_ITEM_CLASS}) {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--semantic-gap-default);
  }

  :where(.${SP_BAR_CLASS}) {
    height: 8px;
    width: 100%;
    border-radius: 6px;
    background: ${cv.borderRole.normal};
    transition: background-color ${transition.default};
  }

  :where(.${SP_ITEM_CLASS}[data-state="current"] .${SP_BAR_CLASS}),
  :where(.${SP_ITEM_CLASS}[data-state="completed"] .${SP_BAR_CLASS}) {
    background: ${cv.surface.brand};
  }

  :where(.${SP_LABEL_CLASS}) {
    display: flex;
    gap: 5px;
    align-items: baseline;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
    word-break: keep-all;
  }

  :where(.${SP_ITEM_CLASS}[data-state="completed"] .${SP_LABEL_CLASS}) {
    color: ${cv.textRole.normal};
    font-weight: ${fontWeight.medium};
  }

  :where(.${SP_ITEM_CLASS}[data-state="current"] .${SP_LABEL_CLASS}) {
    color: ${cv.textRole.strong};
    font-weight: ${fontWeight.bold};
  }

  :where(.${SP_STEP_CLASS}),
  :where(.${SP_TITLE_CLASS}) {
    white-space: nowrap;
  }
`;
