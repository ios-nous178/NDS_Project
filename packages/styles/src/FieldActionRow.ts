/* Auto-generated from packages/react/src/FieldActionRow.tsx during the @nudge-eap/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

const FAR_CLASS = "nds-field-action-row";
const FAR_ROOT_CLASS = `${FAR_CLASS}__root`;
const FAR_FIELD_CLASS = `${FAR_CLASS}__field`;
const FAR_ACTION_CLASS = `${FAR_CLASS}__action`;
const FAR_HELPER_CLASS = `${FAR_CLASS}__helper`;
const FAR_TIMER_CLASS = `${FAR_CLASS}__timer`;

export const fieldActionRowStyles = `
  :where(.${FAR_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--nds-far-gap, var(--gap-default));
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${FAR_ROOT_CLASS} > [data-slot="row"]) {
    display: flex;
    gap: var(--gap-default);
    align-items: flex-start;
  }

  :where(.${FAR_FIELD_CLASS}) {
    flex: 1;
    min-width: 0;
    position: relative;
  }

  :where(.${FAR_FIELD_CLASS} input) {
    width: 100%;
    height: 48px;
    padding: 0 var(--inset-card);
    border: 1px solid var(--nds-far-border-color, ${cv.borderRole.normal});
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    outline: none;
    box-sizing: border-box;
    transition: border-color ${transition.default};
    -moz-appearance: textfield;
  }

  :where(.${FAR_FIELD_CLASS} input::-webkit-outer-spin-button),
  :where(.${FAR_FIELD_CLASS} input::-webkit-inner-spin-button) {
    -webkit-appearance: none;
    margin: 0;
  }

  :where(.${FAR_FIELD_CLASS} input::placeholder) {
    color: ${cv.textRole.muted};
    font-size: ${typeScale.body2.fontSize}px;
  }

  :where(.${FAR_FIELD_CLASS} input:focus) {
    border-color: ${cv.borderRole.focus};
  }

  :where(.${FAR_FIELD_CLASS}[data-error="true"] input) {
    border-color: ${cv.borderRole.statusError};
  }

  :where(.${FAR_FIELD_CLASS}[data-success="true"] input) {
    border-color: ${cv.iconRole.statusSuccess};
  }

  :where(.${FAR_TIMER_CLASS}) {
    position: absolute;
    right: ${spacing[16]}px;
    top: 50%;
    transform: translateY(-50%);
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.brand};
  }

  :where(.${FAR_TIMER_CLASS}[data-expired="true"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${FAR_ACTION_CLASS}) {
    flex-shrink: 0;
  }

  :where(.${FAR_ACTION_CLASS} button) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    min-width: var(--nds-far-action-min-width, 70px);
    padding: 0 var(--inset-card);
    border-radius: ${radius.md}px;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.bold};
    white-space: nowrap;
    cursor: pointer;
    box-sizing: border-box;
    transition:
      background-color ${transition.default},
      border-color ${transition.default},
      color ${transition.default};
  }

  :where(.${FAR_ACTION_CLASS}[data-tone="outline"] button) {
    border: 1px solid ${cv.borderRole.brand};
    background: ${cv.surface.default};
    color: ${cv.textRole.brand};
  }

  :where(.${FAR_ACTION_CLASS}[data-tone="outline"] button:hover:not(:disabled)) {
    border-color: ${cv.fill.brandHover};
    color: ${cv.fill.brandHover};
  }

  :where(.${FAR_ACTION_CLASS}[data-tone="solid"] button) {
    border: 1px solid ${cv.borderRole.brand};
    background: ${cv.surface.brand};
    color: ${cv.textRole.inverse};
  }

  :where(.${FAR_ACTION_CLASS}[data-tone="solid"] button:hover:not(:disabled)) {
    background: ${cv.fill.brandHover};
    border-color: ${cv.fill.brandHover};
  }

  :where(.${FAR_ACTION_CLASS} button:disabled) {
    border-color: ${cv.borderRole.disabled};
    background: ${cv.surface.disabled};
    color: ${cv.textRole.muted};
    cursor: not-allowed;
  }

  :where(.${FAR_ACTION_CLASS}[data-tone="solid"] button:disabled) {
    border-color: transparent;
    background: ${cv.surface.disabled};
    color: ${cv.textRole.muted};
  }

  :where(.${FAR_HELPER_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: 1.5;
    color: ${cv.textRole.muted};
    transition: color ${transition.default};
  }

  :where(.${FAR_HELPER_CLASS}[data-error="true"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${FAR_HELPER_CLASS}[data-success="true"]) {
    color: ${cv.textRole.statusError};
  }
`;
