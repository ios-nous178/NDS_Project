/* Auto-generated from packages/react/src/PopularPosts.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const PP_ROOT_CLASS = "nds-popular-posts";
const PP_HEADER_CLASS = `${PP_ROOT_CLASS}__header`;
const PP_TITLE_CLASS = `${PP_ROOT_CLASS}__title`;
const PP_MORE_CLASS = `${PP_ROOT_CLASS}__more`;
const PP_MORE_ICON_CLASS = `${PP_ROOT_CLASS}__more-icon`;
const PP_TABS_CLASS = `${PP_ROOT_CLASS}__tabs`;
const PP_TAB_CLASS = `${PP_ROOT_CLASS}__tab`;
const PP_LIST_CLASS = `${PP_ROOT_CLASS}__list`;
const PP_ROW_CLASS = `${PP_ROOT_CLASS}__row`;
const PP_RANK_CLASS = `${PP_ROOT_CLASS}__rank`;
const PP_ROW_TITLE_CLASS = `${PP_ROOT_CLASS}__row-title`;
const PP_COUNT_CLASS = `${PP_ROOT_CLASS}__count`;

export const popularPostsStyles = `
  :where(.${PP_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-loose);
    width: 100%;
    box-sizing: border-box;
    padding: ${spacing[20]}px;
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    font-family: ${fontFamily.web};
  }

  /* ─── Header ─── */

  :where(.${PP_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${spacing[8]}px;
    min-height: 26px;
  }

  :where(.${PP_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.headline5.fontSize}px;
    line-height: ${typeScale.headline5.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.strong};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${PP_MORE_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[2]}px;
    padding: ${spacing[2]}px ${spacing[4]}px;
    border: none;
    background: transparent;
    color: ${cv.textRole.subtle};
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    cursor: pointer;
    transition: color ${transition.default};
    flex-shrink: 0;
  }

  :where(.${PP_MORE_CLASS}:hover) {
    color: ${cv.textRole.strong};
  }

  :where(.${PP_MORE_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: currentColor;
  }

  /* ─── Tab ─── */

  :where(.${PP_TABS_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[8]}px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  :where(.${PP_TABS_CLASS})::-webkit-scrollbar {
    display: none;
  }

  :where(.${PP_TAB_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    padding: ${spacing[6]}px ${spacing[12]}px;
    border: none;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.section};
    color: ${cv.textRole.subtle};
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    white-space: nowrap;
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color ${transition.default}, color ${transition.default};
  }

  @media (hover: hover) {
    :where(.${PP_TAB_CLASS}:not([data-active="true"]):hover) {
      background: ${cv.surface.subtle};
      color: ${cv.textRole.strong};
    }
  }

  :where(.${PP_TAB_CLASS}[data-active="true"]) {
    background: ${cv.surface.brandSubtle};
    color: ${cv.textRole.brand};
    font-weight: ${fontWeight.bold};
  }

  /* ─── List ─── */

  :where(.${PP_LIST_CLASS}) {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  :where(.${PP_ROW_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[4]}px;
    width: 100%;
    min-height: 32px;
    padding: ${spacing[6]}px 0;
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: inherit;
    text-align: left;
  }

  :where(button.${PP_ROW_CLASS}) {
    cursor: pointer;
    transition: opacity ${transition.default};
  }

  @media (hover: hover) {
    :where(button.${PP_ROW_CLASS}:hover) {
      opacity: 0.7;
    }
  }

  :where(.${PP_RANK_CLASS}) {
    flex-shrink: 0;
    width: 21px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.strong};
    font-variant-numeric: tabular-nums;
  }

  :where(.${PP_ROW_TITLE_CLASS}) {
    flex: 1 1 0;
    min-width: 0;
    color: ${cv.textRole.strong};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${PP_COUNT_CLASS}) {
    flex-shrink: 0;
    color: ${cv.textRole.statusError};
    font-weight: ${fontWeight.medium};
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
`;
