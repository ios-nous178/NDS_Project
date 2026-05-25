/**
 * <nds-waveform-player> — DS WaveformPlayer 의 vanilla Web Component 버전.
 *
 * 음성 메모용 파형 + 재생 컨트롤. 기본 <audio> 를 내부에 둠.
 *
 * 사용 패턴:
 *   <nds-waveform-player src="/voice.mp3" bars="36" color="#5C97F2"></nds-waveform-player>
 *   <nds-waveform-player src="/voice.mp3" peaks="[0.3,0.5,0.7,...]"></nds-waveform-player>
 *
 * 속성:
 *   src: 오디오 src
 *   peaks: JSON 배열 (0~1 값). 미지정 시 src 기반 의사 랜덤
 *   bars: 막대 개수 (기본 36)
 *   color: 사용자 보이스 컬러 → --nds-waveform-color
 *   duration: 외부 지정 길이 (초)
 *   autoplay
 */

import { NdsElement, define } from "../base/nds-element.js";

const WP_CLASS = "nds-waveform-player";
const WP_BTN_CLASS = `${WP_CLASS}__btn`;
const WP_BARS_CLASS = `${WP_CLASS}__bars`;
const WP_BAR_CLASS = `${WP_CLASS}__bar`;
const WP_TIME_CLASS = `${WP_CLASS}__time`;

const formatTime = (s: number): string => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

const pseudoPeaks = (n: number, src: string): number[] => {
  let h = 0;
  for (let i = 0; i < src.length; i++) h = (h * 31 + src.charCodeAt(i)) | 0;
  return Array.from({ length: n }, () => {
    h = (h * 1664525 + 1013904223) | 0;
    return 0.25 + Math.abs(h % 1000) / 1500;
  });
};

const PlaySvg = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 14 14");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M4 3v8l7-4z"/>`;
  return svg;
};

const PauseSvg = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 14 14");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<rect x="3" y="3" width="3" height="8" rx="1"/><rect x="8" y="3" width="3" height="8" rx="1"/>`;
  return svg;
};

export class NdsWaveformPlayer extends NdsElement {
  static elementName = "nds-waveform-player";

  static get observedAttributes(): readonly string[] {
    return ["src", "peaks", "bars", "color", "duration", "autoplay"];
  }

  private _root: HTMLDivElement | null = null;
  private _audio: HTMLAudioElement | null = null;
  private _btn: HTMLButtonElement | null = null;
  private _barsEl: HTMLDivElement | null = null;
  private _time: HTMLSpanElement | null = null;

  private _playing = false;
  private _progress = 0;
  private _duration = 0;
  private _currentSrc = "";

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = WP_CLASS;

    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.addEventListener("play", () => {
      this._playing = true;
      this._renderBtn();
    });
    audio.addEventListener("pause", () => {
      this._playing = false;
      this._renderBtn();
    });
    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        this._progress = (audio.currentTime / audio.duration) * 100;
        this._renderBars();
      }
    });
    audio.addEventListener("loadedmetadata", () => {
      if (!this.getAttribute("duration")) {
        this._duration = audio.duration || 0;
        this._renderTime();
      }
    });

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = WP_BTN_CLASS;
    btn.addEventListener("click", () => {
      if (!this._audio) return;
      if (this._audio.paused) this._audio.play().catch(() => undefined);
      else this._audio.pause();
    });

    const bars = document.createElement("div");
    bars.className = WP_BARS_CLASS;
    bars.addEventListener("click", (e) => this._onSeek(e));

    const time = document.createElement("span");
    time.className = WP_TIME_CLASS;

    root.append(audio, btn, bars, time);
    this.appendChild(root);

    this._root = root;
    this._audio = audio;
    this._btn = btn;
    this._barsEl = bars;
    this._time = time;
  }

  private _onSeek(e: MouseEvent): void {
    if (!this._barsEl || !this._audio || !this._audio.duration) return;
    const rect = this._barsEl.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    this._audio.currentTime = this._audio.duration * Math.max(0, Math.min(1, ratio));
  }

  private _peaks(): number[] {
    const raw = this.getAttribute("peaks");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed as number[];
      } catch {
        /* ignore */
      }
    }
    const bars = parseInt(this.attr("bars", "36"), 10) || 36;
    return pseudoPeaks(bars, this.attr("src", ""));
  }

  private _renderBtn(): void {
    if (!this._btn) return;
    this._btn.setAttribute("aria-label", this._playing ? "일시정지" : "재생");
    this._btn.replaceChildren(this._playing ? PauseSvg() : PlaySvg());
  }

  private _renderBars(): void {
    if (!this._barsEl) return;
    const peaks = this._peaks();
    const items = peaks.map((p, i) => {
      const playedRatio = i / peaks.length;
      const isPlayed = playedRatio * 100 < this._progress;
      const bar = document.createElement("div");
      bar.className = WP_BAR_CLASS;
      bar.dataset.played = isPlayed ? "true" : "false";
      bar.style.setProperty("--bar-h", `${Math.max(20, p * 100)}%`);
      return bar;
    });
    this._barsEl.replaceChildren(...items);
  }

  private _renderTime(): void {
    if (!this._time) return;
    this._time.textContent = formatTime(this._duration);
  }

  protected update(): void {
    if (!this._root || !this._audio) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const src = this.attr("src", "");
    if (src !== this._currentSrc) {
      this._currentSrc = src;
      this._audio.src = src;
      this._playing = false;
      this._progress = 0;
    }

    const autoplay = this.boolAttr("autoplay");
    this._audio.autoplay = autoplay;

    const color = this.getAttribute("color");
    if (color) this._root.style.setProperty("--nds-waveform-color", color);
    else this._root.style.removeProperty("--nds-waveform-color");

    const durAttr = this.getAttribute("duration");
    if (durAttr !== null) {
      const d = parseFloat(durAttr);
      if (!Number.isNaN(d)) this._duration = d;
    }

    this._renderBtn();
    this._renderBars();
    this._renderTime();
  }
}

define(NdsWaveformPlayer);
