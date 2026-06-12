import React from "react";
import { trostNeutral } from "@nudge-design/tokens";
import type { TrostUser } from "./types.js";

export interface TrostLoginSectionProps {
  user?: TrostUser | null;
  onLoginClick: () => void;
  onPartnerSignupClick: () => void;
  /** 로그아웃 링크 href (호버 드롭다운에서 이동) */
  logoutHref: string;
  onLogout?: () => void;
  /** 기본 아바타 이미지 */
  defaultAvatarSrc?: string;
  className?: string;
}

const STYLE = `
  .nds-trost-login { display: inline-flex; align-items: center; font-family: inherit; }
  .nds-trost-login__btn {
    margin-right: 20px;
    font-size: 16px;
    line-height: 24px;
    color: #000;
    font-weight: 700;
    cursor: pointer;
    background: transparent;
    border: 0;
    padding: 0;
  }
  .nds-trost-login__btn--partner { margin-right: 32px; }
  .nds-trost-login__avatar {
    border-radius: 50%;
    margin-right: 6px;
    width: 28px;
    height: 28px;
  }
  .nds-trost-login__username-wrap {
    position: relative;
    margin-right: 20px;
  }
  .nds-trost-login__username-wrap:hover .nds-trost-login__logout {
    opacity: 1;
    pointer-events: auto;
  }
  .nds-trost-login__username {
    font-size: 16px;
    line-height: 1.5;
    font-weight: 400;
    cursor: pointer;
  }
  .nds-trost-login__logout {
    position: absolute;
    width: 140px;
    height: 48px;
    left: 50%;
    transform: translateX(-50%);
    top: calc(100% + 16px);
    z-index: 20;
    opacity: 0;
    pointer-events: none;
    transition: opacity .2s;
    text-decoration: none;
  }
  .nds-trost-login__logout-inner {
    background: #fff;
    border: 1px solid ${trostNeutral[200]};
    border-radius: 8px;
    padding: 12px 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    color: ${trostNeutral[800]};
    font-size: 16px;
    line-height: 1.5;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export function TrostLoginSection({
  user,
  onLoginClick,
  onPartnerSignupClick,
  logoutHref,
  onLogout,
  defaultAvatarSrc,
  className,
}: TrostLoginSectionProps) {
  const isLogin = Boolean(user);

  return (
    <>
      <style>{STYLE}</style>
      <div className={["nds-trost-login", className].filter(Boolean).join(" ")}>
        {!isLogin ? (
          <>
            <button type="button" className="nds-trost-login__btn" onClick={onLoginClick}>
              로그인
            </button>
            <button
              type="button"
              className="nds-trost-login__btn nds-trost-login__btn--partner"
              onClick={onPartnerSignupClick}
            >
              상담사 회원가입
            </button>
          </>
        ) : (
          <>
            {(user?.avatarSrc || defaultAvatarSrc) && (
              <img
                src={user?.avatarSrc || defaultAvatarSrc}
                alt={user?.name ?? ""}
                width={28}
                height={28}
                className="nds-trost-login__avatar"
                loading="lazy"
              />
            )}
            <div className="nds-trost-login__username-wrap">
              <p className="nds-trost-login__username">{user?.name}</p>
              <a className="nds-trost-login__logout" href={logoutHref} onClick={onLogout}>
                <p className="nds-trost-login__logout-inner">로그아웃</p>
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
}
