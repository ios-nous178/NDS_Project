/* Auto-generated from packages/react/src/EmotionHeatmap.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, typeScale } from "@nudge-design/tokens";

const HM_CLASS = "nds-emotion-heatmap";
const HM_HEADER_CLASS = `${HM_CLASS}__header`;
const HM_TITLE_CLASS = `${HM_CLASS}__title`;
const HM_LEGEND_CLASS = `${HM_CLASS}__legend`;
const HM_LEGEND_ITEM_CLASS = `${HM_CLASS}__legend-item`;
const HM_GRID_CLASS = `${HM_CLASS}__grid`;
const HM_WEEKDAYS_CLASS = `${HM_CLASS}__weekdays`;
const HM_WEEKDAY_CLASS = `${HM_CLASS}__weekday`;
const HM_CELLS_CLASS = `${HM_CLASS}__cells`;
const HM_CELL_CLASS = `${HM_CLASS}__cell`;

const DEFAULT_COLORS = ["#ECECF0", "#C9DBFF", "#92BBFF", "#5C97F2", "#2563DB"];

export const heatmapStyles = `
  :where(.${HM_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-loose);
    padding: var(--semantic-inset-card-large);
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${HM_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--semantic-gap-comfortable);
  }

  :where(.${HM_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.semibold};
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${HM_LEGEND_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-tight);
    font-size: ${typeScale.caption2.fontSize}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${HM_LEGEND_ITEM_CLASS}) {
    width: 12px;
    height: 12px;
    border-radius: 3px;
  }

  :where(.${HM_GRID_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-default);
  }

  :where(.${HM_WEEKDAYS_CLASS}),
  :where(.${HM_CELLS_CLASS}) {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--semantic-gap-tight);
  }

  :where(.${HM_WEEKDAY_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    color: ${cv.textRole.subtle};
    text-align: center;
  }

  :where(.${HM_CELL_CLASS}) {
    aspect-ratio: 1;
    width: 100%;
    border: none;
    background: var(--nds-heatmap-cell, ${DEFAULT_COLORS[0]});
    border-radius: 4px;
    cursor: pointer;
    transition: transform 120ms ease;
    padding: 0;
  }

  :where(.${HM_CELL_CLASS}[data-empty="true"]) {
    background: transparent;
    border: 1px dashed ${cv.borderRole.subtle};
    cursor: default;
  }

  :where(.${HM_CELL_CLASS}[data-outside="true"]) {
    visibility: hidden;
  }

  :where(.${HM_CELL_CLASS}:hover:not([data-empty="true"]):not([data-outside="true"])) {
    transform: scale(1.1);
  }

  :where(.${HM_CELL_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }
`;
