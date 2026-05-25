/**
 * <nds-video-player> — DS VideoPlayer 의 vanilla Web Component 버전.
 *
 * 사용 패턴:
 *   <nds-video-player src="/intro.mp4" poster="/intro.jpg" title="시작하기" duration-label="3:42"></nds-video-player>
 *
 * 속성:
 *   src / poster / title / duration-label
 *   autoplay / muted / loop
 *   native-controls — 기본 false (커스텀 UI). true 면 native controls 만 노출
 *   aspect-ratio (기본 "16 / 9")
 *
 * 이벤트:
 *   video-end — 종료 시 발생
 */

import { NdsElement, define } from "../base/nds-element.js";

const VP_CLASS = "nds-video-player";
const VP_VIDEO_CLASS = `${VP_CLASS}__video`;
const VP_OVERLAY_CLASS = `${VP_CLASS}__overlay`;
const VP_PLAY_BTN_CLASS = `${VP_CLASS}__play-btn`;
const VP_TITLE_CLASS = `${VP_CLASS}__title`;
const VP_DURATION_CLASS = `${VP_CLASS}__duration`;
const VP_CONTROLS_CLASS = `${VP_CLASS}__controls`;
const VP_TRACK_CLASS = `${VP_CLASS}__track`;
const VP_FILL_CLASS = `${VP_CLASS}__fill`;
const VP_INPUT_CLASS = `${VP_CLASS}__input`;
const VP_BTN_CLASS = `${VP_CLASS}__btn`;

const formatTime = (s: number): string => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

const PlaySvg = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M8 5v14l11-7z"/>`;
  return svg;
};

const PauseSvg = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>`;
  return svg;
};

export class NdsVideoPlayer extends NdsElement {
  static elementName = "nds-video-player";

  static get observedAttributes(): readonly string[] {
    return [
      "src",
      "poster",
      "title",
      "duration-label",
      "autoplay",
      "muted",
      "loop",
      "native-controls",
      "aspect-ratio",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _video: HTMLVideoElement | null = null;
  private _overlay: HTMLDivElement | null = null;

  private _playing = false;
  private _progress = 0;
  private _duration = 0;
  private _interacted = false;
  private _currentSrc = "";
  private _currentPoster = "";

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = VP_CLASS;

    const video = document.createElement("video");
    video.className = VP_VIDEO_CLASS;
    video.setAttribute("playsinline", "");
    video.preload = "metadata";
    video.addEventListener("play", () => {
      this._playing = true;
      this._renderOverlay();
    });
    video.addEventListener("pause", () => {
      this._playing = false;
      this._renderOverlay();
    });
    video.addEventListener("timeupdate", () => {
      if (video.duration) {
        this._progress = (video.currentTime / video.duration) * 100;
        this._renderOverlay();
      }
    });
    video.addEventListener("loadedmetadata", () => {
      this._duration = video.duration || 0;
      this._renderOverlay();
    });
    video.addEventListener("ended", () => {
      this._playing = false;
      this._renderOverlay();
      this.dispatchEvent(new CustomEvent("video-end", { bubbles: true, composed: true }));
    });

    const overlay = document.createElement("div");
    overlay.className = VP_OVERLAY_CLASS;
    overlay.dataset.slot = "overlay";

    root.append(video, overlay);
    this.appendChild(root);

    this._root = root;
    this._video = video;
    this._overlay = overlay;
  }

  private _togglePlay(): void {
    if (!this._video) return;
    if (this._video.paused) this._video.play().catch(() => undefined);
    else this._video.pause();
    this._interacted = true;
  }

  private _renderOverlay(): void {
    if (!this._video || !this._overlay) return;
    const native = this.boolAttr("native-controls");
    if (native) {
      this._overlay.style.display = "none";
      this._video.controls = true;
      return;
    }
    this._video.controls = false;

    const title = this.getAttribute("title");
    const durationLabel = this.getAttribute("duration-label") || formatTime(this._duration);
    const showOverlay = !this._interacted || !this._playing;
    this._overlay.dataset.hide = this._interacted && this._playing ? "true" : "false";
    if (!showOverlay && !(this._interacted && this._playing)) {
      // when hide=true but no interaction yet, still show
    }

    const children: Node[] = [];
    if (title) {
      const titleEl = document.createElement("p");
      titleEl.className = VP_TITLE_CLASS;
      titleEl.textContent = title;
      children.push(titleEl);
    }
    if (durationLabel) {
      const durEl = document.createElement("span");
      durEl.className = VP_DURATION_CLASS;
      durEl.textContent = durationLabel;
      children.push(durEl);
    }

    if (!this._playing) {
      const playBtn = document.createElement("button");
      playBtn.type = "button";
      playBtn.className = VP_PLAY_BTN_CLASS;
      playBtn.setAttribute("aria-label", "재생");
      playBtn.appendChild(PlaySvg());
      playBtn.addEventListener("click", () => this._togglePlay());
      children.push(playBtn);
    }

    if (this._interacted && this._playing) {
      const controls = document.createElement("div");
      controls.className = VP_CONTROLS_CLASS;

      const pauseBtn = document.createElement("button");
      pauseBtn.type = "button";
      pauseBtn.className = VP_BTN_CLASS;
      pauseBtn.setAttribute("aria-label", "일시정지");
      pauseBtn.appendChild(PauseSvg());
      pauseBtn.addEventListener("click", () => this._togglePlay());

      const track = document.createElement("div");
      track.className = VP_TRACK_CLASS;

      const fill = document.createElement("div");
      fill.className = VP_FILL_CLASS;
      fill.style.setProperty("--nds-video-fill", `${this._progress}%`);

      const input = document.createElement("input");
      input.type = "range";
      input.min = "0";
      input.max = "100";
      input.step = "0.1";
      input.value = String(this._progress);
      input.className = VP_INPUT_CLASS;
      input.setAttribute("aria-label", "재생 위치");
      input.addEventListener("input", (e) => {
        if (!this._video || !this._video.duration) return;
        const pct = parseFloat((e.target as HTMLInputElement).value);
        this._video.currentTime = (pct / 100) * this._video.duration;
        this._progress = pct;
      });

      track.append(fill, input);
      controls.append(pauseBtn, track);
      children.push(controls);
    }

    this._overlay.replaceChildren(...children);
    this._overlay.style.display = "";
  }

  protected update(): void {
    if (!this._root || !this._video) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const src = this.attr("src", "");
    if (src !== this._currentSrc) {
      this._currentSrc = src;
      this._video.src = src;
      this._playing = false;
      this._progress = 0;
      this._interacted = this.boolAttr("autoplay");
    }
    const poster = this.attr("poster", "");
    if (poster !== this._currentPoster) {
      this._currentPoster = poster;
      if (poster) this._video.poster = poster;
      else this._video.removeAttribute("poster");
    }

    this._video.autoplay = this.boolAttr("autoplay");
    this._video.muted = this.boolAttr("muted");
    this._video.loop = this.boolAttr("loop");

    const aspect = this.attr("aspect-ratio", "16 / 9");
    this._root.style.setProperty("--nds-video-player-aspect", aspect);

    this._renderOverlay();
  }
}

define(NdsVideoPlayer);
