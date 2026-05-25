import React, { useEffect, useRef } from "react";

/* ─── Constants ─── */

const CV_CLASS = "nds-content-viewer";
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/**
 * 매우 단순한 안전 정리 — script/iframe/style 등 위험 태그를 통째로 제거하고
 * on*= 인라인 핸들러를 떼어냄. 강력한 sanitize가 필요하면 호출부에서
 * DOMPurify 등으로 사전에 처리한 HTML을 넘기는 게 권장.
 */
const stripDangerous = (html: string): string =>
  html
    .replace(/<\/?(script|iframe|object|embed|style|link|meta|form|input)[^>]*>/gi, "")
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript:/gi, "");

/* ─── Component ─── */

export interface ContentViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 본문 HTML — 호출부에서 sanitize한 안전한 HTML 권장 */
  html: string;
  /** 컴포넌트 내부에서 한 번 더 위험 태그 제거 (기본 true) */
  sanitize?: boolean;
  /** 이미지에 loading="lazy" 자동 부여 (기본 true) */
  imageLazy?: boolean;
  /** 외부 링크(http/https)에 target="_blank" + rel 자동 부여 (기본 true) */
  externalLinkBlank?: boolean;
}

export const ContentViewer = React.forwardRef<HTMLDivElement, ContentViewerProps>(
  (
    { html, sanitize = true, imageLazy = true, externalLinkBlank = true, className, ...rest },
    forwardedRef,
  ) => {
    const localRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) ?? localRef;

    const safeHtml = sanitize ? stripDangerous(html) : html;

    useEffect(() => {
      const root = (ref as React.RefObject<HTMLDivElement>).current;
      if (!root) return;

      if (imageLazy) {
        root.querySelectorAll("img").forEach((img) => {
          if (!img.getAttribute("loading")) img.setAttribute("loading", "lazy");
          if (!img.getAttribute("decoding")) img.setAttribute("decoding", "async");
        });
      }

      if (externalLinkBlank) {
        root.querySelectorAll("a[href]").forEach((a) => {
          const href = a.getAttribute("href") ?? "";
          if (/^https?:\/\//i.test(href)) {
            if (!a.getAttribute("target")) a.setAttribute("target", "_blank");
            const rel = (a.getAttribute("rel") ?? "").split(/\s+/);
            if (!rel.includes("noopener")) rel.push("noopener");
            if (!rel.includes("noreferrer")) rel.push("noreferrer");
            a.setAttribute("rel", rel.filter(Boolean).join(" "));
          }
        });
      }
    }, [safeHtml, imageLazy, externalLinkBlank, ref]);

    return (
      <div
        ref={ref}
        data-slot="root"
        className={cx(CV_CLASS, className)}
        dangerouslySetInnerHTML={{ __html: safeHtml }}
        {...rest}
      />
    );
  },
);

ContentViewer.displayName = "ContentViewer";
