/**
 * <nds-step-progress> — DS StepProgress 의 vanilla Web Component 버전.
 *
 * 가로 막대형 단계 진행 표시(Stepper). 각 스텝은 막대 + 라벨(스텝번호 + 제목)로 구성.
 * 캐시워크 for Business 어드민 화면 기준.
 */

import { NdsElement, define } from "../base/nds-element.js";

const SP_CLASS = "nds-step-progress";
const SP_ITEM_CLASS = `${SP_CLASS}__item`;
const SP_BAR_CLASS = `${SP_CLASS}__bar`;
const SP_LABEL_CLASS = `${SP_CLASS}__label`;
const SP_STEP_CLASS = `${SP_CLASS}__step`;
const SP_TITLE_CLASS = `${SP_CLASS}__title`;

interface StepProgressItem {
  key: string;
  label?: string;
  title?: string;
}

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsStepProgress extends NdsElement {
  static elementName = "nds-step-progress";

  static get observedAttributes(): readonly string[] {
    return ["steps", "current", ...FORWARDED_ATTRS];
  }

  private _root: HTMLOListElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("ol");
    root.dataset.slot = "root";
    root.className = SP_CLASS;
    root.setAttribute("role", "list");
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const steps = this._steps();
    const current = clamp(this._intAttr("current", 0), 0, Math.max(steps.length - 1, 0));

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    this._root.replaceChildren(
      ...steps.map((step, index) => this._createItem(step, index, current)),
    );
  }

  private _createItem(step: StepProgressItem, index: number, current: number): HTMLLIElement {
    const state = index < current ? "completed" : index === current ? "current" : "upcoming";
    const item = document.createElement("li");
    item.dataset.slot = "item";
    item.dataset.state = state;
    item.className = SP_ITEM_CLASS;
    if (state === "current") item.setAttribute("aria-current", "step");

    const bar = document.createElement("span");
    bar.dataset.slot = "bar";
    bar.className = SP_BAR_CLASS;
    bar.setAttribute("aria-hidden", "true");
    item.appendChild(bar);

    const hasLabel = step.label !== undefined && step.label !== "";
    const hasTitle = step.title !== undefined && step.title !== "";
    if (hasLabel || hasTitle) {
      const label = document.createElement("span");
      label.dataset.slot = "label";
      label.className = SP_LABEL_CLASS;
      if (hasLabel) {
        const stepEl = document.createElement("span");
        stepEl.dataset.slot = "step";
        stepEl.className = SP_STEP_CLASS;
        stepEl.textContent = step.label as string;
        label.appendChild(stepEl);
      }
      if (hasTitle) {
        const titleEl = document.createElement("span");
        titleEl.dataset.slot = "title";
        titleEl.className = SP_TITLE_CLASS;
        titleEl.textContent = step.title as string;
        label.appendChild(titleEl);
      }
      item.appendChild(label);
    }
    return item;
  }

  private _steps(): StepProgressItem[] {
    const raw = this.getAttribute("steps");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((item, index) => {
          if (typeof item === "string") return { key: String(index), title: item };
          const obj = item as { key?: unknown; label?: unknown; title?: unknown };
          return {
            key: String(obj.key ?? index),
            label: obj.label === undefined ? undefined : String(obj.label),
            title: obj.title === undefined ? undefined : String(obj.title),
          };
        });
      }
    } catch {
      /* fall through to comma list */
    }
    return raw.split(",").map((title, index) => ({ key: String(index), title: title.trim() }));
  }

  private _intAttr(name: string, defaultValue: number): number {
    const value = Number(this.getAttribute(name));
    return Number.isFinite(value) ? Math.floor(value) : defaultValue;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

define(NdsStepProgress);
