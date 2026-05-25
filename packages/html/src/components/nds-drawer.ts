/**
 * <nds-drawer> — DS Drawer 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-drawer open side="right" drawer-title="상세 정보">
 *     <div>콘텐츠 영역</div>
 *     <button slot="footer">확인</button>
 *   </nds-drawer>
 *
 * 이벤트:
 *   nds-drawer-close -> 닫기 시도 (overlay click / esc / close button).
 *
 * 속성:
 *   open: 열림 상태
 *   side: "left" | "right" (default "right")
 *   size: "sm" | "md" | "lg"
 *   width: 직접 px 지정
 *   drawer-title / description: 헤더
 *   close-on-overlay-click: "false" 면 비활성화 (default true)
 *   close-on-esc: 동상 (default true)
 *   show-close-button: "false" 면 X 버튼 숨김 (default true)
 *
 * children 중 slot="footer" 는 자동으로 footer 영역으로 분리. 그 외는 body.
 */

import { NdsElement, define } from "../base/nds-element.js";

const DR_CLASS = "nds-drawer";
const DR_ROOT_CLASS = `${DR_CLASS}__root`;
const DR_OVERLAY_CLASS = `${DR_CLASS}__overlay`;
const DR_CONTENT_CLASS = `${DR_CLASS}__content`;
const DR_HEADER_CLASS = `${DR_CLASS}__header`;
const DR_HEADER_TITLE_CLASS = `${DR_CLASS}__header-title`;
const DR_HEADER_DESC_CLASS = `${DR_CLASS}__header-desc`;
const DR_CLOSE_CLASS = `${DR_CLASS}__close`;
const DR_BODY_CLASS = `${DR_CLASS}__body`;
const DR_FOOTER_CLASS = `${DR_CLASS}__footer`;

export type DrawerSide = "left" | "right";
export type DrawerSize = "sm" | "md" | "lg";

const sizePx: Record<DrawerSize, number> = {
  sm: 320,
  md: 400,
  lg: 520,
};

export class NdsDrawer extends NdsElement {
  static elementName = "nds-drawer";

  static get observedAttributes(): readonly string[] {
    return [
      "open",
      "side",
      "size",
      "width",
      "drawer-title",
      "description",
      "close-on-overlay-click",
      "close-on-esc",
      "show-close-button",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _content: HTMLDivElement | null = null;
  private _body: HTMLDivElement | null = null;
  private _footer: HTMLDivElement | null = null;
  private _hasFooterContent = false;
  private _handleEsc = (e: KeyboardEvent) => {
    if (
      e.key === "Escape" &&
      this.boolAttr("open") &&
      this.attr("close-on-esc", "true") !== "false"
    ) {
      this._onClose();
    }
  };

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
    document.addEventListener("keydown", this._handleEsc);
  }

  override disconnectedCallback(): void {
    document.removeEventListener("keydown", this._handleEsc);
    document.body.style.removeProperty("overflow");
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = DR_ROOT_CLASS;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");

    const overlay = document.createElement("div");
    overlay.dataset.slot = "overlay";
    overlay.className = DR_OVERLAY_CLASS;
    overlay.addEventListener("click", () => {
      if (this.attr("close-on-overlay-click", "true") !== "false") {
        this._onClose();
      }
    });

    const content = document.createElement("div");
    content.dataset.slot = "content";
    content.className = DR_CONTENT_CLASS;

    const body = document.createElement("div");
    body.dataset.slot = "body";
    body.className = DR_BODY_CLASS;

    const footer = document.createElement("div");
    footer.dataset.slot = "footer";
    footer.className = DR_FOOTER_CLASS;

    // Partition initial children into body vs footer by slot attribute.
    const initialChildren = Array.from(this.childNodes);
    initialChildren.forEach((node) => {
      if (node instanceof HTMLElement && node.getAttribute("slot") === "footer") {
        footer.appendChild(node);
        this._hasFooterContent = true;
      } else {
        body.appendChild(node);
      }
    });

    content.appendChild(body);
    if (this._hasFooterContent) content.appendChild(footer);

    root.append(overlay, content);
    this.appendChild(root);

    this._root = root;
    this._content = content;
    this._body = body;
    this._footer = footer;
  }

  private _onClose(): void {
    this.dispatchEvent(new CustomEvent("nds-drawer-close", { bubbles: true, composed: true }));
  }

  protected update(): void {
    if (!this._root || !this._content || !this._body) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const open = this.boolAttr("open");
    const side = (this.getAttribute("side") as DrawerSide) || "right";
    const size = (this.getAttribute("size") as DrawerSize) || "md";
    const width = this.getAttribute("width");
    const title = this.getAttribute("drawer-title");
    const description = this.getAttribute("description");
    const showCloseButton = this.attr("show-close-button", "true") !== "false";

    this._root.style.display = open ? "" : "none";
    this._root.dataset.side = side;

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.removeProperty("overflow");
    }

    const resolvedWidth = width ? `${width}px` : `${sizePx[size]}px`;
    this._content.style.setProperty("--nds-drawer-width", resolvedWidth);

    // Rebuild header but preserve body/footer (which contain user content).
    const existingHeader = this._content.querySelector(`.${DR_HEADER_CLASS}`);
    if (existingHeader) existingHeader.remove();

    if (title || description || showCloseButton) {
      const header = document.createElement("div");
      header.dataset.slot = "header";
      header.className = DR_HEADER_CLASS;
      header.dataset.empty = String(!title && !description);

      const titleArea = document.createElement("div");
      titleArea.style.flex = "1";
      titleArea.style.minWidth = "0";

      if (title) {
        const h2 = document.createElement("h2");
        h2.dataset.slot = "title";
        h2.className = DR_HEADER_TITLE_CLASS;
        h2.textContent = title;
        titleArea.appendChild(h2);
      }

      if (description) {
        const p = document.createElement("p");
        p.dataset.slot = "description";
        p.className = DR_HEADER_DESC_CLASS;
        p.textContent = description;
        titleArea.appendChild(p);
      }

      header.appendChild(titleArea);

      if (showCloseButton) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.dataset.slot = "close";
        btn.className = DR_CLOSE_CLASS;
        btn.setAttribute("aria-label", "닫기");
        btn.innerHTML = `<svg viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>`;
        btn.addEventListener("click", () => this._onClose());
        header.appendChild(btn);
      }
      this._content.insertBefore(header, this._body);
    }
  }
}

define(NdsDrawer);
