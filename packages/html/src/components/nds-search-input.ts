/**
 * <nds-search-input> — DS SearchInput 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-search-input label="상담사 검색" placeholder="이름을 입력하세요" show-search-button></nds-search-input>
 *
 * 이벤트:
 *   search-input-change (detail: { value }) -> 입력값 변경 시
 *   search-input-clear -> 클리어 버튼 클릭 시
 *   search-input-search (detail: { value }) -> 검색 버튼 클릭 또는 엔터 키 입력 시
 */

import { NdsElement, define } from "../base/nds-element.js";
import { cv } from "@nudge-design/tokens";

const SEARCH_CLASS = "nds-search-input";
const SEARCH_ROOT_CLASS = `${SEARCH_CLASS}__root`;
const SEARCH_LABEL_CLASS = `${SEARCH_CLASS}__label`;
const SEARCH_WRAPPER_CLASS = `${SEARCH_CLASS}__wrapper`;
const SEARCH_FIELD_CLASS = `${SEARCH_CLASS}__field`;
const SEARCH_CLEAR_CLASS = `${SEARCH_CLASS}__clear`;
const SEARCH_BUTTON_CLASS = `${SEARCH_CLASS}__button`;
const SEARCH_HELPER_CLASS = `${SEARCH_CLASS}__helper`;

let nextId = 0;

export class NdsSearchInput extends NdsElement {
  static elementName = "nds-search-input";

  static get observedAttributes(): readonly string[] {
    return [
      "value",
      "label",
      "placeholder",
      "helper-text",
      "error",
      "error-message",
      "variant",
      "clearable",
      "show-search-button",
      "full-width",
      "disabled",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _input: HTMLInputElement | null = null;
  private _wrapper: HTMLDivElement | null = null;
  private _baseId = `nds-search-${++nextId}`;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = SEARCH_ROOT_CLASS;

    const wrapper = document.createElement("div");
    wrapper.dataset.slot = "wrapper";
    wrapper.className = SEARCH_WRAPPER_CLASS;

    const input = document.createElement("input");
    input.type = "text";
    input.role = "searchbox";
    input.dataset.slot = "field";
    input.className = SEARCH_FIELD_CLASS;
    input.id = this._baseId;

    input.addEventListener("input", (e) => {
      const val = (e.target as HTMLInputElement).value;
      this.setAttribute("value", val);
      this.dispatchEvent(
        new CustomEvent("search-input-change", {
          detail: { value: val },
          bubbles: true,
          composed: true,
        }),
      );
      this.scheduleUpdate();
    });

    input.addEventListener("focus", () => {
      wrapper.dataset.focused = "true";
    });

    input.addEventListener("blur", () => {
      setTimeout(() => {
        wrapper.dataset.focused = "false";
      }, 150);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.dispatchEvent(
          new CustomEvent("search-input-search", {
            detail: { value: input.value },
            bubbles: true,
            composed: true,
          }),
        );
      }
    });

    wrapper.appendChild(input);
    root.appendChild(wrapper);
    this.appendChild(root);

    this._root = root;
    this._wrapper = wrapper;
    this._input = input;
  }

  protected update(): void {
    if (!this._root || !this._wrapper || !this._input) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this.getAttribute("value") || "";
    const label = this.getAttribute("label");
    const placeholder = this.getAttribute("placeholder") || "";
    const helperText = this.getAttribute("helper-text");
    const error = this.boolAttr("error");
    const errorMessage = this.getAttribute("error-message");
    const variant = this.getAttribute("variant") || "outlined";
    const clearable = this.attr("clearable", "true") !== "false";
    const showSearchButton = this.attr("show-search-button", "true") !== "false";
    const fullWidth = this.attr("full-width", "true") !== "false";
    const disabled = this.boolAttr("disabled");

    this._root.style.setProperty("--nds-search-input-width", fullWidth ? "100%" : "auto");
    this._wrapper.dataset.variant = variant;
    this._input.value = value;
    this._input.placeholder = placeholder;
    this._input.disabled = disabled;

    const showError = error || !!errorMessage;
    this._input.setAttribute("aria-invalid", String(showError));

    // Clear previous dynamic elements (label, buttons, helper)
    this._root
      .querySelectorAll(`.${SEARCH_LABEL_CLASS}, .${SEARCH_HELPER_CLASS}`)
      .forEach((el) => el.remove());
    this._wrapper
      .querySelectorAll(`.${SEARCH_CLEAR_CLASS}, .${SEARCH_BUTTON_CLASS}`)
      .forEach((el) => el.remove());

    if (label) {
      const labelEl = document.createElement("label");
      labelEl.className = SEARCH_LABEL_CLASS;
      labelEl.dataset.slot = "label";
      labelEl.setAttribute("for", this._baseId);
      labelEl.textContent = label;
      this._root.insertBefore(labelEl, this._wrapper);
    }

    if (clearable && value && !disabled) {
      const clearBtn = document.createElement("button");
      clearBtn.type = "button";
      clearBtn.className = SEARCH_CLEAR_CLASS;
      clearBtn.dataset.slot = "clear";
      clearBtn.setAttribute("aria-label", "검색어 지우기");
      clearBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="${cv.borderRole.normal}" />
          <path d="M8 8L16 16M16 8L8 16" stroke="white" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      `;
      clearBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.setAttribute("value", "");
        this.dispatchEvent(
          new CustomEvent("search-input-clear", { bubbles: true, composed: true }),
        );
        this._input?.focus();
        this.scheduleUpdate();
      });
      this._wrapper.appendChild(clearBtn);
    }

    if (showSearchButton) {
      const searchBtn = document.createElement("button");
      searchBtn.type = "button";
      searchBtn.className = SEARCH_BUTTON_CLASS;
      searchBtn.dataset.slot = "search-button";
      searchBtn.setAttribute("aria-label", "검색");
      searchBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5" />
          <path d="M16 16L20 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      `;
      searchBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.dispatchEvent(
          new CustomEvent("search-input-search", {
            detail: { value: this._input?.value },
            bubbles: true,
            composed: true,
          }),
        );
      });
      this._wrapper.appendChild(searchBtn);
    }

    const displayHelper = showError ? errorMessage : helperText;
    if (displayHelper) {
      const helper = document.createElement("span");
      helper.className = SEARCH_HELPER_CLASS;
      helper.dataset.slot = "helper";
      helper.dataset.error = String(showError);
      if (showError) helper.setAttribute("role", "alert");
      helper.textContent = displayHelper;
      this._root.appendChild(helper);
    }
  }
}

define(NdsSearchInput);
