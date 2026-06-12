/**
 * <nds-user-card> — DS UserCard 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-user-card
 *     name="홍길동"
 *     handle="@hong"
 *     bio="EAP 컨설턴트입니다"
 *     meta="팔로워 1.2K"
 *     verified
 *     layout="row"
 *     clickable
 *   >
 *     <nds-avatar slot="avatar" src="/me.jpg"></nds-avatar>
 *     <nds-button slot="action">팔로우</nds-button>
 *   </nds-user-card>
 *
 * 이벤트:
 *   nds-user-card-click -> 카드 클릭 (clickable). action 클릭은 stopPropagation.
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const UC_CLASS = "nds-user-card";
const UC_AVATAR_CLASS = `${UC_CLASS}__avatar`;
const UC_BODY_CLASS = `${UC_CLASS}__body`;
const UC_NAME_CLASS = `${UC_CLASS}__name`;
const UC_VERIFIED_CLASS = `${UC_CLASS}__verified`;
const UC_HANDLE_CLASS = `${UC_CLASS}__handle`;
const UC_BIO_CLASS = `${UC_CLASS}__bio`;
const UC_META_CLASS = `${UC_CLASS}__meta`;
const UC_ACTION_CLASS = `${UC_CLASS}__action`;

export type UserCardLayout = "row" | "stacked";

const VerifiedCheckIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 14 14");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "인증됨");
  svg.innerHTML = `<path d="M3 7L6 10L11 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  return svg;
};

export class NdsUserCard extends NdsElement {
  static elementName = "nds-user-card";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-user-card"].observedAttributes, "name", "handle", "bio", "meta", "clickable"];
  }

  private _root: HTMLDivElement | null = null;
  private _avatarWrap: HTMLDivElement | null = null;
  private _body: HTMLDivElement | null = null;
  private _nameEl: HTMLParagraphElement | null = null;
  private _verifiedSpan: HTMLSpanElement | null = null;
  private _handleEl: HTMLSpanElement | null = null;
  private _bioEl: HTMLParagraphElement | null = null;
  private _metaEl: HTMLSpanElement | null = null;
  private _actionWrap: HTMLDivElement | null = null;
  private _hasAvatar = false;
  private _hasAction = false;

  private _onClick = () => {
    if (!this.boolAttr("clickable")) return;
    this.dispatchEvent(new CustomEvent("nds-user-card-click", { bubbles: true, composed: true }));
  };
  private _onKey = (e: KeyboardEvent) => {
    if (!this.boolAttr("clickable")) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.dispatchEvent(new CustomEvent("nds-user-card-click", { bubbles: true, composed: true }));
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
    const avatarStash: Node[] = [];
    const actionStash: Node[] = [];
    Array.from(this.childNodes).forEach((node) => {
      if (node instanceof HTMLElement) {
        const slot = node.getAttribute("slot");
        if (slot === "avatar") avatarStash.push(node);
        else if (slot === "action") actionStash.push(node);
      }
      node.parentNode?.removeChild(node);
    });
    this._hasAvatar = avatarStash.length > 0;
    this._hasAction = actionStash.length > 0;

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = UC_CLASS;
    root.addEventListener("click", this._onClick);
    root.addEventListener("keydown", this._onKey);

    const avatarWrap = document.createElement("div");
    avatarWrap.className = UC_AVATAR_CLASS;
    avatarStash.forEach((n) => avatarWrap.appendChild(n));

    const body = document.createElement("div");
    body.className = UC_BODY_CLASS;

    const nameEl = document.createElement("p");
    nameEl.className = UC_NAME_CLASS;

    const verifiedSpan = document.createElement("span");
    verifiedSpan.className = UC_VERIFIED_CLASS;
    verifiedSpan.appendChild(VerifiedCheckIcon());

    const handleEl = document.createElement("span");
    handleEl.className = UC_HANDLE_CLASS;

    const bioEl = document.createElement("p");
    bioEl.className = UC_BIO_CLASS;

    const metaEl = document.createElement("span");
    metaEl.className = UC_META_CLASS;

    body.append(nameEl, handleEl, bioEl, metaEl);

    const actionWrap = document.createElement("div");
    actionWrap.className = UC_ACTION_CLASS;
    actionWrap.addEventListener("click", (e) => e.stopPropagation());
    actionStash.forEach((n) => actionWrap.appendChild(n));

    if (this._hasAvatar) root.appendChild(avatarWrap);
    root.appendChild(body);
    if (this._hasAction) root.appendChild(actionWrap);
    this.appendChild(root);

    this._root = root;
    this._avatarWrap = avatarWrap;
    this._body = body;
    this._nameEl = nameEl;
    this._verifiedSpan = verifiedSpan;
    this._handleEl = handleEl;
    this._bioEl = bioEl;
    this._metaEl = metaEl;
    this._actionWrap = actionWrap;
  }

  protected update(): void {
    if (
      !this._root ||
      !this._nameEl ||
      !this._verifiedSpan ||
      !this._handleEl ||
      !this._bioEl ||
      !this._metaEl
    ) {
      return;
    }
    if (this.style.display !== "contents") this.style.display = "contents";

    const name = this.getAttribute("name") || "";
    const handle = this.getAttribute("handle");
    const bio = this.getAttribute("bio");
    const meta = this.getAttribute("meta");
    const verified = this.boolAttr("verified");
    const layout = (this.getAttribute("layout") as UserCardLayout) || "row";
    const clickable = this.boolAttr("clickable");

    this._root.dataset.layout = layout;
    this._root.dataset.clickable = clickable ? "true" : "false";

    if (clickable) {
      this._root.setAttribute("role", "button");
      this._root.setAttribute("tabindex", "0");
    } else {
      this._root.removeAttribute("role");
      this._root.removeAttribute("tabindex");
    }

    this._nameEl.textContent = name;
    if (verified && !this._verifiedSpan.parentNode) {
      this._nameEl.appendChild(this._verifiedSpan);
    } else if (!verified && this._verifiedSpan.parentNode) {
      this._verifiedSpan.remove();
    }

    if (handle) {
      this._handleEl.textContent = handle;
      this._handleEl.style.display = "";
    } else {
      this._handleEl.style.display = "none";
    }
    if (bio) {
      this._bioEl.textContent = bio;
      this._bioEl.style.display = "";
    } else {
      this._bioEl.style.display = "none";
    }
    if (meta) {
      this._metaEl.textContent = meta;
      this._metaEl.style.display = "";
    } else {
      this._metaEl.style.display = "none";
    }
  }
}

define(NdsUserCard);
