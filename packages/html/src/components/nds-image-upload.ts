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
 *   auto-preview: 파일 선택 시 컴포넌트가 직접 첫 이미지를 objectURL 로
 *     미리보기에 렌더(image-url/state 수동 갱신 불필요). X 로 해제, revoke·
 *     언마운트 정리 내부 처리. image-url 을 직접 지정하면 그 값이 우선.
 *   upload-label / size-hint / helper-text / error-text
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

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
    return [...COMPONENT_ATTRS["nds-image-upload"].observedAttributes, "upload-label", "size-hint", "helper-text", "error-text"];
  }

  private _root: HTMLDivElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _previewBox: HTMLDivElement | null = null;
  private _previewImg: HTMLImageElement | null = null;
  private _placeholder: HTMLSpanElement | null = null;
  private _removeBtn: HTMLButtonElement | null = null;
  private _helper: HTMLDivElement | null = null;
  private _errorIcon: HTMLSpanElement | null = null;
  private _helperText: HTMLSpanElement | null = null;
  private _uploadBtn: HTMLButtonElement | null = null;
  private _sizeHintEl: HTMLSpanElement | null = null;
  /** auto-preview 모드에서 생성한 objectURL — revoke 추적용. */
  private _autoUrl: string | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    this._revokeAuto();
    super.disconnectedCallback();
  }

  private _revokeAuto(): void {
    if (this._autoUrl) {
      URL.revokeObjectURL(this._autoUrl);
      this._autoUrl = null;
    }
  }

  /**
   * DOM 골격 1회 구성 — update() 는 텍스트/src/표시 여부만 반영한다.
   * (update() 에서 file input 을 재생성하면 attribute 갱신마다 포커스가 유실되는
   * 회귀 — packages/html/test/nds-image-upload.test.ts 가 잠근다.)
   */
  private _mount(): void {
    const root = document.createElement("div");
    root.className = IU_ROOT_CLASS;

    const previewCol = document.createElement("div");
    previewCol.className = IU_PREVIEW_COL_CLASS;

    const previewBox = document.createElement("div");
    previewBox.className = IU_PREVIEW_BOX_CLASS;

    const img = document.createElement("img");
    img.className = IU_PREVIEW_IMG_CLASS;
    img.style.display = "none";

    const ph = document.createElement("span");
    ph.className = IU_PLACEHOLDER_CLASS;
    ph.textContent = "No Image";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = IU_REMOVE_BTN_CLASS;
    remove.setAttribute("aria-label", "이미지 제거");
    remove.style.display = "none";
    remove.appendChild(DeleteSvg());
    remove.addEventListener("click", () => {
      // auto-preview 모드면 내부 objectURL 해제 + 속성 초기화까지 처리.
      if (this.boolAttr("auto-preview")) {
        this._revokeAuto();
        this.removeAttribute("image-url");
        this.setAttribute("state", "empty");
      }
      this.dispatchEvent(new CustomEvent("image-remove", { bubbles: true, composed: true }));
    });

    previewBox.append(img, ph, remove);

    const helper = document.createElement("div");
    helper.className = IU_HELPER_CLASS;
    const errIcon = document.createElement("span");
    errIcon.className = IU_ERROR_ICON_CLASS;
    errIcon.style.display = "none";
    errIcon.appendChild(InfoSvg());
    const helperText = document.createElement("span");
    helper.append(errIcon, helperText);

    previewCol.append(previewBox, helper);

    const rightCol = document.createElement("div");
    rightCol.className = IU_RIGHT_COL_CLASS;

    const uploadBtn = document.createElement("button");
    uploadBtn.type = "button";
    uploadBtn.className = IU_UPLOAD_BTN_CLASS;
    uploadBtn.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("upload-click", { bubbles: true, composed: true }));
      this._input?.click();
    });

    const sizeHintEl = document.createElement("span");
    sizeHintEl.className = IU_SIZE_HINT_CLASS;

    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none";
    input.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        // auto-preview 모드면 첫 이미지를 objectURL 로 즉시 렌더(속성 갱신은 내부 처리).
        if (this.boolAttr("auto-preview")) {
          this._revokeAuto();
          this._autoUrl = URL.createObjectURL(target.files[0]);
          this.setAttribute("image-url", this._autoUrl);
          this.setAttribute("state", "uploaded");
        }
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

    rightCol.append(uploadBtn, sizeHintEl, input);
    root.append(previewCol, rightCol);
    this.appendChild(root);

    this._root = root;
    this._input = input;
    this._previewBox = previewBox;
    this._previewImg = img;
    this._placeholder = ph;
    this._removeBtn = remove;
    this._helper = helper;
    this._errorIcon = errIcon;
    this._helperText = helperText;
    this._uploadBtn = uploadBtn;
    this._sizeHintEl = sizeHintEl;
  }

  protected update(): void {
    if (!this._root || !this._input) return;
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
    if (this._previewBox) this._previewBox.dataset.state = state;

    const showImage = state === "uploaded" && !!imageUrl;
    const showPlaceholder = state === "empty" || state === "error";
    if (this._previewImg) {
      if (showImage) {
        if (this._previewImg.getAttribute("src") !== imageUrl) this._previewImg.src = imageUrl!;
        this._previewImg.alt = imageAlt;
        this._previewImg.style.display = "";
      } else {
        this._previewImg.removeAttribute("src");
        this._previewImg.style.display = "none";
      }
    }
    if (this._placeholder) this._placeholder.style.display = showPlaceholder ? "" : "none";
    if (this._removeBtn) this._removeBtn.style.display = state === "uploaded" ? "" : "none";

    if (this._helper) this._helper.dataset.state = state;
    if (this._errorIcon) this._errorIcon.style.display = state === "error" ? "" : "none";
    if (this._helperText) this._helperText.textContent = state === "error" ? errorText : helperText;

    if (this._uploadBtn) this._uploadBtn.textContent = uploadLabel;
    if (this._sizeHintEl) this._sizeHintEl.textContent = sizeHint;

    this._input.accept = accept;
    this._input.multiple = multiple;
  }
}

define(NdsImageUpload);
