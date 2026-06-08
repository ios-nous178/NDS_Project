/**
 * <nds-phone-input> — DS PhoneInput 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-phone-input
 *     label="휴대전화"
 *     country-code="KR"
 *     value="01012345678"
 *     helper-text="인증번호가 발송됩니다"
 *   ></nds-phone-input>
 *
 * 이벤트:
 *   nds-phone-change (detail: { value }) -> 번호 입력 변경
 *   nds-phone-country-change (detail: { code }) -> 국가 변경
 *
 * 속성:
 *   country-code: ISO 코드 (KR/US/JP/CN/GB)
 *   value: 번호 (국가 코드 제외)
 *   label / placeholder / helper-text
 *   error
 *   countries: JSON 배열 ({ code, name, dialCode })
 *   full-width
 *   disabled
 */

import { NdsElement, define } from "../base/nds-element.js";

const PI_CLASS = "nds-phone-input";
const PI_ROOT_CLASS = `${PI_CLASS}__root`;
const PI_LABEL_CLASS = `${PI_CLASS}__label`;
const PI_FIELD_CLASS = `${PI_CLASS}__field`;
const PI_FIELD_WRAP_CLASS = `${PI_CLASS}__field-wrap`;
const PI_DIAL_CLASS = `${PI_CLASS}__dial`;
const PI_DIAL_CODE_CLASS = `${PI_CLASS}__dial-code`;
const PI_CHEVRON_CLASS = `${PI_CLASS}__chevron`;
const PI_INPUT_CLASS = `${PI_CLASS}__input`;
const PI_HELPER_CLASS = `${PI_CLASS}__helper`;
const PI_MENU_CLASS = `${PI_CLASS}__menu`;
const PI_MENU_ITEM_CLASS = `${PI_CLASS}__menu-item`;
const PI_MENU_CODE_CLASS = `${PI_CLASS}__menu-code`;
const PI_MENU_NAME_CLASS = `${PI_CLASS}__menu-name`;
const PI_MENU_DIAL_CLASS = `${PI_CLASS}__menu-dial`;

interface PhoneCountry {
  code: string;
  name: string;
  dialCode: string;
}

const DEFAULT_COUNTRIES: PhoneCountry[] = [
  { code: "KR", name: "대한민국", dialCode: "+82" },
  { code: "US", name: "United States", dialCode: "+1" },
  { code: "JP", name: "日本", dialCode: "+81" },
  { code: "CN", name: "中国", dialCode: "+86" },
  { code: "GB", name: "United Kingdom", dialCode: "+44" },
];

let nextId = 0;

/* ─── 번호 포맷 (react PhoneInput 미러) ─── */

const onlyDigits = (s: string) => s.replace(/\D/g, "");
const maxDigitsFor = (dialCode: string) => (dialCode === "+82" ? 11 : 15);

const formatPhone = (digits: string, dialCode: string): string => {
  const d = onlyDigits(digits).slice(0, maxDigitsFor(dialCode));
  if (dialCode !== "+82") return d;
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
};

const ChevronDown = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "12");
  svg.setAttribute("height", "12");
  svg.setAttribute("viewBox", "0 0 12 12");
  svg.setAttribute("fill", "none");
  svg.innerHTML = `<path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  return svg;
};

export class NdsPhoneInput extends NdsElement {
  static elementName = "nds-phone-input";

  static get observedAttributes(): readonly string[] {
    return [
      "country-code",
      "value",
      "label",
      "placeholder",
      "helper-text",
      "error",
      "countries",
      "full-width",
      "disabled",
      "auto-format",
    ];
  }

  /** 현재 다이얼 코드 (auto-format 계산용) */
  private _currentDialCode(): string {
    const countries = this._parseCountries();
    const code = this.getAttribute("country-code") || countries[0].code;
    return (countries.find((c) => c.code === code) ?? countries[0]).dialCode;
  }

  private _root: HTMLDivElement | null = null;
  private _labelEl: HTMLLabelElement | null = null;
  private _fieldWrap: HTMLDivElement | null = null;
  private _field: HTMLDivElement | null = null;
  private _dialBtn: HTMLButtonElement | null = null;
  private _dialText: HTMLSpanElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _helperEl: HTMLParagraphElement | null = null;
  private _menu: HTMLUListElement | null = null;
  private _open = false;
  private _inputId = `nds-phone-input-${++nextId}`;
  private _menuId = `nds-phone-menu-${nextId}`;

  private _onDocClick = (e: MouseEvent) => {
    if (!this._open) return;
    if (this._fieldWrap && !this._fieldWrap.contains(e.target as Node)) {
      this._open = false;
      this.scheduleUpdate();
    }
  };
  private _onEsc = (e: KeyboardEvent) => {
    if (this._open && e.key === "Escape") {
      this._open = false;
      this.scheduleUpdate();
    }
  };

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
    document.addEventListener("mousedown", this._onDocClick);
    document.addEventListener("keydown", this._onEsc);
  }

  override disconnectedCallback(): void {
    document.removeEventListener("mousedown", this._onDocClick);
    document.removeEventListener("keydown", this._onEsc);
  }

  private _parseCountries(): PhoneCountry[] {
    const raw = this.getAttribute("countries");
    if (!raw) return DEFAULT_COUNTRIES;
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return DEFAULT_COUNTRIES;
      const valid = parsed
        .filter(
          (c) =>
            c &&
            typeof c.code === "string" &&
            typeof c.name === "string" &&
            typeof c.dialCode === "string",
        )
        .map((c) => ({
          code: String(c.code),
          name: String(c.name),
          dialCode: String(c.dialCode),
        }));
      return valid.length > 0 ? valid : DEFAULT_COUNTRIES;
    } catch {
      return DEFAULT_COUNTRIES;
    }
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = PI_ROOT_CLASS;

    const labelEl = document.createElement("label");
    labelEl.className = PI_LABEL_CLASS;
    labelEl.setAttribute("for", this._inputId);

    const fieldWrap = document.createElement("div");
    fieldWrap.className = PI_FIELD_WRAP_CLASS;

    const field = document.createElement("div");
    field.className = PI_FIELD_CLASS;

    const dialBtn = document.createElement("button");
    dialBtn.type = "button";
    dialBtn.className = PI_DIAL_CLASS;
    dialBtn.setAttribute("aria-haspopup", "listbox");
    dialBtn.setAttribute("aria-controls", this._menuId);
    dialBtn.addEventListener("click", () => {
      if (this.boolAttr("disabled")) return;
      this._open = !this._open;
      this.scheduleUpdate();
    });

    const dialText = document.createElement("span");
    dialText.className = PI_DIAL_CODE_CLASS;

    const chevron = document.createElement("span");
    chevron.className = PI_CHEVRON_CLASS;
    chevron.setAttribute("aria-hidden", "true");
    chevron.appendChild(ChevronDown());

    dialBtn.append(dialText, chevron);

    const input = document.createElement("input");
    input.id = this._inputId;
    input.type = "tel";
    input.inputMode = "tel";
    input.autocomplete = "tel-national";
    input.className = PI_INPUT_CLASS;
    input.addEventListener("input", () => {
      const autoFormat = this.getAttribute("auto-format") !== "false";
      let emitted = input.value;
      if (autoFormat) {
        const dialCode = this._currentDialCode();
        emitted = onlyDigits(input.value).slice(0, maxDigitsFor(dialCode));
        input.value = formatPhone(emitted, dialCode);
      }
      this.setAttribute("value", emitted);
      this.dispatchEvent(
        new CustomEvent("nds-phone-change", {
          detail: { value: emitted },
          bubbles: true,
          composed: true,
        }),
      );
    });

    field.append(dialBtn, input);
    fieldWrap.appendChild(field);

    const menu = document.createElement("ul");
    menu.id = this._menuId;
    menu.setAttribute("role", "listbox");
    menu.className = PI_MENU_CLASS;
    fieldWrap.appendChild(menu);

    const helperEl = document.createElement("p");
    helperEl.className = PI_HELPER_CLASS;

    root.append(labelEl, fieldWrap, helperEl);
    this.appendChild(root);

    this._root = root;
    this._labelEl = labelEl;
    this._fieldWrap = fieldWrap;
    this._field = field;
    this._dialBtn = dialBtn;
    this._dialText = dialText;
    this._input = input;
    this._helperEl = helperEl;
    this._menu = menu;
  }

  protected update(): void {
    if (
      !this._root ||
      !this._labelEl ||
      !this._field ||
      !this._dialBtn ||
      !this._dialText ||
      !this._input ||
      !this._helperEl ||
      !this._menu
    ) {
      return;
    }
    if (this.style.display !== "contents") this.style.display = "contents";

    const countries = this._parseCountries();
    const countryCode = this.getAttribute("country-code") || countries[0].code;
    const country = countries.find((c) => c.code === countryCode) ?? countries[0];
    const value = this.getAttribute("value") || "";
    const autoFormat = this.getAttribute("auto-format") !== "false";
    const label = this.getAttribute("label");
    const placeholder =
      this.getAttribute("placeholder") ||
      (autoFormat && country.dialCode === "+82" ? "010-1234-5678" : "01012345678");
    const helperText = this.getAttribute("helper-text");
    const error = this.boolAttr("error");
    const fullWidth = this.boolAttr("full-width");
    const disabled = this.boolAttr("disabled");

    this._root.dataset.fullWidth = fullWidth ? "true" : "false";

    if (label) {
      this._labelEl.textContent = label;
      this._labelEl.style.display = "";
    } else {
      this._labelEl.style.display = "none";
    }

    this._field.dataset.error = error ? "true" : "false";
    this._dialBtn.disabled = disabled;
    this._dialBtn.setAttribute("aria-label", `국가 코드: ${country.name} ${country.dialCode}`);
    this._dialBtn.setAttribute("aria-expanded", String(this._open));
    this._dialText.textContent = country.dialCode;

    this._input.placeholder = placeholder;
    this._input.disabled = disabled;
    const displayValue = autoFormat ? formatPhone(value, country.dialCode) : value;
    if (this._input.value !== displayValue) this._input.value = displayValue;

    this._menu.innerHTML = "";
    if (this._open) {
      this._menu.style.display = "";
      countries.forEach((c) => {
        const li = document.createElement("li");
        li.setAttribute("role", "presentation");

        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("role", "option");
        const selected = c.code === country.code;
        btn.setAttribute("aria-selected", String(selected));
        btn.dataset.selected = selected ? "true" : "false";
        btn.className = PI_MENU_ITEM_CLASS;
        btn.addEventListener("click", () => {
          this.setAttribute("country-code", c.code);
          this._open = false;
          this.dispatchEvent(
            new CustomEvent("nds-phone-country-change", {
              detail: { code: c.code },
              bubbles: true,
              composed: true,
            }),
          );
          this.scheduleUpdate();
        });

        const code = document.createElement("span");
        code.className = PI_MENU_CODE_CLASS;
        code.setAttribute("aria-hidden", "true");
        code.textContent = c.code;

        const name = document.createElement("span");
        name.className = PI_MENU_NAME_CLASS;
        name.textContent = c.name;

        const dial = document.createElement("span");
        dial.className = PI_MENU_DIAL_CLASS;
        dial.textContent = c.dialCode;

        btn.append(code, name, dial);
        li.appendChild(btn);
        this._menu!.appendChild(li);
      });
    } else {
      this._menu.style.display = "none";
    }

    if (helperText) {
      this._helperEl.textContent = helperText;
      this._helperEl.dataset.error = error ? "true" : "false";
      this._helperEl.style.display = "";
    } else {
      this._helperEl.style.display = "none";
    }
  }
}

define(NdsPhoneInput);
