/**
 * <nds-progress-bar> — DS ProgressBar 의 vanilla Web Component 버전.
 *
 * DOM 구조 (React ProgressBar.tsx 와 동일):
 *   <nds-progress-bar value="40" max="100" size="md"></nds-progress-bar>
 *     └─ <div class="nds-progress-bar" data-slot="root" data-size="md"
 *             role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">
 *          └─ <div class="nds-progress-bar__track" data-slot="track" style="--nds-progress-height: 8px">
 *               └─ <div class="nds-progress-bar__fill" data-slot="fill" style="width: 40%"></div>
 *        </div>
 */

import { NdsElement, define } from "../base/nds-element.js";

const PB_CLASS = "nds-progress-bar";
const PB_TRACK_CLASS = `${PB_CLASS}__track`;
const PB_FILL_CLASS = `${PB_CLASS}__fill`;

export type ProgressBarSize = "sm" | "md" | "lg";

const SIZE_CONFIG: Record<ProgressBarSize, number> = {
  sm: 4,
  md: 8,
  lg: 12,
};

const SIZE_NAMES = Object.keys(SIZE_CONFIG) as ProgressBarSize[];
const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsProgressBar extends NdsElement {
  static elementName = "nds-progress-bar";

  static get observedAttributes(): readonly string[] {
    return ["value", "max", "size", "color", ...FORWARDED_ATTRS];
  }

  private _root: HTMLDivElement | null = null;
  private _track: HTMLDivElement | null = null;
  private _fill: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    const track = document.createElement("div");
    const fill = document.createElement("div");

    root.className = PB_CLASS;
    root.dataset.slot = "root";
    root.setAttribute("role", "progressbar");

    track.className = PB_TRACK_CLASS;
    track.dataset.slot = "track";

    fill.className = PB_FILL_CLASS;
    fill.dataset.slot = "fill";

    track.appendChild(fill);
    root.appendChild(track);
    this.appendChild(root);

    this._root = root;
    this._track = track;
    this._fill = fill;
  }

  protected update(): void {
    if (!this._root || !this._track || !this._fill) return;

    if (this.style.display !== "contents") {
      this.style.display = "contents";
    }

    const value = this._numberAttr("value", 0);
    const max = this._numberAttr("max", 100);
    const safeMax = max > 0 ? max : 100;
    const percent = clamp((value / safeMax) * 100, 0, 100);
    const size = this._normalizedSize();

    this._root.dataset.size = size;
    this._root.setAttribute("aria-valuenow", String(value));
    this._root.setAttribute("aria-valuemin", "0");
    this._root.setAttribute("aria-valuemax", String(safeMax));

    this._track.style.setProperty("--nds-progress-height", `${SIZE_CONFIG[size]}px`);
    this._fill.style.width = `${percent}%`;

    const color = this.getAttribute("color");
    if (color === null || color.trim() === "") {
      this._track.style.removeProperty("--nds-progress-fill-bg");
    } else {
      this._track.style.setProperty("--nds-progress-fill-bg", color);
    }

    for (const name of FORWARDED_ATTRS) {
      const attrValue = this.getAttribute(name);
      if (attrValue === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, attrValue);
    }
  }

  private _numberAttr(name: string, fallback: number): number {
    const value = this.getAttribute(name);
    if (value === null || value.trim() === "") return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private _normalizedSize(): ProgressBarSize {
    const value = this.attr("size", "md");
    return (SIZE_NAMES as readonly string[]).includes(value) ? (value as ProgressBarSize) : "md";
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

define(NdsProgressBar);
