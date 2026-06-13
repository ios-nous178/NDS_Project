import React from "react";
import { IconCatalog as SharedIconCatalog } from "@nudge-design/catalog";
import iconCatalog from "../../../../metadata/iconCatalog.json";

/**
 * 아이콘 카탈로그 — 공유 컴포넌트(@nudge-design/catalog)의 얇은 래퍼.
 * 분류/그리드/검색/복사 로직은 storybook Icons 스토리와 단일 컴포넌트를 공유하며,
 * 데이터(브랜드·kebab·CashwalkBiz 카테고리)는 metadata/iconCatalog.json SSOT 에서 온다.
 * docs 관례: import 문 복사(copyMode="import") · 32px.
 */
export default function IconCatalog() {
  return (
    <SharedIconCatalog
      data={iconCatalog}
      mode="all"
      copyMode="import"
      iconSize={32}
      searchPlaceholder="이름 또는 파일명으로 검색 (예: chevron, arrow, geniet)"
    />
  );
}
