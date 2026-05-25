/**
 * <nds-time-slot-picker> — DS TimeSlotPicker 의 vanilla Web Component 버전.
 *
 * 사용 예 (groups):
 *   <nds-time-slot-picker
 *     value="14:00"
 *     groups='[
 *       {"key":"morning","label":"오전","slots":[{"value":"09:00"},{"value":"10:00","unavailable":true}]},
 *       {"key":"afternoon","label":"오후","slots":[{"value":"14:00"},{"value":"15:00"}]}
 *     ]'
 *     columns="4"
 *   ></nds-time-slot-picker>
 *
 * 사용 예 (flat slots):
 *   <nds-time-slot-picker
 *     value="10:00"
 *     slots='[{"value":"09:00"},{"value":"10:00"},{"value":"11:00"}]'
 *   ></nds-time-slot-picker>
 *
 * 이벤트:
 *   nds-time-slot-change (detail: { value })
 *
 * 속성:
 *   value: 선택값
 *   slots / groups: JSON 배열
 *   columns: 한 줄에 표시할 슬롯 수 (default 4)
 *   disabled
 *   empty-text (default "예약 가능한 시간이 없습니다")
 */

import { NdsElement, define } from "../base/nds-element.js";

const TS_CLASS = "nds-time-slot-picker";
const TS_ROOT_CLASS = `${TS_CLASS}__root`;
const TS_GROUP_CLASS = `${TS_CLASS}__group`;
const TS_GROUP_LABEL_CLASS = `${TS_CLASS}__group-label`;
const TS_GRID_CLASS = `${TS_CLASS}__grid`;
const TS_SLOT_CLASS = `${TS_CLASS}__slot`;
const TS_EMPTY_CLASS = `${TS_CLASS}__empty`;

interface TimeSlot {
  value: string;
  label?: string;
  unavailable?: boolean;
}

interface TimeSlotGroup {
  key: string;
  label: string;
  slots: TimeSlot[];
}

export class NdsTimeSlotPicker extends NdsElement {
  static elementName = "nds-time-slot-picker";

  static get observedAttributes(): readonly string[] {
    return ["value", "slots", "groups", "columns", "disabled", "empty-text"];
  }

  private _root: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = TS_ROOT_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  private _parseSlots(raw: string | null): TimeSlot[] {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((s) => s && typeof s.value === "string")
        .map((s) => ({
          value: String(s.value),
          label: typeof s.label === "string" ? s.label : undefined,
          unavailable: !!s.unavailable,
        }));
    } catch {
      return [];
    }
  }

  private _parseGroups(): TimeSlotGroup[] {
    const groupsRaw = this.getAttribute("groups");
    if (groupsRaw) {
      try {
        const parsed = JSON.parse(groupsRaw);
        if (Array.isArray(parsed)) {
          return parsed
            .filter((g) => g && typeof g.key === "string" && Array.isArray(g.slots))
            .map((g) => ({
              key: String(g.key),
              label: typeof g.label === "string" ? g.label : "",
              slots: this._parseSlots(JSON.stringify(g.slots)),
            }));
        }
      } catch {
        /* ignore */
      }
    }
    const slots = this._parseSlots(this.getAttribute("slots"));
    if (slots.length > 0) return [{ key: "_default", label: "", slots }];
    return [];
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this.getAttribute("value");
    const groups = this._parseGroups();
    const columns = parseInt(this.attr("columns", "4"), 10) || 4;
    const disabled = this.boolAttr("disabled");
    const emptyText = this.getAttribute("empty-text") || "예약 가능한 시간이 없습니다";

    this._root.style.setProperty("--nds-time-slot-cols", String(columns));

    this._root.innerHTML = "";
    this._root.removeAttribute("role");

    if (groups.length === 0) {
      const empty = document.createElement("div");
      empty.dataset.slot = "empty";
      empty.className = TS_EMPTY_CLASS;
      empty.textContent = emptyText;
      this._root.appendChild(empty);
      return;
    }

    this._root.setAttribute("role", "radiogroup");

    groups.forEach((group) => {
      const groupEl = document.createElement("div");
      groupEl.dataset.slot = "group";
      groupEl.className = TS_GROUP_CLASS;

      if (group.label) {
        const labelEl = document.createElement("span");
        labelEl.dataset.slot = "group-label";
        labelEl.className = TS_GROUP_LABEL_CLASS;
        labelEl.textContent = group.label;
        groupEl.appendChild(labelEl);
      }

      const grid = document.createElement("div");
      grid.dataset.slot = "grid";
      grid.className = TS_GRID_CLASS;

      group.slots.forEach((slot) => {
        const isSelected = value === slot.value;
        const isDisabled = disabled || !!slot.unavailable;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("role", "radio");
        btn.setAttribute("aria-checked", String(isSelected));
        btn.dataset.slot = "slot";
        btn.dataset.selected = isSelected ? "true" : "false";
        btn.dataset.unavailable = slot.unavailable ? "true" : "false";
        btn.disabled = isDisabled;
        btn.className = TS_SLOT_CLASS;
        btn.textContent = slot.label ?? slot.value;
        btn.addEventListener("click", () => {
          if (isDisabled) return;
          this.setAttribute("value", slot.value);
          this.dispatchEvent(
            new CustomEvent("nds-time-slot-change", {
              detail: { value: slot.value },
              bubbles: true,
              composed: true,
            }),
          );
        });
        grid.appendChild(btn);
      });

      groupEl.appendChild(grid);
      this._root!.appendChild(groupEl);
    });
  }
}

define(NdsTimeSlotPicker);
