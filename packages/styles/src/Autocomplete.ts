/* Auto-generated from packages/react/src/Autocomplete.tsx during the @nudge-design/styles split. */
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

const AC_CLASS = "nds-autocomplete";
const AC_ROOT_CLASS = `${AC_CLASS}__root`;
const AC_INPUT_CLASS = `${AC_CLASS}__input`;
const AC_LIST_CLASS = `${AC_CLASS}__list`;
const AC_OPTION_CLASS = `${AC_CLASS}__option`;
const AC_HIGHLIGHT_CLASS = `${AC_CLASS}__highlight`;
const AC_DESCRIPTION_CLASS = `${AC_CLASS}__description`;
const AC_EMPTY_CLASS = `${AC_CLASS}__empty`;
const AC_LOADING_CLASS = `${AC_CLASS}__loading`;

export const autocompleteStyles = `
  :where(.${AC_ROOT_CLASS}) {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    gap: var(--semantic-gap-default);
    font-family: ${fontFamily.web};
    width: var(--nds-autocomplete-width, auto);
    box-sizing: border-box;
  }

  :where(.${AC_ROOT_CLASS}[data-full-width="true"]) {
    width: 100%;
  }

  :where(.${AC_ROOT_CLASS}) > label {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
  }

  :where(.${AC_INPUT_CLASS}) {
    width: 100%;
    height: var(--nds-input-height, ${sizing.input.default}px);
    padding: 0 var(--nds-input-padding-x, var(--semantic-inset-card));
    border: 1px solid var(--nds-input-border-color, ${cv.borderRole.normal});
    border-radius: var(--nds-input-radius, ${radius.md}px);
    background: var(--nds-input-background, ${cv.surface.default});
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    transition: border-color ${transition.default};
    box-sizing: border-box;
  }

  :where(.${AC_INPUT_CLASS}::placeholder) {
    color: ${cv.textRole.muted};
  }

  :where(.${AC_INPUT_CLASS}:focus-visible) {
    outline: none;
    border-color: ${cv.input.borderFocus};
  }

  :where(.${AC_INPUT_CLASS}[data-error="true"]) {
    border-color: var(--semantic-border-status-error);
  }

  :where(.${AC_INPUT_CLASS}[disabled]) {
    background: ${cv.surface.section};
    color: ${cv.textRole.muted};
    cursor: not-allowed;
  }

  :where(.${AC_LIST_CLASS}) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: ${spacing[4]}px;
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    max-height: 280px;
    overflow-y: auto;
    z-index: 10;
    list-style: none;
    margin-block: 0;
    padding: ${spacing[4]}px 0;
  }

  :where(.${AC_OPTION_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
    padding: var(--semantic-inset-input) var(--semantic-inset-card);
    cursor: pointer;
    color: ${cv.textRole.normal};
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    transition: background-color ${transition.default};
  }

  :where(.${AC_OPTION_CLASS}[data-active="true"]),
  :where(.${AC_OPTION_CLASS}:hover) {
    background: ${cv.surface.section};
  }

  :where(.${AC_OPTION_CLASS}[aria-selected="true"]) {
    color: ${cv.textRole.brand};
    font-weight: ${fontWeight.semibold};
  }

  :where(.${AC_HIGHLIGHT_CLASS}) {
    color: ${cv.textRole.brand};
    font-weight: ${fontWeight.semibold};
  }

  :where(.${AC_DESCRIPTION_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
    margin-top: 2px;
  }

  :where(.${AC_EMPTY_CLASS}),
  :where(.${AC_LOADING_CLASS}) {
    padding: var(--semantic-inset-card);
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.body3.fontSize}px;
    text-align: center;
  }
`;
