/**
 * <nds-coach-mark> — DS CoachMark 의 vanilla Web Component 버전.
 *
 * 사용:
 *   <nds-coach-mark open step="0"
 *     steps='[{"target":"#btn","title":"버튼 안내","description":"눌러보세요","placement":"bottom"}]'>
 *   </nds-coach-mark>
 *
 * Attributes:
 *   open       boolean — 노출 여부
 *   step       현재 step index (default 0)
 *   steps      JSON — { target(selector), title, description?, placement?, padding? }[]
 *   finish-label  마지막 단계 버튼 (default "완료")
 *   next-label    중간 단계 버튼 (default "다음")
 *   skip-label    스킵 버튼 (default "건너뛰기")
 *   hide-skip     boolean — 스킵 숨김
 *
 * 이벤트:
 *   coach-step-change  (detail: { step })
 *   coach-close
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const CM_CLASS = "nds-coach-mark";
const CM_OVERLAY_CLASS = `${CM_CLASS}__overlay`;
const CM_HOLE_CLASS = `${CM_CLASS}__hole`;
const CM_TOOLTIP_CLASS = `${CM_CLASS}__tooltip`;
const CM_STEP_CLASS = `${CM_CLASS}__step`;
const CM_TITLE_CLASS = `${CM_CLASS}__title`;
const CM_DESC_CLASS = `${CM_CLASS}__desc`;
const CM_FOOTER_CLASS = `${CM_CLASS}__footer`;
const CM_DOTS_CLASS = `${CM_CLASS}__dots`;
const CM_DOT_CLASS = `${CM_CLASS}__dot`;
const CM_ACTIONS_CLASS = `${CM_CLASS}__actions`;
const CM_BTN_CLASS = `${CM_CLASS}__btn`;
const CM_SKIP_CLASS = `${CM_CLASS}__skip`;

export type CoachMarkPlacement = "top" | "bottom" | "left" | "right";

const PLACEMENTS: readonly CoachMarkPlacement[] = ["top", "bottom", "left", "right"];

interface CoachMarkStep {
  target: string;
  title: string;
  description?: string;
  placement: CoachMarkPlacement;
  padding: number;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function computeTooltipPosition(
  rect: Rect,
  placement: CoachMarkPlacement,
  tooltipW: number,
  tooltipH: number,
  margin = 12,
): { top: number; left: number } {
  switch (placement) {
    case "top":
      return {
        top: rect.top - tooltipH - margin,
        left: rect.left + rect.width / 2 - tooltipW / 2,
      };
    case "bottom":
      return {
        top: rect.top + rect.height + margin,
        left: rect.left + rect.width / 2 - tooltipW / 2,
      };
    case "left":
      return {
        top: rect.top + rect.height / 2 - tooltipH / 2,
        left: rect.left - tooltipW - margin,
      };
    case "right":
      return {
        top: rect.top + rect.height / 2 - tooltipH / 2,
        left: rect.left + rect.width + margin,
      };
  }
}

export class NdsCoachMark extends NdsElement {
  static elementName = "nds-coach-mark";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-coach-mark"].observedAttributes];
  }

  private _root: HTMLDivElement | null = null;
  private _tooltip: HTMLDivElement | null = null;
  private _onResize = () => this._recompute();

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
    window.addEventListener("resize", this._onResize);
    window.addEventListener("scroll", this._onResize, true);
  }

  override disconnectedCallback(): void {
    window.removeEventListener("resize", this._onResize);
    window.removeEventListener("scroll", this._onResize, true);
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = CM_OVERLAY_CLASS;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    this.replaceChildren(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const open = this.boolAttr("open");
    this._root.hidden = !open;
    this._root.dataset.open = open ? "true" : "false";
    if (!open) {
      this._root.replaceChildren();
      this._tooltip = null;
      return;
    }

    const steps = this._readSteps();
    const stepIdx = this._stepIdx(steps.length);
    const current = steps[stepIdx];
    if (!current) {
      this._root.replaceChildren();
      this._tooltip = null;
      return;
    }

    const hole = document.createElement("div");
    hole.className = CM_HOLE_CLASS;
    hole.dataset.slot = "hole";

    const tooltip = this._createTooltip(steps, stepIdx, current);

    this._root.replaceChildren(hole, tooltip);
    this._tooltip = tooltip;
    this._positionFor(current, hole, tooltip);
  }

  private _createTooltip(
    steps: CoachMarkStep[],
    stepIdx: number,
    current: CoachMarkStep,
  ): HTMLDivElement {
    const tooltip = document.createElement("div");
    tooltip.className = CM_TOOLTIP_CLASS;
    tooltip.dataset.slot = "tooltip";

    const stepBadge = document.createElement("div");
    stepBadge.className = CM_STEP_CLASS;
    stepBadge.textContent = `STEP ${stepIdx + 1} / ${steps.length}`;
    tooltip.appendChild(stepBadge);

    const title = document.createElement("h3");
    title.className = CM_TITLE_CLASS;
    title.textContent = current.title;
    tooltip.appendChild(title);

    if (current.description) {
      const desc = document.createElement("p");
      desc.className = CM_DESC_CLASS;
      desc.textContent = current.description;
      tooltip.appendChild(desc);
    }

    const footer = document.createElement("div");
    footer.className = CM_FOOTER_CLASS;

    const dots = document.createElement("div");
    dots.className = CM_DOTS_CLASS;
    dots.setAttribute("aria-hidden", "true");
    steps.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = CM_DOT_CLASS;
      dot.dataset.active = i === stepIdx ? "true" : "false";
      dots.appendChild(dot);
    });
    footer.appendChild(dots);

    const actions = document.createElement("div");
    actions.className = CM_ACTIONS_CLASS;

    const isLast = stepIdx >= steps.length - 1;
    if (!isLast && !this.boolAttr("hide-skip")) {
      const skip = document.createElement("button");
      skip.type = "button";
      skip.className = CM_SKIP_CLASS;
      skip.textContent = this.attr("skip-label", "건너뛰기");
      skip.addEventListener("click", () => this._close());
      actions.appendChild(skip);
    }

    const primary = document.createElement("button");
    primary.type = "button";
    primary.className = CM_BTN_CLASS;
    primary.textContent = isLast
      ? this.attr("finish-label", "완료")
      : this.attr("next-label", "다음");
    primary.addEventListener("click", () => this._next(steps.length, stepIdx));
    actions.appendChild(primary);
    footer.appendChild(actions);

    tooltip.appendChild(footer);
    return tooltip;
  }

  private _positionFor(step: CoachMarkStep, hole: HTMLDivElement, tooltip: HTMLDivElement): void {
    const target = document.querySelector(step.target) as HTMLElement | null;
    if (!target) {
      hole.hidden = true;
      tooltip.style.top = "80px";
      tooltip.style.left = "16px";
      return;
    }
    const r = target.getBoundingClientRect();
    const padding = step.padding;
    const rect: Rect = {
      top: r.top - padding,
      left: r.left - padding,
      width: r.width + padding * 2,
      height: r.height + padding * 2,
    };
    hole.style.top = `${rect.top}px`;
    hole.style.left = `${rect.left}px`;
    hole.style.width = `${rect.width}px`;
    hole.style.height = `${rect.height}px`;

    const tw = tooltip.offsetWidth || 320;
    const th = tooltip.offsetHeight || 160;
    const pos = computeTooltipPosition(rect, step.placement, tw, th);
    tooltip.style.top = `${pos.top}px`;
    tooltip.style.left = `${pos.left}px`;
  }

  private _next(total: number, current: number): void {
    if (current >= total - 1) {
      this._close();
      return;
    }
    const next = current + 1;
    this.setAttribute("step", String(next));
    this.dispatchEvent(
      new CustomEvent("coach-step-change", {
        detail: { step: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _close(): void {
    this.removeAttribute("open");
    this.dispatchEvent(new CustomEvent("coach-close", { bubbles: true, composed: true }));
  }

  private _recompute(): void {
    if (!this._root || !this._tooltip) return;
    if (!this.boolAttr("open")) return;
    const steps = this._readSteps();
    const idx = this._stepIdx(steps.length);
    const current = steps[idx];
    const hole = this._root.querySelector(`.${CM_HOLE_CLASS}`) as HTMLDivElement | null;
    if (!current || !hole) return;
    this._positionFor(current, hole, this._tooltip);
  }

  private _stepIdx(length: number): number {
    const raw = Number(this.getAttribute("step"));
    if (!Number.isFinite(raw)) return 0;
    const trimmed = Math.trunc(raw);
    if (trimmed < 0) return 0;
    if (trimmed > length - 1) return Math.max(0, length - 1);
    return trimmed;
  }

  private _readSteps(): CoachMarkStep[] {
    const attr = this.getAttribute("steps");
    if (!attr || !attr.trim()) return [];
    try {
      const parsed = JSON.parse(attr) as Array<Record<string, unknown>>;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((raw) => {
          const placement = typeof raw.placement === "string" ? raw.placement : "bottom";
          return {
            target: typeof raw.target === "string" ? raw.target : "",
            title: typeof raw.title === "string" ? raw.title : "",
            description: typeof raw.description === "string" ? raw.description : undefined,
            placement: (PLACEMENTS as readonly string[]).includes(placement)
              ? (placement as CoachMarkPlacement)
              : "bottom",
            padding: Number.isFinite(Number(raw.padding)) ? Number(raw.padding) : 8,
          };
        })
        .filter((step) => step.target && step.title);
    } catch {
      return [];
    }
  }
}

define(NdsCoachMark);
