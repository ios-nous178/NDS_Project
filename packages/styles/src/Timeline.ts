/* Auto-generated from packages/react/src/Timeline.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-design/tokens";

const TL_CLASS = "nds-timeline";
const TL_ITEM_CLASS = `${TL_CLASS}__item`;
const TL_INDICATOR_CLASS = `${TL_CLASS}__indicator`;
const TL_DOT_CLASS = `${TL_CLASS}__dot`;
const TL_LINE_CLASS = `${TL_CLASS}__line`;
const TL_BODY_CLASS = `${TL_CLASS}__body`;
const TL_DATE_CLASS = `${TL_CLASS}__date`;
const TL_TITLE_CLASS = `${TL_CLASS}__title`;
const TL_DESC_CLASS = `${TL_CLASS}__description`;
const TL_BADGE_CLASS = `${TL_CLASS}__badge`;

export const timelineStyles = `
  /* ── root / layout ── */
  :where(.${TL_CLASS}) {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${TL_CLASS}[data-direction="horizontal"]) {
    flex-direction: row;
  }

  :where(.${TL_ITEM_CLASS}) {
    display: flex;
    gap: var(--semantic-gap-comfortable);
    align-items: stretch;
    min-width: 0;
  }

  /* tracker horizontal: 항목이 가로로 균등 분포, 본문 중앙 정렬 */
  :where(.${TL_CLASS}[data-direction="horizontal"]) .${TL_ITEM_CLASS} {
    flex: 1;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--semantic-gap-default);
  }

  /* ── indicator (dot + line) ── */
  :where(.${TL_INDICATOR_CLASS}) {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }

  :where(.${TL_CLASS}[data-direction="horizontal"]) .${TL_INDICATOR_CLASS} {
    flex-direction: row;
    align-items: center;
    width: 100%;
  }

  /* ── dot ── */
  :where(.${TL_DOT_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  /* activity 모드 dot — 16px 채움형 */
  :where(.${TL_ITEM_CLASS}[data-mode="activity"] .${TL_DOT_CLASS}) {
    width: 16px;
    height: 16px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.section};
    color: ${cv.textRole.inverse};
    margin-top: ${spacing[2]}px;
  }
  :where(.${TL_DOT_CLASS}[data-status="completed"]) { background: ${cv.iconRole.statusSuccess}; }
  :where(.${TL_DOT_CLASS}[data-status="ongoing"]) {
    background: ${cv.surface.brand};
    box-shadow: 0 0 0 4px ${cv.surface.brandSubtle};
  }
  :where(.${TL_DOT_CLASS}[data-status="warning"]) { background: ${cv.fill.statusCaution}; }
  :where(.${TL_DOT_CLASS}[data-status="error"]) { background: ${cv.fill.statusError}; }
  :where(.${TL_DOT_CLASS}) svg { width: 10px; height: 10px; }

  /* tracker 모드 dot — 24px 테두리형 + 번호/체크 */
  :where(.${TL_ITEM_CLASS}[data-mode="tracker"] .${TL_DOT_CLASS}) {
    width: 24px;
    height: 24px;
    border-radius: 9999px;
    background: ${cv.surface.section};
    color: ${cv.textRole.subtle};
    border: 2px solid ${cv.borderRole.normal};
    font-size: 11px;
    font-weight: ${fontWeight.bold};
    transition: background-color 200ms, color 200ms, border-color 200ms;
  }
  :where(.${TL_DOT_CLASS}[data-state="done"]) {
    background: ${cv.surface.brand};
    border-color: ${cv.borderRole.brand};
    color: ${cv.button.textDefault};
  }
  :where(.${TL_DOT_CLASS}[data-state="current"]) {
    background: ${cv.surface.default};
    border-color: ${cv.borderRole.brand};
    color: ${cv.textRole.brand};
    box-shadow: 0 0 0 4px var(--semantic-bg-status-info);
  }

  /* ── line ── */
  :where(.${TL_LINE_CLASS}) {
    background: ${cv.borderRole.subtle};
    transition: background-color 200ms;
  }
  :where(.${TL_LINE_CLASS}[data-state="done"]) { background: ${cv.surface.brand}; }
  :where(.${TL_LINE_CLASS}[data-state="hidden"]) { background: transparent; }

  /* vertical line (activity + tracker vertical) */
  :where(.${TL_CLASS}:not([data-direction="horizontal"]) .${TL_LINE_CLASS}) {
    width: 2px;
    flex: 1;
    margin-top: ${spacing[2]}px;
    min-height: ${spacing[16]}px;
  }

  /* horizontal line (tracker horizontal — 좌우 half-line) */
  :where(.${TL_CLASS}[data-direction="horizontal"]) .${TL_LINE_CLASS} {
    flex: 1;
    height: 2px;
    margin: 0;
  }

  /* ── body ── */
  :where(.${TL_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing[2]}px;
    padding-bottom: var(--semantic-inset-card-large);
  }

  :where(.${TL_ITEM_CLASS}:last-child .${TL_BODY_CLASS}) {
    padding-bottom: 0;
  }

  :where(.${TL_CLASS}[data-direction="horizontal"]) .${TL_BODY_CLASS} {
    flex: none;
    align-items: center;
    padding-bottom: 0;
    gap: 2px;
  }

  /* ── date / title / description / badge ── */
  :where(.${TL_DATE_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    color: ${cv.textRole.subtle};
    font-variant-numeric: tabular-nums;
  }

  :where(.${TL_TITLE_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
  }
  /* tracker 미완료 단계 제목은 subtle */
  :where(.${TL_ITEM_CLASS}[data-mode="tracker"] .${TL_TITLE_CLASS}) {
    font-weight: ${fontWeight.semibold};
    color: ${cv.textRole.subtle};
  }
  :where(.${TL_TITLE_CLASS}[data-state="done"]),
  :where(.${TL_TITLE_CLASS}[data-state="current"]) {
    color: ${cv.textRole.normal};
  }

  :where(.${TL_DESC_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.strong};
    margin: 0;
  }
  :where(.${TL_ITEM_CLASS}[data-mode="tracker"] .${TL_DESC_CLASS}) {
    color: ${cv.textRole.subtle};
  }

  :where(.${TL_BADGE_CLASS}) {
    display: inline-flex;
    align-items: center;
    padding: ${spacing[2]}px var(--semantic-inset-chip);
    border-radius: ${radius.pill}px;
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    font-weight: ${fontWeight.medium};
    background: ${cv.surface.page};
    color: ${cv.textRole.strong};
  }
  :where(.${TL_BADGE_CLASS}[data-status="completed"]) {
    background: ${cv.surface.statusSuccess};
    color: ${cv.iconRole.statusSuccess};
  }
  :where(.${TL_BADGE_CLASS}[data-status="ongoing"]) {
    background: ${cv.surface.brandSubtle};
    color: ${cv.textRole.brand};
  }
  :where(.${TL_BADGE_CLASS}[data-status="warning"]) {
    background: ${cv.surface.statusCaution};
    color: ${cv.textRole.statusCaution};
  }
  :where(.${TL_BADGE_CLASS}[data-status="error"]) {
    background: ${cv.surface.statusError};
    color: ${cv.textRole.statusError};
  }
`;
