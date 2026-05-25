/* Auto-generated from packages/react/src/ConsentChecklist.tsx during the @nudge-eap/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

const CL_CLASS = "nds-consent";
const CL_ALL_CLASS = `${CL_CLASS}__all`;
const CL_DIVIDER_CLASS = `${CL_CLASS}__divider`;
const CL_LIST_CLASS = `${CL_CLASS}__list`;
const CL_ITEM_CLASS = `${CL_CLASS}__item`;
const CL_ITEM_HEAD_CLASS = `${CL_CLASS}__item-head`;
const CL_LABEL_CLASS = `${CL_CLASS}__label`;
const CL_LABEL_TEXT_CLASS = `${CL_CLASS}__label-text`;
const CL_REQUIRED_CLASS = `${CL_CLASS}__required`;
const CL_OPTIONAL_CLASS = `${CL_CLASS}__optional`;
const CL_TOGGLE_CLASS = `${CL_CLASS}__toggle`;
const CL_DETAIL_CLASS = `${CL_CLASS}__detail`;
const CL_BOX_CLASS = `${CL_CLASS}__box`;
const CL_INPUT_CLASS = `${CL_CLASS}__input`;

export const consentStyles = `
  :where(.${CL_CLASS}) {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${CL_ALL_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-default);
    padding: var(--inset-input) 0;
    cursor: pointer;
  }

  :where(.${CL_DIVIDER_CLASS}) {
    height: 1px;
    background: ${cv.borderRole.subtle};
    margin: ${spacing[4]}px 0;
  }

  :where(.${CL_LIST_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[2]}px;
    padding: var(--inset-chip) 0;
  }

  :where(.${CL_ITEM_CLASS}) {
    display: flex;
    flex-direction: column;
  }

  :where(.${CL_ITEM_HEAD_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-default);
    padding: var(--inset-chip) 0;
  }

  :where(.${CL_LABEL_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-default);
    flex: 1;
    cursor: pointer;
    min-width: 0;
  }

  :where(.${CL_INPUT_CLASS}) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  :where(.${CL_BOX_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.disabled};
    color: ${cv.surface.default};
    transition: background-color ${transition.default};
  }

  :where(.${CL_BOX_CLASS}[data-checked="true"]) {
    background: ${cv.surface.brand};
  }

  :where(.${CL_BOX_CLASS}) svg {
    width: 14px;
    height: 14px;
  }

  :where(.${CL_LABEL_TEXT_CLASS}) {
    flex: 1;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
    user-select: none;
    min-width: 0;
  }

  :where(.${CL_ALL_CLASS}) .${CL_LABEL_TEXT_CLASS} {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.bold};
  }

  :where(.${CL_REQUIRED_CLASS}) {
    flex-shrink: 0;
    color: ${cv.textRole.statusError};
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.medium};
  }

  :where(.${CL_OPTIONAL_CLASS}) {
    flex-shrink: 0;
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
  }

  :where(.${CL_TOGGLE_CLASS}) {
    all: unset;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    color: ${cv.textRole.subtle};
    cursor: pointer;
    padding: ${spacing[4]}px;
    border-radius: ${radius.sm}px;
    transition: transform ${transition.default};
  }

  :where(.${CL_TOGGLE_CLASS}[data-open="true"]) {
    transform: rotate(180deg);
  }

  :where(.${CL_DETAIL_CLASS}) {
    margin: ${spacing[4]}px 0 ${spacing[8]}px 32px;
    padding: var(--inset-input) var(--inset-input);
    background: ${cv.surface.page};
    border-radius: ${radius.md}px;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.strong};
    white-space: pre-wrap;
  }
`;
