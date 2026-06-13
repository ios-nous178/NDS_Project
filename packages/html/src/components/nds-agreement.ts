/**
 * <nds-agreement> — DS Agreement 의 vanilla Web Component 버전.
 *
 * 약관 동의: 전체동의(master) + 필수/선택 항목 cascade. React Agreement.tsx 와 동일한
 * class / data-slot / 치수 구조를 light DOM 에 만들어 같은 stylesheet 를 재사용한다.
 *
 * 포커스 보존(mount-once): 행은 **구조(items/all-label/view-label)가 바뀔 때만** 재구성하고,
 * value 갱신은 기존 checkbox 노드에 상태만 입힌다(input 재생성 금지 — 포커스 유실 방지).
 *
 * 사용 패턴:
 *   <nds-agreement
 *     all-label="전체 동의"
 *     value='[]'
 *     items='[{"value":"tos","label":"이용약관 동의","required":true,"viewHref":"/tos"},
 *             {"value":"mkt","label":"마케팅 수신 동의","required":false}]'>
 *   </nds-agreement>
 *
 * 이벤트:
 *   동의 변경 → host 의 value attribute(JSON 배열) 갱신 +
 *   "nds-agreement-change" CustomEvent (detail: { value: string[] }) (bubbles, composed)
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const AG_CLASS = "nds-agreement";
const AG_ALL_CLASS = `${AG_CLASS}__all`;
const AG_DIVIDER_CLASS = `${AG_CLASS}__divider`;
const AG_LIST_CLASS = `${AG_CLASS}__list`;
const AG_ROW_CLASS = `${AG_CLASS}__row`;
const AG_OPTION_CLASS = `${AG_CLASS}__option`;
const AG_INPUT_CLASS = `${AG_CLASS}__input`;
const AG_CHECK_CLASS = `${AG_CLASS}__check`;
const AG_LABEL_CLASS = `${AG_CLASS}__label`;
const AG_BADGE_CLASS = `${AG_CLASS}__badge`;
const AG_VIEW_CLASS = `${AG_CLASS}__view`;

const CHECK_SVG =
  '<svg class="' +
  AG_CHECK_CLASS +
  '-icon" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7L6 10L11 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const MINUS_SVG =
  '<svg class="' +
  AG_CHECK_CLASS +
  '-minus" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3.5 7H10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

interface AgItem {
  value: string;
  label: string;
  required?: boolean;
  viewHref?: string;
  viewLabel?: string;
  disabled?: boolean;
}

type CheckState = "checked" | "indeterminate" | "unchecked";

/** 빌드된 행 한 벌 — value 갱신 시 이 노드들에 상태만 입힌다(재생성 금지). */
interface RowRefs {
  row: HTMLElement;
  input: HTMLInputElement;
  check: HTMLElement;
}

export class NdsAgreement extends NdsElement {
  static elementName = "nds-agreement";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-agreement"].observedAttributes];
  }

  private _root: HTMLDivElement | null = null;
  private _structSig: string | null = null;
  private _allRefs: RowRefs | null = null;
  private _itemRefs: Array<RowRefs & { value: string; disabled: boolean }> = [];

  override connectedCallback(): void {
    if (!this._root) {
      const root = document.createElement("div");
      root.dataset.slot = "root";
      root.className = AG_CLASS;
      this.replaceChildren(root);
      this._root = root;
    }
    super.connectedCallback();
  }

  private _getItems(): AgItem[] {
    const raw = this.getAttribute("items");
    if (!raw || !raw.trim()) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? (parsed.filter(
            (o) => o && typeof o.value === "string" && typeof o.label === "string",
          ) as AgItem[])
        : [];
    } catch {
      return [];
    }
  }

  private _getValue(): Set<string> {
    const raw = this.getAttribute("value");
    if (!raw || !raw.trim()) return new Set();
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? new Set(parsed.map(String)) : new Set();
    } catch {
      return new Set();
    }
  }

  private _commit(next: Set<string>): void {
    const ordered = this._getItems()
      .map((i) => i.value)
      .filter((v) => next.has(v));
    // value attributeChangedCallback → scheduleUpdate → 상태 sync (행 재생성 없음)
    this.setAttribute("value", JSON.stringify(ordered));
    this.dispatchEvent(
      new CustomEvent("nds-agreement-change", {
        detail: { value: ordered },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const items = this._getItems();
    const allLabel = this.getAttribute("all-label");
    const viewLabel = this.getAttribute("view-label");
    const sig = JSON.stringify({ items, allLabel, viewLabel });

    if (sig !== this._structSig) {
      this._structSig = sig;
      this._rebuild(items, allLabel, viewLabel);
    }
    this._syncState(items);
  }

  /* ── 구조 재구성(items/all-label/view-label 변경 시에만) ── */
  private _rebuild(items: AgItem[], allLabel: string | null, viewLabel: string | null): void {
    const root = this._root!;
    root.replaceChildren();
    this._allRefs = null;
    this._itemRefs = [];

    const showAll = allLabel !== "none" && allLabel !== "";
    if (showAll) {
      const { row, input, check } = this._buildRow({ label: allLabel ?? "전체 동의", isAll: true });
      input.addEventListener("change", () => this._toggleAll());
      this._allRefs = { row, input, check };
      root.appendChild(row);

      const divider = document.createElement("div");
      divider.className = AG_DIVIDER_CLASS;
      divider.setAttribute("role", "separator");
      root.appendChild(divider);
    }

    const list = document.createElement("div");
    list.dataset.slot = "list";
    list.className = AG_LIST_CLASS;
    for (const item of items) {
      const { row, input, check } = this._buildRow({
        label: item.label,
        required: item.required,
        disabled: item.disabled,
        viewHref: item.viewHref,
        viewLabel: item.viewLabel ?? viewLabel ?? undefined,
      });
      input.addEventListener("change", () => this._toggleItem(item.value));
      this._itemRefs.push({ row, input, check, value: item.value, disabled: !!item.disabled });
      list.appendChild(row);
    }
    root.appendChild(list);
  }

  /* ── 상태만 입힘(value 변경 시) ── */
  private _syncState(items: AgItem[]): void {
    const selected = this._getValue();
    const toggleable = items.filter((i) => !i.disabled).map((i) => i.value);
    const hit = toggleable.filter((v) => selected.has(v)).length;
    const allState: CheckState =
      toggleable.length === 0 || hit === 0
        ? "unchecked"
        : hit === toggleable.length
          ? "checked"
          : "indeterminate";

    if (this._allRefs) applyState(this._allRefs, allState);
    for (const ref of this._itemRefs) {
      applyState(ref, selected.has(ref.value) ? "checked" : "unchecked");
    }
  }

  private _toggleAll(): void {
    const selected = this._getValue();
    const toggleable = this._getItems()
      .filter((i) => !i.disabled)
      .map((i) => i.value);
    const allOn = toggleable.length > 0 && toggleable.every((v) => selected.has(v));
    const next = new Set(selected);
    if (allOn) toggleable.forEach((v) => next.delete(v));
    else toggleable.forEach((v) => next.add(v));
    this._commit(next);
  }

  private _toggleItem(value: string): void {
    const next = this._getValue();
    if (next.has(value)) next.delete(value);
    else next.add(value);
    this._commit(next);
  }

  private _buildRow(opts: {
    label: string;
    isAll?: boolean;
    required?: boolean;
    disabled?: boolean;
    viewHref?: string;
    viewLabel?: string;
  }): RowRefs {
    const row = document.createElement("div");
    row.className = opts.isAll ? `${AG_ROW_CLASS} ${AG_ALL_CLASS}` : AG_ROW_CLASS;
    if (opts.isAll) row.dataset.all = "true";
    if (opts.disabled) row.dataset.disabled = "true";

    const label = document.createElement("label");
    label.className = AG_OPTION_CLASS;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = AG_INPUT_CLASS;
    if (opts.disabled) input.disabled = true;

    const check = document.createElement("span");
    check.className = AG_CHECK_CLASS;
    check.setAttribute("aria-hidden", "true");
    check.innerHTML = CHECK_SVG + MINUS_SVG;

    label.append(input, check);

    if (!opts.isAll) {
      const badge = document.createElement("span");
      badge.className = AG_BADGE_CLASS;
      badge.dataset.required = opts.required ? "true" : "false";
      badge.textContent = opts.required ? "필수" : "선택";
      label.appendChild(badge);
    }

    const text = document.createElement("span");
    text.className = AG_LABEL_CLASS;
    text.textContent = opts.label;
    label.appendChild(text);

    row.appendChild(label);

    if (opts.viewHref) {
      const view = document.createElement("a");
      view.className = AG_VIEW_CLASS;
      view.href = opts.viewHref;
      view.target = "_blank";
      view.rel = "noreferrer";
      view.textContent = opts.viewLabel ?? "보기";
      row.appendChild(view);
    }

    return { row, input, check };
  }
}

function applyState(ref: RowRefs, state: CheckState): void {
  ref.row.dataset.state = state;
  ref.check.dataset.state = state;
  ref.input.checked = state === "checked";
  ref.input.indeterminate = state === "indeterminate";
  if (state === "indeterminate") ref.input.setAttribute("aria-checked", "mixed");
  else ref.input.removeAttribute("aria-checked");
}

define(NdsAgreement);
