/* Auto-generated from packages/react/src/DateRangePicker.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  shadow,
  sizing,
  spacing,
  transition,
  typeScale,
  zIndex,
} from "@nudge-design/tokens";

const DR_CLASS = "nds-date-range";
const DR_ROOT_CLASS = `${DR_CLASS}__root`;
const DR_TRIGGER_CLASS = `${DR_CLASS}__trigger`;
const DR_TRIGGER_TEXT_CLASS = `${DR_CLASS}__trigger-text`;
const DR_ICON_CLASS = `${DR_CLASS}__icon`;
const DR_CLEAR_BTN_CLASS = `${DR_CLASS}__clear-btn`;
const DR_PANEL_CLASS = `${DR_CLASS}__panel`;
const DR_HEADER_CLASS = `${DR_CLASS}__header`;
const DR_TITLE_CLASS = `${DR_CLASS}__title`;
const DR_NAV_BTN_CLASS = `${DR_CLASS}__nav-btn`;
const DR_BODY_CLASS = `${DR_CLASS}__body`;
const DR_MONTH_CLASS = `${DR_CLASS}__month`;
const DR_DOW_CLASS = `${DR_CLASS}__dow`;
const DR_DOW_CELL_CLASS = `${DR_CLASS}__dow-cell`;
const DR_GRID_CLASS = `${DR_CLASS}__grid`;
const DR_DAY_CLASS = `${DR_CLASS}__day`;
const DR_HINT_CLASS = `${DR_CLASS}__hint`;
const DR_PRESETS_CLASS = `${DR_CLASS}__presets`;
const DR_PRESET_CLASS = `${DR_CLASS}__preset`;

export const dateRangeStyles = `
  :where(.${DR_ROOT_CLASS}) {
    display: inline-flex;
    position: relative;
    width: var(--nds-date-range-width, auto);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${DR_ROOT_CLASS}[data-fullwidth="true"]) {
    width: 100%;
  }

  :where(.${DR_TRIGGER_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--semantic-gap-default);
    width: 100%;
    min-height: var(--nds-datepicker-height, ${sizing.input.default}px);
    padding: 0 var(--nds-datepicker-padding-x, var(--semantic-inset-card));
    border: 1px solid ${cv.borderRole.normal};
    border-radius: var(--nds-datepicker-radius, ${radius.md}px);
    background: ${cv.surface.default};
    cursor: pointer;
    font-family: inherit;
    font-size: var(--nds-datepicker-font-size, ${typeScale.body3.fontSize}px);
    line-height: var(--nds-datepicker-line-height, ${typeScale.body3.lineHeight}px);
    color: ${cv.textRole.normal};
    transition: border-color ${transition.default};
    box-sizing: border-box;
  }

  :where(.${DR_TRIGGER_CLASS}[data-open="true"]) {
    border-color: ${cv.input.borderFocus};
  }

  :where(.${DR_TRIGGER_CLASS}[data-error="true"]) {
    border-color: ${cv.input.borderError};
  }

  :where(.${DR_TRIGGER_CLASS}[data-status="warning"]) {
    border-color: ${cv.textRole.statusCaution};
  }

  :where(.${DR_TRIGGER_CLASS}:disabled) {
    background: ${cv.surface.disabled};
    color: ${cv.textRole.muted};
    cursor: not-allowed;
  }

  :where(.${DR_TRIGGER_TEXT_CLASS}) {
    flex: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${DR_TRIGGER_TEXT_CLASS}[data-placeholder="true"]) {
    color: ${cv.textRole.muted};
  }

  :where(.${DR_ICON_CLASS}) {
    display: inline-flex;
    flex-shrink: 0;
    color: ${cv.iconRole.normal};
  }

  :where(.${DR_ICON_CLASS}:empty) {
    width: 20px;
    height: 20px;
    background-color: currentColor;
    -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'><rect x='3' y='4' width='14' height='13' rx='2' stroke='black' stroke-width='1.5'/><path d='M3 8h14M7 2v3M13 2v3' stroke='black' stroke-width='1.5' stroke-linecap='round'/></svg>") center / contain no-repeat;
    mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'><rect x='3' y='4' width='14' height='13' rx='2' stroke='black' stroke-width='1.5'/><path d='M3 8h14M7 2v3M13 2v3' stroke='black' stroke-width='1.5' stroke-linecap='round'/></svg>") center / contain no-repeat;
  }

  :where(.${DR_CLEAR_BTN_CLASS}) {
    position: absolute;
    top: 50%;
    right: var(--semantic-inset-card);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: ${cv.surface.subtle};
    color: ${cv.iconRole.normal};
    font-family: inherit;
    font-size: 16px;
    line-height: 1;
    transform: translateY(-50%);
    cursor: pointer;
  }

  :where(.${DR_CLEAR_BTN_CLASS}:hover) {
    background: ${cv.surface.disabled};
    color: ${cv.iconRole.strong};
  }

  :where(.${DR_PANEL_CLASS}) {
    position: fixed;
    width: min(624px, calc(100vw - 32px));
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    box-shadow: ${shadow["2"]};
    z-index: ${zIndex.dropdown};
    padding: var(--semantic-inset-input);
    box-sizing: border-box;
    font-family: ${fontFamily.web};
    animation: nds-date-range-fade-in ${transition.default};
  }

  :where(.${DR_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${spacing[8]}px;
  }

  :where(.${DR_NAV_BTN_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: ${radius.sm}px;
    background: transparent;
    cursor: pointer;
    color: ${cv.iconRole.strong};
    transition: background-color ${transition.default};
  }

  :where(.${DR_NAV_BTN_CLASS}:hover) {
    background: ${cv.surface.subtle};
  }

  :where(.${DR_NAV_BTN_CLASS}:disabled) {
    color: ${cv.iconRole.normal};
    cursor: not-allowed;
    opacity: 0.4;
  }

  :where(.${DR_NAV_BTN_CLASS} svg) {
    width: 16px;
    height: 16px;
  }

  :where(.${DR_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  :where(.${DR_BODY_CLASS}) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--semantic-gap-default);
    align-items: start;
  }

  :where(.${DR_BODY_CLASS}[data-has-presets="true"]) {
    grid-template-columns: minmax(112px, 152px) minmax(0, 1fr) minmax(0, 1fr);
  }

  :where(.${DR_PRESETS_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[6]}px;
  }

  :where(.${DR_PRESET_CLASS}) {
    all: unset;
    display: inline-flex;
    align-items: center;
    min-height: 32px;
    padding: 0 ${spacing[10]}px;
    background: ${cv.surface.page};
    color: ${cv.textRole.strong};
    border-radius: 999px;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.medium};
    cursor: pointer;
    box-sizing: border-box;
  }

  :where(.${DR_PRESET_CLASS}[data-active="true"]) {
    background: ${cv.surface.brandSubtle};
    color: ${cv.textRole.brand};
  }

  :where(.${DR_MONTH_CLASS}) {
    min-width: 0;
  }

  :where(.${DR_MONTH_CLASS} > .${DR_TITLE_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    margin-bottom: ${spacing[4]}px;
  }

  :where(.${DR_DOW_CLASS}) {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: ${spacing[4]}px;
  }

  :where(.${DR_DOW_CELL_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
  }

  :where(.${DR_DOW_CELL_CLASS}[data-day="0"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${DR_GRID_CLASS}) {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 2px;
  }

  :where(.${DR_DAY_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    border: none;
    background: transparent;
    border-radius: ${radius.sm}px;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: 1;
    color: ${cv.textRole.normal};
    transition: background-color ${transition.default}, color ${transition.default};
  }

  :where(.${DR_DAY_CLASS}[data-outside="true"]) {
    color: ${cv.textRole.muted};
  }

  :where(.${DR_DAY_CLASS}[data-day="0"]:not([data-disabled="true"])) {
    color: ${cv.textRole.statusError};
  }

  :where(.${DR_DAY_CLASS}[data-in-range="true"]),
  :where(.${DR_DAY_CLASS}[data-preview="true"]) {
    background: ${cv.surface.brandSubtle};
    color: ${cv.textRole.brand};
  }

  :where(.${DR_DAY_CLASS}:hover:not(:disabled):not([data-range-start="true"]):not([data-range-end="true"])) {
    background: ${cv.surface.subtle};
  }

  :where(.${DR_DAY_CLASS}[data-today="true"]:not([data-range-start="true"]):not([data-range-end="true"])) {
    font-weight: ${fontWeight.bold};
    outline: 1px solid ${cv.borderRole.normal};
    outline-offset: -1px;
  }

  :where(.${DR_DAY_CLASS}[data-range-start="true"]),
  :where(.${DR_DAY_CLASS}[data-range-end="true"]) {
    background: ${cv.surface.brand};
    color: ${cv.button.textDefault};
    font-weight: ${fontWeight.medium};
  }

  :where(.${DR_DAY_CLASS}[data-active="true"]:focus-visible) {
    outline: 2px solid ${cv.input.borderFocus};
    outline-offset: -2px;
  }

  :where(.${DR_DAY_CLASS}:disabled),
  :where(.${DR_DAY_CLASS}[data-disabled="true"]) {
    color: ${cv.textRole.muted};
    cursor: not-allowed;
    background: transparent;
  }

  :where(.${DR_HINT_CLASS}) {
    margin-top: ${spacing[8]}px;
    padding-top: var(--semantic-inset-chip);
    border-top: 1px solid ${cv.borderRole.subtle};
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
  }

  @media (max-width: 640px) {
    :where(.${DR_PANEL_CLASS}) {
      width: min(360px, calc(100vw - 24px));
    }

    :where(.${DR_BODY_CLASS}) {
      grid-template-columns: 1fr;
    }

    :where(.${DR_PRESETS_CLASS}) {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }

  @keyframes nds-date-range-fade-in {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
