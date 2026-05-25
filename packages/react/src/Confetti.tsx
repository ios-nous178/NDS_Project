import React, { useEffect, useRef } from "react";

/* ─── Constants ─── */

const CF_CLASS = "nds-confetti";

/* ─── Types ─── */

export interface ConfettiProps extends Omit<React.HTMLAttributes<HTMLCanvasElement>, "color"> {
  /** 활성화 여부 (true가 되는 순간 한 번 발사) */
  active: boolean;
  /** 종료 콜백 (애니메이션 끝났을 때) */
  onComplete?: () => void;
  /** 색상 팔레트 */
  colors?: string[];
  /** 발사할 입자 수 (기본 80) */
  count?: number;
  /** 지속 시간(ms, 기본 2200) */
  duration?: number;
}
const DEFAULT_COLORS = ["#FF6B6B", "#FFD166", "#06D6A0", "#118AB2", "#9D4EDD", "#FF9F1C"];

/* ─── Component ─── */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  color: string;
  shape: 0 | 1; // 0: rect, 1: circle
}

export const Confetti: React.FC<ConfettiProps> = ({
  active,
  onComplete,
  colors = DEFAULT_COLORS,
  count = 80,
  duration = 2200,
  className,
  ...rest
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    startedRef.current = true;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

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
        rafRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
        startedRef.current = false;
        onComplete?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startedRef.current = false;
    };
  }, [active, colors, count, duration, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className={[CF_CLASS, className].filter(Boolean).join(" ")}
      aria-hidden
      {...rest}
    />
  );
};

Confetti.displayName = "Confetti";
