import React, { useEffect, useRef } from "react";

/* ─── Constants ─── */

const CV_CLASS = "nds-content-viewer";
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/**
 * 문자열 단계(SSR·동기 렌더) 1차 방어 — 위험 태그를 통째로 제거하고 on*= 인라인 핸들러,
 * javascript:/vbscript: URL 을 떼어낸다. 클라이언트에서는 sanitizeDom 이 allowlist 로 한 번 더 조인다.
 * 신뢰할 수 없는 입력은 여전히 호출부에서 DOMPurify 로 사전 처리하는 게 안전(심층 방어).
 */
const stripDangerous = (html: string): string =>
  html
    .replace(
      /<\/?(script|iframe|object|embed|style|link|meta|base|form|input|button|textarea|select|option|svg|math|frame|frameset|applet|marquee|title)[^>]*>/gi,
      "",
    )
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
    .replace(/(javascript|vbscript):/gi, "");

/* ─── Allowlist sanitize (클라이언트 DOM) — Salesforce lightning-formatted-rich-text 모델.
   허용 prose 태그/속성/URL 스킴만 남기고 나머지는 unwrap(텍스트 보존)·속성 제거. ─── */

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "hr",
  "span",
  "div",
  "a",
  "img",
  "figure",
  "figcaption",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "dl",
  "dt",
  "dd",
  "blockquote",
  "pre",
  "code",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "mark",
  "sub",
  "sup",
  "small",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "caption",
  "colgroup",
  "col",
]);

const GLOBAL_ATTRS = new Set(["title", "dir", "lang"]);

const TAG_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "target", "rel", "name"]),
  img: new Set(["src", "alt", "width", "height", "loading", "decoding"]),
  td: new Set(["colspan", "rowspan"]),
  th: new Set(["colspan", "rowspan", "scope"]),
  col: new Set(["span"]),
  colgroup: new Set(["span"]),
  ol: new Set(["start", "type", "reversed"]),
};

/** href/src 에 http(s)/mailto/tel/상대경로만 허용 — javascript:/data:/vbscript: 등 차단. */
const isSafeUrl = (value: string): boolean => {
  const v = value.trim();
  if (v === "" || /^(#|\/|\.\/|\.\.\/|\?)/.test(v)) return true;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return /^(https?|mailto|tel):/i.test(v);
  return true; // 스킴 없는 상대 경로
};

export const sanitizeContentDom = (root: HTMLElement): void => {
  const walk = (parent: Element) => {
    Array.from(parent.children).forEach((el) => {
      walk(el);
      const tag = el.tagName.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) {
        while (el.firstChild) parent.insertBefore(el.firstChild, el);
        el.remove();
        return;
      }
      const allowed = TAG_ATTRS[tag];
      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (!(GLOBAL_ATTRS.has(name) || allowed?.has(name))) {
          el.removeAttribute(attr.name);
        } else if ((name === "href" || name === "src") && !isSafeUrl(attr.value)) {
          el.removeAttribute(attr.name);
        }
      });
    });
  };
  walk(root);
};

/* ─── Component ─── */

export interface ContentViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 본문 HTML — 호출부에서 sanitize한 안전한 HTML 권장 */
  html: string;
  /** 내부 sanitize (문자열 위험태그 제거 + 클라이언트 allowlist 정리). 기본 true */
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

      // allowlist 정리는 위험 vector 제거 후(클라이언트 DOM)에서 한 번 더 — 허용 태그/속성/URL 만 남김.
      if (sanitize) sanitizeContentDom(root);

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
    }, [safeHtml, sanitize, imageLazy, externalLinkBlank, ref]);

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
