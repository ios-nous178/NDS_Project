/**
 * <nds-accordion> + sub-elements — DS Accordion 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-accordion type="single" value="item-1">
 *     <nds-accordion-item value="item-1">
 *       <nds-accordion-trigger>제목 1</nds-accordion-trigger>
 *       <nds-accordion-content>내용 1</nds-accordion-content>
 *     </nds-accordion-item>
 *     <nds-accordion-item value="item-2">
 *       <nds-accordion-trigger>제목 2</nds-accordion-trigger>
 *       <nds-accordion-content>내용 2</nds-accordion-content>
 *     </nds-accordion-item>
 *   </nds-accordion>
 *
 * 이벤트:
 *   trigger 클릭 -> 부모 nds-accordion 의 value 변경 +
 *   부모에서 "accordion-change" CustomEvent (detail: { value }) 디스패치 (bubbles).
 */

import { NdsElement, define } from "../base/nds-element.js";

const ACC_CLASS = "nds-accordion";
const ACC_ITEM_CLASS = `${ACC_CLASS}__item`;
const ACC_TRIGGER_CLASS = `${ACC_CLASS}__trigger`;
const ACC_CONTENT_CLASS = `${ACC_CLASS}__content`;
const ACC_CHEVRON_CLASS = `${ACC_CLASS}__chevron`;

let nextBaseId = 0;

const ChevronIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", ACC_CHEVRON_CLASS);
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M5 7.5L10 12.5L15 7.5");
  svg.appendChild(path);

  return svg;
};

/* ──────────────── <nds-accordion> ──────────────── */

export class NdsAccordion extends NdsElement {
  static elementName = "nds-accordion";

  static get observedAttributes(): readonly string[] {
    return ["type", "value", "base-id"];
  }

  private _root: HTMLDivElement | null = null;
  private _baseId = "";

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    this._baseId = this.attr("base-id", `nds-accordion-${++nextBaseId}`);
    const root = document.createElement("div");
    root.className = ACC_CLASS;
    root.dataset.slot = "root";
    while (this.firstChild) root.appendChild(this.firstChild);
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    this._notifyChildren();
  }

  private _notifyChildren(): void {
    if (!this._root) return;
    const value = this.getAttribute("value") ?? "";
    const openValues = new Set(value.split(",").filter(Boolean));

    const items = this.querySelectorAll<NdsAccordionItem>("nds-accordion-item");
    items.forEach((item, index) => {
      const itemValue = item.getAttribute("value") || `item-${index}`;
      const isOpen = openValues.has(itemValue);
      item.applyParentState(this._baseId, itemValue, isOpen);
    });
  }

  toggle(itemValue: string): void {
    const type = this.attr("type", "single");
    const currentValue = this.getAttribute("value") ?? "";
    const openValues = new Set(currentValue.split(",").filter(Boolean));

    if (openValues.has(itemValue)) {
      openValues.delete(itemValue);
    } else {
      if (type === "single") {
        openValues.clear();
      }
      openValues.add(itemValue);
    }

    const nextValue = Array.from(openValues).join(",");
    this.setAttribute("value", nextValue);
    this.dispatchEvent(
      new CustomEvent("accordion-change", {
        detail: { value: type === "single" ? nextValue || "" : Array.from(openValues) },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

/* ──────────────── <nds-accordion-item> ──────────────── */

export class NdsAccordionItem extends NdsElement {
  static elementName = "nds-accordion-item";

  static get observedAttributes(): readonly string[] {
    return ["value"];
  }

  private _div: HTMLDivElement | null = null;
  private _baseId = "";
  private _itemValue = "";
  private _isOpen = false;

  override connectedCallback(): void {
    if (!this._div) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const div = document.createElement("div");
    div.className = ACC_ITEM_CLASS;
    div.dataset.slot = "item";
    while (this.firstChild) div.appendChild(this.firstChild);
    this.appendChild(div);
    this._div = div;
  }

  applyParentState(baseId: string, itemValue: string, isOpen: boolean): void {
    this._baseId = baseId;
    this._itemValue = itemValue;
    this._isOpen = isOpen;
    this.scheduleUpdate();
  }

  protected update(): void {
    if (!this._div) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    this._div.dataset.state = this._isOpen ? "open" : "closed";

    const triggerId = `${this._baseId}-${this._itemValue}-trigger`;
    const contentId = `${this._baseId}-${this._itemValue}-content`;

    const trigger = this.querySelector<NdsAccordionTrigger>("nds-accordion-trigger");
    if (trigger) {
      trigger.applyItemState(triggerId, contentId, this._isOpen, this._itemValue);
    }

    const content = this.querySelector<NdsAccordionContent>("nds-accordion-content");
    if (content) {
      content.applyItemState(triggerId, contentId, this._isOpen);
    }
  }
}

/* ──────────────── <nds-accordion-trigger> ──────────────── */

export class NdsAccordionTrigger extends NdsElement {
  static elementName = "nds-accordion-trigger";

  private _button: HTMLButtonElement | null = null;
  private _isOpen = false;
  private _itemValue = "";
  private _onClick = () => this._handleToggle();

  override connectedCallback(): void {
    if (!this._button) this._mount();
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    if (this._button) {
      this._button.removeEventListener("click", this._onClick);
    }
  }

  private _mount(): void {
    const button = document.createElement("button");
    button.className = ACC_TRIGGER_CLASS;
    button.dataset.slot = "trigger";

    const label = document.createElement("span");
    while (this.firstChild) label.appendChild(this.firstChild);

    button.appendChild(label);
    button.appendChild(ChevronIcon());
    button.addEventListener("click", this._onClick);

    this.appendChild(button);
    this._button = button;
  }

  applyItemState(id: string, controls: string, isOpen: boolean, itemValue: string): void {
    this._isOpen = isOpen;
    this._itemValue = itemValue;
    if (this._button) {
      this._button.id = id;
      this._button.setAttribute("aria-controls", controls);
    }
    this.scheduleUpdate();
  }

  protected update(): void {
    if (!this._button) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    this._button.dataset.state = this._isOpen ? "open" : "closed";
    this._button.setAttribute("aria-expanded", String(this._isOpen));
  }

  private _handleToggle(): void {
    const accordion = this.closest<NdsAccordion>("nds-accordion");
    if (accordion && this._itemValue) {
      accordion.toggle(this._itemValue);
    }
  }
}

/* ──────────────── <nds-accordion-content> ──────────────── */

export class NdsAccordionContent extends NdsElement {
  static elementName = "nds-accordion-content";

  private _div: HTMLDivElement | null = null;
  private _isOpen = false;

  override connectedCallback(): void {
    if (!this._div) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const div = document.createElement("div");
    div.className = ACC_CONTENT_CLASS;
    div.dataset.slot = "content";
    div.setAttribute("role", "region");
    while (this.firstChild) div.appendChild(this.firstChild);
    this.appendChild(div);
    this._div = div;
  }

  applyItemState(labelledBy: string, id: string, isOpen: boolean): void {
    this._isOpen = isOpen;
    if (this._div) {
      this._div.id = id;
      this._div.setAttribute("aria-labelledby", labelledBy);
    }
    this.scheduleUpdate();
  }

  protected update(): void {
    if (!this._div) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    this._div.dataset.state = this._isOpen ? "open" : "closed";
    // React implementation returns null if !isOpen, but for Web Component we might want to just hide it
    // because removing from DOM might lose state of nested elements if not careful.
    // However, the CSS should handle the visibility based on data-state.
    // Let's check the CSS if possible, but for now we follow the "data-state" pattern.
    if (this._isOpen) {
      this._div.style.display = "";
    } else {
      this._div.style.display = "none";
    }
  }
}

define(NdsAccordion);
define(NdsAccordionItem);
define(NdsAccordionTrigger);
define(NdsAccordionContent);
