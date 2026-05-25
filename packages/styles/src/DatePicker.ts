/* Auto-generated from packages/react/src/DatePicker.tsx during the @nudge-eap/styles split. */
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
} from "@nudge-eap/tokens";

const DP_CLASS = "nds-date-picker";
const DP_ROOT_CLASS = `${DP_CLASS}__root`;
const DP_TRIGGER_CLASS = `${DP_CLASS}__trigger`;
const DP_TRIGGER_TEXT_CLASS = `${DP_CLASS}__trigger-text`;
const DP_ICON_CLASS = `${DP_CLASS}__icon`;
const DP_PANEL_CLASS = `${DP_CLASS}__panel`;
const DP_HEADER_CLASS = `${DP_CLASS}__header`;
const DP_NAV_BTN_CLASS = `${DP_CLASS}__nav-btn`;
const DP_TITLE_CLASS = `${DP_CLASS}__title`;
const DP_DOW_CLASS = `${DP_CLASS}__dow`;
const DP_DOW_CELL_CLASS = `${DP_CLASS}__dow-cell`;
const DP_GRID_CLASS = `${DP_CLASS}__grid`;
const DP_DAY_CLASS = `${DP_CLASS}__day`;
const DP_FOOTER_CLASS = `${DP_CLASS}__footer`;

export const datePickerStyles = `
  :where(.${DP_ROOT_CLASS}) {
    display: inline-flex;
    width: var(--nds-date-picker-width, auto);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${DP_ROOT_CLASS}[data-fullwidth="true"]) {
    width: 100%;
  }

  :where(.${DP_TRIGGER_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-default);
    width: 100%;
    min-height: var(--nds-datepicker-height, ${sizing.input.default}px);
    padding: 0 var(--nds-datepicker-padding-x, var(--inset-card));
    border: 1px solid ${cv.borderRole.normal};
    border-radius: var(--nds-datepicker-radius, ${radius.md}px);
    background: ${cv.surface.default};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
    transition: border-color ${transition.default};
    box-sizing: border-box;
  }

  :where(.${DP_TRIGGER_CLASS}[data-open="true"]) {
    border-color: ${cv.input.borderFocus};
  }

  :where(.${DP_TRIGGER_CLASS}[data-error="true"]) {
    border-color: ${cv.input.borderError};
  }

  :where(.${DP_TRIGGER_CLASS}:disabled) {
    background: ${cv.surface.disabled};
    color: ${cv.textRole.muted};
    cursor: not-allowed;
  }

  :where(.${DP_TRIGGER_TEXT_CLASS}) {
    flex: 1;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${DP_TRIGGER_TEXT_CLASS}[data-placeholder="true"]) {
    color: ${cv.textRole.muted};
  }

  :where(.${DP_ICON_CLASS}) {
    display: inline-flex;
    flex-shrink: 0;
    color: ${cv.iconRole.normal};
  }

  :where(.${DP_PANEL_CLASS}) {
    position: fixed;
    width: 296px;
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    box-shadow: ${shadow["2"]};
    z-index: ${zIndex.dropdown};
    padding: var(--inset-input);
    box-sizing: border-box;
    font-family: ${fontFamily.web};
    animation: nds-date-picker-fade-in ${transition.default};
  }

  :where(.${DP_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${spacing[8]}px;
  }

  :where(.${DP_NAV_BTN_CLASS}) {
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

  :where(.${DP_NAV_BTN_CLASS}:hover) {
    background: ${cv.surface.subtle};
  }

  :where(.${DP_NAV_BTN_CLASS}:disabled) {
    color: ${cv.iconRole.normal};
    cursor: not-allowed;
    opacity: 0.4;
  }

  :where(.${DP_NAV_BTN_CLASS} svg) {
    width: 16px;
    height: 16px;
  }

  :where(.${DP_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  :where(.${DP_DOW_CLASS}) {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: ${spacing[4]}px;
  }

  :where(.${DP_DOW_CELL_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
  }

  :where(.${DP_DOW_CELL_CLASS}[data-day="0"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${DP_GRID_CLASS}) {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  :where(.${DP_DAY_CLASS}) {
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

  :where(.${DP_DAY_CLASS}[data-outside="true"]) {
    color: ${cv.textRole.muted};
  }

  :where(.${DP_DAY_CLASS}[data-day="0"]:not([data-disabled="true"])) {
    color: ${cv.textRole.statusError};
  }

  :where(.${DP_DAY_CLASS}:hover:not(:disabled):not([data-selected="true"])) {
    background: ${cv.surface.subtle};
  }

  :where(.${DP_DAY_CLASS}[data-today="true"]:not([data-selected="true"])) {
    font-weight: ${fontWeight.bold};
    outline: 1px solid ${cv.borderRole.normal};
    outline-offset: -1px;
  }

  :where(.${DP_DAY_CLASS}[data-selected="true"]) {
    background: ${cv.surface.brand};
    color: ${cv.textRole.inverse};
    font-weight: ${fontWeight.medium};
  }

  :where(.${DP_DAY_CLASS}:disabled),
  :where(.${DP_DAY_CLASS}[data-disabled="true"]) {
    color: ${cv.textRole.muted};
    cursor: not-allowed;
    background: transparent;
  }

  :where(.${DP_FOOTER_CLASS}) {
    display: flex;
    justify-content: flex-end;
    margin-top: ${spacing[8]}px;
    padding-top: var(--inset-chip);
    border-top: 1px solid ${cv.borderRole.subtle};
  }

  @keyframes nds-date-picker-fade-in {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
