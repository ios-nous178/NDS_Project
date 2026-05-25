/**
 * <nds-medication-item> — DS MedicationItem 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-medication-item
 *     med-name="에스시탈로프람"
 *     dosage="10mg · 1정"
 *     times='["morning","bedtime"]'
 *     note="식후 30분"
 *     show-check
 *     taken
 *   ></nds-medication-item>
 *
 * 이벤트:
 *   nds-medication-taken-change (detail: { taken })
 *
 * 속성:
 *   med-name / dosage / note
 *   times: JSON 배열 (MedicationTime[])
 *   taken
 *   show-check: 체크박스 노출
 */

import { NdsElement, define } from "../base/nds-element.js";

const MI_CLASS = "nds-medication-item";
const MI_ICON_CLASS = `${MI_CLASS}__icon`;
const MI_BODY_CLASS = `${MI_CLASS}__body`;
const MI_HEAD_CLASS = `${MI_CLASS}__head`;
const MI_NAME_CLASS = `${MI_CLASS}__name`;
const MI_DOSAGE_CLASS = `${MI_CLASS}__dosage`;
const MI_META_CLASS = `${MI_CLASS}__meta`;
const MI_TIMES_CLASS = `${MI_CLASS}__times`;
const MI_TIME_CLASS = `${MI_CLASS}__time`;
const MI_NOTE_CLASS = `${MI_CLASS}__note`;
const MI_CHECK_CLASS = `${MI_CLASS}__check`;
const MI_CHECK_INPUT_CLASS = `${MI_CLASS}__check-input`;
const MI_CHECK_BOX_CLASS = `${MI_CLASS}__check-box`;

export type MedicationTime = "morning" | "noon" | "evening" | "bedtime";

const TIME_LABEL: Record<MedicationTime, string> = {
  morning: "아침",
  noon: "점심",
  evening: "저녁",
  bedtime: "취침",
};

const PillIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "22");
  svg.setAttribute("height", "22");
  svg.setAttribute("viewBox", "0 0 22 22");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<rect x="3" y="9" width="16" height="4" rx="2" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity="0.15"/><rect x="3" y="9" width="8" height="4" rx="2" fill="currentColor" fill-opacity="0.35"/>`;
  return svg;
};

const CheckIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M3.5 8L6.5 11L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  return svg;
};

export class NdsMedicationItem extends NdsElement {
  static elementName = "nds-medication-item";

  static get observedAttributes(): readonly string[] {
    return ["med-name", "dosage", "times", "note", "taken", "show-check"];
  }

  private _root: HTMLDivElement | null = null;
  private _iconWrap: HTMLSpanElement | null = null;
  private _nameEl: HTMLSpanElement | null = null;
  private _dosageEl: HTMLSpanElement | null = null;
  private _meta: HTMLDivElement | null = null;
  private _timesWrap: HTMLDivElement | null = null;
  private _noteEl: HTMLSpanElement | null = null;
  private _checkLabel: HTMLLabelElement | null = null;
  private _checkInput: HTMLInputElement | null = null;
  private _checkBox: HTMLSpanElement | null = null;
  private _iconStash: HTMLElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    let stashedIcon: HTMLElement | null = null;
    Array.from(this.childNodes).forEach((node) => {
      if (node instanceof HTMLElement && node.getAttribute("slot") === "icon") {
        stashedIcon = node;
      }
      node.parentNode?.removeChild(node);
    });
    this._iconStash = stashedIcon;

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = MI_CLASS;

    const iconWrap = document.createElement("span");
    iconWrap.dataset.slot = "icon";
    iconWrap.className = MI_ICON_CLASS;
    iconWrap.appendChild(stashedIcon ?? PillIcon());

    const body = document.createElement("div");
    body.dataset.slot = "body";
    body.className = MI_BODY_CLASS;

    const head = document.createElement("div");
    head.dataset.slot = "head";
    head.className = MI_HEAD_CLASS;

    const nameEl = document.createElement("span");
    nameEl.dataset.slot = "name";
    nameEl.className = MI_NAME_CLASS;

    const dosageEl = document.createElement("span");
    dosageEl.dataset.slot = "dosage";
    dosageEl.className = MI_DOSAGE_CLASS;

    head.append(nameEl, dosageEl);

    const meta = document.createElement("div");
    meta.dataset.slot = "meta";
    meta.className = MI_META_CLASS;

    const timesWrap = document.createElement("div");
    timesWrap.dataset.slot = "times";
    timesWrap.className = MI_TIMES_CLASS;

    const noteEl = document.createElement("span");
    noteEl.dataset.slot = "note";
    noteEl.className = MI_NOTE_CLASS;

    meta.append(timesWrap, noteEl);

    body.append(head, meta);

    const checkLabel = document.createElement("label");
    checkLabel.dataset.slot = "check";
    checkLabel.className = MI_CHECK_CLASS;

    const checkInput = document.createElement("input");
    checkInput.type = "checkbox";
    checkInput.className = MI_CHECK_INPUT_CLASS;
    checkInput.addEventListener("change", () => {
      if (checkInput.checked) this.setAttribute("taken", "");
      else this.removeAttribute("taken");
      this.dispatchEvent(
        new CustomEvent("nds-medication-taken-change", {
          detail: { taken: checkInput.checked },
          bubbles: true,
          composed: true,
        }),
      );
    });

    const checkBox = document.createElement("span");
    checkBox.dataset.slot = "check-box";
    checkBox.className = MI_CHECK_BOX_CLASS;
    checkBox.setAttribute("aria-hidden", "true");
    checkBox.appendChild(CheckIcon());

    checkLabel.append(checkInput, checkBox);

    root.append(iconWrap, body, checkLabel);
    this.appendChild(root);

    this._root = root;
    this._iconWrap = iconWrap;
    this._nameEl = nameEl;
    this._dosageEl = dosageEl;
    this._meta = meta;
    this._timesWrap = timesWrap;
    this._noteEl = noteEl;
    this._checkLabel = checkLabel;
    this._checkInput = checkInput;
    this._checkBox = checkBox;
  }

  private _parseTimes(): MedicationTime[] {
    const raw = this.getAttribute("times");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      const valid: MedicationTime[] = [];
      parsed.forEach((t) => {
        if (typeof t === "string" && t in TIME_LABEL) valid.push(t as MedicationTime);
      });
      return valid;
    } catch {
      return [];
    }
  }

  protected update(): void {
    if (
      !this._root ||
      !this._nameEl ||
      !this._dosageEl ||
      !this._meta ||
      !this._timesWrap ||
      !this._noteEl ||
      !this._checkLabel ||
      !this._checkInput ||
      !this._checkBox
    ) {
      return;
    }
    if (this.style.display !== "contents") this.style.display = "contents";

    const name = this.getAttribute("med-name") || "";
    const dosage = this.getAttribute("dosage");
    const note = this.getAttribute("note");
    const times = this._parseTimes();
    const taken = this.boolAttr("taken");
    const showCheck = this.boolAttr("show-check");

    this._root.dataset.taken = taken ? "true" : "false";
    this._nameEl.textContent = name;
    if (dosage) {
      this._dosageEl.textContent = dosage;
      this._dosageEl.style.display = "";
    } else {
      this._dosageEl.style.display = "none";
    }

    this._timesWrap.innerHTML = "";
    times.forEach((t) => {
      const span = document.createElement("span");
      span.dataset.slot = "time";
      span.className = MI_TIME_CLASS;
      span.textContent = TIME_LABEL[t];
      this._timesWrap!.appendChild(span);
    });
    this._timesWrap.style.display = times.length > 0 ? "" : "none";

    if (note) {
      this._noteEl.textContent = note;
      this._noteEl.style.display = "";
    } else {
      this._noteEl.style.display = "none";
    }
    this._meta.style.display = times.length > 0 || note ? "" : "none";

    this._checkLabel.style.display = showCheck ? "" : "none";
    this._checkInput.checked = taken;
    this._checkBox.dataset.checked = taken ? "true" : "false";
  }
}

define(NdsMedicationItem);
