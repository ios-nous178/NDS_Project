/* Auto-generated from packages/react/src/TrendingKeywords.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  shadow,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const TK_ROOT_CLASS = "nds-trending-keywords";
const TK_SLIDER_CLASS = `${TK_ROOT_CLASS}__slider`;
const TK_SLIDE_ITEM_CLASS = `${TK_ROOT_CLASS}__slide-item`;
const TK_RANK_CLASS = `${TK_ROOT_CLASS}__rank`;
const TK_TREND_CLASS = `${TK_ROOT_CLASS}__trend`;
const TK_KEYWORD_CLASS = `${TK_ROOT_CLASS}__keyword`;
const TK_CHEVRON_CLASS = `${TK_ROOT_CLASS}__chevron`;
const TK_DROPDOWN_CLASS = `${TK_ROOT_CLASS}__dropdown`;
const TK_DROPDOWN_CLASS_HEADER_CLASS = `${TK_ROOT_CLASS}__dropdown-header`;
const TK_DROPDOWN_CLASS_TITLE_CLASS = `${TK_ROOT_CLASS}__dropdown-title`;
const TK_DROPDOWN_CLASS_TIME_CLASS = `${TK_ROOT_CLASS}__dropdown-time`;
const TK_DROPDOWN_CLASS_CLOSE_CLASS = `${TK_ROOT_CLASS}__dropdown-close`;
const TK_DROPDOWN_CLASS_LIST_CLASS = `${TK_ROOT_CLASS}__dropdown-list`;
const TK_DROPDOWN_CLASS_ITEM_CLASS = `${TK_ROOT_CLASS}__dropdown-item`;

export const trendingKeywordsStyles = `
  :where(.${TK_ROOT_CLASS}) {
    position: relative;
    display: inline-flex;
    font-family: ${fontFamily.web};
  }

  :where(.${TK_SLIDER_CLASS}) {
    display: grid;
    grid-template-columns: 1fr 20px;
    align-items: center;
    width: 200px;
    height: 30px;
    overflow: hidden;
    cursor: pointer;
    gap: var(--gap-tight);
  }

  :where(.${TK_SLIDE_ITEM_CLASS}) {
    display: flex;
    align-items: center;
    height: 30px;
    animation: nds-tk-slide-up ${transition.slow} ease-out;
  }

  :where(.${TK_RANK_CLASS}) {
    flex-shrink: 0;
    width: 20px;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: 22px;
    color: ${cv.textRole.normal};
    text-align: center;
    margin-right: ${spacing[4]}px;
  }

  :where(.${TK_TREND_CLASS}) {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 18px;
    margin-right: ${spacing[8]}px;
    font-size: 10px;
    font-weight: ${fontWeight.bold};
    line-height: 1;
    border-radius: 2px;
  }

  :where(.${TK_TREND_CLASS}[data-trend="new"]) {
    color: ${cv.textRole.statusError};
  }
  :where(.${TK_TREND_CLASS}[data-trend="up"]) {
    color: ${cv.textRole.statusError};
  }
  :where(.${TK_TREND_CLASS}[data-trend="down"]) {
    color: ${cv.textRole.brand};
  }
  :where(.${TK_TREND_CLASS}[data-trend="same"]) {
    color: ${cv.textRole.muted};
  }

  :where(.${TK_KEYWORD_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: 1.47;
    color: ${cv.textRole.normal};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :where(.${TK_CHEVRON_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${cv.textRole.muted};
    transition: transform ${transition.default};
  }
  :where(.${TK_CHEVRON_CLASS}[data-open="true"]) {
    transform: rotate(180deg);
  }

  /* ─── Dropdown ─── */

  :where(.${TK_DROPDOWN_CLASS}) {
    position: absolute;
    top: -8px;
    right: -40px;
    width: 280px;
    padding: var(--inset-modal);
    background: ${cv.surface.default};
    border-radius: ${radius.lg}px;
    box-shadow: ${shadow["1"]};
    z-index: 100;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-4px);
    transition:
      opacity ${transition.default},
      visibility ${transition.default},
      transform ${transition.default};
  }
  :where(.${TK_DROPDOWN_CLASS}[data-open="true"]) {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  :where(.${TK_DROPDOWN_CLASS_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${spacing[24]}px;
    cursor: pointer;
  }

  :where(.${TK_DROPDOWN_CLASS_TITLE_CLASS}) {
    font-size: ${typeScale.headline5.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: 1.44;
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${TK_DROPDOWN_CLASS_TIME_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: 1.38;
    color: ${cv.textRole.muted};
    margin-left: ${spacing[6]}px;
  }

  :where(.${TK_DROPDOWN_CLASS_CLOSE_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    color: ${cv.textRole.normal};
  }

  :where(.${TK_DROPDOWN_CLASS_LIST_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-comfortable);
  }

  :where(.${TK_DROPDOWN_CLASS_ITEM_CLASS}) {
    display: flex;
    align-items: center;
    text-decoration: none;
    cursor: pointer;
    padding: ${spacing[2]}px 0;
    border-radius: ${radius.sm}px;
    transition: background-color ${transition.default};
  }
  :where(.${TK_DROPDOWN_CLASS_ITEM_CLASS}:hover) {
    background: ${cv.surface.subtle};
  }

  @keyframes nds-tk-slide-up {
    from { opacity: 0; transform: translateY(100%); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
