/**
 * <nds-multi-select> — DS MultiSelect 의 vanilla Web Component 버전.
 *
 * 검색 + 전체선택 + 체크박스 + 취소/적용 푸터를 가진 다중 선택 필터 드롭다운.
 * 일반 <nds-select>(단일·즉시 반영)와 달리 패널 안에서 초안을 편집하고 "적용" 시에만 반영.
 *
 * 사용 패턴:
 *   <nds-multi-select
 *     placeholder="모든 광고"
 *     search-placeholder="광고명으로 검색"
 *     value='[]'
 *     options='[{"value":"a","label":"캠페인 A"},{"value":"b","label":"캠페인 B"}]'>
 *   </nds-multi-select>
 *
 * 이벤트:
 *   적용 클릭 → host 의 value attribute(JSON 배열) 갱신 +
 *   "nds-multi-select-change" CustomEvent (detail: { value: string[] }) (bubbles, composed)
 */

import { NdsElement, define } from "../base/nds-element.js";

const MS_CLASS = "nds-multi-select";
const MS_TRIGGER_CLASS = `${MS_CLASS}__trigger`;
const MS_TRIGGER_TEXT_CLASS = `${MS_CLASS}__trigger-text`;
const MS_CHEVRON_CLASS = `${MS_CLASS}__chevron`;
const MS_DROPDOWN_CLASS = `${MS_CLASS}__dropdown`;
const MS_SEARCH_CLASS = `${MS_CLASS}__search`;
const MS_SELECT_ALL_CLASS = `${MS_CLASS}__select-all`;
const MS_COUNT_CLASS = `${MS_CLASS}__count`;
const MS_LIST_CLASS = `${MS_CLASS}__list`;
const MS_OPTION_CLASS = `${MS_CLASS}__option`;
const MS_OPTION_CHECK_CLASS = `${MS_CLASS}__option-check`;
const MS_OPTION_LABEL_CLASS = `${MS_CLASS}__option-label`;
const MS_EMPTY_CLASS = `${MS_CLASS}__empty`;
const MS_FOOTER_CLASS = `${MS_CLASS}__footer`;
const MS_FOOTER_BTN_CLASS = `${MS_CLASS}__footer-button`;

const CHEVRON_SVG =
  '<svg viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SEARCH_SVG =
  '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5"/><path d="M13 13l-2.5-2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
const CHECK_SVG =
  '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5l2.5 2.5L9.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

interface MsOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export class NdsMultiSelect extends NdsElement {
  static elementName = "nds-multi-select";

  static get observedAttributes(): readonly string[] {
    return [
      "options",
      "value",
      "placeholder",
      "search-placeholder",
      "searchable",
      "select-all-label",
      "apply-label",
      "cancel-label",
      "empty-message",
      "error",
      "disabled",
      "full-width",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _trigger: HTMLButtonElement | null = null;
  private _triggerText: HTMLSpanElement | null = null;
  private _chevron: HTMLSpanElement | null = null;
  private _dropdown: HTMLDivElement | null = null;

  private _open = false;
  private _query = "";
  private _draft = new Set<string>();
  private _onDocPointerDown = (e: MouseEvent) => {
    const target = e.target as Node | null;
    if (!target) return;
    if (this.contains(target)) return;
    this._close();
  };

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    document.removeEventListener("mousedown", this._onDocPointerDown);
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = MS_CLASS;

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.dataset.slot = "trigger";
    trigger.className = MS_TRIGGER_CLASS;
    trigger.setAttribute("aria-haspopup", "listbox");

    const text = document.createElement("span");
    text.className = MS_TRIGGER_TEXT_CLASS;

    const chevron = document.createElement("span");
    chevron.className = MS_CHEVRON_CLASS;
    chevron.setAttribute("aria-hidden", "true");
    chevron.innerHTML = CHEVRON_SVG;

    trigger.append(text, chevron);
    trigger.addEventListener("click", () => {
      if (this.boolAttr("disabled")) return;
      if (this._open) this._close();
      else this._openPanel();
    });

    root.appendChild(trigger);
    this.replaceChildren(root);

    this._root = root;
    this._trigger = trigger;
    this._triggerText = text;
    this._chevron = chevron;
  }

  /* ── attribute-derived ── */

  private _getOptions(): MsOption[] {
    const raw = this.getAttribute("options");
    if (!raw || !raw.trim()) return [];
    try {
      const parsed = JSON.parse(raw) as Array<Record<string, unknown>>;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((o) => ({
          value: typeof o.value === "string" ? o.value : String(o.value ?? ""),
          label: typeof o.label === "string" ? o.label : String(o.label ?? ""),
          disabled: o.disabled === true,
        }))
        .filter((o) => o.value);
    } catch {
      return [];
    }
  }

  private _getValue(): string[] {
    const raw = this.getAttribute("value");
    if (!raw || !raw.trim()) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }

  /* ── open/close ── */

  private _openPanel(): void {
    this._draft = new Set(this._getValue());
    this._query = "";
    this._open = true;
    document.addEventListener("mousedown", this._onDocPointerDown);
    this.scheduleUpdate();
  }

  private _close(): void {
    if (!this._open) return;
    this._open = false;
    document.removeEventListener("mousedown", this._onDocPointerDown);
    this.scheduleUpdate();
  }

  private _apply(): void {
    const options = this._getOptions();
    const next = options.filter((o) => this._draft.has(o.value)).map((o) => o.value);
    this.setAttribute("value", JSON.stringify(next));
    this._open = false;
    document.removeEventListener("mousedown", this._onDocPointerDown);
    this.dispatchEvent(
      new CustomEvent("nds-multi-select-change", {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
    this.scheduleUpdate();
  }

  /* ── render ── */

  protected update(): void {
    if (!this._root || !this._trigger || !this._triggerText || !this._chevron) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const disabled = this.boolAttr("disabled");
    const error = this.boolAttr("error");
    const fullWidth = this.attr("full-width", "true") !== "false";
    const value = this._getValue();
    const placeholder = this.attr("placeholder", "선택");

    this._root.dataset.open = this._open ? "true" : "false";
    this._root.dataset.disabled = disabled ? "true" : "false";
    this._root.dataset.fullwidth = fullWidth ? "true" : "false";

    this._trigger.disabled = disabled;
    this._trigger.dataset.open = this._open ? "true" : "false";
    this._trigger.dataset.hasValue = value.length > 0 ? "true" : "false";
    this._trigger.dataset.error = error ? "true" : "false";
    this._trigger.dataset.disabled = disabled ? "true" : "false";
    this._trigger.setAttribute("aria-expanded", this._open ? "true" : "false");

    this._triggerText.dataset.placeholder = value.length > 0 ? "false" : "true";
    this._triggerText.textContent = value.length > 0 ? `${value.length}개 선택` : placeholder;
    this._chevron.dataset.open = this._open ? "true" : "false";

    if (this._open) this._renderDropdown();
    else if (this._dropdown) {
      this._dropdown.remove();
      this._dropdown = null;
    }
  }

  private _renderDropdown(): void {
    if (!this._root) return;
    const options = this._getOptions();
    const searchable = this.attr("searchable", "true") !== "false";
    const q = this._query.trim().toLowerCase();
    const filtered = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
    const filteredEnabled = filtered.filter((o) => !o.disabled);
    const allSelected =
      filteredEnabled.length > 0 && filteredEnabled.every((o) => this._draft.has(o.value));

    const dd = document.createElement("div");
    dd.dataset.slot = "dropdown";
    dd.className = MS_DROPDOWN_CLASS;
    dd.setAttribute("role", "listbox");
    dd.setAttribute("aria-multiselectable", "true");
    dd.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        this._close();
      }
    });

    /* search */
    if (searchable) {
      const search = document.createElement("div");
      search.className = MS_SEARCH_CLASS;
      search.innerHTML = SEARCH_SVG;
      const input = document.createElement("input");
      input.type = "text";
      input.value = this._query;
      input.placeholder = this.attr("search-placeholder", "검색");
      input.addEventListener("input", () => {
        this._query = input.value;
        this._renderDropdown();
        const next = this._dropdown?.querySelector<HTMLInputElement>(`.${MS_SEARCH_CLASS} input`);
        if (next) {
          next.focus();
          next.setSelectionRange(input.value.length, input.value.length);
        }
      });
      search.appendChild(input);
      dd.appendChild(search);
    }

    /* select-all */
    const selectAll = document.createElement("button");
    selectAll.type = "button";
    selectAll.dataset.slot = "select-all";
    selectAll.className = MS_SELECT_ALL_CLASS;
    selectAll.disabled = filteredEnabled.length === 0;
    selectAll.innerHTML =
      `<span class="${MS_OPTION_CHECK_CLASS}" data-checked="${allSelected ? "true" : "false"}" aria-hidden="true">${CHECK_SVG}</span>` +
      `<span>${escapeHtml(this.attr("select-all-label", "전체선택 / 해제"))}</span>` +
      `<span class="${MS_COUNT_CLASS}">${this._draft.size}개 선택</span>`;
    selectAll.addEventListener("click", () => {
      if (allSelected) filteredEnabled.forEach((o) => this._draft.delete(o.value));
      else filteredEnabled.forEach((o) => this._draft.add(o.value));
      this._renderDropdown();
    });
    dd.appendChild(selectAll);

    /* list */
    const list = document.createElement("div");
    list.dataset.slot = "list";
    list.className = MS_LIST_CLASS;
    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.dataset.slot = "empty";
      empty.className = MS_EMPTY_CLASS;
      empty.textContent = this.attr("empty-message", "검색 결과가 없습니다.");
      list.appendChild(empty);
    } else {
      for (const opt of filtered) {
        const checked = this._draft.has(opt.value);
        const label = document.createElement("label");
        label.className = MS_OPTION_CLASS;
        label.setAttribute("role", "option");
        label.setAttribute("aria-selected", checked ? "true" : "false");
        label.dataset.checked = checked ? "true" : "false";
        label.dataset.disabled = opt.disabled ? "true" : "false";
        label.innerHTML =
          `<input type="checkbox"${checked ? " checked" : ""}${opt.disabled ? " disabled" : ""}/>` +
          `<span class="${MS_OPTION_CHECK_CLASS}" data-checked="${checked ? "true" : "false"}" aria-hidden="true">${CHECK_SVG}</span>` +
          `<span class="${MS_OPTION_LABEL_CLASS}">${escapeHtml(opt.label)}</span>`;
        const input = label.querySelector("input");
        input?.addEventListener("change", () => {
          if (opt.disabled) return;
          if (this._draft.has(opt.value)) this._draft.delete(opt.value);
          else this._draft.add(opt.value);
          this._renderDropdown();
        });
        list.appendChild(label);
      }
    }
    dd.appendChild(list);

    /* footer */
    const footer = document.createElement("div");
    footer.dataset.slot = "footer";
    footer.className = MS_FOOTER_CLASS;
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.dataset.variant = "cancel";
    cancel.className = MS_FOOTER_BTN_CLASS;
    cancel.textContent = this.attr("cancel-label", "취소");
    cancel.addEventListener("click", () => this._close());
    const apply = document.createElement("button");
    apply.type = "button";
    apply.dataset.variant = "apply";
    apply.className = MS_FOOTER_BTN_CLASS;
    apply.textContent = this.attr("apply-label", "적용");
    apply.addEventListener("click", () => this._apply());
    footer.append(cancel, apply);
    dd.appendChild(footer);

    if (this._dropdown) this._dropdown.replaceWith(dd);
    else this._root.appendChild(dd);
    this._dropdown = dd;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

define(NdsMultiSelect);
