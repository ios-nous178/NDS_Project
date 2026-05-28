/* Auto-generated from packages/react/src/StatCard.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, typeScale } from "@nudge-design/tokens";

const ST_CLASS = "nds-stat-card";
const ST_HEADER_CLASS = `${ST_CLASS}__header`;
const ST_LABEL_CLASS = `${ST_CLASS}__label`;
const ST_ICON_CLASS = `${ST_CLASS}__icon`;
const ST_VALUE_ROW_CLASS = `${ST_CLASS}__value-row`;
const ST_VALUE_CLASS = `${ST_CLASS}__value`;
const ST_UNIT_CLASS = `${ST_CLASS}__unit`;
const ST_DELTA_CLASS = `${ST_CLASS}__delta`;
const ST_FOOTER_CLASS = `${ST_CLASS}__footer`;
const ST_DESC_CLASS = `${ST_CLASS}__desc`;

export const stStyles = `
  :where(.${ST_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-comfortable);
    padding: var(--semantic-inset-card) var(--semantic-inset-card-large);
    background: var(--nds-stat-card-bg, ${cv.surface.default});
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    transition: border-color 200ms ease;
  }

  :where(.${ST_CLASS}[data-clickable="true"]) { cursor: pointer; }
  :where(.${ST_CLASS}[data-clickable="true"]:hover) { border-color: ${cv.borderRole.brand}; }

  :where(.${ST_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    color: ${cv.textRole.subtle};
  }

  :where(.${ST_ICON_CLASS}) {
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  :where(.${ST_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
  }

  :where(.${ST_VALUE_ROW_CLASS}) {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--semantic-gap-loose);
  }

  :where(.${ST_VALUE_CLASS}) {
    display: inline-flex;
    align-items: baseline;
    gap: var(--semantic-gap-tight);
  }

  :where(.${ST_VALUE_CLASS}) > strong {
    font-size: 28px;
    line-height: 1;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    font-variant-numeric: tabular-nums;
  }

  :where(.${ST_UNIT_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.textRole.subtle};
    font-weight: ${fontWeight.medium};
  }

  :where(.${ST_DELTA_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 2px var(--semantic-inset-chip);
    border-radius: 9999px;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
    background: var(--nds-stat-delta-bg, transparent);
    color: var(--nds-stat-delta-fg, ${cv.textRole.subtle});
  }

  :where(.${ST_DELTA_CLASS}[data-trend="up"]) {
    background: var(--semantic-bg-status-success);
    color: var(--semantic-text-status-success);
  }

  :where(.${ST_DELTA_CLASS}[data-trend="down"]) {
    background: var(--semantic-bg-status-error);
    color: var(--semantic-text-status-error);
  }

  :where(.${ST_FOOTER_CLASS}) {
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.caption1.fontSize}px;
  }

  :where(.${ST_DESC_CLASS}) {
    margin: 0;
  }
`;
