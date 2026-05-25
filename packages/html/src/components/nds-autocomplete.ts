/**
 * <nds-autocomplete> — DS Autocomplete 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-autocomplete
 *     value=""
 *     placeholder="상담사 이름을 검색하세요"
 *     options='[{"value": "1", "label": "김상담", "description": "심리상담사"}, {"value": "2", "label": "이상담", "description": "정신과전문의"}]'
 *   ></nds-autocomplete>
 *
 * 이벤트:
 *   autocomplete-change (detail: { value }) -> 입력값 변경
 *   autocomplete-select (detail: { option }) -> 옵션 선택
 */

import { NdsElement, define } from "../base/nds-element.js";

const AC_CLASS = "nds-autocomplete";
const AC_ROOT_CLASS = `${AC_CLASS}__root`;
const AC_INPUT_CLASS = `${AC_CLASS}__input`;
const AC_LIST_CLASS = `${AC_CLASS}__list`;
const AC_OPTION_CLASS = `${AC_CLASS}__option`;
const AC_HIGHLIGHT_CLASS = `${AC_CLASS}__highlight`;
const AC_DESCRIPTION_CLASS = `${AC_CLASS}__description`;
const AC_EMPTY_CLASS = `${AC_CLASS}__empty`;
const AC_LOADING_CLASS = `${AC_CLASS}__loading`;

export interface AutocompleteOption {
  value: string;
  label: string;
  description?: string;
}

export class NdsAutocomplete extends NdsElement {
  static elementName = "nds-autocomplete";

  static get observedAttributes(): readonly string[] {
    return [
      "value",
      "placeholder",
      "disabled",
      "error",
      "full-width",
      "loading",
      "empty-message",
      "min-query-length",
      "highlight",
      "options",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _list: HTMLUListElement | null = null;
  private _open = false;
  private _activeIdx = -1;
  private _baseId = `nds-ac-${Math.random().toString(36).slice(2, 7)}`;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
    document.addEventListener("mousedown", this._handleOutsideClick);
  }

  override disconnectedCallback(): void {
    document.removeEventListener("mousedown", this._handleOutsideClick);
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = AC_ROOT_CLASS;

    const input = document.createElement("input");
    input.type = "text";
    input.className = AC_INPUT_CLASS;
    input.autocomplete = "off";
    input.id = `${this._baseId}-input`;
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");

    input.addEventListener("input", (e) => {
      const val = (e.target as HTMLInputElement).value;
      this.setAttribute("value", val);
      this._open = true;
      this._activeIdx = -1;
      this.dispatchEvent(
        new CustomEvent("autocomplete-change", {
          detail: { value: val },
          bubbles: true,
          composed: true,
        }),
      );
      this.scheduleUpdate();
    });

    input.addEventListener("focus", () => {
      this._open = true;
      this.scheduleUpdate();
    });

    input.addEventListener("keydown", (e) => this._handleKey(e));

    const list = document.createElement("ul");
    list.className = AC_LIST_CLASS;
    list.id = `${this._baseId}-listbox`;
    list.setAttribute("role", "listbox");
    list.dataset.slot = "list";

    root.append(input, list);
    this.appendChild(root);

    this._root = root;
    this._input = input;
    this._list = list;
  }

  private _handleOutsideClick = (e: MouseEvent) => {
    if (this._root && !this._root.contains(e.target as Node)) {
      this._open = false;
      this._activeIdx = -1;
      this.scheduleUpdate();
    }
  };

  private _handleKey(e: KeyboardEvent): void {
    if (!this._open) return;

    const optionsAttr = this.getAttribute("options");
    let options: AutocompleteOption[] = [];
    try {
      options = optionsAttr ? JSON.parse(optionsAttr) : [];
    } catch {
      /* ignore */
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      this._activeIdx = Math.min(this._activeIdx + 1, options.length - 1);
      this.scheduleUpdate();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      this._activeIdx = Math.max(this._activeIdx - 1, 0);
      this.scheduleUpdate();
    } else if (e.key === "Enter") {
      if (this._activeIdx >= 0 && options[this._activeIdx]) {
        e.preventDefault();
        this._selectOption(options[this._activeIdx]);
      }
    } else if (e.key === "Escape") {
      this._open = false;
      this._activeIdx = -1;
      this.scheduleUpdate();
    }
  }

  private _selectOption(opt: AutocompleteOption): void {
    this.setAttribute("value", opt.label);
    if (this._input) this._input.value = opt.label;
    this._open = false;
    this._activeIdx = -1;
    this.dispatchEvent(
      new CustomEvent("autocomplete-select", {
        detail: { option: opt },
        bubbles: true,
        composed: true,
      }),
    );
    this.scheduleUpdate();
  }

  protected update(): void {
    if (!this._root || !this._input || !this._list) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this.attr("value", "");
    const placeholder = this.attr("placeholder", "");
    const disabled = this.boolAttr("disabled");
    const error = this.boolAttr("error");
    const fullWidth = this.boolAttr("full-width");
    const loading = this.boolAttr("loading");
    const emptyMessage = this.attr("empty-message", "결과가 없어요");
    const minQueryLength = parseInt(this.attr("min-query-length", "1"), 10);
    const highlightAttr = this.getAttribute("highlight");
    const highlight = highlightAttr === null || highlightAttr !== "false";
    const optionsAttr = this.getAttribute("options");

    let options: AutocompleteOption[] = [];
    if (optionsAttr) {
      try {
        options = JSON.parse(optionsAttr);
      } catch {
        /* ignore */
      }
    }

    this._input.value = value;
    this._input.placeholder = placeholder;
    this._input.disabled = disabled;
    this._input.dataset.error = String(error);
    this._root.dataset.fullWidth = String(fullWidth);

    const showList = this._open && value.length >= minQueryLength;
    this._input.setAttribute("aria-expanded", String(showList));
    this._list.style.display = showList ? "" : "none";

    if (showList) {
      if (loading) {
        const li = document.createElement("li");
        li.className = AC_LOADING_CLASS;
        li.textContent = "불러오는 중...";
        this._list.replaceChildren(li);
      } else if (options.length === 0) {
        const li = document.createElement("li");
        li.className = AC_EMPTY_CLASS;
        li.textContent = emptyMessage;
        this._list.replaceChildren(li);
      } else {
        const items = options.map((opt, i) => {
          const li = document.createElement("li");
          li.id = `${this._baseId}-option-${i}`;
          li.setAttribute("role", "option");
          li.setAttribute("aria-selected", String(value === opt.label));
          li.dataset.active = String(i === this._activeIdx);
          li.className = AC_OPTION_CLASS;

          li.addEventListener("mousedown", (e) => {
            e.preventDefault();
            this._selectOption(opt);
          });

          li.addEventListener("mouseenter", () => {
            this._activeIdx = i;
            this.scheduleUpdate();
          });

          const content = document.createElement("div");
          content.style.flex = "1";
          content.style.minWidth = "0";

          const labelDiv = document.createElement("div");
          if (highlight && value) {
            const lowerLabel = opt.label.toLowerCase();
            const lowerValue = value.toLowerCase();
            const idx = lowerLabel.indexOf(lowerValue);
            if (idx !== -1) {
              labelDiv.append(
                opt.label.slice(0, idx),
                (() => {
                  const span = document.createElement("span");
                  span.className = AC_HIGHLIGHT_CLASS;
                  span.textContent = opt.label.slice(idx, idx + value.length);
                  return span;
                })(),
                opt.label.slice(idx + value.length),
              );
            } else {
              labelDiv.textContent = opt.label;
            }
          } else {
            labelDiv.textContent = opt.label;
          }

          content.appendChild(labelDiv);

          if (opt.description) {
            const descDiv = document.createElement("div");
            descDiv.className = AC_DESCRIPTION_CLASS;
            descDiv.textContent = opt.description;
            content.appendChild(descDiv);
          }

          li.appendChild(content);
          return li;
        });
        this._list.replaceChildren(...items);
      }
    }

    if (this._activeIdx >= 0) {
      this._input.setAttribute(
        "aria-activedescendant",
        `${this._baseId}-option-${this._activeIdx}`,
      );
    } else {
      this._input.removeAttribute("aria-activedescendant");
    }
  }
}

define(NdsAutocomplete);
