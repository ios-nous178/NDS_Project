/* Auto-generated from packages/react/src/SelectionCard.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-design/tokens";

const SC_CLASS = "nds-selection-card";
const SC_ROOT_CLASS = `${SC_CLASS}__root`;
const SC_ITEM_CLASS = `${SC_CLASS}__item`;
const SC_INDICATOR_CLASS = `${SC_CLASS}__indicator`;
const SC_BODY_CLASS = `${SC_CLASS}__body`;
const SC_TITLE_CLASS = `${SC_CLASS}__title`;
const SC_DESCRIPTION_CLASS = `${SC_CLASS}__description`;
const SC_CONTENT_CLASS = `${SC_CLASS}__content`;
const SC_ICON_CLASS = `${SC_CLASS}__icon`;

export const selectionCardStyles = `
  :where(.${SC_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-default);
    width: 100%;
    font-family: ${fontFamily.web};
  }

  :where(.${SC_ROOT_CLASS}[data-layout="horizontal"]) {
    flex-direction: row;
    flex-wrap: wrap;
  }

  :where(.${SC_ITEM_CLASS}) {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: var(--semantic-gap-comfortable);
    padding: var(--semantic-inset-card);
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.normal};
    border-radius: ${radius[12]}px;
    cursor: pointer;
    transition: border-color ${transition.default}, background-color ${transition.default};
    box-sizing: border-box;
    flex: 1;
    min-width: 0;
  }

  :where(.${SC_ITEM_CLASS}:hover:not([data-disabled="true"])) {
    border-color: ${cv.borderRole.brand};
  }

  :where(.${SC_ITEM_CLASS}:has(:focus-visible)) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${SC_ITEM_CLASS}[data-checked="true"]) {
    border-color: ${cv.borderRole.brand};
    background: ${cv.surface.brandSubtle};
  }

  :where(.${SC_ITEM_CLASS}[data-disabled="true"]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :where(.${SC_ITEM_CLASS}) input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
  }

  :where(.${SC_INDICATOR_CLASS}) {
    width: 20px;
    height: 20px;
    border-radius: var(--nds-selection-card-indicator-radius, 9999px);
    border: 2px solid ${cv.borderRole.normal};
    background: ${cv.surface.default};
    flex-shrink: 0;
    margin-top: 2px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: border-color ${transition.default}, background-color ${transition.default};
  }

  :where(.${SC_ITEM_CLASS}[data-mode="multiple"]) .${SC_INDICATOR_CLASS} {
    border-radius: ${radius[4]}px;
  }

  :where(.${SC_ITEM_CLASS}[data-checked="true"]) .${SC_INDICATOR_CLASS} {
    border-color: ${cv.borderRole.brand};
    background: ${cv.surface.brand};
  }

  :where(.${SC_INDICATOR_CLASS}) svg {
    color: #fff;
    opacity: 0;
    transition: opacity ${transition.default};
  }

  :where(.${SC_ITEM_CLASS}[data-checked="true"]) .${SC_INDICATOR_CLASS} svg {
    opacity: 1;
  }

  :where(.${SC_ICON_CLASS}) {
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: ${cv.textRole.normal};
  }

  :where(.${SC_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  :where(.${SC_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.semibold};
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${SC_DESCRIPTION_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
    margin: 0;
  }

  /* 리치 중첩 콘텐츠 (Chip 행·bullet 리스트 등). title/description 아래 간격 확보 */
  :where(.${SC_CONTENT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-tight);
    margin-top: var(--semantic-gap-tight);
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }
`;
