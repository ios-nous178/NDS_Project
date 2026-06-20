/**
 * <nds-toggle> — DS Toggle 의 vanilla Web Component 버전.
 *
 * DOM 구조 (React Toggle.tsx 와 동일):
 *   <nds-toggle checked label="알림 받기" size="md"></nds-toggle>
 *     └─ <label class="nds-toggle" data-slot="root" data-disabled="false">
 *          ├─ <input type="checkbox" role="switch" aria-checked="true" ...>
 *          ├─ <span class="nds-toggle__track" data-slot="track" data-checked="true" style="...">
 *          │    └─ <span class="nds-toggle__thumb" data-slot="thumb"></span>
 *          └─ <span class="nds-toggle__label" data-slot="label">알림 받기</span>
 *        </label>
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const TG_CLASS = "nds-toggle";
const TG_TRACK_CLASS = `${TG_CLASS}__track`;
const TG_THUMB_CLASS = `${TG_CLASS}__thumb`;
const TG_LABEL_CLASS = `${TG_CLASS}__label`;
const TG_INNER_LABELS_CLASS = `${TG_CLASS}__inner-labels`;
const TG_INNER_LABEL_CLASS = `${TG_CLASS}__inner-label`;
// 라벨 내장(status) 변형 — react Toggle 의 LABELED 와 동일 (Figma 캐포비 노출 토글 3172:577).
const LABELED = { trackH: 30, thumbSize: 25, thumbOffset: 2.5 } as const;

export type ToggleSize = "md" | "sm";

const SIZE_CONFIG: Record<
  ToggleSize,
  { trackW: number; trackH: number; thumbSize: number; thumbOffset: number }
> = {
  md: { trackW: 44, trackH: 24, thumbSize: 18, thumbOffset: 3 },
  sm: { trackW: 36, trackH: 20, thumbSize: 16, thumbOffset: 2 },
};

const SIZE_NAMES = Object.keys(SIZE_CONFIG) as ToggleSize[];

const FORWARDED_ATTRS = [
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "name",
  "value",
  "form",
  "required",
  "autofocus",
  "tabindex",
] as const;

let nextToggleId = 0;

export class NdsToggle extends NdsElement {
  static elementName = "nds-toggle";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-toggle"].observedAttributes, "label", "on-label", "off-label", "input-id", ...FORWARDED_ATTRS];
  }

  private _root: HTMLLabelElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _track: HTMLSpanElement | null = null;
  private _label: HTMLSpanElement | null = null;
  private _innerLabels: HTMLSpanElement | null = null;
  private _onLabel: HTMLSpanElement | null = null;
  private _offLabel: HTMLSpanElement | null = null;
  private _inputId = "";

  /**
   * 켜짐 상태 — 네이티브 `<input>.checked` 와 동일하게 host 프로퍼티로 노출.
   * 읽기 = `checked` 속성 반영, 쓰기 = 속성 토글(→ update 가 inner input 동기화).
   * 프로그래매틱 set 은 네이티브와 동일하게 `change` 를 발화하지 않음(사용자 입력 시에만 발화).
   */
  get checked(): boolean {
    return this.boolAttr("checked");
  }

  set checked(value: boolean) {
    if (value) this.setAttribute("checked", "");
    else this.removeAttribute("checked");
  }

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._inputId = this.attr("input-id", `nds-toggle-${++nextToggleId}`);

    const root = document.createElement("label");
    const input = document.createElement("input");
    const track = document.createElement("span");
    const thumb = document.createElement("span");
    const label = document.createElement("span");

    root.className = TG_CLASS;
    root.dataset.slot = "root";
    root.htmlFor = this._inputId;

    input.type = "checkbox";
    input.role = "switch";
    input.id = this._inputId;
    input.addEventListener("change", () => {
      if (input.checked) this.setAttribute("checked", "");
      else this.removeAttribute("checked");
      this.dispatchEvent(new Event("change", { bubbles: true }));
    });

    track.className = TG_TRACK_CLASS;
    track.dataset.slot = "track";

    thumb.className = TG_THUMB_CLASS;
    thumb.dataset.slot = "thumb";
    track.appendChild(thumb);

    label.className = TG_LABEL_CLASS;
    label.dataset.slot = "label";
    while (this.firstChild) {
      label.appendChild(this.firstChild);
    }

    root.append(input, track);
    if (label.childNodes.length > 0 || this.hasAttribute("label")) root.appendChild(label);
    this.appendChild(root);

    this._root = root;
    this._input = input;
    this._track = track;
    this._label = label;
  }

  protected update(): void {
    if (!this._root || !this._input || !this._track) return;

    if (this.style.display !== "contents") {
      this.style.display = "contents";
    }

    const checked = this.boolAttr("checked");
    const disabled = this.boolAttr("disabled");
    const size = this._normalizedSize();
    const inputId = this.attr("input-id", this._inputId);
    const cfg = SIZE_CONFIG[size];
    const thumbTravel = cfg.trackW - cfg.thumbSize - cfg.thumbOffset * 2;

    if (inputId !== this._inputId) {
      this._inputId = inputId;
      this._input.id = inputId;
      this._root.htmlFor = inputId;
    }

    this._root.dataset.disabled = disabled ? "true" : "false";
    this._input.checked = checked;
    this._input.disabled = disabled;
    this._input.setAttribute("aria-checked", checked ? "true" : "false");
    this._track.dataset.checked = checked ? "true" : "false";

    // on-label/off-label 중 하나라도 있으면 라벨 내장(status) 변형 — 폭 auto + 큰 썸.
    const labeled =
      this.getAttribute("on-label") !== null || this.getAttribute("off-label") !== null;
    this._track.dataset.labeled = labeled ? "true" : "false";
    this._track.dataset.tone = this.attr("tone", "project");

    if (labeled) {
      this._track.style.removeProperty("--nds-toggle-track-w");
      this._track.style.setProperty("--nds-toggle-track-h", `${LABELED.trackH}px`);
      this._track.style.setProperty("--nds-toggle-thumb-size", `${LABELED.thumbSize}px`);
      this._track.style.setProperty("--nds-toggle-thumb-offset", `${LABELED.thumbOffset}px`);
      this._track.style.removeProperty("--nds-toggle-thumb-travel");
    } else {
      this._track.style.setProperty("--nds-toggle-track-w", `${cfg.trackW}px`);
      this._track.style.setProperty("--nds-toggle-track-h", `${cfg.trackH}px`);
      this._track.style.setProperty("--nds-toggle-thumb-size", `${cfg.thumbSize}px`);
      this._track.style.setProperty("--nds-toggle-thumb-offset", `${cfg.thumbOffset}px`);
      this._track.style.setProperty("--nds-toggle-thumb-travel", `${thumbTravel}px`);
    }

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._input.removeAttribute(name);
      else this._input.setAttribute(name, value);
    }

    this._syncLabel();
    this._syncInnerLabel(labeled);
  }

  // 트랙 안 on/off 라벨 — 두 라벨을 한 셀에 스택(셀 폭=긴 라벨 기준 고정폭). 활성 라벨만 보이고
  // 라벨셀↔썸 좌우 위치는 CSS order(track[data-checked])가 결정 (DOM 순서 아님).
  private _syncInnerLabel(labeled: boolean): void {
    if (!this._track) return;
    if (!labeled) {
      this._innerLabels?.remove();
      this._innerLabels = null;
      this._onLabel = null;
      this._offLabel = null;
      return;
    }
    if (!this._innerLabels) {
      const cell = document.createElement("span");
      cell.className = TG_INNER_LABELS_CLASS;
      cell.dataset.slot = "inner-labels";
      const on = document.createElement("span");
      on.className = TG_INNER_LABEL_CLASS;
      on.dataset.slot = "inner-label";
      on.dataset.state = "on";
      const off = document.createElement("span");
      off.className = TG_INNER_LABEL_CLASS;
      off.dataset.slot = "inner-label";
      off.dataset.state = "off";
      cell.append(on, off);
      this._innerLabels = cell;
      this._onLabel = on;
      this._offLabel = off;
    }
    this._onLabel!.textContent = this.getAttribute("on-label") ?? "";
    this._offLabel!.textContent = this.getAttribute("off-label") ?? "";
    if (this._innerLabels.parentElement !== this._track) {
      const thumb = this._track.querySelector<HTMLElement>('[data-slot="thumb"]');
      this._track.insertBefore(this._innerLabels, thumb);
    }
  }

  private _syncLabel(): void {
    if (!this._root || !this._label) return;
    const labelText = this.getAttribute("label");
    if (labelText !== null) {
      this._label.textContent = labelText;
    }
    if (this._label.childNodes.length > 0 && !this._label.isConnected) {
      this._root.appendChild(this._label);
    }
    if (this._label.childNodes.length === 0 && this._label.isConnected) {
      this._label.remove();
    }
  }

  private _normalizedSize(): ToggleSize {
    const value = this.attr("size", "md");
    return (SIZE_NAMES as readonly string[]).includes(value) ? (value as ToggleSize) : "md";
  }
}

define(NdsToggle);
