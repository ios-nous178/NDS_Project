/* Auto-generated from packages/react/src/List.tsx during the @nudge-design/styles split. */
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

const LIST_CLASS = "nds-list";
const LIST_ROOT_CLASS = `${LIST_CLASS}__root`;
const LIST_HEADER_CLASS = `${LIST_CLASS}__header`;
const LIST_FOOTER_CLASS = `${LIST_CLASS}__footer`;
const LIST_ITEM_CLASS = `${LIST_CLASS}-item`;
const LIST_ITEM_LEADING_CLASS = `${LIST_ITEM_CLASS}__leading`;
const LIST_ITEM_BODY_CLASS = `${LIST_ITEM_CLASS}__body`;
const LIST_ITEM_TITLE_CLASS = `${LIST_ITEM_CLASS}__title`;
const LIST_ITEM_DESC_CLASS = `${LIST_ITEM_CLASS}__description`;
const LIST_ITEM_META_CLASS = `${LIST_ITEM_CLASS}__metadata`;
const LIST_ITEM_TRAILING_CLASS = `${LIST_ITEM_CLASS}__trailing`;

export const listStyles = `
  :where(.${LIST_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${LIST_ROOT_CLASS}[data-variant="card"]) {
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.md}px;
    overflow: hidden;
  }

  :where(.${LIST_ROOT_CLASS}[data-variant="card"] .${LIST_ITEM_CLASS} + .${LIST_ITEM_CLASS}),
  :where(.${LIST_ROOT_CLASS}[data-variant="divided"] .${LIST_ITEM_CLASS} + .${LIST_ITEM_CLASS}) {
    border-top: 1px solid ${cv.borderRole.subtle};
  }

  /* ── header/footer 슬롯 (presentation li — 리스트 아이템 아님) ── */
  :where(.${LIST_HEADER_CLASS}),
  :where(.${LIST_FOOTER_CLASS}) {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: var(--semantic-inset-input) var(--semantic-inset-card);
  }

  :where(.${LIST_HEADER_CLASS}) {
    justify-content: space-between;
    gap: var(--semantic-gap-comfortable);
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.subtle};
  }

  /* footer 는 '더 보기' full-width 버튼·Pagination 을 담는다 — 자식이 폭을 결정 */
  :where(.${LIST_FOOTER_CLASS}) {
    justify-content: center;
  }

  /* card/divided 변형: header↔첫 아이템, 마지막 아이템↔footer 사이 구분선 */
  :where(.${LIST_ROOT_CLASS}[data-variant="card"] .${LIST_HEADER_CLASS} + .${LIST_ITEM_CLASS}),
  :where(.${LIST_ROOT_CLASS}[data-variant="divided"] .${LIST_HEADER_CLASS} + .${LIST_ITEM_CLASS}),
  :where(.${LIST_ROOT_CLASS}[data-variant="card"] .${LIST_ITEM_CLASS} + .${LIST_FOOTER_CLASS}),
  :where(.${LIST_ROOT_CLASS}[data-variant="divided"] .${LIST_ITEM_CLASS} + .${LIST_FOOTER_CLASS}) {
    border-top: 1px solid ${cv.borderRole.subtle};
  }

  /* 밀도 = min-height floor (sizing.listRow). 짧은 행은 이 높이로 맞추고, leading(Avatar 48 ·
     Thumbnail 72)이 더 크면 그만큼 자란다. 모든 밀도가 py12/px16/gap12 로 통일되어 Figma 와
     일치한다 (md 56 / lg 72 = Avatar 48 + py24 / xl 96 = Thumb 72 + py24). sm 만 compact. */
  :where(.${LIST_ITEM_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
    padding: var(--semantic-inset-input) var(--semantic-inset-card);
    min-height: ${sizing.listRow.md}px;
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    box-sizing: border-box;
    transition: background-color ${transition.default};
  }

  :where(.${LIST_ITEM_CLASS}[data-size="sm"]) {
    padding: var(--semantic-inset-chip) var(--semantic-inset-input);
    gap: var(--semantic-gap-default);
    min-height: ${sizing.listRow.sm}px;
  }

  /* lg = Avatar 레이아웃 (h72) — 48 원형 + 이름 + (액션). py12 로 48 아바타 + 24 = 72. */
  :where(.${LIST_ITEM_CLASS}[data-size="lg"]) {
    min-height: ${sizing.listRow.lg}px;
  }

  /* xl = Thumbnail 레이아웃 (h96) — 72×72 radius8 썸네일 + Title/Description/Metadata.
     py12 로 72 썸네일 + 24 = 96. */
  :where(.${LIST_ITEM_CLASS}[data-size="xl"]) {
    min-height: ${sizing.listRow.xl}px;
  }

  :where(.${LIST_ITEM_CLASS}[data-interactive="true"]) {
    cursor: pointer;
    font-family: inherit;
  }

  :where(.${LIST_ITEM_CLASS}[data-interactive="true"]:hover),
  :where(.${LIST_ITEM_CLASS}[data-active="true"]) {
    background: ${cv.surface.subtle};
  }

  :where(.${LIST_ITEM_CLASS}[data-disabled="true"]) {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  :where(.${LIST_ITEM_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: -2px;
  }

  :where(.${LIST_ITEM_LEADING_CLASS}),
  :where(.${LIST_ITEM_TRAILING_CLASS}) {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }

  :where(.${LIST_ITEM_LEADING_CLASS}) {
    color: ${cv.iconRole.strong};
  }

  :where(.${LIST_ITEM_TRAILING_CLASS}) {
    color: ${cv.iconRole.normal};
    margin-left: auto;
  }

  :where(.${LIST_ITEM_BODY_CLASS}) {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  :where(.${LIST_ITEM_TITLE_CLASS}) {
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.strong};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${LIST_ITEM_DESC_CLASS}) {
    margin-top: ${spacing[4]}px;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${LIST_ITEM_META_CLASS}) {
    margin-top: ${spacing[2]}px;
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.muted};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
