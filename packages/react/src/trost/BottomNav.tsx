import React from "react";
import { FooterTabBar } from "../Footer.js";
import type { FooterTabItem } from "../Footer.js";
import {
  TrostHomeIcon,
  TrostHomeActiveIcon,
  TrostCounselIcon,
  TrostCounselActiveIcon,
  TrostCommunityIcon,
  TrostCommunityActiveIcon,
  TrostMentalcareIcon,
  TrostMentalcareActiveIcon,
  TrostMyIcon,
  TrostMyActiveIcon,
  TrostMkHomeIcon,
  TrostMkHomeActiveIcon,
  TrostMkSoundIcon,
  TrostMkSoundActiveIcon,
  TrostMkMymusicIcon,
  TrostMkMymusicActiveIcon,
  TrostMkTalkIcon,
  TrostMkTalkActiveIcon,
  TrostMkMypageIcon,
  TrostMkMypageActiveIcon,
} from "@nudge-design/icons";

/**
 * Trost BottomNav — 트로스트는 앱이 두 종류라 BottomNav 도 두 variant 다.
 *
 * variant="trost" (기본): 트로스트 앱 5탭 (홈/심리상담/커뮤니티/멘탈케어/내공간).
 *   Figma 5:1169 정합. 전용 그래픽 (Trost{Home,Counsel,Community,Mentalcare,My}) — 모두 stroke 1.5.
 *   심리상담 = 말풍선+사람, 커뮤니티 = 게시판(TrostCommunity).
 *
 * variant="cashwalk-trost": (캐시워크)트로스트 앱 5탭 (홈/사운드/내음악/커뮤니티/마이페이지).
 *   Figma 5:1249 / 5:1306 정합. 전용 그래픽 (TrostMk{Home,Sound,Mymusic,Talk,Mypage}).
 *   커뮤니티 = TrostMkTalk(말풍선+점) — 트로스트 앱 게시판 TrostCommunity 와 다른 그래픽이다.
 *
 * 공통: 5탭 모두 active/inactive 그래픽이 분리. 색은 브랜드색이 아니라 검정 계열 —
 *   active = --semantic-icon-strong-default, inactive = --semantic-icon-normal-default.
 */

export type TrostBottomNavVariant = "trost" | "cashwalk-trost";

const TAB_ICON_COLOR = "var(--semantic-icon-normal-default)";
const TAB_ICON_ACTIVE_COLOR = "var(--semantic-icon-strong-default)";

/** 트로스트 앱 (신규) — 홈/심리상담/커뮤니티/멘탈케어/내공간 */
function trostAppTabIcon(label: string, active: boolean, color: string): React.ReactNode {
  switch (label) {
    case "홈":
      return active ? (
        <TrostHomeActiveIcon size={24} color={color} />
      ) : (
        <TrostHomeIcon size={24} color={color} />
      );
    case "심리상담":
      return active ? (
        <TrostCounselActiveIcon size={24} color={color} />
      ) : (
        <TrostCounselIcon size={24} color={color} />
      );
    case "커뮤니티":
      return active ? (
        <TrostCommunityActiveIcon size={24} color={color} />
      ) : (
        <TrostCommunityIcon size={24} color={color} />
      );
    case "멘탈케어":
      return active ? (
        <TrostMentalcareActiveIcon size={24} color={color} />
      ) : (
        <TrostMentalcareIcon size={24} color={color} />
      );
    case "내공간":
      return active ? (
        <TrostMyActiveIcon size={24} color={color} />
      ) : (
        <TrostMyIcon size={24} color={color} />
      );
    default:
      return <TrostHomeIcon size={24} color={color} />;
  }
}

/** (캐시워크)트로스트 앱 — 홈/사운드/내음악/커뮤니티/마이페이지 */
function cashwalkTrostTabIcon(label: string, active: boolean, color: string): React.ReactNode {
  switch (label) {
    case "홈":
      return active ? (
        <TrostMkHomeActiveIcon size={24} color={color} />
      ) : (
        <TrostMkHomeIcon size={24} color={color} />
      );
    case "사운드":
      return active ? (
        <TrostMkSoundActiveIcon size={24} color={color} />
      ) : (
        <TrostMkSoundIcon size={24} color={color} />
      );
    case "내음악":
      return active ? (
        <TrostMkMymusicActiveIcon size={24} color={color} />
      ) : (
        <TrostMkMymusicIcon size={24} color={color} />
      );
    case "커뮤니티":
      return active ? (
        <TrostMkTalkActiveIcon size={24} color={color} />
      ) : (
        <TrostMkTalkIcon size={24} color={color} />
      );
    case "마이페이지":
      return active ? (
        <TrostMkMypageActiveIcon size={24} color={color} />
      ) : (
        <TrostMkMypageIcon size={24} color={color} />
      );
    default:
      return <TrostMkHomeIcon size={24} color={color} />;
  }
}

function trostTabIconFor(
  variant: TrostBottomNavVariant,
  label: string,
  active: boolean,
): React.ReactNode {
  const color = active ? TAB_ICON_ACTIVE_COLOR : TAB_ICON_COLOR;
  return variant === "cashwalk-trost"
    ? cashwalkTrostTabIcon(label, active, color)
    : trostAppTabIcon(label, active, color);
}

export interface TrostBottomNavTab {
  key: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
}

export interface TrostBottomNavProps {
  tabs: TrostBottomNavTab[];
  activeTab?: string;
  onTabClick?: (tab: FooterTabItem, e: React.MouseEvent) => void;
  position?: "fixed" | "static";
  /** 트로스트 앱 종류. 기본 'trost'(신규 앱), '(캐시워크)트로스트 앱'은 'cashwalk-trost'. */
  variant?: TrostBottomNavVariant;
}

export const TrostBottomNav = React.forwardRef<HTMLElement, TrostBottomNavProps>(
  ({ tabs, activeTab, onTabClick, position = "fixed", variant = "trost" }, ref) => {
    const resolved: FooterTabItem[] = tabs.map((t) => ({
      key: t.key,
      label: t.label,
      href: t.href,
      icon: t.icon ?? trostTabIconFor(variant, t.label, false),
      activeIcon: t.activeIcon ?? trostTabIconFor(variant, t.label, true),
    }));

    const style: React.CSSProperties = position === "static" ? { position: "static" } : {};

    return (
      <FooterTabBar
        ref={ref}
        tabs={resolved}
        activeTab={activeTab}
        onTabClick={onTabClick}
        style={style}
      />
    );
  },
);

TrostBottomNav.displayName = "TrostBottomNav";
