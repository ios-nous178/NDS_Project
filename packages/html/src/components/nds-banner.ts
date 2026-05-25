/**
 * <nds-banner> — DS Banner 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-banner variant="filled" banner-title="공지사항" description="새로운 기능"></nds-banner>
 *
 * 속성:
 *   variant: "filled" | "outlined" | "image"
 *   banner-title: 제목 (HTML 표준 `title` 과 충돌 회피)
 *   description: 본문
 *   action-label / action-href: 액션 버튼/링크
 *   image-src / image-alt / image-width / image-height: 사이드 이미지
 *   full-image-src / full-image-srcset: variant="image" 일 때 전체 이미지
 *   href: 배너 전체를 navigate 트리거로
 *   closable: 닫기 버튼 노출
 *
 * 이벤트 (bubbles: true, composed: true, detail.href 포함):
 *   nds-banner-navigate -> 루트 클릭 (href 있을 때)
 *   nds-banner-action   -> 액션 클릭
 *   nds-banner-close    -> 닫기 클릭 (DOM 에서 제거됨)
 */

import { NdsElement, define } from "../base/nds-element.js";

const BN_CLASS = "nds-banner";
const BN_CONTENT_CLASS = `${BN_CLASS}__content`;
const BN_TITLE_CLASS = `${BN_CLASS}__title`;
const BN_DESC_CLASS = `${BN_CLASS}__description`;
const BN_ACTION_CLASS = `${BN_CLASS}__action`;
const BN_IMAGE_CLASS = `${BN_CLASS}__image`;
const BN_CLOSE_CLASS = `${BN_CLASS}__close`;

export type BannerVariant = "filled" | "outlined" | "image";

const ChevronRight = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("fill", "none");
  svg.innerHTML = `<path d="M7.5 4L13.5 10L7.5 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`;
  return svg;
};

const CloseIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("fill", "none");
  svg.innerHTML = `<path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />`;
  return svg;
};

export class NdsBanner extends NdsElement {
  static elementName = "nds-banner";

  static get observedAttributes(): readonly string[] {
    return [
      "variant",
      "banner-title",
      "description",
      "action-label",
      "action-href",
      "image-src",
      "image-alt",
      "image-width",
      "image-height",
      "href",
      "closable",
      "full-image-src",
      "full-image-srcset",
    ];
  }

  private _root: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = BN_CLASS;

    root.addEventListener("click", () => {
      const href = this.getAttribute("href");
      if (!href) return;
      this.dispatchEvent(
        new CustomEvent("nds-banner-navigate", {
          detail: { href },
          bubbles: true,
          composed: true,
        }),
      );
    });

    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const variant = (this.getAttribute("variant") as BannerVariant) || "filled";
    const title = this.getAttribute("banner-title");
    const description = this.getAttribute("description");
    const actionLabel = this.getAttribute("action-label");
    const actionHref = this.getAttribute("action-href");
    const imageSrc = this.getAttribute("image-src");
    const imageAlt = this.getAttribute("image-alt") || "";
    const imageWidth = this.getAttribute("image-width");
    const imageHeight = this.getAttribute("image-height");
    const href = this.getAttribute("href");
    const closable = this.boolAttr("closable");
    const fullImageSrc = this.getAttribute("full-image-src");
    const fullImageSrcset = this.getAttribute("full-image-srcset");

    const isClickable = !!href;
    this._root.dataset.variant = variant;
    this._root.dataset.clickable = String(isClickable);
    if (isClickable) this._root.setAttribute("role", "link");
    else this._root.removeAttribute("role");

    this._root.innerHTML = "";

    if (variant === "image") {
      if (fullImageSrc || fullImageSrcset) {
        const img = document.createElement("img");
        img.className = BN_IMAGE_CLASS;
        if (fullImageSrc) img.src = fullImageSrc;
        if (fullImageSrcset) img.srcset = fullImageSrcset;
        img.alt = imageAlt;
        img.loading = "lazy";
        this._root.appendChild(img);
      }
    } else {
      const content = document.createElement("div");
      content.dataset.slot = "content";
      content.className = BN_CONTENT_CLASS;

      if (title) {
        const titleDiv = document.createElement("div");
        titleDiv.dataset.slot = "title";
        titleDiv.className = BN_TITLE_CLASS;
        titleDiv.textContent = title;
        content.appendChild(titleDiv);
      }

      if (description) {
        const descDiv = document.createElement("div");
        descDiv.dataset.slot = "description";
        descDiv.className = BN_DESC_CLASS;
        descDiv.textContent = description;
        content.appendChild(descDiv);
      }

      if (actionLabel) {
        if (actionHref) {
          const a = document.createElement("a");
          a.dataset.slot = "action";
          a.className = BN_ACTION_CLASS;
          a.href = actionHref;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = actionLabel;
          a.appendChild(ChevronRight());
          a.addEventListener("click", (e) => {
            e.stopPropagation();
            this.dispatchEvent(
              new CustomEvent("nds-banner-action", {
                detail: { href: actionHref },
                bubbles: true,
                composed: true,
              }),
            );
          });
          content.appendChild(a);
        } else {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.dataset.slot = "action";
          btn.className = BN_ACTION_CLASS;
          btn.textContent = actionLabel;
          btn.appendChild(ChevronRight());
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.dispatchEvent(
              new CustomEvent("nds-banner-action", {
                detail: { href: null },
                bubbles: true,
                composed: true,
              }),
            );
          });
          content.appendChild(btn);
        }
      }

      this._root.appendChild(content);

      if (imageSrc) {
        const img = document.createElement("img");
        img.dataset.slot = "image";
        img.className = BN_IMAGE_CLASS;
        img.src = imageSrc;
        img.alt = imageAlt;
        if (imageWidth) img.setAttribute("width", imageWidth);
        if (imageHeight) img.setAttribute("height", imageHeight);
        this._root.appendChild(img);
      }
    }

    if (closable) {
      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.dataset.slot = "close";
      closeBtn.className = BN_CLOSE_CLASS;
      closeBtn.setAttribute("aria-label", "닫기");
      closeBtn.appendChild(CloseIcon());
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.dispatchEvent(
          new CustomEvent("nds-banner-close", {
            bubbles: true,
            composed: true,
          }),
        );
        this.remove();
      });
      this._root.appendChild(closeBtn);
    }
  }
}

define(NdsBanner);
