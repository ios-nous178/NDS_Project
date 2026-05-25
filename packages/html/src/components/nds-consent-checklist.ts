/**
 * <nds-consent-checklist> — DS ConsentChecklist 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-consent-checklist
 *     value='["service"]'
 *     items='[
 *       {"key":"service","label":"서비스 이용약관","required":true,"detail":"..."},
 *       {"key":"privacy","label":"개인정보 처리방침","required":true},
 *       {"key":"marketing","label":"마케팅 정보 수신","required":false}
 *     ]'
 *     all-label="전체 동의"
 *   ></nds-consent-checklist>
 *
 * 이벤트:
 *   nds-consent-change (detail: { value: string[] })
 *
 * 속성:
 *   value: JSON 배열 (체크된 키들)
 *   items: JSON 배열 ({ key, label, required?, detail? })
 *   all-label (default "전체 동의")
 *   expandable: detail 펼치기 (default true)
 */

import { NdsElement, define } from "../base/nds-element.js";

const CL_CLASS = "nds-consent";
const CL_ALL_CLASS = `${CL_CLASS}__all`;
const CL_DIVIDER_CLASS = `${CL_CLASS}__divider`;
const CL_LIST_CLASS = `${CL_CLASS}__list`;
const CL_ITEM_CLASS = `${CL_CLASS}__item`;
const CL_ITEM_HEAD_CLASS = `${CL_CLASS}__item-head`;
const CL_LABEL_CLASS = `${CL_CLASS}__label`;
const CL_LABEL_TEXT_CLASS = `${CL_CLASS}__label-text`;
const CL_REQUIRED_CLASS = `${CL_CLASS}__required`;
const CL_OPTIONAL_CLASS = `${CL_CLASS}__optional`;
const CL_TOGGLE_CLASS = `${CL_CLASS}__toggle`;
const CL_DETAIL_CLASS = `${CL_CLASS}__detail`;
const CL_BOX_CLASS = `${CL_CLASS}__box`;
const CL_INPUT_CLASS = `${CL_CLASS}__input`;

interface ConsentItem {
  key: string;
  label: string;
  required?: boolean;
  detail?: string;
}

const CheckIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 14 14");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M3 7L6 10L11 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  return svg;
};

const ChevronDown = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  return svg;
};

export class NdsConsentChecklist extends NdsElement {
  static elementName = "nds-consent-checklist";

  static get observedAttributes(): readonly string[] {
    return ["value", "items", "all-label", "expandable"];
  }

  private _root: HTMLDivElement | null = null;
  private _openKeys = new Set<string>();

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = CL_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  private _parseValue(): Set<string> {
    const raw = this.getAttribute("value");
    if (!raw) return new Set();
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return new Set();
      return new Set(parsed.map(String));
    } catch {
      return new Set();
    }
  }

  private _parseItems(): ConsentItem[] {
    const raw = this.getAttribute("items");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((i) => i && typeof i.key === "string" && typeof i.label === "string")
        .map((i) => ({
          key: String(i.key),
          label: String(i.label),
          required: !!i.required,
          detail: typeof i.detail === "string" ? i.detail : undefined,
        }));
    } catch {
      return [];
    }
  }

  private _commit(next: string[]): void {
    this.setAttribute("value", JSON.stringify(next));
    this.dispatchEvent(
      new CustomEvent("nds-consent-change", {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const items = this._parseItems();
    const value = this._parseValue();
    const allLabel = this.getAttribute("all-label") || "전체 동의";
    const expandable = this.attr("expandable", "true") !== "false";
    const allChecked = items.length > 0 && items.every((i) => value.has(i.key));

    this._root.innerHTML = "";

    // All toggle
    const allWrap = document.createElement("label");
    allWrap.dataset.slot = "all";
    allWrap.className = CL_ALL_CLASS;

    const allInput = document.createElement("input");
    allInput.type = "checkbox";
    allInput.className = CL_INPUT_CLASS;
    allInput.checked = allChecked;
    allInput.addEventListener("change", () => {
      this._commit(allChecked ? [] : items.map((i) => i.key));
    });

    const allBox = document.createElement("span");
    allBox.dataset.slot = "box";
    allBox.dataset.checked = allChecked ? "true" : "false";
    allBox.className = CL_BOX_CLASS;
    allBox.setAttribute("aria-hidden", "true");
    allBox.appendChild(CheckIcon());

    const allLabelEl = document.createElement("span");
    allLabelEl.dataset.slot = "label-text";
    allLabelEl.className = CL_LABEL_TEXT_CLASS;
    allLabelEl.textContent = allLabel;

    allWrap.append(allInput, allBox, allLabelEl);
    this._root.appendChild(allWrap);

    const divider = document.createElement("div");
    divider.dataset.slot = "divider";
    divider.className = CL_DIVIDER_CLASS;
    divider.setAttribute("aria-hidden", "true");
    this._root.appendChild(divider);

    const list = document.createElement("div");
    list.dataset.slot = "list";
    list.className = CL_LIST_CLASS;

    items.forEach((item) => {
      const checked = value.has(item.key);
      const open = this._openKeys.has(item.key);
      const canExpand = expandable && !!item.detail;

      const itemEl = document.createElement("div");
      itemEl.dataset.slot = "item";
      itemEl.className = CL_ITEM_CLASS;

      const head = document.createElement("div");
      head.dataset.slot = "item-head";
      head.className = CL_ITEM_HEAD_CLASS;

      const label = document.createElement("label");
      label.dataset.slot = "label";
      label.className = CL_LABEL_CLASS;

      const input = document.createElement("input");
      input.type = "checkbox";
      input.className = CL_INPUT_CLASS;
      input.checked = checked;
      input.addEventListener("change", () => {
        const next = new Set(value);
        if (next.has(item.key)) next.delete(item.key);
        else next.add(item.key);
        this._commit(Array.from(next));
      });

      const box = document.createElement("span");
      box.dataset.slot = "box";
      box.dataset.checked = checked ? "true" : "false";
      box.className = CL_BOX_CLASS;
      box.setAttribute("aria-hidden", "true");
      box.appendChild(CheckIcon());

      const labelText = document.createElement("span");
      labelText.dataset.slot = "label-text";
      labelText.className = CL_LABEL_TEXT_CLASS;
      labelText.textContent = item.label;

      const flag = document.createElement("span");
      if (item.required) {
        flag.dataset.slot = "required";
        flag.className = CL_REQUIRED_CLASS;
        flag.textContent = "[필수]";
      } else {
        flag.dataset.slot = "optional";
        flag.className = CL_OPTIONAL_CLASS;
        flag.textContent = "[선택]";
      }

      label.append(input, box, labelText, flag);
      head.appendChild(label);

      if (canExpand) {
        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.dataset.slot = "toggle";
        toggle.dataset.open = open ? "true" : "false";
        toggle.className = CL_TOGGLE_CLASS;
        toggle.setAttribute("aria-label", open ? "접기" : "펼치기");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.appendChild(ChevronDown());
        toggle.addEventListener("click", () => {
          if (this._openKeys.has(item.key)) this._openKeys.delete(item.key);
          else this._openKeys.add(item.key);
          this.scheduleUpdate();
        });
        head.appendChild(toggle);
      }

      itemEl.appendChild(head);

      if (canExpand && open) {
        const detail = document.createElement("div");
        detail.dataset.slot = "detail";
        detail.className = CL_DETAIL_CLASS;
        detail.textContent = item.detail!;
        itemEl.appendChild(detail);
      }

      list.appendChild(itemEl);
    });

    this._root.appendChild(list);
  }
}

define(NdsConsentChecklist);
