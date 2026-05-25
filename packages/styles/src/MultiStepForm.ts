/* Auto-generated from packages/react/src/MultiStepForm.tsx during the @nudge-eap/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

const MS_CLASS = "nds-multi-step-form";
const MS_HEADER_CLASS = `${MS_CLASS}__header`;
const MS_INDICATOR_CLASS = `${MS_CLASS}__indicator`;
const MS_TITLE_CLASS = `${MS_CLASS}__title`;
const MS_DESC_CLASS = `${MS_CLASS}__desc`;
const MS_BODY_CLASS = `${MS_CLASS}__body`;
const MS_FOOTER_CLASS = `${MS_CLASS}__footer`;
const MS_BTN_CLASS = `${MS_CLASS}__btn`;
const MS_PROGRESS_CLASS = `${MS_CLASS}__progress`;
const MS_PROGRESS_FILL_CLASS = `${MS_CLASS}__progress-fill`;

export const msStyles = `
  :where(.${MS_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[20]}px;
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${MS_HEADER_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-default);
  }

  :where(.${MS_INDICATOR_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
    font-weight: ${fontWeight.medium};
  }

  :where(.${MS_TITLE_CLASS}) {
    font-size: ${typeScale.headline3.fontSize}px;
    line-height: ${typeScale.headline3.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${MS_DESC_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.subtle};
    margin: 0;
  }

  :where(.${MS_BODY_CLASS}) {
    flex: 1;
    min-height: 0;
  }

  :where(.${MS_PROGRESS_CLASS}) {
    height: 4px;
    background: ${cv.surface.section};
    border-radius: 9999px;
    overflow: hidden;
  }

  :where(.${MS_PROGRESS_FILL_CLASS}) {
    height: 100%;
    background: ${cv.surface.brand};
    border-radius: 9999px;
    transition: width 320ms ease;
  }

  :where(.${MS_FOOTER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-comfortable);
  }

  :where(.${MS_BTN_CLASS}) {
    height: 48px;
    padding: 0 var(--inset-card-large);
    border-radius: ${radius.md}px;
    border: 1px solid ${cv.borderRole.normal};
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.semibold};
    transition: background-color ${transition.default}, opacity ${transition.default};
  }

  :where(.${MS_BTN_CLASS}[disabled]) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :where(.${MS_BTN_CLASS}[data-primary="true"]) {
    background: ${cv.surface.brand};
    color: #fff;
    border-color: transparent;
    flex: 1;
  }
`;
