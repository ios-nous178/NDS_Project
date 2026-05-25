/**
 * <nds-appointment-card> — DS AppointmentCard 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-appointment-card
 *     date="2024-05-20"
 *     start-time="14:00"
 *     end-time="15:00"
 *     title="김상담 상담사"
 *     mode="video"
 *     status="confirmed"
 *     actions='[{"label": "예약 취소", "primary": false}, {"label": "상담실 입장", "primary": true}]'
 *   ></nds-appointment-card>
 *
 * 이벤트:
 *   click -> 카드 전체 클릭
 *   appointment-action (detail: { action, index }) -> 하단 버튼 클릭
 */

import { NdsElement, define } from "../base/nds-element.js";
import { createIconSvg, type VanillaIconName } from "@nudge-eap/icons/vanilla";

const AC_CLASS = "nds-appointment-card";
const AC_DATE_CLASS = `${AC_CLASS}__date`;
const AC_DATE_DAY_CLASS = `${AC_CLASS}__date-day`;
const AC_DATE_MONTH_CLASS = `${AC_CLASS}__date-month`;
const AC_DATE_WEEKDAY_CLASS = `${AC_CLASS}__date-weekday`;
const AC_BODY_CLASS = `${AC_CLASS}__body`;
const AC_TITLE_CLASS = `${AC_CLASS}__title`;
const AC_META_CLASS = `${AC_CLASS}__meta`;
const AC_META_ROW_CLASS = `${AC_CLASS}__meta-row`;
const AC_FOOTER_CLASS = `${AC_CLASS}__footer`;
const AC_STATUS_CLASS = `${AC_CLASS}__status`;
const AC_ACTIONS_CLASS = `${AC_CLASS}__actions`;
const AC_ACTION_CLASS = `${AC_CLASS}__action`;

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in-progress"
  | "completed"
  | "canceled";

export type AppointmentMode = "video" | "phone" | "chat" | "in-person";

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  scheduled: "예약됨",
  confirmed: "확정",
  "in-progress": "진행 중",
  completed: "완료",
  canceled: "취소됨",
};

const STATUS_COLORS: Record<AppointmentStatus, { bg: string; fg: string }> = {
  scheduled: {
    bg: "var(--semantic-bg-status-info)",
    fg: "var(--semantic-text-status-info)",
  },
  confirmed: {
    bg: "var(--semantic-bg-status-success)",
    fg: "var(--semantic-text-status-success)",
  },
  "in-progress": {
    bg: "var(--semantic-bg-status-caution)",
    fg: "var(--semantic-text-status-caution)",
  },
  completed: {
    bg: "var(--semantic-bg-section-default)",
    fg: "var(--semantic-text-subtle-default)",
  },
  canceled: {
    bg: "var(--semantic-bg-status-error)",
    fg: "var(--semantic-text-status-error)",
  },
};

const MODE_LABEL: Record<AppointmentMode, string> = {
  video: "화상 상담",
  phone: "전화 상담",
  chat: "채팅 상담",
  "in-person": "방문 상담",
};

const MODE_ICONS: Record<AppointmentMode, VanillaIconName> = {
  video: "VideocameraIcon",
  phone: "TelephoneIcon",
  chat: "CounselingChatIcon",
  "in-person": "PinIcon",
};

const KO_WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export class NdsAppointmentCard extends NdsElement {
  static elementName = "nds-appointment-card";

  static get observedAttributes(): readonly string[] {
    return ["date", "start-time", "end-time", "title", "mode", "location", "status", "actions"];
  }

  private _root: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = AC_CLASS;

    // Add click listener for the card
    root.addEventListener("click", (e) => {
      // Don't trigger if a button was clicked
      if ((e.target as HTMLElement).closest(`.${AC_ACTIONS_CLASS}`)) return;
      this.dispatchEvent(new CustomEvent("click", { bubbles: true, composed: true }));
    });

    root.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        if ((e.target as HTMLElement).closest(`.${AC_ACTIONS_CLASS}`)) return;
        e.preventDefault();
        this.dispatchEvent(new CustomEvent("click", { bubbles: true, composed: true }));
      }
    });

    this.appendChild(root);
    this._root = root;
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const date = this.attr("date", "");
    const startTime = this.attr("start-time", "");
    const endTime = this.getAttribute("end-time");
    const title = this.attr("title", "");
    const mode = this.getAttribute("mode") as AppointmentMode | null;
    const location = this.getAttribute("location");
    const status = (this.getAttribute("status") as AppointmentStatus) || "scheduled";
    const actionsAttr = this.getAttribute("actions");

    let actions: Array<{ label: string; primary?: boolean }> = [];
    if (actionsAttr) {
      try {
        actions = JSON.parse(actionsAttr);
      } catch (e) {
        console.error("[nds-appointment-card] Failed to parse actions JSON", e);
      }
    }

    const d = new Date(`${date}T${startTime}:00`);
    const day = isNaN(d.getTime()) ? "--" : String(d.getDate()).padStart(2, "0");
    const monthShort = isNaN(d.getTime()) ? "---" : d.toLocaleString("en-US", { month: "short" });
    const weekday = isNaN(d.getTime()) ? "-" : KO_WEEKDAYS[d.getDay()];

    const statusColor = STATUS_COLORS[status];
    this._root.style.setProperty("--nds-appt-status-bg", statusColor.bg);
    this._root.style.setProperty("--nds-appt-status-fg", statusColor.fg);
    this._root.dataset.status = status;

    // Date sidebar
    const dateDiv = document.createElement("div");
    dateDiv.className = AC_DATE_CLASS;
    dateDiv.setAttribute("aria-hidden", "true");

    const monthSpan = document.createElement("span");
    monthSpan.className = AC_DATE_MONTH_CLASS;
    monthSpan.textContent = monthShort;

    const daySpan = document.createElement("span");
    daySpan.className = AC_DATE_DAY_CLASS;
    daySpan.textContent = day;

    const weekdaySpan = document.createElement("span");
    weekdaySpan.className = AC_DATE_WEEKDAY_CLASS;
    weekdaySpan.textContent = weekday;

    dateDiv.append(monthSpan, daySpan, weekdaySpan);

    // Body
    const bodyDiv = document.createElement("div");
    bodyDiv.className = AC_BODY_CLASS;

    const titleH3 = document.createElement("h3");
    titleH3.className = AC_TITLE_CLASS;
    titleH3.textContent = title;

    const metaDiv = document.createElement("div");
    metaDiv.className = AC_META_CLASS;

    // Time row
    const timeRow = document.createElement("div");
    timeRow.className = AC_META_ROW_CLASS;
    timeRow.appendChild(createIconSvg("TimeIcon", { size: 14, attrs: { "aria-hidden": "true" } }));
    const timeSpan = document.createElement("span");
    timeSpan.textContent = `${startTime}${endTime ? ` - ${endTime}` : ""}`;
    timeRow.appendChild(timeSpan);
    metaDiv.appendChild(timeRow);

    // Mode row
    if (mode && MODE_ICONS[mode]) {
      const modeRow = document.createElement("div");
      modeRow.className = AC_META_ROW_CLASS;
      modeRow.appendChild(
        createIconSvg(MODE_ICONS[mode], { size: 14, attrs: { "aria-hidden": "true" } }),
      );
      const modeSpan = document.createElement("span");
      modeSpan.textContent = MODE_LABEL[mode];
      modeRow.appendChild(modeSpan);
      metaDiv.appendChild(modeRow);
    }

    // Location row
    if (location) {
      const locRow = document.createElement("div");
      locRow.className = AC_META_ROW_CLASS;
      locRow.appendChild(createIconSvg("PinIcon", { size: 14, attrs: { "aria-hidden": "true" } }));
      const locSpan = document.createElement("span");
      locSpan.textContent = location;
      locRow.appendChild(locSpan);
      metaDiv.appendChild(locRow);
    }

    // Footer
    const footerDiv = document.createElement("div");
    footerDiv.className = AC_FOOTER_CLASS;

    const statusSpan = document.createElement("span");
    statusSpan.className = AC_STATUS_CLASS;
    statusSpan.textContent = STATUS_LABEL[status];
    footerDiv.appendChild(statusSpan);

    if (actions.length > 0) {
      const actionsDiv = document.createElement("div");
      actionsDiv.className = AC_ACTIONS_CLASS;
      actions.forEach((a, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = AC_ACTION_CLASS;
        btn.dataset.primary = a.primary ? "true" : "false";
        btn.textContent = a.label;
        btn.onclick = (e) => {
          e.stopPropagation();
          this.dispatchEvent(
            new CustomEvent("appointment-action", {
              detail: { action: a, index: i },
              bubbles: true,
              composed: true,
            }),
          );
        };
        actionsDiv.appendChild(btn);
      });
      footerDiv.appendChild(actionsDiv);
    }

    bodyDiv.append(titleH3, metaDiv, footerDiv);

    this._root.replaceChildren(dateDiv, bodyDiv);
  }
}

define(NdsAppointmentCard);
