import type { ServiceOverlay } from "../types.js";

/**
 * Cashwalk-biz (Cashpobi) Sidebar overlay.
 * Source:
 *   - iconSet(gnb): legacy COMPONENT_GUIDES.Sidebar.pitfalls 의 "GNB 아이콘 ... Cashwalk-biz 한정" 한 줄 (이쪽으로 마이그레이션). Figma 450:68 v2 iconSet 슬롯 evidence.
 *   - 구성/메뉴아이템: 캐포비 Library Sidebar 3304:617 + MenuItem 3302:641.
 *
 * Sidebar 는 admin 전용 컴포넌트로 사실상 cashwalk-biz project 가 주 사용자. gnb 키: 좌측 메뉴 아이콘 자리 — project prefix 아이콘 7종이 같은 의미의 공용 아이콘보다 우선.
 *
 * 빠진 내용 (의도적, SSOT 분리):
 *   - 활성 아이템 bg(Yellow/100 #FFFAE5) 는 시멘틱 토큰 SSOT — cashwalk-biz.semantic.ts bg.project.subtle → --semantic-bg-brand-subtle cascade. 컴포넌트/overlay 가 hex 로 박지 않음.
 *   - 컴포넌트 project preset(Sidebar.tsx sidebarCashwalkBizTuning) 에는 시멘틱 색 토큰으로 표현 불가능한 것만: active radius 16(geometry), 선택 시 라벨 normal(#333) 유지(text role 선택).
 *   - 메뉴아이템 depth 별 높이(1dep 48 / 2dep 40 / 3dep 36) 는 컴포넌트가 처리 — overlay 가 박지 않음.
 */
export const SidebarOverlay: ServiceOverlay = {
  iconSet: {
    gnb: [
      "CashwalkBizGnbBannerIcon",
      "CashwalkBizGnbCashIcon",
      "CashwalkBizGnbCatalogIcon",
      "CashwalkBizGnbChannelIcon",
      "CashwalkBizGnbChatIcon",
      "CashwalkBizGnbEditIcon",
      "CashwalkBizGnbMemberIcon",
      "CashwalkBizGnbQuizIcon",
      "CashwalkBizGnbSettingIcon",
    ],
  },
  preferredPatterns: [
    "상단은 project 로고 → 계정 정보(이메일) → 잔액(충전 금액) → CTA 쌍(충전하기 solid / 내역보기 outlined) 순의 고정 헤더 블록 — 잔액·충전은 캐포비 admin 의 핵심 메타라 메뉴 위에 항상 노출.",
    "메뉴는 섹션 라벨(광고 관리 / 자산 관리 / 계정 관리)로 그룹핑 — items 를 SidebarSection[] 로 넘겨 라벨 그룹을 만들 것 (flat 배열 + 빈 spacer 금지).",
    "1depth 메뉴는 좌측 GNB 아이콘 + 라벨(15px Medium) + 우측 캐럿(펼침 ▴ / 접힘 ▾) — 펼침 가능한 항목만 캐럿 노출.",
    "서브메뉴(2depth: 배너 등록 / 배너 목록 / 배너 리포트)는 아이콘 없이 좌측 인셋(pl 52)으로 위계 표현 — 라벨 14px Medium.",
    "활성(선택) 아이템은 전체 폭 pale-yellow(Yellow/100) rounded(16) 배경 — 좌측 accent stripe 없음. 활성 여부는 `activeKey` 로만 결정.",
    "최하단은 로그아웃 outlined 버튼을 footer 슬롯에 고정 — 메뉴 스크롤과 분리.",
  ],
  forbiddenPatterns: [
    "활성 아이템에 좌측 세로 accent bar 추가 — 캐포비 사이드바는 stripe 없이 면(bg)으로만 선택 표현.",
    "활성 배경을 Yellow/200(#FFF4C0) 같은 진한 노랑으로 덮어쓰기 — 캐포비 Library 기준은 Yellow/100(#FFFAE5) 옅은 크림.",
    "서브메뉴를 2단계 이상 트리화 — 캐포비 메뉴는 1depth + 1단계 서브메뉴까지만 (배너 > 등록/목록/리포트).",
    "잔액/충전 CTA 를 메뉴 아이템처럼 리스트에 섞기 — 헤더 블록(로고 아래)에 고정.",
    "선택 시 라벨을 Bold 로 변경 — 텍스트는 Medium 유지(#333), 배경만 변화.",
  ],
  servicePitfalls: [
    "캐포비 admin 의 좌측 GNB 아이콘은 project prefix(CashwalkBizGnb*) 가 공용 아이콘보다 우선 — 배너=CashwalkBizGnbBannerIcon, 퀴즈=CashwalkBizGnbQuizIcon, 메시지=CashwalkBizGnbChatIcon 등.",
    "충전하기(solid)·내역보기(outlined) 는 동일 너비 2-up 버튼 쌍 — 한쪽만 강조하거나 세로로 쌓지 말 것.",
    "활성 배경(Yellow/100)·radius(16)·텍스트색은 data-project='cashwalk-biz' cascade 로 자동 — HTML/inline 으로 다시 박지 말 것.",
  ],
};
