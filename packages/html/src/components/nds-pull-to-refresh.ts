/**
 * <nds-pull-to-refresh> — DS PullToRefresh 의 vanilla Web Component 버전.
 *
 * 사용 패턴 — 자식 콘텐츠를 감싼다. onRefresh 는 이벤트 + resolve 메서드 패턴:
 *   <nds-pull-to-refresh id="ptr" threshold="64">
 *     <ul>...리스트...</ul>
 *   </nds-pull-to-refresh>
 *
 *   const ptr = document.getElementById('ptr');
 *   ptr.addEventListener('refresh', async () => {
 *     await fetchData();
 *     ptr.endRefresh();  // 끝났음을 알려주면 spinner 사라짐
 *   });
 *
 * 이벤트:
 *   refresh — 임계값을 넘어서 놓았을 때 발생. 부모는 비동기 작업 후 endRefresh() 호출.
 *
 * 속성:
 *   threshold: 임계값 px (기본 64)
 *   pull-label / release-label / refreshing-label
 *   disabled
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const PR_CLASS = "nds-pull-to-refresh";
const PR_INDICATOR_CLASS = `${PR_CLASS}__indicator`;
const PR_CONTENT_CLASS = `${PR_CLASS}__content`;
const PR_SPINNER_CLASS = `${PR_CLASS}__spinner`;
const PR_LABEL_CLASS = `${PR_CLASS}__label`;

export class NdsPullToRefresh extends NdsElement {
  static elementName = "nds-pull-to-refresh";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-pull-to-refresh"].observedAttributes];
  }

  private _root: HTMLDivElement | null = null;
  private _indicator: HTMLDivElement | null = null;
  private _label: HTMLSpanElement | null = null;
  private _spinner: HTMLSpanElement | null = null;
  private _content: HTMLDivElement | null = null;

  private _start: number | null = null;
  private _pull = 0;
  private _refreshing = false;
  private _animate = false;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
  }

  /** 부모가 refresh 비동기 작업 완료 후 호출. */
  endRefresh(): void {
    this._refreshing = false;
    this._pull = 0;
    this._animate = true;
    this._applyPullStyle();
    this._renderIndicator();
  }

  private _mount(): void {
    const userFrag = document.createDocumentFragment();
    while (this.firstChild) userFrag.appendChild(this.firstChild);

    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = PR_CLASS;

    const indicator = document.createElement("div");
    indicator.className = PR_INDICATOR_CLASS;
    indicator.setAttribute("aria-live", "polite");

    const spinner = document.createElement("span");
    spinner.className = PR_SPINNER_CLASS;
    spinner.setAttribute("aria-hidden", "true");
    spinner.style.display = "none";

    const labelSpan = document.createElement("span");
    labelSpan.className = PR_LABEL_CLASS;

    indicator.append(spinner, labelSpan);

    const content = document.createElement("div");
    content.className = PR_CONTENT_CLASS;
    content.appendChild(userFrag);

    root.append(indicator, content);
    this.appendChild(root);

    root.addEventListener("pointerdown", (e) => this._onDown(e));
    root.addEventListener("pointermove", (e) => this._onMove(e));
    root.addEventListener("pointerup", () => this._onUp());
    root.addEventListener("pointercancel", () => this._onUp());

    this._root = root;
    this._indicator = indicator;
    this._label = labelSpan;
    this._spinner = spinner;
    this._content = content;
  }

  private _threshold(): number {
    return parseInt(this.attr("threshold", "64"), 10) || 64;
  }

  private _onDown(e: PointerEvent): void {
    if (this.boolAttr("disabled") || this._refreshing) return;
    const root = this._root as HTMLDivElement;
    if (root.scrollTop > 0) return;
    this._start = e.clientY;
    this._animate = false;
  }

  private _onMove(e: PointerEvent): void {
    if (this._start === null) return;
    const delta = e.clientY - this._start;
    if (delta < 0) {
      this._pull = 0;
    } else {
      this._pull = Math.min(delta * 0.6, this._threshold() * 1.6);
    }
    this._applyPullStyle();
    this._renderIndicator();
  }

  private _onUp(): void {
    if (this._start === null) return;
    const startedRefresh = this._pull >= this._threshold();
    this._start = null;
    this._animate = true;
    if (startedRefresh) {
      this._refreshing = true;
      this._pull = this._threshold();
      this._applyPullStyle();
      this._renderIndicator();
      this.dispatchEvent(new CustomEvent("refresh", { bubbles: true, composed: true }));
    } else {
      this._pull = 0;
      this._applyPullStyle();
      this._renderIndicator();
    }
  }

  private _applyPullStyle(): void {
    if (!this._root) return;
    this._root.style.setProperty("--nds-ptr-pull", `${this._pull}px`);
    this._root.style.setProperty("--nds-ptr-anim", this._animate ? "240ms" : "0ms");
  }

  private _renderIndicator(): void {
    if (!this._label || !this._spinner) return;
    const pullLabel = this.attr("pull-label", "당겨서 새로고침");
    const releaseLabel = this.attr("release-label", "놓으면 새로고침");
    const refreshingLabel = this.attr("refreshing-label", "새로고침 중...");
    const label = this._refreshing
      ? refreshingLabel
      : this._pull >= this._threshold()
        ? releaseLabel
        : pullLabel;
    this._label.textContent = label;
    this._spinner.style.display = this._refreshing ? "" : "none";
  }

  protected update(): void {
    if (!this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";
    this._applyPullStyle();
    this._renderIndicator();
  }
}

define(NdsPullToRefresh);
