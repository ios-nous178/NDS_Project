/**
 * NdsElement — Light DOM Web Component base.
 *
 * 디자인 결정 (CLAUDE 와 합의):
 *  · Shadow DOM 안 씀 — DS stylesheet 는 light DOM 의 `.nds-*` 클래스를 직접 매칭한다.
 *    React 컴포넌트와 동일한 DOM 모양을 만들어서 같은 stylesheet 가 그대로 적용된다.
 *  · 자식 클래스는 update() 만 구현. attribute observe / re-render scheduling 은 베이스가 처리.
 *  · host element 자체에 className / data-* / inline CSS variables 를 박는 패턴.
 *    React DS Button 의 `<button class="nds-button" data-variant=...>` 구조를 그대로 모방.
 *  · children 은 절대 건드리지 않는다 — 사용자/AI 가 쓴 markup 을 보존.
 *
 * ── mount/update 계약 (input 재생성 footgun 의 구조적 차단) ──
 *  · mount()  = DOM 골격을 **1회만** 구성 (베이스가 1회 보장 — disconnect 후
 *    재연결돼도 다시 호출되지 않는다).
 *  · update() = attribute 변화를 기존 노드에 **반영만** 한다. update() 안에서
 *    input/textarea 를 재생성하면 키 입력마다 포커스가 유실된다
 *    (AddressPicker/DatePicker "한 글자마다 끊김" 클래스 — 회귀 테스트 의무,
 *    scripts/check-input-tests.mjs 게이트).
 *  · 기존 컴포넌트의 `if (!this._root) this._mount()` 자가 가드 패턴도 유효하나,
 *    신규 컴포넌트는 mount() override 를 사용한다.
 */

export abstract class NdsElement extends HTMLElement {
  /** 자식이 반드시 override. customElements.define 에 쓰일 태그명. */
  static elementName: string = "";

  private _renderScheduled = false;
  private _ndsMounted = false;
  /** `[hidden]` 토글을 감지해 재렌더를 트리거하는 관찰자(observedAttributes 는 자식별이라 누락 가능). */
  private _hiddenObserver: MutationObserver | null = null;
  /** 베이스가 `[hidden]` 때문에 display:none 을 강제했는지 — 자기가 박은 것만 되돌리기 위함. */
  private _hiddenForced = false;

  /** mount() 가 이미 실행됐는지. 자식 클래스 가드/디버깅용. */
  protected get mounted(): boolean {
    return this._ndsMounted;
  }

  /**
   * DOM 골격 1회 구성 훅 — 첫 connectedCallback 직전에 베이스가 정확히 한 번
   * 호출한다. 기본은 no-op (자가 _mount 가드를 쓰는 기존 컴포넌트 하위호환).
   */
  protected mount(): void {
    /* no-op base — 신규 컴포넌트가 override */
  }

  connectedCallback(): void {
    if (!this._ndsMounted) {
      this._ndsMounted = true;
      this.mount();
    }
    // `[hidden]` 존중(아래 scheduleUpdate 참고). 다수 컴포넌트가 update() 에서
    // `style.display = "contents"` 를 강제해 UA 기본 `[hidden]{display:none}` 을 덮으므로,
    // hidden 토글을 관찰해 재렌더 → 베이스가 마지막에 display 를 교정한다.
    // (observedAttributes 는 자식 클래스별 정의라 "hidden" 이 빠질 수 있어 베이스가 직접 관찰.)
    if (!this._hiddenObserver && typeof MutationObserver !== "undefined") {
      this._hiddenObserver = new MutationObserver(() => this.scheduleUpdate());
      this._hiddenObserver.observe(this, { attributes: true, attributeFilter: ["hidden"] });
    }
    this.scheduleUpdate();
  }

  /** 자식 클래스가 필요시 override. 기본은 no-op. */
  disconnectedCallback(): void {
    /* no-op base — 자식이 listener 정리 등 필요할 때 override */
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (!this.isConnected) return;
    if (oldValue === newValue) return;
    this.scheduleUpdate();
  }

  /** microtask 로 update 합치기 — 한 turn 에 여러 attribute 가 바뀌어도 한 번만 그린다. */
  protected scheduleUpdate(): void {
    if (this._renderScheduled) return;
    this._renderScheduled = true;
    queueMicrotask(() => {
      this._renderScheduled = false;
      if (!this.isConnected) return;
      this.update();
      // `[hidden]` 교정 — update() 가 display 를 강제(contents 등)한 뒤 마지막에 적용한다.
      if (this.hasAttribute("hidden")) {
        this.style.display = "none";
        this._hiddenForced = true;
      } else if (this._hiddenForced) {
        this._hiddenForced = false;
        // 베이스가 박았던 none 만 되돌린다. update() 가 이미 자기 display 로 덮었으면 건드리지 않음
        // (자체 display:none 으로 닫힘을 표현하는 modal/popup 등을 강제로 열지 않기 위함).
        if (this.style.display === "none") this.style.removeProperty("display");
      }
    });
  }

  /** 자식 클래스가 구현. host element 의 className / dataset / style 을 조정한다. */
  protected abstract update(): void;

  /** attribute → string (with default). */
  protected attr(name: string, defaultValue: string): string {
    return this.getAttribute(name) ?? defaultValue;
  }

  /** boolean attribute (있으면 true, value 무관). HTML 표준 boolean attr 시맨틱. */
  protected boolAttr(name: string): boolean {
    return this.hasAttribute(name);
  }

  /** host element 에 CSS custom properties 를 일괄 적용. undefined 값은 제거. */
  protected setCssVars(vars: Record<string, string | number | undefined>): void {
    for (const [key, value] of Object.entries(vars)) {
      const varName = key.startsWith("--") ? key : `--${key}`;
      if (value === undefined) {
        this.style.removeProperty(varName);
      } else {
        this.style.setProperty(varName, String(value));
      }
    }
  }

  /** host element 에 data-* attributes 일괄 적용. undefined 값은 제거. */
  protected setDataAttrs(attrs: Record<string, string | undefined>): void {
    for (const [key, value] of Object.entries(attrs)) {
      if (value === undefined) {
        delete this.dataset[key];
      } else {
        this.dataset[key] = value;
      }
    }
  }
}

/** define() 에 넘길 수 있는 concrete 자식 클래스 타입. */
export type NdsElementConstructor = CustomElementConstructor & {
  elementName: string;
};

/**
 * 중복 등록 방지 + 환경 가드. SSR 환경(customElements 없음)에서는 silent.
 */
export function define(klass: NdsElementConstructor): void {
  if (typeof customElements === "undefined") return;
  if (!klass.elementName) {
    throw new Error(`[nds] ${klass.name} is missing static elementName.`);
  }
  if (customElements.get(klass.elementName)) return;
  customElements.define(klass.elementName, klass);
}
