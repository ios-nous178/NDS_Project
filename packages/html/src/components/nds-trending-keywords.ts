/**
 * <nds-trending-keywords> — DS TrendingKeywords 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-trending-keywords
 *     header-title="인기 검색어"
 *     timestamp="09:00 기준"
 *     autoplay-delay="2000"
 *     items='[
 *       {"rank":1,"trend":"up","keyword":"우울감"},
 *       {"rank":2,"trend":"new","keyword":"수면장애"},
 *       {"rank":3,"trend":"same","keyword":"불안"}
 *     ]'
 *   ></nds-trending-keywords>
 *
 * 이벤트:
 *   nds-trending-keyword-click (detail: { rank, keyword, trend })
 *
 * 속성:
 *   items: JSON 배열 ({ rank, trend, keyword })
 *   header-title (default "인기 검색어")
 *   timestamp
 *   autoplay-delay (ms, default 2000)
 */

import { NdsElement, define } from "../base/nds-element.js";

const TK_CLASS = "nds-trending-keywords";
const TK_SLIDER_CLASS = `${TK_CLASS}__slider`;
const TK_SLIDE_ITEM_CLASS = `${TK_CLASS}__slide-item`;
const TK_RANK_CLASS = `${TK_CLASS}__rank`;
const TK_TREND_CLASS = `${TK_CLASS}__trend`;
const TK_KEYWORD_CLASS = `${TK_CLASS}__keyword`;
const TK_CHEVRON_CLASS = `${TK_CLASS}__chevron`;
const TK_DROPDOWN_CLASS = `${TK_CLASS}__dropdown`;
const TK_DROPDOWN_HEADER_CLASS = `${TK_CLASS}__dropdown-header`;
const TK_DROPDOWN_TITLE_CLASS = `${TK_CLASS}__dropdown-title`;
const TK_DROPDOWN_TIME_CLASS = `${TK_CLASS}__dropdown-time`;
const TK_DROPDOWN_CLOSE_CLASS = `${TK_CLASS}__dropdown-close`;
const TK_DROPDOWN_LIST_CLASS = `${TK_CLASS}__dropdown-list`;
const TK_DROPDOWN_ITEM_CLASS = `${TK_CLASS}__dropdown-item`;

export type TrendingTrend = "new" | "up" | "down" | "same";

interface KeywordItem {
  rank: number;
  trend: TrendingTrend;
  keyword: string;
}

const trendIcon = (trend: TrendingTrend) => {
  const wrap = document.createElement("span");
  if (trend === "new") {
    wrap.textContent = "NEW";
    wrap.style.fontSize = "10px";
    wrap.style.fontWeight = "700";
    return wrap;
  }
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  if (trend === "up") {
    svg.setAttribute("width", "10");
    svg.setAttribute("height", "8");
    svg.setAttribute("viewBox", "0 0 10 8");
    svg.setAttribute("fill", "currentColor");
    svg.innerHTML = `<path d="M5 0L10 8H0L5 0Z"/>`;
  } else if (trend === "down") {
    svg.setAttribute("width", "10");
    svg.setAttribute("height", "8");
    svg.setAttribute("viewBox", "0 0 10 8");
    svg.setAttribute("fill", "currentColor");
    svg.innerHTML = `<path d="M5 8L0 0H10L5 8Z"/>`;
  } else {
    svg.setAttribute("width", "10");
    svg.setAttribute("height", "2");
    svg.setAttribute("viewBox", "0 0 10 2");
    svg.setAttribute("fill", "currentColor");
    svg.innerHTML = `<rect width="10" height="2" rx="1"/>`;
  }
  wrap.appendChild(svg);
  return wrap;
};

const ChevronDown = (close = false) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", close ? "20" : "16");
  svg.setAttribute("height", close ? "20" : "16");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.innerHTML = close
    ? `<polyline points="18 15 12 9 6 15"/>`
    : `<polyline points="6 9 12 15 18 9"/>`;
  return svg;
};

export class NdsTrendingKeywords extends NdsElement {
  static elementName = "nds-trending-keywords";

  static get observedAttributes(): readonly string[] {
    return ["items", "header-title", "timestamp", "autoplay-delay"];
  }

  private _root: HTMLDivElement | null = null;
  private _activeIndex = 0;
  private _open = false;
  private _timer: ReturnType<typeof setInterval> | null = null;

  private _onDocClick = (e: MouseEvent) => {
    if (!this._open) return;
    if (this._root && !this._root.contains(e.target as Node)) {
      this._open = false;
      this.scheduleUpdate();
    }
  };

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
    document.addEventListener("mousedown", this._onDocClick);
  }

  override disconnectedCallback(): void {
    document.removeEventListener("mousedown", this._onDocClick);
    if (this._timer) clearInterval(this._timer);
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = TK_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  private _parseItems(): KeywordItem[] {
    const raw = this.getAttribute("items");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((i) => i && typeof i.rank === "number" && typeof i.keyword === "string")
        .map((i) => ({
          rank: i.rank,
          trend: ["new", "up", "down", "same"].includes(i.trend)
            ? (i.trend as TrendingTrend)
            : "same",
          keyword: String(i.keyword),
        }));
    } catch {
      return [];
    }
  }

  private _restartTimer(items: KeywordItem[]): void {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    if (this._open || items.length <= 1) return;
    const delay = parseInt(this.attr("autoplay-delay", "2000"), 10) || 2000;
    this._timer = setInterval(() => {
      this._activeIndex = (this._activeIndex + 1) % items.length;
      this.scheduleUpdate();
    }, delay);
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const items = this._parseItems();
    const title = this.getAttribute("header-title") || "인기 검색어";
    const timestamp = this.getAttribute("timestamp");

    this._restartTimer(items);

    this._root.innerHTML = "";

    if (items.length === 0) {
      this._root.style.display = "none";
      return;
    }
    this._root.style.removeProperty("display");

    const current = items[this._activeIndex % items.length];

    const slider = document.createElement("div");
    slider.className = TK_SLIDER_CLASS;
    slider.addEventListener("click", () => {
      this._open = true;
      this.scheduleUpdate();
    });

    const slideItem = document.createElement("div");
    slideItem.className = TK_SLIDE_ITEM_CLASS;

    const rankSpan = document.createElement("span");
    rankSpan.className = TK_RANK_CLASS;
    rankSpan.textContent = String(current.rank);

    const trendSpan = document.createElement("span");
    trendSpan.className = TK_TREND_CLASS;
    trendSpan.dataset.trend = current.trend;
    trendSpan.appendChild(trendIcon(current.trend));

    const keywordSpan = document.createElement("span");
    keywordSpan.className = TK_KEYWORD_CLASS;
    keywordSpan.textContent = current.keyword;

    slideItem.append(rankSpan, trendSpan, keywordSpan);

    const chevron = document.createElement("span");
    chevron.className = TK_CHEVRON_CLASS;
    chevron.dataset.open = String(this._open);
    chevron.appendChild(ChevronDown());

    slider.append(slideItem, chevron);
    this._root.appendChild(slider);

    const dropdown = document.createElement("div");
    dropdown.className = TK_DROPDOWN_CLASS;
    dropdown.dataset.open = String(this._open);

    const dHeader = document.createElement("div");
    dHeader.className = TK_DROPDOWN_HEADER_CLASS;
    dHeader.addEventListener("click", () => {
      this._open = false;
      this.scheduleUpdate();
    });

    const dHeaderLeft = document.createElement("div");
    dHeaderLeft.style.display = "flex";
    dHeaderLeft.style.alignItems = "center";

    const dTitle = document.createElement("span");
    dTitle.className = TK_DROPDOWN_TITLE_CLASS;
    dTitle.textContent = title;
    dHeaderLeft.appendChild(dTitle);

    if (timestamp) {
      const dTime = document.createElement("span");
      dTime.className = TK_DROPDOWN_TIME_CLASS;
      dTime.textContent = timestamp;
      dHeaderLeft.appendChild(dTime);
    }

    const dClose = document.createElement("button");
    dClose.type = "button";
    dClose.className = TK_DROPDOWN_CLOSE_CLASS;
    dClose.setAttribute("aria-label", "닫기");
    dClose.appendChild(ChevronDown(true));

    dHeader.append(dHeaderLeft, dClose);
    dropdown.appendChild(dHeader);

    const dList = document.createElement("div");
    dList.className = TK_DROPDOWN_LIST_CLASS;
    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = TK_DROPDOWN_ITEM_CLASS;
      row.setAttribute("role", "button");
      row.tabIndex = 0;
      row.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("nds-trending-keyword-click", {
            detail: { rank: item.rank, keyword: item.keyword, trend: item.trend },
            bubbles: true,
            composed: true,
          }),
        );
      });
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          row.click();
        }
      });

      const r = document.createElement("span");
      r.className = TK_RANK_CLASS;
      r.textContent = String(item.rank);

      const t = document.createElement("span");
      t.className = TK_TREND_CLASS;
      t.dataset.trend = item.trend;
      t.appendChild(trendIcon(item.trend));

      const k = document.createElement("span");
      k.className = TK_KEYWORD_CLASS;
      k.textContent = item.keyword;

      row.append(r, t, k);
      dList.appendChild(row);
    });
    dropdown.appendChild(dList);

    this._root.appendChild(dropdown);
  }
}

define(NdsTrendingKeywords);
