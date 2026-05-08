import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const IC_CLASS = "nds-image-cropper";
const IC_VIEWPORT_CLASS = `${IC_CLASS}__viewport`;
const IC_IMG_CLASS = `${IC_CLASS}__img`;
const IC_OVERLAY_CLASS = `${IC_CLASS}__overlay`;
const IC_CIRCLE_CLASS = `${IC_CLASS}__circle`;
const IC_CONTROLS_CLASS = `${IC_CLASS}__controls`;
const IC_LABEL_CLASS = `${IC_CLASS}__label`;
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

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const icStyles = `
  :where(.${IC_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing[12]}px;
    font-family: ${fontFamily.web};
  }

  :where(.${IC_LABEL_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.medium};
    color: ${cv.text.default};
  }

  :where(.${IC_VIEWPORT_CLASS}) {
    position: relative;
    width: var(--nds-cropper-size, 240px);
    height: var(--nds-cropper-size, 240px);
    background: #000;
    overflow: hidden;
    user-select: none;
    touch-action: none;
    cursor: grab;
  }

  :where(.${IC_VIEWPORT_CLASS}[data-grabbing="true"]) {
    cursor: grabbing;
  }

  :where(.${IC_IMG_CLASS}) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translate(var(--nds-cropper-x, 0px), var(--nds-cropper-y, 0px)) scale(var(--nds-cropper-zoom, 1));
    transform-origin: center;
    pointer-events: none;
    user-select: none;
  }

  :where(.${IC_OVERLAY_CLASS}) {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  :where(.${IC_CIRCLE_CLASS}) {
    position: absolute;
    inset: 0;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.55);
    border: 2px solid #fff;
  }

  :where(.${IC_OVERLAY_CLASS}[data-shape="circle"]) .${IC_CIRCLE_CLASS} {
    border-radius: 9999px;
  }

  :where(.${IC_OVERLAY_CLASS}[data-shape="square"]) .${IC_CIRCLE_CLASS} {
    border-radius: ${radius.md}px;
  }

  :where(.${IC_CONTROLS_CLASS}) {
    width: 100%;
    max-width: 320px;
    display: flex;
    align-items: center;
    gap: ${spacing[12]}px;
  }

  :where(.${IC_SLIDER_CLASS}) {
    flex: 1;
    accent-color: ${cv.primary.main};
    cursor: pointer;
  }
`;

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
        <div className={IC_CONTROLS_CLASS}>
          <span style={{ fontSize: 12, color: "#666" }}>축소</span>
          <input
            className={IC_SLIDER_CLASS}
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            aria-label="확대/축소"
            onChange={(e) => setZoom(Number(e.target.value))}
          />
          <span style={{ fontSize: 12, color: "#666" }}>확대</span>
        </div>
      </div>
    );
  },
);

ImageCropper.displayName = "ImageCropper";
