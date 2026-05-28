import React, { useEffect, useState } from "react";
import { radius } from "@nudge-design/tokens";

/* ─── Constants ─── */

const MT_CLASS = "nds-media-thumbnail";
const MT_IMG_CLASS = `${MT_CLASS}__img`;
const MT_PLACEHOLDER_CLASS = `${MT_CLASS}__placeholder`;

/* ─── Types ─── */

export type MediaRounded = "none" | "sm" | "md" | "lg" | "pill";
export type MediaFit = "cover" | "contain";

const ROUND_PX: Record<MediaRounded, number | string> = {
  none: 0,
  sm: radius.sm,
  md: radius.md,
  lg: radius.lg,
  pill: radius.pill,
};
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const ImagePlaceholder = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="4" y="6" width="24" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="11" cy="13" r="2" fill="currentColor" />
    <path d="M5 22L11 17L17 22L27 14" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

/* ─── Component ─── */

export interface MediaThumbnailProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "loading" | "src" | "alt"
> {
  /** 이미지 src */
  src: string;
  /** 대체 텍스트 (필수, 장식용이면 빈 문자열) */
  alt: string;
  /** 종횡비 (예: "16/9", "4/3", "1/1", 또는 숫자) */
  aspectRatio?: string | number;
  /** width (CSS 값) */
  width?: number | string;
  /** object-fit */
  fit?: MediaFit;
  /** 모서리 둥글기 */
  rounded?: MediaRounded;
  /** 로드 실패 시 시도할 fallback src */
  fallbackSrc?: string;
  /** 로딩/에러 시 자리 표시 (기본: 이미지 아이콘) */
  placeholder?: React.ReactNode;
  /** lazy loading (기본 true) */
  lazy?: boolean;
  /** 루트 className */
  className?: string;
  /** 루트 style 추가 */
  rootStyle?: React.CSSProperties;
}

export const MediaThumbnail = React.forwardRef<HTMLImageElement, MediaThumbnailProps>(
  (
    {
      src,
      alt,
      aspectRatio,
      width,
      fit = "cover",
      rounded = "md",
      fallbackSrc,
      placeholder,
      lazy = true,
      className,
      rootStyle,
      ...imgProps
    },
    ref,
  ) => {
    const [currentSrc, setCurrentSrc] = useState(src);
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);

    useEffect(() => {
      setCurrentSrc(src);
      setLoaded(false);
      setErrored(false);
    }, [src]);

    const handleError = () => {
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        return;
      }
      setErrored(true);
    };

    const ratio = typeof aspectRatio === "number" ? `${aspectRatio} / 1` : aspectRatio;

    return (
      <span
        data-slot="root"
        className={cx(MT_CLASS, className)}
        style={{
          width,
          aspectRatio: ratio,
          borderRadius: ROUND_PX[rounded],
          ...rootStyle,
        }}
      >
        {!errored && (
          <img
            ref={ref}
            data-slot="img"
            data-loaded={loaded ? "true" : "false"}
            className={MT_IMG_CLASS}
            src={currentSrc}
            alt={alt}
            loading={lazy ? "lazy" : "eager"}
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={handleError}
            style={{ objectFit: fit }}
            {...imgProps}
          />
        )}
        {(!loaded || errored) && (
          <span data-slot="placeholder" className={MT_PLACEHOLDER_CLASS} aria-hidden="true">
            {placeholder ?? <ImagePlaceholder />}
          </span>
        )}
      </span>
    );
  },
);

MediaThumbnail.displayName = "MediaThumbnail";
