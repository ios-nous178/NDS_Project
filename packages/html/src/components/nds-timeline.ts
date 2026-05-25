/**
 * <nds-timeline> + <nds-timeline-item> — DS ActivityTimeline 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-timeline>
 *     <nds-timeline-item
 *       date="2024.03.20"
 *       title="상담 예약 완료"
 *       description="선생님과의 첫 상담이 예약되었습니다."
 *       status="completed"
 *     ></nds-timeline-item>
 *     <nds-timeline-item
 *       date="2024.03.21"
 *       title="심리 검사 진행"
 *       status="ongoing"
 *       status-label="진행 중"
 *     ></nds-timeline-item>
 *   </nds-timeline>
 */

import { NdsElement, define } from "../base/nds-element.js";

const TL_CLASS = "nds-timeline";
const TL_LIST_CLASS = `${TL_CLASS}__list`;
const TL_ITEM_CLASS = `${TL_CLASS}__item`;
const TL_RAIL_CLASS = `${TL_CLASS}__rail`;
const TL_DOT_CLASS = `${TL_CLASS}__dot`;
const TL_LINE_CLASS = `${TL_CLASS}__line`;
const TL_BODY_CLASS = `${TL_CLASS}__body`;
const TL_DATE_CLASS = `${TL_CLASS}__date`;
const TL_TITLE_CLASS = `${TL_CLASS}__title`;
const TL_DESC_CLASS = `${TL_CLASS}__description`;
const TL_BADGE_CLASS = `${TL_CLASS}__badge`;

export type TimelineStatus = "default" | "completed" | "ongoing" | "warning" | "error";

const CheckMark = () => {
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
};

/* ──────────────── <nds-timeline> ──────────────── */

export class NdsTimeline extends NdsElement {
  static elementName = "nds-timeline";

  private _ol: HTMLOListElement | null = null;

  override connectedCallback(): void {
    if (!this._ol) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const ol = document.createElement("ol");
    ol.className = TL_LIST_CLASS;
    ol.dataset.slot = "list";
    while (this.firstChild) ol.appendChild(this.firstChild);
    this.appendChild(ol);
    this._ol = ol;
  }

  protected update(): void {
    if (!this._ol) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const items = this.querySelectorAll<NdsTimelineItem>("nds-timeline-item");
    items.forEach((item, index) => {
      const isLast = index === items.length - 1;
      item.applyParentState(isLast);
    });
  }
}

/* ──────────────── <nds-timeline-item> ──────────────── */

export class NdsTimelineItem extends NdsElement {
  static elementName = "nds-timeline-item";

  static get observedAttributes(): readonly string[] {
    return ["date", "title", "description", "status", "status-label"];
  }

  private _li: HTMLLIElement | null = null;
  private _dot: HTMLSpanElement | null = null;
  private _line: HTMLSpanElement | null = null;
  private _date: HTMLSpanElement | null = null;
  private _title: HTMLSpanElement | null = null;
  private _desc: HTMLParagraphElement | null = null;
  private _badge: HTMLSpanElement | null = null;

  private _isLast = false;

  override connectedCallback(): void {
    if (!this._li) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const li = document.createElement("li");
    li.className = TL_ITEM_CLASS;
    li.dataset.slot = "item";

    const rail = document.createElement("div");
    rail.className = TL_RAIL_CLASS;
    rail.dataset.slot = "rail";

    const dot = document.createElement("span");
    dot.className = TL_DOT_CLASS;
    dot.dataset.slot = "dot";

    // User can provide custom icon in light DOM
    while (this.firstChild) dot.appendChild(this.firstChild);

    rail.appendChild(dot);

    const line = document.createElement("span");
    line.className = TL_LINE_CLASS;
    line.dataset.slot = "line";
    line.setAttribute("aria-hidden", "true");
    rail.appendChild(line);

    const body = document.createElement("div");
    body.className = TL_BODY_CLASS;
    body.dataset.slot = "body";

    const date = document.createElement("span");
    date.className = TL_DATE_CLASS;
    date.dataset.slot = "date";
    body.appendChild(date);

    const title = document.createElement("span");
    title.className = TL_TITLE_CLASS;
    title.dataset.slot = "title";
    body.appendChild(title);

    const desc = document.createElement("p");
    desc.className = TL_DESC_CLASS;
    desc.dataset.slot = "description";
    body.appendChild(desc);

    li.appendChild(rail);
    li.appendChild(body);
    this.appendChild(li);

    this._li = li;
    this._dot = dot;
    this._line = line;
    this._date = date;
    this._title = title;
    this._desc = desc;
  }

  applyParentState(isLast: boolean): void {
    this._isLast = isLast;
    this.scheduleUpdate();
  }

  protected update(): void {
    if (!this._li) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const status = (this.getAttribute("status") as TimelineStatus) || "default";
    const dateText = this.getAttribute("date") || "";
    const titleText = this.getAttribute("title") || "";
    const descText = this.getAttribute("description") || "";
    const statusLabelText = this.getAttribute("status-label") || "";

    if (this._dot) {
      this._dot.dataset.status = status;
      // If dot is empty, add default checkmark if completed
      if (this._dot.childNodes.length === 0 && status === "completed") {
        this._dot.appendChild(CheckMark());
      }
    }

    if (this._line) {
      this._line.style.display = this._isLast ? "none" : "";
    }

    if (this._date) {
      this._date.textContent = dateText;
      this._date.style.display = dateText ? "" : "none";
    }

    if (this._title) {
      this._title.textContent = titleText;
      this._title.style.display = titleText ? "" : "none";

      if (statusLabelText) {
        if (!this._badge) {
          this._badge = document.createElement("span");
          this._badge.className = TL_BADGE_CLASS;
          this._badge.dataset.slot = "badge";
          this._title.appendChild(this._badge);
        }
        this._badge.textContent = statusLabelText;
        this._badge.dataset.status = status;
        this._badge.style.display = "";
      } else if (this._badge) {
        this._badge.style.display = "none";
      }
    }

    if (this._desc) {
      this._desc.textContent = descText;
      this._desc.style.display = descText ? "" : "none";
    }
  }
}

define(NdsTimeline);
define(NdsTimelineItem);
