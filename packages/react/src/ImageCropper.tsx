import React, { useEffect, useImperativeHandle, useRef, useState } from "react";

/* ─── Constants ─── */

const IC_CLASS = "nds-image-cropper";
const IC_VIEWPORT_CLASS = `${IC_CLASS}__viewport`;
const IC_IMG_CLASS = `${IC_CLASS}__img`;
const IC_OVERLAY_CLASS = `${IC_CLASS}__overlay`;
const IC_CIRCLE_CLASS = `${IC_CLASS}__circle`;
const IC_HINT_CLASS = `${IC_CLASS}__hint`;
const IC_CONTROLS_CLASS = `${IC_CLASS}__controls`;
const IC_LABEL_CLASS = `${IC_CLASS}__label`;
const IC_ZOOM_BTN_CLASS = `${IC_CLASS}__zoom-btn`;
const IC_ZOOM_VALUE_CLASS = `${IC_CLASS}__zoom-value`;
const IC_SLIDER_CLASS = `${IC_CLASS}__slider`;

/* ─── Types ─── */

export interface ImageCropperHandle {
  /** 현재 크롭 영역을 PNG dataURL로 추출 */
  toDataURL: (size?: number) => string | null;
}

export interface ImageCropperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onLoad"> {
  /** 이미지 src */
  src: string;
  /** 자르기 모양 (기본 원형) */
  shape?: "circle" | "square";
  /** 뷰포트 크기 px (정사각) */
  size?: number;
  /** 출력 dataURL 크기 px (기본 size와 동일) */
  outputSize?: number;
  /** 라벨 (위) */
  label?: React.ReactNode;
  /** 줌 변경 콜백 (선택) */
  onZoomChange?: (zoom: number) => void;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const ImageCropper = React.forwardRef<ImageCropperHandle, ImageCropperProps>(
  (
    { src, shape = "circle", size = 240, outputSize, label, onZoomChange, className, ...rest },
    ref,
  ) => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const dragRef = useRef<{ x: number; y: number; sx: number; sy: number } | null>(null);
    const [zoom, setZoom] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [grabbing, setGrabbing] = useState(false);
    const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });

    useEffect(() => {
      onZoomChange?.(zoom);
    }, [zoom, onZoomChange]);

    const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
      dragRef.current = { x: e.clientX, y: e.clientY, sx: pos.x, sy: pos.y };
      setGrabbing(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };
    const moveDrag = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.x;
      const dy = e.clientY - dragRef.current.y;
      setPos({ x: dragRef.current.sx + dx, y: dragRef.current.sy + dy });
    };
    const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
      dragRef.current = null;
      setGrabbing(false);
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    };

    useImperativeHandle(
      ref,
      () => ({
        toDataURL: (out = outputSize ?? size) => {
          const img = imgRef.current;
          if (!img || !naturalSize.w) return null;
          const canvas = document.createElement("canvas");
          canvas.width = out;
          canvas.height = out;
          const ctx = canvas.getContext("2d");
          if (!ctx) return null;
          // viewport 좌표계에서 이미지 위치/스케일을 출력 캔버스로 매핑
          // 보여진 이미지 크기 (cover): viewport size 기준 contain → object-fit이 아니므로 직접 계산
          const baseScale = size / Math.min(naturalSize.w, naturalSize.h);
          const drawW = naturalSize.w * baseScale * zoom;
          const drawH = naturalSize.h * baseScale * zoom;
          const ratio = out / size;
          const sx = (size / 2 + pos.x - drawW / 2) * ratio;
          const sy = (size / 2 + pos.y - drawH / 2) * ratio;
          if (shape === "circle") {
            ctx.beginPath();
            ctx.arc(out / 2, out / 2, out / 2, 0, Math.PI * 2);
            ctx.clip();
          }
          ctx.drawImage(img, sx, sy, drawW * ratio, drawH * ratio);
          return canvas.toDataURL("image/png");
        },
      }),
      [outputSize, size, naturalSize, pos, zoom, shape],
    );

    const onLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
      setZoom(1);
      setPos({ x: 0, y: 0 });
    };

    const baseScale = naturalSize.w ? size / Math.min(naturalSize.w, naturalSize.h) : 1;

    const ZOOM_MIN = 1;
    const ZOOM_MAX = 3;
    const ZOOM_STEP = 0.1;
    const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
    const zoomPercent = Math.round(zoom * 100);

    return (
      <div data-slot="root" className={cx(IC_CLASS, className)} {...rest}>
        {label && <span className={IC_LABEL_CLASS}>{label}</span>}
        <div
          ref={viewportRef}
          className={IC_VIEWPORT_CLASS}
          data-grabbing={grabbing ? "true" : "false"}
          style={
            {
              "--nds-cropper-size": `${size}px`,
              "--nds-cropper-zoom": baseScale * zoom,
              "--nds-cropper-x": `${pos.x}px`,
              "--nds-cropper-y": `${pos.y}px`,
            } as React.CSSProperties
          }
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <img
            ref={imgRef}
            className={IC_IMG_CLASS}
            src={src}
            alt=""
            crossOrigin="anonymous"
            onLoad={onLoad}
            draggable={false}
          />
          <div className={IC_OVERLAY_CLASS} data-shape={shape}>
            <div className={IC_CIRCLE_CLASS} />
          </div>
        </div>
        <span className={IC_HINT_CLASS}>드래그해서 위치를 맞춰주세요</span>
        <div className={IC_CONTROLS_CLASS}>
          <button
            type="button"
            className={IC_ZOOM_BTN_CLASS}
            aria-label="축소"
            disabled={zoom <= ZOOM_MIN}
            onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <rect x="2" y="5.25" width="8" height="1.5" rx="0.75" fill="currentColor" />
            </svg>
          </button>
          <input
            className={IC_SLIDER_CLASS}
            type="range"
            min={ZOOM_MIN}
            max={ZOOM_MAX}
            step={0.05}
            value={zoom}
            aria-label="확대/축소"
            onChange={(e) => setZoom(Number(e.target.value))}
          />
          <button
            type="button"
            className={IC_ZOOM_BTN_CLASS}
            aria-label="확대"
            disabled={zoom >= ZOOM_MAX}
            onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <rect x="2" y="5.25" width="8" height="1.5" rx="0.75" fill="currentColor" />
              <rect x="5.25" y="2" width="1.5" height="8" rx="0.75" fill="currentColor" />
            </svg>
          </button>
          <span className={IC_ZOOM_VALUE_CLASS} aria-live="polite">
            {zoomPercent}%
          </span>
        </div>
      </div>
    );
  },
);

ImageCropper.displayName = "ImageCropper";
