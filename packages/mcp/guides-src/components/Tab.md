---
references:
  - label: Tab vs Filter — 역할·배치·결정 트리 (DesignGuide)
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3544-206
    caption: Tab(Underline/Box)으로 view 전환 · Filter(FilterBar)로 현재 view 좁히기. 결정 트리·배치 순서·DO/Don't 요약은 pitfalls, 캐포비 admin 풀 스펙은 pattern:cashwalk-biz-tab.
    brand: cashwalk-biz
  - label: Trost Tabs — Line/Chip/Segment 가이드 (TrostLibrary)
    url: https://www.figma.com/design/gC7CyAVloVvU896avolddQ/Trost-Library?node-id=5301-108
    caption: '트로스트 탭 가이드. tone="color" 활성 강조색은 Point 코발트(#4968FF) — brand=노랑은 면적 채움 전용이라 탭 강조는 Point 로 분리. Line=mobile50/pc56, Chip=mobile36/pc44, Segment=PC.'
    brand: trost
  - label: 런마일 Tabs — Underline/Chip · active=검정 (RunmileLibrary)
    url: https://www.figma.com/design/MssCIDnDdAjStQXHclPNIc/?node-id=5111-138
    caption: '런마일 탭 가이드. active = 검정(#221E1F · text/strong), 포인트색(주황) 아님. Underline(line) active = 검정 텍스트 + 2px 검정 인디케이터, Chip(tone=neutral) active = 검정 채움(--nds-tab-chip-selected-bg=text/strong) + 흰 텍스트. inactive = subtle. 2~4 메뉴 권장.'
    brand: runmile
usagePolicy:
  useFor:
    - "동일 depth 콘텐츠 전환 (예: 내 상담 / 받은 추천)"
    - "category navigation (예: 전체 / 진행중 / 완료)"
    - section switching (한 페이지 내 영역 전환)
  doNotUseFor:
    - CTA 대체 (저장/신청/다음 단계)
    - 필터 컨트롤 (FilterBar 사용)
    - 페이지 단위 라우팅 (좌측 메뉴 · Breadcrumb 사용)
    - 세그먼트형 단일 값 선택 (Tab variant='segment' 사용)
  variantPolicy:
    line: 기본 — 모바일/PC 공통, 콘텐츠 전환. 활성 탭 하단 인디케이터. tone=neutral(진한 텍스트)/color(브랜드).
    chip: 강조형 — 알약(Pill) 필터 탭, 모바일/PC 카테고리 분류. tone=neutral(활성 다크 채움)/color(활성 브랜드 채움).
    segment: 연결된 회색 트랙 위 균등 분할 단일 값 토글(구 SegmentedControl 흡수) — 뷰/기간/상태. 콘텐츠 패널 전환 아님. tone=color 면 활성이 브랜드 채움.
---

## summary

line/chip/segment 3가지 variant + tone(neutral|color) + size(mobile|pc). items + activeKey + onTabChange. line/chip = 동일 depth 콘텐츠 전환 · category navigation · section switching(tablist) 전용. segment = 뷰/기간/상태 단일 값 토글(구 SegmentedControl 흡수, 콘텐츠 패널 전환 아님). CTA·필터·페이지 단위 라우팅 대체용으로 사용 금지. **Tab = view 자체 전환(상호 배타·한 번에 한 view·URL 경로 변경) vs Filter(FilterBar) = 현재 view 안에서 조건 좁히기(다중 누적·쿼리 파라미터)** — 역할이 다르다(아래 결정 트리). Underline=line, Box=chip 으로 매핑되며 캐포비 admin 풀 스펙은 `pattern:cashwalk-biz-tab`.

## pitfalls

- items 형식은 {key, title}[]. label 같은 다른 키 이름 사용 시 렌더 실패.
- 변경 핸들러는 onTabChange (onChange 아님).
- Tab 을 CTA처럼 사용 금지 — '저장/신청/다음 단계' 등 액션은 Button 사용. Tab 은 보기 전환만.
- 같은 리스트의 '필터' 는 FilterBar, Tab 은 '뷰/카테고리/섹션 전환' — 둘을 섞어 쓰지 말 것.
- 세그먼트 모양의 단일 값 선택(뷰/기간/상태 토글)은 Tab variant='segment' (mobile/pc). line/chip 은 패널 전환(tablist) 전용.
- Tab 라벨에 Badge/Count 를 과하게 붙이면 위계가 무너짐 — 필요 시 count 만, Badge 는 카드 본문에서.
- 캐포비(cashwalk-biz)는 chip 치수만 브랜드 토큰으로 override(radius 10·height 52·padding 20). 비활성 chip 컬러는 NudgeEAP 와 동일(subtle bg + subtle text, hover 시 surface.section + strong) — 흰 텍스트 저대비로 만들지 말 것.
- **런마일(runmile) active = 검정(#221E1F) — 포인트색(주황) 아님 (Figma RunmileLibrary 5111:138)**: Underline(line) active 텍스트·인디케이터는 `cv.textRole.strong`(검정)으로 이미 정합. Chip(tone="neutral") active 채움은 기본 `fill.neutral`(#333D4B)이 아니라 `--nds-tab-chip-selected-bg`=text/strong(#221E1F)로 내려 검정으로 맞춘다. 활성 탭에 brand 주황을 쓰면 회귀. inactive=subtle. (런마일 chip 은 tone="color" 가 아니라 기본 neutral 을 쓴다.)
- **트로스트(trost) tone="color" 강조색 = Point 코발트(#4968FF) — brand 색 아님**: 트로스트 brand 는 노랑이라 면적 채움 전용(텍스트·인디케이터로 쓰면 가독성↓)이다. 그래서 탭 활성 강조색만 `--nds-tab-accent-*` 슬롯을 거쳐 Point 코발트로 분리된다. Line=neutral(다크 #333/#1A1A1A 텍스트·인디케이터)/color(코발트 텍스트·인디케이터), Chip=neutral(다크 채움)/color(코발트 채움, 채움 위 텍스트는 흰색), Segment(PC)도 color 면 코발트 채움. **다른 브랜드는 brand 색으로 폴백**(슬롯 미설정 → `cv.surface.brand`/`cv.textRole.brand`)이라 무변. 트로스트 `<Tab tone="color">` 가 노랑/오렌지로 보이면 회귀(구 버그).
- **Underline(line) vs Box(chip) 용도 구분 (Figma DesignGuide/Tab 3544-206)**: Underline=페이지 메인 카테고리·목록 필터·단계 전환, Box=상태/좁은 영역 필터(진행중·진행예정·종료). **한 화면에 Tab 종류는 1개로 통일 — Underline 과 Box 를 같은 화면에서 혼용하지 말 것.** Tab 항목 수는 2–5개 권장(6개+는 메뉴/Select 검토).
- **Tab vs Filter 결정 트리 (혼동 금지)**: Q1. view 자체가 바뀌나(목록 전체 교체)? → YES = **Tab**(URL 경로 변경). Q2. 조건을 누적해 좁히나(다중 필터)? → YES = **Filter(FilterBar)**(쿼리 파라미터 누적). Q3. 옵션 2–7개 단일 선택? → YES = **Radio / SelectionButtonGroup**. 큰 분류(상호 배타)를 Filter 로, 조건 좁히기를 Tab 으로 만들지 말 것.
- **화면 배치 순서**: 페이지 타이틀 → **Tab** → **FilterBar** → 데이터 영역(위→아래). Tab 으로 큰 분류를 고른 뒤 Filter 로 좁히는 흐름. Tab 안에 또 Tab 중첩 금지(Sub-section 은 Accordion/Anchor). 캐포비 admin 풀 스펙·치수는 `pattern:cashwalk-biz-tab`.

## examplesHtml.do

```html
<nds-tab active-key="home" variant="line" size="mobile">
  <nds-tab-list>
    <nds-tab-trigger key="home">홈</nds-tab-trigger>
    <nds-tab-trigger key="profile">프로필</nds-tab-trigger>
  </nds-tab-list>
  <nds-tab-panel key="home">홈 콘텐츠</nds-tab-panel>
  <nds-tab-panel key="profile">프로필 콘텐츠</nds-tab-panel>
</nds-tab>
<script>tabs.addEventListener("tabs-change", e => console.log(e.detail.activeKey));</script>
```

## examplesHtml.dont

```html
<!-- panel 의 key 가 trigger 의 key 와 불일치 — 빈 화면이 노출됨 -->
<nds-tab active-key="home">
  <nds-tab-list><nds-tab-trigger key="home">홈</nds-tab-trigger></nds-tab-list>
  <nds-tab-panel key="HOME">홈 콘텐츠</nds-tab-panel>
</nds-tab>
```
