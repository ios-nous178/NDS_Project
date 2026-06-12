/**
 * <nds-expandable-text> — DS ExpandableText 의 vanilla Web Component 버전.
 *
 * 사용 패턴:
 *   <nds-expandable-text lines="2" expand-label="더보기" collapse-label="접기">
 *     본문 텍스트... (host 의 light DOM children 이 그대로 body 가 됨)
 *   </nds-expandable-text>
 *
 * Attributes:
 *   lines           접혔을 때 표시할 줄 수 (default 3)
 *   expand-label    더보기 버튼 라벨 (default "더보기")
 *   collapse-label  접기 버튼 라벨   (default "접기")
 *   hide-collapse   한 번 펼치면 접기 버튼을 숨김
 *   expanded        boolean — 외부 제어용 (있으면 펼친 상태)
 *
 * 이벤트:
 *   expanded-change (detail: { expanded: boolean }) — 토글 클릭 시
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const ET_CLASS = "nds-expandable-text";
const ET_BODY_CLASS = `${ET_CLASS}__body`;
const ET_TOGGLE_CLASS = `${ET_CLASS}__toggle`;

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby"] as const;

export class NdsExpandableText extends NdsElement {
  static elementName = "nds-expandable-text";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-expandable-text"].observedAttributes, ...FORWARDED_ATTRS];
  }

  private _root: HTMLDivElement | null = null;
  private _body: HTMLParagraphElement | null = null;
  private _toggle: HTMLButtonElement | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _overflowing = false;
  private _onToggle = () => this._handleToggle();

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
    this._observeBody();
  }

  override disconnectedCallback(): void {
    this._toggle?.removeEventListener("click", this._onToggle);
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
  }

  private _mount(): void {
    const root = document.createElement("div");
    root.dataset.slot = "root";
    root.className = ET_CLASS;

    const body = document.createElement("p");
    body.dataset.slot = "body";
    body.className = ET_BODY_CLASS;
    while (this.firstChild) body.appendChild(this.firstChild);

    root.appendChild(body);
    this.appendChild(root);
    this._root = root;
    this._body = body;
  }

  protected update(): void {
    if (!this._root || !this._body) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    const lines = this._intAttr("lines", 3);
    this._root.style.setProperty("--nds-expandable-lines", String(lines));

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    this._measureOverflow(lines);
    this._renderState(lines);
  }

  private _observeBody(): void {
    if (this._resizeObserver || !this._body || typeof ResizeObserver === "undefined") return;
    this._resizeObserver = new ResizeObserver(() => this.scheduleUpdate());
    this._resizeObserver.observe(this._body);
  }

  private _measureOverflow(lines: number): void {
    if (!this._body) return;
    const previous = this._body.dataset.clamped;
    this._body.dataset.clamped = "false";
    const fullHeight = this._body.scrollHeight;
    const computed = typeof getComputedStyle === "function" ? getComputedStyle(this._body) : null;
    const lh = computed ? parseFloat(computed.lineHeight) : NaN;
    const limit = Number.isFinite(lh) && lh > 0 ? lh * lines : 0;
    this._overflowing = limit > 0 && fullHeight > limit + 1;
    if (previous !== undefined) this._body.dataset.clamped = previous;
  }

  private _renderState(_lines: number): void {
    if (!this._body) return;
    const expanded = this.boolAttr("expanded");
    const hideCollapse = this.boolAttr("hide-collapse");
    const showToggle = this._overflowing && (!expanded || !hideCollapse);

    this._body.dataset.clamped = !expanded && this._overflowing ? "true" : "false";

    if (showToggle) {
      this._ensureToggle();
      if (this._toggle) {
        this._toggle.textContent = expanded
          ? this.attr("collapse-label", "접기")
          : this.attr("expand-label", "더보기");
        this._toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      }
    } else {
      this._toggle?.remove();
      if (this._toggle) {
        this._toggle.removeEventListener("click", this._onToggle);
        this._toggle = null;
      }
    }
  }

  private _ensureToggle(): void {
    if (this._toggle || !this._root) return;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.slot = "toggle";
    button.className = ET_TOGGLE_CLASS;
    button.addEventListener("click", this._onToggle);
    this._root.appendChild(button);
    this._toggle = button;
  }

  private _handleToggle(): void {
    const next = !this.boolAttr("expanded");
    if (next) this.setAttribute("expanded", "");
    else this.removeAttribute("expanded");
    this.dispatchEvent(
      new CustomEvent("expanded-change", {
        detail: { expanded: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _intAttr(name: string, fallback: number): number {
    const value = this.getAttribute(name);
    if (value === null || value.trim() === "") return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : fallback;
  }
}

define(NdsExpandableText);
