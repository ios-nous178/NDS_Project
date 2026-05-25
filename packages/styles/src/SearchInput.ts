/* Auto-generated from packages/react/src/SearchInput.tsx during the @nudge-eap/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  sizing,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

const SEARCH_CLASS = "nds-search-input";
const SEARCH_ROOT_CLASS = `${SEARCH_CLASS}__root`;
const SEARCH_LABEL_CLASS = `${SEARCH_CLASS}__label`;
const SEARCH_WRAPPER_CLASS = `${SEARCH_CLASS}__wrapper`;
const SEARCH_FIELD_CLASS = `${SEARCH_CLASS}__field`;
const SEARCH_CLEAR_CLASS = `${SEARCH_CLASS}__clear`;
const SEARCH_BUTTON_CLASS = `${SEARCH_CLASS}__button`;
const SEARCH_HELPER_CLASS = `${SEARCH_CLASS}__helper`;

export const searchInputStyles = `
  :where(.${SEARCH_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--nds-search-input-label-gap, var(--gap-comfortable));
    width: var(--nds-search-input-width, 100%);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SEARCH_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${SEARCH_WRAPPER_CLASS}) {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: var(--nds-search-input-height, 48px);
    padding: 0 var(--inset-card);
    border: 1px solid var(--nds-search-input-border-color, ${cv.borderRole.normal});
    border-radius: var(--nds-search-input-radius, ${radius.md}px);
    background: var(--nds-search-input-background, ${cv.surface.default});
    box-sizing: border-box;
    transition:
      border-color ${transition.default},
      background-color ${transition.default};
  }

  :where(.${SEARCH_WRAPPER_CLASS}[data-focused="true"]) {
    border-color: ${cv.borderRole.focus};
  }

  :where(.${SEARCH_WRAPPER_CLASS}[data-variant="filled"]) {
    border-color: transparent;
    background: var(--nds-search-input-background, ${cv.surface.section});
  }

  :where(.${SEARCH_WRAPPER_CLASS}[data-variant="filled"][data-focused="true"]) {
    border-color: ${cv.borderRole.focus};
  }

  :where(.${SEARCH_FIELD_CLASS}) {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    padding: 0;
  }

  :where(.${SEARCH_FIELD_CLASS}::placeholder) {
    color: ${cv.textRole.muted};
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

  :where(.${SEARCH_HELPER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.muted};
  }

  :where(.${SEARCH_HELPER_CLASS}[data-error="true"]) {
    color: ${cv.textRole.statusError};
  }
`;
