/* Auto-generated from packages/react/src/Badge.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight } from "@nudge-design/tokens";

const BADGE_CLASS = "nds-badge";
const BADGE_LABEL_CLASS = `${BADGE_CLASS}__label`;

export const badgeStyles = `
  :where(.${BADGE_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--semantic-gap-tight);
    box-sizing: border-box;
    white-space: nowrap;
    font-family: ${fontFamily.web};
    font-weight: var(--nds-badge-font-weight, ${fontWeight.bold});
    background: var(--nds-badge-bg);
    color: var(--nds-badge-fg);
    border: 1px solid var(--nds-badge-border, transparent);
  }

  /* size → 치수 슬롯(폴백 포함). react/html 은 data-size 만 set. */
  :where(.${BADGE_CLASS}[data-size="sm"]) {
    height: var(--nds-badge-height, 22px);
    padding: var(--nds-badge-padding-y, 3px) var(--nds-badge-padding-x, 6px);
    border-radius: var(--nds-badge-radius, 4px);
    font-size: var(--nds-badge-font-size, 11px);
    line-height: var(--nds-badge-line-height, 14px);
  }
  :where(.${BADGE_CLASS}[data-size="md"]) {
    height: var(--nds-badge-height, 26px);
    padding: var(--nds-badge-padding-y, 4px) var(--nds-badge-padding-x, 8px);
    border-radius: var(--nds-badge-radius, 4px);
    font-size: var(--nds-badge-font-size, 13px);
    line-height: var(--nds-badge-line-height, 18px);
  }
  :where(.${BADGE_CLASS}[data-size="lg"]) {
    height: var(--nds-badge-height, 30px);
    padding: var(--nds-badge-padding-y, 5px) var(--nds-badge-padding-x, 10px);
    border-radius: var(--nds-badge-radius, 6px);
    font-size: var(--nds-badge-font-size, 14px);
    line-height: var(--nds-badge-line-height, 20px);
  }

  /* shape=pill 은 size 라운드를 완전 둥근으로 덮는다 (size 룰 뒤 source-order). */
  :where(.${BADGE_CLASS}[data-shape="pill"]) {
    border-radius: var(--nds-badge-radius, 9999px);
  }

  /* ── type: dot / count — geometry override (색은 variant=fill 룰에서 받음).
     size/shape 룰 뒤(source-order)라 :where() 동일 특정성에서 이긴다. 가이드 5107:130. */
  /* dot — 8×8 상태 점, 텍스트 없음 */
  :where(.${BADGE_CLASS}[data-type="dot"]) {
    width: 8px;
    min-width: 8px;
    height: 8px;
    padding: 0;
    border-radius: 9999px;
  }
  :where(.${BADGE_CLASS}[data-type="dot"] .${BADGE_LABEL_CLASS}) {
    display: none;
  }
  /* count — min 18 원형 숫자 카운터 */
  :where(.${BADGE_CLASS}[data-type="count"]) {
    min-width: 18px;
    height: 18px;
    padding: 0 var(--nds-badge-count-padding-x, 5px);
    border-radius: 9999px;
    font-size: var(--nds-badge-font-size, 11px);
    line-height: 1;
  }

  /* variant × color → bg/fg/border 슬롯 합성. react/html 은 data-variant/data-color 만 set, 색은 여기서. */

  /* ── fill ── */
  :where(.${BADGE_CLASS}[data-variant="fill"][data-color="project"]) {
    --nds-badge-bg: ${cv.fill.brand};
    --nds-badge-fg: var(--semantic-button-text-default, #ffffff);
    --nds-badge-border: transparent;
  }
  :where(.${BADGE_CLASS}[data-variant="fill"][data-color="neutral"]) {
    --nds-badge-bg: ${cv.fill.neutral};
    --nds-badge-fg: var(--semantic-text-inverse-default, #ffffff);
    --nds-badge-border: transparent;
  }
  :where(.${BADGE_CLASS}[data-variant="fill"][data-color="success"]) {
    --nds-badge-bg: ${cv.surface.statusSuccess};
    --nds-badge-fg: ${cv.textRole.statusSuccess};
    --nds-badge-border: transparent;
  }
  :where(.${BADGE_CLASS}[data-variant="fill"][data-color="error"]) {
    --nds-badge-bg: ${cv.fill.statusError};
    --nds-badge-fg: var(--semantic-text-inverse-default, #ffffff);
    --nds-badge-border: transparent;
  }
  :where(.${BADGE_CLASS}[data-variant="fill"][data-color="caution"]) {
    --nds-badge-bg: ${cv.fill.statusCaution};
    --nds-badge-fg: ${cv.textRole.strong};
    --nds-badge-border: transparent;
  }
  :where(.${BADGE_CLASS}[data-variant="fill"][data-color="info"]) {
    --nds-badge-bg: ${cv.surface.statusInfo};
    --nds-badge-fg: ${cv.textRole.statusInfo};
    --nds-badge-border: transparent;
  }

  /* ── ghost ── */
  :where(.${BADGE_CLASS}[data-variant="ghost"][data-color="project"]) {
    --nds-badge-bg: ${cv.surface.brandSubtle};
    --nds-badge-fg: ${cv.textRole.brand};
    --nds-badge-border: transparent;
  }
  :where(.${BADGE_CLASS}[data-variant="ghost"][data-color="neutral"]) {
    --nds-badge-bg: ${cv.surface.subtle};
    --nds-badge-fg: ${cv.textRole.normal};
    --nds-badge-border: transparent;
  }
  :where(.${BADGE_CLASS}[data-variant="ghost"][data-color="success"]) {
    --nds-badge-bg: ${cv.surface.statusSuccess};
    --nds-badge-fg: ${cv.textRole.statusSuccess};
    --nds-badge-border: transparent;
  }
  :where(.${BADGE_CLASS}[data-variant="ghost"][data-color="error"]) {
    --nds-badge-bg: ${cv.surface.statusError};
    --nds-badge-fg: ${cv.textRole.statusError};
    --nds-badge-border: transparent;
  }
  :where(.${BADGE_CLASS}[data-variant="ghost"][data-color="caution"]) {
    --nds-badge-bg: ${cv.surface.statusCaution};
    --nds-badge-fg: ${cv.textRole.statusCaution};
    --nds-badge-border: transparent;
  }
  :where(.${BADGE_CLASS}[data-variant="ghost"][data-color="info"]) {
    --nds-badge-bg: ${cv.surface.statusInfo};
    --nds-badge-fg: ${cv.textRole.statusInfo};
    --nds-badge-border: transparent;
  }

  /* ── line ── */
  :where(.${BADGE_CLASS}[data-variant="line"][data-color="project"]) {
    --nds-badge-bg: transparent;
    --nds-badge-fg: ${cv.textRole.brand};
    --nds-badge-border: ${cv.borderRole.brand};
  }
  :where(.${BADGE_CLASS}[data-variant="line"][data-color="neutral"]) {
    --nds-badge-bg: transparent;
    --nds-badge-fg: ${cv.textRole.normal};
    --nds-badge-border: ${cv.borderRole.normal};
  }
  :where(.${BADGE_CLASS}[data-variant="line"][data-color="success"]) {
    --nds-badge-bg: transparent;
    --nds-badge-fg: ${cv.textRole.statusSuccess};
    --nds-badge-border: ${cv.textRole.statusSuccess};
  }
  :where(.${BADGE_CLASS}[data-variant="line"][data-color="error"]) {
    --nds-badge-bg: transparent;
    --nds-badge-fg: ${cv.textRole.statusError};
    --nds-badge-border: ${cv.borderRole.statusError};
  }
  :where(.${BADGE_CLASS}[data-variant="line"][data-color="caution"]) {
    --nds-badge-bg: transparent;
    --nds-badge-fg: ${cv.textRole.statusCaution};
    --nds-badge-border: ${cv.borderRole.statusCaution};
  }
  :where(.${BADGE_CLASS}[data-variant="line"][data-color="info"]) {
    --nds-badge-bg: transparent;
    --nds-badge-fg: ${cv.textRole.statusInfo};
    --nds-badge-border: ${cv.textRole.statusInfo};
  }
`;
