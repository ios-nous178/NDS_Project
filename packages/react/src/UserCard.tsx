import React from "react";

/* ─── Constants ─── */

const UC_CLASS = "nds-user-card";
const UC_AVATAR_CLASS = `${UC_CLASS}__avatar`;
const UC_BODY_CLASS = `${UC_CLASS}__body`;
const UC_NAME_CLASS = `${UC_CLASS}__name`;
const UC_VERIFIED_CLASS = `${UC_CLASS}__verified`;
const UC_HANDLE_CLASS = `${UC_CLASS}__handle`;
const UC_BIO_CLASS = `${UC_CLASS}__bio`;
const UC_META_CLASS = `${UC_CLASS}__meta`;
const UC_ACTION_CLASS = `${UC_CLASS}__action`;

/* ─── Inline icons ─── */

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
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

/**
 * @deprecated Card 합성으로 대체하세요 — NudgeEAP Card 가이드의 "프로필 카드" 조합
 * (`Card.Avatar` + `Card.Title` + `Card.Subtitle`(handle) + `Card.Description`(bio) + `Card.Metadata` + `Card.Cta`).
 * UserCard 는 순수 슬롯 배치라 Card 합성으로 동일하게 표현되며, 다음 major 에서 제거 예정입니다.
 */
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
              <span className={UC_VERIFIED_CLASS}>
                <VerifiedCheckIcon />
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
