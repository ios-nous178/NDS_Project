/* Auto-generated from packages/react/src/Badge.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight } from "@nudge-design/tokens";

const BADGE_CLASS = "nds-badge";

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

  /* variant × color → bg/fg/border 슬롯 합성. react/html 은 data-variant/data-color 만 set, 색은 여기서. */

  /* ── fill ── */
  :where(.${BADGE_CLASS}[data-variant="fill"][data-color="brand"]) {
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
  :where(.${BADGE_CLASS}[data-variant="ghost"][data-color="brand"]) {
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
  :where(.${BADGE_CLASS}[data-variant="line"][data-color="brand"]) {
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
