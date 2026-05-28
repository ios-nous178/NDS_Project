/* Auto-generated from packages/react/src/AppointmentCard.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const AC_CLASS = "nds-appointment-card";
const AC_DATE_CLASS = `${AC_CLASS}__date`;
const AC_DATE_DAY_CLASS = `${AC_CLASS}__date-day`;
const AC_DATE_MONTH_CLASS = `${AC_CLASS}__date-month`;
const AC_DATE_WEEKDAY_CLASS = `${AC_CLASS}__date-weekday`;
const AC_BODY_CLASS = `${AC_CLASS}__body`;
const AC_TITLE_CLASS = `${AC_CLASS}__title`;
const AC_META_CLASS = `${AC_CLASS}__meta`;
const AC_META_ROW_CLASS = `${AC_CLASS}__meta-row`;
const AC_FOOTER_CLASS = `${AC_CLASS}__footer`;
const AC_STATUS_CLASS = `${AC_CLASS}__status`;
const AC_ACTIONS_CLASS = `${AC_CLASS}__actions`;
const AC_ACTION_CLASS = `${AC_CLASS}__action`;

export const apptStyles = `
  :where(.${AC_CLASS}) {
    display: flex;
    align-items: stretch;
    gap: var(--gap-loose);
    padding: var(--inset-card);
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    transition: border-color ${transition.default}, box-shadow ${transition.default};
    box-sizing: border-box;
  }

  :where(.${AC_CLASS}[data-clickable="true"]) { cursor: pointer; }
  :where(.${AC_CLASS}[data-clickable="true"]:hover) {
    border-color: ${cv.borderRole.brand};
  }

  :where(.${AC_CLASS}[data-status="canceled"]) {
    opacity: 0.7;
  }

  :where(.${AC_DATE_CLASS}) {
    flex-shrink: 0;
    width: 56px;
    background: ${cv.surface.section};
    border-radius: ${radius.md}px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--inset-chip);
    gap: 2px;
  }

  :where(.${AC_DATE_DAY_CLASS}) {
    font-size: 22px;
    line-height: 1;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
  }

  :where(.${AC_DATE_MONTH_CLASS}) {
    font-size: 11px;
    line-height: 1;
    color: ${cv.textRole.subtle};
    text-transform: uppercase;
  }

  :where(.${AC_DATE_WEEKDAY_CLASS}) {
    font-size: 11px;
    line-height: 1;
    color: ${cv.textRole.subtle};
    margin-top: 2px;
  }

  :where(.${AC_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-tight);
  }

  :where(.${AC_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${AC_META_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: ${spacing[4]}px;
  }

  :where(.${AC_META_ROW_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
    display: inline-flex;
    align-items: center;
    gap: var(--gap-tight);
  }

  :where(.${AC_FOOTER_CLASS}) {
    margin-top: ${spacing[8]}px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-default);
  }

  :where(.${AC_STATUS_CLASS}) {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
    background: var(--nds-appt-status-bg, var(--semantic-bg-section-default));
    color: var(--nds-appt-status-fg, #666);
  }

  :where(.${AC_ACTIONS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-default);
  }

  :where(.${AC_ACTION_CLASS}) {
    height: 32px;
    padding: 0 var(--inset-input);
    border-radius: ${radius.md}px;
    border: 1px solid ${cv.borderRole.normal};
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
  }

  :where(.${AC_ACTION_CLASS}[data-primary="true"]) {
    background: ${cv.surface.brand};
    color: #fff;
    border-color: transparent;
  }
`;
