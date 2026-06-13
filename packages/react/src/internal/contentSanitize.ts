/* 내부 sanitize 유틸 — 구 ContentViewer 컴포넌트에서 강등.
 *
 * "신뢰불가 HTML 을 안전하게 렌더"는 보안 SSOT 라 한 곳(여기)에만 둔다. 공개 컴포넌트는
 * 없애되 로직은 살려, Article.Body 가 직접 소비한다. 패키지 index 에서 export 하지 않음
 * (재사용이 또 필요해지면 그때 얇은 래퍼로 재공개). html 미러는
 * packages/html/src/base/content-sanitize.ts 와 1:1 패리티.
 */

/**
 * 문자열 단계(SSR·동기 렌더) 1차 방어 — 위험 태그를 통째로 제거하고 on*= 인라인 핸들러,
 * javascript:/vbscript: URL 을 떼어낸다. 클라이언트에서는 sanitizeContentDom 이 allowlist 로
 * 한 번 더 조인다. 신뢰할 수 없는 입력은 여전히 호출부에서 DOMPurify 로 사전 처리하는 게
 * 안전(심층 방어).
 */
export const stripDangerous = (html: string): string =>
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

export interface DecorateOptions {
  /** img 에 loading="lazy" + decoding="async" 자동 부여 (기본 true) */
  imageLazy?: boolean;
  /** 외부 링크(http/https)에 target="_blank" + rel=noopener noreferrer 자동 (기본 true) */
  externalLinkBlank?: boolean;
}

/** sanitize 후 DOM 후처리 — 이미지 lazy + 외부 링크 안전 rel. */
export const decorateContentDom = (root: HTMLElement, opts: DecorateOptions = {}): void => {
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
};
