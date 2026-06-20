/* Auto-generated companion for packages/react/src/Agreement.tsx.
 * 약관 동의 — 전체동의(master) + 필수/선택 항목 cascade. 체크 인디케이터 토큰은
 * Checkbox / CheckboxTree 와 동일(프로젝트 cascade = fill.brand). 색/radius 는 semantic 토큰만. */
import { cv, fontFamily, fontWeight, radius, sizing, spacing, transition, typeScale } from "@nudge-design/tokens";

const AG_CLASS = "nds-agreement";
const AG_ALL_CLASS = `${AG_CLASS}__all`;
const AG_DIVIDER_CLASS = `${AG_CLASS}__divider`;
const AG_LIST_CLASS = `${AG_CLASS}__list`;
const AG_ROW_CLASS = `${AG_CLASS}__row`;
const AG_OPTION_CLASS = `${AG_CLASS}__option`;
const AG_INPUT_CLASS = `${AG_CLASS}__input`;
const AG_CHECK_CLASS = `${AG_CLASS}__check`;
const AG_LABEL_CLASS = `${AG_CLASS}__label`;
const AG_BADGE_CLASS = `${AG_CLASS}__badge`;
const AG_VIEW_CLASS = `${AG_CLASS}__view`;

export const agreementStyles = `
  :where(.${AG_CLASS}) {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
    font-family: ${fontFamily.web};
  }

  :where(.${AG_LIST_CLASS}) { display: flex; flex-direction: column; }

  /* ── Row ── */
  :where(.${AG_ROW_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-tight);
    min-height: ${sizing.input.default}px;
    box-sizing: border-box;
  }

  /* 전체동의 — 강조(굵게) + 구분선으로 항목과 분리 */
  :where(.${AG_ALL_CLASS}) .${AG_LABEL_CLASS} {
    font-weight: ${fontWeight.bold};
    font-size: ${typeScale.body1.fontSize}px;
    line-height: ${typeScale.body1.lineHeight}px;
  }
  :where(.${AG_DIVIDER_CLASS}) {
    height: 1px;
    margin: ${spacing[8]}px 0;
    background: ${cv.borderRole.subtle};
  }

  /* ── Option (label: hidden input + check + badge + text) ── */
  :where(.${AG_OPTION_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
    flex: 1 1 auto;
    min-width: 0;
    cursor: pointer;
  }
  :where(.${AG_ROW_CLASS}[data-disabled="true"] .${AG_OPTION_CLASS}) { cursor: not-allowed; }

  :where(.${AG_INPUT_CLASS}) {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* ── Check indicator (Checkbox 와 동일 토큰) ── */
  :where(.${AG_CHECK_CLASS}) {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--nds-checkbox-size, 18px);
    height: var(--nds-checkbox-size, 18px);
    border: 1.5px solid ${cv.borderRole.normal};
    border-radius: ${radius.sm}px;
    background: ${cv.surface.default};
    color: ${cv.button.textDefault};
    transition: background-color ${transition.default}, border-color ${transition.default};
  }
  :where(.${AG_CHECK_CLASS}[data-state="checked"]),
  :where(.${AG_CHECK_CLASS}[data-state="indeterminate"]) {
    border-color: ${cv.fill.brand};
    background: ${cv.fill.brand};
  }
  :where(.${AG_CHECK_CLASS} svg) {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 14px;
    height: 14px;
    opacity: 0;
    transition: opacity ${transition.default};
  }
  :where(.${AG_CHECK_CLASS}[data-state="checked"] .${AG_CHECK_CLASS}-icon) { opacity: 1; }
  :where(.${AG_CHECK_CLASS}[data-state="indeterminate"] .${AG_CHECK_CLASS}-minus) { opacity: 1; }
  :where(.${AG_INPUT_CLASS}:focus-visible + .${AG_CHECK_CLASS}) {
    box-shadow: 0 0 0 2px ${cv.surface.default}, 0 0 0 4px ${cv.borderRole.focus};
  }
  :where(.${AG_ROW_CLASS}[data-disabled="true"] .${AG_CHECK_CLASS}) {
    border-color: ${cv.borderRole.disabled};
    background: ${cv.surface.disabled};
  }

  /* ── 필수/선택 배지 ── */
  :where(.${AG_BADGE_CLASS}) {
    flex-shrink: 0;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
    white-space: nowrap;
  }
  :where(.${AG_BADGE_CLASS}[data-required="true"]) { color: ${cv.textRole.brand}; }

  /* ── Label ── */
  :where(.${AG_LABEL_CLASS}) {
    flex: 1 1 auto;
    min-width: 0;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${cv.textRole.normal};
    user-select: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  :where(.${AG_ROW_CLASS}[data-disabled="true"] .${AG_LABEL_CLASS}) { color: ${cv.textRole.disabled}; }

  /* ── "보기" 링크 ── */
  :where(.${AG_VIEW_CLASS}) {
    appearance: none;
    flex-shrink: 0;
    margin-inline-start: auto;
    padding: ${spacing[4]}px;
    border: 0;
    background: none;
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  :where(.${AG_VIEW_CLASS}:hover) { color: ${cv.textRole.normal}; }
`;
