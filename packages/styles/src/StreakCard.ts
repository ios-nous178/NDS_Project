/* Auto-generated from packages/react/src/StreakCard.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, typeScale } from "@nudge-design/tokens";

const SK_CLASS = "nds-streak-card";
const SK_HEADER_CLASS = `${SK_CLASS}__header`;
const SK_TITLE_CLASS = `${SK_CLASS}__title`;
const SK_VALUE_CLASS = `${SK_CLASS}__value`;
const SK_NUMBER_CLASS = `${SK_CLASS}__number`;
const SK_UNIT_CLASS = `${SK_CLASS}__unit`;
const SK_GRID_CLASS = `${SK_CLASS}__grid`;
const SK_DAY_CLASS = `${SK_CLASS}__day`;
const SK_DAY_LABEL_CLASS = `${SK_CLASS}__day-label`;
const SK_DAY_DOT_CLASS = `${SK_CLASS}__day-dot`;
const SK_FOOTER_CLASS = `${SK_CLASS}__footer`;

export const streakStyles = `
  :where(.${SK_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--gap-loose);
    padding: var(--inset-card-large);
    background: var(--nds-streak-bg, ${cv.surface.default});
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SK_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-comfortable);
  }

  :where(.${SK_HEADER_CLASS}) .${SK_CLASS}__icon {
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    background: var(--semantic-bg-status-caution);
    color: var(--semantic-text-status-caution);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  :where(.${SK_TITLE_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.semibold};
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${SK_VALUE_CLASS}) {
    display: flex;
    align-items: baseline;
    gap: var(--gap-tight);
  }

  :where(.${SK_NUMBER_CLASS}) {
    font-size: 32px;
    line-height: 1;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    font-variant-numeric: tabular-nums;
  }

  :where(.${SK_UNIT_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.textRole.subtle};
    font-weight: ${fontWeight.medium};
  }

  :where(.${SK_GRID_CLASS}) {
    display: flex;
    gap: var(--gap-tight);
    width: 100%;
  }

  :where(.${SK_DAY_CLASS}) {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-tight);
  }

  :where(.${SK_DAY_LABEL_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${SK_DAY_DOT_CLASS}) {
    width: 100%;
    aspect-ratio: 1;
    max-width: 32px;
    border-radius: ${radius.sm}px;
    background: ${cv.surface.section};
    border: 1px solid transparent;
  }

  :where(.${SK_DAY_DOT_CLASS}[data-done="true"]) {
    background: var(--semantic-fill-status-caution);
    border-color: var(--semantic-border-status-caution);
  }

  :where(.${SK_DAY_DOT_CLASS}[data-today="true"]:not([data-done="true"])) {
    border: 2px dashed var(--semantic-border-status-caution);
    background: ${cv.surface.default};
  }

  :where(.${SK_FOOTER_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
    margin: 0;
  }
`;
