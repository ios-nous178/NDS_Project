/* Auto-generated from packages/react/src/EmptyState.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, spacing, typeScale } from "@nudge-eap/tokens";

const EMPTY_CLASS = "nds-empty-state";
const EMPTY_ROOT_CLASS = `${EMPTY_CLASS}__root`;
const EMPTY_ICON_CLASS = `${EMPTY_CLASS}__icon`;
const EMPTY_TITLE_CLASS = `${EMPTY_CLASS}__title`;
const EMPTY_DESC_CLASS = `${EMPTY_CLASS}__description`;
const EMPTY_ACTION_CLASS = `${EMPTY_CLASS}__action`;

export const emptyStateStyles = `
  :where(.${EMPTY_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: var(--nds-empty-state-min-height, 200px);
    padding: ${spacing[48]}px var(--inset-card-large);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${EMPTY_ICON_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${spacing[16]}px;
    color: ${cv.iconRole.normal};
  }

  :where(.${EMPTY_ICON_CLASS} svg) {
    width: 64px;
    height: 64px;
  }

  :where(.${EMPTY_ICON_CLASS} img) {
    width: 64px;
    height: 64px;
    object-fit: contain;
  }

  :where(.${EMPTY_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.body1.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: ${typeScale.body1.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${EMPTY_DESC_CLASS}) {
    margin: ${spacing[8]}px 0 0;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: 1.5;
    color: ${cv.textRole.subtle};
    white-space: pre-line;
    word-break: keep-all;
  }

  :where(.${EMPTY_ACTION_CLASS}) {
    margin-top: ${spacing[20]}px;
  }
`;
