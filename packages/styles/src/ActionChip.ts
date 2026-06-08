/* Auto-generated from packages/react/src/ActionChip.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, radius, spacing, typeScale } from "@nudge-design/tokens";

const AC_ROOT_CLASS = "nds-action-chip";
const AC_ICON_CLASS = `${AC_ROOT_CLASS}__icon`;
const AC_LABEL_CLASS = `${AC_ROOT_CLASS}__label`;

export const actionChipStyles = `
  :where(.${AC_ROOT_CLASS}) {
    appearance: none;
    border: 0;
    display: inline-flex;
    align-items: center;
    gap: ${spacing[2]}px;
    padding: ${spacing[2]}px ${spacing[6]}px;
    border-radius: var(--nds-action-chip-radius, ${radius.sm}px);
    background: var(--nds-action-chip-bg, ${cv.fill.neutralSubtle});
    color: ${cv.textRole.subtle};
    font-family: ${fontFamily.web};
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.12s ease;
    white-space: nowrap;
  }

  :where(.${AC_ROOT_CLASS}:hover) {
    background: ${cv.surface.section};
  }

  :where(.${AC_ROOT_CLASS}:disabled) {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* 14px 박스 — 얇은 스트로크 아이콘(예: InfoIcon strokeWidth 1.5 → 14px 에서 ~0.9px 하이라인)이
     연하게 보이지 않도록 icon 색은 normal(#666) 이 아니라 strong(#333) 으로 잡는다.
     라벨(text.subtle #666)보다 살짝 진해 14px affordance 가 또렷하게 읽힌다. */
  :where(.${AC_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    color: ${cv.iconRole.strong};
  }

  /* 슬롯 아이콘(React node / HTML <svg slot="icon">)이 intrinsic 크기와 무관하게 14px 박스를
     꽉 채우도록 — HTML 에서 find_icon SVG(24vb 기본)를 넣어도 안정적으로 렌더된다. currentColor
     기반 DS 아이콘은 위 color 를 그대로 상속한다. */
  :where(.${AC_ICON_CLASS}) > svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  :where(.${AC_LABEL_CLASS}) {
    display: inline-block;
  }
`;
