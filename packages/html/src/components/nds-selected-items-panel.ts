/**
 * <nds-selected-items-panel> + <nds-region-row> — 캐포비 InputGuide(3828:1577) 슬롯 패널의
 * vanilla Web Component 버전. 헤더(타이틀 + 개수 + 추가/해제 액션) 고정, 본문은 자식 markup 슬롯.
 *
 * 사용 예:
 *   <nds-selected-items-panel panel-title="선택한 지역" count="48">
 *     <nds-region-row>강원특별자치도 &gt; 강릉시</nds-region-row>
 *     ...
 *   </nds-selected-items-panel>
 *
 * 속성 (panel):
 *   panel-title  : 타이틀 (HTML 표준 title 충돌 회피)
 *   count        : 타이틀 옆 강조 개수 (숫자, 미지정 시 숨김)
 *   count-suffix : 개수 접미사 (기본 "개")
 *   add-label    : 추가 액션 라벨 (기본 "추가 선택")
 *   clear-label  : 해제 액션 라벨 (기본 "선택 해제")
 *   hide-actions / hide-add / hide-clear : 액션 숨김
 *
 * 이벤트 (bubbles, composed):
 *   nds-selected-items-add   -> "추가 선택" 클릭
 *   nds-selected-items-clear -> "선택 해제" 클릭
 *   nds-region-remove        -> RegionRow 삭제 클릭
 */

import { NdsElement, define } from "../base/nds-element.js";

const SIP_CLASS = "nds-selected-items-panel";

function svg(viewBox: string, inner: string): SVGElement {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  el.setAttribute("viewBox", viewBox);
  el.setAttribute("fill", "none");
  el.innerHTML = inner;
  return el;
}

const PLUS_SVG = `<path d="M8 3.5v9M3.5 8h9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />`;
const REFRESH_SVG = `<path d="M12.9 8a4.9 4.9 0 1 1-1.43-3.47M12.9 2.2v2.6h-2.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`;
const REMOVE_SVG = `<circle cx="10" cy="10" r="7.25" stroke="currentColor" stroke-width="1.5" /><path d="M7.75 7.75l4.5 4.5M12.25 7.75l-4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />`;

export class NdsSelectedItemsPanel extends NdsElement {
  static elementName = "nds-selected-items-panel";

  static get observedAttributes(): readonly string[] {
    return [
      "panel-title",
      "count",
      "count-suffix",
      "add-label",
      "clear-label",
      "hide-actions",
      "hide-add",
      "hide-clear",
    ];
  }

  private _root: HTMLDivElement | null = null;
  private _titleEl: HTMLSpanElement | null = null;
  private _countEl: HTMLSpanElement | null = null;
  private _actionsEl: HTMLDivElement | null = null;
  private _addBtn: HTMLButtonElement | null = null;
  private _clearBtn: HTMLButtonElement | null = null;
  private _addLabelEl: Text | null = null;
  private _clearLabelEl: Text | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.className = SIP_CLASS;
    root.dataset.slot = "root";

    const header = document.createElement("div");
    header.className = `${SIP_CLASS}__header`;

    const titleGroup = document.createElement("div");
    titleGroup.className = `${SIP_CLASS}__title-group`;
    const titleEl = document.createElement("span");
    titleEl.className = `${SIP_CLASS}__title`;
    const countEl = document.createElement("span");
    countEl.className = `${SIP_CLASS}__count`;
    titleGroup.append(titleEl, countEl);

    const actions = document.createElement("div");
    actions.className = `${SIP_CLASS}__actions`;
    this._addBtn = this._makeAction(
      "primary",
      PLUS_SVG,
      (this._addLabelEl = document.createTextNode("")),
      () =>
        this.dispatchEvent(
          new CustomEvent("nds-selected-items-add", { bubbles: true, composed: true }),
        ),
    );
    this._clearBtn = this._makeAction(
      "ghost",
      REFRESH_SVG,
      (this._clearLabelEl = document.createTextNode("")),
      () =>
        this.dispatchEvent(
          new CustomEvent("nds-selected-items-clear", { bubbles: true, composed: true }),
        ),
    );
    actions.append(this._addBtn, this._clearBtn);

    header.append(titleGroup, actions);

    const body = document.createElement("div");
    body.className = `${SIP_CLASS}__body`;
    body.dataset.slot = "body";
    while (this.firstChild) body.appendChild(this.firstChild);

    root.append(header, body);
    this.appendChild(root);

    this._root = root;
    this._titleEl = titleEl;
    this._countEl = countEl;
    this._actionsEl = actions;
  }

  private _makeAction(
    variant: string,
    iconSvg: string,
    labelNode: Text,
    onClick: () => void,
  ): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `${SIP_CLASS}__action`;
    btn.dataset.variant = variant;
    const icon = document.createElement("span");
    icon.className = `${SIP_CLASS}__action-icon`;
    icon.appendChild(svg("0 0 16 16", iconSvg));
    btn.append(icon, labelNode);
    btn.addEventListener("click", onClick);
    return btn;
  }

  protected update(): void {
    if (!this._root || !this._titleEl || !this._countEl) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    this._titleEl.textContent = this.attr("panel-title", "");

    const count = this.getAttribute("count");
    if (count !== null && count !== "") {
      this._countEl.textContent = `${count}${this.attr("count-suffix", "개")}`;
      this._countEl.style.display = "";
    } else {
      this._countEl.style.display = "none";
    }

    if (this._addLabelEl) this._addLabelEl.textContent = this.attr("add-label", "추가 선택");
    if (this._clearLabelEl) this._clearLabelEl.textContent = this.attr("clear-label", "선택 해제");

    const hideActions = this.boolAttr("hide-actions");
    const hideAdd = hideActions || this.boolAttr("hide-add");
    const hideClear = hideActions || this.boolAttr("hide-clear");
    if (this._addBtn) this._addBtn.style.display = hideAdd ? "none" : "";
    if (this._clearBtn) this._clearBtn.style.display = hideClear ? "none" : "";
    if (this._actionsEl) this._actionsEl.style.display = hideAdd && hideClear ? "none" : "";
  }
}

export class NdsRegionRow extends NdsElement {
  static elementName = "nds-region-row";

  static get observedAttributes(): readonly string[] {
    return ["remove-label", "hide-remove"];
  }

  private _root: HTMLDivElement | null = null;
  private _removeBtn: HTMLButtonElement | null = null;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.className = "nds-region-row";
    root.dataset.slot = "root";

    const label = document.createElement("span");
    label.className = "nds-region-row__label";
    while (this.firstChild) label.appendChild(this.firstChild);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "nds-region-row__remove";
    removeBtn.appendChild(svg("0 0 20 20", REMOVE_SVG));
    removeBtn.addEventListener("click", () =>
      this.dispatchEvent(new CustomEvent("nds-region-remove", { bubbles: true, composed: true })),
    );

    root.append(label, removeBtn);
    this.appendChild(root);
    this._root = root;
    this._removeBtn = removeBtn;
  }

  protected update(): void {
    if (!this._root || !this._removeBtn) return;
    if (this.style.display !== "contents") this.style.display = "contents";
    this._removeBtn.setAttribute("aria-label", this.attr("remove-label", "삭제"));
    this._removeBtn.style.display = this.boolAttr("hide-remove") ? "none" : "";
  }
}

define(NdsSelectedItemsPanel);
define(NdsRegionRow);
