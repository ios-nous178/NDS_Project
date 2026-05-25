import React from "react";

/* ─── Constants ─── */

const JE_CLASS = "nds-journal-entry";
const JE_HEADER_CLASS = `${JE_CLASS}__header`;
const JE_DATE_CLASS = `${JE_CLASS}__date`;
const JE_MOOD_CLASS = `${JE_CLASS}__mood`;
const JE_TITLE_CLASS = `${JE_CLASS}__title`;
const JE_BODY_CLASS = `${JE_CLASS}__body`;
const JE_TAGS_CLASS = `${JE_CLASS}__tags`;
const JE_TAG_CLASS = `${JE_CLASS}__tag`;
const JE_FOOTER_CLASS = `${JE_CLASS}__footer`;
const JE_THUMB_CLASS = `${JE_CLASS}__thumb`;

/* ─── Types ─── */

export interface JournalEntryProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** ISO 날짜 또는 표시용 라벨 (예: "2026-05-08", "오늘") */
  date: React.ReactNode;
  /** 좌측 무드 이모지/아이콘 */
  mood?: React.ReactNode;
  /** 제목 (선택) */
  title?: React.ReactNode;
  /** 본문 미리보기 */
  body: React.ReactNode;
  /** 본문 최대 줄 수 (기본 3) */
  maxLines?: number;
  /** 태그 */
  tags?: string[];
  /** 우측 썸네일 */
  thumbnailSrc?: string;
  /** 푸터 영역 (예: "5분 전 기록", 좋아요 버튼 등) */
  footer?: React.ReactNode;
  /** 카드 클릭 (디테일 진입) */
  onClick?: () => void;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const JournalEntry = React.forwardRef<HTMLDivElement, JournalEntryProps>(
  (
    {
      date,
      mood,
      title,
      body,
      maxLines = 3,
      tags,
      thumbnailSrc,
      footer,
      onClick,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-slot="root"
        data-clickable={onClick ? "true" : "false"}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(e) => {
          if (onClick && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onClick();
          }
        }}
        className={cx(JE_CLASS, className)}
        style={{ "--nds-journal-lines": maxLines, ...style } as React.CSSProperties}
        {...rest}
      >
        <div className={`${JE_CLASS}__main`}>
          <div className={JE_HEADER_CLASS}>
            {mood && (
              <span className={JE_MOOD_CLASS} aria-hidden>
                {mood}
              </span>
            )}
            <span className={JE_DATE_CLASS}>{date}</span>
          </div>
          {title && <h3 className={JE_TITLE_CLASS}>{title}</h3>}
          <p className={JE_BODY_CLASS}>{body}</p>
          {tags && tags.length > 0 && (
            <div className={JE_TAGS_CLASS}>
              {tags.map((t) => (
                <span key={t} className={JE_TAG_CLASS}>
                  #{t}
                </span>
              ))}
            </div>
          )}
          {footer && <div className={JE_FOOTER_CLASS}>{footer}</div>}
        </div>
        {thumbnailSrc && <img className={JE_THUMB_CLASS} src={thumbnailSrc} alt="" />}
      </div>
    );
  },
);

JournalEntry.displayName = "JournalEntry";
