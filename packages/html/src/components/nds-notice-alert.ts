/**
 * <nds-notice-alert> — DS NoticeAlert 의 vanilla Web Component 버전.
 *
 * 폼·페이지 내부에 인라인으로 영구 노출되는 안내/주의/에러 메시지.
 * Toast(자동 사라짐)·Banner(전역 띠)·Modal(즉각 판단)과 달리 입력 컨텍스트 옆에 머무른다.
 *
 * 사용 예:
 *   <nds-notice-alert variant="caution" message="목표 참여자 수는 1,000명 단위로 입력해 주세요."></nds-notice-alert>
 *   <nds-notice-alert variant="error" message="필수 정보가 누락되어 저장할 수 없어요."></nds-notice-alert>
 *
 * 속성:
 *   variant: "info" | "notice" | "caution" | "success" | "error"  (기본 "info")
 *   message: 본문 텍스트 (미지정 시 children 텍스트 사용)
 *   hide-icon: 좌측 status 아이콘 숨김 (info 는 기본적으로 아이콘 없음)
 */

import { NdsElement, define } from "../base/nds-element.js";

const NA_CLASS = "nds-notice-alert";
const NA_ICON_CLASS = `${NA_CLASS}__icon`;
const NA_MESSAGE_CLASS = `${NA_CLASS}__message`;

export type NoticeAlertVariant = "info" | "notice" | "caution" | "success" | "error";

const VARIANTS: readonly NoticeAlertVariant[] = ["info", "notice", "caution", "success", "error"];

/* variant 별 좌측 status glyph (20×20, currentColor). info 는 아이콘 없음. */
const GLYPHS: Record<NoticeAlertVariant, string> = {
  info: "",
  notice: `<circle cx="10" cy="10" r="8" fill="currentColor" /><circle cx="10" cy="6.6" r="1" fill="#fff" /><path d="M10 9v5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" />`,
  caution: `<path d="M10 2.5L18.5 17.5H1.5L10 2.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="currentColor" fill-opacity="0.12" /><path d="M10 8v3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /><circle cx="10" cy="14.4" r="1" fill="currentColor" />`,
  success: `<circle cx="10" cy="10" r="8" fill="currentColor" /><path d="M6.5 10.2l2.4 2.4 4.6-4.9" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />`,
  error: `<circle cx="10" cy="10" r="8" fill="currentColor" /><path d="M7.5 7.5l5 5M12.5 7.5l-5 5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" />`,
};

export class NdsNoticeAlert extends NdsElement {
  static elementName = "nds-notice-alert";

  static get observedAttributes(): readonly string[] {
    return ["variant", "message", "hide-icon"];
  }

  private _root: HTMLDivElement | null = null;
  private _childText = "";

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    // children 텍스트를 한 번 보존한 뒤 root 로 교체
    this._childText = (this.textContent ?? "").trim();

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = NA_CLASS;
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const attrVariant = this.getAttribute("variant") as NoticeAlertVariant | null;
    const variant: NoticeAlertVariant =
      attrVariant && VARIANTS.includes(attrVariant) ? attrVariant : "info";
    const message = this.getAttribute("message") ?? this._childText;
    const hideIcon = this.boolAttr("hide-icon");
    const isError = variant === "error";

    this._root.dataset.variant = variant;
    this._root.setAttribute("role", isError ? "alert" : "status");
    this._root.setAttribute("aria-live", isError ? "assertive" : "polite");

    this._root.innerHTML = "";

    const glyph = GLYPHS[variant];
    if (glyph && !hideIcon) {
      const iconSpan = document.createElement("span");
      iconSpan.dataset.slot = "icon";
      iconSpan.className = NA_ICON_CLASS;
      iconSpan.setAttribute("aria-hidden", "true");
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 20 20");
      svg.setAttribute("width", "20");
      svg.setAttribute("height", "20");
      svg.setAttribute("fill", "none");
      svg.innerHTML = glyph;
      iconSpan.appendChild(svg);
      this._root.appendChild(iconSpan);
    }

    const msg = document.createElement("span");
    msg.dataset.slot = "message";
    msg.className = NA_MESSAGE_CLASS;
    msg.textContent = message;
    this._root.appendChild(msg);
  }
}

define(NdsNoticeAlert);
