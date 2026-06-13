/* Auto-generated from packages/react/src/DatePicker.tsx during the @nudge-design/styles split. */
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

const DP_CLASS = "nds-date-picker";
const DP_ROOT_CLASS = `${DP_CLASS}__root`;
const DP_TRIGGER_CLASS = `${DP_CLASS}__trigger`;
const DP_TRIGGER_TEXT_CLASS = `${DP_CLASS}__trigger-text`;
const DP_ICON_CLASS = `${DP_CLASS}__icon`;
const DP_CLEAR_BTN_CLASS = `${DP_CLASS}__clear-btn`;
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
    position: relative;
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
    gap: var(--semantic-gap-default);
    width: 100%;
    min-height: var(--nds-datepicker-height, ${sizing.input.default}px);
    padding: 0 var(--nds-datepicker-padding-x, var(--semantic-inset-card));
    border: 1px solid ${cv.input.borderDefault};
    border-radius: var(--nds-datepicker-radius, ${radius.md}px);
    background: ${cv.input.bg};
    cursor: pointer;
    font-family: inherit;
    font-size: var(--nds-datepicker-font-size, ${typeScale.body3.fontSize}px);
    line-height: var(--nds-datepicker-line-height, ${typeScale.body3.lineHeight}px);
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

  :where(.${DP_TRIGGER_CLASS}[data-status="warning"]) {
    border-color: ${cv.textRole.statusCaution};
  }

  :where(.${DP_TRIGGER_CLASS}:disabled) {
    background: ${cv.input.bgDisabled};
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
    color: ${cv.input.placeholder};
  }

  :where(.${DP_ICON_CLASS}) {
    display: inline-flex;
    flex-shrink: 0;
    color: ${cv.iconRole.normal};
  }

  /* clear(×) 가 노출될 때 캘린더 글리프와 같은 우측 inset 에서 겹치므로 아이콘을 숨긴다(swap).
     × 가 캘린더 아이콘 자리를 대체 — 값이 없으면 clear 가 사라지고 캘린더 아이콘이 복귀한다. */
  :where(.${DP_TRIGGER_CLASS}[data-clearable="true"] .${DP_ICON_CLASS}) {
    display: none;
  }

  :where(.${DP_CLEAR_BTN_CLASS}) {
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

  :where(.${DP_CLEAR_BTN_CLASS}:hover) {
    background: ${cv.surface.disabled};
    color: ${cv.iconRole.strong};
  }

  /* HTML 어댑터(<nds-date-picker>) 는 빈 wrapper 만 두고 CSS mask 로 캘린더 글리프를 그린다.
     React 어댑터는 자식 <svg> 가 있어 :empty 매칭이 안 되므로 영향 없음 — useBrand() 훅이 같은 역할을 수행한다.
     브랜드 글리프를 추가할 때는 아래 [data-brand="..."] cascade 에 한 줄만 더하면 된다. */
  :where(.${DP_ICON_CLASS}:empty) {
    width: 20px;
    height: 20px;
    background-color: currentColor;
    -webkit-mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'><rect x='3' y='4' width='14' height='13' rx='2' stroke='black' stroke-width='1.5'/><path d='M3 8h14M7 2v3M13 2v3' stroke='black' stroke-width='1.5' stroke-linecap='round'/></svg>") center / contain no-repeat;
    mask: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'><rect x='3' y='4' width='14' height='13' rx='2' stroke='black' stroke-width='1.5'/><path d='M3 8h14M7 2v3M13 2v3' stroke='black' stroke-width='1.5' stroke-linecap='round'/></svg>") center / contain no-repeat;
  }

  :where([data-brand="cashwalk-biz"] .${DP_ICON_CLASS}:empty) {
    -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'><path fill-rule='evenodd' clip-rule='evenodd' d='M17 2H16V1C16 0.447715 15.5523 0 15 0C14.4477 0 14 0.447715 14 1V2H6V1C6 0.447715 5.55228 0 5 0C4.44772 0 4 0.447715 4 1V2H3C1.34315 2 0 3.34315 0 5V17C0 18.6569 1.34315 20 3 20H17C18.6569 20 20 18.6569 20 17V5C20 3.34315 18.6569 2 17 2ZM6 11C6 11.5523 5.55228 12 5 12C4.44772 12 4 11.5523 4 11C4 10.4477 4.44772 10 5 10C5.55228 10 6 10.4477 6 11ZM10 12C10.5523 12 11 11.5523 11 11C11 10.4477 10.5523 10 10 10C9.44771 10 9 10.4477 9 11C9 11.5523 9.44771 12 10 12ZM15 12C15.5523 12 16 11.5523 16 11C16 10.4477 15.5523 10 15 10C14.4477 10 14 10.4477 14 11C14 11.5523 14.4477 12 15 12ZM11 15C11 15.5523 10.5523 16 10 16C9.44771 16 9 15.5523 9 15C9 14.4477 9.44771 14 10 14C10.5523 14 11 14.4477 11 15ZM15 16C15.5523 16 16 15.5523 16 15C16 14.4477 15.5523 14 15 14C14.4477 14 14 14.4477 14 15C14 15.5523 14.4477 16 15 16ZM17 18C17.5523 18 18 17.5523 18 17V8H2V17C2 17.5523 2.44772 18 3 18H17ZM18 6H2V5C2 4.44772 2.44772 4 3 4H17C17.5523 4 18 4.44772 18 5V6ZM6 15C6 15.5523 5.55228 16 5 16C4.44772 16 4 15.5523 4 15C4 14.4477 4.44772 14 5 14C5.55228 14 6 14.4477 6 15Z' fill='black'/></svg>");
    mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'><path fill-rule='evenodd' clip-rule='evenodd' d='M17 2H16V1C16 0.447715 15.5523 0 15 0C14.4477 0 14 0.447715 14 1V2H6V1C6 0.447715 5.55228 0 5 0C4.44772 0 4 0.447715 4 1V2H3C1.34315 2 0 3.34315 0 5V17C0 18.6569 1.34315 20 3 20H17C18.6569 20 20 18.6569 20 17V5C20 3.34315 18.6569 2 17 2ZM6 11C6 11.5523 5.55228 12 5 12C4.44772 12 4 11.5523 4 11C4 10.4477 4.44772 10 5 10C5.55228 10 6 10.4477 6 11ZM10 12C10.5523 12 11 11.5523 11 11C11 10.4477 10.5523 10 10 10C9.44771 10 9 10.4477 9 11C9 11.5523 9.44771 12 10 12ZM15 12C15.5523 12 16 11.5523 16 11C16 10.4477 15.5523 10 15 10C14.4477 10 14 10.4477 14 11C14 11.5523 14.4477 12 15 12ZM11 15C11 15.5523 10.5523 16 10 16C9.44771 16 9 15.5523 9 15C9 14.4477 9.44771 14 10 14C10.5523 14 11 14.4477 11 15ZM15 16C15.5523 16 16 15.5523 16 15C16 14.4477 15.5523 14 15 14C14.4477 14 14 14.4477 14 15C14 15.5523 14.4477 16 15 16ZM17 18C17.5523 18 18 17.5523 18 17V8H2V17C2 17.5523 2.44772 18 3 18H17ZM18 6H2V5C2 4.44772 2.44772 4 3 4H17C17.5523 4 18 4.44772 18 5V6ZM6 15C6 15.5523 5.55228 16 5 16C4.44772 16 4 15.5523 4 15C4 14.4477 4.44772 14 5 14C5.55228 14 6 14.4477 6 15Z' fill='black'/></svg>");
  }

  :where(.${DP_PANEL_CLASS}) {
    position: fixed;
    width: 296px;
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    box-shadow: ${shadow["2"]};
    z-index: ${zIndex.dropdown};
    padding: var(--semantic-inset-input);
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

  :where(.${DP_DAY_CLASS}[data-active="true"]:focus-visible) {
    outline: 2px solid ${cv.input.borderFocus};
    outline-offset: -2px;
  }

  :where(.${DP_DAY_CLASS}[data-selected="true"]) {
    background: ${cv.surface.brand};
    color: ${cv.button.textDefault};
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
    padding-top: var(--semantic-inset-chip);
    border-top: 1px solid ${cv.borderRole.subtle};
  }

  @keyframes nds-date-picker-fade-in {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
