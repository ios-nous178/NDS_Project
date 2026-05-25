/**
 * <nds-date-range-picker> — DS DateRangePicker 의 vanilla Web Component 버전.
 *
 * 내부적으로 두 개의 <nds-date-picker> 를 사용한다.
 *
 * 사용 예:
 *   <nds-date-range-picker
 *     from="2026-05-01"
 *     to="2026-05-31"
 *     min-date="2026-01-01"
 *     max-date="2026-12-31"
 *     presets='[
 *       {"key":"last7","label":"최근 7일","from":"2026-05-19","to":"2026-05-25"},
 *       {"key":"last30","label":"최근 30일","from":"2026-04-26","to":"2026-05-25"},
 *       {"key":"this-month","label":"이번 달","from":"2026-05-01","to":"2026-05-25"}
 *     ]'
 *   ></nds-date-range-picker>
 *
 * 이벤트:
 *   nds-date-range-change (detail: { from, to }) -> 범위 변경
 *   nds-date-range-preset (detail: { key }) -> 프리셋 클릭
 *
 * 속성:
 *   from / to: "YYYY-MM-DD"
 *   min-date / max-date
 *   start-label (default "시작") / end-label (default "종료")
 *   presets: JSON 배열 ({ key, label, from, to })
 *   disabled
 */

import { NdsElement, define } from "../base/nds-element.js";
import "./nds-date-picker.js";

const DR_CLASS = "nds-date-range";
const DR_ROOT_CLASS = `${DR_CLASS}__root`;
const DR_FIELD_CLASS = `${DR_CLASS}__field`;
const DR_LABEL_CLASS = `${DR_CLASS}__label`;
const DR_SEPARATOR_CLASS = `${DR_CLASS}__separator`;
const DR_PRESETS_CLASS = `${DR_CLASS}__presets`;
const DR_PRESET_CLASS = `${DR_CLASS}__preset`;

interface Preset {
  key: string;
  label: string;
  from: string;
  to: string;
}

export class NdsDateRangePicker extends NdsElement {
  static elementName = "nds-date-range-picker";

  static get observedAttributes(): readonly string[] {
    return [
      "from",
      "to",
      "min-date",
      "max-date",
      "start-label",
      "end-label",
      "presets",
      "disabled",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _startLabelEl: HTMLSpanElement | null = null;
  private _endLabelEl: HTMLSpanElement | null = null;
  private _startPicker: HTMLElement | null = null;
  private _endPicker: HTMLElement | null = null;
  private _presetsWrap: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _dispatch(): void {
    this.dispatchEvent(
      new CustomEvent("nds-date-range-change", {
        detail: {
          from: this.getAttribute("from"),
          to: this.getAttribute("to"),
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = DR_ROOT_CLASS;

    const field = document.createElement("div");
    field.dataset.slot = "field";
    field.className = DR_FIELD_CLASS;

    const startLabel = document.createElement("span");
    startLabel.dataset.slot = "label";
    startLabel.className = DR_LABEL_CLASS;

    const startPicker = document.createElement("nds-date-picker");
    startPicker.addEventListener("nds-date-change", ((e: Event) => {
      const detail = (e as CustomEvent).detail as { value: string };
      this.setAttribute("from", detail.value);
      // If `to` is earlier than new `from`, clear `to`.
      const to = this.getAttribute("to");
      if (to && to < detail.value) this.removeAttribute("to");
      this._dispatch();
    }) as EventListener);

    const separator = document.createElement("span");
    separator.dataset.slot = "separator";
    separator.className = DR_SEPARATOR_CLASS;
    separator.setAttribute("aria-hidden", "true");
    separator.textContent = "~";

    const endLabel = document.createElement("span");
    endLabel.dataset.slot = "label";
    endLabel.className = DR_LABEL_CLASS;

    const endPicker = document.createElement("nds-date-picker");
    endPicker.addEventListener("nds-date-change", ((e: Event) => {
      const detail = (e as CustomEvent).detail as { value: string };
      this.setAttribute("to", detail.value);
      this._dispatch();
    }) as EventListener);

    field.append(startLabel, startPicker, separator, endLabel, endPicker);
    root.appendChild(field);

    const presetsWrap = document.createElement("div");
    presetsWrap.dataset.slot = "presets";
    presetsWrap.className = DR_PRESETS_CLASS;
    root.appendChild(presetsWrap);

    this.appendChild(root);

    this._root = root;
    this._startLabelEl = startLabel;
    this._endLabelEl = endLabel;
    this._startPicker = startPicker;
    this._endPicker = endPicker;
    this._presetsWrap = presetsWrap;
  }

  private _parsePresets(): Preset[] {
    const raw = this.getAttribute("presets");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(
          (p) =>
            p &&
            typeof p.key === "string" &&
            typeof p.label === "string" &&
            typeof p.from === "string" &&
            typeof p.to === "string",
        )
        .map((p) => ({
          key: String(p.key),
          label: String(p.label),
          from: String(p.from),
          to: String(p.to),
        }));
    } catch {
      return [];
    }
  }

  protected update(): void {
    if (
      !this._root ||
      !this._startLabelEl ||
      !this._endLabelEl ||
      !this._startPicker ||
      !this._endPicker ||
      !this._presetsWrap
    ) {
      return;
    }
    if (this.style.display !== "contents") this.style.display = "contents";

    const from = this.getAttribute("from");
    const to = this.getAttribute("to");
    const minDate = this.getAttribute("min-date");
    const maxDate = this.getAttribute("max-date");
    const startLabel = this.getAttribute("start-label") || "시작";
    const endLabel = this.getAttribute("end-label") || "종료";
    const disabled = this.boolAttr("disabled");
    const presets = this._parsePresets();

    this._startLabelEl.textContent = startLabel;
    this._endLabelEl.textContent = endLabel;

    const setPickerAttr = (el: HTMLElement, name: string, value: string | null): void => {
      if (value === null) el.removeAttribute(name);
      else el.setAttribute(name, value);
    };

    setPickerAttr(this._startPicker, "value", from);
    setPickerAttr(this._startPicker, "min-date", minDate);
    setPickerAttr(this._startPicker, "max-date", maxDate);
    setPickerAttr(this._endPicker, "value", to);
    setPickerAttr(this._endPicker, "min-date", from || minDate);
    setPickerAttr(this._endPicker, "max-date", maxDate);

    if (disabled) {
      this._startPicker.setAttribute("disabled", "");
      this._endPicker.setAttribute("disabled", "");
    } else {
      this._startPicker.removeAttribute("disabled");
      this._endPicker.removeAttribute("disabled");
    }

    this._presetsWrap.innerHTML = "";
    presets.forEach((p) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.slot = "preset";
      const active = from === p.from && to === p.to;
      btn.dataset.active = active ? "true" : "false";
      btn.className = DR_PRESET_CLASS;
      btn.textContent = p.label;
      btn.disabled = disabled;
      btn.addEventListener("click", () => {
        this.setAttribute("from", p.from);
        this.setAttribute("to", p.to);
        this.dispatchEvent(
          new CustomEvent("nds-date-range-preset", {
            detail: { key: p.key },
            bubbles: true,
            composed: true,
          }),
        );
        this._dispatch();
      });
      this._presetsWrap!.appendChild(btn);
    });
    this._presetsWrap.style.display = presets.length > 0 ? "" : "none";
  }
}

define(NdsDateRangePicker);
