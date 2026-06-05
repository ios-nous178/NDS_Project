/* Auto-generated from packages/react/src/TimePicker.tsx during the @nudge-design/styles split. */
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

const TP_CLASS = "nds-time-picker";
const TP_ROOT_CLASS = `${TP_CLASS}__root`;
const TP_LABEL_CLASS = `${TP_CLASS}__label`;
const TP_FIELD_CLASS = `${TP_CLASS}__field`;
const TP_INPUT_CLASS = `${TP_CLASS}__input`;
const TP_ICON_CLASS = `${TP_CLASS}__icon`;
const TP_PRESETS_CLASS = `${TP_CLASS}__presets`;
const TP_PRESET_CLASS = `${TP_CLASS}__preset`;
const TP_HELPER_CLASS = `${TP_CLASS}__helper`;

export const tpStyles = `
  :where(.${TP_ROOT_CLASS}) {
    display: inline-flex;
    flex-direction: column;
    gap: var(--semantic-gap-default);
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
    gap: var(--semantic-gap-default);
    height: ${sizing.input.default}px;
    padding: 0 ${spacing[8]}px 0 var(--semantic-inset-card);
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
    min-width: 0;
    border: none;
    background: transparent;
    outline: none;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    color: ${cv.textRole.normal};
    font-variant-numeric: tabular-nums;
  }
  /* 네이티브 시계/스피너 indicator 숨김 — DS 시계 아이콘(ic_time_picker)으로 대체. */
  :where(.${TP_INPUT_CLASS})::-webkit-calendar-picker-indicator { display: none; }
  :where(.${TP_INPUT_CLASS})::-webkit-inner-spin-button,
  :where(.${TP_INPUT_CLASS})::-webkit-clear-button { -webkit-appearance: none; display: none; }

  /* 시계 아이콘(Figma ic_time_picker) — 클릭 시 네이티브 picker(showPicker) 호출 affordance. */
  :where(.${TP_ICON_CLASS}) {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    background: transparent;
    color: ${cv.iconRole.normal};
    cursor: pointer;
  }
  :where(.${TP_ICON_CLASS} svg) { width: 20px; height: 20px; display: block; }
  :where(.${TP_FIELD_CLASS}[data-disabled="true"] .${TP_ICON_CLASS}) { cursor: not-allowed; color: ${cv.textRole.disabled}; }

  /* 빠른설정 프리셋 칩('자정까지' 등) — 회색 중립 surface 보조 액션(노란 brand 아님). */
  :where(.${TP_PRESETS_CLASS}) {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: ${spacing[8]}px;
  }
  :where(.${TP_PRESET_CLASS}) {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    height: 32px;
    padding: 0 ${spacing[10]}px;
    border: none;
    border-radius: ${radius.sm}px;
    background: ${cv.surface.section};
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: 1;
    cursor: pointer;
    transition: background ${transition.default};
    white-space: nowrap;
  }
  :where(.${TP_PRESET_CLASS}:hover) { filter: brightness(0.96); }
  :where(.${TP_PRESET_CLASS}:focus-visible) { outline: 2px solid ${cv.borderRole.focus}; outline-offset: 1px; }
  :where(.${TP_FIELD_CLASS}[data-disabled="true"] .${TP_PRESET_CLASS}) { cursor: not-allowed; opacity: 0.6; }

  :where(.${TP_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${TP_HELPER_CLASS}[data-error="true"]) { color: var(--semantic-text-status-error); }
`;
