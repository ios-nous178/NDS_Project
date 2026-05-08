import React from "react";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Constants ─── */

const UC_CLASS = "nds-user-card";
const UC_AVATAR_CLASS = `${UC_CLASS}__avatar`;
const UC_BODY_CLASS = `${UC_CLASS}__body`;
const UC_NAME_CLASS = `${UC_CLASS}__name`;
const UC_HANDLE_CLASS = `${UC_CLASS}__handle`;
const UC_BIO_CLASS = `${UC_CLASS}__bio`;
const UC_META_CLASS = `${UC_CLASS}__meta`;
const UC_ACTION_CLASS = `${UC_CLASS}__action`;

/* ─── Types ─── */

export type UserCardLayout = "row" | "stacked";

export interface UserCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 아바타 (Avatar 컴포넌트 등) */
  avatar?: React.ReactNode;
  /** 사용자 이름 */
  name: React.ReactNode;
  /** 핸들 / 직책 / @id */
  handle?: React.ReactNode;
  /** 한 줄 소개 */
  bio?: React.ReactNode;
  /** 메타 정보 (팔로워 수 등) */
  meta?: React.ReactNode;
  /** 우측 액션 (팔로우 버튼/메시지) */
  action?: React.ReactNode;
  /** 인증 마크 (이름 옆 ✓) */
  verified?: boolean;
  /** 레이아웃 (가로 / 세로) */
  layout?: UserCardLayout;
  /** 카드 클릭 (프로필 진입) */
  onClick?: () => void;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const ucStyles = `
  :where(.${UC_CLASS}) {
    display: flex;
    gap: ${spacing[12]}px;
    padding: ${spacing[12]}px ${spacing[16]}px;
    background: ${cv.bg.white};
    border: 1px solid ${cv.border.light};
    border-radius: ${radius.lg}px;
    font-family: ${fontFamily.web};
    transition: border-color ${transition.default};
    box-sizing: border-box;
    align-items: center;
  }

  :where(.${UC_CLASS}[data-clickable="true"]) { cursor: pointer; }
  :where(.${UC_CLASS}[data-clickable="true"]:hover) { border-color: ${cv.primary.main}; }

  :where(.${UC_CLASS}[data-layout="stacked"]) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: ${spacing[20]}px;
  }

  :where(.${UC_AVATAR_CLASS}) {
    flex-shrink: 0;
  }

  :where(.${UC_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  :where(.${UC_NAME_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.text.default};
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${UC_HANDLE_CLASS}) {
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.text.subtle};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  :where(.${UC_BIO_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.text.default};
    margin-top: ${spacing[4]}px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  :where(.${UC_META_CLASS}) {
    display: inline-flex;
    align-items: center;
    gap: ${spacing[8]}px;
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.text.subtle};
    margin-top: ${spacing[4]}px;
  }

  :where(.${UC_ACTION_CLASS}) {
    flex-shrink: 0;
  }

  :where(.${UC_CLASS}[data-layout="stacked"]) .${UC_ACTION_CLASS} {
    width: 100%;
    margin-top: ${spacing[12]}px;
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const UserCard = React.forwardRef<HTMLDivElement, UserCardProps>(
  (
    {
      avatar,
      name,
      handle,
      bio,
      meta,
      action,
      verified = false,
      layout = "row",
      onClick,
      className,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        data-slot="root"
        data-layout={layout}
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
        className={cx(UC_CLASS, className)}
        {...rest}
      >
        {avatar && <div className={UC_AVATAR_CLASS}>{avatar}</div>}
        <div className={UC_BODY_CLASS}>
          <p className={UC_NAME_CLASS}>
            {name}
            {verified && (
              <span style={{ marginLeft: 4, color: "var(--color-semantic-primary-main, #4080F0)" }}>
                ✓
              </span>
            )}
          </p>
          {handle && <span className={UC_HANDLE_CLASS}>{handle}</span>}
          {bio && <p className={UC_BIO_CLASS}>{bio}</p>}
          {meta && <span className={UC_META_CLASS}>{meta}</span>}
        </div>
        {action && (
          <div className={UC_ACTION_CLASS} onClick={(e) => e.stopPropagation()}>
            {action}
          </div>
        )}
      </div>
    );
  },
);

UserCard.displayName = "UserCard";
