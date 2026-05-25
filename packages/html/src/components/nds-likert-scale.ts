/**
 * <nds-likert-scale> — DS LikertScale 의 vanilla Web Component 버전.
 *
 * 사용:
 *   <nds-likert-scale value="3"
 *     options='[{"value":"1","label":"전혀"},{"value":"2"},{"value":"3","label":"보통"},
 *               {"value":"4"},{"value":"5","label":"매우"}]'
 *     start-label="전혀 그렇지 않다" end-label="매우 그렇다">
 *   </nds-likert-scale>
 *
 * 라디오 선택 시 host 의 `value` attribute 갱신 + "likert-change" CustomEvent.
 */

import { NdsElement, define } from "../base/nds-element.js";

const LK_CLASS = "nds-likert";
const LK_ROOT_CLASS = `${LK_CLASS}__root`;
const LK_TRACK_CLASS = `${LK_CLASS}__track`;
const LK_LINE_CLASS = `${LK_CLASS}__line`;
const LK_ITEM_CLASS = `${LK_CLASS}__item`;
const LK_INPUT_CLASS = `${LK_CLASS}__input`;
const LK_DOT_CLASS = `${LK_CLASS}__dot`;
const LK_DOT_INNER_CLASS = `${LK_CLASS}__dot-inner`;
const LK_ITEM_LABEL_CLASS = `${LK_CLASS}__item-label`;
const LK_ANCHORS_CLASS = `${LK_CLASS}__anchors`;
const LK_ANCHOR_CLASS = `${LK_CLASS}__anchor`;

interface LikertOption {
  value: string;
  label?: string;
}

let nextLikertId = 0;

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby"] as const;

export class NdsLikertScale extends NdsElement {
  static elementName = "nds-likert-scale";

  static get observedAttributes(): readonly string[] {
    return ["name", "options", "value", "start-label", "end-label", "disabled", ...FORWARDED_ATTRS];
  }

  private _root: HTMLDivElement | null = null;
  private _groupId = "";

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._groupId = `nds-likert-${++nextLikertId}`;
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = LK_ROOT_CLASS;
    root.setAttribute("role", "radiogroup");
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    const options = this._readOptions();
    const value = this.getAttribute("value");
    const disabled = this.boolAttr("disabled");
    const name = this.attr("name", this._groupId);

    const children: Node[] = [this._createTrack(options, value, name, disabled)];
    const anchors = this._createAnchors();
    if (anchors) children.push(anchors);
    this._root.replaceChildren(...children);
  }

  private _createTrack(
    options: LikertOption[],
    value: string | null,
    name: string,
    disabled: boolean,
  ): HTMLDivElement {
    const track = document.createElement("div");
    track.dataset.slot = "track";
    track.className = LK_TRACK_CLASS;

    const line = document.createElement("span");
    line.className = LK_LINE_CLASS;
    line.setAttribute("aria-hidden", "true");
    track.appendChild(line);

    for (const opt of options) {
      const isChecked = value !== null && opt.value === value;
      const inputId = `${name}-${opt.value}`;

      const label = document.createElement("label");
      label.dataset.slot = "item";
      label.dataset.checked = isChecked ? "true" : "false";
      label.dataset.disabled = disabled ? "true" : "false";
      label.htmlFor = inputId;
      label.className = LK_ITEM_CLASS;

      const input = document.createElement("input");
      input.type = "radio";
      input.id = inputId;
      input.name = name;
      input.value = opt.value;
      input.checked = isChecked;
      input.disabled = disabled;
      input.className = LK_INPUT_CLASS;
      input.addEventListener("change", () => this._select(opt.value));

      const dot = document.createElement("span");
      dot.dataset.slot = "dot";
      dot.dataset.checked = isChecked ? "true" : "false";
      dot.className = LK_DOT_CLASS;
      dot.setAttribute("aria-hidden", "true");
      const inner = document.createElement("span");
      inner.className = LK_DOT_INNER_CLASS;
      dot.appendChild(inner);

      label.append(input, dot);

      if (opt.label !== undefined && opt.label !== "") {
        const labelEl = document.createElement("span");
        labelEl.dataset.slot = "item-label";
        labelEl.className = LK_ITEM_LABEL_CLASS;
        labelEl.textContent = opt.label;
        label.appendChild(labelEl);
      }

      track.appendChild(label);
    }
    return track;
  }

  private _createAnchors(): HTMLDivElement | null {
    const start = this.getAttribute("start-label");
    const end = this.getAttribute("end-label");
    if (start === null && end === null) return null;
    const wrap = document.createElement("div");
    wrap.dataset.slot = "anchors";
    wrap.className = LK_ANCHORS_CLASS;

    const s = document.createElement("span");
    s.dataset.slot = "anchor-start";
    s.className = LK_ANCHOR_CLASS;
    s.textContent = start ?? "";
    const e = document.createElement("span");
    e.dataset.slot = "anchor-end";
    e.className = LK_ANCHOR_CLASS;
    e.textContent = end ?? "";

    wrap.append(s, e);
    return wrap;
  }

  private _select(value: string): void {
    if (this.boolAttr("disabled")) return;
    if (this.getAttribute("value") === value) return;
    this.setAttribute("value", value);
    this.dispatchEvent(
      new CustomEvent("likert-change", {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _readOptions(): LikertOption[] {
    const attr = this.getAttribute("options");
    if (!attr || !attr.trim()) return [];
    try {
      const parsed = JSON.parse(attr) as Array<Record<string, unknown>>;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((raw) => ({
          value: raw.value === undefined ? "" : String(raw.value),
          label: typeof raw.label === "string" ? raw.label : undefined,
        }))
        .filter((opt) => opt.value);
    } catch {
      return [];
    }
  }
}

define(NdsLikertScale);
