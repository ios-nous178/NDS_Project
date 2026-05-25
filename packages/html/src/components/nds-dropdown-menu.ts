/**
 * <nds-dropdown-menu> — DS DropdownMenu 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-dropdown-menu
 *     items='[{"key": "edit", "label": "수정"}, {"key": "delete", "label": "삭제", "danger": true}]'
 *   >
 *     <button>메뉴 열기</button>
 *   </nds-dropdown-menu>
 *
 * 이벤트:
 *   dropdown-select (detail: { key, item }) -> 아이템 선택 시
 */

import { NdsElement, define } from "../base/nds-element.js";

const DM_CLASS = "nds-dropdown-menu";
const DM_PANEL_CLASS = `${DM_CLASS}__panel`;
const DM_GROUP_CLASS = `${DM_CLASS}__group`;
const DM_GROUP_LABEL_CLASS = `${DM_CLASS}__group-label`;
const DM_ITEM_CLASS = `${DM_CLASS}__item`;
const DM_ITEM_LABEL_CLASS = `${DM_CLASS}__item-label`;
const DM_ITEM_LEADING_CLASS = `${DM_CLASS}__item-leading`;
const DM_ITEM_TRAILING_CLASS = `${DM_CLASS}__item-trailing`;

export interface DropdownMenuItem {
  key: string;
  label: string;
  leading?: string; // Icon name or emoji
  trailing?: string;
  disabled?: boolean;
  danger?: boolean;
}

export interface DropdownMenuGroup {
  key: string;
  label?: string;
  items: DropdownMenuItem[];
}

export class NdsDropdownMenu extends NdsElement {
  static elementName = "nds-dropdown-menu";

  static get observedAttributes(): readonly string[] {
    return ["items", "groups", "align", "min-width"];
  }

  private _panel: HTMLDivElement | null = null;
  private _open = false;
  private _trigger: HTMLElement | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this._setupTrigger();
  }

  override disconnectedCallback(): void {
    this._close();
    if (this._panel) this._panel.remove();
  }

  private _setupTrigger(): void {
    // The first child is assumed to be the trigger
    this._trigger = this.firstElementChild as HTMLElement;
    if (this._trigger) {
      this._trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        this._toggle();
      });
    }
  }

  private _toggle(): void {
    if (this._open) this._close();
    else this._openMenu();
  }

  private _openMenu(): void {
    if (!this._trigger) return;
    this._open = true;

    if (!this._panel) {
      this._panel = document.createElement("div");
      this._panel.className = DM_PANEL_CLASS;
      this._panel.dataset.slot = "panel";
      this._panel.setAttribute("role", "menu");
      document.body.appendChild(this._panel);
    }

    this._renderPanel();
    this._positionPanel();

    document.addEventListener("click", this._handleOutsideClick);
    window.addEventListener("resize", this._handleResize);
    window.addEventListener("scroll", this._handleResize, true);
  }

  private _close(): void {
    this._open = false;
    if (this._panel) this._panel.style.display = "none";
    document.removeEventListener("click", this._handleOutsideClick);
    window.removeEventListener("resize", this._handleResize);
    window.removeEventListener("scroll", this._handleResize, true);
  }

  private _handleOutsideClick = (e: MouseEvent) => {
    if (
      this._panel &&
      !this._panel.contains(e.target as Node) &&
      !this.contains(e.target as Node)
    ) {
      this._close();
    }
  };

  private _handleResize = () => {
    if (this._open) this._positionPanel();
  };

  private _positionPanel(): void {
    if (!this._panel || !this._trigger) return;

    const rect = this._trigger.getBoundingClientRect();
    const align = this.getAttribute("align") || "start";

    this._panel.style.display = "block";
    this._panel.style.position = "fixed";
    this._panel.style.top = `${rect.bottom + 4}px`;
    this._panel.style.zIndex = "1000";

    if (align === "end") {
      this._panel.style.left = "auto";
      this._panel.style.right = `${window.innerWidth - rect.right}px`;
    } else {
      this._panel.style.left = `${rect.left}px`;
      this._panel.style.right = "auto";
    }
  }

  private _renderPanel(): void {
    if (!this._panel) return;

    const itemsAttr = this.getAttribute("items");
    const groupsAttr = this.getAttribute("groups");
    const minWidth = this.getAttribute("min-width");

    if (minWidth) this._panel.style.setProperty("--nds-dropdown-min-width", `${minWidth}px`);

    let groups: DropdownMenuGroup[] = [];
    try {
      if (groupsAttr) {
        groups = JSON.parse(groupsAttr);
      } else if (itemsAttr) {
        groups = [{ key: "_default", items: JSON.parse(itemsAttr) }];
      }
    } catch (e) {
      console.error("[nds-dropdown-menu] Failed to parse items/groups JSON", e);
    }

    this._panel.innerHTML = "";
    groups.forEach((group) => {
      const groupDiv = document.createElement("div");
      groupDiv.className = DM_GROUP_CLASS;
      groupDiv.dataset.slot = "group";
      groupDiv.setAttribute("role", "group");

      if (group.label) {
        const labelDiv = document.createElement("div");
        labelDiv.className = DM_GROUP_LABEL_CLASS;
        labelDiv.dataset.slot = "group-label";
        labelDiv.textContent = group.label;
        groupDiv.appendChild(labelDiv);
      }

      group.items.forEach((item) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = DM_ITEM_CLASS;
        btn.dataset.slot = "item";
        btn.dataset.danger = String(!!item.danger);
        btn.dataset.disabled = String(!!item.disabled);
        btn.disabled = !!item.disabled;
        btn.setAttribute("role", "menuitem");

        if (item.leading) {
          const leading = document.createElement("span");
          leading.className = DM_ITEM_LEADING_CLASS;
          leading.textContent = item.leading;
          btn.appendChild(leading);
        }

        const label = document.createElement("span");
        label.className = DM_ITEM_LABEL_CLASS;
        label.textContent = item.label;
        btn.appendChild(label);

        if (item.trailing) {
          const trailing = document.createElement("span");
          trailing.className = DM_ITEM_TRAILING_CLASS;
          trailing.textContent = item.trailing;
          btn.appendChild(trailing);
        }

        btn.addEventListener("click", () => {
          if (item.disabled) return;
          this.dispatchEvent(
            new CustomEvent("dropdown-select", {
              detail: { key: item.key, item },
              bubbles: true,
              composed: true,
            }),
          );
          this._close();
        });

        groupDiv.appendChild(btn);
      });
      this._panel!.appendChild(groupDiv);
    });
  }

  protected update(): void {
    if (this.style.display !== "contents") this.style.display = "contents";
    if (this._open) this._renderPanel();
  }
}

define(NdsDropdownMenu);
