/**
 * <nds-multi-select> — DS MultiSelect 의 vanilla Web Component 버전.
 *
 * 검색 + 전체선택 + 체크박스 + 취소/적용 푸터를 가진 다중 선택 필터 드롭다운.
 * 내부는 DS 커스텀 엘리먼트 조합: 검색=<nds-search-input>, 전체선택/옵션=<nds-checkbox>,
 * 푸터=<nds-button>. 일반 <nds-select>(단일·즉시 반영)와 달리 초안을 패널에서 편집 후 "적용".
 *
 * 사용:
 *   <nds-multi-select placeholder="모든 광고" search-placeholder="광고명으로 검색"
 *     value='[]' options='[{"value":"a","label":"캠페인 A"}]'></nds-multi-select>
 *
 * 이벤트: 적용 클릭 → value attribute(JSON) 갱신 + "nds-multi-select-change" (detail:{value}).
 */

import { NdsElement, define } from "../base/nds-element.js";
// 조합 대상 커스텀 엘리먼트 등록 보장 (side-effect import).
import "./nds-checkbox.js";
import "./nds-search-input.js";
import "./nds-button.js";

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
const MS_EMPTY_CLASS = `${MS_CLASS}__empty`;
const MS_FOOTER_CLASS = `${MS_CLASS}__footer`;

const CHEVRON_SVG =
  '<svg viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

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
  private _selectAll: HTMLDivElement | null = null;
  private _list: HTMLDivElement | null = null;

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

    if (this._open) {
      if (!this._dropdown) this._buildDropdown();
      this._renderBody();
    } else if (this._dropdown) {
      this._dropdown.remove();
      this._dropdown = null;
      this._selectAll = null;
      this._list = null;
    }
  }

  /** 드롭다운 골격을 한 번 만든다 — 검색(nds-search-input)·푸터(nds-button)는 영구 유지(포커스 보존). */
  private _buildDropdown(): void {
    if (!this._root) return;
    const dd = document.createElement("div");
    dd.dataset.slot = "dropdown";
    dd.className = MS_DROPDOWN_CLASS;
    dd.setAttribute("role", "group");
    dd.setAttribute("aria-label", this.attr("placeholder", "선택"));
    dd.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        this._close();
      }
    });

    /* search — nds-search-input 조합 */
    if (this.attr("searchable", "true") !== "false") {
      const searchWrap = document.createElement("div");
      searchWrap.dataset.slot = "search";
      searchWrap.className = MS_SEARCH_CLASS;
      const search = document.createElement("nds-search-input");
      search.setAttribute("placeholder", this.attr("search-placeholder", "검색"));
      search.setAttribute("show-search-button", "false");
      search.setAttribute("full-width", "true");
      if (this._query) search.setAttribute("value", this._query);
      search.addEventListener("search-input-change", (e) => {
        const detail = (e as CustomEvent<{ value?: string }>).detail;
        this._query = detail?.value ?? search.getAttribute("value") ?? "";
        this._renderBody();
      });
      searchWrap.appendChild(search);
      dd.appendChild(searchWrap);
    }

    /* select-all (refilled in _renderBody) */
    const selectAll = document.createElement("div");
    selectAll.dataset.slot = "select-all";
    selectAll.className = MS_SELECT_ALL_CLASS;
    dd.appendChild(selectAll);
    this._selectAll = selectAll;

    /* list (refilled in _renderBody) */
    const list = document.createElement("div");
    list.dataset.slot = "list";
    list.className = MS_LIST_CLASS;
    dd.appendChild(list);
    this._list = list;

    /* footer — nds-button 조합 */
    const footer = document.createElement("div");
    footer.dataset.slot = "footer";
    footer.className = MS_FOOTER_CLASS;
    footer.append(
      this._footerButton("outlined", "cancel", this.attr("cancel-label", "취소"), () =>
        this._close(),
      ),
      this._footerButton("solid", "apply", this.attr("apply-label", "적용"), () => this._apply()),
    );
    dd.appendChild(footer);

    this._root.appendChild(dd);
    this._dropdown = dd;

    // 열릴 때 검색창 포커스
    dd.querySelector<HTMLInputElement>("nds-search-input input")?.focus();
  }

  private _footerButton(
    variant: "outlined" | "solid",
    slot: string,
    label: string,
    onClick: () => void,
  ): HTMLElement {
    const btn = document.createElement("nds-button");
    btn.setAttribute("color", "neutral");
    btn.setAttribute("variant", variant);
    btn.setAttribute("size", "sm");
    btn.dataset.slot = slot;
    btn.textContent = label;
    btn.addEventListener("click", onClick);
    return btn;
  }

  /** draft/query 에 따라 select-all + 옵션 목록만 다시 그린다 (검색·푸터는 보존). */
  private _renderBody(): void {
    if (!this._selectAll || !this._list) return;
    const options = this._getOptions();
    const q = this._query.trim().toLowerCase();
    const filtered = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
    const filteredEnabled = filtered.filter((o) => !o.disabled);
    const selectedCount = filteredEnabled.filter((o) => this._draft.has(o.value)).length;
    const allSelected = filteredEnabled.length > 0 && selectedCount === filteredEnabled.length;
    const someSelected = selectedCount > 0 && !allSelected;

    /* select-all — nds-checkbox(indeterminate) 조합 */
    const allCb = document.createElement("nds-checkbox");
    allCb.setAttribute("label", this.attr("select-all-label", "전체선택 / 해제"));
    if (allSelected) allCb.setAttribute("checked", "");
    if (someSelected) allCb.setAttribute("indeterminate", "");
    if (filteredEnabled.length === 0) allCb.setAttribute("disabled", "");
    allCb.addEventListener("change", () => {
      if (allSelected) filteredEnabled.forEach((o) => this._draft.delete(o.value));
      else filteredEnabled.forEach((o) => this._draft.add(o.value));
      this._renderBody();
    });
    const count = document.createElement("span");
    count.className = MS_COUNT_CLASS;
    count.textContent = `${this._draft.size}개 선택`;
    this._selectAll.replaceChildren(allCb, count);

    /* list — 옵션마다 nds-checkbox */
    if (filtered.length === 0) {
      const empty = document.createElement("div");
      empty.dataset.slot = "empty";
      empty.className = MS_EMPTY_CLASS;
      empty.textContent = this.attr("empty-message", "검색 결과가 없습니다.");
      this._list.replaceChildren(empty);
      return;
    }
    const rows = filtered.map((opt) => {
      const checked = this._draft.has(opt.value);
      const row = document.createElement("div");
      row.dataset.slot = "option";
      row.dataset.checked = checked ? "true" : "false";
      row.dataset.disabled = opt.disabled ? "true" : "false";
      row.className = MS_OPTION_CLASS;
      const cb = document.createElement("nds-checkbox");
      cb.setAttribute("label", opt.label);
      if (checked) cb.setAttribute("checked", "");
      if (opt.disabled) cb.setAttribute("disabled", "");
      cb.addEventListener("change", () => {
        if (opt.disabled) return;
        if (this._draft.has(opt.value)) this._draft.delete(opt.value);
        else this._draft.add(opt.value);
        this._renderBody();
      });
      row.appendChild(cb);
      return row;
    });
    this._list.replaceChildren(...rows);
  }
}

define(NdsMultiSelect);
