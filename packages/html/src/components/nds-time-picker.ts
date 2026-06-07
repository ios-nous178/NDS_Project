/**
 * <nds-time-picker> — DS TimePicker 의 vanilla Web Component 버전.
 *
 * React 버전과 동일하게 네이티브 시간 입력이 아니라 DS 팝오버 패널(시/분 컬럼)로 선택한다.
 * 빠른설정 프리셋 칩은 필드 트레일링(시계아이콘 우측)에 인라인으로 붙는다.
 *
 * 사용 예:
 *   <nds-time-picker
 *     label="알람 시간"
 *     value="09:30"
 *     min="06:00"
 *     max="22:00"
 *     step="300"
 *     helper-text="5분 단위로 선택할 수 있습니다"
 *   ></nds-time-picker>
 *
 * 이벤트:
 *   nds-time-change (detail: { value })
 *
 * 속성:
 *   value: "HH:mm"
 *   step: 초 단위 (default 300 = 5분) — 분 컬럼 간격으로 환산
 *   label / placeholder / helper-text
 *   error / full-width / disabled
 *   min / max: "HH:mm"
 *   presets: JSON [{ label, value }] — 빠른설정 칩. <script type="application/json" slot="presets"> 도 허용.
 *
 * React 버전의 Portal 은 미지원 — 패널은 inline absolute positioning.
 */

import { NdsElement, define } from "../base/nds-element.js";

const TP_CLASS = "nds-time-picker";
const TP_ROOT_CLASS = `${TP_CLASS}__root`;
const TP_LABEL_CLASS = `${TP_CLASS}__label`;
const TP_FIELD_CLASS = `${TP_CLASS}__field`;
const TP_TRIGGER_CLASS = `${TP_CLASS}__trigger`;
const TP_TRIGGER_TEXT_CLASS = `${TP_CLASS}__trigger-text`;
const TP_ICON_CLASS = `${TP_CLASS}__icon`;
const TP_PRESETS_CLASS = `${TP_CLASS}__presets`;
const TP_PRESET_CLASS = `${TP_CLASS}__preset`;
const TP_PANEL_CLASS = `${TP_CLASS}__panel`;
const TP_COLS_CLASS = `${TP_CLASS}__columns`;
const TP_COL_CLASS = `${TP_CLASS}__col`;
const TP_COL_HEAD_CLASS = `${TP_CLASS}__col-head`;
const TP_COL_LIST_CLASS = `${TP_CLASS}__col-list`;
const TP_OPTION_CLASS = `${TP_CLASS}__option`;
const TP_HELPER_CLASS = `${TP_CLASS}__helper`;

// 시계 아이콘 — Figma ic_time_picker (캐포비 Library 3001:19125) 의 ring + 시계바늘 path 그대로. 색은 currentColor.
const CLOCK_SVG =
  '<svg width="20" height="20" viewBox="0 0 20.5 20.5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
  '<path fill-rule="evenodd" clip-rule="evenodd" d="M9.58167 1.82397C4.33382 2.17163 0.73445 7.42529 2.10344 12.485C3.6885 18.3433 10.9148 20.6728 15.6216 16.7722C21.9684 11.5125 17.8328 1.27734 9.58167 1.82397V1.82397ZM10.8392 0.25L12.355 0.471973C16.1593 1.28052 19.2198 4.34185 20.0281 8.14775L20.25 9.66406V10.8359L20.0281 12.3522C19.2198 16.1579 16.1596 19.2194 12.355 20.028L10.8392 20.25H9.6678L8.15203 20.028C4.34749 19.2194 1.28723 16.1579 0.478982 12.3522L0.257058 10.8359C0.273366 10.4484 0.234939 10.0505 0.257058 9.66406C0.543435 4.6668 4.67205 0.536475 9.6678 0.25H10.8392Z" fill="currentColor"/>' +
  '<path fill-rule="evenodd" clip-rule="evenodd" d="M10.087 4.90784C10.5621 4.82683 10.9265 5.09026 11.0251 5.55237L11.0418 9.91062L13.9239 12.1056C14.49 12.8384 13.7446 13.7372 12.9121 13.2741C11.865 12.6916 10.8111 11.5556 9.76652 10.913C9.57058 10.7542 9.49221 10.5156 9.47116 10.2709C9.34348 8.78752 9.56975 7.12346 9.47234 5.62082C9.51814 5.28318 9.73464 4.96794 10.087 4.90784" fill="currentColor"/>' +
  "</svg>";

interface TimePreset {
  label: string;
  value: string;
}

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const parseHM = (v: string): { h: number; m: number } | null => {
  const m = /^(\d{1,2}):(\d{2})$/.exec((v || "").trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return { h, m: min };
};
const toMinutes = (h: number, m: number) => h * 60 + m;

let nextId = 0;

export class NdsTimePicker extends NdsElement {
  static elementName = "nds-time-picker";

  static get observedAttributes(): readonly string[] {
    return [
      "value",
      "step",
      "label",
      "placeholder",
      "helper-text",
      "error",
      "full-width",
      "disabled",
      "min",
      "max",
      "presets",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;
  private _field: HTMLDivElement | null = null;
  private _trigger: HTMLButtonElement | null = null;
  private _triggerText: HTMLSpanElement | null = null;
  private _presetsEl: HTMLSpanElement | null = null;
  private _panel: HTMLDivElement | null = null;
  private _helper: HTMLParagraphElement | null = null;
  private _open = false;
  private _labelId = `nds-time-picker-${++nextId}`;

  private _onDocClick = (e: MouseEvent) => {
    if (!this._open || !this._root) return;
    if (!this._root.contains(e.target as Node)) {
      this._open = false;
      this.scheduleUpdate();
    }
  };
  private _onEsc = (e: KeyboardEvent) => {
    if (this._open && e.key === "Escape") {
      e.preventDefault();
      this._open = false;
      this._trigger?.focus();
      this.scheduleUpdate();
    }
  };

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
    document.addEventListener("mousedown", this._onDocClick);
    document.addEventListener("keydown", this._onEsc);
  }

  override disconnectedCallback(): void {
    document.removeEventListener("mousedown", this._onDocClick);
    document.removeEventListener("keydown", this._onEsc);
  }

  private _emit(value: string): void {
    this.setAttribute("value", value);
    this.dispatchEvent(
      new CustomEvent("nds-time-change", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
    this.scheduleUpdate();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = TP_ROOT_CLASS;

    const labelEl = document.createElement("span");
    labelEl.className = TP_LABEL_CLASS;
    labelEl.id = this._labelId;

    const field = document.createElement("div");
    field.dataset.slot = "field";
    field.className = TP_FIELD_CLASS;
    field.style.position = "relative";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.dataset.slot = "trigger";
    trigger.className = TP_TRIGGER_CLASS;
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.addEventListener("click", () => {
      if (this.boolAttr("disabled")) return;
      this._open = !this._open;
      this.scheduleUpdate();
    });

    const triggerText = document.createElement("span");
    triggerText.dataset.slot = "trigger-text";
    triggerText.className = TP_TRIGGER_TEXT_CLASS;

    const iconWrap = document.createElement("span");
    iconWrap.setAttribute("aria-hidden", "true");
    iconWrap.className = TP_ICON_CLASS;
    iconWrap.innerHTML = CLOCK_SVG;

    trigger.append(triggerText, iconWrap);

    const presetsEl = document.createElement("span");
    presetsEl.className = TP_PRESETS_CLASS;

    field.append(trigger, presetsEl);

    const helper = document.createElement("p");
    helper.className = TP_HELPER_CLASS;

    root.append(labelEl, field, helper);
    this.appendChild(root);

    this._root = root;
    this._labelEl = labelEl;
    this._field = field;
    this._trigger = trigger;
    this._triggerText = triggerText;
    this._presetsEl = presetsEl;
    this._helper = helper;
  }

  private _minuteStep(): number {
    const step = parseInt(this.attr("step", "300"), 10) || 300;
    return Math.min(60, Math.max(1, Math.round(step / 60)));
  }

  private _bounds(): { min: number | null; max: number | null } {
    const minP = parseHM(this.getAttribute("min") || "");
    const maxP = parseHM(this.getAttribute("max") || "");
    return {
      min: minP ? toMinutes(minP.h, minP.m) : null,
      max: maxP ? toMinutes(maxP.h, maxP.m) : null,
    };
  }

  private _inRange(mins: number, b: { min: number | null; max: number | null }): boolean {
    if (b.min != null && mins < b.min) return false;
    if (b.max != null && mins > b.max) return false;
    return true;
  }

  private _renderPanel(): void {
    if (!this._field) return;
    if (this._panel) {
      this._panel.remove();
      this._panel = null;
    }
    if (!this._open) return;

    const selected = parseHM(this.getAttribute("value") || "");
    const minuteStep = this._minuteStep();
    const b = this._bounds();
    const minutesList: number[] = [];
    for (let m = 0; m < 60; m += minuteStep) minutesList.push(m);

    const panel = document.createElement("div");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "시간 선택");
    panel.dataset.slot = "panel";
    panel.className = TP_PANEL_CLASS;
    panel.style.position = "absolute";
    panel.style.top = "100%";
    panel.style.left = "0";
    panel.style.marginTop = "4px";
    panel.style.zIndex = "1000";

    const cols = document.createElement("div");
    cols.className = TP_COLS_CLASS;

    // 시 컬럼
    const hourCol = document.createElement("div");
    hourCol.className = TP_COL_CLASS;
    hourCol.dataset.unit = "hour";
    const hourHead = document.createElement("span");
    hourHead.className = TP_COL_HEAD_CLASS;
    hourHead.textContent = "시";
    const hourList = document.createElement("div");
    hourList.setAttribute("role", "listbox");
    hourList.setAttribute("aria-label", "시");
    hourList.className = TP_COL_LIST_CLASS;
    for (let h = 0; h < 24; h++) {
      const isSel = selected?.h === h;
      const m = selected?.m ?? 0;
      const dis =
        !this._inRange(toMinutes(h, m), b) &&
        !minutesList.some((mm) => this._inRange(toMinutes(h, mm), b));
      const btn = this._optionButton(pad2(h), !!isSel, dis, () => {
        const cm = selected?.m ?? 0;
        if (this._inRange(toMinutes(h, cm), b)) {
          this._emit(`${pad2(h)}:${pad2(cm)}`);
        } else {
          const fb = minutesList.find((mm) => this._inRange(toMinutes(h, mm), b));
          if (fb != null) this._emit(`${pad2(h)}:${pad2(fb)}`);
        }
      });
      hourList.appendChild(btn);
    }
    hourCol.append(hourHead, hourList);

    // 분 컬럼
    const minCol = document.createElement("div");
    minCol.className = TP_COL_CLASS;
    minCol.dataset.unit = "minute";
    const minHead = document.createElement("span");
    minHead.className = TP_COL_HEAD_CLASS;
    minHead.textContent = "분";
    const minList = document.createElement("div");
    minList.setAttribute("role", "listbox");
    minList.setAttribute("aria-label", "분");
    minList.className = TP_COL_LIST_CLASS;
    for (const m of minutesList) {
      const isSel = selected?.m === m;
      const h = selected?.h ?? 0;
      const dis = !this._inRange(toMinutes(h, m), b);
      const btn = this._optionButton(pad2(m), !!isSel, dis, () => {
        const ch = selected?.h ?? 0;
        if (this._inRange(toMinutes(ch, m), b)) this._emit(`${pad2(ch)}:${pad2(m)}`);
      });
      minList.appendChild(btn);
    }
    minCol.append(minHead, minList);

    cols.append(hourCol, minCol);
    panel.appendChild(cols);

    this._field.appendChild(panel);
    this._panel = panel;

    // 선택 항목 가운데로 스크롤
    panel
      .querySelectorAll<HTMLElement>(`.${TP_OPTION_CLASS}[data-selected="true"]`)
      .forEach((el) => el.scrollIntoView({ block: "center" }));
  }

  private _optionButton(
    text: string,
    selected: boolean,
    disabled: boolean,
    onClick: () => void,
  ): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("role", "option");
    btn.setAttribute("aria-selected", String(selected));
    btn.dataset.slot = "option";
    btn.dataset.selected = selected ? "true" : "false";
    btn.disabled = disabled;
    btn.className = TP_OPTION_CLASS;
    btn.textContent = text;
    btn.addEventListener("click", () => {
      if (disabled) return;
      onClick();
    });
    return btn;
  }

  /**
   * 빠른설정 프리셋 칩(필드 트레일링 인라인). 1순위 <script type="application/json" slot="presets">,
   * 2순위 presets 속성. 클릭하면 value 세팅(패널은 닫지 않음 — 추가 조정 가능).
   */
  private _renderPresets(disabled: boolean): void {
    if (!this._presetsEl) return;
    const script = this.querySelector<HTMLScriptElement>(
      'script[type="application/json"][slot="presets"]',
    );
    const raw = script ? script.textContent : this.getAttribute("presets");
    let presets: TimePreset[] = [];
    if (raw && raw.trim()) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          presets = parsed.filter(
            (p): p is TimePreset =>
              !!p && typeof p.label === "string" && typeof p.value === "string",
          );
        }
      } catch {
        console.warn(
          "[nds-time-picker] presets 가 유효한 JSON 배열이 아닙니다 — 프리셋을 생략합니다.",
          { rawHead: raw.slice(0, 80) },
        );
      }
    }

    this._presetsEl.replaceChildren();
    for (const p of presets) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.dataset.slot = "preset";
      chip.className = TP_PRESET_CLASS;
      chip.textContent = p.label;
      chip.disabled = disabled;
      chip.addEventListener("click", () => {
        if (disabled) return;
        this._emit(p.value);
      });
      this._presetsEl.appendChild(chip);
    }
    this._presetsEl.style.display = presets.length ? "" : "none";
  }

  protected update(): void {
    if (
      !this._root ||
      !this._labelEl ||
      !this._field ||
      !this._trigger ||
      !this._triggerText ||
      !this._helper
    )
      return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this.getAttribute("value") || "";
    const selected = parseHM(value);
    const label = this.getAttribute("label");
    const placeholder = this.getAttribute("placeholder") || "시간 선택";
    const helperText = this.getAttribute("helper-text");
    const error = this.boolAttr("error");
    const fullWidth = this.boolAttr("full-width");
    const disabled = this.boolAttr("disabled");

    this._root.dataset.fullWidth = fullWidth ? "true" : "false";

    if (label) {
      this._labelEl.textContent = label;
      this._labelEl.style.display = "";
      this._trigger.setAttribute("aria-labelledby", this._labelId);
    } else {
      this._labelEl.style.display = "none";
      this._trigger.removeAttribute("aria-labelledby");
    }

    this._field.dataset.open = this._open ? "true" : "false";
    this._field.dataset.error = error ? "true" : "false";
    this._field.dataset.disabled = disabled ? "true" : "false";

    this._trigger.disabled = disabled;
    this._trigger.dataset.placeholder = selected ? "false" : "true";
    this._trigger.setAttribute("aria-expanded", String(this._open));
    this._triggerText.textContent = selected
      ? `${pad2(selected.h)}:${pad2(selected.m)}`
      : placeholder;

    if (helperText) {
      this._helper.textContent = helperText;
      this._helper.dataset.error = error ? "true" : "false";
      this._helper.style.display = "";
    } else {
      this._helper.style.display = "none";
    }

    this._renderPresets(disabled);
    this._renderPanel();
  }
}

define(NdsTimePicker);
