/**
 * <nds-page-header> — DS PageHeader 의 vanilla Web Component 버전.
 *
 * 사용 예:
 *   <nds-page-header
 *     page-title="상담사 목록"
 *     subtitle="우리 회사 전용 12명"
 *     show-back
 *     bordered
 *   >
 *     <nds-breadcrumb slot="breadcrumb">…</nds-breadcrumb>
 *     <nds-button slot="actions">필터</nds-button>
 *     <nds-tabs slot="bottom">…</nds-tabs>
 *   </nds-page-header>
 *
 * 이벤트:
 *   nds-page-header-back -> 뒤로가기 버튼 클릭
 *
 * 속성:
 *   page-title: 제목
 *   subtitle: 부제
 *   show-back: 뒤로가기 버튼 노출
 *   bordered: 하단 보더
 */

import { NdsElement, define } from "../base/nds-element.js";

const PH_CLASS = "nds-page-header";
const PH_TOP_CLASS = `${PH_CLASS}__top`;
const PH_BREADCRUMB_CLASS = `${PH_CLASS}__breadcrumb`;
const PH_BACK_CLASS = `${PH_CLASS}__back`;
const PH_MAIN_CLASS = `${PH_CLASS}__main`;
const PH_TITLE_AREA_CLASS = `${PH_CLASS}__title-area`;
const PH_TITLE_CLASS = `${PH_CLASS}__title`;
const PH_SUBTITLE_CLASS = `${PH_CLASS}__subtitle`;
const PH_ACTIONS_CLASS = `${PH_CLASS}__actions`;
const PH_BOTTOM_CLASS = `${PH_CLASS}__tabs`;

const BackIcon = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = `<path d="M12 5l-5 5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  return svg;
};

export class NdsPageHeader extends NdsElement {
  static elementName = "nds-page-header";

  static get observedAttributes(): readonly string[] {
    return ["page-title", "subtitle", "show-back", "bordered"];
  }

  private _root: HTMLElement | null = null;
  private _topRow: HTMLDivElement | null = null;
  private _backBtn: HTMLButtonElement | null = null;
  private _breadcrumbWrap: HTMLDivElement | null = null;
  private _titleEl: HTMLHeadingElement | null = null;
  private _subtitleEl: HTMLParagraphElement | null = null;
  private _actionsWrap: HTMLDivElement | null = null;
  private _bottomWrap: HTMLDivElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    // Partition children: slot="breadcrumb" / slot="actions" / slot="bottom".
    const breadcrumbStash: Node[] = [];
    const actionsStash: Node[] = [];
    const bottomStash: Node[] = [];
    Array.from(this.childNodes).forEach((node) => {
      if (node instanceof HTMLElement) {
        const slot = node.getAttribute("slot");
        if (slot === "breadcrumb") breadcrumbStash.push(node);
        else if (slot === "actions") actionsStash.push(node);
        else if (slot === "bottom") bottomStash.push(node);
      }
      node.parentNode?.removeChild(node);
    });

    const root = document.createElement("header");
    root.dataset.slot = "root";
    root.className = PH_CLASS;

    const topRow = document.createElement("div");
    topRow.className = PH_TOP_CLASS;

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = PH_BACK_CLASS;
    backBtn.setAttribute("aria-label", "뒤로 가기");
    backBtn.appendChild(BackIcon());
    backBtn.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("nds-page-header-back", { bubbles: true, composed: true }),
      );
    });

    const breadcrumbWrap = document.createElement("div");
    breadcrumbWrap.className = PH_BREADCRUMB_CLASS;
    breadcrumbStash.forEach((n) => breadcrumbWrap.appendChild(n));

    topRow.append(backBtn, breadcrumbWrap);

    const main = document.createElement("div");
    main.className = PH_MAIN_CLASS;

    const titleArea = document.createElement("div");
    titleArea.className = PH_TITLE_AREA_CLASS;

    const titleEl = document.createElement("h1");
    titleEl.className = PH_TITLE_CLASS;

    const subtitleEl = document.createElement("p");
    subtitleEl.className = PH_SUBTITLE_CLASS;

    titleArea.append(titleEl, subtitleEl);

    const actionsWrap = document.createElement("div");
    actionsWrap.className = PH_ACTIONS_CLASS;
    actionsStash.forEach((n) => actionsWrap.appendChild(n));

    main.append(titleArea, actionsWrap);

    const bottomWrap = document.createElement("div");
    bottomWrap.className = PH_BOTTOM_CLASS;
    bottomStash.forEach((n) => bottomWrap.appendChild(n));

    root.append(topRow, main, bottomWrap);
    this.appendChild(root);

    this._root = root;
    this._topRow = topRow;
    this._backBtn = backBtn;
    this._breadcrumbWrap = breadcrumbWrap;
    this._titleEl = titleEl;
    this._subtitleEl = subtitleEl;
    this._actionsWrap = actionsWrap;
    this._bottomWrap = bottomWrap;
  }

  protected update(): void {
    if (
      !this._root ||
      !this._topRow ||
      !this._backBtn ||
      !this._breadcrumbWrap ||
      !this._titleEl ||
      !this._subtitleEl ||
      !this._actionsWrap ||
      !this._bottomWrap
    ) {
      return;
    }
    if (this.style.display !== "contents") this.style.display = "contents";

    const title = this.getAttribute("page-title") || "";
    const subtitle = this.getAttribute("subtitle");
    const showBack = this.boolAttr("show-back");
    const bordered = this.boolAttr("bordered");
    const hasBreadcrumb = this._breadcrumbWrap.childNodes.length > 0;
    const hasActions = this._actionsWrap.childNodes.length > 0;
    const hasBottom = this._bottomWrap.childNodes.length > 0;

    this._root.dataset.bordered = bordered ? "true" : "false";

    this._titleEl.textContent = title;
    if (subtitle) {
      this._subtitleEl.textContent = subtitle;
      this._subtitleEl.style.display = "";
    } else {
      this._subtitleEl.style.display = "none";
    }

    this._backBtn.style.display = showBack ? "" : "none";
    this._breadcrumbWrap.style.display = hasBreadcrumb ? "" : "none";
    this._topRow.style.display = showBack || hasBreadcrumb ? "" : "none";
    this._actionsWrap.style.display = hasActions ? "" : "none";
    this._bottomWrap.style.display = hasBottom ? "" : "none";
  }
}

define(NdsPageHeader);
