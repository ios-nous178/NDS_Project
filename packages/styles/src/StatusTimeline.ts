/* Auto-generated from packages/react/src/StatusTimeline.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, typeScale } from "@nudge-design/tokens";

const ST_CLASS = "nds-status-timeline";
const ST_ITEM_CLASS = `${ST_CLASS}__item`;
const ST_INDICATOR_CLASS = `${ST_CLASS}__indicator`;
const ST_DOT_CLASS = `${ST_CLASS}__dot`;
const ST_LINE_CLASS = `${ST_CLASS}__line`;
const ST_BODY_CLASS = `${ST_CLASS}__body`;
const ST_LABEL_CLASS = `${ST_CLASS}__label`;
const ST_DESC_CLASS = `${ST_CLASS}__desc`;
const ST_TIME_CLASS = `${ST_CLASS}__time`;

export const stStyles = `
  :where(.${ST_CLASS}) {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    font-family: ${fontFamily.web};
  }

  :where(.${ST_CLASS}[data-direction="horizontal"]) {
    flex-direction: row;
  }

  :where(.${ST_CLASS}[data-direction="vertical"]) {
    flex-direction: column;
    gap: 0;
  }

  :where(.${ST_ITEM_CLASS}) {
    display: flex;
    flex: 1;
    min-width: 0;
  }

  :where(.${ST_CLASS}[data-direction="horizontal"]) .${ST_ITEM_CLASS} {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--semantic-gap-default);
  }

  :where(.${ST_CLASS}[data-direction="vertical"]) .${ST_ITEM_CLASS} {
    flex-direction: row;
    gap: var(--semantic-gap-comfortable);
    flex: none;
    align-items: stretch;
  }

  :where(.${ST_INDICATOR_CLASS}) {
    position: relative;
    display: flex;
  }

  :where(.${ST_CLASS}[data-direction="horizontal"]) .${ST_INDICATOR_CLASS} {
    align-items: center;
    width: 100%;
    flex-direction: row;
  }

  :where(.${ST_CLASS}[data-direction="vertical"]) .${ST_INDICATOR_CLASS} {
    flex-direction: column;
    align-items: center;
  }

  :where(.${ST_DOT_CLASS}) {
    width: 24px;
    height: 24px;
    border-radius: 9999px;
    background: ${cv.surface.section};
    color: ${cv.textRole.subtle};
    border: 2px solid ${cv.borderRole.normal};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 11px;
    font-weight: ${fontWeight.bold};
    box-sizing: border-box;
    transition: background-color 200ms, color 200ms, border-color 200ms;
  }

  :where(.${ST_DOT_CLASS}[data-state="done"]) {
    background: ${cv.surface.brand};
    border-color: ${cv.borderRole.brand};
    color: #fff;
  }

  :where(.${ST_DOT_CLASS}[data-state="current"]) {
    background: ${cv.surface.default};
    border-color: ${cv.borderRole.brand};
    color: ${cv.textRole.brand};
    box-shadow: 0 0 0 4px var(--semantic-bg-status-info));
  }

  :where(.${ST_LINE_CLASS}) {
    background: ${cv.borderRole.normal};
    transition: background-color 200ms;
  }

  :where(.${ST_LINE_CLASS}[data-state="done"]) {
    background: ${cv.surface.brand};
  }

  :where(.${ST_LINE_CLASS}[data-state="hidden"]) {
    background: transparent;
  }

  :where(.${ST_CLASS}[data-direction="horizontal"]) .${ST_LINE_CLASS} {
    flex: 1;
    height: 2px;
  }

  :where(.${ST_CLASS}[data-direction="vertical"]) .${ST_LINE_CLASS} {
    width: 2px;
    flex: 1;
    margin: 4px 0;
    min-height: 24px;
  }

  :where(.${ST_BODY_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  :where(.${ST_CLASS}[data-direction="vertical"]) .${ST_BODY_CLASS} {
    padding-bottom: var(--semantic-inset-card);
  }

  :where(.${ST_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
    color: ${cv.textRole.subtle};
  }
  :where(.${ST_LABEL_CLASS}[data-state="done"]),
  :where(.${ST_LABEL_CLASS}[data-state="current"]) {
    color: ${cv.textRole.normal};
  }

  :where(.${ST_DESC_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${ST_TIME_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    color: ${cv.textRole.subtle};
    font-variant-numeric: tabular-nums;
  }
`;
