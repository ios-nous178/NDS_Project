/**
 * <nds-form-field> — DS FormField 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-form-field label="이름" required helper="실명을 입력해주세요.">
 *     <nds-input placeholder="홍길동"></nds-input>
 *   </nds-form-field>
 *
 * children 은 control slot 으로 들어간다 (한 번만 이동, 이후 update 에서는 surrounding chrome 만 다시 그림).
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const FF_CLASS = "nds-form-field";
const FF_ROOT_CLASS = `${FF_CLASS}__root`;
const FF_LABEL_ROW_CLASS = `${FF_CLASS}__label-row`;
const FF_LABEL_CLASS = `${FF_CLASS}__label`;
const FF_REQUIRED_CLASS = `${FF_CLASS}__required`;
const FF_OPTIONAL_CLASS = `${FF_CLASS}__optional`;
const FF_DESC_CLASS = `${FF_CLASS}__description`;
const FF_CONTROL_CLASS = `${FF_CLASS}__control`;
const FF_FOOTER_CLASS = `${FF_CLASS}__footer`;
const FF_HELPER_CLASS = `${FF_CLASS}__helper`;
const FF_ERROR_CLASS = `${FF_CLASS}__error`;
const FF_COUNTER_CLASS = `${FF_CLASS}__counter`;

let nextId = 0;

export class NdsFormField extends NdsElement {
  static elementName = "nds-form-field";

  static get observedAttributes(): readonly string[] {
    return [
      ...COMPONENT_ATTRS["nds-form-field"].observedAttributes,
      "label",
      "description",
      "helper",
      "error",
      "success",
      "counter",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _control: HTMLDivElement | null = null;
  private _baseId = `nds-ff-${++nextId}`;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = FF_ROOT_CLASS;

    const control = document.createElement("div");
    control.dataset.slot = "control";
    control.className = FF_CONTROL_CLASS;
    while (this.firstChild) control.appendChild(this.firstChild);

    root.appendChild(control);
    this.appendChild(root);
    this._root = root;
    this._control = control;
  }

  protected update(): void {
    if (!this._root || !this._control) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const label = this.getAttribute("label");
    const description = this.getAttribute("description");
    const helper = this.getAttribute("helper");
    const error = this.getAttribute("error");
    const success = this.getAttribute("success");
    const required = this.boolAttr("required");
    const optional = this.boolAttr("optional");
    const counter = this.getAttribute("counter");
    const htmlFor = this.getAttribute("html-for") || this._baseId;
    const labelPositionAttr = this.getAttribute("label-position");
    // description 이 있으면 left 모드여도 top 으로 자동 폴백 (좁은 좌측 컬럼에 멀티라인 description 부적합).
    const labelPosition = labelPositionAttr === "left" && !description ? "left" : "top";
    const labelWidth = this.getAttribute("label-width");

    this._root.dataset.labelPosition = labelPosition;
    const density = this.getAttribute("density") === "admin" ? "admin" : "default";
    this._root.dataset.density = density;
    if (labelPosition === "left" && labelWidth) {
      this._root.style.setProperty("--nds-form-field-label-width", `${labelWidth}px`);
    } else {
      this._root.style.removeProperty("--nds-form-field-label-width");
    }

    // Remove all root children except the control stash, then rebuild around it.
    Array.from(this._root.children).forEach((child) => {
      if (child !== this._control) child.remove();
    });
    // Footer 는 control 내부로 흡수 — left 모드에서 helper 가 control 컬럼과 정렬되도록.
    Array.from(this._control.querySelectorAll(`:scope > .${FF_FOOTER_CLASS}`)).forEach((n) =>
      n.remove(),
    );

    // Label Row (prepend before control)
    if (label || description) {
      const labelRow = document.createElement("div");
      labelRow.dataset.slot = "label-row";
      labelRow.className = FF_LABEL_ROW_CLASS;

      if (label) {
        const labelEl = document.createElement("label");
        labelEl.dataset.slot = "label";
        labelEl.className = FF_LABEL_CLASS;
        labelEl.setAttribute("for", htmlFor);

        const labelText = document.createElement("span");
        labelText.textContent = label;
        labelEl.appendChild(labelText);

        if (required) {
          const star = document.createElement("span");
          star.setAttribute("aria-hidden", "true");
          star.className = FF_REQUIRED_CLASS;
          star.textContent = "*";
          labelEl.appendChild(star);
        } else if (optional) {
          const opt = document.createElement("span");
          opt.setAttribute("aria-hidden", "true");
          opt.className = FF_OPTIONAL_CLASS;
          opt.textContent = "(선택)";
          labelEl.appendChild(opt);
        }
        labelRow.appendChild(labelEl);
      }

      if (description) {
        const descDiv = document.createElement("div");
        descDiv.dataset.slot = "description";
        descDiv.className = FF_DESC_CLASS;
        descDiv.textContent = description;
        labelRow.appendChild(descDiv);
      }
      this._root.insertBefore(labelRow, this._control);
    }

    // Footer (append after control)
    if (helper || error || success || counter) {
      const footerDiv = document.createElement("div");
      footerDiv.dataset.slot = "footer";
      footerDiv.className = FF_FOOTER_CLASS;

      if (error) {
        const errorSpan = document.createElement("span");
        errorSpan.dataset.slot = "error";
        errorSpan.dataset.error = "true";
        errorSpan.className = `${FF_ERROR_CLASS} nds-helper-text`;
        errorSpan.setAttribute("role", "alert");
        errorSpan.textContent = error;
        footerDiv.appendChild(errorSpan);
      } else if (success) {
        const successSpan = document.createElement("span");
        successSpan.dataset.slot = "success";
        successSpan.dataset.variant = "success";
        successSpan.className = `${FF_HELPER_CLASS} nds-helper-text`;
        successSpan.textContent = success;
        footerDiv.appendChild(successSpan);
      } else if (helper) {
        const helperSpan = document.createElement("span");
        helperSpan.dataset.slot = "helper";
        helperSpan.className = `${FF_HELPER_CLASS} nds-helper-text`;
        helperSpan.textContent = helper;
        footerDiv.appendChild(helperSpan);
      } else {
        const spacer = document.createElement("span");
        spacer.setAttribute("aria-hidden", "true");
        footerDiv.appendChild(spacer);
      }

      if (counter) {
        const counterSpan = document.createElement("span");
        counterSpan.dataset.slot = "counter";
        counterSpan.className = FF_COUNTER_CLASS;
        counterSpan.textContent = counter;
        footerDiv.appendChild(counterSpan);
      }
      this._control.appendChild(footerDiv);
    }
  }
}

define(NdsFormField);
