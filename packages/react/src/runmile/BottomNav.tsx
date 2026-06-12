import React from "react";
import { FooterTabBar } from "../Footer.js";
import type { FooterTabItem } from "../Footer.js";
import {
  RunmileHomeIcon,
  RunmileHomeActiveIcon,
  RunmileChallengeIcon,
  RunmileChallengeActiveIcon,
  RunmilePeopleIcon,
  RunmilePeopleActiveIcon,
  RunmileChatsIcon,
  RunmileChatsActiveIcon,
  RunmileAccountIcon,
  RunmileAccountActiveIcon,
} from "@nudge-design/icons";

/**
 * Runmile BottomNav (Figma 1221:64046 `bottomnavi5`, 5탭).
 *
 * Figma SSOT 아이콘 — `ic_home_fill/stroke`, `ic_challenge_fill/stroke`,
 * `community2 fill/stroke`(2인 그룹), `chatting2 fill/stroke`(겹친 말풍선),
 * `user fill/stroke`(원형 인물) 그대로 vector export 후 24×24 viewBox +
 * currentColor 로 정규화 (packages/icons/svg/mono/runmile-*.svg).
 *
 * 4탭(83:887) → 5탭(1221:64046) 업데이트: 채팅 탭 신설, 커뮤니티는 2인 그룹
 * 아이콘(People)으로, 마이페이지는 원형 인물 아이콘(Account)으로 교체.
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
      return active ? <RunmilePeopleActiveIcon size={24} /> : <RunmilePeopleIcon size={24} />;
    case "채팅":
      return active ? <RunmileChatsActiveIcon size={24} /> : <RunmileChatsIcon size={24} />;
    case "마이페이지":
      return active ? <RunmileAccountActiveIcon size={24} /> : <RunmileAccountIcon size={24} />;
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
