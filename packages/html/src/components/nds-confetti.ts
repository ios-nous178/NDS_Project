/**
 * <nds-confetti> — DS Confetti 의 vanilla Web Component 버전.
 *
 * 사용 예 (한 번 발사):
 *   const el = document.querySelector('nds-confetti');
 *   el.fire();
 *
 *   또는 active 속성으로:
 *   <nds-confetti active count="80" duration="2200"></nds-confetti>
 *   // active 가 true 로 바뀌는 순간 발사. 끝나면 onComplete 이벤트.
 *
 * 이벤트:
 *   nds-confetti-complete -> 애니메이션 종료
 *
 * 속성:
 *   active: 활성화
 *   count: 입자 수 (default 80)
 *   duration: 지속 시간 ms (default 2200)
 *   colors: JSON 배열 (CSS color 문자열) — 미지정 시 기본 팔레트
 *
 * 메서드:
 *   fire() -> 명시적으로 한 번 발사
 */

import { NdsElement, define } from "../base/nds-element.js";
import { COMPONENT_ATTRS } from "../generated/component-attrs.js";

const CF_CLASS = "nds-confetti";

const DEFAULT_COLORS = ["#FF6B6B", "#FFD166", "#06D6A0", "#118AB2", "#9D4EDD", "#FF9F1C"];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  color: string;
  shape: 0 | 1;
}

export class NdsConfetti extends NdsElement {
  static elementName = "nds-confetti";

  static get observedAttributes(): readonly string[] {
    return [...COMPONENT_ATTRS["nds-confetti"].observedAttributes];
  }

  private _canvas: HTMLCanvasElement | null = null;
  private _raf: number | null = null;
  private _running = false;

  override connectedCallback(): void {
    if (!this._canvas) this._mount();
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    if (this._raf !== null) cancelAnimationFrame(this._raf);
    this._running = false;
  }

  private _mount(): void {
    const canvas = document.createElement("canvas");
    canvas.dataset.slot = "root";
    canvas.className = CF_CLASS;
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.display = "none";
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    this.appendChild(canvas);
    this._canvas = canvas;
  }

  private _parseColors(): string[] {
    const raw = this.getAttribute("colors");
    if (!raw) return DEFAULT_COLORS;
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_COLORS;
      return parsed.map(String);
    } catch {
      return DEFAULT_COLORS;
    }
  }

  fire(): void {
    if (this._running || !this._canvas) return;
    if (typeof window === "undefined") return;

    const ctx = this._canvas.getContext("2d");
    if (!ctx) return;

    this._running = true;
    this._canvas.style.display = "";

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this._canvas.width = w * dpr;
    this._canvas.height = h * dpr;
    this._canvas.style.width = `${w}px`;
    this._canvas.style.height = `${h}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const count = parseInt(this.attr("count", "80"), 10) || 80;
    const duration = parseInt(this.attr("duration", "2200"), 10) || 2200;
    const colors = this._parseColors();

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: w / 2 + (Math.random() - 0.5) * 80,
      y: h / 2 - 80,
      vx: (Math.random() - 0.5) * 12,
      vy: -10 + Math.random() * -6,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.4,
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.5 ? 0 : 1,
    }));

    const startTime = performance.now();
    const gravity = 0.4;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.vx *= 0.99;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 0) {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      if (elapsed < duration) {
        this._raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
        this._running = false;
        this._raf = null;
        if (this._canvas) this._canvas.style.display = "none";
        this.removeAttribute("active");
        this.dispatchEvent(
          new CustomEvent("nds-confetti-complete", { bubbles: true, composed: true }),
        );
      }
    };

    this._raf = requestAnimationFrame(tick);
  }

  protected update(): void {
    if (this.style.display !== "contents") this.style.display = "contents";
    if (this.boolAttr("active") && !this._running) {
      this.fire();
    }
  }
}

define(NdsConfetti);
