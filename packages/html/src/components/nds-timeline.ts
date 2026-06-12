/**
 * <nds-timeline> — DS Timeline 의 vanilla Web Component 버전 (data-array API).
 *
 * 구 ActivityTimeline(이벤트 로그) + StatusTimeline(단계 트래커)을 통합.
 *
 * 사용 예 (activity — 시간순 이벤트):
 *   <nds-timeline mode="activity" items='[
 *     {"key":"a","date":"2024.03.20","title":"상담 예약 완료","status":"completed"},
 *     {"key":"b","date":"2024.03.21","title":"심리 검사 진행","status":"ongoing","statusLabel":"진행 중"}
 *   ]'></nds-timeline>
 *
 * 사용 예 (tracker — 단계 진행):
 *   <nds-timeline mode="tracker" current="1" direction="horizontal" items='[
 *     {"key":"r","title":"접수","date":"05/20"},
 *     {"key":"p","title":"처리 중"},
 *     {"key":"d","title":"완료"}
 *   ]'></nds-timeline>
 *
 * 속성:
 *   mode: activity | tracker (기본 activity)
 *   direction: vertical | horizontal (기본 vertical — horizontal 은 tracker 에서만 의미)
 *   current: tracker 진행 인덱스 (0-based)
 *   items: JSON 배열 ({ key, title, date?, description?, status?, statusLabel? })
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const TL_CLASS = "nds-timeline";
const TL_ITEM_CLASS = `${TL_CLASS}__item`;
const TL_INDICATOR_CLASS = `${TL_CLASS}__indicator`;
const TL_DOT_CLASS = `${TL_CLASS}__dot`;
const TL_LINE_CLASS = `${TL_CLASS}__line`;
const TL_BODY_CLASS = `${TL_CLASS}__body`;
const TL_DATE_CLASS = `${TL_CLASS}__date`;
const TL_TITLE_CLASS = `${TL_CLASS}__title`;
const TL_DESC_CLASS = `${TL_CLASS}__description`;
const TL_BADGE_CLASS = `${TL_CLASS}__badge`;

export type TimelineMode = "activity" | "tracker";
export type TimelineDirection = "vertical" | "horizontal";
export type TimelineStatus = "default" | "completed" | "ongoing" | "warning" | "error";

interface TimelineItem {
  key: string;
  title: string;
  date?: string;
  description?: string;
  status?: TimelineStatus;
  statusLabel?: string;
}

const MODES: readonly TimelineMode[] = ["activity", "tracker"];
const DIRECTIONS: readonly TimelineDirection[] = ["vertical", "horizontal"];

export class NdsTimeline extends NdsElement {
  static elementName = "nds-timeline";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-timeline"].observedAttributes];
  }

  private _root: HTMLOListElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("ol");
    root.dataset.slot = "root";
    root.className = TL_CLASS;
    root.setAttribute("role", "list");
    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const mode = this._normalized("mode", MODES, "activity");
    const direction =
      mode === "tracker" ? this._normalized("direction", DIRECTIONS, "vertical") : "vertical";
    const items = this._items();
    const current = clamp(this._intAttr("current", 0), 0, Math.max(items.length - 1, 0));

    this._root.dataset.mode = mode;
    this._root.dataset.direction = direction;

    this._root.replaceChildren(
      ...items.map((item, index) =>
        this._createItem(item, index, mode, direction, current, items.length),
      ),
    );
  }

  private _createItem(
    item: TimelineItem,
    index: number,
    mode: TimelineMode,
    direction: TimelineDirection,
    current: number,
    total: number,
  ): HTMLLIElement {
    const isTracker = mode === "tracker";
    const isFirst = index === 0;
    const isLast = index === total - 1;
    const state = isTracker ? trackerState(index, current) : undefined;
    const status = isTracker ? undefined : (item.status ?? "default");

    const li = document.createElement("li");
    li.dataset.slot = "item";
    li.dataset.mode = mode;
    if (state) li.dataset.state = state;
    if (status) li.dataset.status = status;
    if (state === "current") li.setAttribute("aria-current", "step");
    li.className = TL_ITEM_CLASS;

    const indicator = document.createElement("div");
    indicator.dataset.slot = "indicator";
    indicator.className = TL_INDICATOR_CLASS;

    const leftLineState = isFirst ? "hidden" : index <= current ? "done" : "todo";
    const rightLineState = isLast ? "hidden" : index < current ? "done" : "todo";

    if (isTracker && direction === "horizontal") {
      indicator.appendChild(makeLine(leftLineState));
    }

    const dot = document.createElement("span");
    dot.dataset.slot = "dot";
    if (state) dot.dataset.state = state;
    if (status) dot.dataset.status = status;
    dot.className = TL_DOT_CLASS;
    dot.setAttribute("aria-hidden", "true");
    if (isTracker) {
      if (state === "done") dot.appendChild(createCheckIcon());
      else dot.textContent = String(index + 1);
    } else if (status === "completed") {
      dot.appendChild(createCheckIcon());
    }
    indicator.appendChild(dot);

    if (isTracker && direction === "horizontal") {
      indicator.appendChild(makeLine(rightLineState));
    } else if (direction === "vertical" && !isLast) {
      indicator.appendChild(makeLine(isTracker ? rightLineState : undefined));
    }
    li.appendChild(indicator);

    const body = document.createElement("div");
    body.dataset.slot = "body";
    body.className = TL_BODY_CLASS;

    if (item.date !== undefined && item.date !== "") {
      const date = document.createElement("span");
      date.dataset.slot = "date";
      date.className = TL_DATE_CLASS;
      date.textContent = item.date;
      body.appendChild(date);
    }

    const title = document.createElement("span");
    title.dataset.slot = "title";
    if (state) title.dataset.state = state;
    title.className = TL_TITLE_CLASS;
    title.textContent = item.title;
    if (item.statusLabel !== undefined && item.statusLabel !== "") {
      const badge = document.createElement("span");
      badge.dataset.slot = "badge";
      if (status) badge.dataset.status = status;
      badge.className = TL_BADGE_CLASS;
      badge.textContent = item.statusLabel;
      title.appendChild(badge);
    }
    body.appendChild(title);

    if (item.description !== undefined && item.description !== "") {
      const desc = document.createElement("p");
      desc.dataset.slot = "description";
      desc.className = TL_DESC_CLASS;
      desc.textContent = item.description;
      body.appendChild(desc);
    }

    li.appendChild(body);
    return li;
  }

  private _items(): TimelineItem[] {
    const raw = this.getAttribute("items");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((it) => it && typeof (it as { title?: unknown }).title === "string")
        .map((it, index) => {
          const o = it as Record<string, unknown>;
          return {
            key: String(o.key ?? index),
            title: String(o.title),
            date: o.date === undefined ? undefined : String(o.date),
            description: o.description === undefined ? undefined : String(o.description),
            status: o.status === undefined ? undefined : (String(o.status) as TimelineStatus),
            statusLabel: o.statusLabel === undefined ? undefined : String(o.statusLabel),
          };
        });
    } catch {
      return [];
    }
  }

  private _normalized<T extends string>(name: string, allowed: readonly T[], fallback: T): T {
    const value = this.getAttribute(name) ?? fallback;
    return (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
  }

  private _intAttr(name: string, defaultValue: number): number {
    const value = Number(this.getAttribute(name));
    return Number.isFinite(value) ? Math.floor(value) : defaultValue;
  }
}

function trackerState(idx: number, current: number): "done" | "current" | "todo" {
  if (idx < current) return "done";
  if (idx === current) return "current";
  return "todo";
}

function makeLine(state?: string): HTMLSpanElement {
  const line = document.createElement("span");
  line.className = TL_LINE_CLASS;
  if (state) line.dataset.state = state;
  line.setAttribute("aria-hidden", "true");
  return line;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function createCheckIcon(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 10 10");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M2 5L4 7L8 3");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);
  return svg;
}

define(NdsTimeline);
