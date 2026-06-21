/* Auto-generated from packages/react/src/PhoneInput.tsx during the @nudge-design/styles split. */
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
} from "@nudge-design/tokens";

const PI_CLASS = "nds-phone-input";
const PI_ROOT_CLASS = `${PI_CLASS}__root`;
const PI_LABEL_CLASS = `${PI_CLASS}__label`;
const PI_FIELD_CLASS = `${PI_CLASS}__field`;
const PI_FIELD_WRAP_CLASS = `${PI_CLASS}__field-wrap`;
const PI_DIAL_CLASS = `${PI_CLASS}__dial`;
const PI_DIAL_CODE_CLASS = `${PI_CLASS}__dial-code`;
const PI_CHEVRON_CLASS = `${PI_CLASS}__chevron`;
const PI_INPUT_CLASS = `${PI_CLASS}__input`;
const PI_MENU_CLASS = `${PI_CLASS}__menu`;
const PI_MENU_ITEM_CLASS = `${PI_CLASS}__menu-item`;
const PI_MENU_CODE_CLASS = `${PI_CLASS}__menu-code`;
const PI_MENU_NAME_CLASS = `${PI_CLASS}__menu-name`;
const PI_MENU_DIAL_CLASS = `${PI_CLASS}__menu-dial`;

export const phoneInputStyles = `
  :where(.${PI_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-label);
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${PI_LABEL_CLASS}) {
    /* Input Typography 표준 label(13/18 · Medium, Figma 4247:1964). */
    font: ${cv.inputTypography.label.font};
    color: ${cv.textRole.normal};
  }

  :where(.${PI_FIELD_WRAP_CLASS}) {
    position: relative;
  }

  /* Figma 3001:40209 — 국가코드 드롭다운 박스 + 번호 입력 박스가 분리된 두 박스.
   * 각 박스는 base Input 시멘틱 토큰(height/radius/border/background)을 그대로 상속. */
  :where(.${PI_FIELD_CLASS}) {
    display: flex;
    align-items: stretch;
    gap: var(--semantic-gap-default);
  }

  /* 국가 코드 드롭다운 — 독립 박스 (base Input 토큰) */
  :where(.${PI_DIAL_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[6]}px;
    height: var(--nds-input-height, ${sizing.input.default}px);
    padding: 0 var(--semantic-inset-input);
    border: var(--stroke-thin) solid var(--nds-input-border-color, ${cv.input.borderDefault});
    border-radius: var(--nds-input-radius, ${radius[8]}px);
    background: var(--nds-input-background, ${cv.input.bg});
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.medium};
    cursor: pointer;
    flex-shrink: 0;
    box-sizing: border-box;
    transition: border-color ${transition.default};
  }

  :where(.${PI_DIAL_CLASS}:focus-visible) {
    outline: none;
    border-color: ${cv.input.borderFocus};
  }

  :where(.${PI_DIAL_CLASS}[aria-expanded="true"]) { border-color: ${cv.input.borderFocus}; }

  :where(.${PI_DIAL_CLASS}:disabled) { cursor: not-allowed; opacity: 0.6; }

  /* dial 박스가 "+82"(3글자) 폭 이하로 줄지 않도록 코드 텍스트에 floor.
   * inline-block 이라야 min-width 가 먹고, 3ch(폰트 상대 — 매직 px 없음)는
   * tabular-nums 기준 3글자 폭. "+1" 처럼 짧아도 박스가 +82 폭을 유지하고,
   * 더 긴 코드는 자연 확장. flex-shrink:0 인 dial 박스가 이 child 를 못 줄인다. */
  :where(.${PI_DIAL_CODE_CLASS}) {
    font-variant-numeric: tabular-nums;
    display: inline-block;
    min-width: 3ch;
    text-align: center;
  }

  :where(.${PI_CHEVRON_CLASS}) {
    color: ${cv.textRole.subtle};
    transition: transform ${transition.default};
    display: inline-flex;
  }

  :where(.${PI_DIAL_CLASS}[aria-expanded="true"]) .${PI_CHEVRON_CLASS} {
    transform: rotate(180deg);
  }

  :where(.${PI_MENU_CLASS}) {
    position: absolute;
    top: calc(100% + ${spacing[4]}px);
    left: 0;
    z-index: 10;
    min-width: 240px;
    max-height: 280px;
    overflow-y: auto;
    padding: ${spacing[4]}px;
    background: ${cv.surface.default};
    border: var(--stroke-thin) solid ${cv.borderRole.subtle};
    border-radius: ${radius[8]}px;
    box-shadow: ${shadow["2"]};
    list-style: none;
    margin: 0;
  }

  :where(.${PI_MENU_ITEM_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    width: 100%;
    padding: var(--semantic-inset-chip) ${spacing[10]}px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: ${radius[4]}px;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    color: ${cv.textRole.normal};
    text-align: left;
    transition: background-color ${transition.default};
  }

  :where(.${PI_MENU_ITEM_CLASS}:hover),
  :where(.${PI_MENU_ITEM_CLASS}[data-selected="true"]) {
    background: ${cv.surface.page};
  }

  :where(.${PI_MENU_CODE_CLASS}) {
    flex-shrink: 0;
    min-width: 22px;
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
    letter-spacing: 0.02em;
  }

  :where(.${PI_MENU_NAME_CLASS}) {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${PI_MENU_DIAL_CLASS}) {
    color: ${cv.textRole.subtle};
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }

  /* 번호 입력 — 독립 박스 (base Input 토큰) */
  :where(.${PI_INPUT_CLASS}) {
    flex: 1;
    min-width: 0;
    height: var(--nds-input-height, ${sizing.input.default}px);
    padding: 0 var(--nds-input-padding-x, var(--semantic-inset-card));
    border: var(--stroke-thin) solid var(--nds-input-border-color, ${cv.input.borderDefault});
    border-radius: var(--nds-input-radius, ${radius[8]}px);
    background: var(--nds-input-background, ${cv.input.bg});
    outline: none;
    /* Input Value — Input Typography 표준 value(15/22 · Regular). */
    font: ${cv.inputTypography.value.font};
    color: ${cv.textRole.strong};
    box-sizing: border-box;
    transition: border-color ${transition.default};
  }

  :where(.${PI_INPUT_CLASS}:focus) { border-color: ${cv.input.borderFocus}; }

  :where(.${PI_INPUT_CLASS}::placeholder) { color: ${cv.input.placeholder}; }

  :where(.${PI_INPUT_CLASS}:disabled) {
    background: ${cv.input.bgDisabled};
    color: ${cv.textRole.muted};
    cursor: default;
  }

  /* 에러 — 두 박스 모두 에러 보더 */
  :where(.${PI_FIELD_CLASS}[data-error="true"] .${PI_DIAL_CLASS}),
  :where(.${PI_FIELD_CLASS}[data-error="true"] .${PI_INPUT_CLASS}) {
    border-color: ${cv.input.borderError};
  }

  /* helper 폰트·색·margin·에러색·캐포비 에러아이콘 ::before 는 공용 .nds-helper-text(HelperText.ts) 소유 */
`;
