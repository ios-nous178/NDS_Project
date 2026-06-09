/**
 * <nds-countdown-timer> — DS CountdownTimer 의 vanilla Web Component 버전.
 *
 * 사용 패턴:
 *   <nds-countdown-timer ends-at="2026-12-31T23:59:59Z" format="hh:mm:ss" label="남음">
 *   </nds-countdown-timer>
 *
 * Attributes:
 *   ends-at        ISO string 또는 ms 숫자 (필수)
 *   format         "mm:ss" | "hh:mm:ss" | "remaining"  (default "mm:ss")
 *   label          시간 옆에 붙는 보조 라벨
 *   expired-text   0초 이하 도달 후 표시할 텍스트 (default "만료됨")
 *   no-urgent      boolean — 10초 이하 임박 컬러 비활성화
 *   tone           "default" | "brand" — brand=브랜드 액센트(캐포비 오렌지). urgent(≤10s)는 빨강 우선
 *
 * 이벤트:
 *   countdown-tick      매 1초 (detail: { ms: number })  ── 남은 ms
 *   countdown-complete  0초 도달 시 1회만 (detail: {})
 */

import { NdsElement, define } from "../base/nds-element.js";

const CT_CLASS = "nds-countdown-timer";
const CT_TIME_CLASS = `${CT_CLASS}__time`;
const CT_LABEL_CLASS = `${CT_CLASS}__label`;

export type CountdownFormat = "mm:ss" | "hh:mm:ss" | "remaining";

const FORMATS: readonly CountdownFormat[] = ["mm:ss", "hh:mm:ss", "remaining"];
const URGENT_THRESHOLD_MS = 10_000;
const TICK_MS = 1_000;

const FORWARDED_ATTRS = ["aria-label", "aria-labelledby", "title"] as const;

export class NdsCountdownTimer extends NdsElement {
  static elementName = "nds-countdown-timer";

  static get observedAttributes(): readonly string[] {
    return ["ends-at", "format", "label", "expired-text", "no-urgent", "tone", ...FORWARDED_ATTRS];
  }

  private _root: HTMLSpanElement | null = null;
  private _timeEl: HTMLSpanElement | null = null;
  private _labelEl: HTMLSpanElement | null = null;
  private _intervalId: ReturnType<typeof setInterval> | null = null;
  private _completed = false;

  override connectedCallback(): void {
    if (!this._root) this._mount();
    super.connectedCallback();
    this._startTicking();
  }

  override disconnectedCallback(): void {
    this._stopTicking();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === "ends-at" && oldValue !== newValue) {
      this._completed = false;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  private _mount(): void {
    const root = document.createElement("span");
    root.dataset.slot = "root";
    root.className = CT_CLASS;
    root.setAttribute("aria-live", "polite");

    const time = document.createElement("span");
    time.className = CT_TIME_CLASS;

    root.appendChild(time);
    this.replaceChildren(root);
    this._root = root;
    this._timeEl = time;
  }

  protected update(): void {
    if (!this._root || !this._timeEl) return;
    if (this.style.display !== "contents") this.style.display = "contents";

    for (const name of FORWARDED_ATTRS) {
      const value = this.getAttribute(name);
      if (value === null) this._root.removeAttribute(name);
      else this._root.setAttribute(name, value);
    }

    this._render();
  }

  private _startTicking(): void {
    if (this._intervalId !== null) return;
    this._intervalId = setInterval(() => this._tick(), TICK_MS);
  }

  private _stopTicking(): void {
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  private _tick(): void {
    const targetMs = this._targetMs();
    if (targetMs === null) return;
    const remaining = targetMs - Date.now();
    this.dispatchEvent(
      new CustomEvent("countdown-tick", {
        detail: { ms: remaining },
        bubbles: true,
        composed: true,
      }),
    );
    if (remaining <= 0 && !this._completed) {
      this._completed = true;
      this.dispatchEvent(new CustomEvent("countdown-complete", { bubbles: true, composed: true }));
    }
    this._render();
  }

  private _render(): void {
    if (!this._root || !this._timeEl) return;
    const targetMs = this._targetMs();
    const remaining = targetMs === null ? 0 : Math.max(0, targetMs - Date.now());
    const expired = targetMs === null || remaining <= 0;
    const urgent = !expired && remaining <= URGENT_THRESHOLD_MS && !this.boolAttr("no-urgent");
    const format = this._normalizedFormat();

    this._root.dataset.urgent = urgent ? "true" : "false";
    this._root.dataset.expired = expired ? "true" : "false";
    this._root.dataset.tone = this.attr("tone", "default");

    if (expired) {
      this._timeEl.textContent = this.attr("expired-text", "만료됨");
    } else {
      this._timeEl.textContent = formatTime(remaining, format) ?? "";
    }

    this._syncLabel(expired);
  }

  private _syncLabel(expired: boolean): void {
    if (!this._root) return;
    const labelText = this.getAttribute("label");
    const shouldShow = labelText !== null && labelText !== "" && !expired;
    if (!shouldShow) {
      this._labelEl?.remove();
      this._labelEl = null;
      return;
    }
    if (!this._labelEl) {
      this._labelEl = document.createElement("span");
      this._labelEl.className = CT_LABEL_CLASS;
      this._root.appendChild(this._labelEl);
    }
    this._labelEl.textContent = labelText;
  }

  private _targetMs(): number | null {
    const raw = this.getAttribute("ends-at");
    if (raw === null || raw === "") return null;
    const asNumber = Number(raw);
    if (Number.isFinite(asNumber) && raw.trim() === String(asNumber)) return asNumber;
    const parsed = Date.parse(raw);
    return Number.isNaN(parsed) ? null : parsed;
  }

  private _normalizedFormat(): CountdownFormat {
    const value = this.attr("format", "mm:ss");
    return (FORMATS as readonly string[]).includes(value) ? (value as CountdownFormat) : "mm:ss";
  }
}

function formatTime(ms: number, format: CountdownFormat): string | null {
  if (ms <= 0) return null;
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (format === "hh:mm:ss") {
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }
  if (format === "remaining") {
    if (total >= 3600) return `${Math.ceil(total / 3600)}시간 남음`;
    if (total >= 60) return `${Math.ceil(total / 60)}분 남음`;
    return `${total}초 남음`;
  }
  return `${pad(m)}:${pad(s)}`;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

define(NdsCountdownTimer);
