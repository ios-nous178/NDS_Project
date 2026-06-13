import React from "react";
import { StarRating } from "./StarRating.js";

/* ─── Constants ─── */

const RC_CLASS = "nds-review-card";
const RC_HEADER_CLASS = `${RC_CLASS}__header`;
const RC_AUTHOR_AREA_CLASS = `${RC_CLASS}__author-area`;
const RC_AUTHOR_CLASS = `${RC_CLASS}__author`;
const RC_VERIFIED_CLASS = `${RC_CLASS}__verified`;
const RC_META_CLASS = `${RC_CLASS}__meta`;

const VerifiedCheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
    role="img"
    aria-label="인증됨"
  >
    <path
      d="M3 7L6 10L11 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const RC_RATING_CLASS = `${RC_CLASS}__rating`;
const RC_BODY_CLASS = `${RC_CLASS}__body`;
const RC_TAGS_CLASS = `${RC_CLASS}__tags`;
const RC_TAG_CLASS = `${RC_CLASS}__tag`;
const RC_FOOTER_CLASS = `${RC_CLASS}__footer`;

/* ─── Types ─── */

export interface ReviewCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 작성자 아바타 */
  avatar?: React.ReactNode;
  /** 작성자 이름 */
  author: React.ReactNode;
  /** 보조 메타 (작성일, 인증 뱃지 등) */
  meta?: React.ReactNode;
  /** 별점 (0~5, 0.5 단위) */
  rating: number;
  /** 별점 옆 라벨 (예: "5.0", "★ 4.7") */
  ratingLabel?: React.ReactNode;
  /** 제목 (선택) */
  title?: React.ReactNode;
  /** 본문 */
  body: React.ReactNode;
  /** 태그 (장점/카테고리 등) */
  tags?: string[];
  /** 푸터 슬롯 (좋아요 버튼 등) */
  footer?: React.ReactNode;
  /** 검증된 후기 마크 (작성자 이름 옆에 자동 표시) */
  verified?: boolean;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const ReviewCard = React.forwardRef<HTMLDivElement, ReviewCardProps>(
  (
    {
      avatar,
      author,
      meta,
      rating,
      ratingLabel,
      title,
      body,
      tags,
      footer,
      verified = false,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div ref={ref} data-slot="root" className={cx(RC_CLASS, className)} {...rest}>
        <div className={RC_HEADER_CLASS}>
          <div className={RC_AUTHOR_AREA_CLASS}>
            {avatar}
            <div className={RC_AUTHOR_CLASS}>
              <strong>
                {author}
                {verified && (
                  <span className={RC_VERIFIED_CLASS}>
                    <VerifiedCheckIcon />
                  </span>
                )}
              </strong>
              {meta && <span className={RC_META_CLASS}>{meta}</span>}
            </div>
          </div>
          <div className={RC_RATING_CLASS}>
            <StarRating value={rating} max={5} size={14} precision="half" aria-hidden />
            {ratingLabel !== undefined && (
              <span className={`${RC_RATING_CLASS}__label`}>{ratingLabel}</span>
            )}
          </div>
        </div>
        <div className={RC_BODY_CLASS}>
          {title && <h4>{title}</h4>}
          {body}
        </div>
        {tags && tags.length > 0 && (
          <div className={RC_TAGS_CLASS}>
            {tags.map((t) => (
              <span key={t} className={RC_TAG_CLASS}>
                #{t}
              </span>
            ))}
          </div>
        )}
        {footer && <div className={RC_FOOTER_CLASS}>{footer}</div>}
      </div>
    );
  },
);

ReviewCard.displayName = "ReviewCard";
