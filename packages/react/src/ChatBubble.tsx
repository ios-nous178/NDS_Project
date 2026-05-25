import React from "react";

/* ─── Constants ─── */

const CB_CLASS = "nds-chat-bubble";
const CB_ROW_CLASS = `${CB_CLASS}__row`;
const CB_AVATAR_CLASS = `${CB_CLASS}__avatar`;
const CB_BODY_CLASS = `${CB_CLASS}__body`;
const CB_NAME_CLASS = `${CB_CLASS}__name`;
const CB_BUBBLE_CLASS = `${CB_CLASS}__bubble`;
const CB_META_CLASS = `${CB_CLASS}__meta`;
const CB_TIME_CLASS = `${CB_CLASS}__time`;
const CB_READ_CLASS = `${CB_CLASS}__read`;

/* ─── Types ─── */

export type ChatRole = "me" | "them";
export type ChatGroupPosition = "single" | "first" | "middle" | "last";
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

const initialsOf = (name?: string) =>
  name
    ? name
        .trim()
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

/* ─── Component ─── */

export interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 발신자 */
  role: ChatRole;
  /** 메시지 본문 (텍스트 또는 ReactNode) */
  children: React.ReactNode;
  /** 시간 (예: "오후 3:24") */
  time?: React.ReactNode;
  /** 발신자 이름 (them 측에서 그룹 첫 메시지에 표시) */
  name?: string;
  /** 프로필 이미지 (them 측 아바타) */
  avatarSrc?: string;
  /** 그룹 내 위치 — 코너 처리에 사용 */
  group?: ChatGroupPosition;
  /** 읽음 표시 (me 측) */
  read?: boolean;
}

export const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ role, children, time, name, avatarSrc, group = "single", read, className, ...rest }, ref) => {
    const showAvatar = role === "them";
    const avatarHidden = showAvatar && group !== "single" && group !== "last";
    const showName = role === "them" && !!name && (group === "single" || group === "first");
    const showTime = !!time && (group === "single" || group === "last");

    return (
      <div
        ref={ref}
        data-slot="row"
        data-role={role}
        data-group={group}
        className={cx(CB_ROW_CLASS, className)}
        {...rest}
      >
        {showAvatar && (
          <span
            data-slot="avatar"
            data-hidden={avatarHidden ? "true" : undefined}
            className={CB_AVATAR_CLASS}
            aria-hidden="true"
          >
            {avatarSrc ? <img src={avatarSrc} alt="" /> : initialsOf(name)}
          </span>
        )}
        <div data-slot="body" className={CB_BODY_CLASS}>
          {showName && (
            <span data-slot="name" className={CB_NAME_CLASS}>
              {name}
            </span>
          )}
          <div data-slot="bubble" className={CB_BUBBLE_CLASS}>
            {children}
          </div>
          {(showTime || (role === "me" && read)) && (
            <div data-slot="meta" className={CB_META_CLASS}>
              {role === "me" && read && (
                <span data-slot="read" className={CB_READ_CLASS}>
                  읽음
                </span>
              )}
              {showTime && (
                <span data-slot="time" className={CB_TIME_CLASS}>
                  {time}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);

ChatBubble.displayName = "ChatBubble";
