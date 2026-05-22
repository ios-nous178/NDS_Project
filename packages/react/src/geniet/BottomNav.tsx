import React from "react";
import { AppFooterTabBar } from "../AppFooter";
import type { FooterTabItem } from "../AppFooter";
import {
  HomeIcon,
  GenietHomeIcon,
  GenietRecordIcon,
  GenietBenefitIcon,
  GenietReviewIcon,
  GenietCommunityIcon,
} from "@nudge-eap/icons";

/**
 * Geniet BottomNav (Figma 90:2, app(geniet) 5탭).
 *
 * 정책: 단일 그래픽 + color cascade. 모든 Geniet 탭 아이콘은 currentColor 로 정제돼 있어
 * --nds-footer-nav-{active,inactive}-color cascade 가 nav-item `color` 로 적용되고 SVG 가
 * 그대로 따라간다 (별도 on/off 매핑 불필요).
 *
 * 시멘틱:
 *   - active   = #00A8AC (mint600 = --semantic-text-brand-default)
 *   - inactive = #999    (gray500 = --semantic-text-muted-default)
 *
 * label 만 받으면 자동 아이콘 매핑 (홈/기록/혜택/리뷰/커뮤니티). 매핑되지 않는 라벨은
 * fallback HomeIcon 으로 렌더되니, 커스텀 아이콘이 필요하면 `tabs` 에서 직접 icon/activeIcon
 * 을 지정하라.
 */

const GENIET_TAB_ICON_BY_LABEL: Record<string, React.ReactNode> = {
  홈: <GenietHomeIcon size={24} />,
  기록: <GenietRecordIcon size={24} />,
  혜택: <GenietBenefitIcon size={24} />,
  리뷰: <GenietReviewIcon size={24} />,
  커뮤니티: <GenietCommunityIcon size={24} />,
};

function genietTabIconFor(label: string): React.ReactNode {
  return GENIET_TAB_ICON_BY_LABEL[label] ?? <HomeIcon size={24} />;
}

export interface GenietBottomNavTab {
  key: string;
  label: string;
  href: string;
  /** 커스텀 아이콘 (미지정 시 label 기반 자동 매핑). */
  icon?: React.ReactNode;
  /** active 상태 아이콘 (미지정 시 icon 과 동일 — color cascade 가 색을 바꿈). */
  activeIcon?: React.ReactNode;
}

export interface GenietBottomNavProps {
  tabs: GenietBottomNavTab[];
  activeTab?: string;
  onTabClick?: (tab: FooterTabItem, e: React.MouseEvent) => void;
  /**
   * 스크롤 컨테이너에 박을 때 position:fixed 가 컨테이너를 빠져나가는 것을 방지.
   * 기본 true (Figma BottomNav 위에 살짝 떠 보이는 그림자 가이드).
   */
  shadow?: boolean;
  /** 정적 위치로 렌더 (스토리북/스크롤 컨테이너용). */
  position?: "fixed" | "static";
}

export const GenietBottomNav = React.forwardRef<HTMLElement, GenietBottomNavProps>(
  ({ tabs, activeTab, onTabClick, shadow = true, position = "fixed" }, ref) => {
    const resolved: FooterTabItem[] = tabs.map((t) => {
      const auto = genietTabIconFor(t.label);
      return {
        key: t.key,
        label: t.label,
        href: t.href,
        icon: t.icon ?? auto,
        activeIcon: t.activeIcon ?? t.icon ?? auto,
      };
    });

    const style: React.CSSProperties = {};
    if (position === "static") style.position = "static";
    if (shadow) (style as Record<string, string>).boxShadow = "0 -2px 10px 0 rgba(17,17,17,0.05)";

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

GenietBottomNav.displayName = "GenietBottomNav";
