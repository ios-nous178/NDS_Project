/* Auto-generated from packages/react/src/CountdownTimer.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, typeScale } from "@nudge-design/tokens";

const CT_CLASS = "nds-countdown-timer";
const CT_TIME_CLASS = `${CT_CLASS}__time`;
const CT_LABEL_CLASS = `${CT_CLASS}__label`;

export const ctStyles = `
  :where(.${CT_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-default);
    font-family: ${fontFamily.web};
    color: ${cv.textRole.normal};
  }

  /* tone="brand" — 진행 중 타이머를 브랜드 액센트로(캐포비 text.brand=#FD9B02 오렌지).
     urgent/expired 가 source 순서상 뒤라 그 상태에선 빨강/회색이 우선한다. */
  :where(.${CT_CLASS}[data-tone="brand"]) {
    color: ${cv.textRole.brand};
  }

  :where(.${CT_CLASS}[data-urgent="true"]) {
    color: var(--semantic-text-status-error);
  }

  :where(.${CT_CLASS}[data-expired="true"]) {
    color: ${cv.textRole.subtle};
  }

  :where(.${CT_TIME_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    font-variant-numeric: tabular-nums;
  }

  :where(.${CT_LABEL_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.subtle};
  }
`;
