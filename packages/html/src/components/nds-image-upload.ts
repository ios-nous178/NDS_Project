/**
 * <nds-image-upload> — DS ImageUpload 의 vanilla Web Component 버전.
 *
 * 사용 패턴:
 *   <nds-image-upload state="uploaded" image-url="https://..."
 *     accept="image/*" upload-label="이미지 업로드"
 *     size-hint="사이즈 : 200*200 px 권장"></nds-image-upload>
 *
 * 이벤트:
 *   file-select (detail: { files: FileList }) — 사용자가 파일 선택
 *   upload-click — 업로드 버튼 클릭 (file-select 와 별개로)
 *   image-remove — 우상단 X 버튼 클릭 (uploaded 상태)
 *
 * 속성:
 *   state: "empty" | "uploaded" | "error" (기본 "empty")
 *   image-url: uploaded 상태에서 표시할 이미지
 *   image-alt
 *   accept (기본 "image/*")
 *   multiple
 *   upload-label / size-hint / helper-text / error-text
 */

import { NdsElement, define } from "../base/nds-element.js";

type ImageUploadState = "empty" | "uploaded" | "error";

const IU_ROOT_CLASS = "nds-image-upload";
const IU_PREVIEW_COL_CLASS = `${IU_ROOT_CLASS}__preview-col`;
const IU_PREVIEW_BOX_CLASS = `${IU_ROOT_CLASS}__preview-box`;
const IU_PREVIEW_IMG_CLASS = `${IU_ROOT_CLASS}__preview-img`;
const IU_REMOVE_BTN_CLASS = `${IU_ROOT_CLASS}__remove-btn`;
const IU_PLACEHOLDER_CLASS = `${IU_ROOT_CLASS}__placeholder`;
const IU_HELPER_CLASS = `${IU_ROOT_CLASS}__helper`;
const IU_ERROR_ICON_CLASS = `${IU_ROOT_CLASS}__error-icon`;
const IU_RIGHT_COL_CLASS = `${IU_ROOT_CLASS}__right-col`;
const IU_UPLOAD_BTN_CLASS = `${IU_ROOT_CLASS}__upload-btn`;
const IU_SIZE_HINT_CLASS = `${IU_ROOT_CLASS}__size-hint`;

const InfoSvg = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 14 14");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.2"/>
    <path d="M7 4v3.5M7 9.5v.01" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
  `;
  return svg;
};

const DeleteSvg = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 14 14");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`;
  return svg;
};

export class NdsImageUpload extends NdsElement {
  static elementName = "nds-image-upload";

  static get observedAttributes(): readonly string[] {
    return [
      "state",
      "image-url",
      "image-alt",
      "accept",
      "multiple",
      "upload-label",
      "size-hint",
      "helper-text",
      "error-text",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _input: HTMLInputElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.className = IU_ROOT_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const stateAttr = this.attr("state", "empty") as ImageUploadState;
    const state: ImageUploadState =
      stateAttr === "uploaded" || stateAttr === "error" ? stateAttr : "empty";
    const imageUrl = this.getAttribute("image-url");
    const imageAlt = this.attr("image-alt", "");
    const accept = this.attr("accept", "image/*");
    const multiple = this.boolAttr("multiple");
    const uploadLabel = this.attr("upload-label", "이미지 업로드");
    const sizeHint = this.attr("size-hint", "사이즈 : 200*200 px 권장");
    const helperText = this.attr("helper-text", "이미지를 업로드해 주세요.");
    const errorText = this.attr("error-text", "이미지를 등록해 주세요.");

    this._root.dataset.state = state;

    const previewCol = document.createElement("div");
    previewCol.className = IU_PREVIEW_COL_CLASS;

    const previewBox = document.createElement("div");
    previewBox.className = IU_PREVIEW_BOX_CLASS;
    previewBox.dataset.state = state;

    const showImage = state === "uploaded" && !!imageUrl;
    const showPlaceholder = state === "empty" || state === "error";
    if (showImage) {
      const img = document.createElement("img");
      img.className = IU_PREVIEW_IMG_CLASS;
      img.src = imageUrl!;
      img.alt = imageAlt;
      previewBox.appendChild(img);
    }
    if (showPlaceholder) {
      const ph = document.createElement("span");
      ph.className = IU_PLACEHOLDER_CLASS;
      ph.textContent = "No Image";
      previewBox.appendChild(ph);
    }
    if (state === "uploaded") {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = IU_REMOVE_BTN_CLASS;
      remove.setAttribute("aria-label", "이미지 제거");
      remove.appendChild(DeleteSvg());
      remove.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("image-remove", { bubbles: true, composed: true }));
      });
      previewBox.appendChild(remove);
    }

    const helper = document.createElement("div");
    helper.className = IU_HELPER_CLASS;
    helper.dataset.state = state;
    if (state === "error") {
      const errIcon = document.createElement("span");
      errIcon.className = IU_ERROR_ICON_CLASS;
      errIcon.appendChild(InfoSvg());
      const errText = document.createElement("span");
      errText.textContent = errorText;
      helper.append(errIcon, errText);
    } else {
      const span = document.createElement("span");
      span.textContent = helperText;
      helper.appendChild(span);
    }

    previewCol.append(previewBox, helper);

    const rightCol = document.createElement("div");
    rightCol.className = IU_RIGHT_COL_CLASS;

    const uploadBtn = document.createElement("button");
    uploadBtn.type = "button";
    uploadBtn.className = IU_UPLOAD_BTN_CLASS;
    uploadBtn.textContent = uploadLabel;
    uploadBtn.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("upload-click", { bubbles: true, composed: true }));
      this._input?.click();
    });

    const sizeHintEl = document.createElement("span");
    sizeHintEl.className = IU_SIZE_HINT_CLASS;
    sizeHintEl.textContent = sizeHint;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.multiple = multiple;
    input.style.display = "none";
    input.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        this.dispatchEvent(
          new CustomEvent("file-select", {
            detail: { files: target.files },
            bubbles: true,
            composed: true,
          }),
        );
      }
      target.value = "";
    });
    this._input = input;

    rightCol.append(uploadBtn, sizeHintEl, input);

    this._root.replaceChildren(previewCol, rightCol);
  }
}

define(NdsImageUpload);
