/**
 * <nds-stepper> — DS Stepper 의 vanilla Web Component 버전.
 */

import { NdsElement, define } from "../base/nds-element.js";

const ST_CLASS = "nds-stepper";
const ST_ROOT_CLASS = `${ST_CLASS}__root`;
const ST_ITEM_CLASS = `${ST_CLASS}__item`;
const ST_INDICATOR_CLASS = `${ST_CLASS}__indicator`;
const ST_LABEL_CLASS = `${ST_CLASS}__label`;
const ST_CONNECTOR_CLASS = `${ST_CLASS}__connector`;
const ST_CHECK_CLASS = `${ST_CLASS}__check`;
const ST_BAR_CLASS = `${ST_CLASS}__bar`;
const ST_STEP_CLASS = `${ST_CLASS}__step`;
const ST_TITLE_CLASS = `${ST_CLASS}__title`;

export type StepperVariant = "numbered" | "dots" | "bar";

interface StepItem {
  key: string;
  label?: string;
  title?: string;
}

const VARIANTS: readonly StepperVariant[] = ["numbered", "dots", "bar"];
const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsStepper extends NdsElement {
  static elementName = "nds-stepper";

  static get observedAttributes(): readonly string[] {
    return ["steps", "current", "variant", ...FORWARDED_ATTRS];
  }

  private _root: HTMLOListElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("ol");
    root.dataset.slot = "root";
    root.className = ST_ROOT_CLASS;
    root.setAttribute("role", "list");
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const variant = this._normalizedVariant();
    const steps = this._steps();
    const current = clamp(this._intAttr("current", 0), 0, Math.max(steps.length - 1, 0));
    this._root.dataset.variant = variant;

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    this._root.replaceChildren(
      ...steps.map((step, index) =>
        this._createItem(step, index, current, variant, index === steps.length - 1),
      ),
    );
  }

  private _createItem(
    step: StepItem,
    index: number,
    current: number,
    variant: StepperVariant,
    isLast: boolean,
  ): HTMLLIElement {
    const state = index < current ? "completed" : index === current ? "current" : "upcoming";
    const item = document.createElement("li");
    item.dataset.slot = "item";
    item.dataset.state = state;
    item.className = ST_ITEM_CLASS;
    if (state === "current") item.setAttribute("aria-current", "step");

    if (variant === "bar") {
      item.dataset.variant = "bar";

      const bar = document.createElement("span");
      bar.dataset.slot = "bar";
      bar.dataset.variant = "bar";
      bar.className = ST_BAR_CLASS;
      bar.setAttribute("aria-hidden", "true");
      item.appendChild(bar);

      const hasLabel = step.label !== undefined && step.label !== "";
      const hasTitle = step.title !== undefined && step.title !== "";
      if (hasLabel || hasTitle) {
        const label = document.createElement("span");
        label.dataset.slot = "label";
        label.dataset.variant = "bar";
        label.className = ST_LABEL_CLASS;
        if (hasLabel) {
          const stepEl = document.createElement("span");
          stepEl.dataset.slot = "step";
          stepEl.className = ST_STEP_CLASS;
          stepEl.textContent = step.label as string;
          label.appendChild(stepEl);
        }
        if (hasTitle) {
          const titleEl = document.createElement("span");
          titleEl.dataset.slot = "title";
          titleEl.className = ST_TITLE_CLASS;
          titleEl.textContent = step.title as string;
          label.appendChild(titleEl);
        }
        item.appendChild(label);
      }
      return item;
    }

    const indicator = document.createElement("span");
    indicator.dataset.slot = "indicator";
    indicator.dataset.variant = variant;
    indicator.className = ST_INDICATOR_CLASS;
    if (variant === "dots") {
      indicator.setAttribute("aria-hidden", "true");
    } else if (state === "completed") {
      indicator.appendChild(createCheckIcon());
    } else {
      indicator.textContent = String(index + 1);
    }
    item.appendChild(indicator);

    if (step.label !== undefined && step.label !== "") {
      const label = document.createElement("span");
      label.dataset.slot = "label";
      label.className = ST_LABEL_CLASS;
      label.textContent = step.label;
      item.appendChild(label);
    }

    if (!isLast) {
      const connector = document.createElement("span");
      connector.dataset.slot = "connector";
      connector.dataset.variant = variant;
      connector.className = ST_CONNECTOR_CLASS;
      connector.setAttribute("aria-hidden", "true");
      item.appendChild(connector);
    }
    return item;
  }

  private _steps(): StepItem[] {
    const raw = this.getAttribute("steps");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((item, index) =>
          typeof item === "string"
            ? { key: String(index), label: item }
            : {
                key: String((item as { key?: unknown }).key ?? index),
                label:
                  (item as { label?: unknown }).label === undefined
                    ? undefined
                    : String((item as { label?: unknown }).label),
                title:
                  (item as { title?: unknown }).title === undefined
                    ? undefined
                    : String((item as { title?: unknown }).title),
              },
        );
      }
    } catch {
      /* fall through to comma list */
    }
    return raw.split(",").map((label, index) => ({ key: String(index), label: label.trim() }));
  }

  private _normalizedVariant(): StepperVariant {
    const value = this.attr("variant", "numbered");
    return (VARIANTS as readonly string[]).includes(value) ? (value as StepperVariant) : "numbered";
  }

  private _intAttr(name: string, defaultValue: number): number {
    const value = Number(this.getAttribute(name));
    return Number.isFinite(value) ? Math.floor(value) : defaultValue;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function createCheckIcon(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add(ST_CHECK_CLASS);
  svg.setAttribute("viewBox", "0 0 14 14");
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M3 7L6 10L11 4");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);
  return svg;
}

define(NdsStepper);
