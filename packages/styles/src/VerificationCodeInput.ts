/* VerificationCodeInput — 웹용 단일 필드 인증번호 입력 (DS Input 토큰 상속).
   네이티브식 자리별 세그먼트가 아니라 한 줄 박스 한 칸. 타이머·재전송·확인 버튼은
   이 필드를 FormField + InputGroup 으로 합성해 얻는다 (이 컴포넌트는 코드 입력 필드만 책임).
   높이/둥근모서리/보더는 base Input 시멘틱 토큰(--nds-input-*)을 그대로 상속. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  sizing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const VC_CLASS = "nds-verification-code";
const VC_ROOT_CLASS = `${VC_CLASS}__root`;
const VC_INPUT_CLASS = `${VC_CLASS}__input`;

export const verificationCodeStyles = `
  :where(.${VC_ROOT_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    width: 100%;
    min-height: var(--nds-input-height, ${sizing.input.default}px);
    padding: 0 var(--nds-input-padding-x, var(--semantic-inset-card));
    border: 1px solid var(--nds-input-border-color, ${cv.input.borderDefault});
    border-radius: var(--nds-input-radius, ${radius.md}px);
    background: var(--nds-input-background, ${cv.input.bg});
    box-sizing: border-box;
    font-family: ${fontFamily.web};
    transition: border-color ${transition.default};
  }

  :where(.${VC_ROOT_CLASS}[data-full-width="false"]) { width: auto; }

  :where(.${VC_ROOT_CLASS}:focus-within) { border-color: ${cv.input.borderFocus}; }
  :where(.${VC_ROOT_CLASS}[data-error="true"]) { border-color: ${cv.input.borderError}; }
  :where(.${VC_ROOT_CLASS}[data-disabled="true"]) {
    background: ${cv.input.bgDisabled};
    pointer-events: none;
  }

  /* 코드 입력 — 투명 배경. 자간은 일반(normal): 단일 필드라 0.08em 처럼 넓게 트래킹하면
     숫자가 부자연스럽게 벌어져 어색하다(사용자 피드백). 한글 placeholder 와도 일관. */
  :where(.${VC_INPUT_CLASS}) {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-family: inherit;
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
    font-weight: ${fontWeight.medium};
    letter-spacing: normal;
    color: ${cv.textRole.strong};
    -moz-appearance: textfield;
  }
  :where(.${VC_INPUT_CLASS})::-webkit-outer-spin-button,
  :where(.${VC_INPUT_CLASS})::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  :where(.${VC_INPUT_CLASS}::placeholder) {
    color: ${cv.input.placeholder};
    letter-spacing: normal;
    font-weight: ${fontWeight.regular};
  }
  :where(.${VC_INPUT_CLASS}:disabled) { color: ${cv.textRole.muted}; }
`;
