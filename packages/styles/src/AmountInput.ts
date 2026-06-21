/* Auto-generated from packages/react/src/AmountInput.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  sizing,
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

export const aiStyles = `
  :where(.${AI_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-label);
    width: 100%;
    font-family: ${fontFamily.web};
  }

  :where(.${AI_LABEL_CLASS}) {
    /* Input Typography 표준 label(13/18 · Medium, Figma 4247:1964). */
    font: ${cv.inputTypography.label.font};
    color: ${cv.textRole.normal};
  }

  :where(.${AI_FIELD_CLASS}) {
    display: flex;
    align-items: center;
    min-height: var(--nds-input-height, ${sizing.input.default}px);
    padding: 0 var(--semantic-inset-card);
    border: var(--stroke-thin) solid ${cv.input.borderDefault};
    border-radius: var(--nds-input-radius, ${radius[8]}px);
    background: ${cv.input.bg};
    transition: border-color ${transition.default};
  }
  :where(.${AI_FIELD_CLASS}:focus-within) { border-color: ${cv.input.borderFocus}; }
  :where(.${AI_FIELD_CLASS}[data-error="true"]) { border-color: ${cv.input.borderError}; }

  :where(.${AI_PREFIX_CLASS}),
  :where(.${AI_UNIT_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.strong};
  }

  :where(.${AI_PREFIX_CLASS}) { margin-right: ${spacing[4]}px; }
  :where(.${AI_UNIT_CLASS}) { margin-left: ${spacing[4]}px; }

  :where(.${AI_INPUT_CLASS}) {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    /* Input Value — Input Typography 표준 value(15/22 · Regular). base Input 필드 #111(neutral/900). */
    font: ${cv.inputTypography.value.font};
    color: ${cv.textRole.strong};
    text-align: right;
    font-variant-numeric: tabular-nums;
    min-width: 0;
  }

  :where(.${AI_INPUT_CLASS}::placeholder) {
    color: ${cv.input.placeholder};
    font-weight: ${fontWeight.regular};
  }

  :where(.${AI_PRESETS_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    gap: var(--semantic-gap-default);
  }

  :where(.${AI_PRESET_CLASS}) {
    height: 36px;
    padding: 0 var(--semantic-inset-input);
    border: var(--stroke-thin) solid ${cv.borderRole.normal};
    border-radius: ${radius.full}px;
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
    cursor: pointer;
    transition: background-color ${transition.default};
  }
  :where(.${AI_PRESET_CLASS}:hover) { background: ${cv.surface.section}; }

  /* helper 폰트·색·margin·에러색·캐포비 에러아이콘 ::before 는 공용 .nds-helper-text(HelperText.ts) 소유 */
`;
