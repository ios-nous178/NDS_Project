/**
 * <nds-confirm-tooltip> — DS ConfirmTooltip 의 vanilla Web Component 버전.
 *
 * 캐포비 어드민 popconfirm — 흰 말풍선 + 제목/본문 + 1~2 액션 버튼 + 방향 tail.
 * 트리거는 light-DOM children (예: 버튼) 을 그대로 보존해 anchor 로 쓴다.
 * 확인/취소는 `nds-confirm-tooltip-confirm` / `nds-confirm-tooltip-cancel` CustomEvent 로 알린다.
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const CT_CLASS = "nds-confirm-tooltip";
const CT_TRIGGER_CLASS = `${CT_CLASS}__trigger`;
const CT_CONTENT_CLASS = `${CT_CLASS}__content`;
const CT_TITLE_CLASS = `${CT_CLASS}__title`;
const CT_DESC_CLASS = `${CT_CLASS}__desc`;
const CT_ACTIONS_CLASS = `${CT_CLASS}__actions`;
const CT_BTN_CLASS = `${CT_CLASS}__btn`;
const CT_BTN_CANCEL_CLASS = `${CT_CLASS}__btn--cancel`;
const CT_BTN_CONFIRM_CLASS = `${CT_CLASS}__btn--confirm`;
const CT_ARROW_CLASS = `${CT_CLASS}__arrow`;

export type ConfirmTooltipPlacement = "top" | "bottom" | "left" | "right";
export type ConfirmTooltipActions = "dual" | "single";

const PLACEMENTS: readonly ConfirmTooltipPlacement[] = ["top", "bottom", "left", "right"];
const ACTIONS: readonly ConfirmTooltipActions[] = ["dual", "single"];

export class NdsConfirmTooltip extends NdsElement {
  static elementName = "nds-confirm-tooltip";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-confirm-tooltip"].observedAttributes, "title", "description"];
  }

  private _root: HTMLDivElement | null = null;
  private _trigger: HTMLSpanElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    // 원본 light-DOM children = 트리거. 보존한 채 trigger span 으로 이동.
    const trigger = document.createElement("span");
    trigger.dataset.slot = "trigger";
    trigger.className = CT_TRIGGER_CLASS;
    trigger.setAttribute("aria-haspopup", "dialog");
    while (this.firstChild) trigger.appendChild(this.firstChild);

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = CT_CLASS;
    root.appendChild(trigger);

    this.appendChild(root);
    this._root = root;
    this._trigger = trigger;
  }

  protected update(): void {
    if (!this._root || !this._trigger) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    // content 만 다시 그린다 (trigger 는 보존).
    const stale = this._root.querySelector(`:scope > .${CT_CONTENT_CLASS}`);
    if (stale) stale.remove();

    if (!this.boolAttr("open")) return;
    this._root.appendChild(this._buildContent());
  }

  private _buildContent(): HTMLElement {
    const content = document.createElement("div");
    content.dataset.slot = "content";
    content.dataset.placement = this._normalizedPlacement();
    content.role = "dialog";
    content.className = CT_CONTENT_CLASS;

    const bodyWidth = this.getAttribute("body-width");
    if (bodyWidth) {
      content.style.setProperty(
        "--nds-confirm-tooltip-body-width",
        /^\d+$/.test(bodyWidth) ? `${bodyWidth}px` : bodyWidth,
      );
    }

    const title = document.createElement("p");
    title.dataset.slot = "title";
    title.className = CT_TITLE_CLASS;
    title.textContent = this.attr("title", "");
    content.appendChild(title);

    const descText = this.getAttribute("description");
    if (descText) {
      const desc = document.createElement("p");
      desc.dataset.slot = "description";
      desc.className = CT_DESC_CLASS;
      desc.textContent = descText;
      content.appendChild(desc);
    }

    const actions = this._normalizedActions();
    const actionsRow = document.createElement("div");
    actionsRow.dataset.slot = "actions";
    actionsRow.dataset.actions = actions;
    actionsRow.className = CT_ACTIONS_CLASS;

    if (actions === "dual") {
      actionsRow.appendChild(
        this._button(
          CT_BTN_CANCEL_CLASS,
          "cancel",
          this.attr("cancel-label", "취소"),
          "nds-confirm-tooltip-cancel",
        ),
      );
    }
    actionsRow.appendChild(
      this._button(
        CT_BTN_CONFIRM_CLASS,
        "confirm",
        this.attr("confirm-label", "확인"),
        "nds-confirm-tooltip-confirm",
      ),
    );
    content.appendChild(actionsRow);

    const arrow = document.createElement("span");
    arrow.className = CT_ARROW_CLASS;
    arrow.setAttribute("aria-hidden", "true");
    content.appendChild(arrow);

    return content;
  }

  private _button(
    modifierClass: string,
    slot: string,
    label: string,
    eventName: string,
  ): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.slot = slot;
    btn.className = `${CT_BTN_CLASS} ${modifierClass}`;
    btn.textContent = label;
    btn.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true }));
    });
    return btn;
  }

  private _normalizedPlacement(): ConfirmTooltipPlacement {
    const value = this.attr("placement", "top");
    return (PLACEMENTS as readonly string[]).includes(value)
      ? (value as ConfirmTooltipPlacement)
      : "top";
  }

  private _normalizedActions(): ConfirmTooltipActions {
    const value = this.attr("actions", "dual");
    return (ACTIONS as readonly string[]).includes(value)
      ? (value as ConfirmTooltipActions)
      : "dual";
  }
}

define(NdsConfirmTooltip);
