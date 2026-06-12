/**
 * <nds-call-control-bar> — DS CallControlBar 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-call-control-bar duration="12:34" muted show-camera camera-on show-speaker></nds-call-control-bar>
 *
 * 이벤트:
 *   nds-call-mute-change (detail: { muted })
 *   nds-call-camera-change (detail: { on })
 *   nds-call-speaker-change (detail: { on })
 *   nds-call-end
 *
 * 속성:
 *   duration: 통화 시간 텍스트
 *   muted: 음소거 상태
 *   show-camera: 카메라 버튼 노출
 *   camera-on
 *   show-speaker: 스피커 버튼 노출
 *   speaker-on
 *
 * children:
 *   slot="extra" — 좌측 추가 버튼 (채팅 등)
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const CB_CLASS = "nds-call-control-bar";
const CB_TIMER_CLASS = `${CB_CLASS}__timer`;
const CB_BUTTONS_CLASS = `${CB_CLASS}__buttons`;
const CB_BTN_CLASS = `${CB_CLASS}__btn`;
const CB_END_CLASS = `${CB_CLASS}__end`;

const MicIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "22");
  svg.setAttribute("height", "22");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <rect x="9" y="3" width="6" height="12" rx="3" stroke="currentColor" stroke-width="1.8"/>
    <path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`;
  return svg;
};

const CameraIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "22");
  svg.setAttribute("height", "22");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <rect x="2" y="6" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.8"/>
    <path d="M16 10l6-3v10l-6-3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>`;
  return svg;
};

const SpeakerIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "22");
  svg.setAttribute("height", "22");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <path d="M4 9h4l5-4v14l-5-4H4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M17 8a5 5 0 010 8M19 5a8 8 0 010 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`;
  return svg;
};

const PhoneEndIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "22");
  svg.setAttribute("height", "22");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.style.transform = "rotate(135deg)";
  svg.innerHTML = `<path d="M5 4h3l2 5-3 2c1 3 3 5 6 6l2-3 5 2v3a2 2 0 01-2 2A16 16 0 014 6a2 2 0 011-2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>`;
  return svg;
};

const SlashOverlay = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.dataset.iconSlash = "true";
  svg.innerHTML = `<line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`;
  return svg;
};

export class NdsCallControlBar extends NdsElement {
  static elementName = "nds-call-control-bar";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-call-control-bar"].observedAttributes, "duration", "show-camera", "show-speaker"];
  }

  private _root: HTMLDivElement | null = null;
  private _extraStash: DocumentFragment | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const stash = document.createDocumentFragment();
    Array.from(this.childNodes).forEach((node) => {
      if (node instanceof HTMLElement && node.getAttribute("slot") === "extra") {
        stash.appendChild(node);
      } else {
        node.parentNode?.removeChild(node);
      }
    });
    this._extraStash = stash;

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = CB_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  private _dispatch(name: string, detail?: Record<string, unknown>): void {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const duration = this.getAttribute("duration");
    const muted = this.boolAttr("muted");
    const showCamera = this.boolAttr("show-camera");
    const cameraOn = this.attr("camera-on", "true") !== "false";
    const showSpeaker = this.boolAttr("show-speaker");
    const speakerOn = this.boolAttr("speaker-on");

    this._root.innerHTML = "";

    if (duration) {
      const timer = document.createElement("span");
      timer.className = CB_TIMER_CLASS;
      timer.textContent = duration;
      this._root.appendChild(timer);
    }

    const buttons = document.createElement("div");
    buttons.className = CB_BUTTONS_CLASS;

    if (this._extraStash && this._extraStash.childNodes.length > 0) {
      buttons.appendChild(this._extraStash.cloneNode(true));
    }

    // Mic
    const micBtn = document.createElement("button");
    micBtn.type = "button";
    micBtn.className = CB_BTN_CLASS;
    micBtn.dataset.active = muted ? "true" : "false";
    micBtn.setAttribute("aria-label", muted ? "음소거 해제" : "음소거");
    micBtn.setAttribute("aria-pressed", String(muted));
    micBtn.addEventListener("click", () => {
      const next = !muted;
      if (next) this.setAttribute("muted", "");
      else this.removeAttribute("muted");
      this._dispatch("nds-call-mute-change", { muted: next });
    });
    const micWrap = document.createElement("span");
    micWrap.dataset.iconWrap = "true";
    micWrap.appendChild(MicIcon());
    if (muted) micWrap.appendChild(SlashOverlay());
    micBtn.appendChild(micWrap);
    buttons.appendChild(micBtn);

    if (showCamera) {
      const camBtn = document.createElement("button");
      camBtn.type = "button";
      camBtn.className = CB_BTN_CLASS;
      camBtn.dataset.active = !cameraOn ? "true" : "false";
      camBtn.setAttribute("aria-label", cameraOn ? "카메라 끄기" : "카메라 켜기");
      camBtn.setAttribute("aria-pressed", String(!cameraOn));
      camBtn.addEventListener("click", () => {
        const next = !cameraOn;
        if (next) this.setAttribute("camera-on", "true");
        else this.setAttribute("camera-on", "false");
        this._dispatch("nds-call-camera-change", { on: next });
      });
      const camWrap = document.createElement("span");
      camWrap.dataset.iconWrap = "true";
      camWrap.appendChild(CameraIcon());
      if (!cameraOn) camWrap.appendChild(SlashOverlay());
      camBtn.appendChild(camWrap);
      buttons.appendChild(camBtn);
    }

    if (showSpeaker) {
      const spkBtn = document.createElement("button");
      spkBtn.type = "button";
      spkBtn.className = CB_BTN_CLASS;
      spkBtn.dataset.active = speakerOn ? "true" : "false";
      spkBtn.setAttribute("aria-label", speakerOn ? "스피커 끄기" : "스피커 켜기");
      spkBtn.setAttribute("aria-pressed", String(speakerOn));
      spkBtn.addEventListener("click", () => {
        const next = !speakerOn;
        if (next) this.setAttribute("speaker-on", "");
        else this.removeAttribute("speaker-on");
        this._dispatch("nds-call-speaker-change", { on: next });
      });
      spkBtn.appendChild(SpeakerIcon());
      buttons.appendChild(spkBtn);
    }

    const endBtn = document.createElement("button");
    endBtn.type = "button";
    endBtn.className = `${CB_BTN_CLASS} ${CB_END_CLASS}`;
    endBtn.setAttribute("aria-label", "통화 종료");
    endBtn.addEventListener("click", () => this._dispatch("nds-call-end"));
    endBtn.appendChild(PhoneEndIcon());
    buttons.appendChild(endBtn);

    this._root.appendChild(buttons);
  }
}

define(NdsCallControlBar);
