import React from "react";
import { AppFooterTabBar } from "../AppFooter";
import type { FooterTabItem } from "../AppFooter";
import {
  HomeIcon,
  HomeActiveIcon,
  PlayIcon,
  MymusicIcon,
  CommentIcon,
  MypageIcon,
  MypageActiveIcon,
} from "@nudge-eap/icons";

/**
 * Trost BottomNav (5탭 — 홈/사운드/내음악/커뮤니티/마이페이지).
 *
 * 정책: 일부 탭은 active/inactive 그래픽이 분리 (홈/마이페이지). 나머지는 color prop cascade.
 * 색 토큰:
 *   - active   = --semantic-icon-brand-default
 *   - inactive = --semantic-icon-normal-default
 */

const TAB_ICON_COLOR = "var(--semantic-icon-normal-default)";
const TAB_ICON_ACTIVE_COLOR = "var(--semantic-icon-brand-default)";

function trostTabIconFor(label: string, active: boolean): React.ReactNode {
  const color = active ? TAB_ICON_ACTIVE_COLOR : TAB_ICON_COLOR;
  switch (label) {
    case "홈":
      return active ? (
        <HomeActiveIcon size={24} color={color} />
      ) : (
        <HomeIcon size={24} color={color} />
      );
    case "사운드":
      return <PlayIcon size={24} color={color} />;
    case "내음악":
      return <MymusicIcon size={24} color={color} />;
    case "커뮤니티":
      return <CommentIcon size={24} color={color} />;
    case "마이페이지":
      return active ? (
        <MypageActiveIcon size={24} color={color} />
      ) : (
        <MypageIcon size={24} color={color} />
      );
    default:
      return <HomeIcon size={24} color={color} />;
  }
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
}

export const TrostBottomNav = React.forwardRef<HTMLElement, TrostBottomNavProps>(
  ({ tabs, activeTab, onTabClick, position = "fixed" }, ref) => {
    const resolved: FooterTabItem[] = tabs.map((t) => ({
      key: t.key,
      label: t.label,
      href: t.href,
      icon: t.icon ?? trostTabIconFor(t.label, false),
      activeIcon: t.activeIcon ?? trostTabIconFor(t.label, true),
    }));

    const style: React.CSSProperties = position === "static" ? { position: "static" } : {};

    return (
      <AppFooterTabBar
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
