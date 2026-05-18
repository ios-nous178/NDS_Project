import React from "react";
import { cv, fontFamily, fontWeight, spacing, transition, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const CI_CLASS = "nds-comment-item";
const CI_AVATAR_CLASS = `${CI_CLASS}__avatar`;
const CI_BODY_CLASS = `${CI_CLASS}__body`;
const CI_HEAD_CLASS = `${CI_CLASS}__head`;
const CI_AUTHOR_CLASS = `${CI_CLASS}__author`;
const CI_TIME_CLASS = `${CI_CLASS}__time`;
const CI_TEXT_CLASS = `${CI_CLASS}__text`;
const CI_ACTIONS_CLASS = `${CI_CLASS}__actions`;
const CI_ACTION_CLASS = `${CI_CLASS}__action`;
const CI_REPLIES_CLASS = `${CI_CLASS}__replies`;

/* ─── Types ─── */

export interface CommentItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** 작성자 아바타 (Avatar 컴포넌트 등) */
  avatar?: React.ReactNode;
  /** 작성자 이름 */
  author: React.ReactNode;
  /** 작성자 뱃지 (예: 작성자 본인, 상담사) */
  authorBadge?: React.ReactNode;
  /** 시간 라벨 */
  time?: React.ReactNode;
  /** 본문 */
  text: React.ReactNode;
  /** 좋아요 버튼 (LikeButton 등) */
  likeAction?: React.ReactNode;
  /** 답글 버튼 클릭 콜백 (지정 시 답글 버튼 노출) */
  onReply?: () => void;
  /** 답글 버튼 라벨 */
  replyLabel?: string;
  /** 더보기 메뉴 (DropdownMenu 등) */
  more?: React.ReactNode;
  /** 답글 영역 (자식 CommentItem 묶음). 들여쓰기 자동 */
  replies?: React.ReactNode;
  /** 답글일 때 시각적 들여쓰기 (자동 false) */
  isReply?: boolean;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const ciStyles = `
  :where(.${CI_CLASS}) {
    display: flex;
    gap: var(--gap-comfortable);
    padding: var(--inset-input) 0;
    font-family: ${fontFamily.web};
  }

  :where(.${CI_CLASS}[data-reply="true"]) {
    padding-left: var(--inset-modal);
  }

  :where(.${CI_AVATAR_CLASS}) {
    flex-shrink: 0;
  }

  :where(.${CI_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-tight);
  }

  :where(.${CI_HEAD_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-default);
    flex-wrap: wrap;
  }

  :where(.${CI_AUTHOR_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
    color: ${cv.textRole.normal};
  }

  :where(.${CI_TIME_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${CI_TEXT_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.normal};
    margin: 0;
    word-break: break-word;
    white-space: pre-wrap;
  }

  :where(.${CI_ACTIONS_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-comfortable);
    margin-top: ${spacing[4]}px;
  }

  :where(.${CI_ACTION_CLASS}) {
    border: none;
    background: transparent;
    padding: 0;
    color: ${cv.textRole.subtle};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
    transition: color ${transition.default};
  }

  :where(.${CI_ACTION_CLASS}:hover) { color: ${cv.textRole.normal}; }

  :where(.${CI_REPLIES_CLASS}) {
    margin-top: ${spacing[8]}px;
    border-left: 2px solid ${cv.borderRole.subtle};
    padding-left: var(--inset-input);
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const CommentItem = React.forwardRef<HTMLDivElement, CommentItemProps>(
  (
    {
      avatar,
      author,
      authorBadge,
      time,
      text,
      likeAction,
      onReply,
      replyLabel = "답글",
      more,
      replies,
      isReply = false,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-slot="root"
        data-reply={isReply ? "true" : "false"}
        className={cx(CI_CLASS, className)}
        {...rest}
      >
        {avatar && <div className={CI_AVATAR_CLASS}>{avatar}</div>}
        <div className={CI_BODY_CLASS}>
          <div className={CI_HEAD_CLASS}>
            <span className={CI_AUTHOR_CLASS}>{author}</span>
            {authorBadge}
            {time && <span className={CI_TIME_CLASS}>{time}</span>}
            {more && <span style={{ marginLeft: "auto" }}>{more}</span>}
          </div>
          <p className={CI_TEXT_CLASS}>{text}</p>
          {(likeAction || onReply) && (
            <div className={CI_ACTIONS_CLASS}>
              {likeAction}
              {onReply && (
                <button type="button" className={CI_ACTION_CLASS} onClick={onReply}>
                  {replyLabel}
                </button>
              )}
            </div>
          )}
          {replies && <div className={CI_REPLIES_CLASS}>{replies}</div>}
        </div>
      </div>
    );
  },
);

CommentItem.displayName = "CommentItem";
