import React from "react";
import { FooterTabBar } from "../Footer";
import type { FooterTabItem } from "../Footer";
import {
  RunmileHomeIcon,
  RunmileHomeActiveIcon,
  RunmileChallengeIcon,
  RunmileChallengeActiveIcon,
  RunmileCommunityIcon,
  RunmileCommunityActiveIcon,
  RunmileMypageIcon,
  RunmileMypageActiveIcon,
} from "@nudge-design/icons";

/**
 * Runmile BottomNav (Figma 83:887, 4탭).
 *
 * Figma SSOT 아이콘 — `ic_home_fill/stroke`, `ic_challenge_fill/stroke`,
 * `ic_community_fill/stroke`, `ic_user_fill/stroke` 그대로 vector export 후
 * 24×24 viewBox + currentColor 로 정규화 (packages/icons/svg/mono/runmile-*.svg).
 *
 * 시멘틱:
 *   - active   = #221E1F (--semantic-icon-strong-default, 검정 fill)
 *   - inactive = gray600 #919CAA (--semantic-text-muted-default, gray stroke)
 *   - label    = Pretendard Medium 12/16 (Figma 실측 — 11/14 가 아니라 12/16)
 */

function runmileTabIconFor(label: string, active: boolean): React.ReactNode {
  switch (label) {
    case "홈":
      return active ? <RunmileHomeActiveIcon size={24} /> : <RunmileHomeIcon size={24} />;
    case "대회정보":
      return active ? <RunmileChallengeActiveIcon size={24} /> : <RunmileChallengeIcon size={24} />;
    case "커뮤니티":
      return active ? <RunmileCommunityActiveIcon size={24} /> : <RunmileCommunityIcon size={24} />;
    case "마이페이지":
      return active ? <RunmileMypageActiveIcon size={24} /> : <RunmileMypageIcon size={24} />;
    default:
      return <RunmileHomeIcon size={24} />;
  }
}

export interface RunmileBottomNavTab {
  key: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
}

export interface RunmileBottomNavProps {
  tabs: RunmileBottomNavTab[];
  activeTab?: string;
  onTabClick?: (tab: FooterTabItem, e: React.MouseEvent) => void;
  position?: "fixed" | "static";
}

export const RunmileBottomNav = React.forwardRef<HTMLElement, RunmileBottomNavProps>(
  ({ tabs, activeTab, onTabClick, position = "fixed" }, ref) => {
    const resolved: FooterTabItem[] = tabs.map((t) => ({
      key: t.key,
      label: t.label,
      href: t.href,
      icon: t.icon ?? runmileTabIconFor(t.label, false),
      activeIcon: t.activeIcon ?? runmileTabIconFor(t.label, true),
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

RunmileBottomNav.displayName = "RunmileBottomNav";
