/**
 * <nds-field-action-row> — DS FieldActionRow 의 vanilla Web Component 버전.
 *
 * 사용 예 (인증번호 입력):
 *   <nds-field-action-row helper-text="3분 안에 인증번호를 입력해주세요" action-tone="outline">
 *     <nds-input slot="field" placeholder="인증번호"></nds-input>
 *     <span slot="timer">02:30</span>
 *     <nds-button slot="action">재발송</nds-button>
 *   </nds-field-action-row>
 *
 * 속성:
 *   label: 필드 라벨 (선택) — 주면 입력+버튼 한 줄 위에 라벨이 렌더됨
 *   action-tone: "outline" | "solid"
 *   error / success
 *   timer-expired
 *   helper-text
 *
 * children:
 *   slot="field"  — 입력 필드
 *   slot="action" — 버튼
 *   slot="timer"  — 타이머 텍스트 (선택)
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const FAR_CLASS = "nds-field-action-row";
const FAR_ROOT_CLASS = `${FAR_CLASS}__root`;
const FAR_LABEL_CLASS = `${FAR_CLASS}__label`;
const FAR_FIELD_CLASS = `${FAR_CLASS}__field`;
const FAR_ACTION_CLASS = `${FAR_CLASS}__action`;
const FAR_HELPER_CLASS = `${FAR_CLASS}__helper`;
const FAR_TIMER_CLASS = `${FAR_CLASS}__timer`;

export class NdsFieldActionRow extends NdsElement {
  static elementName = "nds-field-action-row";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-field-action-row"].observedAttributes, "label"];
  }

  private _root: HTMLDivElement | null = null;
  private _label: HTMLSpanElement | null = null;
  private _field: HTMLDivElement | null = null;
  private _timer: HTMLSpanElement | null = null;
  private _action: HTMLDivElement | null = null;
  private _helper: HTMLSpanElement | null = null;
  private _hasTimer = false;
  private _hasAction = false;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const fieldStash: Node[] = [];
    const timerStash: Node[] = [];
    const actionStash: Node[] = [];
    Array.from(this.childNodes).forEach((node) => {
      if (node instanceof HTMLElement) {
        const slot = node.getAttribute("slot");
        if (slot === "field") fieldStash.push(node);
        else if (slot === "timer") timerStash.push(node);
        else if (slot === "action") actionStash.push(node);
      }
      node.parentNode?.removeChild(node);
    });
    this._hasTimer = timerStash.length > 0;
    this._hasAction = actionStash.length > 0;

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = FAR_ROOT_CLASS;

    // 라벨(옵션) — 입력+버튼 한 줄 위. helper 처럼 항상 만들고 update 에서 표시/숨김.
    const label = document.createElement("span");
    label.dataset.slot = "label";
    label.className = FAR_LABEL_CLASS;
    root.appendChild(label);

    const row = document.createElement("div");
    row.dataset.slot = "row";

    const field = document.createElement("div");
    field.dataset.slot = "field";
    field.className = FAR_FIELD_CLASS;
    // 타이머 슬롯이 있으면 우측 공간 예약(겹침 방지) — react data-has-timer 미러.
    field.dataset.hasTimer = this._hasTimer ? "true" : "false";
    fieldStash.forEach((n) => field.appendChild(n));

    const timer = document.createElement("span");
    timer.dataset.slot = "timer";
    timer.className = FAR_TIMER_CLASS;
    timerStash.forEach((n) => timer.appendChild(n));
    if (this._hasTimer) field.appendChild(timer);

    // action 은 옵션 — 슬롯 콘텐츠가 없으면 액션 div 자체를 만들지 않는다(코드+타이머만 레이아웃).
    const action = document.createElement("div");
    action.dataset.slot = "action";
    action.className = FAR_ACTION_CLASS;
    actionStash.forEach((n) => action.appendChild(n));

    row.appendChild(field);
    if (this._hasAction) row.appendChild(action);
    root.appendChild(row);

    const helper = document.createElement("span");
    helper.dataset.slot = "helper";
    helper.className = FAR_HELPER_CLASS;
    root.appendChild(helper);

    this.appendChild(root);

    this._root = root;
    this._label = label;
    this._field = field;
    this._timer = timer;
    this._action = action;
    this._helper = helper;
  }

  protected update(): void {
    if (!this._root || !this._label || !this._field || !this._timer || !this._action || !this._helper)
      return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const labelText = this.getAttribute("label");
    if (labelText) {
      this._label.textContent = labelText;
      this._label.style.display = "";
    } else {
      this._label.style.display = "none";
    }

    const actionTone = this.getAttribute("action-tone") || "outline";
    const error = this.boolAttr("error");
    const success = this.boolAttr("success");
    const timerExpired = this.boolAttr("timer-expired");
    const helperText = this.getAttribute("helper-text");

    this._field.dataset.error = error ? "true" : "false";
    this._field.dataset.success = success ? "true" : "false";
    this._action.dataset.tone = actionTone;
    if (this._hasTimer) this._timer.dataset.expired = timerExpired ? "true" : "false";

    if (helperText) {
      this._helper.textContent = helperText;
      this._helper.dataset.error = error ? "true" : "false";
      this._helper.dataset.success = success ? "true" : "false";
      this._helper.style.display = "";
    } else {
      this._helper.style.display = "none";
    }
  }
}

define(NdsFieldActionRow);
