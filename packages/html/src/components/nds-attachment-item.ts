/**
 * <nds-attachment-item> — DS AttachmentItem 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-attachment-item
 *     name="제안서.pdf"
 *     size="1048576"
 *     status="done"
 *     href="/download/1"
 *   ></nds-attachment-item>
 *
 * 이벤트:
 *   attachment-download -> 다운로드 버튼 클릭
 *   attachment-remove -> 삭제 버튼 클릭
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const AT_CLASS = "nds-attachment-item";
const AT_ICON_CLASS = `${AT_CLASS}__icon`;
const AT_BODY_CLASS = `${AT_CLASS}__body`;
const AT_NAME_CLASS = `${AT_CLASS}__name`;
const AT_META_CLASS = `${AT_CLASS}__meta`;
const AT_SIZE_CLASS = `${AT_CLASS}__size`;
const AT_STATUS_CLASS = `${AT_CLASS}__status`;
const AT_PROGRESS_CLASS = `${AT_CLASS}__progress`;
const AT_PROGRESS_FILL_CLASS = `${AT_CLASS}__progress-fill`;
const AT_ACTIONS_CLASS = `${AT_CLASS}__actions`;
const AT_BTN_CLASS = `${AT_CLASS}__btn`;
const AT_ERROR_CLASS = `${AT_CLASS}__error`;

export type AttachmentFileType =
  | "pdf"
  | "image"
  | "video"
  | "audio"
  | "document"
  | "archive"
  | "other";
export type AttachmentStatus = "uploading" | "done" | "error";

const inferFileType = (name: string): AttachmentFileType => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["pdf"].includes(ext)) return "pdf";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "heic"].includes(ext)) return "image";
  if (["mp4", "mov", "webm", "avi", "mkv"].includes(ext)) return "video";
  if (["mp3", "wav", "m4a", "aac", "flac"].includes(ext)) return "audio";
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "md", "rtf", "csv"].includes(ext))
    return "document";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
  return "other";
};

const fmtSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

const FileIcon = (type: AttachmentFileType) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");

  if (type === "image") {
    svg.innerHTML = `
      <rect x="2.5" y="3" width="15" height="14" rx="2" stroke="currentColor" stroke-width="1.5" />
      <circle cx="7" cy="8" r="1.5" fill="currentColor" />
      <path d="M3 14L7 11L11 14L17 9" stroke="currentColor" stroke-width="1.5" fill="none" />
    `;
  } else if (type === "pdf") {
    svg.innerHTML = `
      <path
        d="M5 2H12L16 6V17C16 17.5523 15.5523 18 15 18H5C4.44772 18 4 17.5523 4 17V3C4 2.44772 4.44772 2 5 2Z"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <path d="M12 2V6H16" stroke="currentColor" stroke-width="1.5" fill="none" />
      <text x="10" y="14" font-size="5" font-weight="700" text-anchor="middle" fill="currentColor">
        PDF
      </text>
    `;
  } else if (type === "video" || type === "audio") {
    svg.innerHTML = `
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5" />
      <path d="M8 7L13 10L8 13V7Z" fill="currentColor" />
    `;
  } else {
    svg.innerHTML = `
      <path
        d="M5 2H12L16 6V17C16 17.5523 15.5523 18 15 18H5C4.44772 18 4 17.5523 4 17V3C4 2.44772 4.44772 2 5 2Z"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <path d="M12 2V6H16" stroke="currentColor" stroke-width="1.5" fill="none" />
    `;
  }
  return svg;
};

const DownloadIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <path
      d="M8 2V11M8 11L4 7M8 11L12 7"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M3 13H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  `;
  return svg;
};

const RemoveIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 14 14");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  `;
  return svg;
};

const STATUS_LABEL: Record<AttachmentStatus, string> = {
  uploading: "업로드 중",
  done: "완료",
  error: "실패",
};

export class NdsAttachmentItem extends NdsElement {
  static elementName = "nds-attachment-item";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-attachment-item"].observedAttributes, "error-message"];
  }

  private _root: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = AT_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const name = this.attr("name", "");
    const sizeAttr = this.getAttribute("size");
    const size = sizeAttr ? parseInt(sizeAttr, 10) : undefined;
    const fileType = this.getAttribute("file-type") as AttachmentFileType | null;
    const status = (this.getAttribute("status") as AttachmentStatus) || "done";
    const progressAttr = this.getAttribute("progress");
    const progress = progressAttr ? parseFloat(progressAttr) : undefined;
    const href = this.getAttribute("href");
    const errorMessage = this.getAttribute("error-message");

    const type = fileType ?? inferFileType(name);
    const isUploading = status === "uploading";
    const showDownload = !isUploading && (href || this.hasAttribute("on-download")); // We can't really check onDownload prop but we can use an attribute as a flag

    this._root.dataset.status = status;

    // Icon
    const iconSpan = document.createElement("span");
    iconSpan.dataset.slot = "icon";
    iconSpan.dataset.type = type;
    iconSpan.className = AT_ICON_CLASS;
    iconSpan.appendChild(FileIcon(type));

    // Body
    const body = document.createElement("div");
    body.dataset.slot = "body";
    body.className = AT_BODY_CLASS;

    const nameSpan = document.createElement("span");
    nameSpan.dataset.slot = "name";
    nameSpan.className = AT_NAME_CLASS;
    nameSpan.textContent = name;

    const meta = document.createElement("span");
    meta.dataset.slot = "meta";
    meta.className = AT_META_CLASS;

    if (size !== undefined) {
      const sizeSpan = document.createElement("span");
      sizeSpan.dataset.slot = "size";
      sizeSpan.className = AT_SIZE_CLASS;
      sizeSpan.textContent = fmtSize(size);
      meta.appendChild(sizeSpan);
    }

    if (size !== undefined && status !== "done") {
      const dot = document.createElement("span");
      dot.setAttribute("aria-hidden", "true");
      dot.textContent = " · ";
      meta.appendChild(dot);
    }

    if (status !== "done") {
      const statusSpan = document.createElement("span");
      statusSpan.dataset.slot = "status";
      statusSpan.dataset.status = status;
      statusSpan.className = AT_STATUS_CLASS;
      let text = STATUS_LABEL[status];
      if (isUploading && progress !== undefined) {
        text += ` ${Math.round(progress)}%`;
      }
      statusSpan.textContent = text;
      meta.appendChild(statusSpan);
    }

    body.append(nameSpan, meta);

    if (isUploading && progress !== undefined) {
      const progressWrap = document.createElement("span");
      progressWrap.dataset.slot = "progress";
      progressWrap.className = AT_PROGRESS_CLASS;
      progressWrap.setAttribute("aria-hidden", "true");

      const progressFill = document.createElement("span");
      progressFill.dataset.slot = "progress-fill";
      progressFill.className = AT_PROGRESS_FILL_CLASS;
      progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;

      progressWrap.appendChild(progressFill);
      body.appendChild(progressWrap);
    }

    if (status === "error" && errorMessage) {
      const errorSpan = document.createElement("span");
      errorSpan.dataset.slot = "error";
      errorSpan.className = AT_ERROR_CLASS;
      errorSpan.textContent = errorMessage;
      body.appendChild(errorSpan);
    }

    // Actions
    let actions: HTMLDivElement | null = null;
    const hasRemoveListener = this.hasAttribute("removable"); // Flag attribute

    if (showDownload || hasRemoveListener) {
      actions = document.createElement("div");
      actions.dataset.slot = "actions";
      actions.className = AT_ACTIONS_CLASS;

      if (showDownload) {
        if (href) {
          const a = document.createElement("a");
          a.dataset.slot = "download";
          a.className = AT_BTN_CLASS;
          a.href = href;
          a.download = "";
          a.setAttribute("aria-label", `${name} 다운로드`);
          a.appendChild(DownloadIcon());
          a.addEventListener("click", () => {
            this.dispatchEvent(
              new CustomEvent("attachment-download", { bubbles: true, composed: true }),
            );
          });
          actions.appendChild(a);
        } else {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.dataset.slot = "download";
          btn.className = AT_BTN_CLASS;
          btn.setAttribute("aria-label", `${name} 다운로드`);
          btn.appendChild(DownloadIcon());
          btn.addEventListener("click", () => {
            this.dispatchEvent(
              new CustomEvent("attachment-download", { bubbles: true, composed: true }),
            );
          });
          actions.appendChild(btn);
        }
      }

      if (hasRemoveListener) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.dataset.slot = "remove";
        btn.className = AT_BTN_CLASS;
        btn.setAttribute("aria-label", `${name} 제거`);
        btn.appendChild(RemoveIcon());
        btn.addEventListener("click", () => {
          this.dispatchEvent(
            new CustomEvent("attachment-remove", { bubbles: true, composed: true }),
          );
        });
        actions.appendChild(btn);
      }
    }

    this._root.replaceChildren(iconSpan, body);
    if (actions) this._root.appendChild(actions);
  }
}

define(NdsAttachmentItem);
