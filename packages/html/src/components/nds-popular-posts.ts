/**
 * <nds-popular-posts> — DS PopularPosts 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-popular-posts
 *     module-title="커뮤니티 BEST 인기글"
 *     more-label="더보기"
 *     show-more
 *     tabs='[{"key":"all","label":"전체"},{"key":"depression","label":"우울"}]'
 *     active-tab="all"
 *     items='[
 *       {"id":"1","title":"오늘 정말 힘들었어요","count":35},
 *       {"id":"2","title":"운동이 정말 도움되네요","count":1234}
 *     ]'
 *   ></nds-popular-posts>
 *
 * 이벤트:
 *   nds-popular-more -> 더보기 클릭
 *   nds-popular-tab-change (detail: { key })
 *   nds-popular-item-click (detail: { id, rank })
 *
 * 속성:
 *   module-title (default "커뮤니티 BEST 인기글")
 *   more-label (default "더보기")
 *   show-more: 더보기 버튼 노출
 *   tabs: JSON 배열 ({ key, label })
 *   active-tab
 *   items: JSON 배열 ({ id, title, count })
 *   item-clickable: 행 클릭 가능
 */

import { NdsElement, define } from "../base/nds-element.js";

const PP_CLASS = "nds-popular-posts";
const PP_HEADER_CLASS = `${PP_CLASS}__header`;
const PP_TITLE_CLASS = `${PP_CLASS}__title`;
const PP_MORE_CLASS = `${PP_CLASS}__more`;
const PP_MORE_ICON_CLASS = `${PP_CLASS}__more-icon`;
const PP_TABS_CLASS = `${PP_CLASS}__tabs`;
const PP_TAB_CLASS = `${PP_CLASS}__tab`;
const PP_LIST_CLASS = `${PP_CLASS}__list`;
const PP_ROW_CLASS = `${PP_CLASS}__row`;
const PP_RANK_CLASS = `${PP_CLASS}__rank`;
const PP_ROW_TITLE_CLASS = `${PP_CLASS}__row-title`;
const PP_COUNT_CLASS = `${PP_CLASS}__count`;

interface Tab {
  key: string;
  label: string;
}

interface Item {
  id: string;
  title: string;
  count: number;
}

const formatRank = (rank: number) => rank.toString().padStart(2, "0");
const formatCount = (count: number) => (count > 999 ? "[+999]" : `[${count}]`);

const ChevronRight = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.5");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<polyline points="6 4 10 8 6 12"/>`;
  return svg;
};

export class NdsPopularPosts extends NdsElement {
  static elementName = "nds-popular-posts";

  static get observedAttributes(): readonly string[] {
    return [
      "module-title",
      "more-label",
      "show-more",
      "tabs",
      "active-tab",
      "items",
      "item-clickable",
    ];
  }

  private _root: HTMLElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("section");
    root.dataset.slot = "root";
    root.className = PP_CLASS;
    this.appendChild(root);
    this._root = root;
  }

  private _parseTabs(): Tab[] {
    const raw = this.getAttribute("tabs");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((t) => t && typeof t.key === "string")
        .map((t) => ({ key: String(t.key), label: typeof t.label === "string" ? t.label : "" }));
    } catch {
      return [];
    }
  }

  private _parseItems(): Item[] {
    const raw = this.getAttribute("items");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((i) => i && (typeof i.id === "string" || typeof i.id === "number"))
        .map((i) => ({
          id: String(i.id),
          title: typeof i.title === "string" ? i.title : "",
          count: typeof i.count === "number" ? i.count : 0,
        }));
    } catch {
      return [];
    }
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const title = this.getAttribute("module-title") || "커뮤니티 BEST 인기글";
    const moreLabel = this.getAttribute("more-label") || "더보기";
    const showMore = this.boolAttr("show-more");
    const tabs = this._parseTabs();
    const activeTab = this.getAttribute("active-tab");
    const items = this._parseItems();
    const itemClickable = this.boolAttr("item-clickable");

    this._root.innerHTML = "";

    const header = document.createElement("header");
    header.className = PP_HEADER_CLASS;

    const titleEl = document.createElement("h3");
    titleEl.className = PP_TITLE_CLASS;
    titleEl.textContent = title;
    header.appendChild(titleEl);

    if (showMore) {
      const moreBtn = document.createElement("button");
      moreBtn.type = "button";
      moreBtn.className = PP_MORE_CLASS;
      const span = document.createElement("span");
      span.textContent = moreLabel;
      const icon = document.createElement("span");
      icon.className = PP_MORE_ICON_CLASS;
      icon.setAttribute("aria-hidden", "true");
      icon.appendChild(ChevronRight());
      moreBtn.append(span, icon);
      moreBtn.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("nds-popular-more", { bubbles: true, composed: true }));
      });
      header.appendChild(moreBtn);
    }

    this._root.appendChild(header);

    if (tabs.length > 0) {
      const tabsWrap = document.createElement("div");
      tabsWrap.className = PP_TABS_CLASS;
      tabsWrap.setAttribute("role", "tablist");
      tabs.forEach((tab) => {
        const active = tab.key === activeTab;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("role", "tab");
        btn.setAttribute("aria-selected", String(active));
        btn.dataset.active = active ? "true" : "false";
        btn.className = PP_TAB_CLASS;
        btn.textContent = tab.label;
        btn.addEventListener("click", () => {
          this.setAttribute("active-tab", tab.key);
          this.dispatchEvent(
            new CustomEvent("nds-popular-tab-change", {
              detail: { key: tab.key },
              bubbles: true,
              composed: true,
            }),
          );
        });
        tabsWrap.appendChild(btn);
      });
      this._root.appendChild(tabsWrap);
    }

    const list = document.createElement("ol");
    list.className = PP_LIST_CLASS;
    items.forEach((item, idx) => {
      const rank = idx + 1;
      const li = document.createElement("li");

      const row = itemClickable ? document.createElement("button") : document.createElement("div");
      if (itemClickable) (row as HTMLButtonElement).type = "button";
      row.className = PP_ROW_CLASS;

      const rankSpan = document.createElement("span");
      rankSpan.className = PP_RANK_CLASS;
      rankSpan.textContent = formatRank(rank);

      const titleSpan = document.createElement("span");
      titleSpan.className = PP_ROW_TITLE_CLASS;
      titleSpan.textContent = item.title;

      const countSpan = document.createElement("span");
      countSpan.className = PP_COUNT_CLASS;
      countSpan.textContent = formatCount(item.count);

      row.append(rankSpan, titleSpan, countSpan);

      if (itemClickable) {
        row.addEventListener("click", () => {
          this.dispatchEvent(
            new CustomEvent("nds-popular-item-click", {
              detail: { id: item.id, rank },
              bubbles: true,
              composed: true,
            }),
          );
        });
      }

      li.appendChild(row);
      list.appendChild(li);
    });
    this._root.appendChild(list);
  }
}

define(NdsPopularPosts);
