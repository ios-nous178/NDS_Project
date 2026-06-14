/* Auto-generated from packages/react/src/ValidationChip.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight } from "@nudge-design/tokens";

const VC_CLASS = "nds-validation-chip";
const VC_ICON_CLASS = `${VC_CLASS}__icon`;

export const validationChipStyles = `
  :where(.${VC_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--semantic-gap-tight, 4px);
    font-family: ${fontFamily.web};
    font-size: 12px;
    line-height: normal;
    font-weight: ${fontWeight.regular};
    white-space: nowrap;
  }

  /* state → color 슬롯. react/html 은 data-state 만 set, 색은 여기서(JS 색맵 우회 금지).
     아이콘 SVG 는 root 의 color 를 currentColor 로 상속한다. */
  :where(.${VC_CLASS}[data-state="incomplete"]) { color: ${cv.textRole.muted}; }
  :where(.${VC_CLASS}[data-state="complete"])   { color: ${cv.textRole.brand}; }
  :where(.${VC_CLASS}[data-state="error"])      { color: ${cv.textRole.statusError}; }

  :where(.${VC_ICON_CLASS}) {
    display: inline-flex;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }
`;
