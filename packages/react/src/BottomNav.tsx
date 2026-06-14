import React, { createContext, useContext } from "react";

/* ─── Class names ─── */

const BN_CLASS = "nds-bottom-nav";
const BN_ITEM_CLASS = `${BN_CLASS}__item`;
const BN_ICON_CLASS = `${BN_CLASS}__icon`;
const BN_LABEL_CLASS = `${BN_CLASS}__label`;
const BN_BADGE_CLASS = `${BN_CLASS}__badge`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Context ─── */

interface BottomNavContextValue {
  activeKey: string;
  onChange?: (key: string) => void;
}

const BottomNavContext = createContext<BottomNavContextValue | undefined>(undefined);

const useBottomNavContext = () => {
  const ctx = useContext(BottomNavContext);
  if (!ctx) throw new Error("BottomNav.Item must be used within <BottomNav>");
  return ctx;
};

/* ─── Root ─── */

export interface BottomNavProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** 현재 활성 탭 key (`BottomNav.Item` 의 `itemKey` 와 비교). */
  activeKey: string;
  /** 탭 선택 콜백. anchor 의 기본 이동을 막지 않으므로 SPA 라우터 연동 시 활용. */
  onChange?: (key: string) => void;
  /** 화면 하단 고정(`fixed`) vs 흐름 배치(`static`, 스토리북/스크롤 컨테이너용). 기본 `fixed`. */
  position?: "fixed" | "static";
  /** 상단 그림자 — 콘텐츠 위에 살짝 떠 보이게. 기본 false. */
  shadow?: boolean;
  /** 탭 아이템들 (`BottomNav.Item`). */
  children: React.ReactNode;
}

/**
 * BottomNav — 모바일 하단 탭 바 primitive (브랜드 무관).
 *
 * 브랜드는 모른다 — 색/배경/보더/높이는 전부 `--nds-bottomnav-*` 슬롯으로 노출되고,
 * 브랜드 토큰 파일이 값만 덮는다. 브랜드별 아이콘/라벨은 호출부(`BottomNav.Item`)가
 * 주입한다. (`{Brand}BottomNav` 래퍼 대신 이 primitive + 브랜드 토큰을 쓴다.)
 *
 * compound API:
 *   <BottomNav activeKey="home" onChange={setKey}>
 *     <BottomNav.Item itemKey="home" label="홈" icon={<HomeIcon/>} activeIcon={<HomeActiveIcon/>} href="/" />
 *   </BottomNav>
 */
const BottomNavRoot = React.forwardRef<HTMLElement, BottomNavProps>(
  (
    { activeKey, onChange, position = "fixed", shadow = false, className, children, ...rest },
    ref,
  ) => {
    return (
      <BottomNavContext.Provider value={{ activeKey, onChange }}>
        <nav
          ref={ref}
          role="tablist"
          data-slot="root"
          data-position={position}
          data-shadow={shadow || undefined}
          className={cx(BN_CLASS, className)}
          {...rest}
        >
          {children}
        </nav>
      </BottomNavContext.Provider>
    );
  },
);
BottomNavRoot.displayName = "BottomNav";

/* ─── Item ─── */

export interface BottomNavItemProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> {
  /** 탭 고유 key (`BottomNav` 의 `activeKey` 와 비교). */
  itemKey: string;
  /** 탭 라벨. */
  label: string;
  /** 비활성 아이콘 (24×24 권장). */
  icon: React.ReactNode;
  /** 활성 아이콘. 미지정 시 `icon` 을 그대로 쓰고 색만 cascade 로 바뀐다. */
  activeIcon?: React.ReactNode;
  /** 링크 경로. 미지정 시 `#`. */
  href?: string;
  /** 우상단 배지 — 숫자/문자(카운트 칩) 또는 노드. */
  badge?: React.ReactNode;
}

const BottomNavItem = React.forwardRef<HTMLAnchorElement, BottomNavItemProps>(
  ({ itemKey, label, icon, activeIcon, href = "#", badge, className, onClick, ...rest }, ref) => {
    const { activeKey, onChange } = useBottomNavContext();
    const isActive = activeKey === itemKey;
    const hasBadge = badge !== undefined && badge !== null && badge !== false;

    return (
      <a
        ref={ref}
        role="tab"
        href={href}
        data-slot="item"
        data-active={isActive || undefined}
        aria-selected={isActive}
        aria-current={isActive ? "page" : undefined}
        className={cx(BN_ITEM_CLASS, className)}
        onClick={(e) => {
          onChange?.(itemKey);
          onClick?.(e);
        }}
        {...rest}
      >
        <span className={BN_ICON_CLASS}>
          {isActive ? (activeIcon ?? icon) : icon}
          {hasBadge && (
            <span className={BN_BADGE_CLASS} aria-hidden="true">
              {badge}
            </span>
          )}
        </span>
        <span className={BN_LABEL_CLASS}>{label}</span>
      </a>
    );
  },
);
BottomNavItem.displayName = "BottomNav.Item";

/* ─── Export: Compound ─── */

export const BottomNav = Object.assign(BottomNavRoot, {
  Item: BottomNavItem,
});
