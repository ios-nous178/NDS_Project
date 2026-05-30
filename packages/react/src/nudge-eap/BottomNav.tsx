import React from "react";
import { FooterTabBar } from "../Footer";
import type { FooterTabItem } from "../Footer";
import {
  HomeIcon,
  HomeActiveIcon,
  ChallengeIcon,
  ChallengeActiveIcon,
  CounselIcon,
  CounselActiveIcon,
  MentalcareIcon,
  MentalcareActiveIcon,
  MypageIcon,
  MypageActiveIcon,
} from "@nudge-design/icons";

/**
 * NudgeEAP BottomNav — 5탭 (홈/챌린지/상담/멘탈케어/내 공간).
 *
 * Figma SSOT: 20:3331 (NudgeEAP Dev — 앱 네비게이션).
 *   - 56h × 360w / 각 탭 72w
 *   - 아이콘 24×24, 라벨 11px
 *   - 비활성: Pretendard Regular, color neutral/700 (#666)
 *   - 활성:   Pretendard Medium,  color neutral/800 (#383838)
 *   - 활성/비활성 그래픽이 별도 (HomeActiveIcon / HomeIcon 식)
 *
 * label 만 받으면 자동 아이콘 매핑 (홈/챌린지/상담/멘탈케어/내 공간). 매핑되지 않는 라벨은
 * fallback HomeIcon 으로 렌더되니, 커스텀 라벨이면 tabs[i].icon / activeIcon 을 직접 지정하라.
 */

function nudgeEapTabIconFor(label: string, active: boolean): React.ReactNode {
  switch (label) {
    case "홈":
      return active ? <HomeActiveIcon size={24} /> : <HomeIcon size={24} />;
    case "챌린지":
      return active ? <ChallengeActiveIcon size={24} /> : <ChallengeIcon size={24} />;
    case "상담":
      return active ? <CounselActiveIcon size={24} /> : <CounselIcon size={24} />;
    case "멘탈케어":
      return active ? <MentalcareActiveIcon size={24} /> : <MentalcareIcon size={24} />;
    case "내 공간":
    case "내공간":
      return active ? <MypageActiveIcon size={24} /> : <MypageIcon size={24} />;
    default:
      return <HomeIcon size={24} />;
  }
}

export interface NudgeEAPBottomNavTab {
  key: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
}

export interface NudgeEAPBottomNavProps {
  tabs: NudgeEAPBottomNavTab[];
  activeTab?: string;
  onTabClick?: (tab: FooterTabItem, e: React.MouseEvent) => void;
  position?: "fixed" | "static";
}

export const NudgeEAPBottomNav = React.forwardRef<HTMLElement, NudgeEAPBottomNavProps>(
  ({ tabs, activeTab, onTabClick, position = "fixed" }, ref) => {
    const resolved: FooterTabItem[] = tabs.map((t) => ({
      key: t.key,
      label: t.label,
      href: t.href,
      icon: t.icon ?? nudgeEapTabIconFor(t.label, false),
      activeIcon: t.activeIcon ?? nudgeEapTabIconFor(t.label, true),
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

NudgeEAPBottomNav.displayName = "NudgeEAPBottomNav";
