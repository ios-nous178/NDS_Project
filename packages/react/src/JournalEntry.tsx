import React from "react";
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-eap/tokens";

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

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const journalStyles = `
  :where(.${JE_CLASS}) {
    display: flex;
    gap: var(--gap-comfortable);
    padding: var(--inset-card);
    background: ${cv.surface.default};
    border: 1px solid ${cv.borderRole.subtle};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    transition: border-color ${transition.default};
    box-sizing: border-box;
  }

  :where(.${JE_CLASS}[data-clickable="true"]) { cursor: pointer; }
  :where(.${JE_CLASS}[data-clickable="true"]:hover) { border-color: ${cv.borderRole.brand}; }

  :where(.${JE_CLASS}__main) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-default);
  }

  :where(.${JE_HEADER_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-default);
  }

  :where(.${JE_MOOD_CLASS}) {
    width: 28px;
    height: 28px;
    border-radius: 9999px;
    background: ${cv.surface.section};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  :where(.${JE_DATE_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
    font-weight: ${fontWeight.medium};
  }

  :where(.${JE_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${JE_BODY_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: var(--nds-journal-lines, 3);
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-word;
  }

  :where(.${JE_TAGS_CLASS}) {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-tight);
  }

  :where(.${JE_TAG_CLASS}) {
    padding: 2px var(--inset-chip);
    border-radius: 9999px;
    background: ${cv.surface.section};
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    font-weight: ${fontWeight.medium};
  }

  :where(.${JE_FOOTER_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    line-height: ${typeScale.caption2.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${JE_THUMB_CLASS}) {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: ${radius.md}px;
    object-fit: cover;
    background: ${cv.surface.section};
  }
`;

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
