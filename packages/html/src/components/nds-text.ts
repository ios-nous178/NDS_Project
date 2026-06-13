/**
 * <nds-text> — DS Text 의 vanilla Web Component (react Text 미러).
 *
 * 타이포 스케일(variant)·시맨틱 색(tone)·weight 를 공용 `.nds-text-*` 클래스로 건다.
 *   <nds-text variant="body1" tone="subtle">메타 텍스트</nds-text>
 *
 * expandable: 길면 '더보기/접기' 토글(구 <nds-expandable-text> 흡수).
 *   <nds-text expandable max-lines="3">긴 본문…</nds-text>
 * (expandable 여부는 mount 시 1회 확정 — 런타임 토글 비대상. 그 외 attr 은 live 반영.)
 *
 * 이벤트: expanded-change (detail: { expanded }) — 토글 클릭 시.
 *
 * 참고: react 의 `as` prop 은 html attr 로 미러하지 않는다(REACT_ONLY) — html body 는 항상 span.
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const TEXT_CLASS = "nds-text";
const TEXT_EXPANDABLE_CLASS = "nds-text-expandable";
const TEXT_TOGGLE_CLASS = "nds-text__toggle";

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby"] as const;

/** tone 값(camelCase or kebab)을 클래스 suffix(kebab)로. statusError → status-error */
function toneKebab(tone: string): string {
  return tone.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export class NdsText extends NdsElement {
  static elementName = "nds-text";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-text"].observedAttributes, ...FORWARDED_ATTRS];
  }

  private _expandableMode = false;
  private _root: HTMLElement | null = null; // non-exp: = body / exp: wrapper
  private _body: HTMLElement | null = null;
  private _toggle: HTMLButtonElement | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _overflowing = false;
  private _onToggle = () => this._handleToggle();

  protected override mount(): void {
    this._expandableMode = this.boolAttr("expandable");

    const body = document.createElement("span");
    body.dataset.slot = "body";
    while (this.firstChild) body.appendChild(this.firstChild);

    if (this._expandableMode) {
      const root = document.createElement("div");
      root.dataset.slot = "root";
      root.className = TEXT_EXPANDABLE_CLASS;
      root.appendChild(body);
      this.appendChild(root);
      this._root = root;
    } else {
      this.appendChild(body);
      this._root = body;
    }
    this._body = body;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this._expandableMode) this._observeBody();
  }

  override disconnectedCallback(): void {
    this._toggle?.removeEventListener("click", this._onToggle);
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
  }

  protected update(): void {
    if (!this._body || !this._root) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    this._body.className = this._bodyClasses();

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    if (this._expandableMode) {
      const lines = this._intAttr("max-lines", 3);
      this._root.style.setProperty("--nds-text-max-lines", String(lines));
      this._measureOverflow(lines);
      this._renderToggle();
    } else {
      const max = this.getAttribute("max-lines");
      if (max !== null && max.trim() !== "") {
        this._body.style.setProperty("--nds-text-max-lines", String(this._intAttr("max-lines", 1)));
        this._body.dataset.clamped = "true";
      } else {
        this._body.style.removeProperty("--nds-text-max-lines");
        delete this._body.dataset.clamped;
      }
    }
  }

  private _bodyClasses(): string {
    const variant = this.attr("variant", "body1");
    const tone = this.attr("tone", "normal");
    const weight = this.getAttribute("weight");
    const classes = [TEXT_CLASS, `nds-text-${variant}`, `nds-text-tone-${toneKebab(tone)}`];
    if (weight) classes.push(`nds-text-weight-${weight}`);
    return classes.join(" ");
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

  private _renderToggle(): void {
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
    button.className = TEXT_TOGGLE_CLASS;
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

define(NdsText);
