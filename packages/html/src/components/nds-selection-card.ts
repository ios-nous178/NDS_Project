/**
 * <nds-selection-card> + <nds-selection-card-item> — DS SelectionCard 의 vanilla 버전.
 *
 * 사용 예 (단일):
 *   <nds-selection-card mode="single" value="visa" layout="vertical">
 *     <nds-selection-card-item value="visa" item-title="Visa" description="**** 1234"></nds-selection-card-item>
 *     <nds-selection-card-item value="mc" item-title="Mastercard" description="**** 5678"></nds-selection-card-item>
 *   </nds-selection-card>
 *
 * 사용 예 (다중):
 *   <nds-selection-card mode="multiple" values='["uri","depr"]'>...</nds-selection-card>
 *
 * 이벤트:
 *   nds-selection-change (detail: { mode, value? , values? })
 */

import { NdsElement, define } from "../base/nds-element.js";

const SC_CLASS = "nds-selection-card";
const SC_ROOT_CLASS = `${SC_CLASS}__root`;
const SC_ITEM_CLASS = `${SC_CLASS}__item`;
const SC_INDICATOR_CLASS = `${SC_CLASS}__indicator`;
const SC_BODY_CLASS = `${SC_CLASS}__body`;
const SC_TITLE_CLASS = `${SC_CLASS}__title`;
const SC_DESCRIPTION_CLASS = `${SC_CLASS}__description`;
const SC_CONTENT_CLASS = `${SC_CLASS}__content`;
const SC_ICON_CLASS = `${SC_CLASS}__icon`;

export type SelectionCardMode = "single" | "multiple";
export type SelectionCardLayout = "vertical" | "horizontal";

let nextNameId = 0;

/* ──────────────── <nds-selection-card> ──────────────── */

export class NdsSelectionCard extends NdsElement {
  static elementName = "nds-selection-card";

  static get observedAttributes(): readonly string[] {
    return ["mode", "value", "values", "layout", "name"];
  }

  private _root: HTMLDivElement | null = null;
  private _autoName = `nds-selection-card-${++nextNameId}`;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = SC_ROOT_CLASS;
    while (this.firstChild) root.appendChild(this.firstChild);
    this.appendChild(root);
    this._root = root;
  }

  getMode(): SelectionCardMode {
    return (this.getAttribute("mode") as SelectionCardMode) || "single";
  }

  getName(): string {
    return this.getAttribute("name") || this._autoName;
  }

  getSelectedSet(): Set<string> {
    if (this.getMode() === "single") {
      const v = this.getAttribute("value");
      return new Set(v ? [v] : []);
    }
    const raw = this.getAttribute("values");
    if (!raw) return new Set();
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return new Set();
      return new Set(parsed.map(String));
    } catch {
      return new Set();
    }
  }

  toggle(value: string): void {
    const mode = this.getMode();
    if (mode === "single") {
      this.setAttribute("value", value);
      this.dispatchEvent(
        new CustomEvent("nds-selection-change", {
          detail: { mode, value },
          bubbles: true,
          composed: true,
        }),
      );
    } else {
      const set = this.getSelectedSet();
      if (set.has(value)) set.delete(value);
      else set.add(value);
      const next = Array.from(set);
      this.setAttribute("values", JSON.stringify(next));
      this.dispatchEvent(
        new CustomEvent("nds-selection-change", {
          detail: { mode, values: next },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const mode = this.getMode();
    const layout = (this.getAttribute("layout") as SelectionCardLayout) || "vertical";

    this._root.setAttribute("role", mode === "single" ? "radiogroup" : "group");
    this._root.dataset.layout = layout;
    this._root.dataset.mode = mode;

    const items = this.querySelectorAll<NdsSelectionCardItem>("nds-selection-card-item");
    items.forEach((item) => item.refreshFromParent());
  }
}

/* ──────────────── <nds-selection-card-item> ──────────────── */

export class NdsSelectionCardItem extends NdsElement {
  static elementName = "nds-selection-card-item";

  static get observedAttributes(): readonly string[] {
    return ["value", "item-title", "description", "disabled", "show-indicator"];
  }

  private _label: HTMLLabelElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _indicator: HTMLSpanElement | null = null;
  private _iconWrap: HTMLSpanElement | null = null;
  private _bodyWrap: HTMLSpanElement | null = null;
  private _titleEl: HTMLSpanElement | null = null;
  private _descEl: HTMLSpanElement | null = null;
  private _contentWrap: HTMLSpanElement | null = null;
  private _iconStash: DocumentFragment | null = null;
  private _contentStash: DocumentFragment | null = null;
  private _itemId = `nds-sc-item-${Math.random().toString(36).slice(2, 7)}`;

  override connectedCallback(): void {
    if (!this._label) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const stash = document.createDocumentFragment();
    const contentStash = document.createDocumentFragment();
    Array.from(this.childNodes).forEach((node) => {
      if (node instanceof HTMLElement && node.getAttribute("slot") === "icon") {
        stash.appendChild(node);
      } else if (node instanceof HTMLElement && node.getAttribute("slot") === "content") {
        contentStash.appendChild(node);
      } else {
        node.parentNode?.removeChild(node);
      }
    });
    this._iconStash = stash;
    this._contentStash = contentStash;

    const label = document.createElement("label");
    label.className = SC_ITEM_CLASS;
    label.dataset.slot = "item";
    label.setAttribute("for", this._itemId);

    const input = document.createElement("input");
    input.id = this._itemId;
    input.addEventListener("change", () => {
      const parent = this.closest<NdsSelectionCard>("nds-selection-card");
      if (!parent) return;
      const value = this.getAttribute("value") || "";
      if (this.boolAttr("disabled")) return;
      parent.toggle(value);
    });

    const indicator = document.createElement("span");
    indicator.className = SC_INDICATOR_CLASS;
    indicator.setAttribute("aria-hidden", "true");

    const iconWrap = document.createElement("span");
    iconWrap.className = SC_ICON_CLASS;
    if (stash.childNodes.length > 0) iconWrap.appendChild(stash.cloneNode(true));

    const bodyWrap = document.createElement("span");
    bodyWrap.className = SC_BODY_CLASS;

    const titleEl = document.createElement("span");
    titleEl.className = SC_TITLE_CLASS;

    const descEl = document.createElement("span");
    descEl.className = SC_DESCRIPTION_CLASS;

    const contentWrap = document.createElement("span");
    contentWrap.className = SC_CONTENT_CLASS;
    if (contentStash.childNodes.length > 0) contentWrap.appendChild(contentStash.cloneNode(true));

    bodyWrap.append(titleEl, descEl, contentWrap);

    label.append(input, indicator, iconWrap, bodyWrap);
    this.appendChild(label);

    this._label = label;
    this._input = input;
    this._indicator = indicator;
    this._iconWrap = iconWrap;
    this._bodyWrap = bodyWrap;
    this._titleEl = titleEl;
    this._descEl = descEl;
    this._contentWrap = contentWrap;
  }

  refreshFromParent(): void {
    this.scheduleUpdate();
  }

  protected update(): void {
    if (
      !this._label ||
      !this._input ||
      !this._indicator ||
      !this._iconWrap ||
      !this._titleEl ||
      !this._descEl
    ) {
      return;
    }
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this.getAttribute("value") || "";
    const title = this.getAttribute("item-title") || "";
    const description = this.getAttribute("description");
    const disabled = this.boolAttr("disabled");
    const showIndicator = this.attr("show-indicator", "true") !== "false";

    const parent = this.closest<NdsSelectionCard>("nds-selection-card");
    const mode: SelectionCardMode = parent ? parent.getMode() : "single";
    const name = parent ? parent.getName() : "";
    const selectedSet = parent ? parent.getSelectedSet() : new Set<string>();
    const checked = selectedSet.has(value);

    this._label.dataset.checked = checked ? "true" : "false";
    this._label.dataset.disabled = disabled ? "true" : "false";
    this._label.dataset.mode = mode;

    this._input.type = mode === "single" ? "radio" : "checkbox";
    if (mode === "single") this._input.name = name;
    else this._input.removeAttribute("name");
    this._input.value = value;
    this._input.checked = checked;
    this._input.disabled = disabled;

    this._indicator.style.display = showIndicator ? "" : "none";
    this._indicator.innerHTML = "";
    if (showIndicator) {
      if (mode === "multiple") {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "12");
        svg.setAttribute("height", "12");
        svg.setAttribute("viewBox", "0 0 12 12");
        svg.setAttribute("fill", "none");
        svg.innerHTML = `<path d="M2.5 6.5l2.5 2.5L9.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
        this._indicator.appendChild(svg);
      } else {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "10");
        svg.setAttribute("height", "10");
        svg.setAttribute("viewBox", "0 0 10 10");
        svg.innerHTML = `<circle cx="5" cy="5" r="4" fill="currentColor"/>`;
        this._indicator.appendChild(svg);
      }
    }

    this._iconWrap.style.display =
      this._iconStash && this._iconStash.childNodes.length > 0 ? "" : "none";

    this._titleEl.textContent = title;
    if (description) {
      this._descEl.textContent = description;
      this._descEl.style.display = "";
    } else {
      this._descEl.style.display = "none";
    }

    if (this._contentWrap) {
      this._contentWrap.style.display =
        this._contentStash && this._contentStash.childNodes.length > 0 ? "" : "none";
    }
  }
}

define(NdsSelectionCard);
define(NdsSelectionCardItem);
