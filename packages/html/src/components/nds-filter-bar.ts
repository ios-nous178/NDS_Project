/**
 * <nds-filter-bar> — DS FilterBar 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-filter-bar
 *     value='["uri"]'
 *     options='[
 *       {"key":"all","label":"전체"},
 *       {"key":"uri","label":"우리회사","count":24},
 *       {"key":"others","label":"기타","count":12}
 *     ]'
 *   ></nds-filter-bar>
 *
 * 이벤트:
 *   nds-filter-change (detail: { value: string[] }) -> 토글
 *
 * 속성:
 *   value: JSON 배열 (선택 키들)
 *   options: JSON 배열 ({ key, label, count?, disabled? })
 *   single: 단일 선택 (다시 클릭 시 해제)
 *   show-reset: 초기화 노출 (기본: value.length > 0)
 *   reset-label (default "초기화")
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const FB_CLASS = "nds-filter-bar";
const FB_LIST_CLASS = `${FB_CLASS}__list`;
const FB_CHIP_CLASS = `${FB_CLASS}__chip`;
const FB_RESET_CLASS = `${FB_CLASS}__reset`;

interface FilterOption {
  key: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

const ResetIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 14 14");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `
    <path d="M12 7A5 5 0 1 1 7 2c1.7 0 3.22.85 4.13 2.15" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 2v3h-3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`;
  return svg;
};

export class NdsFilterBar extends NdsElement {
  static elementName = "nds-filter-bar";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-filter-bar"].observedAttributes];
  }

  private _root: HTMLDivElement | null = null;
  private _list: HTMLDivElement | null = null;
  private _resetBtn: HTMLButtonElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = FB_CLASS;

    const list = document.createElement("div");
    list.className = FB_LIST_CLASS;
    list.setAttribute("role", "group");

    const resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = FB_RESET_CLASS;
    resetBtn.appendChild(ResetIcon());
    resetBtn.appendChild(document.createTextNode("초기화"));
    resetBtn.addEventListener("click", () => this._commit([]));

    root.append(list, resetBtn);
    this.appendChild(root);

    this._root = root;
    this._list = list;
    this._resetBtn = resetBtn;
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

  private _parseOptions(): FilterOption[] {
    const raw = this.getAttribute("options");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((o) => o && typeof o.key === "string")
        .map((o) => ({
          key: String(o.key),
          label: typeof o.label === "string" ? o.label : String(o.key),
          count: typeof o.count === "number" ? o.count : undefined,
          disabled: !!o.disabled,
        }));
    } catch {
      return [];
    }
  }

  private _commit(next: string[]): void {
    this.setAttribute("value", JSON.stringify(next));
    this.dispatchEvent(
      new CustomEvent("nds-filter-change", {
        detail: { value: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _toggle(key: string): void {
    const single = this.boolAttr("single");
    const current = this._parseValue();
    let next: string[];
    if (single) {
      next = current.has(key) ? [] : [key];
    } else {
      next = current.has(key)
        ? Array.from(current).filter((v) => v !== key)
        : [...Array.from(current), key];
    }
    this._commit(next);
  }

  protected update(): void {
    if (!this._root || !this._list || !this._resetBtn) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this._parseValue();
    const options = this._parseOptions();
    const resetLabel = this.getAttribute("reset-label") || "초기화";

    const showResetAttr = this.getAttribute("show-reset");
    const showReset =
      showResetAttr === null || showResetAttr === "" ? value.size > 0 : showResetAttr !== "false";

    this._list.innerHTML = "";
    options.forEach((opt) => {
      const active = value.has(opt.key);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = FB_CHIP_CLASS;
      btn.dataset.active = active ? "true" : "false";
      btn.setAttribute("aria-pressed", String(active));
      btn.disabled = !!opt.disabled;

      const labelText = document.createElement("span");
      labelText.textContent = opt.label;
      btn.appendChild(labelText);
      if (opt.count !== undefined) {
        const countSpan = document.createElement("span");
        countSpan.textContent = String(opt.count);
        btn.appendChild(countSpan);
      }

      btn.addEventListener("click", () => {
        if (opt.disabled) return;
        this._toggle(opt.key);
      });
      this._list!.appendChild(btn);
    });

    this._resetBtn.style.display = showReset ? "" : "none";
    if (showReset) {
      // Refresh label text node (icon is the first child).
      this._resetBtn.childNodes.forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) n.textContent = resetLabel;
      });
    }
  }
}

define(NdsFilterBar);
