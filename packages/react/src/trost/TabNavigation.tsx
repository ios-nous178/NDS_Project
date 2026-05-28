import React from "react";
import { trostNeutral, trostStatus } from "@nudge-design/tokens";
import type { TrostTabItem } from "./types";

export interface TrostTabNavigationProps {
  tabs: TrostTabItem[];
  /** 현재 브라우저 pathname (호스트 앱이 전달) */
  currentPath: string;
  /** 활성 탭 판정 커스터마이즈 (기본: tabUrl === currentPath || subTab 포함 여부) */
  isTabActive?: (tab: TrostTabItem, currentPath: string) => boolean;
  /** isNew 탭 배지 SVG src */
  newBadgeIconSrc?: string;
  /** 우측 슬롯 — 예: PopularKeywordSlider */
  rightSlot?: React.ReactNode;
}

const STYLE = `
  .nds-trost-tabnav {
    width: 100%;
    height: 70px;
    border-bottom: 1px solid ${trostNeutral[200]};
    background: #fff;
    font-family: inherit;
  }
  .nds-trost-tabnav__inner {
    max-width: 1080px;
    height: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }
  .nds-trost-tabnav__list {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 24px;
    margin: 0;
    padding: 0;
    list-style: none;
    cursor: pointer;
    height: 100%;
  }
  .nds-trost-tabnav__item {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .nds-trost-tabnav__link {
    height: 100%;
    display: flex;
    align-items: center;
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    font-size: 17px;
    font-weight: 700;
    line-height: 1.53;
    color: ${trostNeutral[500]};
    white-space: nowrap;
    cursor: pointer;
    text-decoration: none;
  }
  .nds-trost-tabnav__link:hover { color: ${trostNeutral[700]}; }
  .nds-trost-tabnav__link--active {
    color: #000;
    border-bottom-color: #000;
  }
  .nds-trost-tabnav__new-badge { margin-left: 4px; }

  .nds-trost-tabnav__dropdown {
    position: absolute;
    top: 62px;
    left: -20px;
    width: 174px;
    display: flex;
    flex-direction: column;
    opacity: 0;
    pointer-events: none;
    padding: 8px 0;
    border-radius: 8px;
    box-shadow: inset 0 0 0 1px ${trostNeutral[200]};
    background: #fff;
    z-index: 10;
    transition: opacity .15s;
  }
  .nds-trost-tabnav__item:hover .nds-trost-tabnav__dropdown {
    opacity: 1;
    pointer-events: auto;
  }
  .nds-trost-tabnav__suboption {
    width: 100%;
    padding: 9px 20px;
    font-size: 16px;
    line-height: 1.5;
    word-break: keep-all;
    cursor: pointer;
    color: ${trostNeutral[700]};
    font-weight: 500;
    text-decoration: none;
    box-sizing: border-box;
  }
  .nds-trost-tabnav__suboption:hover { color: #000; }
  .nds-trost-tabnav__suboption--active {
    color: ${trostStatus.orange};
    font-weight: 700;
  }
`;

const isSamePath = (a: string, b: string) => a === b || `${a}/` === b;

function defaultIsTabActive(tab: TrostTabItem, currentPath: string): boolean {
  if (isSamePath(currentPath, tab.tabUrl)) return true;
  return (tab.subTab ?? []).some((s) => isSamePath(currentPath, s.subTabUrl));
}

export function TrostTabNavigation({
  tabs,
  currentPath,
  isTabActive = defaultIsTabActive,
  newBadgeIconSrc,
  rightSlot,
}: TrostTabNavigationProps) {
  return (
    <>
      <style>{STYLE}</style>
      <nav className="nds-trost-tabnav">
        <div className="nds-trost-tabnav__inner">
          <ul className="nds-trost-tabnav__list">
            {tabs.map((tab) => {
              const active = isTabActive(tab, currentPath);
              return (
                <li className="nds-trost-tabnav__item" key={tab.tabName}>
                  <a
                    className={[
                      "nds-trost-tabnav__link",
                      active && "nds-trost-tabnav__link--active",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    href={tab.tabUrl}
                  >
                    {tab.tabName}
                    {tab.isNew && newBadgeIconSrc && (
                      <img
                        src={newBadgeIconSrc}
                        width={20}
                        height={20}
                        alt="new"
                        className="nds-trost-tabnav__new-badge"
                      />
                    )}
                  </a>

                  {tab.subTab && tab.subTab.length > 0 && (
                    <div className="nds-trost-tabnav__dropdown">
                      {tab.subTab.map((sub) => {
                        const subActive = isSamePath(currentPath, sub.subTabUrl);
                        return (
                          <a
                            key={sub.subTabName}
                            className={[
                              "nds-trost-tabnav__suboption",
                              subActive && "nds-trost-tabnav__suboption--active",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            href={sub.subTabUrl}
                          >
                            {sub.subTabName}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {rightSlot}
        </div>
      </nav>
    </>
  );
}
