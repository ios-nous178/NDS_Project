import React from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  shadow,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

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

// eslint-disable-next-line unused-imports/no-unused-vars
const counselorCardStyles = `
  :where(.${CN_CLASS}) {
    display: flex;
    gap: ${spacing[16]}px;
    padding: ${spacing[20]}px;
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    transition: border-color ${transition.default}, box-shadow ${transition.default};
  }

  :where(.${CN_CLASS}[data-clickable="true"]) {
    cursor: pointer;
  }

  :where(.${CN_CLASS}[data-clickable="true"]:hover) {
    border-color: ${"#91CAF6"};
    box-shadow: ${shadow["1"]};
  }

  :where(.${CN_AVATAR_CLASS}) {
    flex-shrink: 0;
    width: 72px;
    height: 72px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.section};
    object-fit: cover;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.headline4.fontSize}px;
    font-weight: ${fontWeight.bold};
  }

  :where(.${CN_AVATAR_CLASS}) img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  :where(.${CN_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: ${spacing[8]}px;
  }

  :where(.${CN_HEADER_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[2]}px;
  }

  :where(.${CN_NAME_CLASS}) {
    font-size: ${typeScale.headline5.fontSize}px;
    line-height: ${typeScale.headline5.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${CN_TITLE_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${CN_RATING_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
  }

  :where(.${CN_RATING_VALUE_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
  }

  :where(.${CN_RATING_COUNT_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${CN_TAGS_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    gap: ${spacing[6]}px;
  }

  :where(.${CN_TAG_CLASS}) {
    display: inline-flex;
    align-items: center;
    padding: ${spacing[2]}px ${spacing[8]}px;
    background: ${cv.surface.page};
    color: ${cv.textRole.strong};
    border-radius: ${radius.pill}px;
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    font-weight: ${fontWeight.medium};
  }

  :where(.${CN_BIO_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.strong};
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  :where(.${CN_FOOTER_CLASS}) {
    margin-top: ${spacing[4]}px;
    display: flex;
    justify-content: flex-end;
  }

  :where(.${CN_CTA_CLASS}) {
    all: unset;
    display: inline-flex;
    align-items: center;
    padding: ${spacing[8]}px ${spacing[16]}px;
    background: ${cv.surface.brand};
    color: ${cv.textRole.inverse};
    border-radius: ${radius.pill}px;
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    font-weight: ${fontWeight.bold};
    cursor: pointer;
    transition: background-color ${transition.default};
  }

  :where(.${CN_CTA_CLASS}:hover) {
    background: ${cv.fill.brandHover};
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M7 1L8.85 4.75L13 5.35L10 8.27L10.71 12.4L7 10.45L3.29 12.4L4 8.27L1 5.35L5.15 4.75L7 1Z"
      fill="#FFB800"
      stroke="#FFB800"
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
