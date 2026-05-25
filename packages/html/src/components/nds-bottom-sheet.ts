/**
 * <nds-bottom-sheet> — DS BottomSheet 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-bottom-sheet open sheet-title="옵션" show-handle close-on-overlay-click>
 *     <p>본문 콘텐츠</p>
 *     <button slot="footer">확인</button>
 *   </nds-bottom-sheet>
 *
 * 이벤트:
 *   nds-bottom-sheet-close -> 닫기 시도 (overlay 클릭 / 닫기 버튼 / ESC).
 *     부모는 open 속성을 false 로 바꿔야 한다.
 *
 * 속성:
 *   open: 표시 여부
 *   sheet-title: 헤더 타이틀
 *   show-handle: 상단 드래그 핸들 노출 (default true)
 *   show-close-button: 닫기 X (default true)
 *   close-on-overlay-click: 오버레이 클릭 닫기 (default true)
 *   close-on-esc: ESC 키 닫기 (default true)
 *
 * children:
 *   slot="footer" — 푸터 영역 (CTA 버튼 등)
 *   그 외 — body
 */

import { NdsElement, define } from "../base/nds-element.js";

const BS_CLASS = "nds-bottom-sheet";
const BS_ROOT_CLASS = `${BS_CLASS}__root`;
const BS_OVERLAY_CLASS = `${BS_CLASS}__overlay`;
const BS_CONTENT_CLASS = `${BS_CLASS}__content`;
const BS_HANDLE_CLASS = `${BS_CLASS}__handle`;
const BS_HEADER_CLASS = `${BS_CLASS}__header`;
const BS_HEADER_TITLE_CLASS = `${BS_CLASS}__header-title`;
const BS_CLOSE_CLASS = `${BS_CLASS}__close`;
const BS_BODY_CLASS = `${BS_CLASS}__body`;
const BS_FOOTER_CLASS = `${BS_CLASS}__footer`;

export class NdsBottomSheet extends NdsElement {
  static elementName = "nds-bottom-sheet";

  static get observedAttributes(): readonly string[] {
    return [
      "open",
      "sheet-title",
      "show-handle",
      "show-close-button",
      "close-on-overlay-click",
      "close-on-esc",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _content: HTMLDivElement | null = null;
  private _handle: HTMLDivElement | null = null;
  private _header: HTMLDivElement | null = null;
  private _headerTitle: HTMLHeadingElement | null = null;
  private _closeBtn: HTMLButtonElement | null = null;
  private _body: HTMLDivElement | null = null;
  private _footer: HTMLDivElement | null = null;
  private _hasFooterContent = false;
  private _prevOverflow = "";

  private _onEsc = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    if (!this.boolAttr("open")) return;
    if (this.attr("close-on-esc", "true") === "false") return;
    this._emitClose();
  };

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
    document.addEventListener("keydown", this._onEsc);
  }

  override disconnectedCallback(): void {
    document.removeEventListener("keydown", this._onEsc);
    document.body.style.overflow = this._prevOverflow;
  }

  private _emitClose(): void {
    this.dispatchEvent(
      new CustomEvent("nds-bottom-sheet-close", { bubbles: true, composed: true }),
    );
  }

  private _mount(): void {
    const body = document.createElement("div");
    body.dataset.slot = "body";
    body.className = BS_BODY_CLASS;

    const footer = document.createElement("div");
    footer.dataset.slot = "footer";
    footer.className = BS_FOOTER_CLASS;

    Array.from(this.childNodes).forEach((node) => {
      if (node instanceof HTMLElement && node.getAttribute("slot") === "footer") {
        footer.appendChild(node);
        this._hasFooterContent = true;
      } else {
        body.appendChild(node);
      }
    });

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = BS_ROOT_CLASS;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");

    const overlay = document.createElement("div");
    overlay.dataset.slot = "overlay";
    overlay.className = BS_OVERLAY_CLASS;
    overlay.addEventListener("click", () => {
      if (this.attr("close-on-overlay-click", "true") === "false") return;
      this._emitClose();
    });

    const content = document.createElement("div");
    content.dataset.slot = "content";
    content.className = BS_CONTENT_CLASS;

    const handle = document.createElement("div");
    handle.dataset.slot = "handle";
    handle.className = BS_HANDLE_CLASS;
    handle.setAttribute("aria-hidden", "true");

    const header = document.createElement("div");
    header.dataset.slot = "header";
    header.className = BS_HEADER_CLASS;

    const headerTitle = document.createElement("h2");
    headerTitle.className = BS_HEADER_TITLE_CLASS;

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.dataset.slot = "close";
    closeBtn.className = BS_CLOSE_CLASS;
    closeBtn.setAttribute("aria-label", "닫기");
    closeBtn.innerHTML = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    closeBtn.addEventListener("click", () => this._emitClose());

    header.append(headerTitle, closeBtn);

    content.append(handle, header, body);
    if (this._hasFooterContent) content.appendChild(footer);

    root.append(overlay, content);
    this.appendChild(root);

    this._root = root;
    this._content = content;
    this._handle = handle;
    this._header = header;
    this._headerTitle = headerTitle;
    this._closeBtn = closeBtn;
    this._body = body;
    this._footer = footer;
  }

  protected update(): void {
    if (
      !this._root ||
      !this._content ||
      !this._handle ||
      !this._header ||
      !this._headerTitle ||
      !this._closeBtn
    ) {
      return;
    }
    if (this.style.display !== "contents") this.style.display = "contents";

    const open = this.boolAttr("open");
    const title = this.getAttribute("sheet-title");
    const showHandle = this.attr("show-handle", "true") !== "false";
    const showCloseButton = this.attr("show-close-button", "true") !== "false";

    if (open) {
      this._root.style.display = "";
      if (document.body.style.overflow !== "hidden") {
        this._prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      }
    } else {
      this._root.style.display = "none";
      document.body.style.overflow = this._prevOverflow;
    }

    this._handle.style.display = showHandle ? "" : "none";

    if (title) {
      this._headerTitle.textContent = title;
      this._headerTitle.style.display = "";
    } else {
      this._headerTitle.style.display = "none";
    }

    this._closeBtn.style.display = showCloseButton ? "" : "none";

    // Hide entire header row when nothing inside.
    const headerEmpty = !title && !showCloseButton;
    this._header.style.display = headerEmpty ? "none" : "";
  }
}

define(NdsBottomSheet);
