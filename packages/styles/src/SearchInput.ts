/* Auto-generated from packages/react/src/SearchInput.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, radius, sizing, spacing, transition } from "@nudge-design/tokens";

const SEARCH_CLASS = "nds-search-input";
const SEARCH_ROOT_CLASS = `${SEARCH_CLASS}__root`;
const SEARCH_LABEL_CLASS = `${SEARCH_CLASS}__label`;
const SEARCH_WRAPPER_CLASS = `${SEARCH_CLASS}__wrapper`;
const SEARCH_FIELD_CLASS = `${SEARCH_CLASS}__field`;
const SEARCH_CLEAR_CLASS = `${SEARCH_CLASS}__clear`;
const SEARCH_BUTTON_CLASS = `${SEARCH_CLASS}__button`;

export const searchInputStyles = `
  :where(.${SEARCH_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--nds-search-input-label-gap, var(--semantic-gap-label));
    width: var(--nds-search-input-width, 100%);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SEARCH_LABEL_CLASS}) {
    /* Input Typography 표준 label(13/18 · Medium, Figma 4247:1964). */
    font: ${cv.inputTypography.label.font};
    color: ${cv.textRole.normal};
  }

  :where(.${SEARCH_WRAPPER_CLASS}) {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    /* Input 과 동일 토큰(sizing.input.default=48) — min-height 를 리터럴로 박지 않고 var(--nds-input-height)
       체인으로 상속해 프로젝트 :root override(예: 캐포비 admin 48)를 그대로 따라간다. 리터럴을 박으면 한 행의
       nds-input/nds-select 와 높이가 어긋남(회귀: 캐포비 리스트 검색). */
    min-height: var(--nds-search-input-height, var(--nds-input-height, ${sizing.input.default}px));
    padding: 0 var(--nds-input-padding-x, var(--semantic-inset-card));
    border: var(--stroke-thin) solid var(--nds-search-input-border-color, var(--nds-input-border-color, ${cv.input.borderDefault}));
    border-radius: var(--nds-search-input-radius, var(--nds-input-radius, ${radius[8]}px));
    background: var(--nds-search-input-background, var(--nds-input-background, ${cv.input.bg}));
    box-sizing: border-box;
    transition:
      border-color ${transition.default},
      background-color ${transition.default};
  }

  :where(.${SEARCH_WRAPPER_CLASS}[data-focused="true"]) {
    border-color: ${cv.input.borderFocus};
  }

  :where(.${SEARCH_WRAPPER_CLASS}[data-variant="filled"]) {
    border-color: transparent;
    background: var(--nds-search-input-background, ${cv.surface.section});
  }

  :where(.${SEARCH_WRAPPER_CLASS}[data-variant="filled"][data-focused="true"]) {
    border-color: ${cv.input.borderFocus};
  }

  :where(.${SEARCH_FIELD_CLASS}) {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    /* Input Value — Input Typography 표준 value(15/22 · Regular). */
    font: ${cv.inputTypography.value.font};
    color: ${cv.textRole.normal};
    padding: 0;
  }

  :where(.${SEARCH_FIELD_CLASS}::placeholder) {
    color: ${cv.input.placeholder};
  }

  :where(.${SEARCH_FIELD_CLASS}[type="search"]) {
    appearance: none;
    -webkit-appearance: none;
  }

  :where(.${SEARCH_FIELD_CLASS}[type="search"]::-webkit-search-decoration),
  :where(.${SEARCH_FIELD_CLASS}[type="search"]::-webkit-search-cancel-button),
  :where(.${SEARCH_FIELD_CLASS}[type="search"]::-webkit-search-results-button),
  :where(.${SEARCH_FIELD_CLASS}[type="search"]::-webkit-search-results-decoration) {
    appearance: none;
    -webkit-appearance: none;
  }

  :where(.${SEARCH_CLEAR_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    margin-left: ${spacing[8]}px;
    color: ${cv.iconRole.normal};
    line-height: 1;
  }

  :where(.${SEARCH_CLEAR_CLASS} svg) {
    width: ${sizing.icon.sm}px;
    height: ${sizing.icon.sm}px;
  }

  :where(.${SEARCH_BUTTON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    margin-left: ${spacing[8]}px;
    color: ${cv.iconRole.strong};
    line-height: 1;
  }

  :where(.${SEARCH_BUTTON_CLASS} svg) {
    width: ${sizing.icon.default}px;
    height: ${sizing.icon.default}px;
  }

  /* helper 폰트·색·margin·에러색·캐포비 에러아이콘 ::before 는 공용 .nds-helper-text(HelperText.ts) 소유 */
`;
