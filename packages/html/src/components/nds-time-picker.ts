/**
 * <nds-time-picker> — DS TimePicker 의 vanilla Web Component 버전.
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
 *   step: 초 단위 (default 300 = 5분)
 *   label / placeholder / helper-text
 *   error / full-width / disabled
 *   min / max
 *   presets: JSON [{ label, value }] — 빠른설정 칩(예: [{"label":"자정까지","value":"23:59"}]).
 *            클릭하면 value 세팅. 회색 중립 칩(노란 brand 아님). <script type="application/json" slot="presets"> 도 허용.
 */

import { NdsElement, define } from "../base/nds-element.js";

const TP_CLASS = "nds-time-picker";
const TP_ROOT_CLASS = `${TP_CLASS}__root`;
const TP_LABEL_CLASS = `${TP_CLASS}__label`;
const TP_FIELD_CLASS = `${TP_CLASS}__field`;
const TP_INPUT_CLASS = `${TP_CLASS}__input`;
const TP_ICON_CLASS = `${TP_CLASS}__icon`;
const TP_PRESETS_CLASS = `${TP_CLASS}__presets`;
const TP_PRESET_CLASS = `${TP_CLASS}__preset`;
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

let nextId = 0;

export class NdsTimePicker extends NdsElement {
  static elementName = "nds-time-picker";

  static get observedAttributes(): readonly string[] {
    return [
      "value",
      "step",
      "label",
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
  private _labelEl: HTMLLabelElement | null = null;
  private _field: HTMLDivElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _icon: HTMLButtonElement | null = null;
  private _presetsEl: HTMLSpanElement | null = null;
  private _helper: HTMLParagraphElement | null = null;
  private _inputId = `nds-time-picker-${++nextId}`;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = TP_ROOT_CLASS;

    const labelEl = document.createElement("label");
    labelEl.className = TP_LABEL_CLASS;
    labelEl.setAttribute("for", this._inputId);

    const field = document.createElement("div");
    field.className = TP_FIELD_CLASS;

    const input = document.createElement("input");
    input.id = this._inputId;
    input.type = "time";
    input.className = TP_INPUT_CLASS;
    input.addEventListener("input", () => {
      this.setAttribute("value", input.value);
      this.dispatchEvent(
        new CustomEvent("nds-time-change", {
          detail: { value: input.value },
          bubbles: true,
          composed: true,
        }),
      );
    });
    field.appendChild(input);

    // 시계 아이콘(Figma ic_time_picker) — 클릭 시 네이티브 picker(showPicker) 호출, 미지원이면 포커스.
    const icon = document.createElement("button");
    icon.type = "button";
    icon.className = TP_ICON_CLASS;
    icon.setAttribute("aria-label", "시간 선택");
    icon.tabIndex = -1;
    icon.innerHTML = CLOCK_SVG;
    icon.addEventListener("click", () => {
      if (input.disabled) return;
      const el = input as HTMLInputElement & { showPicker?: () => void };
      if (typeof el.showPicker === "function") {
        try {
          el.showPicker();
          return;
        } catch {
          /* user-gesture 필요 등 — 포커스로 폴백 */
        }
      }
      input.focus();
    });
    field.appendChild(icon);

    // 빠른설정 프리셋 칩 컨테이너 — update() 에서 presets 속성으로 채운다.
    const presetsEl = document.createElement("span");
    presetsEl.className = TP_PRESETS_CLASS;
    field.appendChild(presetsEl);

    const helper = document.createElement("p");
    helper.className = TP_HELPER_CLASS;

    root.append(labelEl, field, helper);
    this.appendChild(root);

    this._root = root;
    this._labelEl = labelEl;
    this._field = field;
    this._input = input;
    this._icon = icon;
    this._presetsEl = presetsEl;
    this._helper = helper;
  }

  protected update(): void {
    if (
      !this._root ||
      !this._labelEl ||
      !this._field ||
      !this._input ||
      !this._icon ||
      !this._presetsEl ||
      !this._helper
    )
      return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this.getAttribute("value") || "";
    const step = parseInt(this.attr("step", "300"), 10) || 300;
    const label = this.getAttribute("label");
    const helperText = this.getAttribute("helper-text");
    const error = this.boolAttr("error");
    const fullWidth = this.boolAttr("full-width");
    const disabled = this.boolAttr("disabled");
    const min = this.getAttribute("min");
    const max = this.getAttribute("max");

    this._root.dataset.fullWidth = fullWidth ? "true" : "false";

    if (label) {
      this._labelEl.textContent = label;
      this._labelEl.style.display = "";
    } else {
      this._labelEl.style.display = "none";
    }

    this._field.dataset.error = error ? "true" : "false";
    this._field.dataset.disabled = disabled ? "true" : "false";

    if (this._input.value !== value) this._input.value = value;
    this._input.disabled = disabled;
    this._input.step = String(step);
    if (min) this._input.min = min;
    else this._input.removeAttribute("min");
    if (max) this._input.max = max;
    else this._input.removeAttribute("max");

    if (helperText) {
      this._helper.textContent = helperText;
      this._helper.dataset.error = error ? "true" : "false";
      this._helper.style.display = "";
    } else {
      this._helper.style.display = "none";
    }

    this._icon.disabled = disabled;
    this._renderPresets(disabled);
  }

  /**
   * 빠른설정 프리셋 칩 렌더링. 1순위 <script type="application/json" slot="presets"> 텍스트 노드
   *   (한글 라벨을 속성 이스케이프·인코딩 사고 없이), 2순위 presets 속성. 클릭하면 value 를 세팅.
   */
  private _renderPresets(disabled: boolean): void {
    if (!this._presetsEl || !this._input) return;
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
          {
            rawHead: raw.slice(0, 80),
          },
        );
      }
    }

    this._presetsEl.replaceChildren();
    for (const p of presets) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = TP_PRESET_CLASS;
      chip.textContent = p.label;
      chip.disabled = disabled;
      chip.addEventListener("click", () => {
        if (disabled) return;
        this.setAttribute("value", p.value);
        if (this._input) this._input.value = p.value;
        this.dispatchEvent(
          new CustomEvent("nds-time-change", {
            detail: { value: p.value },
            bubbles: true,
            composed: true,
          }),
        );
      });
      this._presetsEl.appendChild(chip);
    }
    this._presetsEl.style.display = presets.length ? "" : "none";
  }
}

define(NdsTimePicker);
