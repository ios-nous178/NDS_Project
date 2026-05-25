/**
 * <nds-status-timeline> — DS StatusTimeline 의 vanilla Web Component 버전.
 *
 * 기존 <nds-timeline> 과 별개의 컴포넌트. 단계형 진행 상태(done / current / todo).
 *
 * 사용 패턴 (JSON steps):
 *   <nds-status-timeline
 *     current="1"
 *     direction="horizontal"
 *     steps='[
 *       {"key":"a","label":"접수","time":"3/1"},
 *       {"key":"b","label":"진행 중","description":"검토 완료"},
 *       {"key":"c","label":"완료"}
 *     ]'>
 *   </nds-status-timeline>
 *
 * 속성:
 *   current: 현재 진행 인덱스 (0-based, 이 인덱스까지 done + 인덱스 자체는 current)
 *   direction: "horizontal" | "vertical" (기본 horizontal)
 *   steps: JSON 배열 — { key, label, description?, time? }
 */

import { NdsElement, define } from "../base/nds-element.js";

const ST_CLASS = "nds-status-timeline";
const ST_ITEM_CLASS = `${ST_CLASS}__item`;
const ST_INDICATOR_CLASS = `${ST_CLASS}__indicator`;
const ST_DOT_CLASS = `${ST_CLASS}__dot`;
const ST_LINE_CLASS = `${ST_CLASS}__line`;
const ST_BODY_CLASS = `${ST_CLASS}__body`;
const ST_LABEL_CLASS = `${ST_CLASS}__label`;
const ST_DESC_CLASS = `${ST_CLASS}__desc`;
const ST_TIME_CLASS = `${ST_CLASS}__time`;

export type StatusTimelineDirection = "horizontal" | "vertical";

interface StatusTimelineStep {
  key: string;
  label: string;
  description?: string;
  time?: string;
}

const stateOf = (idx: number, current: number): "done" | "current" | "todo" => {
  if (idx < current) return "done";
  if (idx === current) return "current";
  return "todo";
};

const CheckSvg = (): SVGSVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "12");
  svg.setAttribute("height", "12");
  svg.setAttribute("viewBox", "0 0 12 12");
  svg.setAttribute("fill", "none");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M2.5 6.5l2.5 2.5L9.5 3.5");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);
  return svg;
};

export class NdsStatusTimeline extends NdsElement {
  static elementName = "nds-status-timeline";

  static get observedAttributes(): readonly string[] {
    return ["current", "direction", "steps"];
  }

  private _root: HTMLOListElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("ol");
    root.dataset.slot = "root";
    root.className = ST_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  private _parseSteps(): StatusTimelineStep[] {
    const raw = this.getAttribute("steps");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as StatusTimelineStep[];
    } catch {
      /* ignore */
    }
    return [];
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const steps = this._parseSteps();
    const current = parseInt(this.attr("current", "0"), 10) || 0;
    const direction: StatusTimelineDirection =
      this.attr("direction", "horizontal") === "vertical" ? "vertical" : "horizontal";

    this._root.dataset.direction = direction;

    const items = steps.map((step, i) => {
      const state = stateOf(i, current);
      const isFirst = i === 0;
      const isLast = i === steps.length - 1;
      const leftLineState = isFirst ? "hidden" : i <= current ? "done" : "todo";
      const rightLineState = isLast ? "hidden" : i < current ? "done" : "todo";

      const li = document.createElement("li");
      li.className = ST_ITEM_CLASS;
      li.dataset.state = state;

      const indicator = document.createElement("div");
      indicator.className = ST_INDICATOR_CLASS;

      if (direction === "horizontal") {
        const leftLine = document.createElement("span");
        leftLine.className = ST_LINE_CLASS;
        leftLine.dataset.state = leftLineState;
        leftLine.setAttribute("aria-hidden", "true");
        indicator.appendChild(leftLine);
      }

      const dot = document.createElement("span");
      dot.className = ST_DOT_CLASS;
      dot.dataset.state = state;
      dot.setAttribute("aria-hidden", "true");
      if (state === "done") {
        dot.appendChild(CheckSvg());
      } else {
        dot.textContent = String(i + 1);
      }
      indicator.appendChild(dot);

      if (direction === "horizontal") {
        const rightLine = document.createElement("span");
        rightLine.className = ST_LINE_CLASS;
        rightLine.dataset.state = rightLineState;
        rightLine.setAttribute("aria-hidden", "true");
        indicator.appendChild(rightLine);
      } else if (!isLast) {
        const line = document.createElement("span");
        line.className = ST_LINE_CLASS;
        line.dataset.state = rightLineState;
        line.setAttribute("aria-hidden", "true");
        indicator.appendChild(line);
      }

      const body = document.createElement("div");
      body.className = ST_BODY_CLASS;

      const label = document.createElement("span");
      label.className = ST_LABEL_CLASS;
      label.dataset.state = state;
      label.textContent = step.label;
      body.appendChild(label);

      if (step.description) {
        const desc = document.createElement("span");
        desc.className = ST_DESC_CLASS;
        desc.textContent = step.description;
        body.appendChild(desc);
      }
      if (step.time) {
        const time = document.createElement("span");
        time.className = ST_TIME_CLASS;
        time.textContent = step.time;
        body.appendChild(time);
      }

      li.append(indicator, body);
      return li;
    });

    this._root.replaceChildren(...items);
  }
}

define(NdsStatusTimeline);
