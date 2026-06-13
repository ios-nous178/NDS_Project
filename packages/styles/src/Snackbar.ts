/* Auto-generated from packages/react/src/Snackbar.tsx during the @nudge-design/styles split. */
import {
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
  zIndex,
} from "@nudge-design/tokens";

const SB_CLASS = "nds-snackbar";
const SB_VIEWPORT_CLASS = `${SB_CLASS}__viewport`;
const SB_ICON_CLASS = `${SB_CLASS}__icon`;
const SB_BODY_CLASS = `${SB_CLASS}__body`;
const SB_TITLE_CLASS = `${SB_CLASS}__title`;
const SB_DESC_CLASS = `${SB_CLASS}__desc`;
const SB_ACTION_CLASS = `${SB_CLASS}__action`;
const SB_CLOSE_CLASS = `${SB_CLASS}__close`;

export const snackbarStyles = `
  /* 색 합성: ① --nds-snackbar-bg (브랜드 서피스 override) > ② --nds-snackbar-variant-bg (variant) > ③ 기본.
   * variant 룰은 background 를 직접 박지 않고 ②슬롯만 set → 캐포비가 ①로 전 variant 를 흰카드로 덮을 수 있다.
   * (CLAUDE.md '색은 슬롯에 넣고 우선순위로 합성' 참조.) */
  :where(.${SB_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
    padding: var(--semantic-inset-input) var(--semantic-inset-card);
    border-radius: var(--nds-snackbar-radius, ${radius.md}px);
    background: var(--nds-snackbar-bg, var(--nds-snackbar-variant-bg, var(--semantic-bg-section-default)));
    color: var(--nds-snackbar-fg, var(--semantic-text-normal-default));
    border: 1px solid var(--nds-snackbar-border, transparent);
    box-shadow: var(--nds-snackbar-shadow, none);
    font-family: ${fontFamily.web};
    width: var(--nds-snackbar-width, auto);
    max-width: 480px;
    box-sizing: border-box;
  }

  /* variant 색 = ②슬롯에 글로벌 시멘틱 status 토큰을 넣는다(브랜드는 --semantic-*-status-* 로 커스텀).
   * 아이콘 색은 variant 정체성이라 브랜드 override 와 무관하게 항상 variant 색을 유지. */
  :where(.${SB_CLASS}[data-variant="info"]) {
    --nds-snackbar-variant-bg: var(--semantic-bg-status-info);
    --nds-snackbar-icon: var(--semantic-icon-brand-default);
  }
  :where(.${SB_CLASS}[data-variant="success"]) {
    --nds-snackbar-variant-bg: var(--semantic-bg-status-success);
    --nds-snackbar-icon: var(--semantic-icon-status-success);
  }
  :where(.${SB_CLASS}[data-variant="warning"]) {
    --nds-snackbar-variant-bg: var(--semantic-bg-status-caution);
    --nds-snackbar-icon: var(--semantic-text-status-caution);
  }
  :where(.${SB_CLASS}[data-variant="error"]) {
    --nds-snackbar-variant-bg: var(--semantic-bg-status-error);
    --nds-snackbar-icon: var(--semantic-icon-status-error);
  }

  :where(.${SB_CLASS}[data-has-desc="true"]) {
    align-items: flex-start;
  }

  :where(.${SB_ICON_CLASS}) {
    flex-shrink: 0;
    width: var(--nds-snackbar-icon-size, 20px);
    height: var(--nds-snackbar-icon-size, 20px);
    color: var(--nds-snackbar-icon, currentColor);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${SB_CLASS}[data-has-desc="true"]) .${SB_ICON_CLASS} {
    margin-top: 1px;
  }

  :where(.${SB_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing[2]}px;
  }

  :where(.${SB_TITLE_CLASS}) {
    font-size: var(--nds-snackbar-title-font-size, ${typeScale.body3.fontSize}px);
    line-height: var(--nds-snackbar-title-line-height, ${typeScale.body3.lineHeight}px);
    font-weight: ${fontWeight.bold};
    margin: 0;
  }

  :where(.${SB_DESC_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    margin: 0;
  }

  :where(.${SB_ACTION_CLASS}) {
    height: 28px;
    padding: 0 var(--semantic-inset-chip);
    border: none;
    background: rgba(255, 255, 255, 0.12);
    color: inherit;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.bold};
    cursor: pointer;
    flex-shrink: 0;
    border-radius: ${radius.sm}px;
    transition: background-color ${transition.default};
  }

  /* variant 액션 버튼: 배경 칩이 옅은 배경에서 묻혀버려서 text-only 강조 톤으로 전환.
     색은 variant 아이콘 색을 그대로 받아 variant 아이덴티티 강화. */
  :where(.${SB_CLASS}[data-variant="info"]) .${SB_ACTION_CLASS},
  :where(.${SB_CLASS}[data-variant="success"]) .${SB_ACTION_CLASS},
  :where(.${SB_CLASS}[data-variant="warning"]) .${SB_ACTION_CLASS},
  :where(.${SB_CLASS}[data-variant="error"]) .${SB_ACTION_CLASS} {
    background: transparent;
    color: var(--nds-snackbar-icon);
    padding: 0 ${spacing[6]}px;
  }

  :where(.${SB_ACTION_CLASS}:hover) { background: rgba(255, 255, 255, 0.2); }

  :where(.${SB_CLASS}[data-variant="info"]) .${SB_ACTION_CLASS}:hover,
  :where(.${SB_CLASS}[data-variant="success"]) .${SB_ACTION_CLASS}:hover,
  :where(.${SB_CLASS}[data-variant="warning"]) .${SB_ACTION_CLASS}:hover,
  :where(.${SB_CLASS}[data-variant="error"]) .${SB_ACTION_CLASS}:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  :where(.${SB_ACTION_CLASS}:focus-visible) {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  :where(.${SB_CLOSE_CLASS}) {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    color: var(--nds-snackbar-close-color, inherit);
    cursor: pointer;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    opacity: var(--nds-snackbar-close-opacity, 0.7);
    transition: opacity ${transition.default}, background-color ${transition.default};
  }

  :where(.${SB_CLOSE_CLASS}:hover) {
    opacity: 1;
    background: rgba(0, 0, 0, 0.06);
  }

  /* ── Provider viewport (포지셔닝·자동닫힘·스택) ── */
  :where(.${SB_VIEWPORT_CLASS}) {
    position: fixed;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--semantic-gap-default);
    padding: var(--semantic-inset-card);
    z-index: ${zIndex.toast};
    pointer-events: none;
    box-sizing: border-box;
  }
  :where(.${SB_VIEWPORT_CLASS}[data-position="top"]) { top: 0; }
  :where(.${SB_VIEWPORT_CLASS}[data-position="bottom"]) { bottom: 0; }
  :where(.${SB_VIEWPORT_CLASS}[data-position="top-right"]) { top: 0; align-items: flex-end; }
  :where(.${SB_VIEWPORT_CLASS} .${SB_CLASS}) { pointer-events: auto; }

  :where(.${SB_CLASS}[data-entering="true"]) { animation: nds-snackbar-enter ${transition.default}; }
  :where(.${SB_CLASS}[data-exiting="true"]) { animation: nds-snackbar-exit 0.4s ease forwards; }

  @keyframes nds-snackbar-enter {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes nds-snackbar-exit {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(8px); }
  }
`;
