import type { ServiceOverlay } from "../types.js";

/**
 * Cashwalk-biz Sidebar overlay.
 * Source: legacy COMPONENT_GUIDES.Sidebar.pitfalls 의 "GNB 아이콘 ... Cashwalk-biz 한정" 한 줄 (이쪽으로 마이그레이션).
 *
 * Sidebar 는 admin 전용 컴포넌트로 사실상 cashwalk-biz brand 가 주 사용자. iconSet 슬롯 evidence (Figma 450:68 v2 7필드 중).
 * gnb 키: Sidebar 의 좌측 메뉴 아이콘 자리 — brand prefix 아이콘 7종이 같은 의미의 공용 아이콘보다 우선.
 */
export const SidebarOverlay: ServiceOverlay = {
  iconSet: {
    gnb: [
      "CashwalkBizGnbBannerIcon",
      "CashwalkBizGnbCashIcon",
      "CashwalkBizGnbChannelIcon",
      "CashwalkBizGnbChatIcon",
      "CashwalkBizGnbMemberIcon",
      "CashwalkBizGnbQuizIcon",
      "CashwalkBizGnbSettingIcon",
    ],
  },
};
