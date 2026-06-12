/**
 * <nds-file-upload> — DS FileUpload 의 vanilla Web Component 버전.
 *
 * 파일은 host 가 내부 상태로 들고 있고, change 이벤트로 알린다 (React 의 controlled
 * 모델은 vanilla 에서는 부담스러워서 uncontrolled-with-events 패턴).
 *
 * 사용 패턴:
 *   <nds-file-upload accept="image/*" multiple max-size="10485760"
 *     description="PDF, JPG, PNG · 최대 10MB"></nds-file-upload>
 *
 * 이벤트:
 *   files-change (detail: { files: File[] }) — 파일 추가/제거
 *   files-reject (detail: { files: File[], reason: "size" | "accept" }) — 거부
 *
 * 속성:
 *   accept: input accept
 *   multiple: 다중 선택
 *   max-size: 파일당 최대 byte (초과 시 거부)
 *   disabled
 *   hint: 본문 텍스트
 *   description: 보조 텍스트
 *   error-message: 에러 메시지
 */

import { NdsElement, define } from "../base/nds-element.js";

const FU_CLASS = "nds-file-upload";
const FU_ROOT_CLASS = `${FU_CLASS}__root`;
const FU_DROP_CLASS = `${FU_CLASS}__drop`;
const FU_HIDDEN_INPUT_CLASS = `${FU_CLASS}__input`;
const FU_ICON_CLASS = `${FU_CLASS}__icon`;
const FU_TEXT_CLASS = `${FU_CLASS}__text`;
const FU_HINT_CLASS = `${FU_CLASS}__hint`;
const FU_LIST_CLASS = `${FU_CLASS}__list`;
const FU_ITEM_CLASS = `${FU_CLASS}__item`;
const FU_ITEM_NAME_CLASS = `${FU_CLASS}__item-name`;
const FU_ITEM_SIZE_CLASS = `${FU_CLASS}__item-size`;
const FU_REMOVE_CLASS = `${FU_CLASS}__remove`;
const FU_ERROR_CLASS = `${FU_CLASS}__error`;

const fmtSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

const UploadSvg = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "32");
  svg.setAttribute("height", "32");
  svg.setAttribute("viewBox", "0 0 32 32");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <path d="M16 22V8M16 8L10 14M16 8L22 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6 22V25C6 26.1046 6.89543 27 8 27H24C25.1046 27 26 26.1046 26 25V22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  `;
  return svg;
};

const RemoveSvg = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 14 14");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`;
  return svg;
};

export class NdsFileUpload extends NdsElement {
  static elementName = "nds-file-upload";

  static get observedAttributes(): readonly string[] {
    return ["accept", "multiple", "max-size", "disabled", "hint", "description", "error-message"];
  }

  private _root: HTMLDivElement | null = null;
  private _drop: HTMLDivElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _error: HTMLSpanElement | null = null;
  private _list: HTMLUListElement | null = null;
  private _files: File[] = [];
  private _dragover = false;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  /** 현재 보유 중인 파일 목록 (read-only copy). */
  get files(): File[] {
    return this._files.slice();
  }

  /** 파일 목록을 외부에서 설정 (제어 모드). */
  setFiles(files: File[]): void {
    this._files = files.slice();
    this.scheduleUpdate();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = FU_ROOT_CLASS;

    const drop = document.createElement("div");
    drop.dataset.slot = "drop";
    drop.className = FU_DROP_CLASS;

    const iconEl = document.createElement("span");
    iconEl.dataset.slot = "icon";
    iconEl.className = FU_ICON_CLASS;
    iconEl.appendChild(UploadSvg());

    const text = document.createElement("p");
    text.dataset.slot = "text";
    text.className = FU_TEXT_CLASS;

    const hint = document.createElement("span");
    hint.dataset.slot = "hint";
    hint.className = FU_HINT_CLASS;

    const input = document.createElement("input");
    input.type = "file";
    input.className = FU_HIDDEN_INPUT_CLASS;
    input.setAttribute("aria-label", "파일 선택");
    input.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files) return;
      this._acceptFiles(Array.from(target.files));
      target.value = "";
    });

    drop.append(iconEl, text, hint, input);

    drop.addEventListener("click", (e) => {
      if (e.target === input) return;
      if (this.boolAttr("disabled")) return;
      input.click();
    });
    drop.addEventListener("dragover", (e) => {
      e.preventDefault();
      this._dragover = true;
      drop.dataset.dragover = "true";
    });
    drop.addEventListener("dragleave", () => {
      this._dragover = false;
      drop.dataset.dragover = "false";
    });
    drop.addEventListener("drop", (e) => {
      e.preventDefault();
      this._dragover = false;
      drop.dataset.dragover = "false";
      if (this.boolAttr("disabled")) return;
      const dt = e.dataTransfer;
      if (!dt) return;
      this._acceptFiles(Array.from(dt.files));
    });

    /* error/list 도 1회만 마운트 — update() 에서 root.replaceChildren 으로 drop 을
     * 떼었다 붙이면 그 순간 file input 포커스가 유실된다 (mount-once 계약,
     * packages/html/test/nds-file-upload.test.ts 가 잠근다). */
    const err = document.createElement("span");
    err.dataset.slot = "error";
    err.className = FU_ERROR_CLASS;
    err.style.display = "none";

    const list = document.createElement("ul");
    list.dataset.slot = "list";
    list.className = FU_LIST_CLASS;
    list.style.display = "none";

    root.append(drop, err, list);
    this.appendChild(root);

    this._root = root;
    this._drop = drop;
    this._input = input;
    this._error = err;
    this._list = list;
  }

  private _acceptFiles(incoming: File[]): void {
    const max = parseInt(this.attr("max-size", ""), 10);
    const multiple = this.boolAttr("multiple");
    const accepted: File[] = [];
    const rejectedSize: File[] = [];
    for (const f of incoming) {
      if (!Number.isNaN(max) && f.size > max) {
        rejectedSize.push(f);
        continue;
      }
      accepted.push(f);
    }
    if (rejectedSize.length > 0) {
      this.dispatchEvent(
        new CustomEvent("files-reject", {
          detail: { files: rejectedSize, reason: "size" },
          bubbles: true,
          composed: true,
        }),
      );
    }
    this._files = multiple ? [...this._files, ...accepted] : accepted.slice(0, 1);
    this._emitChange();
    this.scheduleUpdate();
  }

  private _emitChange(): void {
    this.dispatchEvent(
      new CustomEvent("files-change", {
        detail: { files: this._files.slice() },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _removeAt(idx: number): void {
    this._files = this._files.filter((_, i) => i !== idx);
    this._emitChange();
    this.scheduleUpdate();
  }

  protected update(): void {
    if (!this._root || !this._drop || !this._input) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const accept = this.getAttribute("accept");
    const multiple = this.boolAttr("multiple");
    const disabled = this.boolAttr("disabled");
    const hintText = this.getAttribute("hint");
    const description = this.getAttribute("description");
    const errorMessage = this.getAttribute("error-message");

    if (accept) this._input.accept = accept;
    else this._input.removeAttribute("accept");
    this._input.multiple = multiple;
    this._input.disabled = disabled;

    this._drop.dataset.disabled = disabled ? "true" : "false";
    this._drop.dataset.dragover = this._dragover ? "true" : "false";

    const textEl = this._drop.querySelector<HTMLParagraphElement>(`p.${FU_TEXT_CLASS}`);
    if (textEl) {
      textEl.replaceChildren();
      if (hintText) {
        textEl.textContent = hintText;
      } else {
        const strong = document.createElement("strong");
        strong.textContent = "클릭";
        textEl.append(strong, "하거나 끌어다 놓아 파일을 추가하세요");
      }
    }

    const hintEl = this._drop.querySelector<HTMLSpanElement>(`span.${FU_HINT_CLASS}`);
    if (hintEl) {
      if (description) {
        hintEl.textContent = description;
        hintEl.style.display = "";
      } else {
        hintEl.textContent = "";
        hintEl.style.display = "none";
      }
    }

    // error message + list (after drop) — 노드는 보존, 내용/표시만 갱신
    if (this._error) {
      this._error.textContent = errorMessage ?? "";
      this._error.style.display = errorMessage ? "" : "none";
    }
    if (this._list) {
      const list = this._list;
      list.style.display = this._files.length > 0 ? "" : "none";
      const items: Node[] = [];
      this._files.forEach((file, idx) => {
        const li = document.createElement("li");
        li.dataset.slot = "item";
        li.className = FU_ITEM_CLASS;

        const name = document.createElement("span");
        name.dataset.slot = "item-name";
        name.className = FU_ITEM_NAME_CLASS;
        name.textContent = file.name;

        const size = document.createElement("span");
        size.dataset.slot = "item-size";
        size.className = FU_ITEM_SIZE_CLASS;
        size.textContent = fmtSize(file.size);

        const remove = document.createElement("button");
        remove.type = "button";
        remove.dataset.slot = "remove";
        remove.className = FU_REMOVE_CLASS;
        remove.setAttribute("aria-label", `${file.name} 제거`);
        remove.appendChild(RemoveSvg());
        remove.addEventListener("click", () => this._removeAt(idx));

        li.append(name, size, remove);
        items.push(li);
      });
      list.replaceChildren(...items);
    }
  }
}

define(NdsFileUpload);
