import React, { useCallback, useState } from "react";
import { cv, fontFamily, fontWeight, radius, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const AV_CLASS = "nds-avatar";
const AV_IMAGE_CLASS = `${AV_CLASS}__image`;
const AV_FALLBACK_CLASS = `${AV_CLASS}__fallback`;

/* ─── Sizes ─── */

const sizeConfig = {
  xs: { size: 24, fontSize: 10 },
  sm: { size: 32, fontSize: 12 },
  md: { size: 40, fontSize: 14 },
  lg: { size: 48, fontSize: 16 },
  xl: { size: 64, fontSize: 20 },
} as const;

export type AvatarSize = keyof typeof sizeConfig;

// eslint-disable-next-line unused-imports/no-unused-vars
const avatarStyles = `
  :where(.${AV_CLASS}) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--nds-avatar-size, 40px);
    height: var(--nds-avatar-size, 40px);
    border-radius: ${radius.pill}px;
    background: var(--nds-avatar-bg, ${cv.surface.section});
    overflow: hidden;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${AV_IMAGE_CLASS}) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  :where(.${AV_FALLBACK_CLASS}) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: var(--nds-avatar-font-size, ${typeScale.body3.fontSize}px);
    font-weight: ${fontWeight.medium};
    color: ${cv.textRole.subtle};
    user-select: none;
  }

  :where(.${AV_FALLBACK_CLASS} svg) {
    width: 60%;
    height: 60%;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/** 이름에서 이니셜 추출 */
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

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
  /** 크기 */
  size?: AvatarSize;
  /** 커스텀 폴백 렌더 */
  fallback?: React.ReactNode;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = "", name, size = "md", fallback, className, style, ...rest }, ref) => {
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
        className={cx(AV_CLASS, className)}
        style={
          {
            "--nds-avatar-size": `${s.size}px`,
            "--nds-avatar-font-size": `${s.fontSize}px`,
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
