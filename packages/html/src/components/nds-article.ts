/**
 * <nds-article> — DS Article 의 vanilla Web Component 버전 (container + subparts).
 *
 * 게시글/공지/FAQ 상세 보기 셸. React Article.tsx 의 compound(Root/Header/Body/Attachments/
 * Actions)를 div/section/article wrapper 서브 엘리먼트로 미러한다. 같은 stylesheet
 * (.nds-article__*) 를 재사용한다. 본문은 <nds-article-body html="..."> 가 직접 sanitize 렌더한다
 * (구 nds-content-viewer 강등 — sanitize 로직은 base/content-sanitize 공유 유틸).
 *
 * DOM:
 *   <nds-article>
 *     <nds-article-header>
 *       <h2 class="nds-article__title">제목</h2>
 *       <div class="nds-article__meta">운영팀 · 2026.06.13</div>
 *     </nds-article-header>
 *     <nds-article-body html="<p>본문…</p>"></nds-article-body>
 *     <nds-article-attachments>...</nds-article-attachments>
 *     <nds-article-actions>...</nds-article-actions>
 *   </nds-article>
 */

import { NdsElement, define } from "../base/nds-element.js";
import {
  decorateContentDom,
  sanitizeContentDom,
  stripDangerousHtml,
} from "../base/content-sanitize.js";

const AR_CLASS = "nds-article";

export class NdsArticle extends NdsElement {
  static elementName = "nds-article";

  static get observedAttributes(): readonly string[] {
    return [];
  }

  private _root: HTMLElement | null = null;

  override connectedCallback(): void {
    if (!this._root) {
      const root = document.createElement("article");
      root.className = `${AR_CLASS}__root`;
      root.dataset.slot = "root";
      while (this.firstChild) root.appendChild(this.firstChild);
      this.appendChild(root);
      this._root = root;
    }
    super.connectedCallback();
  }

  protected update(): void {
    if (this.style.display !== "contents") this.style.display = "contents";
  }
}

/* ──────────────── compound sub-elements ──────────────── */
/**
 * <nds-article-header|body|attachments|actions> — 단순 wrapper.
 * host 안에 <div class="nds-article__{slot}"> 를 만들고 children 을 보존한다.
 */

abstract class ArticleSlot extends NdsElement {
  protected abstract slotClass: string;
  protected abstract slotName: string;
  protected tagName_ = "div";

  protected _inner: HTMLElement | null = null;

  static get observedAttributes(): readonly string[] {
    return [];
  }

  override connectedCallback(): void {
    if (!this._inner) {
      const inner = document.createElement(this.tagName_);
      inner.className = this.slotClass;
      inner.dataset.slot = this.slotName;
      while (this.firstChild) inner.appendChild(this.firstChild);
      this.appendChild(inner);
      this._inner = inner;
    }
    super.connectedCallback();
  }

  protected update(): void {
    if (this.style.display !== "contents") this.style.display = "contents";
  }
}

export class NdsArticleHeader extends ArticleSlot {
  static elementName = "nds-article-header";
  protected slotClass = `${AR_CLASS}__header`;
  protected slotName = "header";
  protected override tagName_ = "header";
}

export class NdsArticleBody extends ArticleSlot {
  static elementName = "nds-article-body";
  protected slotClass = `${AR_CLASS}__body`;
  protected slotName = "body";

  static get observedAttributes(): readonly string[] {
    return ["html", "no-sanitize", "no-image-lazy", "no-external-blank"];
  }

  private _renderedHtml: string | null = null;

  /** html attr 을 주면 sanitize 후 안전 렌더(구 ContentViewer). 없으면 children 그대로. */
  protected override update(): void {
    if (this.style.display !== "contents") this.style.display = "contents";
    if (!this._inner) return;

    const raw = this.getAttribute("html");
    if (raw === null) return; // children 모드

    const sanitize = !this.boolAttr("no-sanitize");
    const safe = sanitize ? stripDangerousHtml(raw) : raw;
    if (safe === this._renderedHtml) return;
    this._renderedHtml = safe;

    this._inner.innerHTML = safe;
    if (sanitize) sanitizeContentDom(this._inner);
    decorateContentDom(this._inner, {
      imageLazy: !this.boolAttr("no-image-lazy"),
      externalLinkBlank: !this.boolAttr("no-external-blank"),
    });
  }
}

export class NdsArticleAttachments extends ArticleSlot {
  static elementName = "nds-article-attachments";
  protected slotClass = `${AR_CLASS}__attachments`;
  protected slotName = "attachments";
}

export class NdsArticleActions extends ArticleSlot {
  static elementName = "nds-article-actions";
  protected slotClass = `${AR_CLASS}__actions`;
  protected slotName = "actions";
}

define(NdsArticle);
define(NdsArticleHeader);
define(NdsArticleBody);
define(NdsArticleAttachments);
define(NdsArticleActions);
