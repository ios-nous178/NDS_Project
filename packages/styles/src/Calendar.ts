/* Auto-generated from packages/react/src/Calendar.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const CL_CLASS = "nds-calendar";
const CL_HEADER_CLASS = `${CL_CLASS}__header`;
const CL_TITLE_CLASS = `${CL_CLASS}__title`;
const CL_NAV_CLASS = `${CL_CLASS}__nav`;
const CL_NAV_BTN_CLASS = `${CL_CLASS}__nav-btn`;
const CL_GRID_CLASS = `${CL_CLASS}__grid`;
const CL_WEEKDAYS_CLASS = `${CL_CLASS}__weekdays`;
const CL_WEEKDAY_CLASS = `${CL_CLASS}__weekday`;
const CL_DAYS_CLASS = `${CL_CLASS}__days`;
const CL_DAY_CLASS = `${CL_CLASS}__day`;
const CL_DAY_LABEL_CLASS = `${CL_CLASS}__day-label`;
const CL_DAY_DOT_CLASS = `${CL_CLASS}__day-dot`;

export const calendarStyles = `
  :where(.${CL_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-loose);
    width: 100%;
    font-family: ${fontFamily.web};
    color: ${cv.textRole.normal};
    background: var(--nds-calendar-bg, ${cv.surface.default});
    padding: var(--nds-calendar-padding, var(--semantic-inset-card));
    border-radius: var(--nds-calendar-radius, ${radius.lg}px);
    box-sizing: border-box;
  }

  :where(.${CL_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  :where(.${CL_TITLE_CLASS}) {
    font-size: ${typeScale.headline4.fontSize}px;
    line-height: ${typeScale.headline4.lineHeight}px;
    font-weight: ${fontWeight.bold};
    margin: 0;
  }

  :where(.${CL_NAV_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-tight);
  }

  :where(.${CL_NAV_BTN_CLASS}) {
    width: 32px;
    height: 32px;
    border-radius: ${radius.md}px;
    border: none;
    background: transparent;
    color: ${cv.textRole.normal};
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color ${transition.default};
  }

  :where(.${CL_NAV_BTN_CLASS}:hover) {
    background: ${cv.surface.section};
  }

  :where(.${CL_NAV_BTN_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${CL_NAV_BTN_CLASS}[disabled]) {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :where(.${CL_GRID_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-default);
  }

  :where(.${CL_WEEKDAYS_CLASS}),
  :where(.${CL_DAYS_CLASS}) {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--semantic-gap-tight);
  }

  :where(.${CL_WEEKDAY_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
    text-align: center;
    padding: ${spacing[4]}px 0;
  }

  :where(.${CL_DAY_CLASS}) {
    position: relative;
    aspect-ratio: 1;
    min-height: 36px;
    border: none;
    background: transparent;
    border-radius: ${radius.md}px;
    color: ${cv.textRole.normal};
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.medium};
    cursor: pointer;
    transition: background-color ${transition.default}, color ${transition.default};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${CL_DAY_CLASS}:hover:not([disabled])) {
    background: ${cv.surface.section};
  }

  :where(.${CL_DAY_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${CL_DAY_CLASS}[data-outside="true"]) {
    color: ${cv.textRole.muted};
  }

  :where(.${CL_DAY_CLASS}[data-today="true"]) {
    color: ${cv.textRole.brand};
    font-weight: ${fontWeight.bold};
  }

  :where(.${CL_DAY_CLASS}[data-selected="true"]) {
    background: ${cv.surface.brand};
    color: ${cv.surface.default};
  }

  :where(.${CL_DAY_CLASS}[data-selected="true"][data-today="true"]) {
    color: ${cv.surface.default};
  }

  :where(.${CL_DAY_CLASS}[disabled]) {
    color: ${cv.textRole.muted};
    cursor: not-allowed;
  }

  :where(.${CL_DAY_LABEL_CLASS}) {
    position: relative;
    z-index: 1;
  }

  :where(.${CL_DAY_DOT_CLASS}) {
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 9999px;
    background: var(--nds-calendar-marker, ${cv.surface.brand});
  }

  :where(.${CL_DAY_CLASS}[data-selected="true"]) .${CL_DAY_DOT_CLASS} {
    background: ${cv.surface.default};
  }
`;
