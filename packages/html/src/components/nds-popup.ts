/**
 * <nds-popup> — DS Popup 의 vanilla Web Component 버전 (MVP).
 *
 * 사용:
 *   <nds-popup open title="삭제하시겠습니까?" description="복구할 수 없습니다."
 *     confirm-text="삭제" cancel-text="취소" show-cancel>
 *   </nds-popup>
 *
 * Light DOM 안에 overlay + content 구조를 host 자체에 박는다 (Portal 없음).
 *
 * 이벤트:
 *   popup-confirm    확인 버튼
 *   popup-cancel     취소 버튼 (show-cancel 일 때만 노출)
 *   popup-close      ESC / 오버레이 클릭 / cancel 시
 *
 * Attributes:
 *   open             boolean — 노출 여부
 *   title            제목 텍스트
 *   description      설명 텍스트
 *   confirm-text     기본 "확인"
 *   cancel-text      기본 "취소"
 *   show-cancel      boolean — cancel 버튼 노출
 *   no-mask-close    boolean — 오버레이 클릭으로 닫기 비활성화
 *   max-width        px (콘텐츠 max-width)
 */

import { NdsElement, define } from "../base/nds-element.js";

const POPUP_CLASS = "nds-popup";
const ROOT_CLASS = `${POPUP_CLASS}__root`;
const OVERLAY_CLASS = `${POPUP_CLASS}__overlay`;
const CONTENT_CLASS = `${POPUP_CLASS}__content`;
const TEXT_CLASS = `${POPUP_CLASS}__text`;
const TITLE_CLASS = `${POPUP_CLASS}__title`;
const DESC_CLASS = `${POPUP_CLASS}__description`;
const ACTIONS_CLASS = `${POPUP_CLASS}__actions`;
const BTN_CLASS = `${POPUP_CLASS}__btn`;
const BTN_CANCEL_CLASS = `${POPUP_CLASS}__btn--cancel`;
const BTN_CONFIRM_CLASS = `${POPUP_CLASS}__btn--confirm`;

let nextPopupId = 0;

export class NdsPopup extends NdsElement {
  static elementName = "nds-popup";

  static get observedAttributes(): readonly string[] {
    return [
      "open",
      "title",
      "description",
      "confirm-text",
      "cancel-text",
      "show-cancel",
      "no-mask-close",
      "max-width",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _content: HTMLDivElement | null = null;
  private _onKey = (e: KeyboardEvent) => this._handleKey(e);
  private _titleId = "";
  private _descId = "";

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    document.removeEventListener("keydown", this._onKey, true);
  }

  private _mount(): void {
    const idBase = `nds-popup-${++nextPopupId}`;
    this._titleId = `${idBase}-title`;
    this._descId = `${idBase}-desc`;
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = ROOT_CLASS;
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const open = this.boolAttr("open");
    this._root.dataset.open = open ? "true" : "false";
    this._root.hidden = !open;

    if (open) document.addEventListener("keydown", this._onKey, true);
    else document.removeEventListener("keydown", this._onKey, true);

    this._root.replaceChildren(this._createOverlay(), this._createContent());
  }

  private _createOverlay(): HTMLDivElement {
    const overlay = document.createElement("div");
    overlay.className = OVERLAY_CLASS;
    overlay.dataset.slot = "overlay";
    overlay.addEventListener("click", () => {
      if (this.boolAttr("no-mask-close")) return;
      this._close();
    });
    return overlay;
  }

  private _createContent(): HTMLDivElement {
    const content = document.createElement("div");
    content.className = CONTENT_CLASS;
    content.dataset.slot = "content";
    content.setAttribute("role", "alertdialog");
    content.setAttribute("aria-modal", "true");
    content.setAttribute("aria-labelledby", this._titleId);
    content.setAttribute("aria-describedby", this._descId);
    content.tabIndex = -1;
    content.addEventListener("click", (e) => e.stopPropagation());

    const maxWidth = this.getAttribute("max-width");
    if (maxWidth) content.style.setProperty("--nds-popup-max-width", `${maxWidth}px`);

    const text = document.createElement("div");
    text.className = TEXT_CLASS;
    text.dataset.slot = "text-info";

    const title = this.getAttribute("title");
    if (title) {
      const h3 = document.createElement("h3");
      h3.id = this._titleId;
      h3.className = TITLE_CLASS;
      h3.dataset.slot = "title";
      h3.textContent = title;
      text.appendChild(h3);
    }

    const description = this.getAttribute("description");
    if (description) {
      const p = document.createElement("p");
      p.id = this._descId;
      p.className = DESC_CLASS;
      p.dataset.slot = "description";
      p.textContent = description;
      text.appendChild(p);
    }
    content.appendChild(text);

    content.appendChild(this._createActions());
    this._content = content;
    return content;
  }

  private _createActions(): HTMLDivElement {
    const wrap = document.createElement("div");
    wrap.className = ACTIONS_CLASS;
    wrap.dataset.slot = "actions";
    const showCancel = this.boolAttr("show-cancel");
    wrap.dataset.single = showCancel ? "false" : "true";

    if (showCancel) {
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.className = `${BTN_CLASS} ${BTN_CANCEL_CLASS}`;
      cancel.dataset.slot = "cancel-button";
      cancel.textContent = this.attr("cancel-text", "취소");
      cancel.addEventListener("click", () => this._cancel());
      wrap.appendChild(cancel);
    }

    const confirm = document.createElement("button");
    confirm.type = "button";
    confirm.className = `${BTN_CLASS} ${BTN_CONFIRM_CLASS}`;
    confirm.dataset.slot = "confirm-button";
    confirm.textContent = this.attr("confirm-text", "확인");
    confirm.addEventListener("click", () => this._confirm());
    wrap.appendChild(confirm);

    return wrap;
  }

  private _confirm(): void {
    this.dispatchEvent(new CustomEvent("popup-confirm", { bubbles: true, composed: true }));
  }

  private _cancel(): void {
    this.dispatchEvent(new CustomEvent("popup-cancel", { bubbles: true, composed: true }));
    this._close();
  }

  private _close(): void {
    if (!this.boolAttr("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new CustomEvent("popup-close", { bubbles: true, composed: true }));
  }

  private _handleKey(e: KeyboardEvent): void {
    if (!this.boolAttr("open")) return;
    if (e.key === "Escape") {
      e.preventDefault();
      this._close();
    }
  }
}

define(NdsPopup);
