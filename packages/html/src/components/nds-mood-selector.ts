/**
 * <nds-mood-selector> — DS MoodSelector 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-mood-selector
 *     value="good"
 *     options='[
 *       {"value":"very-bad","face":"😢","label":"매우 나쁨"},
 *       {"value":"bad","face":"😟","label":"나쁨"},
 *       {"value":"neutral","face":"😐","label":"보통"},
 *       {"value":"good","face":"🙂","label":"좋음"},
 *       {"value":"very-good","face":"😀","label":"매우 좋음"}
 *     ]'
 *   ></nds-mood-selector>
 *
 * 이벤트:
 *   nds-mood-change (detail: { value }) -> 선택 변경
 *
 * 속성:
 *   value: 선택된 값
 *   options: JSON 배열 (face 는 emoji 또는 SVG HTML 문자열)
 *   name: radio name (없으면 자동)
 *   show-labels: "false" 면 라벨 숨김 (default 표시)
 *   disabled
 */

import { NdsElement, define } from "../base/nds-element.js";

const MD_CLASS = "nds-mood";
const MD_ROOT_CLASS = `${MD_CLASS}__root`;
const MD_LIST_CLASS = `${MD_CLASS}__list`;
const MD_ITEM_CLASS = `${MD_CLASS}__item`;
const MD_INPUT_CLASS = `${MD_CLASS}__input`;
const MD_FACE_CLASS = `${MD_CLASS}__face`;
const MD_LABEL_CLASS = `${MD_CLASS}__label`;

let nextNameId = 0;

interface MoodOption {
  value: string;
  face: string;
  label?: string;
}

const DEFAULT_OPTIONS: MoodOption[] = [
  { value: "very-bad", face: "😢", label: "매우 나쁨" },
  { value: "bad", face: "😟", label: "나쁨" },
  { value: "neutral", face: "😐", label: "보통" },
  { value: "good", face: "🙂", label: "좋음" },
  { value: "very-good", face: "😀", label: "매우 좋음" },
];

export class NdsMoodSelector extends NdsElement {
  static elementName = "nds-mood-selector";

  static get observedAttributes(): readonly string[] {
    return ["value", "options", "name", "show-labels", "disabled"];
  }

  private _root: HTMLDivElement | null = null;
  private _list: HTMLDivElement | null = null;
  private _autoName = `nds-mood-${++nextNameId}`;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.setAttribute("role", "radiogroup");
    root.className = MD_ROOT_CLASS;

    const list = document.createElement("div");
    list.dataset.slot = "list";
    list.className = MD_LIST_CLASS;

    root.appendChild(list);
    this.appendChild(root);
    this._root = root;
    this._list = list;
  }

  private _parseOptions(): MoodOption[] {
    const raw = this.getAttribute("options");
    if (!raw) return DEFAULT_OPTIONS;
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return DEFAULT_OPTIONS;
      return parsed
        .filter((it) => it && typeof it.value === "string")
        .map((it) => ({
          value: String(it.value),
          face: typeof it.face === "string" ? it.face : "",
          label: typeof it.label === "string" ? it.label : undefined,
        }));
    } catch {
      return DEFAULT_OPTIONS;
    }
  }

  protected update(): void {
    if (!this._list) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this.getAttribute("value") || "";
    const name = this.getAttribute("name") || this._autoName;
    const showLabels = this.attr("show-labels", "true") !== "false";
    const disabled = this.boolAttr("disabled");
    const options = this._parseOptions();

    this._list.innerHTML = "";

    options.forEach((opt) => {
      const isChecked = opt.value === value;
      const inputId = `${name}-${opt.value}`;

      const label = document.createElement("label");
      label.dataset.slot = "item";
      label.dataset.checked = isChecked ? "true" : "false";
      label.dataset.disabled = disabled ? "true" : "false";
      label.setAttribute("for", inputId);
      label.className = MD_ITEM_CLASS;

      const input = document.createElement("input");
      input.type = "radio";
      input.id = inputId;
      input.name = name;
      input.value = opt.value;
      input.checked = isChecked;
      input.disabled = disabled;
      input.className = MD_INPUT_CLASS;
      input.addEventListener("change", () => {
        if (input.checked) {
          this.setAttribute("value", opt.value);
          this.dispatchEvent(
            new CustomEvent("nds-mood-change", {
              detail: { value: opt.value },
              bubbles: true,
              composed: true,
            }),
          );
        }
      });

      const face = document.createElement("span");
      face.dataset.slot = "face";
      face.className = MD_FACE_CLASS;
      face.setAttribute("aria-hidden", "true");
      // face may contain inline SVG; allow either text or HTML.
      face.innerHTML = opt.face;

      label.append(input, face);

      if (showLabels && opt.label !== undefined) {
        const labelText = document.createElement("span");
        labelText.dataset.slot = "label";
        labelText.className = MD_LABEL_CLASS;
        labelText.textContent = opt.label;
        label.appendChild(labelText);
      }

      this._list!.appendChild(label);
    });
  }
}

define(NdsMoodSelector);
