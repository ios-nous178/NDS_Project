/* Auto-generated from packages/react/src/AmountInput.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const AI_CLASS = "nds-amount-input";
const AI_LABEL_CLASS = `${AI_CLASS}__label`;
const AI_FIELD_CLASS = `${AI_CLASS}__field`;
const AI_PREFIX_CLASS = `${AI_CLASS}__prefix`;
const AI_INPUT_CLASS = `${AI_CLASS}__input`;
const AI_UNIT_CLASS = `${AI_CLASS}__unit`;
const AI_PRESETS_CLASS = `${AI_CLASS}__presets`;
const AI_PRESET_CLASS = `${AI_CLASS}__preset`;
const AI_HELPER_CLASS = `${AI_CLASS}__helper`;

export const aiStyles = `
  :where(.${AI_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-default);
    width: 100%;
    font-family: ${fontFamily.web};
  }

  :where(.${AI_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  :where(.${AI_FIELD_CLASS}) {
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 var(--inset-card);
    border: 1px solid ${cv.borderRole.normal};
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    transition: border-color ${transition.default};
  }
  :where(.${AI_FIELD_CLASS}:focus-within) { border-color: ${cv.borderRole.brand}; }
  :where(.${AI_FIELD_CLASS}[data-error="true"]) { border-color: var(--semantic-border-status-error); }

  :where(.${AI_PREFIX_CLASS}),
  :where(.${AI_UNIT_CLASS}) {
    font-size: 22px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
  }

  :where(.${AI_PREFIX_CLASS}) { margin-right: ${spacing[4]}px; }
  :where(.${AI_UNIT_CLASS}) { margin-left: ${spacing[4]}px; }

  :where(.${AI_INPUT_CLASS}) {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-family: inherit;
    font-size: 24px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    text-align: right;
    font-variant-numeric: tabular-nums;
    min-width: 0;
  }

  :where(.${AI_INPUT_CLASS}::placeholder) {
    color: ${cv.textRole.muted};
    font-weight: ${fontWeight.medium};
  }

  :where(.${AI_PRESETS_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-default);
  }

  :where(.${AI_PRESET_CLASS}) {
    height: 36px;
    padding: 0 var(--inset-input);
    border: 1px solid ${cv.borderRole.normal};
    border-radius: 9999px;
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
    cursor: pointer;
    transition: background-color ${transition.default};
  }
  :where(.${AI_PRESET_CLASS}:hover) { background: ${cv.surface.section}; }

  :where(.${AI_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
  }
  :where(.${AI_HELPER_CLASS}[data-error="true"]) { color: var(--semantic-text-status-error); }
`;
