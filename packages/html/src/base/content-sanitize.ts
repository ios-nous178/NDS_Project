/* 공유 sanitize 유틸 — 구 <nds-content-viewer> 에서 강등.
 *
 * "신뢰불가 HTML 을 안전하게 렌더"는 보안 SSOT 라 한 곳에만 둔다. 공개 웹컴포넌트는
 * 없애되 로직은 살려, <nds-article-body html="..."> 가 직접 소비한다.
 * React 미러는 packages/react/src/internal/contentSanitize.ts 와 1:1 패리티. */

/** 문자열 1차 방어 — 위험 태그 + on*= 핸들러 + javascript:/vbscript: URL 제거. */
export function stripDangerousHtml(html: string): string {
  return html
    .replace(
      /<\/?(script|iframe|object|embed|style|link|meta|base|form|input|button|textarea|select|option|svg|math|frame|frameset|applet|marquee|title)[^>]*>/gi,
      "",
    )
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "")
    .replace(/(javascript|vbscript):/gi, "");
}

/* ─── Allowlist sanitize (DOM) — React contentSanitize 의 sanitizeContentDom 과 패리티. ─── */

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

function isSafeUrl(value: string): boolean {
  const v = value.trim();
  if (v === "" || /^(#|\/|\.\/|\.\.\/|\?)/.test(v)) return true;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return /^(https?|mailto|tel):/i.test(v);
  return true;
}

export function sanitizeContentDom(root: HTMLElement): void {
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
}

export interface DecorateOptions {
  imageLazy?: boolean;
  externalLinkBlank?: boolean;
}

/** sanitize 후 DOM 후처리 — 이미지 lazy + 외부 링크 안전 rel. */
export function decorateContentDom(root: HTMLElement, opts: DecorateOptions = {}): void {
  const { imageLazy = true, externalLinkBlank = true } = opts;

  if (imageLazy) {
    root.querySelectorAll("img").forEach((img) => {
      if (!img.getAttribute("loading")) img.setAttribute("loading", "lazy");
      if (!img.getAttribute("decoding")) img.setAttribute("decoding", "async");
    });
  }

  if (externalLinkBlank) {
    root.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href") ?? "";
      if (!/^https?:\/\//i.test(href)) return;
      if (!a.getAttribute("target")) a.setAttribute("target", "_blank");
      const rel = (a.getAttribute("rel") ?? "").split(/\s+/).filter(Boolean);
      if (!rel.includes("noopener")) rel.push("noopener");
      if (!rel.includes("noreferrer")) rel.push("noreferrer");
      a.setAttribute("rel", rel.join(" "));
    });
  }
}
