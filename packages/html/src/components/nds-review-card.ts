/**
 * <nds-review-card> — DS ReviewCard 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-review-card
 *     author="홍길동"
 *     rating="4.5"
 *     rating-label="4.5"
 *     verified
 *     body="정말 좋은 상담이었습니다."
 *     tags='["친절해요","전문적이에요"]'
 *   >
 *     <nds-avatar slot="avatar" src="..."></nds-avatar>
 *     <button slot="footer">신고하기</button>
 *   </nds-review-card>
 *
 * children 중 slot="avatar" / slot="footer" 는 mount 시 1회 분리 후 해당 위치에 고정.
 * 그 외 children 은 무시 (모든 텍스트는 author / body 속성으로 받음).
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";
import { appendStars } from "../base/star-icons.js";

const RC_CLASS = "nds-review-card";
const RC_HEADER_CLASS = `${RC_CLASS}__header`;
const RC_AUTHOR_AREA_CLASS = `${RC_CLASS}__author-area`;
const RC_AUTHOR_CLASS = `${RC_CLASS}__author`;
const RC_VERIFIED_CLASS = `${RC_CLASS}__verified`;
const RC_META_CLASS = `${RC_CLASS}__meta`;
const RC_RATING_CLASS = `${RC_CLASS}__rating`;
const RC_BODY_CLASS = `${RC_CLASS}__body`;
const RC_TAGS_CLASS = `${RC_CLASS}__tags`;
const RC_TAG_CLASS = `${RC_CLASS}__tag`;
const RC_FOOTER_CLASS = `${RC_CLASS}__footer`;

const VerifiedCheckIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 14 14");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "인증됨");
  svg.innerHTML = `<path d="M3 7L6 10L11 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />`;
  return svg;
};

export class NdsReviewCard extends NdsElement {
  static elementName = "nds-review-card";

  static get observedAttributes(): readonly string[] {
    return [
      ...COMPONENT_ATTRS["nds-review-card"].observedAttributes,
      "author",
      "meta",
      "rating-label",
      "card-title",
      "body",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _avatarStash: HTMLDivElement | null = null;
  private _footerStash: HTMLDivElement | null = null;
  private _hasFooter = false;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = RC_CLASS;

    // Stash named-slot children before they're orphaned by update().
    const avatarStash = document.createElement("div");
    avatarStash.style.display = "contents";

    const footerStash = document.createElement("div");
    footerStash.dataset.slot = "footer";
    footerStash.className = RC_FOOTER_CLASS;

    Array.from(this.childNodes).forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        node.parentNode?.removeChild(node);
        return;
      }
      const slot = node.getAttribute("slot");
      if (slot === "avatar") {
        avatarStash.appendChild(node);
      } else if (slot === "footer") {
        footerStash.appendChild(node);
        this._hasFooter = true;
      } else {
        node.parentNode?.removeChild(node);
      }
    });

    this.appendChild(root);
    this._root = root;
    this._avatarStash = avatarStash;
    this._footerStash = footerStash;
  }

  protected update(): void {
    if (!this._root || !this._avatarStash || !this._footerStash) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const author = this.getAttribute("author") || "";
    const meta = this.getAttribute("meta");
    const rating = parseFloat(this.attr("rating", "0"));
    const ratingLabel = this.getAttribute("rating-label");
    const title = this.getAttribute("card-title");
    const body = this.getAttribute("body") || "";
    const verified = this.boolAttr("verified");
    const tagsAttr = this.getAttribute("tags");

    let tags: string[] = [];
    if (tagsAttr) {
      try {
        const parsed = JSON.parse(tagsAttr);
        if (Array.isArray(parsed)) tags = parsed.map(String);
      } catch {
        /* ignore */
      }
    }

    const header = document.createElement("div");
    header.className = RC_HEADER_CLASS;

    const authorArea = document.createElement("div");
    authorArea.className = RC_AUTHOR_AREA_CLASS;
    authorArea.appendChild(this._avatarStash);

    const authorInfo = document.createElement("div");
    authorInfo.className = RC_AUTHOR_CLASS;

    const strong = document.createElement("strong");
    strong.textContent = author;
    if (verified) {
      const v = document.createElement("span");
      v.className = RC_VERIFIED_CLASS;
      v.appendChild(VerifiedCheckIcon());
      strong.appendChild(v);
    }
    authorInfo.appendChild(strong);

    if (meta) {
      const metaSpan = document.createElement("span");
      metaSpan.className = RC_META_CLASS;
      metaSpan.textContent = meta;
      authorInfo.appendChild(metaSpan);
    }
    authorArea.appendChild(authorInfo);
    header.appendChild(authorArea);

    const ratingDiv = document.createElement("div");
    ratingDiv.className = RC_RATING_CLASS;
    appendStars(ratingDiv, rating, { size: 14, precision: "half" });
    if (ratingLabel !== null) {
      const labelSpan = document.createElement("span");
      labelSpan.className = `${RC_RATING_CLASS}__label`;
      labelSpan.textContent = ratingLabel;
      ratingDiv.appendChild(labelSpan);
    }
    header.appendChild(ratingDiv);

    const bodyDiv = document.createElement("div");
    bodyDiv.className = RC_BODY_CLASS;
    if (title) {
      const h4 = document.createElement("h4");
      h4.textContent = title;
      bodyDiv.appendChild(h4);
    }
    const bodyP = document.createElement("div");
    bodyP.textContent = body;
    bodyDiv.appendChild(bodyP);

    this._root.replaceChildren(header, bodyDiv);

    if (tags.length > 0) {
      const tagsDiv = document.createElement("div");
      tagsDiv.className = RC_TAGS_CLASS;
      tags.forEach((t) => {
        const span = document.createElement("span");
        span.className = RC_TAG_CLASS;
        span.textContent = `#${t}`;
        tagsDiv.appendChild(span);
      });
      this._root.appendChild(tagsDiv);
    }

    if (this._hasFooter) {
      this._root.appendChild(this._footerStash);
    }
  }
}

define(NdsReviewCard);
