/**
 * <nds-activity-timeline> — DS ActivityTimeline 의 vanilla Web Component 버전.
 *
 * `nds-timeline` 과 동일한 DOM/CSS 를 만들지만, items 를 JSON 속성으로 받는
 * "flat" API. 자식 element 를 직접 쓰고 싶을 땐 <nds-timeline> 사용.
 *
 * 사용 예:
 *   <nds-activity-timeline
 *     items='[
 *       {"key":"1","date":"03.20","title":"상담 예약","status":"completed"},
 *       {"key":"2","date":"03.21","title":"심리 검사","status":"ongoing","statusLabel":"진행 중"},
 *       {"key":"3","date":"03.22","title":"리포트","status":"default","description":"결과지 발송"}
 *     ]'
 *   ></nds-activity-timeline>
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

export type ActivityTimelineStatus = "default" | "completed" | "ongoing" | "warning" | "error";

interface ActivityTimelineItem {
  key: string;
  date: string;
  title: string;
  description?: string;
  status?: ActivityTimelineStatus;
  statusLabel?: string;
}

const CheckMark = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 10 10");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M2 5L4 7L8 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  return svg;
};

export class NdsActivityTimeline extends NdsElement {
  static elementName = "nds-activity-timeline";

  static get observedAttributes(): readonly string[] {
    return ["items"];
  }

  private _root: HTMLDivElement | null = null;
  private _list: HTMLOListElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = TL_CLASS;

    const list = document.createElement("ol");
    list.dataset.slot = "list";
    list.className = TL_LIST_CLASS;

    root.appendChild(list);
    this.appendChild(root);
    this._root = root;
    this._list = list;
  }

  private _parseItems(): ActivityTimelineItem[] {
    const raw = this.getAttribute("items");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((it) => it && typeof it.key === "string")
        .map((it) => ({
          key: String(it.key),
          date: typeof it.date === "string" ? it.date : "",
          title: typeof it.title === "string" ? it.title : "",
          description: typeof it.description === "string" ? it.description : undefined,
          status: ["default", "completed", "ongoing", "warning", "error"].includes(it.status)
            ? (it.status as ActivityTimelineStatus)
            : "default",
          statusLabel: typeof it.statusLabel === "string" ? it.statusLabel : undefined,
        }));
    } catch {
      return [];
    }
  }

  protected update(): void {
    if (!this._list) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const items = this._parseItems();
    this._list.innerHTML = "";

    items.forEach((it, idx) => {
      const isLast = idx === items.length - 1;
      const status: ActivityTimelineStatus = it.status ?? "default";

      const li = document.createElement("li");
      li.dataset.slot = "item";
      li.className = TL_ITEM_CLASS;

      const rail = document.createElement("div");
      rail.dataset.slot = "rail";
      rail.className = TL_RAIL_CLASS;

      const dot = document.createElement("span");
      dot.dataset.slot = "dot";
      dot.dataset.status = status;
      dot.className = TL_DOT_CLASS;
      if (status === "completed") dot.appendChild(CheckMark());
      rail.appendChild(dot);

      if (!isLast) {
        const line = document.createElement("span");
        line.dataset.slot = "line";
        line.className = TL_LINE_CLASS;
        line.setAttribute("aria-hidden", "true");
        rail.appendChild(line);
      }

      const body = document.createElement("div");
      body.dataset.slot = "body";
      body.className = TL_BODY_CLASS;

      const dateSpan = document.createElement("span");
      dateSpan.dataset.slot = "date";
      dateSpan.className = TL_DATE_CLASS;
      dateSpan.textContent = it.date;

      const titleSpan = document.createElement("span");
      titleSpan.dataset.slot = "title";
      titleSpan.className = TL_TITLE_CLASS;
      titleSpan.textContent = it.title;

      if (it.statusLabel) {
        const badge = document.createElement("span");
        badge.dataset.slot = "badge";
        badge.dataset.status = status;
        badge.className = TL_BADGE_CLASS;
        badge.textContent = it.statusLabel;
        titleSpan.appendChild(badge);
      }

      body.append(dateSpan, titleSpan);

      if (it.description) {
        const desc = document.createElement("p");
        desc.dataset.slot = "description";
        desc.className = TL_DESC_CLASS;
        desc.textContent = it.description;
        body.appendChild(desc);
      }

      li.append(rail, body);
      this._list!.appendChild(li);
    });
  }
}

define(NdsActivityTimeline);
