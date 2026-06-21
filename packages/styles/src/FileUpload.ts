/* Auto-generated from packages/react/src/FileUpload.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const FU_CLASS = "nds-file-upload";
const FU_ROOT_CLASS = `${FU_CLASS}__root`;
const FU_DROP_CLASS = `${FU_CLASS}__drop`;
const FU_HIDDEN_INPUT_CLASS = `${FU_CLASS}__input`;
const FU_ICON_CLASS = `${FU_CLASS}__icon`;
const FU_TEXT_CLASS = `${FU_CLASS}__text`;
const FU_HINT_CLASS = `${FU_CLASS}__hint`;
const FU_LIST_CLASS = `${FU_CLASS}__list`;
const FU_ITEM_CLASS = `${FU_CLASS}__item`;
const FU_ITEM_NAME_CLASS = `${FU_CLASS}__item-name`;
const FU_ITEM_SIZE_CLASS = `${FU_CLASS}__item-size`;
const FU_REMOVE_CLASS = `${FU_CLASS}__remove`;
const FU_ERROR_CLASS = `${FU_CLASS}__error`;

export const fileUploadStyles = `
  :where(.${FU_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-comfortable);
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${FU_DROP_CLASS}) {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--semantic-gap-default);
    padding: var(--semantic-inset-modal) var(--semantic-inset-card-large);
    background: ${cv.surface.page};
    border: var(--stroke-medium) dashed ${cv.borderRole.normal};
    border-radius: ${radius[12]}px;
    cursor: pointer;
    transition: background-color ${transition.default}, border-color ${transition.default};
    text-align: center;
  }

  :where(.${FU_DROP_CLASS}:hover) {
    background: ${cv.surface.brandSubtle};
    border-color: ${cv.borderRole.focus};
  }

  :where(.${FU_DROP_CLASS}[data-dragover="true"]) {
    background: ${cv.surface.brandSubtle};
    border-color: ${cv.borderRole.brand};
  }

  :where(.${FU_DROP_CLASS}[data-disabled="true"]) {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  :where(.${FU_HIDDEN_INPUT_CLASS}) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  :where(.${FU_ICON_CLASS}) {
    color: ${cv.iconRole.normal};
  }

  :where(.${FU_TEXT_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${FU_TEXT_CLASS}) strong {
    color: ${cv.textRole.brand};
  }

  :where(.${FU_HINT_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${FU_LIST_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[6]}px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  :where(.${FU_ITEM_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    padding: var(--semantic-inset-chip) var(--semantic-inset-input);
    background: ${cv.surface.default};
    border: var(--stroke-thin) solid ${cv.borderRole.subtle};
    border-radius: ${radius[8]}px;
  }

  :where(.${FU_ITEM_NAME_CLASS}) {
    flex: 1;
    min-width: 0;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${FU_ITEM_SIZE_CLASS}) {
    flex-shrink: 0;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
    font-variant-numeric: tabular-nums;
  }

  :where(.${FU_REMOVE_CLASS}) {
    all: unset;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: ${radius.full}px;
    color: ${cv.iconRole.normal};
    cursor: pointer;
    transition: background-color ${transition.default};
  }

  :where(.${FU_REMOVE_CLASS}:hover) {
    background: ${cv.surface.page};
    color: ${cv.textRole.normal};
  }

  :where(.${FU_ERROR_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.statusError};
  }
`;
