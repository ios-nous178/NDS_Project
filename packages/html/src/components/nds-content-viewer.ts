/**
 * <nds-content-viewer> — DS ContentViewer 의 vanilla Web Component 버전.
 *
 * 사용:
 *   <nds-content-viewer html="<p>hello <a href='https://x'>x</a></p>"></nds-content-viewer>
 *
 * 입력 HTML 은 기본적으로 위험 태그(script/iframe/style/...) 와 on*= 핸들러,
 * javascript: URL 을 제거한다 (no-sanitize boolean attr 로 비활성화 가능).
 * img 에는 loading=lazy + decoding=async,
 * 외부 a[href^="http"] 에는 target=_blank + rel=noopener noreferrer 가 자동 적용.
 */

import { NdsElement, define } from "../base/nds-element.js";

const CV_CLASS = "nds-content-viewer";

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby"] as const;

/** 문자열 1차 방어 — 위험 태그 + on*= 핸들러 + javascript:/vbscript: URL 제거 (React stripDangerous 와 패리티). */
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

/* ─── Allowlist sanitize (DOM) — React ContentViewer 의 sanitizeContentDom 과 패리티.
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

export class NdsContentViewer extends NdsElement {
  static elementName = "nds-content-viewer";

  static get observedAttributes(): readonly string[] {
    return ["html", "no-sanitize", "no-image-lazy", "no-external-blank", ...FORWARDED_ATTRS];
  }

  private _root: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = CV_CLASS;
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    const raw = this.getAttribute("html") ?? "";
    const sanitize = !this.boolAttr("no-sanitize");
    const lazyImages = !this.boolAttr("no-image-lazy");
    const externalBlank = !this.boolAttr("no-external-blank");

    this._root.innerHTML = sanitize ? stripDangerousHtml(raw) : raw;
    if (sanitize) sanitizeContentDom(this._root);

    if (lazyImages) {
      this._root.querySelectorAll("img").forEach((img) => {
        if (!img.getAttribute("loading")) img.setAttribute("loading", "lazy");
        if (!img.getAttribute("decoding")) img.setAttribute("decoding", "async");
      });
    }

    if (externalBlank) {
      this._root.querySelectorAll("a[href]").forEach((a) => {
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
}

define(NdsContentViewer);
