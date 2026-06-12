import React, { useCallback, useState } from "react";

/* ─── Constants ─── */

const AV_CLASS = "nds-avatar";
const AV_IMAGE_CLASS = `${AV_CLASS}__image`;
const AV_FALLBACK_CLASS = `${AV_CLASS}__fallback`;

/* ─── Sizes (Figma 1337:8 — 24/32/48/64/96, 5종) ─── */
/** rounded: shape='rounded' 일 때 cornerRadius (Figma 사이즈별 4/6/8/10/12). */
const sizeConfig = {
  xs: { size: 24, fontSize: 11, rounded: 4 },
  sm: { size: 32, fontSize: 14, rounded: 6 },
  md: { size: 48, fontSize: 20, rounded: 8 },
  lg: { size: 64, fontSize: 26, rounded: 10 },
  xl: { size: 96, fontSize: 38, rounded: 12 },
} as const;

export type AvatarSize = keyof typeof sizeConfig;

/** Avatar 사이즈별 px/fontSize/rounded — AvatarGroup 등이 동일 스케일을 재사용(중복 하드코딩 drift 방지). */
export const avatarSizeConfig = sizeConfig;

/* ─── Shapes (Figma 1337:8 — 3종) ─── */
export type AvatarShape = "square" | "rounded" | "circle";

/** shape → border-radius CSS 값. circle=완전 원, square=0, rounded=사이즈별 px. */
const resolveRadius = (shape: AvatarShape, rounded: number): string => {
  if (shape === "circle") return "9999px";
  if (shape === "square") return "0";
  return `${rounded}px`;
};

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/** 이름에서 이니셜 1자 추출 (Figma: 이미지 부재 시 이니셜 1자 Bold). */
const getInitials = (name: string): string => name.trim().charAt(0).toUpperCase();

/** 기본 사용자 아이콘 SVG */
const DefaultIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" fill="currentColor" />
    <path
      d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/* ─── Component ─── */

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 이미지 URL */
  src?: string | null;
  /** 이미지 alt 텍스트 */
  alt?: string;
  /** 폴백에 표시할 이름 (이니셜 추출) */
  name?: string;
  /** 크기 (Figma 24/32/48/64/96 = xs/sm/md/lg/xl) */
  size?: AvatarSize;
  /** 모양 (Figma Shape): circle(인물 프로필·기본) · rounded(앱/썸네일) · square(콘텐츠/제품 이미지) */
  shape?: AvatarShape;
  /** 커스텀 폴백 렌더 */
  fallback?: React.ReactNode;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = "", name, size = "md", shape = "circle", fallback, className, style, ...rest }, ref) => {
    const [imgError, setImgError] = useState(false);
    const s = sizeConfig[size];
    const showImage = src && !imgError;

    const handleError = useCallback(() => setImgError(true), []);

    const renderFallback = () => {
      if (fallback) return fallback;
      if (name) return <span className={AV_FALLBACK_CLASS}>{getInitials(name)}</span>;
      return (
        <span className={AV_FALLBACK_CLASS}>
          <DefaultIcon />
        </span>
      );
    };

    return (
      <div
        ref={ref}
        data-slot="root"
        data-size={size}
        data-shape={shape}
        className={cx(AV_CLASS, className)}
        style={
          {
            "--nds-avatar-size": `${s.size}px`,
            "--nds-avatar-font-size": `${s.fontSize}px`,
            "--nds-avatar-radius": resolveRadius(shape, s.rounded),
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {showImage ? (
          <img
            data-slot="image"
            className={AV_IMAGE_CLASS}
            src={src}
            alt={alt}
            onError={handleError}
          />
        ) : (
          renderFallback()
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";
