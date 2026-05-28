/* Auto-generated from packages/react/src/DateRangePicker.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, spacing, typeScale } from "@nudge-design/tokens";

const DR_CLASS = "nds-date-range";
const DR_ROOT_CLASS = `${DR_CLASS}__root`;
const DR_FIELD_CLASS = `${DR_CLASS}__field`;
const DR_LABEL_CLASS = `${DR_CLASS}__label`;
const DR_SEPARATOR_CLASS = `${DR_CLASS}__separator`;
const DR_PRESETS_CLASS = `${DR_CLASS}__presets`;
const DR_PRESET_CLASS = `${DR_CLASS}__preset`;

export const dateRangeStyles = `
  :where(.${DR_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-default);
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${DR_FIELD_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    flex-wrap: wrap;
  }

  :where(.${DR_LABEL_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
    flex-shrink: 0;
  }

  :where(.${DR_SEPARATOR_CLASS}) {
    flex-shrink: 0;
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.body3.fontSize}px;
  }

  :where(.${DR_PRESETS_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing[6]}px;
  }

  :where(.${DR_PRESET_CLASS}) {
    all: unset;
    display: inline-flex;
    align-items: center;
    padding: ${spacing[4]}px ${spacing[10]}px;
    background: ${cv.surface.page};
    color: ${cv.textRole.strong};
    border-radius: 999px;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.medium};
    cursor: pointer;
  }

  :where(.${DR_PRESET_CLASS}[data-active="true"]) {
    background: ${cv.surface.brandSubtle};
    color: ${cv.textRole.brand};
  }
`;
