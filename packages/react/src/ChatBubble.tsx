import React from "react";
import { cv, fontFamily, fontWeight, radius, spacing, typeScale } from "@nudge-eap/tokens";

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

// eslint-disable-next-line unused-imports/no-unused-vars
const chatBubbleStyles = `
  :where(.${CB_ROW_CLASS}) {
    display: flex;
    align-items: flex-end;
    gap: ${spacing[8]}px;
    width: 100%;
    font-family: ${fontFamily.web};
    box-sizing: border-box;
  }

  :where(.${CB_ROW_CLASS}[data-role="me"]) {
    flex-direction: row-reverse;
  }

  :where(.${CB_AVATAR_CLASS}) {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: ${radius.pill}px;
    background: ${cv.surface.section};
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${cv.textRole.subtle};
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.bold};
  }

  :where(.${CB_AVATAR_CLASS}) img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  :where(.${CB_AVATAR_CLASS}[data-hidden="true"]) {
    visibility: hidden;
  }

  :where(.${CB_BODY_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[4]}px;
    max-width: 70%;
    min-width: 0;
  }

  :where(.${CB_ROW_CLASS}[data-role="me"]) .${CB_BODY_CLASS} {
    align-items: flex-end;
  }

  :where(.${CB_NAME_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    color: ${cv.textRole.subtle};
    padding: 0 ${spacing[4]}px;
  }

  :where(.${CB_BUBBLE_CLASS}) {
    padding: ${spacing[10]}px ${spacing[12]}px;
    background: ${cv.surface.page};
    color: ${cv.textRole.normal};
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    word-break: break-word;
    white-space: pre-wrap;
    border-radius: ${radius.lg}px;
  }

  :where(.${CB_ROW_CLASS}[data-role="me"]) .${CB_BUBBLE_CLASS} {
    background: ${cv.surface.brand};
    color: ${cv.textRole.inverse};
  }

  /* group corners — them */
  :where(.${CB_ROW_CLASS}[data-role="them"][data-group="first"]) .${CB_BUBBLE_CLASS} {
    border-bottom-left-radius: ${radius.sm}px;
  }
  :where(.${CB_ROW_CLASS}[data-role="them"][data-group="middle"]) .${CB_BUBBLE_CLASS} {
    border-top-left-radius: ${radius.sm}px;
    border-bottom-left-radius: ${radius.sm}px;
  }
  :where(.${CB_ROW_CLASS}[data-role="them"][data-group="last"]) .${CB_BUBBLE_CLASS} {
    border-top-left-radius: ${radius.sm}px;
  }

  /* group corners — me */
  :where(.${CB_ROW_CLASS}[data-role="me"][data-group="first"]) .${CB_BUBBLE_CLASS} {
    border-bottom-right-radius: ${radius.sm}px;
  }
  :where(.${CB_ROW_CLASS}[data-role="me"][data-group="middle"]) .${CB_BUBBLE_CLASS} {
    border-top-right-radius: ${radius.sm}px;
    border-bottom-right-radius: ${radius.sm}px;
  }
  :where(.${CB_ROW_CLASS}[data-role="me"][data-group="last"]) .${CB_BUBBLE_CLASS} {
    border-top-right-radius: ${radius.sm}px;
  }

  :where(.${CB_META_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[4]}px;
    padding: 0 ${spacing[4]}px;
  }

  :where(.${CB_TIME_CLASS}) {
    font-size: ${typeScale.label.fontSize}px;
    line-height: ${typeScale.label.lineHeight}px;
    color: ${cv.textRole.subtle};
  }

  :where(.${CB_READ_CLASS}) {
    font-size: ${typeScale.label.fontSize}px;
    line-height: ${typeScale.label.lineHeight}px;
    color: ${cv.textRole.brand};
    font-weight: ${fontWeight.medium};
  }
`;

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
