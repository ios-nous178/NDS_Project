/* Auto-generated from packages/react/src/ResultState.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, spacing, typeScale } from "@nudge-design/tokens";

const RESULT_CLASS = "nds-result-state";
const RESULT_ROOT_CLASS = `${RESULT_CLASS}__root`;
const RESULT_ICON_CLASS = `${RESULT_CLASS}__icon`;
const RESULT_TITLE_CLASS = `${RESULT_CLASS}__title`;
const RESULT_DESC_CLASS = `${RESULT_CLASS}__description`;
const RESULT_ACTION_CLASS = `${RESULT_CLASS}__action`;

export const resultStateStyles = `
  :where(.${RESULT_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: var(--nds-result-state-min-height, 200px);
    padding: ${spacing[48]}px var(--semantic-inset-card-large);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${RESULT_ICON_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${spacing[16]}px;
    color: ${cv.iconRole.normal};
  }

  /* status 시멘틱 — 아이콘 색 (empty 는 중립 유지) */
  :where(.${RESULT_ROOT_CLASS}[data-status="success"] .${RESULT_ICON_CLASS}) {
    color: ${cv.iconRole.statusSuccess};
  }
  :where(.${RESULT_ROOT_CLASS}[data-status="error"] .${RESULT_ICON_CLASS}) {
    color: ${cv.iconRole.statusError};
  }
  :where(.${RESULT_ROOT_CLASS}[data-status="info"] .${RESULT_ICON_CLASS}) {
    color: ${cv.textRole.statusInfo};
  }

  :where(.${RESULT_ICON_CLASS} svg) {
    width: 64px;
    height: 64px;
  }

  :where(.${RESULT_ICON_CLASS} img) {
    width: 64px;
    height: 64px;
    object-fit: contain;
  }

  :where(.${RESULT_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.body1.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: ${typeScale.body1.lineHeight}px;
    color: ${cv.textRole.strong};
  }

  :where(.${RESULT_DESC_CLASS}) {
    margin: ${spacing[8]}px 0 0;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: 1.5;
    color: ${cv.textRole.subtle};
    white-space: pre-line;
    word-break: keep-all;
  }

  :where(.${RESULT_ACTION_CLASS}) {
    margin-top: ${spacing[12]}px;
  }
`;
