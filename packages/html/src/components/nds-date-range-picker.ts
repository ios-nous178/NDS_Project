/**
 * <nds-date-range-picker> — DS DateRangePicker 의 vanilla Web Component 버전.
 *
 * 이벤트:
 *   nds-date-range-change (detail: { from, to }) -> 기간 선택
 *   nds-date-range-preset (detail: { key }) -> 프리셋 선택
 *   nds-date-range-clear -> 기간 지우기
 */

import { NdsElement, define } from "../base/nds-element.js";

const DR_CLASS = "nds-date-range";
const DR_ROOT_CLASS = `${DR_CLASS}__root`;
const DR_TRIGGER_CLASS = `${DR_CLASS}__trigger`;
const DR_TRIGGER_TEXT_CLASS = `${DR_CLASS}__trigger-text`;
const DR_ICON_CLASS = `${DR_CLASS}__icon`;
const DR_CLEAR_BTN_CLASS = `${DR_CLASS}__clear-btn`;
const DR_PANEL_CLASS = `${DR_CLASS}__panel`;
const DR_HEADER_CLASS = `${DR_CLASS}__header`;
const DR_TITLE_CLASS = `${DR_CLASS}__title`;
const DR_NAV_BTN_CLASS = `${DR_CLASS}__nav-btn`;
const DR_BODY_CLASS = `${DR_CLASS}__body`;
const DR_MONTH_CLASS = `${DR_CLASS}__month`;
const DR_DOW_CLASS = `${DR_CLASS}__dow`;
const DR_DOW_CELL_CLASS = `${DR_CLASS}__dow-cell`;
const DR_GRID_CLASS = `${DR_CLASS}__grid`;
const DR_DAY_CLASS = `${DR_CLASS}__day`;
const DR_HINT_CLASS = `${DR_CLASS}__hint`;
const DR_PRESETS_CLASS = `${DR_CLASS}__presets`;
const DR_PRESET_CLASS = `${DR_CLASS}__preset`;

const DAYS_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"];

const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const toIso = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const parseIso = (s: string | null): Date | null => {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
};
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
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
const formatYM = (year: number, month: number) => `${year}년 ${month + 1}월`;
const normalizeIsoRange = (from: string | null, to: string | null) =>
  from && to && from > to ? { from: to, to: from } : { from, to };

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

interface Preset {
  key: string;
  label: string;
  from: string;
  to: string;
}

export class NdsDateRangePicker extends NdsElement {
  static elementName = "nds-date-range-picker";

  static get observedAttributes(): readonly string[] {
    return [
      "from",
      "to",
      "min-date",
      "max-date",
      "start-label",
      "end-label",
      "placeholder",
      "presets",
      "disabled",
      "error",
      "status",
      "allow-clear",
      "disabled-dates",
      "open",
      "default-open",
      "portal-container",
      "full-width",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _trigger: HTMLButtonElement | null = null;
  private _triggerText: HTMLSpanElement | null = null;
  private _clearBtn: HTMLButtonElement | null = null;
  private _panel: HTMLDivElement | null = null;
  private _open = false;
  private _defaultOpenConsumed = false;
  private _selecting: "from" | "to" = "from";
  private _viewYear = 0;
  private _viewMonth = 0;
  private _hoverIso: string | null = null;
  private _repositionBound = false;
  private _onReposition = () => this._positionPanel();

  private _onDocClick = (e: MouseEvent) => {
    if (!this._open || !this._root) return;
    const target = e.target as Node;
    if (this._root.contains(target)) return;
    // panel 은 document.body 로 portal 되어 _root 밖에 있으므로 별도 검사 — 안 하면 달력 클릭이 외부클릭으로 닫힘.
    if (this._panel && this._panel.contains(target)) return;
    this._setOpen(false);
    this.scheduleUpdate();
  };

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
    this._repositionBound = false;
    // portal 된 panel 정리 (열린 채 disconnect 되는 경우).
    if (this._panel) this._panel.remove();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = DR_ROOT_CLASS;
    root.style.position = "relative";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.dataset.slot = "trigger";
    trigger.className = DR_TRIGGER_CLASS;
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.addEventListener("click", () => {
      if (this.boolAttr("disabled")) return;
      this._setOpen(!this._open);
      if (this._open) this._syncViewToValue();
      this.scheduleUpdate();
    });

    const triggerText = document.createElement("span");
    triggerText.dataset.slot = "trigger-text";
    triggerText.className = DR_TRIGGER_TEXT_CLASS;

    const iconWrap = document.createElement("span");
    iconWrap.setAttribute("aria-hidden", "true");
    iconWrap.className = DR_ICON_CLASS;

    trigger.append(triggerText, iconWrap);
    root.appendChild(trigger);

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = DR_CLEAR_BTN_CLASS;
    clearBtn.setAttribute("aria-label", "기간 지우기");
    clearBtn.textContent = "×";
    clearBtn.hidden = true;
    clearBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.removeAttribute("from");
      this.removeAttribute("to");
      this._setOpen(false);
      this.dispatchEvent(
        new CustomEvent("nds-date-range-clear", {
          detail: { from: null, to: null },
          bubbles: true,
          composed: true,
        }),
      );
      this._dispatch();
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
      new CustomEvent("nds-date-range-open-change", {
        detail: { open },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _syncViewToValue(): void {
    const from = parseIso(this.getAttribute("from"));
    const anchor = from || new Date();
    this._viewYear = anchor.getFullYear();
    this._viewMonth = anchor.getMonth();
    this._selecting = this.getAttribute("from") && !this.getAttribute("to") ? "to" : "from";
  }

  /** portal-container(셀렉터) 가 가리키는 요소, 없으면 document.body. React DateRangePicker.portalContainer 와 동일 의도. */
  private _portalTarget(): HTMLElement {
    const sel = this.getAttribute("portal-container");
    if (sel) {
      const el = document.querySelector(sel);
      if (el instanceof HTMLElement) return el;
    }
    return document.body;
  }

  /**
   * trigger 기준으로 panel 의 fixed 좌표를 계산한다 (nds-select._positionDropdown 과 동일 전략).
   * 오른쪽으로 넘치면 왼쪽으로 당기고, 아래 공간이 부족하면 위로 띄운다.
   */
  private _positionPanel(): void {
    if (!this._panel || !this._trigger || !this._open) return;
    const rect = this._trigger.getBoundingClientRect();
    const gap = 4;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const panelW = this._panel.offsetWidth || 624;
    const panelH = this._panel.offsetHeight || 320;
    let left = rect.left;
    if (left + panelW > vw - 8) left = Math.max(8, vw - panelW - 8);
    const spaceBelow = vh - rect.bottom;
    const placeAbove = spaceBelow < panelH + gap && rect.top > spaceBelow;
    this._panel.style.left = `${left}px`;
    if (placeAbove) {
      this._panel.style.top = "";
      this._panel.style.bottom = `${vh - rect.top + gap}px`;
    } else {
      this._panel.style.bottom = "";
      this._panel.style.top = `${rect.bottom + gap}px`;
    }
  }

  private _dispatch(): void {
    const normalized = normalizeIsoRange(this.getAttribute("from"), this.getAttribute("to"));
    if (normalized.from) this.setAttribute("from", normalized.from);
    if (normalized.to) this.setAttribute("to", normalized.to);
    this.dispatchEvent(
      new CustomEvent("nds-date-range-change", {
        detail: {
          from: this.getAttribute("from"),
          to: this.getAttribute("to"),
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _parsePresets(): Preset[] {
    const raw = this.getAttribute("presets");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(
          (p) =>
            p &&
            typeof p.key === "string" &&
            typeof p.label === "string" &&
            typeof p.from === "string" &&
            typeof p.to === "string",
        )
        .map((p) => ({
          key: String(p.key),
          label: String(p.label),
          from: String(p.from),
          to: String(p.to),
        }));
    } catch {
      return [];
    }
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

  private _selectDate(iso: string): void {
    const from = this.getAttribute("from");
    const to = this.getAttribute("to");
    if (this._selecting === "from" || !from || to) {
      this.setAttribute("from", iso);
      this.removeAttribute("to");
      this._selecting = "to";
      this._dispatch();
      this.scheduleUpdate();
      return;
    }
    const next = normalizeIsoRange(from, iso);
    if (next.from) this.setAttribute("from", next.from);
    if (next.to) this.setAttribute("to", next.to);
    this._setOpen(false);
    this._dispatch();
    this.scheduleUpdate();
    this._trigger?.focus();
  }

  private _renderPanel(): void {
    if (!this._root) return;
    if (this._panel) {
      this._panel.remove();
      this._panel = null;
    }
    if (!this._open) return;
    // 값/default-open/attribute 로 열렸는데 view 가 미초기화(0년→1900)면 동기화.
    // trigger 클릭 경로는 이미 _syncViewToValue 를 호출하므로 여기 안 걸린다.
    if (this._viewYear === 0) this._syncViewToValue();

    const panel = document.createElement("div");
    panel.setAttribute("role", "dialog");
    panel.dataset.slot = "panel";
    panel.className = DR_PANEL_CLASS;
    // panel 은 document.body 로 portal 된다 (CSS 가 이미 position:fixed). 좌표는 _positionPanel 이 계산.
    // absolute + _root 자식이면 overflow:hidden 조상(아코디언/모달 본문)에 잘린다 — React/nds-select 와 동일하게 portal.
    panel.style.position = "fixed";
    panel.style.zIndex = "1000";

    const minDate = parseIso(this.getAttribute("min-date"));
    const maxDate = parseIso(this.getAttribute("max-date"));
    const minIso = minDate ? toIso(minDate) : null;
    const maxIso = maxDate ? toIso(maxDate) : null;
    const disabledDates = this._disabledDateSet();
    const from = this.getAttribute("from");
    const to = this.getAttribute("to");
    const startLabel = this.getAttribute("start-label") || "시작";
    const endLabel = this.getAttribute("end-label") || "종료";
    const todayIso = toIso(new Date());

    const header = document.createElement("div");
    header.dataset.slot = "header";
    header.className = DR_HEADER_CLASS;

    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = DR_NAV_BTN_CLASS;
    prev.setAttribute("aria-label", "이전 달");
    prev.appendChild(NavSvg("left"));
    prev.addEventListener("click", () => {
      const next = addMonths(new Date(this._viewYear, this._viewMonth, 1), -1);
      this._viewYear = next.getFullYear();
      this._viewMonth = next.getMonth();
      this._renderPanel();
    });

    const title = document.createElement("span");
    title.dataset.slot = "title";
    title.className = DR_TITLE_CLASS;
    title.textContent = `${this._selecting === "from" ? startLabel : endLabel} 날짜 선택`;

    const next = document.createElement("button");
    next.type = "button";
    next.className = DR_NAV_BTN_CLASS;
    next.setAttribute("aria-label", "다음 달");
    next.appendChild(NavSvg("right"));
    next.addEventListener("click", () => {
      const nextMonth = addMonths(new Date(this._viewYear, this._viewMonth, 1), 1);
      this._viewYear = nextMonth.getFullYear();
      this._viewMonth = nextMonth.getMonth();
      this._renderPanel();
    });

    header.append(prev, title, next);
    panel.appendChild(header);

    const presets = this._parsePresets();
    const body = document.createElement("div");
    body.dataset.slot = "body";
    body.dataset.hasPresets = presets.length > 0 ? "true" : "false";
    body.className = DR_BODY_CLASS;

    if (presets.length > 0) {
      const presetsWrap = document.createElement("div");
      presetsWrap.dataset.slot = "presets";
      presetsWrap.className = DR_PRESETS_CLASS;
      presets.forEach((p) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.dataset.slot = "preset";
        btn.dataset.active = from === p.from && to === p.to ? "true" : "false";
        btn.className = DR_PRESET_CLASS;
        btn.textContent = p.label;
        btn.disabled = this.boolAttr("disabled");
        btn.addEventListener("click", () => {
          this.setAttribute("from", p.from);
          this.setAttribute("to", p.to);
          this.dispatchEvent(
            new CustomEvent("nds-date-range-preset", {
              detail: { key: p.key },
              bubbles: true,
              composed: true,
            }),
          );
          this._setOpen(false);
          this._dispatch();
          this.scheduleUpdate();
        });
        presetsWrap.appendChild(btn);
      });
      body.appendChild(presetsWrap);
    }

    [0, 1].forEach((offset) => {
      const monthDate = addMonths(new Date(this._viewYear, this._viewMonth, 1), offset);
      const month = monthDate.getMonth();
      const year = monthDate.getFullYear();
      const monthWrap = document.createElement("div");
      monthWrap.dataset.slot = "month";
      monthWrap.className = DR_MONTH_CLASS;

      const monthTitle = document.createElement("div");
      monthTitle.className = DR_TITLE_CLASS;
      monthTitle.textContent = formatYM(year, month);
      monthWrap.appendChild(monthTitle);

      const dow = document.createElement("div");
      dow.dataset.slot = "dow";
      dow.className = DR_DOW_CLASS;
      DAYS_OF_WEEK.forEach((d, idx) => {
        const cell = document.createElement("span");
        cell.dataset.slot = "dow-cell";
        cell.dataset.day = String(idx);
        cell.className = DR_DOW_CELL_CLASS;
        cell.textContent = d;
        dow.appendChild(cell);
      });
      monthWrap.appendChild(dow);

      const gridEl = document.createElement("div");
      gridEl.dataset.slot = "grid";
      gridEl.setAttribute("role", "grid");
      gridEl.className = DR_GRID_CLASS;

      buildGrid(year, month).forEach((d) => {
        const iso = toIso(d);
        const inMonth = d.getMonth() === month;
        const disabledDay =
          (minIso && iso < minIso) || (maxIso && iso > maxIso) || disabledDates.has(iso)
            ? true
            : false;
        const selectedStart = !!from && iso === from;
        const selectedEnd = !!to && iso === to;
        const inRange = !!from && !!to && iso > from && iso < to;
        const previewRange =
          from && !to && this._hoverIso ? normalizeIsoRange(from, this._hoverIso) : null;
        const preview =
          !!previewRange?.from &&
          !!previewRange.to &&
          iso > previewRange.from &&
          iso <= previewRange.to;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("role", "gridcell");
        btn.dataset.slot = "day";
        btn.dataset.outside = inMonth ? "false" : "true";
        btn.dataset.rangeStart = selectedStart ? "true" : "false";
        btn.dataset.rangeEnd = selectedEnd ? "true" : "false";
        btn.dataset.inRange = inRange ? "true" : "false";
        btn.dataset.preview = preview ? "true" : "false";
        btn.dataset.today = iso === todayIso ? "true" : "false";
        btn.dataset.disabled = disabledDay ? "true" : "false";
        btn.dataset.day = String(d.getDay());
        btn.setAttribute("aria-selected", String(selectedStart || selectedEnd));
        btn.disabled = disabledDay;
        btn.className = DR_DAY_CLASS;
        btn.textContent = String(d.getDate());
        btn.addEventListener("mouseenter", () => {
          this._hoverIso = iso;
          this._renderPanel();
        });
        btn.addEventListener("click", () => {
          if (disabledDay) return;
          this._selectDate(iso);
        });
        gridEl.appendChild(btn);
      });
      gridEl.addEventListener("mouseleave", () => {
        this._hoverIso = null;
        this._renderPanel();
      });
      monthWrap.appendChild(gridEl);
      body.appendChild(monthWrap);
    });

    panel.appendChild(body);

    const hint = document.createElement("div");
    hint.dataset.slot = "hint";
    hint.className = DR_HINT_CLASS;
    hint.textContent =
      from && !to ? `${from}부터 종료 날짜를 선택` : "시작 날짜와 종료 날짜를 차례로 선택";
    panel.appendChild(hint);

    this._portalTarget().appendChild(panel);
    this._panel = panel;
    this._positionPanel();
  }

  protected update(): void {
    if (!this._root || !this._trigger || !this._triggerText || !this._clearBtn) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const from = this.getAttribute("from");
    const to = this.getAttribute("to");
    const disabled = this.boolAttr("disabled");
    const error = this.boolAttr("error");
    const status = error ? "error" : this.getAttribute("status") || "default";
    const fullWidth = this.boolAttr("full-width");
    const startLabel = this.getAttribute("start-label") || "시작";
    const endLabel = this.getAttribute("end-label") || "종료";
    const placeholder = this.getAttribute("placeholder") || `${startLabel} ~ ${endLabel}`;
    if (!this._defaultOpenConsumed && this.boolAttr("default-open")) {
      this._open = true;
      this._defaultOpenConsumed = true;
    } else {
      this._open = this.boolAttr("open");
    }

    this._root.dataset.fullwidth = fullWidth ? "true" : "false";
    this._root.style.setProperty("--nds-date-range-width", fullWidth ? "100%" : "auto");

    this._trigger.disabled = disabled;
    this._trigger.dataset.open = String(this._open);
    this._trigger.dataset.error = status === "error" ? "true" : "false";
    this._trigger.dataset.status = status;
    this._trigger.setAttribute("aria-expanded", String(this._open));

    const hasValue = !!from || !!to;
    this._triggerText.textContent =
      from && to ? `${from} ~ ${to}` : from ? `${from} ~` : placeholder;
    this._triggerText.dataset.placeholder = hasValue ? "false" : "true";
    const canClear = this.boolAttr("allow-clear") && hasValue && !disabled;
    this._clearBtn.hidden = !canClear;
    this._trigger.dataset.clearable = String(canClear);

    // portal 된 panel 은 trigger 가 스크롤/리사이즈로 움직이면 따라가야 한다 (capture: overflow 부모 스크롤까지).
    if (this._open && !this._repositionBound) {
      window.addEventListener("scroll", this._onReposition, true);
      window.addEventListener("resize", this._onReposition);
      this._repositionBound = true;
    } else if (!this._open && this._repositionBound) {
      window.removeEventListener("scroll", this._onReposition, true);
      window.removeEventListener("resize", this._onReposition);
      this._repositionBound = false;
    }

    this._renderPanel();
  }
}

define(NdsDateRangePicker);
