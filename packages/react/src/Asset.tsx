import React, { useCallback, useState } from "react";

/**
 * Asset — Toss TDS 식 통합 미디어 컴포넌트.
 *
 * 한 컴포넌트가 image / icon / lottie / initial / custom 을 동일한 Frame 위에 표현해
 * 모양·크기·overlap·status accessory 일관성을 강제한다.
 *
 *   <Asset />
 *     ├─ Frame      shape × size 프리셋
 *     ├─ Content    type 에 따라 image | icon | lottie | initial | custom
 *     └─ Union      overlap (겹침 표현) · acc (상태 점/뱃지)
 */

const AS_CLASS = "nds-asset";
const AS_FRAME_CLASS = `${AS_CLASS}__frame`;
const AS_CONTENT_CLASS = `${AS_CLASS}__content`;
const AS_ACC_CLASS = `${AS_CLASS}__acc`;
const AS_INITIAL_CLASS = `${AS_CLASS}__initial`;

const SIZE_PRESET = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
  "2xl": 120,
} as const;

export type AssetSizePreset = keyof typeof SIZE_PRESET;
export type AssetSize = AssetSizePreset | number;
export type AssetShape = "square" | "rounded" | "circle";
export type AssetScaleType = "cover" | "contain" | "fill";

// shape='rounded' cornerRadius — Avatar 와 동일(사이즈별 4/6/8/10/12), 2xl=14.
const ROUNDED_PRESET: Record<AssetSizePreset, number> = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  "2xl": 14,
};

export type AssetContent =
  | { type: "image"; src: string; alt?: string }
  | { type: "icon"; icon: React.ReactNode }
  | { type: "initial"; name: string }
  | { type: "lottie"; src: string; alt?: string }
  | { type: "custom"; render: React.ReactNode };

const cx = (...c: Array<string | undefined | false | null>) => c.filter(Boolean).join(" ");

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const resolveSize = (size: AssetSize) =>
  typeof size === "number" ? size : SIZE_PRESET[size];

/** shape='rounded' 의 cornerRadius(px). 프리셋은 ROUNDED_PRESET, 임의 px 은 비율(~0.16, min 4)로. */
const resolveRounded = (size: AssetSize) =>
  typeof size === "number" ? Math.max(4, Math.round(size * 0.16)) : ROUNDED_PRESET[size];

export interface AssetProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  /** Frame 모양 — square(0 radius) / rounded(8) / circle(원) */
  shape?: AssetShape;
  /** Frame 크기 — 프리셋 xs/sm/md/lg/xl/2xl 또는 임의 px */
  size?: AssetSize;
  /** Content 정의 */
  content: AssetContent;
  /** image / lottie 의 채움 방식 */
  scaleType?: AssetScaleType;
  /**
   * Union — overlap. AvatarGroup 처럼 다른 Asset 위에 겹쳐 놓일 때 우측 마진 음수로
   * 겹침 정도를 제어한다. 단독 사용 시 0.
   */
  overlap?: number;
  /**
   * Union — accessory. 우측 하단에 작은 상태 표시(상태 점, Badge dot, count 등).
   */
  acc?: React.ReactNode;
}

export const Asset = React.forwardRef<HTMLDivElement, AssetProps>(
  (
    {
      shape = "circle",
      size = "md",
      content,
      scaleType = "cover",
      overlap = 0,
      acc,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const [imgError, setImgError] = useState(false);
    const handleError = useCallback(() => setImgError(true), []);
    const sizePx = resolveSize(size);
    const roundedPx = resolveRounded(size);

    const renderContent = () => {
      switch (content.type) {
        case "image":
          if (!content.src || imgError) {
            return (
              <span className={AS_INITIAL_CLASS} aria-hidden="true">
                {content.alt ? getInitials(content.alt) : ""}
              </span>
            );
          }
          return (
            <img
              data-slot="image"
              className={AS_CONTENT_CLASS}
              src={content.src}
              alt={content.alt ?? ""}
              onError={handleError}
              style={{ objectFit: scaleType }}
            />
          );
        case "icon":
          return (
            <span data-slot="icon" className={AS_CONTENT_CLASS} aria-hidden="true">
              {content.icon}
            </span>
          );
        case "initial":
          return <span className={AS_INITIAL_CLASS}>{getInitials(content.name)}</span>;
        case "lottie":
          return (
            <img
              data-slot="lottie"
              className={AS_CONTENT_CLASS}
              src={content.src}
              alt={content.alt ?? ""}
              style={{ objectFit: scaleType }}
            />
          );
        case "custom":
          return (
            <span data-slot="custom" className={AS_CONTENT_CLASS}>
              {content.render}
            </span>
          );
      }
    };

    return (
      <div
        ref={ref}
        data-slot="root"
        data-shape={shape}
        data-content={content.type}
        className={cx(AS_CLASS, className)}
        style={
          {
            "--nds-asset-size": `${sizePx}px`,
            "--nds-asset-radius": `${roundedPx}px`,
            "--nds-asset-overlap": overlap ? `-${overlap}px` : "0",
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        <div className={AS_FRAME_CLASS} data-slot="frame">
          {renderContent()}
        </div>
        {acc ? (
          <span className={AS_ACC_CLASS} data-slot="acc" aria-hidden="true">
            {acc}
          </span>
        ) : null}
      </div>
    );
  },
);

Asset.displayName = "Asset";
