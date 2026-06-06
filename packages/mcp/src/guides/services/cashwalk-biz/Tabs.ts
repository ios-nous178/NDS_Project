import type { ServiceOverlay } from "../types.js";

/**
 * Cashwalk-biz (Cashpobi) Tabs overlay.
 * Source: 캐포비 Library DesignGuide/Tab 3544:206 (Tab/Underline 3542:206 · Tab/Box 3543:206).
 *
 * 캐포비 Tab 은 base Tabs 의 `line` / `chip` 두 변형으로 매핑:
 *   - Tab / Underline → variant="line"  (텍스트 + 하단 인디케이터 바)
 *   - Tab / Box       → variant="chip"  (박스/필 형태, 선택=검정 inverse fill)
 *
 * 빠진 내용 (의도적, SSOT 분리):
 *   - Box 선택 색(bg-inverse #111 / text-inverse #FFF), default(#F5F5F5), radius 10 은 컴포넌트 토큰이 SSOT.
 *   - Underline 인디케이터 색/굵기도 컴포넌트가 처리 — overlay 는 사용처 분기만 담당.
 */
export const TabsOverlay: ServiceOverlay = {
  allowedVariants: ["line", "chip"],
  preferredPatterns: [
    "Tab / Underline(variant='line') 은 페이지 메인 카테고리 전환에 사용 — 목록 필터링·단계 전환(예: 검수 승인 / 검수 반려 / 검수 대기).",
    "Tab / Box(variant='chip') 은 상태나 좁은 영역의 필터링에 사용 — 진행중 / 진행예정 / 종료 같은 상태 필터, 테이블 위 짧은 필터.",
    "한 화면에서 Underline 과 Box 를 위계로 구분 — 페이지 1차 카테고리는 Underline, 그 안쪽 리스트/테이블의 상태 필터는 Box.",
    "선택된 탭만 강조(Underline=bold+바, Box=검정 fill+흰 텍스트), 나머지는 subtle — 라벨 텍스트 자체 색을 임의로 바꾸지 말 것.",
  ],
  forbiddenPatterns: [
    "Box 선택 fill 을 brand yellow 로 변경 — 캐포비 Tab/Box 선택은 neutral inverse(검정 #111 + 흰 텍스트)다. Checkbox 의 Yellow/500 Primary 와 혼동 금지.",
    "Tab 을 CTA(저장/신청/다음 단계)나 페이지 단위 라우팅 대체로 사용 — 라우팅은 좌측 Sidebar, 액션은 Button.",
    "같은 리스트의 '필터'를 Tab/Box 와 FilterBar 로 동시에 중복 — 상태 분기는 Tab/Box, 다중 조건 필터는 FilterBar 로 한쪽만.",
    "캐포비 Tab 규격은 line / chip 두 종 — 세그먼트형 단일 값 선택(상태/기간 토글)은 SegmentedControl(size=lg 가 PC) 사용.",
  ],
  servicePitfalls: [
    "캐포비 admin 의 '진행중/진행예정/종료', '검수 승인/반려/대기' 류는 Tab 으로 보기 전환 — 동일 row 안에서 즉시 토글되는 ON/OFF 가 아니라 콘텐츠 영역 자체를 전환하는 것.",
    "Underline 은 페이지 폭 전체, Box 는 테이블/카드 헤더 안쪽 좁은 영역 — 둘의 배치 컨텍스트가 다르니 같은 줄에 섞지 말 것.",
  ],
};
