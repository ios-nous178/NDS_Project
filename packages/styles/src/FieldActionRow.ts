/* Auto-generated from packages/react/src/FieldActionRow.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const FAR_CLASS = "nds-field-action-row";
const FAR_ROOT_CLASS = `${FAR_CLASS}__root`;
const FAR_LABEL_CLASS = `${FAR_CLASS}__label`;
const FAR_FIELD_CLASS = `${FAR_CLASS}__field`;
const FAR_ACTION_CLASS = `${FAR_CLASS}__action`;
const FAR_HELPER_CLASS = `${FAR_CLASS}__helper`;
const FAR_TIMER_CLASS = `${FAR_CLASS}__timer`;

export const fieldActionRowStyles = `
  :where(.${FAR_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--nds-far-gap, var(--semantic-gap-default));
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  /* 라벨(옵션) — 입력+버튼 한 줄 위에 블록으로. 라벨↔행 간격은 root 의 flex gap 이 잡는다. */
  :where(.${FAR_LABEL_CLASS}) {
    display: block;
    font-family: ${fontFamily.web};
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
  }

  :where(.${FAR_ROOT_CLASS} > [data-slot="row"]) {
    display: flex;
    gap: var(--semantic-gap-default);
    align-items: flex-start;
  }

  :where(.${FAR_FIELD_CLASS}) {
    flex: 1;
    min-width: 0;
    position: relative;
  }

  :where(.${FAR_FIELD_CLASS} > input) {
    width: 100%;
    height: 48px;
    padding: 0 var(--semantic-inset-card);
    border: 1px solid var(--nds-far-border-color, ${cv.borderRole.normal});
    border-radius: ${radius.md}px;
    background: ${cv.surface.default};
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    outline: none;
    box-sizing: border-box;
    transition: border-color ${transition.default};
    -moz-appearance: textfield;
  }

  :where(.${FAR_FIELD_CLASS} > input::-webkit-outer-spin-button),
  :where(.${FAR_FIELD_CLASS} > input::-webkit-inner-spin-button) {
    -webkit-appearance: none;
    margin: 0;
  }

  :where(.${FAR_FIELD_CLASS} > input::placeholder) {
    color: ${cv.textRole.muted};
    font-size: ${typeScale.body2.fontSize}px;
  }

  :where(.${FAR_FIELD_CLASS} > input:focus) {
    border-color: ${cv.borderRole.focus};
  }

  :where(.${FAR_FIELD_CLASS}[data-error="true"] > input) {
    border-color: ${cv.borderRole.statusError};
  }

  :where(.${FAR_FIELD_CLASS}[data-success="true"] > input) {
    border-color: ${cv.iconRole.statusSuccess};
  }

  /* 타이머가 있으면 필드 콘텐츠(raw <input> 또는 VerificationCodeInput 박스 등)가 우측의
     absolute 타이머와 겹치지 않게 우측 공간을 예약한다. 타이머(data-slot="timer")는 제외.
     입력값/placeholder 가 "02:09" 밑으로 파고들던 회귀를 막는다.
     (:not 으로 specificity (0,3,0) 을 만들어 VC 박스의 :where padding 을 안정적으로 이긴다.) */
  .${FAR_FIELD_CLASS}[data-has-timer="true"] > :not([data-slot="timer"]) {
    padding-right: var(--nds-far-timer-reserve, 64px);
  }

  :where(.${FAR_TIMER_CLASS}) {
    position: absolute;
    right: ${spacing[16]}px;
    top: 50%;
    transform: translateY(-50%);
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.brand};
  }

  :where(.${FAR_TIMER_CLASS}[data-expired="true"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${FAR_ACTION_CLASS}) {
    flex-shrink: 0;
  }

  /* ─── action 버튼 스타일은 raw <button>(:not(.nds-button)) 에만 강제한다(레거시).
     DS Button(<Button>/<nds-button> → 내부 .nds-button)을 슬롯에 넣으면 그 버튼의
     color/variant(secondary=검정 등)가 그대로 살아야 하므로 FAR 가 색을 덮지 않는다.
     (회고: 조합한 자식을 밖에서 재스타일하면 브랜드색이 강제됨 — 캐포비 노랑 확인 버튼 이슈.) ─── */
  :where(.${FAR_ACTION_CLASS} button:not(.nds-button)) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    min-width: var(--nds-far-action-min-width, 70px);
    padding: 0 var(--semantic-inset-card);
    border-radius: ${radius.md}px;
    font-family: inherit;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.bold};
    white-space: nowrap;
    cursor: pointer;
    box-sizing: border-box;
    transition:
      background-color ${transition.default},
      border-color ${transition.default},
      color ${transition.default};
  }

  :where(.${FAR_ACTION_CLASS}[data-tone="outline"] button:not(.nds-button)) {
    border: 1px solid ${cv.borderRole.brand};
    background: ${cv.surface.default};
    color: ${cv.textRole.brand};
  }

  :where(.${FAR_ACTION_CLASS}[data-tone="outline"] button:not(.nds-button):hover:not(:disabled)) {
    border-color: ${cv.fill.brandHover};
    color: ${cv.fill.brandHover};
  }

  :where(.${FAR_ACTION_CLASS}[data-tone="solid"] button:not(.nds-button)) {
    border: 1px solid ${cv.borderRole.brand};
    background: ${cv.surface.brand};
    color: ${cv.button.textDefault};
  }

  :where(.${FAR_ACTION_CLASS}[data-tone="solid"] button:not(.nds-button):hover:not(:disabled)) {
    background: ${cv.fill.brandHover};
    border-color: ${cv.fill.brandHover};
  }

  :where(.${FAR_ACTION_CLASS} button:not(.nds-button):disabled) {
    border-color: ${cv.borderRole.disabled};
    background: ${cv.surface.disabled};
    color: ${cv.textRole.muted};
    cursor: not-allowed;
  }

  :where(.${FAR_ACTION_CLASS}[data-tone="solid"] button:not(.nds-button):disabled) {
    border-color: transparent;
    background: ${cv.surface.disabled};
    color: ${cv.textRole.muted};
  }

  :where(.${FAR_HELPER_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: 1.5;
    color: ${cv.textRole.muted};
    transition: color ${transition.default};
  }

  :where(.${FAR_HELPER_CLASS}[data-error="true"]) {
    color: ${cv.textRole.statusError};
  }

  :where(.${FAR_HELPER_CLASS}[data-success="true"]) {
    color: ${cv.textRole.statusError};
  }
`;
