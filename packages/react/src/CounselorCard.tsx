import React from "react";

/* ─── Constants ─── */

const CN_CLASS = "nds-counselor-card";
const CN_AVATAR_CLASS = `${CN_CLASS}__avatar`;
const CN_BODY_CLASS = `${CN_CLASS}__body`;
const CN_HEADER_CLASS = `${CN_CLASS}__header`;
const CN_NAME_CLASS = `${CN_CLASS}__name`;
const CN_TITLE_CLASS = `${CN_CLASS}__title`;
const CN_RATING_CLASS = `${CN_CLASS}__rating`;
const CN_RATING_VALUE_CLASS = `${CN_CLASS}__rating-value`;
const CN_RATING_COUNT_CLASS = `${CN_CLASS}__rating-count`;
const CN_TAGS_CLASS = `${CN_CLASS}__tags`;
const CN_TAG_CLASS = `${CN_CLASS}__tag`;
const CN_BIO_CLASS = `${CN_CLASS}__bio`;
const CN_FOOTER_CLASS = `${CN_CLASS}__footer`;
const CN_CTA_CLASS = `${CN_CLASS}__cta`;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M7 1L8.85 4.75L13 5.35L10 8.27L10.71 12.4L7 10.45L3.29 12.4L4 8.27L1 5.35L5.15 4.75L7 1Z"
      fill="#FFD54F"
      stroke="#FFD54F"
      strokeWidth="0.5"
      strokeLinejoin="round"
    />
  </svg>
);

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/* ─── Component ─── */

export interface CounselorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 이름 */
  name: string;
  /** 직책/자격 (예: "임상심리전문가") */
  jobTitle?: React.ReactNode;
  /** 프로필 이미지 src */
  imageSrc?: string;
  /** 평점 (예: 4.8) */
  rating?: number;
  /** 리뷰 수 */
  reviewCount?: number;
  /** 전공/태그 (예: ["우울", "불안", "직장스트레스"]) */
  tags?: string[];
  /** 짧은 소개 (2줄까지 노출) */
  bio?: React.ReactNode;
  /** 예약 CTA 라벨 (제공 시 푸터에 버튼 표시) */
  ctaLabel?: string;
  /** CTA 클릭 */
  onCtaClick?: () => void;
  /** 카드 전체 클릭 (CTA와는 별개) */
  onCardClick?: () => void;
}

/**
 * @deprecated Card 합성으로 대체하세요 — `apps/storybook` 의 `Card.stories` CompoundCounselorCard 가
 * 동일 카드를 순수 Card 합성으로 렌더합니다 (`Card.Avatar` + `Card.Title`(이름) + `Card.Subtitle`(자격) +
 * `Card.Meta`(별점) + `Card.Chips`(태그) + `Card.Description`(bio) + `Card.Cta`(예약)).
 * 도메인 로직이 없어 Card 로 표현되며, 다음 major 에서 제거 예정입니다.
 */

export const CounselorCard = React.forwardRef<HTMLDivElement, CounselorCardProps>(
  (
    {
      name,
      jobTitle,
      imageSrc,
      rating,
      reviewCount,
      tags,
      bio,
      ctaLabel,
      onCtaClick,
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
        className={cx(CN_CLASS, className)}
        onClick={onCardClick}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        {...rest}
      >
        <span data-slot="avatar" className={CN_AVATAR_CLASS} aria-hidden="true">
          {imageSrc ? <img src={imageSrc} alt="" /> : initialsOf(name)}
        </span>
        <div data-slot="body" className={CN_BODY_CLASS}>
          <div data-slot="header" className={CN_HEADER_CLASS}>
            <h3 data-slot="name" className={CN_NAME_CLASS}>
              {name}
            </h3>
            {jobTitle && (
              <span data-slot="title" className={CN_TITLE_CLASS}>
                {jobTitle}
              </span>
            )}
          </div>
          {rating !== undefined && (
            <div data-slot="rating" className={CN_RATING_CLASS}>
              <StarIcon />
              <span data-slot="rating-value" className={CN_RATING_VALUE_CLASS}>
                {rating.toFixed(1)}
              </span>
              {reviewCount !== undefined && (
                <span data-slot="rating-count" className={CN_RATING_COUNT_CLASS}>
                  ({reviewCount.toLocaleString()})
                </span>
              )}
            </div>
          )}
          {tags && tags.length > 0 && (
            <div data-slot="tags" className={CN_TAGS_CLASS}>
              {tags.map((t) => (
                <span key={t} data-slot="tag" className={CN_TAG_CLASS}>
                  {t}
                </span>
              ))}
            </div>
          )}
          {bio && (
            <p data-slot="bio" className={CN_BIO_CLASS}>
              {bio}
            </p>
          )}
          {ctaLabel && (
            <div data-slot="footer" className={CN_FOOTER_CLASS}>
              <button
                data-slot="cta"
                className={CN_CTA_CLASS}
                onClick={(e) => {
                  e.stopPropagation();
                  onCtaClick?.();
                }}
              >
                {ctaLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  },
);

CounselorCard.displayName = "CounselorCard";
