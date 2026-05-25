/**
 * <nds-select> + <nds-select-option> — DS Select 의 vanilla Web Component 버전 (MVP).
 *
 * 사용 예:
 *   <nds-select value="kr" placeholder="선택" label="국가" helper-text="필수">
 *     <nds-select-option value="kr">대한민국</nds-select-option>
 *     <nds-select-option value="jp">일본</nds-select-option>
 *     <nds-select-option value="us" disabled>미국 (off)</nds-select-option>
 *   </nds-select>
 *
 * 이벤트:
 *   option 선택 → host 에 `value` attribute 설정 + "select-change" CustomEvent
 *   (detail: { value }, bubbles: true).
 *
 * 키보드:
 *   trigger focus: ArrowDown / ArrowUp / Enter / Space → open + active 이동
 *   open 상태: ArrowDown/Up = active 이동, Enter/Space = 선택, Escape = close
 *
 * MVP 제약:
 *   · Portal 없음 — dropdown 은 host 안 absolute positioning + z-index. 컨테이너 overflow:hidden
 *     안에 들어가면 잘릴 수 있음. v0.1 에서 Portal 추가.
 *   · placeholder = attribute. label/helper-text 도 attribute (자식 markup 으로 가지 않음)
 */

import { NdsElement, define } from "../base/nds-element.js";

const SELECT_CLASS = "nds-select";
const ROOT_CLASS = `${SELECT_CLASS}__root`;
const LABEL_CLASS = `${SELECT_CLASS}__label`;
const TRIGGER_CLASS = `${SELECT_CLASS}__trigger`;
const TRIGGER_TEXT_CLASS = `${SELECT_CLASS}__trigger-text`;
const CHEVRON_CLASS = `${SELECT_CLASS}__chevron`;
const DROPDOWN_CLASS = `${SELECT_CLASS}__dropdown`;
const OPTION_CLASS = `${SELECT_CLASS}__option`;
const HELPER_CLASS = `${SELECT_CLASS}__helper`;

let nextSelectId = 0;

export class NdsSelect extends NdsElement {
  static elementName = "nds-select";

  static get observedAttributes(): readonly string[] {
    return [
      "value",
      "placeholder",
      "label",
      "helper-text",
      "disabled",
      "error",
      "full-width",
      "open",
      "select-id",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _label: HTMLLabelElement | null = null;
  private _trigger: HTMLButtonElement | null = null;
  private _triggerText: HTMLSpanElement | null = null;
  private _chevron: HTMLSpanElement | null = null;
  private _dropdown: HTMLDivElement | null = null;
  private _helper: HTMLSpanElement | null = null;
  private _selectId = "";
  private _activeValue: string | null = null;
  private _outsideClick = (e: MouseEvent) => {
    if (!this._root) return;
    if (!this._root.contains(e.target as Node)) this._setOpen(false);
  };
  private _onKey = (e: KeyboardEvent) => this._handleKey(e);

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    document.removeEventListener("click", this._outsideClick, true);
    document.removeEventListener("keydown", this._onKey, true);
  }

  private _mount(): void {
    this._selectId = this.attr("select-id", `nds-select-${++nextSelectId}`);

    // 자식 <nds-select-option> 들을 임시 분리 — dropdown 안으로 옮김
    const options = Array.from(this.children).filter(
      (el) => el.tagName.toLowerCase() === "nds-select-option",
    );

    const root = document.createElement("div");
    const trigger = document.createElement("button");
    const triggerText = document.createElement("span");
    const chevron = document.createElement("span");
    const dropdown = document.createElement("div");

    root.className = ROOT_CLASS;
    root.dataset.slot = "root";
    root.style.position = "relative";

    trigger.type = "button";
    trigger.className = TRIGGER_CLASS;
    trigger.dataset.slot = "trigger";
    trigger.id = this._selectId;
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.addEventListener("click", () => {
      if (this.boolAttr("disabled")) return;
      this._setOpen(!this.boolAttr("open"));
    });
    trigger.addEventListener("keydown", (e) => this._handleTriggerKey(e));

    triggerText.id = `${this._selectId}-value`;
    triggerText.className = TRIGGER_TEXT_CLASS;

    chevron.className = CHEVRON_CLASS;
    chevron.setAttribute("aria-hidden", "true");
    chevron.innerHTML =
      '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>";

    trigger.append(triggerText, chevron);

    dropdown.className = DROPDOWN_CLASS;
    dropdown.dataset.slot = "dropdown";
    dropdown.setAttribute("role", "listbox");
    dropdown.style.position = "absolute";
    dropdown.style.top = "100%";
    dropdown.style.left = "0";
    dropdown.style.right = "0";
    dropdown.style.zIndex = "1000";
    for (const opt of options) dropdown.appendChild(opt);

    root.append(trigger, dropdown);
    this.appendChild(root);

    this._root = root;
    this._trigger = trigger;
    this._triggerText = triggerText;
    this._chevron = chevron;
    this._dropdown = dropdown;
  }

  protected update(): void {
    if (!this._root || !this._trigger || !this._dropdown) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this.getAttribute("value");
    const placeholder = this.getAttribute("placeholder") ?? "";
    const labelText = this.getAttribute("label");
    const helperText = this.getAttribute("helper-text");
    const disabled = this.boolAttr("disabled");
    const error = this.boolAttr("error");
    const fullWidth = this.boolAttr("full-width");
    const open = this.boolAttr("open");
    const hasValue = value !== null && value !== "";

    this._root.style.width = fullWidth ? "100%" : "auto";
    this._root.style.setProperty("--nds-select-width", fullWidth ? "100%" : "auto");

    this._trigger.disabled = disabled;
    this._trigger.dataset.open = String(open);
    this._trigger.dataset.hasValue = String(hasValue);
    this._trigger.dataset.error = String(error);
    this._trigger.dataset.disabled = String(disabled);
    this._trigger.setAttribute("aria-expanded", String(open));
    if (open) this._trigger.setAttribute("aria-controls", `${this._selectId}-listbox`);
    else this._trigger.removeAttribute("aria-controls");
    if (error) this._trigger.setAttribute("aria-invalid", "true");
    else this._trigger.removeAttribute("aria-invalid");

    this._chevron!.dataset.open = String(open);

    this._dropdown.id = `${this._selectId}-listbox`;
    this._dropdown.style.display = open ? "" : "none";

    // trigger 텍스트 — 선택값 있으면 해당 option label, 없으면 placeholder
    if (this._triggerText) {
      if (hasValue) {
        const opt = this._findOption(value);
        this._triggerText.textContent = opt?.textContent?.trim() ?? value!;
        this._triggerText.dataset.placeholder = "false";
      } else {
        this._triggerText.textContent = placeholder;
        this._triggerText.dataset.placeholder = "true";
      }
    }

    // option 별 selected/active dataset
    const options = this._dropdown.querySelectorAll<NdsSelectOption>("nds-select-option");
    options.forEach((opt) => {
      const v = opt.getAttribute("value") ?? "";
      opt.setSelected(v === value);
      opt.setActive(v === this._activeValue);
    });

    this._syncLabel(labelText);
    this._syncHelper(helperText, error);

    if (open) document.addEventListener("click", this._outsideClick, true);
    else document.removeEventListener("click", this._outsideClick, true);

    if (open) document.addEventListener("keydown", this._onKey, true);
    else document.removeEventListener("keydown", this._onKey, true);
  }

  private _syncLabel(text: string | null): void {
    if (!this._root || !this._trigger) return;
    if (text === null) {
      this._label?.remove();
      this._label = null;
      return;
    }
    if (!this._label) {
      this._label = document.createElement("label");
      this._label.className = LABEL_CLASS;
      this._label.dataset.slot = "label";
      this._root.insertBefore(this._label, this._trigger);
    }
    this._label.htmlFor = this._selectId;
    this._label.textContent = text;
  }

  private _syncHelper(text: string | null, error: boolean): void {
    if (!this._root || !this._trigger) return;
    if (text === null) {
      this._helper?.remove();
      this._helper = null;
      this._trigger.removeAttribute("aria-describedby");
      return;
    }
    if (!this._helper) {
      this._helper = document.createElement("span");
      this._helper.className = HELPER_CLASS;
      this._helper.dataset.slot = "helper";
      this._root.appendChild(this._helper);
    }
    const helperId = `${this._selectId}-helper`;
    this._helper.id = helperId;
    this._helper.dataset.error = String(error);
    this._helper.textContent = text;
    this._trigger.setAttribute("aria-describedby", helperId);
  }

  private _findOption(value: string | null): NdsSelectOption | null {
    if (!this._dropdown || value === null) return null;
    return this._dropdown.querySelector<NdsSelectOption>(`nds-select-option[value="${value}"]`);
  }

  private _setOpen(next: boolean): void {
    if (next && !this.hasAttribute("open")) {
      this.setAttribute("open", "");
      this._activeValue = this.getAttribute("value");
    } else if (!next && this.hasAttribute("open")) {
      this.removeAttribute("open");
      this._activeValue = null;
    }
  }

  /** option 이 호출. */
  pickValue(value: string): void {
    this.setAttribute("value", value);
    this._setOpen(false);
    this._trigger?.focus();
    this.dispatchEvent(
      new CustomEvent("select-change", { detail: { value }, bubbles: true, composed: true }),
    );
  }

  private _handleTriggerKey(e: KeyboardEvent): void {
    if (this.boolAttr("disabled")) return;
    const open = this.boolAttr("open");
    if (
      !open &&
      (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ")
    ) {
      e.preventDefault();
      this._setOpen(true);
      this._activeValue = this.getAttribute("value");
      this.scheduleUpdate();
    }
  }

  private _handleKey(e: KeyboardEvent): void {
    if (!this.boolAttr("open") || !this._dropdown) return;
    if (e.key === "Escape") {
      e.preventDefault();
      this._setOpen(false);
      this._trigger?.focus();
      return;
    }
    const options = Array.from(
      this._dropdown.querySelectorAll<NdsSelectOption>("nds-select-option"),
    ).filter((o) => !o.hasAttribute("disabled"));
    if (options.length === 0) return;
    const values = options.map((o) => o.getAttribute("value") ?? "");
    const currentIdx = values.indexOf(this._activeValue ?? "");

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const nextIdx =
        e.key === "ArrowDown"
          ? (currentIdx + 1 + options.length) % options.length
          : (currentIdx - 1 + options.length) % options.length;
      this._activeValue = values[nextIdx];
      this.scheduleUpdate();
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (this._activeValue !== null) this.pickValue(this._activeValue);
    }
  }
}

/* ──────────────── <nds-select-option> ──────────────── */

export class NdsSelectOption extends NdsElement {
  static elementName = "nds-select-option";

  static get observedAttributes(): readonly string[] {
    return ["value", "disabled"];
  }

  private _wrapped = false;
  private _onClick = (_e: MouseEvent) => {
    if (this.hasAttribute("disabled")) return;
    const value = this.getAttribute("value") ?? "";
    const parent = this.closest<NdsSelect>("nds-select");
    parent?.pickValue(value);
  };

  override connectedCallback(): void {
    if (!this._wrapped) this._mount();
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    this.removeEventListener("click", this._onClick);
  }

  private _mount(): void {
    // host element 자체에 option 클래스/role 박는다 (자식 wrapping 없음 — 단순 leaf)
    this.classList.add(OPTION_CLASS);
    this.dataset.slot = "option";
    this.setAttribute("role", "option");
    this.addEventListener("click", this._onClick);
    this._wrapped = true;
  }

  protected update(): void {
    const value = this.getAttribute("value") ?? "";
    this.dataset.value = value;
    const disabled = this.hasAttribute("disabled");
    if (disabled) {
      this.setAttribute("aria-disabled", "true");
      this.dataset.disabled = "true";
    } else {
      this.removeAttribute("aria-disabled");
      this.dataset.disabled = "false";
    }
  }

  setSelected(selected: boolean): void {
    this.dataset.selected = String(selected);
    this.setAttribute("aria-selected", String(selected));
  }

  setActive(active: boolean): void {
    this.dataset.active = String(active);
  }
}

define(NdsSelect);
define(NdsSelectOption);
