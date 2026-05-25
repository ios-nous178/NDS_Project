/**
 * <nds-voice-recorder> — DS VoiceRecorder 의 vanilla Web Component 버전.
 *
 * 외부 타이머 패턴 — `seconds` 가 외부 controlled 값. host 는 버튼 UI 만 담당.
 *
 * 사용 패턴:
 *   <nds-voice-recorder state="idle" seconds="0" max-seconds="180"></nds-voice-recorder>
 *
 *   const rec = document.querySelector('nds-voice-recorder');
 *   rec.addEventListener('state-change', (e) => {
 *     rec.setAttribute('state', e.detail.state);
 *     // 그리고 setInterval 로 seconds 직접 갱신
 *   });
 *   rec.addEventListener('complete', (e) => { console.log('녹음 길이', e.detail.seconds); });
 *
 * 이벤트:
 *   state-change (detail: { state: "idle" | "recording" | "paused" })
 *   complete (detail: { seconds })
 */

import { NdsElement, define } from "../base/nds-element.js";

const VR_CLASS = "nds-voice-recorder";
const VR_BTN_CLASS = `${VR_CLASS}__btn`;
const VR_TIMER_CLASS = `${VR_CLASS}__timer`;
const VR_INDICATOR_CLASS = `${VR_CLASS}__indicator`;
const VR_LABEL_CLASS = `${VR_CLASS}__label`;
const VR_INFO_CLASS = `${VR_CLASS}__info`;

type State = "idle" | "recording" | "paused";

const formatTime = (sec: number): string => {
  const safe = Math.max(0, Math.floor(sec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const StopSvg = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<rect x="6" y="6" width="12" height="12" rx="2"/>`;
  return svg;
};

const MicSvg = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <rect x="9" y="3" width="6" height="12" rx="3" fill="currentColor"/>
    <path d="M5 11c0 4 3 7 7 7s7-3 7-7M12 18v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  `;
  return svg;
};

export class NdsVoiceRecorder extends NdsElement {
  static elementName = "nds-voice-recorder";

  static get observedAttributes(): readonly string[] {
    return ["state", "seconds", "max-seconds", "idle-label", "recording-label"];
  }

  private _root: HTMLDivElement | null = null;
  private _btn: HTMLButtonElement | null = null;
  private _timer: HTMLSpanElement | null = null;
  private _statusLabel: HTMLSpanElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _state(): State {
    const v = this.getAttribute("state");
    if (v === "recording" || v === "paused") return v;
    return "idle";
  }

  private _emitState(state: State): void {
    this.setAttribute("state", state);
    this.dispatchEvent(
      new CustomEvent("state-change", {
        detail: { state },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = VR_CLASS;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = VR_BTN_CLASS;
    btn.addEventListener("click", () => {
      const cur = this._state();
      const seconds = parseInt(this.attr("seconds", "0"), 10) || 0;
      if (cur === "idle") {
        this._emitState("recording");
      } else {
        this._emitState("idle");
        this.dispatchEvent(
          new CustomEvent("complete", {
            detail: { seconds },
            bubbles: true,
            composed: true,
          }),
        );
      }
    });

    const info = document.createElement("div");
    info.className = VR_INFO_CLASS;

    const timer = document.createElement("span");
    timer.className = VR_TIMER_CLASS;

    const statusLabel = document.createElement("span");

    info.append(timer, statusLabel);

    root.append(btn, info);
    this.appendChild(root);

    this._root = root;
    this._btn = btn;
    this._timer = timer;
    this._statusLabel = statusLabel;
  }

  protected update(): void {
    if (!this._root || !this._btn || !this._timer || !this._statusLabel) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const state = this._state();
    const seconds = parseInt(this.attr("seconds", "0"), 10) || 0;
    const maxAttr = this.getAttribute("max-seconds");
    const maxSeconds = maxAttr ? parseInt(maxAttr, 10) : undefined;
    const idleLabel = this.attr("idle-label", "버튼을 눌러 녹음을 시작하세요");
    const recordingLabel = this.attr("recording-label", "녹음 중");

    // 자동 종료 (max 도달)
    if (maxSeconds && state === "recording" && seconds >= maxSeconds) {
      this._emitState("idle");
      this.dispatchEvent(
        new CustomEvent("complete", {
          detail: { seconds },
          bubbles: true,
          composed: true,
        }),
      );
      return;
    }

    this._root.dataset.state = state;
    const isRecording = state !== "idle";

    this._btn.dataset.state = state;
    this._btn.setAttribute("aria-label", isRecording ? "녹음 중지" : "녹음 시작");
    this._btn.replaceChildren(isRecording ? StopSvg() : MicSvg());

    this._timer.replaceChildren();
    this._timer.append(formatTime(seconds));
    if (maxSeconds) {
      const sub = document.createElement("span");
      sub.style.fontSize = "14px";
      sub.style.color = "var(--semantic-text-subtle)";
      sub.style.marginLeft = "6px";
      sub.style.fontWeight = "500";
      sub.textContent = ` / ${formatTime(maxSeconds)}`;
      this._timer.appendChild(sub);
    }

    this._statusLabel.className = isRecording ? VR_INDICATOR_CLASS : VR_LABEL_CLASS;
    this._statusLabel.textContent = isRecording ? recordingLabel : idleLabel;
  }
}

define(NdsVoiceRecorder);
