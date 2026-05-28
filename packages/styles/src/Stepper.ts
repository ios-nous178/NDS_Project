/* Auto-generated from packages/react/src/Stepper.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-design/tokens";

const ST_CLASS = "nds-stepper";
const ST_ROOT_CLASS = `${ST_CLASS}__root`;
const ST_ITEM_CLASS = `${ST_CLASS}__item`;
const ST_INDICATOR_CLASS = `${ST_CLASS}__indicator`;
const ST_LABEL_CLASS = `${ST_CLASS}__label`;
const ST_CONNECTOR_CLASS = `${ST_CLASS}__connector`;
const ST_CHECK_CLASS = `${ST_CLASS}__check`;

export const stepperStyles = `
  :where(.${ST_ROOT_CLASS}) {
    display: flex;
    align-items: flex-start;
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${ST_ITEM_CLASS}) {
    position: relative;
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--semantic-gap-default);
    min-width: 0;
  }

  :where(.${ST_ITEM_CLASS}:last-child) {
    flex: 0 0 auto;
  }

  :where(.${ST_INDICATOR_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.disabled};
    color: ${cv.textRole.muted};
    font-size: ${typeScale.body3.fontSize}px;
    line-height: 1;
    font-weight: ${fontWeight.medium};
    transition: background-color ${transition.default}, color ${transition.default};
    box-sizing: border-box;
    flex-shrink: 0;
  }

  :where(.${ST_ITEM_CLASS}[data-state="current"] .${ST_INDICATOR_CLASS}) {
    background: ${cv.surface.brand};
    color: ${cv.textRole.inverse};
  }

  :where(.${ST_ITEM_CLASS}[data-state="completed"] .${ST_INDICATOR_CLASS}) {
    background: ${cv.surface.brand};
    color: ${cv.textRole.inverse};
  }

  :where(.${ST_INDICATOR_CLASS}[data-variant="dots"]) {
    width: 12px;
    height: 12px;
    background: ${cv.surface.disabled};
  }

  :where(.${ST_ITEM_CLASS}[data-state="current"] .${ST_INDICATOR_CLASS}[data-variant="dots"]),
  :where(.${ST_ITEM_CLASS}[data-state="completed"] .${ST_INDICATOR_CLASS}[data-variant="dots"]) {
    background: ${cv.surface.brand};
  }

  :where(.${ST_CHECK_CLASS}) {
    width: 14px;
    height: 14px;
  }

  :where(.${ST_LABEL_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
    text-align: center;
    user-select: none;
    word-break: keep-all;
  }

  :where(.${ST_ITEM_CLASS}[data-state="current"] .${ST_LABEL_CLASS}) {
    color: ${cv.textRole.normal};
    font-weight: ${fontWeight.medium};
  }

  :where(.${ST_ITEM_CLASS}[data-state="completed"] .${ST_LABEL_CLASS}) {
    color: ${cv.textRole.normal};
  }

  :where(.${ST_CONNECTOR_CLASS}) {
    position: absolute;
    top: 13px;
    left: calc(50% + 18px);
    right: calc(-50% + 18px);
    height: 2px;
    background: ${cv.borderRole.subtle};
    border-radius: ${radius.pill}px;
    transition: background-color ${transition.default};
  }

  :where(.${ST_CONNECTOR_CLASS}[data-variant="dots"]) {
    top: 5px;
    left: calc(50% + 10px);
    right: calc(-50% + 10px);
  }

  :where(.${ST_ITEM_CLASS}[data-state="completed"] .${ST_CONNECTOR_CLASS}) {
    background: ${cv.surface.brand};
  }
`;
