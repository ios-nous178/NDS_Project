/* Auto-generated from packages/react/src/Stepper.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-design/tokens";

const ST_CLASS = "nds-stepper";
const ST_ROOT_CLASS = `${ST_CLASS}__root`;
const ST_ITEM_CLASS = `${ST_CLASS}__item`;
const ST_INDICATOR_CLASS = `${ST_CLASS}__indicator`;
const ST_LABEL_CLASS = `${ST_CLASS}__label`;
const ST_CONNECTOR_CLASS = `${ST_CLASS}__connector`;
const ST_CHECK_CLASS = `${ST_CLASS}__check`;
const ST_BAR_CLASS = `${ST_CLASS}__bar`;
const ST_STEP_CLASS = `${ST_CLASS}__step`;
const ST_TITLE_CLASS = `${ST_CLASS}__title`;

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

  /* 모든 step 은 동일 폭(flex:1 1 0) 유지 — connector 의 calc(50% ± 18px) 기하가 "모든 칸이 같은 폭"을
     전제한다. last-child 를 flex:0 0 auto 로 좁히면 마지막 원이 앞 원에 바짝 붙고(균등간격 깨짐)
     직전 connector 가 마지막 원을 지나쳐 overshoot 한다. 마지막 칸을 끝에 붙이는 정렬이 필요하면
     connector left/right 계산까지 함께 바꿔야 하므로 여기서 flex 만 좁히지 말 것. */

  :where(.${ST_INDICATOR_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: ${radius.full}px;
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
    color: ${cv.button.textDefault};
  }

  :where(.${ST_ITEM_CLASS}[data-state="completed"] .${ST_INDICATOR_CLASS}) {
    background: ${cv.surface.brand};
    color: ${cv.button.textDefault};
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
    border-radius: ${radius.full}px;
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

  /* ── variant="bar" (구 StepProgress — 가로 막대 + 2단 라벨) ── */

  :where(.${ST_ROOT_CLASS}[data-variant="bar"]) {
    gap: var(--semantic-gap-default);
  }

  :where(.${ST_ITEM_CLASS}[data-variant="bar"]) {
    flex: 1 1 0;
    align-items: stretch;
    gap: var(--semantic-gap-default);
  }

  :where(.${ST_BAR_CLASS}) {
    height: 8px;
    width: 100%;
    border-radius: 6px;
    background: ${cv.borderRole.normal};
    transition: background-color ${transition.default};
  }

  :where(.${ST_ITEM_CLASS}[data-state="current"] .${ST_BAR_CLASS}),
  :where(.${ST_ITEM_CLASS}[data-state="completed"] .${ST_BAR_CLASS}) {
    background: ${cv.surface.brand};
  }

  :where(.${ST_LABEL_CLASS}[data-variant="bar"]) {
    display: flex;
    gap: 5px;
    align-items: baseline;
    text-align: left;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
    word-break: keep-all;
  }

  :where(.${ST_ITEM_CLASS}[data-state="completed"] .${ST_LABEL_CLASS}[data-variant="bar"]) {
    color: ${cv.textRole.normal};
    font-weight: ${fontWeight.medium};
  }

  :where(.${ST_ITEM_CLASS}[data-state="current"] .${ST_LABEL_CLASS}[data-variant="bar"]) {
    color: ${cv.textRole.strong};
    font-weight: ${fontWeight.bold};
  }

  :where(.${ST_STEP_CLASS}),
  :where(.${ST_TITLE_CLASS}) {
    white-space: nowrap;
  }
`;
