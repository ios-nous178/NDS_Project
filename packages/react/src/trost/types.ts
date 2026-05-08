/**
 * Trost 데스크탑 Header/Footer용 공통 타입.
 * 데이터/네비게이션은 호스트 앱이 주입(컴포넌트는 presentational).
 */

export interface TrostSubTabItem {
  subTabName: string;
  subTabUrl: string;
}

export interface TrostTabItem {
  tabName: string;
  tabUrl: string;
  isNew?: boolean;
  subTab?: TrostSubTabItem[];
}

export type TrostPopularTrend = "new" | "same" | "up" | "down";

export interface TrostPopularKeyword {
  rank: number;
  keyword: string;
  trend: TrostPopularTrend;
  /** 클릭 시 이동 URL (호스트 앱에서 조립) */
  href: string;
}

export interface TrostUser {
  name: string;
  avatarSrc?: string;
}

export interface TrostSnsLink {
  href: string;
  label: string;
  iconSrc: string;
}
