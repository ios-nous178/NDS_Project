/* Auto-generated from packages/react/src/ContentViewer.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-design/tokens";

const CV_CLASS = "nds-content-viewer";

export const contentViewerStyles = `
  :where(.${CV_CLASS}) {
    width: 100%;
    font-family: ${fontFamily.web};
    color: ${cv.textRole.normal};
    font-size: ${typeScale.body2.fontSize}px;
    line-height: 1.7;
    word-break: break-word;
    box-sizing: border-box;
  }

  :where(.${CV_CLASS}) > *:first-child { margin-top: 0; }
  :where(.${CV_CLASS}) > *:last-child { margin-bottom: 0; }

  :where(.${CV_CLASS}) h1 { font-size: ${typeScale.headline2.fontSize}px; line-height: ${typeScale.headline2.lineHeight}px; font-weight: ${fontWeight.bold}; margin: ${spacing[24]}px 0 ${spacing[12]}px; color: ${cv.textRole.strong}; }
  :where(.${CV_CLASS}) h2 { font-size: ${typeScale.headline3.fontSize}px; line-height: ${typeScale.headline3.lineHeight}px; font-weight: ${fontWeight.bold}; margin: ${spacing[20]}px 0 ${spacing[10]}px; color: ${cv.textRole.strong}; }
  :where(.${CV_CLASS}) h3 { font-size: ${typeScale.headline4.fontSize}px; line-height: ${typeScale.headline4.lineHeight}px; font-weight: ${fontWeight.bold}; margin: ${spacing[16]}px 0 ${spacing[8]}px; color: ${cv.textRole.strong}; }
  :where(.${CV_CLASS}) h4 { font-size: ${typeScale.headline5.fontSize}px; line-height: ${typeScale.headline5.lineHeight}px; font-weight: ${fontWeight.bold}; margin: ${spacing[16]}px 0 ${spacing[8]}px; color: ${cv.textRole.strong}; }

  :where(.${CV_CLASS}) p { margin: 0 0 ${spacing[12]}px; }
  :where(.${CV_CLASS}) p:last-child { margin-bottom: 0; }

  :where(.${CV_CLASS}) ul,
  :where(.${CV_CLASS}) ol { margin: 0 0 ${spacing[12]}px; padding-left: ${spacing[20]}px; }
  :where(.${CV_CLASS}) li { margin: ${spacing[2]}px 0; }

  :where(.${CV_CLASS}) a {
    color: ${cv.textRole.brand};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  :where(.${CV_CLASS}) a:hover { opacity: 0.85; }

  :where(.${CV_CLASS}) strong { font-weight: ${fontWeight.bold}; }
  :where(.${CV_CLASS}) em { font-style: italic; }

  :where(.${CV_CLASS}) blockquote {
    margin: ${spacing[12]}px 0;
    padding: ${spacing[10]}px var(--semantic-inset-card);
    border-left: 3px solid ${cv.borderRole.brand};
    background: ${cv.surface.brandSubtle};
    color: ${cv.textRole.strong};
    border-radius: 0 ${radius.sm}px ${radius.sm}px 0;
  }

  :where(.${CV_CLASS}) code {
    padding: 2px 6px;
    background: ${cv.surface.page};
    border-radius: ${radius.sm}px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.9em;
  }

  :where(.${CV_CLASS}) pre {
    margin: ${spacing[12]}px 0;
    padding: var(--semantic-inset-input) var(--semantic-inset-card);
    background: ${cv.surface.page};
    border-radius: ${radius.md}px;
    overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: 1.5;
  }
  :where(.${CV_CLASS}) pre code {
    padding: 0;
    background: none;
  }

  :where(.${CV_CLASS}) img {
    max-width: 100%;
    height: auto;
    border-radius: ${radius.md}px;
    margin: ${spacing[8]}px 0;
    display: block;
  }

  :where(.${CV_CLASS}) hr {
    margin: ${spacing[20]}px 0;
    border: 0;
    border-top: 1px solid ${cv.borderRole.subtle};
  }

  :where(.${CV_CLASS}) table {
    width: 100%;
    border-collapse: collapse;
    margin: ${spacing[12]}px 0;
    font-size: ${typeScale.body3.fontSize}px;
  }
  :where(.${CV_CLASS}) th,
  :where(.${CV_CLASS}) td {
    padding: var(--semantic-inset-chip) ${spacing[10]}px;
    border: 1px solid ${cv.borderRole.subtle};
    text-align: left;
  }
  :where(.${CV_CLASS}) th {
    background: ${cv.surface.page};
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.subtle};
  }
`;
