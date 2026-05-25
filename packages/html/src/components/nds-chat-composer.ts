/**
 * <nds-chat-composer> — DS ChatComposer 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-chat-composer
 *     placeholder="메시지를 입력하세요"
 *     max-length="500"
 *     show-attach
 *     show-mic
 *     quick-replies='[{"label":"네"},{"label":"아니오"}]'
 *   ></nds-chat-composer>
 *
 * 이벤트:
 *   nds-chat-input (detail: { value }) -> 입력 변경
 *   nds-chat-submit (detail: { value }) -> 전송 (Enter / 버튼)
 *   nds-chat-attach -> 첨부 버튼 클릭
 *   nds-chat-mic -> 음성 버튼 클릭
 *   nds-chat-quick-reply (detail: { label, index })
 *
 * 속성:
 *   value (controlled)
 *   placeholder / max-length
 *   show-attach / show-mic
 *   quick-replies: JSON 배열 ({ label })
 *   disabled
 *   submit-on-enter (default true; "false" 면 줄바꿈만)
 *   max-height (px, default 120)
 */

import { NdsElement, define } from "../base/nds-element.js";

const CC_CLASS = "nds-chat-composer";
const CC_QUICK_CLASS = `${CC_CLASS}__quick`;
const CC_QUICK_ITEM_CLASS = `${CC_CLASS}__quick-item`;
const CC_INPUT_AREA_CLASS = `${CC_CLASS}__input-area`;
const CC_LEFT_CLASS = `${CC_CLASS}__left`;
const CC_TEXTAREA_CLASS = `${CC_CLASS}__textarea`;
const CC_BTN_CLASS = `${CC_CLASS}__btn`;
const CC_SEND_CLASS = `${CC_CLASS}__send`;
const CC_COUNT_CLASS = `${CC_CLASS}__count`;

const AttachIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M14 6L8 12c-1 1-1 3 0 4s3 1 4 0l7-7c-2-2-5-2-7 0L5 16c-2 2-2 6 0 8s6 2 8 0l7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  return svg;
};

const MicIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<rect x="7" y="2" width="6" height="10" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M4 9c0 3 3 6 6 6s6-3 6-6M10 15v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`;
  return svg;
};

const SendIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "18");
  svg.setAttribute("height", "18");
  svg.setAttribute("viewBox", "0 0 18 18");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M2 9l14-6-3 6 3 6-14-6z" fill="currentColor" stroke-linejoin="round"/>`;
  return svg;
};

export class NdsChatComposer extends NdsElement {
  static elementName = "nds-chat-composer";

  static get observedAttributes(): readonly string[] {
    return [
      "value",
      "placeholder",
      "max-length",
      "show-attach",
      "show-mic",
      "quick-replies",
      "disabled",
      "submit-on-enter",
      "max-height",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _quickWrap: HTMLDivElement | null = null;
  private _inputArea: HTMLDivElement | null = null;
  private _leftWrap: HTMLDivElement | null = null;
  private _attachBtn: HTMLButtonElement | null = null;
  private _micBtn: HTMLButtonElement | null = null;
  private _textarea: HTMLTextAreaElement | null = null;
  private _sendBtn: HTMLButtonElement | null = null;
  private _countEl: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _dispatch(name: string, detail?: Record<string, unknown>): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  private _autoResize(): void {
    if (!this._textarea) return;
    const maxHeight = parseInt(this.attr("max-height", "120"), 10) || 120;
    this._textarea.style.height = "auto";
    this._textarea.style.height = `${Math.min(this._textarea.scrollHeight, maxHeight)}px`;
  }

  private _submit(): void {
    const value = this.getAttribute("value") || "";
    if (this.boolAttr("disabled")) return;
    if (value.trim().length === 0) return;
    this._dispatch("nds-chat-submit", { value });
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = CC_CLASS;

    const quickWrap = document.createElement("div");
    quickWrap.className = CC_QUICK_CLASS;
    quickWrap.setAttribute("role", "toolbar");
    quickWrap.setAttribute("aria-label", "빠른 응답");

    const inputArea = document.createElement("div");
    inputArea.className = CC_INPUT_AREA_CLASS;

    const leftWrap = document.createElement("div");
    leftWrap.className = CC_LEFT_CLASS;

    const attachBtn = document.createElement("button");
    attachBtn.type = "button";
    attachBtn.className = CC_BTN_CLASS;
    attachBtn.setAttribute("aria-label", "첨부");
    attachBtn.appendChild(AttachIcon());
    attachBtn.addEventListener("click", () => {
      if (this.boolAttr("disabled")) return;
      this._dispatch("nds-chat-attach");
    });

    const micBtn = document.createElement("button");
    micBtn.type = "button";
    micBtn.className = CC_BTN_CLASS;
    micBtn.setAttribute("aria-label", "음성");
    micBtn.appendChild(MicIcon());
    micBtn.addEventListener("click", () => {
      if (this.boolAttr("disabled")) return;
      this._dispatch("nds-chat-mic");
    });

    leftWrap.append(attachBtn, micBtn);

    const textarea = document.createElement("textarea");
    textarea.className = CC_TEXTAREA_CLASS;
    textarea.rows = 1;
    textarea.addEventListener("input", () => {
      this.setAttribute("value", textarea.value);
      this._autoResize();
      this._dispatch("nds-chat-input", { value: textarea.value });
      this._updateSendDisabled();
    });
    textarea.addEventListener("keydown", (e) => {
      const submitOnEnter = this.attr("submit-on-enter", "true") !== "false";
      if (submitOnEnter && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this._submit();
      }
    });

    const sendBtn = document.createElement("button");
    sendBtn.type = "button";
    sendBtn.className = CC_SEND_CLASS;
    sendBtn.setAttribute("aria-label", "전송");
    sendBtn.appendChild(SendIcon());
    sendBtn.addEventListener("click", () => this._submit());

    inputArea.append(leftWrap, textarea, sendBtn);

    const countEl = document.createElement("div");
    countEl.className = CC_COUNT_CLASS;
    countEl.setAttribute("aria-live", "polite");

    root.append(quickWrap, inputArea, countEl);
    this.appendChild(root);

    this._root = root;
    this._quickWrap = quickWrap;
    this._inputArea = inputArea;
    this._leftWrap = leftWrap;
    this._attachBtn = attachBtn;
    this._micBtn = micBtn;
    this._textarea = textarea;
    this._sendBtn = sendBtn;
    this._countEl = countEl;
  }

  private _updateSendDisabled(): void {
    if (!this._sendBtn) return;
    const value = this.getAttribute("value") || "";
    this._sendBtn.disabled = this.boolAttr("disabled") || value.trim().length === 0;
  }

  private _parseQuickReplies(): { label: string }[] {
    const raw = this.getAttribute("quick-replies");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((q) => q && typeof q.label === "string")
        .map((q) => ({ label: String(q.label) }));
    } catch {
      return [];
    }
  }

  protected update(): void {
    if (
      !this._root ||
      !this._quickWrap ||
      !this._leftWrap ||
      !this._attachBtn ||
      !this._micBtn ||
      !this._textarea ||
      !this._countEl
    ) {
      return;
    }
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this.getAttribute("value") || "";
    const placeholder = this.getAttribute("placeholder") || "메시지를 입력하세요";
    const maxLengthAttr = this.getAttribute("max-length");
    const maxLength = maxLengthAttr ? parseInt(maxLengthAttr, 10) : undefined;
    const showAttach = this.boolAttr("show-attach");
    const showMic = this.boolAttr("show-mic");
    const disabled = this.boolAttr("disabled");
    const maxHeight = parseInt(this.attr("max-height", "120"), 10) || 120;
    const quick = this._parseQuickReplies();

    this._root.style.setProperty("--nds-chat-composer-max", `${maxHeight}px`);

    // Quick replies
    this._quickWrap.innerHTML = "";
    quick.forEach((q, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = CC_QUICK_ITEM_CLASS;
      btn.textContent = q.label;
      btn.addEventListener("click", () => {
        this._dispatch("nds-chat-quick-reply", { label: q.label, index: i });
      });
      this._quickWrap!.appendChild(btn);
    });
    this._quickWrap.style.display = quick.length > 0 ? "" : "none";

    this._attachBtn.style.display = showAttach ? "" : "none";
    this._attachBtn.disabled = disabled;
    this._micBtn.style.display = showMic ? "" : "none";
    this._micBtn.disabled = disabled;
    this._leftWrap.style.display = showAttach || showMic ? "" : "none";

    if (this._textarea.value !== value) this._textarea.value = value;
    this._textarea.placeholder = placeholder;
    this._textarea.disabled = disabled;
    if (maxLength !== undefined && !Number.isNaN(maxLength)) {
      this._textarea.maxLength = maxLength;
    } else {
      this._textarea.removeAttribute("maxlength");
    }
    this._autoResize();
    this._updateSendDisabled();

    if (maxLength !== undefined && !Number.isNaN(maxLength)) {
      this._countEl.textContent = `${value.length} / ${maxLength}`;
      this._countEl.style.display = "";
    } else {
      this._countEl.style.display = "none";
    }
  }
}

define(NdsChatComposer);
