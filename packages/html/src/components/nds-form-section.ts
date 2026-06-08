/**
 * <nds-form-section> — DS FormSection 의 vanilla Web Component 버전.
 *
 * 사용 예 (캐포비 admin 폼 그룹):
 *   <nds-form-section title="기본 정보">
 *     <nds-form-field label="계정명" density="admin" label-position="left">
 *       <nds-input placeholder="입력해 주세요"></nds-input>
 *     </nds-form-field>
 *     <nds-form-field label="담당자" density="admin" label-position="left">
 *       <nds-input placeholder="입력해 주세요"></nds-input>
 *     </nds-form-field>
 *   </nds-form-section>
 *
 * children 은 body slot(카드) 으로 이동한다 (한 번만 이동, 이후 update 에서는 header chrome 만 다시 그림).
 */

import { NdsElement, define } from "../base/nds-element.js";

const FS_CLASS = "nds-form-section";
const FS_ROOT_CLASS = `${FS_CLASS}__root`;
const FS_HEADER_CLASS = `${FS_CLASS}__header`;
const FS_TITLE_CLASS = `${FS_CLASS}__title`;
const FS_DESC_CLASS = `${FS_CLASS}__description`;
const FS_BODY_CLASS = `${FS_CLASS}__body`;

export class NdsFormSection extends NdsElement {
  static elementName = "nds-form-section";

  static get observedAttributes(): readonly string[] {
    return ["title", "description"];
  }

  private _root: HTMLElement | null = null;
  private _body: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("section");
    root.dataset.slot = "root";
    root.className = FS_ROOT_CLASS;

    const body = document.createElement("div");
    body.dataset.slot = "body";
    body.className = FS_BODY_CLASS;
    while (this.firstChild) body.appendChild(this.firstChild);

    root.appendChild(body);
    this.appendChild(root);
    this._root = root;
    this._body = body;
  }

  protected update(): void {
    if (!this._root || !this._body) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const title = this.getAttribute("title");
    const description = this.getAttribute("description");

    // Remove existing header (everything except the body stash), then rebuild.
    Array.from(this._root.children).forEach((child) => {
      if (child !== this._body) child.remove();
    });

    if (title || description) {
      const header = document.createElement("div");
      header.dataset.slot = "header";
      header.className = FS_HEADER_CLASS;

      if (title) {
        const titleEl = document.createElement("h3");
        titleEl.dataset.slot = "title";
        titleEl.className = FS_TITLE_CLASS;
        titleEl.textContent = title;
        header.appendChild(titleEl);
      }
      if (description) {
        const descEl = document.createElement("p");
        descEl.dataset.slot = "description";
        descEl.className = FS_DESC_CLASS;
        descEl.textContent = description;
        header.appendChild(descEl);
      }
      this._root.insertBefore(header, this._body);
    }
  }
}

define(NdsFormSection);
