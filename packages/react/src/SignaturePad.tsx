import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

/* ─── Constants ─── */

const SP_CLASS = "nds-signature-pad";
const SP_LABEL_CLASS = `${SP_CLASS}__label`;
const SP_CANVAS_WRAP_CLASS = `${SP_CLASS}__canvas-wrap`;
const SP_CANVAS_CLASS = `${SP_CLASS}__canvas`;
const SP_PLACEHOLDER_CLASS = `${SP_CLASS}__placeholder`;
const SP_CONTROLS_CLASS = `${SP_CLASS}__controls`;
const SP_BTN_CLASS = `${SP_CLASS}__btn`;

/* ─── Types ─── */

export interface SignaturePadHandle {
  /** 캔버스 비우기 */
  clear: () => void;
  /** 현재 서명을 dataURL로 (PNG) */
  toDataURL: () => string | null;
  /** 비어 있는지 */
  isEmpty: () => boolean;
}

export interface SignaturePadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 라벨 (위) */
  label?: React.ReactNode;
  /** 서명 영역이 비어 있을 때 표시할 텍스트 */
  placeholder?: string;
  /** 캔버스 높이 px (기본 180) */
  height?: number;
  /** 펜 색상 */
  penColor?: string;
  /** 펜 두께 */
  penWidth?: number;
  /** 변경 콜백 (그릴 때마다 dataURL 또는 null 비어있을 때) */
  onChange?: (dataUrl: string | null) => void;
  /** 비활성화 (읽기 전용) */
  disabled?: boolean;
  /** 컨트롤 숨김 */
  hideControls?: boolean;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const SignaturePad = React.forwardRef<SignaturePadHandle, SignaturePadProps>(
  (
    {
      label,
      placeholder = "여기에 서명해주세요",
      height = 180,
      // Neutral 900 (#111111) — Figma SSOT text/strong/default 값과 같지만
      // canvas API 가 `var(--semantic-*)` 를 못 해석해서 raw hex 직접 사용.
      penColor = "#111111",
      penWidth = 2.4,
      onChange,
      disabled = false,
      hideControls = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const drawingRef = useRef(false);
    const [empty, setEmpty] = useState(true);

    const getCtx = useCallback(() => {
      const c = canvasRef.current;
      if (!c) return null;
      return c.getContext("2d");
    }, []);

    const resize = useCallback(() => {
      const c = canvasRef.current;
      const wrap = wrapRef.current;
      if (!c || !wrap) return;
      const dpr = window.devicePixelRatio || 1;
      const w = wrap.clientWidth;
      const h = height;
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.height = `${h}px`;
      const ctx = getCtx();
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }, [height, getCtx]);

    useEffect(() => {
      resize();
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }, [resize]);

    const clear = useCallback(() => {
      const c = canvasRef.current;
      const ctx = getCtx();
      if (!c || !ctx) return;
      ctx.clearRect(0, 0, c.width, c.height);
      setEmpty(true);
      onChange?.(null);
    }, [getCtx, onChange]);

    const toDataURL = useCallback(() => {
      if (empty) return null;
      return canvasRef.current?.toDataURL("image/png") ?? null;
    }, [empty]);

    useImperativeHandle(ref, () => ({ clear, toDataURL, isEmpty: () => empty }), [
      clear,
      toDataURL,
      empty,
    ]);

    const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (disabled) return;
      const ctx = getCtx();
      if (!ctx) return;
      drawingRef.current = true;
      const rect = canvasRef.current!.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
      e.currentTarget.setPointerCapture(e.pointerId);
    };
    const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawingRef.current) return;
      const ctx = getCtx();
      if (!ctx) return;
      const rect = canvasRef.current!.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
      if (empty) setEmpty(false);
    };
    const end = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      e.currentTarget.releasePointerCapture?.(e.pointerId);
      onChange?.(canvasRef.current?.toDataURL("image/png") ?? null);
    };

    return (
      <div data-slot="root" className={cx(SP_CLASS, className)} {...rest}>
        {label && <label className={SP_LABEL_CLASS}>{label}</label>}
        <div
          ref={wrapRef}
          className={SP_CANVAS_WRAP_CLASS}
          data-disabled={disabled ? "true" : "false"}
          style={{ height }}
        >
          <canvas
            ref={canvasRef}
            className={SP_CANVAS_CLASS}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
          />
          {empty && <span className={SP_PLACEHOLDER_CLASS}>{placeholder}</span>}
        </div>
        {!hideControls && (
          <div className={SP_CONTROLS_CLASS}>
            <button
              type="button"
              className={SP_BTN_CLASS}
              onClick={clear}
              disabled={disabled || empty}
            >
              지우기
            </button>
          </div>
        )}
      </div>
    );
  },
);

SignaturePad.displayName = "SignaturePad";
