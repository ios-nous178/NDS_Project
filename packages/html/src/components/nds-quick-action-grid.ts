/**
 * <nds-quick-action-grid> — DS QuickActionGrid 의 vanilla Web Component 버전.
 *
 * 사용:
 *   <nds-quick-action-grid columns="3" gap="16"
 *     actions='[{"key":"call","label":"전화","icon":"<svg ...>...</svg>","badge":"NEW"},
 *               {"key":"chat","label":"채팅","icon":"<svg ...>...</svg>","badge":"3"},
 *               {"key":"book","label":"예약","icon":"<svg ...>...</svg>","disabled":true}]'>
 *   </nds-quick-action-grid>
 *
 * icon = find_icon({name}) 가 준 inline SVG 마크업 문자열 (이름/이모지 아님 — innerHTML 주입).
 * actions 는 JSON 속성이라 SVG 안 " 는 \" 로 이스케이프. 아이템 클릭 시 "quick-action" CustomEvent (detail: { key }) 디스패치.
 */

import { NdsElement, define } from "../base/nds-element.js";

const QA_CLASS = "nds-quick-action-grid";
const QA_ITEM_CLASS = `${QA_CLASS}__item`;
const QA_ICON_CLASS = `${QA_CLASS}__icon`;
const QA_LABEL_CLASS = `${QA_CLASS}__label`;
const QA_BADGE_CLASS = `${QA_CLASS}__badge`;

const COLUMN_OPTIONS = [2, 3, 4] as const;
type QuickActionColumns = (typeof COLUMN_OPTIONS)[number];

interface QuickAction {
  key: string;
  label: string;
  /** inline SVG 마크업 문자열 (find_icon 결과). 이름/이모지가 아니라 innerHTML 로 주입된다. */
  icon: string;
  badge?: string;
  disabled?: boolean;
  iconBg?: string;
}

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby"] as const;

export class NdsQuickActionGrid extends NdsElement {
  static elementName = "nds-quick-action-grid";

  static get observedAttributes(): readonly string[] {
    return ["actions", "columns", "gap", ...FORWARDED_ATTRS];
  }

  private _root: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = QA_CLASS;
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const cols = this._normalizedColumns();
    const gap = this._intAttr("gap", null);
    this._root.style.setProperty("--nds-quick-action-cols", String(cols));
    if (gap !== null) this._root.style.setProperty("--nds-quick-action-gap", `${gap}px`);
    else this._root.style.removeProperty("--nds-quick-action-gap");

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    const buttons = this._readActions().map((action) => this._createItem(action));
    this._root.replaceChildren(...buttons);
  }

  private _createItem(action: QuickAction): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = QA_ITEM_CLASS;
    button.dataset.key = action.key;
    if (action.disabled) button.disabled = true;
    if (action.iconBg) button.style.setProperty("--nds-quick-action-icon-bg", action.iconBg);

    if (action.badge !== undefined && action.badge !== "") {
      const badge = document.createElement("span");
      badge.className = QA_BADGE_CLASS;
      badge.textContent = action.badge;
      button.appendChild(badge);
    }

    const icon = document.createElement("span");
    icon.className = QA_ICON_CLASS;
    icon.setAttribute("aria-hidden", "true");
    // icon = inline SVG 마크업 (find_icon 결과). React QuickActionGrid 의 icon?:ReactNode 와 대칭.
    // 이름/이모지를 넣으면 그대로 텍스트로 흘러나오므로 innerHTML 로 SVG 를 주입한다. (nds-sidebar 와 동일 규약)
    icon.innerHTML = action.icon;
    button.appendChild(icon);

    const label = document.createElement("span");
    label.className = QA_LABEL_CLASS;
    label.textContent = action.label;
    button.appendChild(label);

    button.addEventListener("click", () => {
      if (action.disabled) return;
      this.dispatchEvent(
        new CustomEvent("quick-action", {
          detail: { key: action.key },
          bubbles: true,
          composed: true,
        }),
      );
    });

    return button;
  }

  private _readActions(): QuickAction[] {
    const attr = this.getAttribute("actions");
    if (!attr || !attr.trim()) return [];
    try {
      const parsed = JSON.parse(attr) as Array<Record<string, unknown>>;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((raw) => ({
          key: typeof raw.key === "string" ? raw.key : "",
          label: typeof raw.label === "string" ? raw.label : "",
          icon: typeof raw.icon === "string" ? raw.icon : "",
          badge: typeof raw.badge === "string" ? raw.badge : undefined,
          disabled: raw.disabled === true,
          iconBg: typeof raw.iconBg === "string" ? raw.iconBg : undefined,
        }))
        .filter((action) => action.key);
    } catch {
      return [];
    }
  }

  private _normalizedColumns(): QuickActionColumns {
    const value = Number(this.getAttribute("columns"));
    return (COLUMN_OPTIONS as readonly number[]).includes(value)
      ? (value as QuickActionColumns)
      : 4;
  }

  private _intAttr(name: string, fallback: number | null): number | null {
    const value = this.getAttribute(name);
    if (value === null || value.trim() === "") return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
  }
}

define(NdsQuickActionGrid);
