/* Auto-generated from packages/react/src/TimePicker.tsx during the @nudge-eap/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  sizing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

const TP_CLASS = "nds-time-picker";
const TP_ROOT_CLASS = `${TP_CLASS}__root`;
const TP_LABEL_CLASS = `${TP_CLASS}__label`;
const TP_FIELD_CLASS = `${TP_CLASS}__field`;
const TP_INPUT_CLASS = `${TP_CLASS}__input`;
const TP_HELPER_CLASS = `${TP_CLASS}__helper`;

export const tpStyles = `
  :where(.${TP_ROOT_CLASS}) {
    display: inline-flex;
    flex-direction: column;
    gap: var(--gap-default);
    font-family: ${fontFamily.web};
  }

  :where(.${TP_ROOT_CLASS}[data-full-width="true"]) { width: 100%; }

  :where(.${TP_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  :where(.${TP_FIELD_CLASS}) {
    display: flex;
    align-items: center;
    height: ${sizing.input.default}px;
    padding: 0 var(--inset-card);
    border: 1px solid ${cv.borderRole.normal};
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    transition: border-color ${transition.default};
  }

  :where(.${TP_FIELD_CLASS}:focus-within) { border-color: ${cv.borderRole.brand}; }
  :where(.${TP_FIELD_CLASS}[data-error="true"]) { border-color: var(--semantic-border-status-error); }
  :where(.${TP_FIELD_CLASS}[data-disabled="true"]) {
    background: ${cv.surface.section};
    cursor: not-allowed;
  }

  :where(.${TP_INPUT_CLASS}) {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    color: ${cv.textRole.normal};
    font-variant-numeric: tabular-nums;
  }

  :where(.${TP_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${TP_HELPER_CLASS}[data-error="true"]) { color: var(--semantic-text-status-error); }
`;
