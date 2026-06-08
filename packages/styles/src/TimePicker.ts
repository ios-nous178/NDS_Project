/* Auto-generated from packages/react/src/TimePicker.tsx during the @nudge-design/styles split. */
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

const TP_CLASS = "nds-time-picker";
const TP_ROOT_CLASS = `${TP_CLASS}__root`;
const TP_LABEL_CLASS = `${TP_CLASS}__label`;
const TP_FIELD_CLASS = `${TP_CLASS}__field`;
const TP_TRIGGER_CLASS = `${TP_CLASS}__trigger`;
const TP_TRIGGER_TEXT_CLASS = `${TP_CLASS}__trigger-text`;
const TP_ICON_CLASS = `${TP_CLASS}__icon`;
const TP_PRESETS_CLASS = `${TP_CLASS}__presets`;
const TP_PRESET_CLASS = `${TP_CLASS}__preset`;
const TP_PANEL_CLASS = `${TP_CLASS}__panel`;
const TP_COLS_CLASS = `${TP_CLASS}__columns`;
const TP_COL_CLASS = `${TP_CLASS}__col`;
const TP_COL_HEAD_CLASS = `${TP_CLASS}__col-head`;
const TP_COL_LIST_CLASS = `${TP_CLASS}__col-list`;
const TP_OPTION_CLASS = `${TP_CLASS}__option`;
const TP_HELPER_CLASS = `${TP_CLASS}__helper`;

export const tpStyles = `
  :where(.${TP_ROOT_CLASS}) {
    display: inline-flex;
    flex-direction: column;
    gap: var(--semantic-gap-default);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${TP_ROOT_CLASS}[data-full-width="true"]) { width: 100%; }

  :where(.${TP_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  /* ── 필드(테두리 박스) — 트리거 + 인라인 빠른설정 칩을 담는다 ── */
  :where(.${TP_FIELD_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    height: var(--nds-input-height, ${sizing.input.default}px);
    padding: 0 ${spacing[8]}px 0 var(--semantic-inset-card);
    border: 1px solid ${cv.input.borderDefault};
    border-radius: var(--nds-input-radius, ${radius.md}px);
    background: ${cv.surface.default};
    transition: border-color ${transition.default};
    box-sizing: border-box;
  }

  :where(.${TP_FIELD_CLASS}[data-open="true"]) { border-color: ${cv.input.borderFocus}; }
  :where(.${TP_FIELD_CLASS}[data-error="true"]) { border-color: ${cv.input.borderError}; }
  :where(.${TP_FIELD_CLASS}[data-disabled="true"]) {
    background: ${cv.surface.section};
  }

  /* 트리거 — 필드 안에서 시각 텍스트 + 시계 아이콘. 클릭 시 패널 토글 */
  :where(.${TP_TRIGGER_CLASS}) {
    flex: 1;
    min-width: 0;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--semantic-gap-default);
    height: 100%;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    color: ${cv.textRole.normal};
    font-variant-numeric: tabular-nums;
  }
  :where(.${TP_TRIGGER_CLASS}:disabled) { cursor: not-allowed; color: ${cv.textRole.disabled}; }
  :where(.${TP_TRIGGER_CLASS}[data-placeholder="true"] .${TP_TRIGGER_TEXT_CLASS}) { color: ${cv.input.placeholder}; }

  :where(.${TP_TRIGGER_TEXT_CLASS}) {
    flex: 1;
    min-width: 0;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 시계 아이콘(Figma ic_time_picker) — 패널 열기 affordance */
  :where(.${TP_ICON_CLASS}) {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: ${cv.iconRole.normal};
  }
  :where(.${TP_ICON_CLASS} svg) { width: 20px; height: 20px; display: block; }
  :where(.${TP_TRIGGER_CLASS}:disabled .${TP_ICON_CLASS}) { color: ${cv.textRole.disabled}; }

  /* 빠른설정 프리셋 칩('자정까지' 등) — 필드 트레일링, 회색 중립 surface(노란 brand 아님) */
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

  /* ── 팝오버 패널 (DatePicker 패널과 동일 surface/shadow/radius) ── */
  :where(.${TP_PANEL_CLASS}) {
    position: fixed;
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    box-shadow: ${shadow["2"]};
    z-index: ${zIndex.dropdown};
    padding: var(--semantic-inset-input);
    box-sizing: border-box;
    font-family: ${fontFamily.web};
    animation: nds-time-picker-fade-in ${transition.default};
  }

  :where(.${TP_COLS_CLASS}) {
    display: flex;
    gap: ${spacing[8]}px;
  }

  :where(.${TP_COL_CLASS}) {
    display: flex;
    flex-direction: column;
    min-width: 64px;
  }

  :where(.${TP_COL_HEAD_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
  }

  /* 시/분 스크롤 리스트 — 약 6칸 높이로 고정, 나머지는 스크롤 */
  :where(.${TP_COL_LIST_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-height: 216px;
    overflow-y: auto;
    /* 스크롤 기능은 유지하되 스크롤바 UI 는 숨김 (시/분 컬럼 시각 정돈) */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* 구 Edge/IE */
  }
  :where(.${TP_COL_LIST_CLASS})::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Webkit */
  }

  :where(.${TP_OPTION_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    height: 34px;
    min-width: 56px;
    border: none;
    background: transparent;
    border-radius: ${radius.sm}px;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: 1;
    color: ${cv.textRole.normal};
    font-variant-numeric: tabular-nums;
    transition: background-color ${transition.default}, color ${transition.default};
  }

  :where(.${TP_OPTION_CLASS}:hover:not(:disabled):not([data-selected="true"])) {
    background: ${cv.surface.subtle};
  }

  :where(.${TP_OPTION_CLASS}[data-selected="true"]) {
    background: ${cv.surface.brand};
    color: ${cv.button.textDefault};
    font-weight: ${fontWeight.medium};
  }

  :where(.${TP_OPTION_CLASS}:disabled) {
    color: ${cv.textRole.muted};
    cursor: not-allowed;
    background: transparent;
  }

  :where(.${TP_OPTION_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.focus};
    outline-offset: -2px;
  }

  :where(.${TP_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
  }
  :where(.${TP_HELPER_CLASS}[data-error="true"]) { color: var(--semantic-text-status-error); }

  @keyframes nds-time-picker-fade-in {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
