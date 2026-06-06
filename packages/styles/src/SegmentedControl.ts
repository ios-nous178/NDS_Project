/* Auto-generated from packages/react/src/SegmentedControl.tsx during the @nudge-design/styles split. */
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  shadow,
  spacing,
  transition,
  typeScale,
} from "@nudge-design/tokens";

const SC_CLASS = "nds-segmented";
const SC_ROOT_CLASS = `${SC_CLASS}__root`;
const SC_ITEM_CLASS = `${SC_CLASS}__item`;
const SC_ICON_CLASS = `${SC_CLASS}__icon`;

export const segmentedStyles = `
  :where(.${SC_ROOT_CLASS}) {
    display: inline-flex;
    align-items: stretch;
    background: ${cv.surface.subtle};
    border-radius: ${radius.md}px;
    padding: ${spacing[4]}px;
    gap: var(--semantic-gap-tight);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${SC_ROOT_CLASS}[data-fullwidth="true"]) {
    display: flex;
    width: 100%;
  }

  :where(.${SC_ITEM_CLASS}) {
    flex: 1 1 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--semantic-gap-tight);
    min-width: 0;
    height: 32px;
    padding: 0 var(--semantic-inset-input);
    background: transparent;
    border: none;
    border-radius: ${radius.sm}px;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.regular};
    color: ${cv.textRole.subtle};
    white-space: nowrap;
    transition: background-color ${transition.default}, color ${transition.default}, box-shadow ${transition.default};
  }

  :where(.${SC_ROOT_CLASS}[data-size="md"] .${SC_ITEM_CLASS}) {
    height: 36px;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
  }

  /* lg: PC 세그먼트(구 Tabs.segment 흡수) — 아이콘 동반 가능 */
  :where(.${SC_ROOT_CLASS}[data-size="lg"] .${SC_ITEM_CLASS}) {
    height: 40px;
    padding: 0 var(--semantic-inset-card);
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
  }

  :where(.${SC_ICON_CLASS}) {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }

  :where(.${SC_ICON_CLASS}) svg {
    width: 18px;
    height: 18px;
  }

  :where(.${SC_ITEM_CLASS}[data-active="true"]) {
    background: ${cv.surface.default};
    color: ${cv.textRole.normal};
    font-weight: ${fontWeight.medium};
    box-shadow: ${shadow["1"]};
  }

  /* solid: active 가 진한 Inverse fill + 흰 텍스트 (캐포비 노출/클릭 토글 정합) */
  :where(.${SC_ROOT_CLASS}[data-variant="solid"] .${SC_ITEM_CLASS}[data-active="true"]) {
    background: ${cv.surface.inverse};
    color: ${cv.textRole.inverse};
    box-shadow: none;
  }

  :where(.${SC_ITEM_CLASS}:disabled) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  :where(.${SC_ITEM_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }
`;
