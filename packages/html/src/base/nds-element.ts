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
 */

export abstract class NdsElement extends HTMLElement {
  /** 자식이 반드시 override. customElements.define 에 쓰일 태그명. */
  static elementName: string = "";

  private _renderScheduled = false;

  connectedCallback(): void {
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
      if (this.isConnected) this.update();
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
