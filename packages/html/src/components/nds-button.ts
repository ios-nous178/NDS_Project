/**
 * <nds-button> — DS Button 의 vanilla Web Component 버전.
 *
 * DOM 구조 (React Button.tsx 와 동일):
 *   <nds-button color="primary" size="lg">상담 예약</nds-button>
 *     └─ <button class="nds-button" data-slot="root" data-variant="solid" data-size="lg"
 *                data-color="primary" style="--nds-button-*: ...">
 *          └─ <span class="nds-button__label" data-slot="label">상담 예약</span>
 *        </button>
 *
 * 호스트 (<nds-button>) 는 `display: contents` 로 layout 에 영향을 주지 않는다.
 * 실제 .nds-button 클래스는 내부 <button> 에만 박혀서 React DS stylesheet
 * (.nds-button { ... }, .nds-button:disabled { ... }, .nds-button:focus-visible { ... }) 가
 * 그대로 매칭된다 — stylesheet 한 글자도 안 바꾼다.
 *
 * children 처리:
 *   첫 connectedCallback 때 light DOM children 을 모두 <span class="nds-button__label">
 *   안으로 이동. 사용자가 작성한 markup 은 그대로 보존된다.
 *
 * leftIcon / rightIcon 슬롯은 v0.0.1 에서 미구현 — children 단일 슬롯만 지원.
 * 향후 `<nds-icon slot="left">` 패턴 또는 attribute 기반 아이콘으로 확장.
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";
import {
  BRAND_TONE_DENYLIST,
  BRAND_VARIANT_WHITELIST,
  BUTTON_COLORS,
  BUTTON_SHAPES,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  SHAPE_RADIUS,
  type ButtonColor,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
  sizeConfig,
  styleMap,
} from "./nds-button.styles.js";

const BUTTON_CLASS = "nds-button";
const BUTTON_LABEL_CLASS = `${BUTTON_CLASS}__label`;

/* react Button.tsx warnIfBrandRestricted 미러 — dev-only console.warn (런타임 영향 없음). */
const warnedKeys = new Set<string>();
function warnIfBrandRestricted(brand: string | null, variant: ButtonVariant, color: ButtonColor) {
  if (!brand) return;
  const allow = BRAND_VARIANT_WHITELIST[brand];
  if (allow && !allow.includes(variant)) {
    const key = `${brand}:v:${variant}`;
    if (!warnedKeys.has(key)) {
      warnedKeys.add(key);
      console.warn(
        `[nds/Button] variant="${variant}" 는 brand="${brand}" Figma 가이드에 없음 — ` +
          `허용된 variant: [${allow.join(", ")}]. 디자인 인텐트가 어긋날 수 있어요.`,
      );
    }
  }
  const deny = BRAND_TONE_DENYLIST[brand];
  if (deny && deny.includes(color)) {
    const key = `${brand}:c:${color}`;
    if (!warnedKeys.has(key)) {
      warnedKeys.add(key);
      console.warn(
        `[nds/Button] color="${color}" 는 brand="${brand}" Figma 가이드에 없는 tone 입니다. ` +
          `검정/회색 CTA 는 color="neutral" 을 쓰세요 (secondary 아님).`,
      );
    }
  }
}

type ButtonType = "button" | "submit" | "reset";

/**
 * inner <button> 으로 그대로 mirror 할 attribute 화이트리스트.
 * a11y · form · 의미론적 attribute 만 — DS 의 visual prop (variant/size/color) 은 제외.
 */
const FORWARDED_ATTRS = [
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "aria-pressed",
  "aria-expanded",
  "aria-controls",
  "aria-haspopup",
  "name",
  "value",
  "form",
  "formaction",
  "formmethod",
  "formnovalidate",
  "formtarget",
  "title",
  "autofocus",
  "tabindex",
] as const;

export class NdsButton extends NdsElement {
  static elementName = "nds-button";

  // react Props 파생분은 코드젠 SSOT(generated/component-attrs.ts) — react prop 추가/삭제 자동 반영.
  // 인라인 문자열은 html 전용 attr (react 는 DOM 위임/내부 상태로 처리).
  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-button"].observedAttributes, "disabled", "type", ...FORWARDED_ATTRS];
  }

  private _inner: HTMLButtonElement | null = null;
  private _label: HTMLSpanElement | null = null;
  /** host 에 직접 다시 들어온 라벨 콘텐츠를 흡수하기 위한 관찰자(아래 _rewrapStrayChildren 참고). */
  private _childObserver: MutationObserver | null = null;

  /**
   * 네이티브 <button> 처럼 `.disabled` / `.fullWidth` 프로퍼티로도 토글 가능하게 한다.
   * (attribute 만 지원하면 `el.disabled = false` 가 attribute 에 반영되지 않아
   *  버튼이 계속 비활성으로 남는 함정이 있었다 — nds-checkbox 와 동일하게 reflect.)
   */
  get disabled(): boolean {
    return this.boolAttr("disabled");
  }
  set disabled(value: boolean) {
    this.toggleAttribute("disabled", !!value);
  }

  get fullWidth(): boolean {
    return this.boolAttr("full-width");
  }
  set fullWidth(value: boolean) {
    this.toggleAttribute("full-width", !!value);
  }

  override connectedCallback(): void {
    if (!this._inner) this._mount();
    super.connectedCallback();
  }

  /**
   * children 을 inner <button> > <span.label> 안으로 이동.
   * 한 번만 실행 — 이후 update() 는 inner 의 속성/스타일만 갱신한다.
   */
  private _mount(): void {
    const inner = document.createElement("button");
    const label = document.createElement("span");

    inner.className = BUTTON_CLASS;
    inner.dataset.slot = "root";

    label.className = BUTTON_LABEL_CLASS;
    label.dataset.slot = "label";

    // 기존 children 을 label 로 이동 (Text node 포함)
    while (this.firstChild) {
      label.appendChild(this.firstChild);
    }

    inner.appendChild(label);
    this.appendChild(inner);

    this._inner = inner;
    this._label = label;

    // ── 라벨 복원 관찰자 (회귀: el.textContent='재전송' 이 버튼을 통째로 날려 맨 텍스트만 남던 버그) ──
    // children 을 inner <button> 안으로 옮긴 뒤 host 의 유일한 직속 자식은 inner 다.
    // 이후 `host.textContent = ...` / `host.innerHTML = ...` / `host.append(...)` 로 host 에
    // 직접 노드가 들어오면 inner 가 detach 되고 맨 텍스트만 남는다(검색버튼·재전송 버튼 깨짐).
    // 그 stray 노드를 새 라벨 콘텐츠로 흡수하고 inner 를 다시 붙여 항상 버튼 구조를 유지한다.
    if (typeof MutationObserver !== "undefined") {
      this._childObserver = new MutationObserver(() => this._rewrapStrayChildren());
      this._childObserver.observe(this, { childList: true });
    }
  }

  /**
   * host 직속에 들어온 stray 노드(textContent/innerHTML/append 로 추가된 라벨 콘텐츠)를
   * inner 버튼의 __label 로 흡수하고 inner 를 host 의 유일한 직속 자식으로 복원한다.
   * inner 를 다시 붙이는 동작이 관찰자를 한 번 더 깨우지만, 그때는 stray 가 없어 즉시 빠진다(무한루프 없음).
   */
  private _rewrapStrayChildren(): void {
    const inner = this._inner;
    const label = this._label;
    if (!inner || !label) return;

    const stray = Array.from(this.childNodes).filter((n) => n !== inner);
    const innerDetached = inner.parentNode !== this;
    if (stray.length === 0 && !innerDetached) return; // 우리 자신의 re-append 등 — 할 일 없음

    if (stray.length > 0) label.replaceChildren(...stray);
    else label.replaceChildren(); // textContent='' → 빈 라벨로 복원

    if (innerDetached) this.appendChild(inner);
  }

  protected update(): void {
    if (!this._inner) return;

    // host 자신은 layout 에 영향 안 주도록 contents 로 빠진다.
    if (this.style.display !== "contents") {
      this.style.display = "contents";
    }

    const variant = this._normalizedVariant();
    const size = this._normalizedSize();
    const color = this._normalizedColor();
    const shape = this._normalizedShape();
    const disabled = this.boolAttr("disabled");
    const fullWidth = this.boolAttr("full-width");
    const type = this._normalizedType();

    // Brand-aware 경고 (dev-only) — react Button.tsx 미러.
    if (typeof document !== "undefined") {
      warnIfBrandRestricted(document.documentElement.getAttribute("data-brand"), variant, color);
    }

    const cfg = sizeConfig[size];
    const set = styleMap[color][variant];
    const state = disabled ? set.disabled : set.enabled;
    const hover = set.hover;

    const inner = this._inner;
    inner.type = type;
    inner.disabled = disabled;
    inner.dataset.variant = variant;
    inner.dataset.size = size;
    inner.dataset.color = color;
    inner.dataset.shape = shape;

    // a11y / form attribute forwarding — host 에 적힌 값을 inner button 으로 mirror.
    // 호스트에서 attribute 가 제거되면 inner 에서도 제거.
    for (const name of FORWARDED_ATTRS) {
      const v = this.getAttribute(name);
      if (v === null) inner.removeAttribute(name);
      else inner.setAttribute(name, v);
    }

    // React Button.tsx 의 인라인 CSS 변수 키와 1:1 동일
    const vars: Record<string, string | number> = {
      // 높이는 브랜드가 size별로 override 가능 (지니어트 sm 40·xs 36). 미설정 시 base 토큰. (react 미러)
      "--nds-button-height": `var(--nds-button-height-${size}, ${cfg.height}px)`,
      "--nds-button-padding-x": `${cfg.px}px`,
      "--nds-button-gap": `${cfg.gap}px`,
      "--nds-button-font-size": `${cfg.fontSize}px`,
      "--nds-button-line-height": `${cfg.lineHeight}px`,
      "--nds-button-icon-size": `${cfg.iconSize}px`,
      "--nds-button-font-weight": state.fontWeight ?? 700,
      "--nds-button-radius": SHAPE_RADIUS[shape],
      "--nds-button-width": fullWidth ? "100%" : "auto",
      "--nds-button-background": state.background,
      "--nds-button-text-color": state.text,
      "--nds-button-border-color": state.border,
      "--nds-button-hover-background": hover.background,
      "--nds-button-hover-text-color": hover.text,
      "--nds-button-hover-border-color": hover.border,
    };
    for (const [k, v] of Object.entries(vars)) {
      inner.style.setProperty(k, String(v));
    }
  }

  /* ─── attribute 정규화 (잘못된 값 → 기본값으로 fallback) ─── */

  private _normalizedVariant(): ButtonVariant {
    const v = this.attr("variant", "solid");
    return (BUTTON_VARIANTS as readonly string[]).includes(v) ? (v as ButtonVariant) : "solid";
  }

  private _normalizedSize(): ButtonSize {
    const v = this.attr("size", "lg");
    return (BUTTON_SIZES as readonly string[]).includes(v) ? (v as ButtonSize) : "lg";
  }

  private _normalizedColor(): ButtonColor {
    const v = this.attr("color", "primary");
    return (BUTTON_COLORS as readonly string[]).includes(v) ? (v as ButtonColor) : "primary";
  }

  private _normalizedShape(): ButtonShape {
    const v = this.attr("shape", "default");
    return (BUTTON_SHAPES as readonly string[]).includes(v) ? (v as ButtonShape) : "default";
  }

  private _normalizedType(): ButtonType {
    const v = this.attr("type", "button");
    return v === "submit" || v === "reset" ? v : "button";
  }
}

define(NdsButton);
