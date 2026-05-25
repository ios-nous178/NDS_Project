import React from "react";

/* ─── Constants ─── */

const BN_CLASS = "nds-banner";
const BN_CONTENT_CLASS = `${BN_CLASS}__content`;
const BN_TITLE_CLASS = `${BN_CLASS}__title`;
const BN_DESC_CLASS = `${BN_CLASS}__description`;
const BN_ACTION_CLASS = `${BN_CLASS}__action`;
const BN_IMAGE_CLASS = `${BN_CLASS}__image`;
const BN_CLOSE_CLASS = `${BN_CLASS}__close`;

/* ─── Types ─── */

export type BannerVariant = "filled" | "outlined" | "image";
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M7.5 4L13.5 10L7.5 16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ─── Component ─── */

export interface BannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 배너 스타일 변형 */
  variant?: BannerVariant;
  /** 제목 */
  title?: React.ReactNode;
  /** 설명 */
  description?: React.ReactNode;
  /** 액션 텍스트 (예: "앱 다운로드 하기") */
  actionLabel?: string;
  /** 액션 클릭 */
  onAction?: () => void;
  /** 액션 링크 href (onAction 대신 사용) */
  actionHref?: string;
  /** 우측 이미지 src */
  imageSrc?: string;
  /** 이미지 alt */
  imageAlt?: string;
  /** 이미지 너비 */
  imageWidth?: number;
  /** 이미지 높이 */
  imageHeight?: number;
  /** 전체 배너를 링크로 만들 때 href */
  href?: string;
  /** 닫기 가능 여부 */
  closable?: boolean;
  /** 닫기 콜백 */
  onClose?: () => void;
  /** image variant일 때 전체 이미지 src */
  fullImageSrc?: string;
  /** 전체 이미지 srcSet */
  fullImageSrcSet?: string;
}

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      variant = "filled",
      title,
      description,
      actionLabel,
      onAction,
      actionHref,
      imageSrc,
      imageAlt = "",
      imageWidth,
      imageHeight,
      href,
      closable = false,
      onClose,
      fullImageSrc,
      fullImageSrcSet,
      className,
      style,
      children,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const isClickable = !!href || !!onClick;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (href) {
        window.open(href, "_blank", "noopener,noreferrer");
      }
      onClick?.(e);
    };

    // image variant — 전체가 이미지인 배너
    if (variant === "image") {
      return (
        <div
          ref={ref}
          data-slot="root"
          data-variant="image"
          data-clickable={isClickable || undefined}
          className={cx(BN_CLASS, className)}
          style={style}
          onClick={handleClick}
          role={isClickable ? "link" : undefined}
          {...rest}
        >
          {children ?? (
            <img
              className={BN_IMAGE_CLASS}
              src={fullImageSrc}
              srcSet={fullImageSrcSet}
              alt={imageAlt}
              loading="lazy"
            />
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        data-slot="root"
        data-variant={variant}
        data-clickable={isClickable || undefined}
        className={cx(BN_CLASS, className)}
        style={style}
        onClick={isClickable ? handleClick : undefined}
        role={isClickable ? "link" : undefined}
        {...rest}
      >
        {children ?? (
          <>
            <div data-slot="content" className={BN_CONTENT_CLASS}>
              {title && (
                <div data-slot="title" className={BN_TITLE_CLASS}>
                  {title}
                </div>
              )}
              {description && (
                <div data-slot="description" className={BN_DESC_CLASS}>
                  {description}
                </div>
              )}
              {actionLabel &&
                (actionHref ? (
                  <a
                    data-slot="action"
                    className={BN_ACTION_CLASS}
                    href={actionHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actionLabel}
                    <ChevronRight />
                  </a>
                ) : (
                  <button
                    data-slot="action"
                    className={BN_ACTION_CLASS}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction?.();
                    }}
                  >
                    {actionLabel}
                    <ChevronRight />
                  </button>
                ))}
            </div>
            {imageSrc && (
              <img
                data-slot="image"
                className={BN_IMAGE_CLASS}
                src={imageSrc}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
              />
            )}
          </>
        )}
        {closable && (
          <button
            data-slot="close"
            className={BN_CLOSE_CLASS}
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            aria-label="닫기"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    );
  },
);

Banner.displayName = "Banner";
