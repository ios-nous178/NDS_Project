/* Auto-generated from packages/react/src/DataTable.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const DT_CLASS = "nds-data-table";
const DT_SCROLL_CLASS = `${DT_CLASS}__scroll`;
const DT_TABLE_CLASS = `${DT_CLASS}__table`;
const DT_TH_CLASS = `${DT_CLASS}__th`;
const DT_TH_INNER_CLASS = `${DT_CLASS}__th-inner`;
const DT_SORT_ICON_CLASS = `${DT_CLASS}__sort-icon`;
const DT_TR_CLASS = `${DT_CLASS}__tr`;
const DT_TD_CLASS = `${DT_CLASS}__td`;
const DT_EMPTY_CLASS = `${DT_CLASS}__empty`;
const DT_LOADING_CLASS = `${DT_CLASS}__loading`;
const DT_CARD_CLASS = `${DT_CLASS}__card`;
const DT_CARD_ROW_CLASS = `${DT_CLASS}__card-row`;
const DT_CARD_LABEL_CLASS = `${DT_CLASS}__card-label`;
const DT_CARD_VALUE_CLASS = `${DT_CLASS}__card-value`;

export const dataTableStyles = `
  :where(.${DT_CLASS}) {
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${DT_SCROLL_CLASS}) {
    width: 100%;
    overflow-x: auto;
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
  }

  :where(.${DT_TABLE_CLASS}) {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
  }

  :where(.${DT_TH_CLASS}) {
    text-align: left;
    padding: ${spacing[10]}px var(--semantic-inset-input);
    background: ${cv.surface.page};
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.bold};
    border-bottom: 1px solid ${cv.borderRole.subtle};
    white-space: nowrap;
    user-select: none;
  }

  :where(.${DT_TH_CLASS}[data-align="center"]) { text-align: center; }
  :where(.${DT_TH_CLASS}[data-align="right"])  { text-align: right; }

  :where(.${DT_TH_CLASS}[data-sortable="true"]) {
    cursor: pointer;
  }
  :where(.${DT_TH_CLASS}[data-sortable="true"]:hover) {
    color: ${cv.textRole.normal};
  }

  :where(.${DT_TH_INNER_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-tight);
  }

  :where(.${DT_SORT_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    color: ${cv.textRole.muted};
    transition: color ${transition.default}, transform ${transition.default};
  }
  :where(.${DT_SORT_ICON_CLASS}[data-active="true"]) {
    color: ${cv.textRole.brand};
  }
  :where(.${DT_SORT_ICON_CLASS}[data-direction="desc"]) {
    transform: rotate(180deg);
  }

  :where(.${DT_TR_CLASS}) {
    transition: background-color ${transition.default};
  }
  :where(.${DT_TR_CLASS}[data-clickable="true"]) {
    cursor: pointer;
  }
  :where(.${DT_TR_CLASS}[data-clickable="true"]:hover) {
    background: ${cv.surface.page};
  }
  :where(.${DT_TR_CLASS}:not(:last-child)) > .${DT_TD_CLASS} {
    border-bottom: 1px solid ${cv.borderRole.subtle};
  }

  :where(.${DT_TD_CLASS}) {
    padding: var(--semantic-inset-input);
    color: ${cv.textRole.normal};
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    vertical-align: middle;
  }
  :where(.${DT_TD_CLASS}[data-align="center"]) { text-align: center; }
  :where(.${DT_TD_CLASS}[data-align="right"])  { text-align: right; }

  :where(.${DT_CLASS}[data-size="sm"]) .${DT_TH_CLASS},
  :where(.${DT_CLASS}[data-size="sm"]) .${DT_TD_CLASS} {
    padding: var(--semantic-inset-chip) ${spacing[10]}px;
  }

  :where(.${DT_EMPTY_CLASS}),
  :where(.${DT_LOADING_CLASS}) {
    text-align: center;
    padding: ${spacing[36]}px var(--semantic-inset-card-large);
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
  }

  /* ─── responsive: cards (mobile) ─── */
  :where(.${DT_CLASS}[data-responsive="cards"]) .${DT_SCROLL_CLASS} {
    display: block;
  }
  @media (max-width: 640px) {
    :where(.${DT_CLASS}[data-responsive="cards"]) .${DT_SCROLL_CLASS} {
      display: none;
    }
    :where(.${DT_CLASS}[data-responsive="cards"]) .${DT_CARD_CLASS} {
      display: block;
    }
  }

  :where(.${DT_CARD_CLASS}) {
    display: none;
    flex-direction: column;
    gap: var(--semantic-gap-default);
  }
  :where(.${DT_CARD_CLASS}) > article {
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    padding: var(--semantic-inset-input) var(--semantic-inset-card);
    display: flex;
    flex-direction: column;
    gap: ${spacing[6]}px;
    transition: background-color ${transition.default};
  }
  :where(.${DT_CARD_CLASS}) > article[data-clickable="true"] {
    cursor: pointer;
  }
  :where(.${DT_CARD_CLASS}) > article[data-clickable="true"]:hover {
    background: ${cv.surface.page};
  }

  :where(.${DT_CARD_ROW_CLASS}) {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--semantic-gap-comfortable);
  }
  :where(.${DT_CARD_LABEL_CLASS}) {
    flex-shrink: 0;
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
  }
  :where(.${DT_CARD_VALUE_CLASS}) {
    flex: 1;
    text-align: right;
    color: ${cv.textRole.normal};
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    word-break: break-word;
  }
`;
