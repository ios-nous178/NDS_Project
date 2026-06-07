import React from "react";

/* ─── Constants ─── */

const MC_CLASS = "nds-media-card";
const MC_MEDIA_CLASS = `${MC_CLASS}__media`;
const MC_MEDIA_INNER_CLASS = `${MC_CLASS}__media-inner`;
const MC_OVERLAY_CLASS = `${MC_CLASS}__overlay`;
const MC_BODY_CLASS = `${MC_CLASS}__body`;
const MC_EYEBROW_CLASS = `${MC_CLASS}__eyebrow`;
const MC_TITLE_CLASS = `${MC_CLASS}__title`;
const MC_BODY_TEXT_CLASS = `${MC_CLASS}__body-text`;
const MC_RATING_CLASS = `${MC_CLASS}__rating`;
const MC_FOOTER_CLASS = `${MC_CLASS}__footer`;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <path
      d="M7 1L8.85 4.75L13 5.35L10 8.27L10.71 12.4L7 10.45L3.29 12.4L4 8.27L1 5.35L5.15 4.75L7 1Z"
      fill={filled ? "#FFD54F" : "#E0E0E0"}
    />
  </svg>
);

const renderStars = (rating: number) => {
  const out: React.ReactElement[] = [];
  for (let i = 1; i <= 5; i++) {
    out.push(<StarIcon key={i} filled={rating >= i - 0.25} />);
  }
  return out;
};

/* ─── Types ─── */

export interface MediaCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 상단 미디어 (img/video/Placeholder ReactNode) */
  image: React.ReactNode;
  /** 미디어 우하단 오버레이 (예: "999+", "재생시간 02:13") */
  imageOverlay?: React.ReactNode;
  /** 미디어 영역 가로:세로 (CSS aspect-ratio 문법, 기본 "4 / 3") */
  imageAspectRatio?: string;
  /** 제목 위 보조 라벨 (브랜드 / 카테고리 / 회차 등) */
  eyebrow?: React.ReactNode;
  /** 제목 */
  title: React.ReactNode;
  /** 본문 (2줄 클램프) */
  body?: React.ReactNode;
  /** 별점 (0~5). 지정하면 푸터 영역에 별 5개 렌더. */
  rating?: number;
  /** 푸터 슬롯 (작성자·메타·CTA 등 자유 조합) */
  footer?: React.ReactNode;
  /** 카드 전체 클릭 핸들러 (지정 시 hover 상태/role/tabIndex 활성화) */
  onCardClick?: () => void;
}

/* ─── Component ─── */

export const MediaCard = React.forwardRef<HTMLDivElement, MediaCardProps>(
  (
    {
      image,
      imageOverlay,
      imageAspectRatio = "4 / 3",
      eyebrow,
      title,
      body,
      rating,
      footer,
      onCardClick,
      className,
      ...rest
    },
    ref,
  ) => {
    const isClickable = !!onCardClick;
    return (
      <div
        ref={ref}
        data-slot="root"
        data-clickable={isClickable || undefined}
        className={cx(MC_CLASS, className)}
        onClick={onCardClick}
        onKeyDown={
          isClickable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onCardClick?.();
                }
              }
            : undefined
        }
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        {...rest}
      >
        <div data-slot="media" className={MC_MEDIA_CLASS} style={{ aspectRatio: imageAspectRatio }}>
          <div className={MC_MEDIA_INNER_CLASS}>{image}</div>
          {imageOverlay !== undefined && (
            <span data-slot="overlay" className={MC_OVERLAY_CLASS}>
              {imageOverlay}
            </span>
          )}
        </div>
        <div data-slot="body" className={MC_BODY_CLASS}>
          {eyebrow !== undefined && (
            <span data-slot="eyebrow" className={MC_EYEBROW_CLASS}>
              {eyebrow}
            </span>
          )}
          <h3 data-slot="title" className={MC_TITLE_CLASS}>
            {title}
          </h3>
          {body !== undefined && (
            <p data-slot="body-text" className={MC_BODY_TEXT_CLASS}>
              {body}
            </p>
          )}
          {(rating !== undefined || footer !== undefined) && (
            <div data-slot="footer" className={MC_FOOTER_CLASS}>
              {footer}
              {rating !== undefined && (
                <span
                  data-slot="rating"
                  className={MC_RATING_CLASS}
                  aria-label={`평점 ${rating.toFixed(1)} / 5`}
                >
                  {renderStars(rating)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

MediaCard.displayName = "MediaCard";
