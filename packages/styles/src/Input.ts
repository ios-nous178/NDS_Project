/* Auto-generated from packages/react/src/Input.tsx during the @nudge-design/styles split. */
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

const INPUT_CLASS = "nds-input";
const INPUT_ROOT_CLASS = `${INPUT_CLASS}__root`;
const INPUT_WRAPPER_CLASS = `${INPUT_CLASS}__wrapper`;
const INPUT_LABEL_CLASS = `${INPUT_CLASS}__label`;
const INPUT_FIELD_CLASS = `${INPUT_CLASS}__field`;
const INPUT_PREFIX_CLASS = `${INPUT_CLASS}__prefix`;
const INPUT_SUFFIX_CLASS = `${INPUT_CLASS}__suffix`;
const INPUT_CLEAR_CLASS = `${INPUT_CLASS}__clear`;
const INPUT_PASSWORD_TOGGLE_CLASS = `${INPUT_CLASS}__password-toggle`;
const INPUT_HELPER_CLASS = `${INPUT_CLASS}__helper`;
const INPUT_HELPER_GROUP_CLASS = `${INPUT_CLASS}__helper-group`;
const INPUT_COUNT_CLASS = `${INPUT_CLASS}__count`;

export const inputStyles = `
  :where(.${INPUT_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    width: var(--nds-input-width, 100%);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  /* label ↔ wrapper 간격은 label gap, wrapper ↔ helper 간격은 helper gap.
   * Figma 명세상 두 간격이 다르므로 children에 직접 margin 부여 */
  :where(.${INPUT_LABEL_CLASS}) + :where(.${INPUT_WRAPPER_CLASS}) {
    margin-top: var(--nds-input-label-gap, ${spacing[12]}px);
  }
  :where(.${INPUT_WRAPPER_CLASS}) + :where(.${INPUT_HELPER_CLASS}),
  :where(.${INPUT_WRAPPER_CLASS}) + :where(.${INPUT_HELPER_GROUP_CLASS}) {
    margin-top: var(--nds-input-helper-gap, ${spacing[8]}px);
  }

  :where(.${INPUT_LABEL_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: ${typeScale.caption2.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${INPUT_WRAPPER_CLASS}) {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    width: 100%;
    min-height: var(--nds-input-height, ${sizing.input.default}px);
    padding: 0 var(--nds-input-padding-x, var(--semantic-inset-card));
    border: 1px solid var(--nds-input-border-color, ${cv.input.borderDefault});
    border-radius: var(--nds-input-radius, ${radius.md}px);
    background: var(--nds-input-background, ${cv.surface.default});
    box-sizing: border-box;
    transition:
      border-color ${transition.default},
      background-color ${transition.default};
  }

  :where(.${INPUT_ROOT_CLASS}[data-disabled="true"]) {
    --nds-input-helper-gap: ${spacing[12]}px;
  }

  :where(.${INPUT_WRAPPER_CLASS}[data-focused="true"]) {
    border-color: ${cv.input.borderFocus};
  }

  :where(.${INPUT_WRAPPER_CLASS}[data-error="true"]) {
    border-color: ${cv.input.borderError};
  }

  :where(.${INPUT_WRAPPER_CLASS}[data-disabled="true"]) {
    background: ${cv.surface.subtle};
    cursor: default;
  }

  :where(.${INPUT_WRAPPER_CLASS}[data-readonly="true"]) {
    background: ${cv.surface.subtle};
  }

  :where(.${INPUT_FIELD_CLASS}) {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    /* Figma --color-label-normal = #111 (neutral/900) */
    color: ${cv.textRole.strong};
    padding: 0;
  }

  :where(.${INPUT_FIELD_CLASS}::placeholder) {
    color: ${cv.input.placeholder};
  }

  :where(.${INPUT_FIELD_CLASS}:disabled) {
    color: ${cv.textRole.muted};
    cursor: default;
  }

  :where(.${INPUT_PREFIX_CLASS}),
  :where(.${INPUT_SUFFIX_CLASS}) {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    line-height: 1;
    color: ${cv.iconRole.strong};
  }

  :where(.${INPUT_COUNT_CLASS}) {
    flex-shrink: 0;
    white-space: nowrap;
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: 1;
    color: ${cv.textRole.muted};
    font-variant-numeric: tabular-nums;
  }

  :where(.${INPUT_COUNT_CLASS}[data-over="true"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${INPUT_CLEAR_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    color: ${cv.iconRole.normal};
    line-height: 1;
  }

  :where(.${INPUT_CLEAR_CLASS} svg) {
    width: ${sizing.icon.default}px;
    height: ${sizing.icon.default}px;
  }

  :where(.${INPUT_PASSWORD_TOGGLE_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    color: ${cv.iconRole.normal};
    line-height: 1;
  }

  :where(.${INPUT_PASSWORD_TOGGLE_CLASS}:hover:not(:disabled)) {
    color: ${cv.iconRole.strong};
  }

  :where(.${INPUT_PASSWORD_TOGGLE_CLASS}:disabled) {
    cursor: default;
    color: ${cv.iconRole.disabled};
  }

  :where(.${INPUT_PASSWORD_TOGGLE_CLASS} svg) {
    width: ${sizing.icon.default}px;
    height: ${sizing.icon.default}px;
  }

  /* Helper text color — Figma Section_Input (294:12) Input/HelperText/* 토큰 사용.
   *   default  = #999999 (Text/Muted/Default — 일반 도움말)
   *   success  = var(--semantic-text-brand-default) (Text/Brand/Default — 폼 검증 통과)
   *   error    = #F13F00 (Text/Status/Error — 폼 오류)
   *   disabled = #C7C7C7 (Text/Disabled/Default — 비활성)
   * 일반 success(녹색, Banner/Toast 용)과 구분되도록 brand 톤으로 분리. */
  :where(.${INPUT_HELPER_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[6]}px;
    font-size: ${typeScale.caption2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption2.lineHeight}px;
    color: ${cv.input.helpertextDefault};
  }

  :where(.${INPUT_HELPER_CLASS}[data-variant="error"]) {
    color: ${cv.input.helpertextError};
  }

  :where(.${INPUT_HELPER_CLASS}[data-variant="success"]) {
    color: ${cv.input.helpertextSuccess};
  }

  :where(.${INPUT_HELPER_CLASS}[data-variant="disabled"]),
  :where(.${INPUT_ROOT_CLASS}[data-disabled="true"]) :where(.${INPUT_HELPER_CLASS}) {
    color: ${cv.input.helpertextDisabled};
  }

  /* Helper icon 은 부모 helper 의 color 를 currentColor 로 상속받는다 —
   * variant 별 (default/success/error) 색을 자동 따라가므로 여기서 color 지정 X. */
  :where(.${INPUT_HELPER_CLASS}__icon) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    color: inherit;
  }

  :where(.${INPUT_HELPER_CLASS}__icon svg) {
    width: 16px;
    height: 16px;
  }

  /* Figma 명세: HelpText 1 ↔ HelpText 2 row, 항목 간 gap 12.
   * 좁은 폭에서는 wrap. align-items: flex-start 로 아이콘이 첫 줄에 정렬. */
  :where(.${INPUT_HELPER_GROUP_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    column-gap: ${spacing[12]}px;
    row-gap: ${spacing[4]}px;
  }

  /* 캐포비(cashwalk-biz) admin 전용 — 에러 헬퍼 앞 빨간 경고 아이콘(Figma 04ic/report/red). 다른 브랜드 미노출. */
  [data-brand="cashwalk-biz"] :where(.${INPUT_HELPER_CLASS}[data-variant="error"]) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-tight);
  }
  [data-brand="cashwalk-biz"] :where(.${INPUT_HELPER_CLASS}[data-variant="error"])::before {
    content: "";
    flex: 0 0 auto;
    width: 16px;
    height: 16px;
    background-color: currentColor;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill-rule='evenodd' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E") center / contain no-repeat;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill-rule='evenodd' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E") center / contain no-repeat;
  }
`;
