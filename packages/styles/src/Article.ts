/* Auto-generated companion for packages/react/src/Article.tsx.
 * 게시글/공지/FAQ 상세 보기 셸 — 제목·메타 + 본문(ContentViewer) + 첨부 + 액션 레이아웃.
 * 색/여백은 semantic 토큰만. 본문 내부 타이포는 ContentViewer 가 담당. */
import { cv, fontFamily, fontWeight, spacing, typeScale } from "@nudge-design/tokens";

const AR_CLASS = "nds-article";
const AR_ROOT_CLASS = `${AR_CLASS}__root`;
const AR_HEADER_CLASS = `${AR_CLASS}__header`;
const AR_TITLE_CLASS = `${AR_CLASS}__title`;
const AR_META_CLASS = `${AR_CLASS}__meta`;
const AR_BODY_CLASS = `${AR_CLASS}__body`;
const AR_ATTACHMENTS_CLASS = `${AR_CLASS}__attachments`;
const AR_ATTACHMENTS_LABEL_CLASS = `${AR_CLASS}__attachments-label`;
const AR_ACTIONS_CLASS = `${AR_CLASS}__actions`;

export const articleStyles = `
  :where(.${AR_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[24]}px;
    width: 100%;
    box-sizing: border-box;
    font-family: ${fontFamily.web};
    color: ${cv.textRole.normal};
  }

  /* ── Header ── */
  :where(.${AR_HEADER_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
    padding-bottom: ${spacing[16]}px;
    border-bottom: 1px solid ${cv.borderRole.subtle};
  }
  :where(.${AR_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.headline4.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: ${typeScale.headline4.lineHeight}px;
    color: ${cv.textRole.strong};
    word-break: keep-all;
  }
  :where(.${AR_META_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--semantic-gap-tight);
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  /* ── Body (ContentViewer 래퍼) ── */
  :where(.${AR_BODY_CLASS}) { width: 100%; }

  /* ── Attachments ── */
  :where(.${AR_ATTACHMENTS_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-tight);
    padding-top: ${spacing[16]}px;
    border-top: 1px solid ${cv.borderRole.subtle};
  }
  :where(.${AR_ATTACHMENTS_LABEL_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  /* ── Actions (하단 액션 바) ── */
  :where(.${AR_ACTIONS_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--semantic-gap-comfortable);
    padding-top: ${spacing[16]}px;
    border-top: 1px solid ${cv.borderRole.subtle};
  }
`;
