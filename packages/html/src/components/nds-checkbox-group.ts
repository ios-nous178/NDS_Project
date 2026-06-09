/**
 * <nds-checkbox-group> — DS CheckboxGroup 의 vanilla Web Component 버전.
 *
 * 두 모드:
 *  · 데이터 모드 (`items` 속성): 전체선택(자식 비율 → indeterminate 자동) + 체크 리스트 +
 *    badge/detail 슬롯. value/onValueChange 를 관리. 약관 동의·다중 필터·설정 묶음 등.
 *  · 레이아웃 모드 (`items` 없음): 자식 <nds-checkbox> 들을 vertical/horizontal + gap 으로 배치.
 *
 * React CheckboxGroup.tsx 와 동일한 class / data-slot 구조를 light DOM 에 만들어 같은
 * stylesheet 를 재사용한다. 각 체크박스는 nds-checkbox__* 마크업을 그대로 그린다.
 *
 * 사용 패턴(데이터 모드):
 *   <nds-checkbox-group select-all select-all-label="전체 동의" expandable
 *     value='["terms"]'
 *     items='[{"value":"terms","label":"이용약관","badge":"[필수]","detail":"…"}]'>
 *   </nds-checkbox-group>
 *
 * 이벤트(데이터 모드): nds-checkbox-group-change (detail: { value: string[] }) (bubbles, composed)
 */

import { NdsElement, define } from "../base/nds-element.js";

const CG_CLASS = "nds-checkbox-group";
const CG_SELECT_ALL_CLASS = `${CG_CLASS}__select-all`;
const CG_DIVIDER_CLASS = `${CG_CLASS}__divider`;
const CG_LIST_CLASS = `${CG_CLASS}__list`;
const CG_ITEM_CLASS = `${CG_CLASS}__item`;
const CG_ROW_CLASS = `${CG_CLASS}__row`;
const CG_CHECKBOX_CLASS = `${CG_CLASS}__checkbox`;
const CG_BADGE_CLASS = `${CG_CLASS}__badge`;
const CG_TOGGLE_CLASS = `${CG_CLASS}__toggle`;
const CG_DETAIL_CLASS = `${CG_CLASS}__detail`;

const CB_CLASS = "nds-checkbox";
const CB_ROOT_CLASS = `${CB_CLASS}__root`;
const CB_INPUT_CLASS = `${CB_CLASS}__input`;
const CB_INDICATOR_CLASS = `${CB_CLASS}__indicator`;
const CB_CHECK_ICON_CLASS = `${CB_CLASS}__check`;
const CB_MINUS_ICON_CLASS = `${CB_CLASS}__minus`;
const CB_LABEL_CLASS = `${CB_CLASS}__label`;

const CHECK_SVG =
  `<svg class="${CB_CHECK_ICON_CLASS}" viewBox="0 0 14 14" fill="none" aria-hidden="true">` +
  '<path d="M3 7L6 10L11 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const MINUS_SVG =
  `<svg class="${CB_MINUS_ICON_CLASS}" viewBox="0 0 14 14" fill="none" aria-hidden="true">` +
  '<path d="M3.5 7H10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const CHEVRON_SVG =
  '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

type CbState = "checked" | "indeterminate" | "unchecked";

interface CgItem {
  value: string;
  label: string;
  disabled?: boolean;
  badge?: string;
  required?: boolean;
  detail?: string;
}

/**
 * 뱃지를 필수 강조할지 결정 — required 명시값 우선, 미지정이면 badge 에 "필수" 포함 시 자동 강조.
 * (react CheckboxGroup 의 isBadgeRequired 미러 — `badge:"[필수]"` 에 required 누락 방지)
 */
function isBadgeRequired(item: CgItem): boolean {
  if (typeof item.required === "boolean") return item.required;
  return typeof item.badge === "string" && item.badge.includes("필수");
}

let nextId = 0;

export class NdsCheckboxGroup extends NdsElement {
  static elementName = "nds-checkbox-group";

  static get observedAttributes(): readonly string[] {
    return ["items", "value", "select-all", "select-all-label", "expandable", "layout", "gap"];
  }

  private _root: HTMLDivElement | null = null;
  private _openKeys = new Set<string>();
  private _childrenMoved = false;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "group";
    root.setAttribute("role", "group");
    root.className = CG_CLASS;
    // 레이아웃 모드용: 기존 자식(<nds-checkbox> 등)을 root 로 이동(데이터 모드면 update 가 덮어씀)
    while (this.firstChild) root.appendChild(this.firstChild);
    this._childrenMoved = true;
    this.appendChild(root);
    this._root = root;
  }

  /* ── attribute-derived ── */

  private _getItems(): CgItem[] | null {
    const raw = this.getAttribute("items");
    if (raw === null) return null; // 속성 자체가 없으면 레이아웃 모드
    if (!raw.trim()) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((i) => i && typeof i.value === "string" && i.label != null)
        .map((i) => ({
          value: String(i.value),
          label: String(i.label),
          disabled: i.disabled === true,
          badge: i.badge != null ? String(i.badge) : undefined,
          required: typeof i.required === "boolean" ? i.required : undefined,
          detail: typeof i.detail === "string" ? i.detail : undefined,
        }));
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

  private _commit(items: CgItem[], next: Set<string>): void {
    const ordered = items.filter((i) => next.has(i.value)).map((i) => i.value);
    this.setAttribute("value", JSON.stringify(ordered));
    this.dispatchEvent(
      new CustomEvent("nds-checkbox-group-change", {
        detail: { value: ordered },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /* ── render ── */

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    this._root.dataset.layout = this.attr("layout", "vertical");
    const gap = this.getAttribute("gap");
    if (gap) {
      this._root.style.setProperty("--nds-checkbox-group-gap", `${gap}px`);
      this._root.style.setProperty("--nds-choice-group-gap", `${gap}px`);
    }

    const items = this._getItems();
    if (items === null) {
      // 레이아웃 모드 — 자식은 _mount 에서 root 로 이동됨. 추가 렌더 없음.
      delete this._root.dataset.mode;
      return;
    }

    this._root.dataset.mode = "data";
    this._renderData(items);
  }

  private _renderData(items: CgItem[]): void {
    if (!this._root) return;
    const selected = this._getValue();
    const selectAll = this.boolAttr("select-all");
    const expandable = this.attr("expandable", "true") !== "false";

    const enabled = items.filter((i) => !i.disabled).map((i) => i.value);
    const allChecked = enabled.length > 0 && enabled.every((v) => selected.has(v));
    const someChecked = enabled.some((v) => selected.has(v));
    const masterState: CbState = allChecked
      ? "checked"
      : someChecked
        ? "indeterminate"
        : "unchecked";

    this._root.replaceChildren();

    /* select-all */
    if (selectAll && items.length > 0) {
      const wrap = document.createElement("div");
      wrap.dataset.slot = "select-all";
      wrap.className = CG_SELECT_ALL_CLASS;
      wrap.appendChild(
        this._buildCheckbox(this.attr("select-all-label", "전체 선택"), masterState, false, () => {
          const next = new Set(selected);
          if (allChecked) enabled.forEach((v) => next.delete(v));
          else enabled.forEach((v) => next.add(v));
          this._commit(items, next);
        }),
      );
      this._root.appendChild(wrap);

      const divider = document.createElement("div");
      divider.dataset.slot = "divider";
      divider.className = CG_DIVIDER_CLASS;
      divider.setAttribute("aria-hidden", "true");
      this._root.appendChild(divider);
    }

    /* list */
    const list = document.createElement("div");
    list.dataset.slot = "list";
    list.className = CG_LIST_CLASS;

    for (const item of items) {
      const checked = selected.has(item.value);
      const open = this._openKeys.has(item.value);
      const canExpand = expandable && item.detail != null;

      const itemEl = document.createElement("div");
      itemEl.dataset.slot = "item";
      itemEl.className = CG_ITEM_CLASS;

      const row = document.createElement("div");
      row.className = CG_ROW_CLASS;
      row.appendChild(
        this._buildCheckbox(item.label, checked ? "checked" : "unchecked", !!item.disabled, () => {
          if (item.disabled) return;
          const next = new Set(selected);
          if (next.has(item.value)) next.delete(item.value);
          else next.add(item.value);
          this._commit(items, next);
        }),
      );

      if (item.badge != null) {
        const badge = document.createElement("span");
        badge.dataset.slot = "badge";
        badge.className = CG_BADGE_CLASS;
        if (isBadgeRequired(item)) badge.dataset.required = "true";
        badge.textContent = item.badge;
        row.appendChild(badge);
      }

      if (canExpand) {
        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.dataset.slot = "toggle";
        toggle.dataset.open = open ? "true" : "false";
        toggle.className = CG_TOGGLE_CLASS;
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "접기" : "펼치기");
        toggle.innerHTML = CHEVRON_SVG;
        toggle.addEventListener("click", () => {
          if (this._openKeys.has(item.value)) this._openKeys.delete(item.value);
          else this._openKeys.add(item.value);
          this._renderData(this._getItems() ?? []);
        });
        row.appendChild(toggle);
      }

      itemEl.appendChild(row);

      if (canExpand && open) {
        const detail = document.createElement("div");
        detail.dataset.slot = "detail";
        detail.className = CG_DETAIL_CLASS;
        detail.textContent = item.detail!;
        itemEl.appendChild(detail);
      }

      list.appendChild(itemEl);
    }

    this._root.appendChild(list);
  }

  /** nds-checkbox__* 마크업으로 단일 체크박스를 그린다(React <Checkbox> 와 동일 구조). */
  private _buildCheckbox(
    label: string,
    state: CbState,
    disabled: boolean,
    onChange: () => void,
  ): HTMLLabelElement {
    const id = `nds-cg-cb-${++nextId}`;
    const root = document.createElement("label");
    root.className = `${CB_ROOT_CLASS} ${CG_CHECKBOX_CLASS}`;
    root.dataset.slot = "root";
    root.dataset.disabled = disabled ? "true" : "false";
    root.htmlFor = id;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.className = CB_INPUT_CLASS;
    input.checked = state === "checked";
    input.indeterminate = state === "indeterminate";
    input.disabled = disabled;
    if (state === "indeterminate") input.setAttribute("aria-checked", "mixed");
    input.addEventListener("change", onChange);

    const indicator = document.createElement("span");
    indicator.className = CB_INDICATOR_CLASS;
    indicator.dataset.slot = "indicator";
    indicator.dataset.state = state;
    indicator.dataset.checked = state === "checked" ? "true" : "false";
    indicator.setAttribute("aria-hidden", "true");
    indicator.innerHTML = CHECK_SVG + MINUS_SVG;

    const labelEl = document.createElement("span");
    labelEl.className = CB_LABEL_CLASS;
    labelEl.dataset.slot = "label";
    labelEl.textContent = label;

    root.append(input, indicator, labelEl);
    return root;
  }
}

define(NdsCheckboxGroup);
