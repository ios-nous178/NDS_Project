/* Companion styles for packages/react/src/Article.tsx + html nds-article.
 * 게시글/공지/FAQ 상세 보기 셸 — 제목·메타 + 본문(sanitize 렌더) + 첨부 + 액션 레이아웃.
 * 색/여백은 semantic 토큰만. 본문 prose 타이포는 .nds-article__body 가 담당
 * (구 ContentViewer 강등 — 본문 렌더링이 Article.Body 로 이동). */
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-design/tokens";

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
    border-bottom: var(--stroke-default) solid ${cv.borderRole.subtle};
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

  /* ── Body — 본문(sanitize 렌더 / children). prose 타이포 (구 ContentViewer). ── */
  :where(.${AR_BODY_CLASS}) {
    width: 100%;
    font-size: ${typeScale.body2.fontSize}px;
    line-height: 1.7;
    color: ${cv.textRole.normal};
    word-break: break-word;
    box-sizing: border-box;
  }
  :where(.${AR_BODY_CLASS}) > *:first-child { margin-top: 0; }
  :where(.${AR_BODY_CLASS}) > *:last-child { margin-bottom: 0; }

  :where(.${AR_BODY_CLASS}) h1 { font-size: ${typeScale.headline2.fontSize}px; line-height: ${typeScale.headline2.lineHeight}px; font-weight: ${fontWeight.bold}; margin: ${spacing[24]}px 0 ${spacing[12]}px; color: ${cv.textRole.strong}; }
  :where(.${AR_BODY_CLASS}) h2 { font-size: ${typeScale.headline3.fontSize}px; line-height: ${typeScale.headline3.lineHeight}px; font-weight: ${fontWeight.bold}; margin: ${spacing[20]}px 0 ${spacing[10]}px; color: ${cv.textRole.strong}; }
  :where(.${AR_BODY_CLASS}) h3 { font-size: ${typeScale.headline4.fontSize}px; line-height: ${typeScale.headline4.lineHeight}px; font-weight: ${fontWeight.bold}; margin: ${spacing[16]}px 0 ${spacing[8]}px; color: ${cv.textRole.strong}; }
  :where(.${AR_BODY_CLASS}) h4 { font-size: ${typeScale.headline5.fontSize}px; line-height: ${typeScale.headline5.lineHeight}px; font-weight: ${fontWeight.bold}; margin: ${spacing[16]}px 0 ${spacing[8]}px; color: ${cv.textRole.strong}; }

  :where(.${AR_BODY_CLASS}) p { margin: 0 0 ${spacing[12]}px; }
  :where(.${AR_BODY_CLASS}) p:last-child { margin-bottom: 0; }

  :where(.${AR_BODY_CLASS}) ul,
  :where(.${AR_BODY_CLASS}) ol { margin: 0 0 ${spacing[12]}px; padding-left: ${spacing[20]}px; }
  :where(.${AR_BODY_CLASS}) li { margin: ${spacing[2]}px 0; }

  :where(.${AR_BODY_CLASS}) a {
    color: ${cv.textRole.brand};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  :where(.${AR_BODY_CLASS}) a:hover { opacity: 0.85; }

  :where(.${AR_BODY_CLASS}) strong { font-weight: ${fontWeight.bold}; }
  :where(.${AR_BODY_CLASS}) em { font-style: italic; }

  :where(.${AR_BODY_CLASS}) blockquote {
    margin: ${spacing[12]}px 0;
    padding: ${spacing[10]}px var(--semantic-inset-card);
    border-left: 3px solid ${cv.borderRole.brand};
    background: ${cv.surface.brandSubtle};
    color: ${cv.textRole.strong};
    border-radius: 0 ${radius[4]}px ${radius[4]}px 0;
  }

  :where(.${AR_BODY_CLASS}) code {
    padding: 2px 6px;
    background: ${cv.surface.page};
    border-radius: ${radius[4]}px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.9em;
  }

  :where(.${AR_BODY_CLASS}) pre {
    margin: ${spacing[12]}px 0;
    padding: var(--semantic-inset-input) var(--semantic-inset-card);
    background: ${cv.surface.page};
    border-radius: ${radius[8]}px;
    overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: 1.5;
  }
  :where(.${AR_BODY_CLASS}) pre code {
    padding: 0;
    background: none;
  }

  :where(.${AR_BODY_CLASS}) img {
    max-width: 100%;
    height: auto;
    border-radius: ${radius[8]}px;
    margin: ${spacing[8]}px 0;
    display: block;
  }

  :where(.${AR_BODY_CLASS}) hr {
    margin: ${spacing[20]}px 0;
    border: 0;
    border-top: var(--stroke-default) solid ${cv.borderRole.subtle};
  }

  :where(.${AR_BODY_CLASS}) table {
    width: 100%;
    border-collapse: collapse;
    margin: ${spacing[12]}px 0;
    font-size: ${typeScale.body3.fontSize}px;
  }
  :where(.${AR_BODY_CLASS}) th,
  :where(.${AR_BODY_CLASS}) td {
    padding: var(--semantic-inset-chip) ${spacing[10]}px;
    border: var(--stroke-default) solid ${cv.borderRole.subtle};
    text-align: left;
  }
  :where(.${AR_BODY_CLASS}) th {
    background: ${cv.surface.page};
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.subtle};
  }

  /* ── Attachments ── */
  :where(.${AR_ATTACHMENTS_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-tight);
    padding-top: ${spacing[16]}px;
    border-top: var(--stroke-default) solid ${cv.borderRole.subtle};
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
    border-top: var(--stroke-default) solid ${cv.borderRole.subtle};
  }
`;
