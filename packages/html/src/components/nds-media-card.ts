/**
 * <nds-media-card> — DS MediaCard 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-media-card
 *     image-src="/cover.jpg"
 *     image-alt="콘텐츠 커버"
 *     image-overlay="02:13"
 *     eyebrow="Trost Talk"
 *     card-title="우울감을 다루는 5가지 방법"
 *     body="우울감의 신호를 알아차리고 대처하는 방법을 정리했습니다."
 *     rating="4.5"
 *     clickable
 *   >
 *     <span slot="footer">박상담</span>
 *   </nds-media-card>
 *
 * 이벤트:
 *   nds-media-card-click -> 카드 클릭 (clickable 일 때)
 *
 * children:
 *   slot="image"  — 커스텀 이미지/플레이스홀더 (image-src 우선)
 *   slot="footer" — 푸터 영역 (작성자/메타 등)
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";
import { appendStars } from "../base/star-icons.js";

const MC_CLASS = "nds-media-card";
const MC_MEDIA_CLASS = `${MC_CLASS}__media`;
const MC_MEDIA_INNER_CLASS = `${MC_CLASS}__media-inner`;
const MC_OVERLAY_CLASS = `${MC_CLASS}__overlay`;
const MC_BODY_CLASS = `${MC_CLASS}__body`;
const MC_EYEBROW_CLASS = `${MC_CLASS}__eyebrow`;
const MC_TITLE_CLASS = `${MC_CLASS}__title`;
const MC_BODY_TEXT_CLASS = `${MC_CLASS}__body-text`;
const MC_RATING_CLASS = `${MC_CLASS}__rating`;
const MC_FOOTER_CLASS = `${MC_CLASS}__footer`;


export class NdsMediaCard extends NdsElement {
  static elementName = "nds-media-card";

  static get observedAttributes(): readonly string[] {
    return [
      ...COMPONENT_ATTRS["nds-media-card"].observedAttributes,
      "image-src",
      "image-alt",
      "image-overlay",
      "eyebrow",
      "card-title",
      "body",
      "clickable",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _mediaInner: HTMLDivElement | null = null;
  private _imageStash: HTMLElement | null = null;
  private _footerStash: DocumentFragment | null = null;
  private _hasFooterStash = false;
  private _onClick = () => {
    if (!this.boolAttr("clickable")) return;
    this.dispatchEvent(new CustomEvent("nds-media-card-click", { bubbles: true, composed: true }));
  };
  private _onKey = (e: KeyboardEvent) => {
    if (!this.boolAttr("clickable")) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent("nds-media-card-click", { bubbles: true, composed: true }),
      );
    }
  };

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    if (this._root) {
      this._root.removeEventListener("click", this._onClick);
      this._root.removeEventListener("keydown", this._onKey);
    }
  }

  private _mount(): void {
    let imageStash: HTMLElement | null = null;
    const footerStash = document.createDocumentFragment();
    Array.from(this.childNodes).forEach((node) => {
      if (node instanceof HTMLElement) {
        const slot = node.getAttribute("slot");
        if (slot === "image") imageStash = node;
        else if (slot === "footer") {
          footerStash.appendChild(node);
          this._hasFooterStash = true;
        }
      }
      node.parentNode?.removeChild(node);
    });
    this._imageStash = imageStash;
    this._footerStash = footerStash;

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = MC_CLASS;
    root.addEventListener("click", this._onClick);
    root.addEventListener("keydown", this._onKey);
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const imageSrc = this.getAttribute("image-src");
    const imageAlt = this.getAttribute("image-alt") || "";
    const overlay = this.getAttribute("image-overlay");
    const aspect = this.getAttribute("image-aspect-ratio") || "4 / 3";
    const eyebrow = this.getAttribute("eyebrow");
    const title = this.getAttribute("card-title") || "";
    const body = this.getAttribute("body");
    const ratingAttr = this.getAttribute("rating");
    const clickable = this.boolAttr("clickable");

    if (clickable) {
      this._root.dataset.clickable = "true";
      this._root.setAttribute("role", "button");
      this._root.setAttribute("tabindex", "0");
    } else {
      delete this._root.dataset.clickable;
      this._root.removeAttribute("role");
      this._root.removeAttribute("tabindex");
    }

    this._root.innerHTML = "";

    const media = document.createElement("div");
    media.dataset.slot = "media";
    media.className = MC_MEDIA_CLASS;
    media.style.aspectRatio = aspect;

    const mediaInner = document.createElement("div");
    mediaInner.className = MC_MEDIA_INNER_CLASS;
    if (imageSrc) {
      const img = document.createElement("img");
      img.src = imageSrc;
      img.alt = imageAlt;
      mediaInner.appendChild(img);
    } else if (this._imageStash) {
      mediaInner.appendChild(this._imageStash);
    }
    media.appendChild(mediaInner);

    if (overlay !== null) {
      const overlaySpan = document.createElement("span");
      overlaySpan.dataset.slot = "overlay";
      overlaySpan.className = MC_OVERLAY_CLASS;
      overlaySpan.textContent = overlay;
      media.appendChild(overlaySpan);
    }
    this._root.appendChild(media);
    this._mediaInner = mediaInner;

    const bodyDiv = document.createElement("div");
    bodyDiv.dataset.slot = "body";
    bodyDiv.className = MC_BODY_CLASS;

    if (eyebrow) {
      const eyebrowEl = document.createElement("span");
      eyebrowEl.dataset.slot = "eyebrow";
      eyebrowEl.className = MC_EYEBROW_CLASS;
      eyebrowEl.textContent = eyebrow;
      bodyDiv.appendChild(eyebrowEl);
    }

    const titleEl = document.createElement("h3");
    titleEl.dataset.slot = "title";
    titleEl.className = MC_TITLE_CLASS;
    titleEl.textContent = title;
    bodyDiv.appendChild(titleEl);

    if (body) {
      const bodyText = document.createElement("p");
      bodyText.dataset.slot = "body-text";
      bodyText.className = MC_BODY_TEXT_CLASS;
      bodyText.textContent = body;
      bodyDiv.appendChild(bodyText);
    }

    const rating = ratingAttr !== null ? parseFloat(ratingAttr) : NaN;
    const hasRating = !Number.isNaN(rating);
    if (hasRating || this._hasFooterStash) {
      const footer = document.createElement("div");
      footer.dataset.slot = "footer";
      footer.className = MC_FOOTER_CLASS;

      if (this._hasFooterStash && this._footerStash) {
        // Clone so we can re-render across updates.
        footer.appendChild(this._footerStash.cloneNode(true));
      }
      if (hasRating) {
        const ratingSpan = document.createElement("span");
        ratingSpan.dataset.slot = "rating";
        ratingSpan.className = MC_RATING_CLASS;
        ratingSpan.setAttribute("aria-label", `평점 ${rating.toFixed(1)} / 5`);
        appendStars(ratingSpan, rating, { size: 14, precision: "half" });
        footer.appendChild(ratingSpan);
      }
      bodyDiv.appendChild(footer);
    }

    this._root.appendChild(bodyDiv);
  }
}

define(NdsMediaCard);
