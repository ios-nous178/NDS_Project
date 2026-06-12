/**
 * <nds-audio-player> — DS AudioPlayer 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-audio-player
 *     title="마음을 편안하게 하는 명상"
 *     subtitle="10분 가이드"
 *     current-time="45"
 *     duration="600"
 *     playing="false"
 *   ></nds-audio-player>
 *
 * 이벤트:
 *   audio-play-pause (detail: { playing }) -> 재생/일시정지 토글
 *   audio-seek (detail: { time }) -> 시크
 *   audio-skip-back -> 이전 트랙
 *   audio-skip-forward -> 다음 트랙
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const AP_CLASS = "nds-audio-player";
const AP_HEAD_CLASS = `${AP_CLASS}__head`;
const AP_TITLE_CLASS = `${AP_CLASS}__title`;
const AP_SUBTITLE_CLASS = `${AP_CLASS}__subtitle`;
const AP_TRACK_CLASS = `${AP_CLASS}__track`;
const AP_FILL_CLASS = `${AP_CLASS}__fill`;
const AP_INPUT_CLASS = `${AP_CLASS}__input`;
const AP_TIMES_CLASS = `${AP_CLASS}__times`;
const AP_TIME_CLASS = `${AP_CLASS}__time`;
const AP_CONTROLS_CLASS = `${AP_CLASS}__controls`;
const AP_BUTTON_CLASS = `${AP_CLASS}__button`;
const AP_PLAY_CLASS = `${AP_CLASS}__play`;

const fmtTime = (sec: number): string => {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
};

const PlayIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "22");
  svg.setAttribute("height", "22");
  svg.setAttribute("viewBox", "0 0 22 22");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M7 5L17 11L7 17V5Z" fill="currentColor" />`;
  return svg;
};

const PauseIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "22");
  svg.setAttribute("height", "22");
  svg.setAttribute("viewBox", "0 0 22 22");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <rect x="6" y="5" width="3.5" height="12" rx="1" fill="currentColor" />
    <rect x="12.5" y="5" width="3.5" height="12" rx="1" fill="currentColor" />
  `;
  return svg;
};

const SkipBackIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <path
      d="M4 5V15M16 5L8 10L16 15V5Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="currentColor"
      fill-opacity="0.2"
    />
  `;
  return svg;
};

const SkipForwardIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <path
      d="M16 5V15M4 5L12 10L4 15V5Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="currentColor"
      fill-opacity="0.2"
    />
  `;
  return svg;
};

export class NdsAudioPlayer extends NdsElement {
  static elementName = "nds-audio-player";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-audio-player"].observedAttributes, "title", "subtitle"];
  }

  private _root: HTMLDivElement | null = null;
  private _head: HTMLDivElement | null = null;
  private _titleEl: HTMLParagraphElement | null = null;
  private _subtitleEl: HTMLSpanElement | null = null;
  private _fill: HTMLSpanElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _curTimeEl: HTMLSpanElement | null = null;
  private _durTimeEl: HTMLSpanElement | null = null;
  private _skipBackBtn: HTMLButtonElement | null = null;
  private _playBtn: HTMLButtonElement | null = null;
  private _skipForwardBtn: HTMLButtonElement | null = null;
  private _playingIcon: boolean | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  /**
   * DOM 골격 1회 구성 — update() 는 텍스트/값/표시 여부만 반영한다.
   * (update() 에서 range input 을 재생성하면 시크 드래그 중 포커스가 유실되는
   * AddressPicker 류 회귀 — packages/html/test/nds-audio-player.test.ts 가 잠근다.)
   */
  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = AP_CLASS;

    // Head
    const head = document.createElement("div");
    head.dataset.slot = "head";
    head.className = AP_HEAD_CLASS;

    const titleEl = document.createElement("p");
    titleEl.dataset.slot = "title";
    titleEl.className = AP_TITLE_CLASS;

    const subtitleEl = document.createElement("span");
    subtitleEl.dataset.slot = "subtitle";
    subtitleEl.className = AP_SUBTITLE_CLASS;

    head.append(titleEl, subtitleEl);

    // Track
    const track = document.createElement("div");
    track.dataset.slot = "track";
    track.className = AP_TRACK_CLASS;

    const fill = document.createElement("span");
    fill.setAttribute("aria-hidden", "true");
    fill.className = AP_FILL_CLASS;

    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.step = "1";
    input.className = AP_INPUT_CLASS;
    input.setAttribute("aria-label", "재생 위치");
    input.addEventListener("input", (e) => {
      const time = parseFloat((e.target as HTMLInputElement).value);
      this.dispatchEvent(
        new CustomEvent("audio-seek", { detail: { time }, bubbles: true, composed: true }),
      );
    });

    track.append(fill, input);

    // Times
    const times = document.createElement("div");
    times.dataset.slot = "times";
    times.className = AP_TIMES_CLASS;

    const curTimeSpan = document.createElement("span");
    curTimeSpan.dataset.slot = "time";
    curTimeSpan.className = AP_TIME_CLASS;

    const durTimeSpan = document.createElement("span");
    durTimeSpan.dataset.slot = "time";
    durTimeSpan.className = AP_TIME_CLASS;

    times.append(curTimeSpan, durTimeSpan);

    // Controls
    const controls = document.createElement("div");
    controls.dataset.slot = "controls";
    controls.className = AP_CONTROLS_CLASS;

    const skipBack = document.createElement("button");
    skipBack.type = "button";
    skipBack.dataset.slot = "skip-back";
    skipBack.className = AP_BUTTON_CLASS;
    skipBack.setAttribute("aria-label", "이전");
    skipBack.appendChild(SkipBackIcon());
    skipBack.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("audio-skip-back", { bubbles: true, composed: true }));
    });

    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.dataset.slot = "play";
    playBtn.className = AP_PLAY_CLASS;
    playBtn.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("audio-play-pause", {
          detail: { playing: !this.boolAttr("playing") },
          bubbles: true,
          composed: true,
        }),
      );
    });

    const skipForward = document.createElement("button");
    skipForward.type = "button";
    skipForward.dataset.slot = "skip-forward";
    skipForward.className = AP_BUTTON_CLASS;
    skipForward.setAttribute("aria-label", "다음");
    skipForward.appendChild(SkipForwardIcon());
    skipForward.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("audio-skip-forward", { bubbles: true, composed: true }));
    });

    controls.append(skipBack, playBtn, skipForward);

    root.append(head, track, times, controls);
    this.appendChild(root);

    this._root = root;
    this._head = head;
    this._titleEl = titleEl;
    this._subtitleEl = subtitleEl;
    this._fill = fill;
    this._input = input;
    this._curTimeEl = curTimeSpan;
    this._durTimeEl = durTimeSpan;
    this._skipBackBtn = skipBack;
    this._playBtn = playBtn;
    this._skipForwardBtn = skipForward;
  }

  protected update(): void {
    if (!this._root || !this._input) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const title = this.getAttribute("title");
    const subtitle = this.getAttribute("subtitle");
    const playing = this.boolAttr("playing");
    const currentTime = parseFloat(this.attr("current-time", "0"));
    const duration = parseFloat(this.attr("duration", "0"));
    const skippable = this.hasAttribute("skippable");

    const safeDuration = duration > 0 ? duration : 1;
    const percent = Math.min(100, Math.max(0, (currentTime / safeDuration) * 100));

    // Head — 텍스트만 반영, 없으면 숨김
    if (this._head) this._head.style.display = title || subtitle ? "" : "none";
    if (this._titleEl) {
      this._titleEl.textContent = title ?? "";
      this._titleEl.style.display = title ? "" : "none";
    }
    if (this._subtitleEl) {
      this._subtitleEl.textContent = subtitle ?? "";
      this._subtitleEl.style.display = subtitle ? "" : "none";
    }

    // Track — 기존 input 에 값만 반영 (재생성 금지)
    if (this._fill) this._fill.style.width = `${percent}%`;
    this._input.max = String(duration);
    const value = String(Math.min(currentTime, duration));
    if (this._input.value !== value) this._input.value = value;

    // Times
    if (this._curTimeEl) this._curTimeEl.textContent = fmtTime(currentTime);
    if (this._durTimeEl) this._durTimeEl.textContent = fmtTime(duration);

    // Controls
    if (this._skipBackBtn) this._skipBackBtn.style.display = skippable ? "" : "none";
    if (this._skipForwardBtn) this._skipForwardBtn.style.display = skippable ? "" : "none";
    if (this._playBtn) {
      this._playBtn.setAttribute("aria-label", playing ? "일시정지" : "재생");
      if (this._playingIcon !== playing) {
        this._playingIcon = playing;
        this._playBtn.replaceChildren(playing ? PauseIcon() : PlayIcon());
      }
    }
  }
}

define(NdsAudioPlayer);
