/* Auto-generated from packages/react/src/FormField.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, typeScale } from "@nudge-eap/tokens";

const FF_CLASS = "nds-form-field";
const FF_ROOT_CLASS = `${FF_CLASS}__root`;
const FF_LABEL_ROW_CLASS = `${FF_CLASS}__label-row`;
const FF_LABEL_CLASS = `${FF_CLASS}__label`;
const FF_REQUIRED_CLASS = `${FF_CLASS}__required`;
const FF_OPTIONAL_CLASS = `${FF_CLASS}__optional`;
const FF_DESC_CLASS = `${FF_CLASS}__description`;
const FF_CONTROL_CLASS = `${FF_CLASS}__control`;
const FF_FOOTER_CLASS = `${FF_CLASS}__footer`;
const FF_HELPER_CLASS = `${FF_CLASS}__helper`;
const FF_ERROR_CLASS = `${FF_CLASS}__error`;
const FF_COUNTER_CLASS = `${FF_CLASS}__counter`;

export const formFieldStyles = `
  :where(.${FF_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-default);
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${FF_LABEL_ROW_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-tight);
  }

  :where(.${FF_LABEL_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  :where(.${FF_REQUIRED_CLASS}) {
    color: ${cv.textRole.statusError};
    font-weight: ${fontWeight.medium};
  }

  :where(.${FF_OPTIONAL_CLASS}) {
    color: ${cv.textRole.muted};
    font-weight: ${fontWeight.regular};
  }

  :where(.${FF_DESC_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
  }

  :where(.${FF_CONTROL_CLASS}) {
    display: contents;
  }

  :where(.${FF_FOOTER_CLASS}) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--gap-default);
  }

  :where(.${FF_HELPER_CLASS}) {
    flex: 1 1 auto;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${FF_ERROR_CLASS}) {
    flex: 1 1 auto;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.statusError};
  }

  :where(.${FF_COUNTER_CLASS}) {
    flex-shrink: 0;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.muted};
    text-align: right;
  }
`;
