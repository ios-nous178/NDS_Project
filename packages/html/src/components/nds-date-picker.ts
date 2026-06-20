/**
 * <nds-date-picker> — DS DatePicker 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-date-picker value="2026-05-25" placeholder="YYYY-MM-DD"></nds-date-picker>
 *
 *   <nds-date-picker value="2026-05-25" min-date="2026-01-01" max-date="2026-12-31"></nds-date-picker>
 *
 * 이벤트:
 *   nds-date-change (detail: { value }) -> 날짜 선택
 *
 * 속성:
 *   value: "YYYY-MM-DD" (선택값)
 *   min-date / max-date: "YYYY-MM-DD"
 *   placeholder (default "YYYY-MM-DD")
 *   disabled / error / full-width
 *
 * 패널은 document.body 로 portal + position:fixed(트리거 rect 기준) — Modal 등
 * overflow:hidden 컨테이너 안에서도 잘리지 않는다(nds-select 와 동일 전략).
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const DP_CLASS = "nds-date-picker";
const DP_ROOT_CLASS = `${DP_CLASS}__root`;
const DP_TRIGGER_CLASS = `${DP_CLASS}__trigger`;
const DP_TRIGGER_TEXT_CLASS = `${DP_CLASS}__trigger-text`;
const DP_ICON_CLASS = `${DP_CLASS}__icon`;
const DP_CLEAR_BTN_CLASS = `${DP_CLASS}__clear-btn`;
const DP_PANEL_CLASS = `${DP_CLASS}__panel`;
const DP_HEADER_CLASS = `${DP_CLASS}__header`;
const DP_NAV_BTN_CLASS = `${DP_CLASS}__nav-btn`;
const DP_TITLE_CLASS = `${DP_CLASS}__title`;
const DP_DOW_CLASS = `${DP_CLASS}__dow`;
const DP_DOW_CELL_CLASS = `${DP_CLASS}__dow-cell`;
const DP_GRID_CLASS = `${DP_CLASS}__grid`;
const DP_DAY_CLASS = `${DP_CLASS}__day`;

const DAYS_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"];

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toIso = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const parseIso = (s: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
};
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const buildGrid = (year: number, month: number): Date[] => {
  const first = new Date(year, month, 1);
  const start = first.getDay();
  const gridStart = new Date(year, month, 1 - start);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
};

const NavSvg = (dir: "left" | "right") => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("fill", "none");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML =
    dir === "left"
      ? `<path d="M10 4L6 8L10 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`
      : `<path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  return svg;
};

export class NdsDatePicker extends NdsElement {
  static elementName = "nds-date-picker";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-date-picker"].observedAttributes];
  }

  private _root: HTMLDivElement | null = null;
  private _trigger: HTMLButtonElement | null = null;
  private _triggerText: HTMLSpanElement | null = null;
  private _clearBtn: HTMLButtonElement | null = null;
  private _panel: HTMLDivElement | null = null;
  private _open = false;
  private _defaultOpenConsumed = false;
  private _viewYear = 0;
  private _viewMonth = 0;

  private _onDocClick = (e: MouseEvent) => {
    if (!this._open || !this._root) return;
    const target = e.target as Node;
    // 패널은 portal 되어 _root 밖(document.body)에 있으므로 패널 내부 클릭(이전/다음 달 등)도 무시.
    if (this._root.contains(target)) return;
    if (this._panel && this._panel.contains(target)) return;
    this._setOpen(false);
    this.scheduleUpdate();
  };
  private _onReposition = () => this._positionPanel();
  private _onEsc = (e: KeyboardEvent) => {
    if (this._open && e.key === "Escape") {
      e.preventDefault();
      this._setOpen(false);
      this._trigger?.focus();
      this.scheduleUpdate();
    }
  };

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
    document.addEventListener("mousedown", this._onDocClick);
    document.addEventListener("keydown", this._onEsc);
  }

  override disconnectedCallback(): void {
    document.removeEventListener("mousedown", this._onDocClick);
    document.removeEventListener("keydown", this._onEsc);
    window.removeEventListener("scroll", this._onReposition, true);
    window.removeEventListener("resize", this._onReposition);
    // portal 된 패널도 정리.
    if (this._panel && this._panel.parentElement === document.body) {
      this._panel.remove();
      this._panel = null;
    }
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = DP_ROOT_CLASS;
    root.style.position = "relative";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.dataset.slot = "trigger";
    trigger.className = DP_TRIGGER_CLASS;
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.addEventListener("click", () => {
      if (this.boolAttr("disabled")) return;
      this._setOpen(!this._open);
      if (this._open) {
        const val = parseIso(this.getAttribute("value") || "") || new Date();
        this._viewYear = val.getFullYear();
        this._viewMonth = val.getMonth();
      }
      this.scheduleUpdate();
    });

    const triggerText = document.createElement("span");
    triggerText.dataset.slot = "trigger-text";
    triggerText.className = DP_TRIGGER_TEXT_CLASS;

    // Calendar 글리프는 CSS mask 로 그린다 (packages/styles/src/DatePicker.ts 의 :empty 규칙).
    // 비어 있는 wrapper 를 두면 [data-project="..."] cascade 가 project 별 SVG 를 mask-image 로 swap 한다.
    const iconWrap = document.createElement("span");
    iconWrap.setAttribute("aria-hidden", "true");
    iconWrap.className = DP_ICON_CLASS;

    trigger.append(triggerText, iconWrap);
    root.appendChild(trigger);

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = DP_CLEAR_BTN_CLASS;
    clearBtn.setAttribute("aria-label", "날짜 지우기");
    clearBtn.textContent = "×";
    clearBtn.hidden = true;
    clearBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.removeAttribute("value");
      this._setOpen(false);
      this.dispatchEvent(
        new CustomEvent("nds-date-clear", {
          detail: { value: null },
          bubbles: true,
          composed: true,
        }),
      );
      this.scheduleUpdate();
      this._trigger?.focus();
    });
    root.appendChild(clearBtn);
    this.appendChild(root);

    this._root = root;
    this._trigger = trigger;
    this._triggerText = triggerText;
    this._clearBtn = clearBtn;
  }

  private _setOpen(open: boolean): void {
    if (this._open === open) return;
    this._open = open;
    if (open) this.setAttribute("open", "");
    else this.removeAttribute("open");
    this.dispatchEvent(
      new CustomEvent("nds-date-open-change", {
        detail: { open },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _disabledDateSet(): Set<string> {
    const raw = this.getAttribute("disabled-dates");
    if (!raw) return new Set();
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return new Set();
      return new Set(parsed.filter((v) => typeof v === "string"));
    } catch {
      return new Set(
        raw
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
      );
    }
  }

  private _renderPanel(): void {
    if (!this._root) return;
    // Remove existing panel
    if (this._panel) {
      this._panel.remove();
      this._panel = null;
    }
    if (!this._open) {
      window.removeEventListener("scroll", this._onReposition, true);
      window.removeEventListener("resize", this._onReposition);
      return;
    }

    const panel = document.createElement("div");
    panel.setAttribute("role", "dialog");
    panel.dataset.slot = "panel";
    panel.className = DP_PANEL_CLASS;
    // Modal 등 overflow:hidden 컨테이너에서 잘리지 않도록 body 로 portal + fixed.
    panel.style.position = "fixed";
    panel.style.zIndex = "1000";

    const value = parseIso(this.getAttribute("value") || "");
    const minDate = parseIso(this.getAttribute("min-date") || "");
    const maxDate = parseIso(this.getAttribute("max-date") || "");
    const disabledDates = this._disabledDateSet();
    const minDay = minDate ? startOfDay(minDate) : null;
    const maxDay = maxDate ? startOfDay(maxDate) : null;
    const today = startOfDay(new Date());
    const grid = buildGrid(this._viewYear, this._viewMonth);

    const header = document.createElement("div");
    header.dataset.slot = "header";
    header.className = DP_HEADER_CLASS;

    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = DP_NAV_BTN_CLASS;
    prev.setAttribute("aria-label", "이전 달");
    prev.appendChild(NavSvg("left"));
    prev.addEventListener("click", () => {
      this._viewMonth -= 1;
      if (this._viewMonth < 0) {
        this._viewMonth = 11;
        this._viewYear -= 1;
      }
      this._renderPanel();
    });

    const title = document.createElement("span");
    title.dataset.slot = "title";
    title.className = DP_TITLE_CLASS;
    title.textContent = `${this._viewYear}년 ${this._viewMonth + 1}월`;

    const next = document.createElement("button");
    next.type = "button";
    next.className = DP_NAV_BTN_CLASS;
    next.setAttribute("aria-label", "다음 달");
    next.appendChild(NavSvg("right"));
    next.addEventListener("click", () => {
      this._viewMonth += 1;
      if (this._viewMonth > 11) {
        this._viewMonth = 0;
        this._viewYear += 1;
      }
      this._renderPanel();
    });

    header.append(prev, title, next);
    panel.appendChild(header);

    const dow = document.createElement("div");
    dow.dataset.slot = "dow";
    dow.className = DP_DOW_CLASS;
    DAYS_OF_WEEK.forEach((d, idx) => {
      const cell = document.createElement("span");
      cell.dataset.slot = "dow-cell";
      cell.dataset.day = String(idx);
      cell.className = DP_DOW_CELL_CLASS;
      cell.textContent = d;
      dow.appendChild(cell);
    });
    panel.appendChild(dow);

    const gridEl = document.createElement("div");
    gridEl.dataset.slot = "grid";
    gridEl.setAttribute("role", "grid");
    gridEl.className = DP_GRID_CLASS;

    grid.forEach((d) => {
      const inMonth = d.getMonth() === this._viewMonth;
      const disabledDay =
        (minDay && d < minDay) || (maxDay && d > maxDay) || disabledDates.has(toIso(d))
          ? true
          : false;
      const selected = value ? sameDay(d, value) : false;
      const isToday = sameDay(d, today);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("role", "gridcell");
      btn.dataset.slot = "day";
      btn.dataset.outside = inMonth ? "false" : "true";
      btn.dataset.selected = selected ? "true" : "false";
      btn.dataset.today = isToday ? "true" : "false";
      btn.dataset.disabled = disabledDay ? "true" : "false";
      btn.dataset.day = String(d.getDay());
      btn.setAttribute("aria-selected", String(selected));
      btn.disabled = disabledDay;
      btn.className = DP_DAY_CLASS;
      btn.textContent = String(d.getDate());
      btn.addEventListener("click", () => {
        if (disabledDay) return;
        const iso = toIso(d);
        this.setAttribute("value", iso);
        this._setOpen(false);
        this.dispatchEvent(
          new CustomEvent("nds-date-change", {
            detail: { value: iso },
            bubbles: true,
            composed: true,
          }),
        );
        this.scheduleUpdate();
      });
      gridEl.appendChild(btn);
    });
    panel.appendChild(gridEl);

    document.body.appendChild(panel);
    this._panel = panel;
    this._positionPanel();
    // scroll/resize 시 트리거 위치가 바뀌므로 reposition. capture:true 로
    // overflow:auto 부모(모달 본문 스크롤 등)까지 잡는다. 동일 ref 라 중복 등록 안 됨.
    window.addEventListener("scroll", this._onReposition, true);
    window.addEventListener("resize", this._onReposition);
  }

  /**
   * 트리거 위치 기준으로 패널 fixed position 설정.
   * 화면 하단 공간이 부족하면 트리거 위로 띄운다(nds-select 와 동일 전략).
   */
  private _positionPanel(): void {
    if (!this._panel || !this._trigger || !this._open) return;
    const rect = this._trigger.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const panelH = this._panel.offsetHeight || 340;
    const gap = 4;
    const spaceBelow = viewportH - rect.bottom;
    const spaceAbove = rect.top;
    const placeAbove = spaceBelow < panelH + gap && spaceAbove > spaceBelow;

    this._panel.style.left = `${rect.left}px`;
    if (placeAbove) {
      this._panel.style.top = "";
      this._panel.style.bottom = `${viewportH - rect.top + gap}px`;
    } else {
      this._panel.style.bottom = "";
      this._panel.style.top = `${rect.bottom + gap}px`;
    }
  }

  protected update(): void {
    if (!this._root || !this._trigger || !this._triggerText || !this._clearBtn) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const value = this.getAttribute("value");
    const placeholder = this.getAttribute("placeholder") || "YYYY-MM-DD";
    const disabled = this.boolAttr("disabled");
    const error = this.boolAttr("error");
    const status = error ? "error" : this.getAttribute("status") || "default";
    const fullWidth = this.boolAttr("full-width");
    if (!this._defaultOpenConsumed && this.boolAttr("default-open")) {
      this._open = true;
      this._defaultOpenConsumed = true;
    } else {
      this._open = this.boolAttr("open");
    }

    this._root.dataset.fullwidth = fullWidth ? "true" : "false";
    this._root.style.setProperty("--nds-date-picker-width", fullWidth ? "100%" : "auto");

    this._trigger.disabled = disabled;
    this._trigger.dataset.open = String(this._open);
    this._trigger.dataset.error = status === "error" ? "true" : "false";
    this._trigger.dataset.status = status;
    this._trigger.setAttribute("aria-expanded", String(this._open));
    const canClear = this.boolAttr("allow-clear") && !!value && !disabled;
    this._clearBtn.hidden = !canClear;
    this._trigger.dataset.clearable = String(canClear);

    this._triggerText.textContent = value || placeholder;
    this._triggerText.dataset.placeholder = value ? "false" : "true";

    this._renderPanel();
  }
}

define(NdsDatePicker);
