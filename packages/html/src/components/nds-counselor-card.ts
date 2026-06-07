/**
 * <nds-counselor-card> — DS CounselorCard 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-counselor-card
 *     name="김상담"
 *     job-title="임상심리전문가"
 *     image-src="/avatar.jpg"
 *     rating="4.8"
 *     review-count="240"
 *     tags='["우울","불안","직장스트레스"]'
 *     bio="10년 경력의 임상심리전문가입니다."
 *     cta-label="상담 예약"
 *     clickable
 *   ></nds-counselor-card>
 *
 * 이벤트:
 *   nds-counselor-cta -> CTA 버튼 클릭
 *   nds-counselor-card-click -> 카드 전체 클릭 (clickable 일 때)
 */

import { NdsElement, define } from "../base/nds-element.js";

const CN_CLASS = "nds-counselor-card";
const CN_AVATAR_CLASS = `${CN_CLASS}__avatar`;
const CN_BODY_CLASS = `${CN_CLASS}__body`;
const CN_HEADER_CLASS = `${CN_CLASS}__header`;
const CN_NAME_CLASS = `${CN_CLASS}__name`;
const CN_TITLE_CLASS = `${CN_CLASS}__title`;
const CN_RATING_CLASS = `${CN_CLASS}__rating`;
const CN_RATING_VALUE_CLASS = `${CN_CLASS}__rating-value`;
const CN_RATING_COUNT_CLASS = `${CN_CLASS}__rating-count`;
const CN_TAGS_CLASS = `${CN_CLASS}__tags`;
const CN_TAG_CLASS = `${CN_CLASS}__tag`;
const CN_BIO_CLASS = `${CN_CLASS}__bio`;
const CN_FOOTER_CLASS = `${CN_CLASS}__footer`;
const CN_CTA_CLASS = `${CN_CLASS}__cta`;

const StarIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 14 14");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M7 1L8.85 4.75L13 5.35L10 8.27L10.71 12.4L7 10.45L3.29 12.4L4 8.27L1 5.35L5.15 4.75L7 1Z" fill="#FFD54F" stroke="#FFD54F" stroke-width="0.5" stroke-linejoin="round" />`;
  return svg;
};

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((p) => p[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase();

export class NdsCounselorCard extends NdsElement {
  static elementName = "nds-counselor-card";

  static get observedAttributes(): readonly string[] {
    return [
      "name",
      "job-title",
      "image-src",
      "rating",
      "review-count",
      "tags",
      "bio",
      "cta-label",
      "clickable",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _onClick = (_e: MouseEvent) => {
    if (!this.boolAttr("clickable")) return;
    this.dispatchEvent(
      new CustomEvent("nds-counselor-card-click", { bubbles: true, composed: true }),
    );
  };
  private _onKey = (e: KeyboardEvent) => {
    if (!this.boolAttr("clickable")) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.dispatchEvent(
        new CustomEvent("nds-counselor-card-click", { bubbles: true, composed: true }),
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
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = CN_CLASS;
    root.addEventListener("click", this._onClick);
    root.addEventListener("keydown", this._onKey);
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const name = this.getAttribute("name") || "";
    const jobTitle = this.getAttribute("job-title");
    const imageSrc = this.getAttribute("image-src");
    const ratingAttr = this.getAttribute("rating");
    const reviewCountAttr = this.getAttribute("review-count");
    const bio = this.getAttribute("bio");
    const ctaLabel = this.getAttribute("cta-label");
    const clickable = this.boolAttr("clickable");
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

    const avatar = document.createElement("span");
    avatar.dataset.slot = "avatar";
    avatar.className = CN_AVATAR_CLASS;
    avatar.setAttribute("aria-hidden", "true");
    if (imageSrc) {
      const img = document.createElement("img");
      img.src = imageSrc;
      img.alt = "";
      avatar.appendChild(img);
    } else {
      avatar.textContent = initialsOf(name);
    }
    this._root.appendChild(avatar);

    const body = document.createElement("div");
    body.dataset.slot = "body";
    body.className = CN_BODY_CLASS;

    const header = document.createElement("div");
    header.dataset.slot = "header";
    header.className = CN_HEADER_CLASS;

    const nameEl = document.createElement("h3");
    nameEl.dataset.slot = "name";
    nameEl.className = CN_NAME_CLASS;
    nameEl.textContent = name;
    header.appendChild(nameEl);

    if (jobTitle) {
      const titleEl = document.createElement("span");
      titleEl.dataset.slot = "title";
      titleEl.className = CN_TITLE_CLASS;
      titleEl.textContent = jobTitle;
      header.appendChild(titleEl);
    }
    body.appendChild(header);

    if (ratingAttr) {
      const rating = parseFloat(ratingAttr);
      if (!Number.isNaN(rating)) {
        const ratingDiv = document.createElement("div");
        ratingDiv.dataset.slot = "rating";
        ratingDiv.className = CN_RATING_CLASS;
        ratingDiv.appendChild(StarIcon());

        const ratingValue = document.createElement("span");
        ratingValue.dataset.slot = "rating-value";
        ratingValue.className = CN_RATING_VALUE_CLASS;
        ratingValue.textContent = rating.toFixed(1);
        ratingDiv.appendChild(ratingValue);

        if (reviewCountAttr) {
          const reviewCount = parseInt(reviewCountAttr, 10);
          if (!Number.isNaN(reviewCount)) {
            const ratingCount = document.createElement("span");
            ratingCount.dataset.slot = "rating-count";
            ratingCount.className = CN_RATING_COUNT_CLASS;
            ratingCount.textContent = `(${reviewCount.toLocaleString()})`;
            ratingDiv.appendChild(ratingCount);
          }
        }
        body.appendChild(ratingDiv);
      }
    }

    if (tags.length > 0) {
      const tagsDiv = document.createElement("div");
      tagsDiv.dataset.slot = "tags";
      tagsDiv.className = CN_TAGS_CLASS;
      tags.forEach((t) => {
        const tagSpan = document.createElement("span");
        tagSpan.dataset.slot = "tag";
        tagSpan.className = CN_TAG_CLASS;
        tagSpan.textContent = t;
        tagsDiv.appendChild(tagSpan);
      });
      body.appendChild(tagsDiv);
    }

    if (bio) {
      const bioP = document.createElement("p");
      bioP.dataset.slot = "bio";
      bioP.className = CN_BIO_CLASS;
      bioP.textContent = bio;
      body.appendChild(bioP);
    }

    if (ctaLabel) {
      const footer = document.createElement("div");
      footer.dataset.slot = "footer";
      footer.className = CN_FOOTER_CLASS;
      const cta = document.createElement("button");
      cta.type = "button";
      cta.dataset.slot = "cta";
      cta.className = CN_CTA_CLASS;
      cta.textContent = ctaLabel;
      cta.addEventListener("click", (e) => {
        e.stopPropagation();
        this.dispatchEvent(
          new CustomEvent("nds-counselor-cta", {
            bubbles: true,
            composed: true,
          }),
        );
      });
      footer.appendChild(cta);
      body.appendChild(footer);
    }

    this._root.appendChild(body);
  }
}

define(NdsCounselorCard);
