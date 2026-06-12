---
usagePolicy:
  useFor:
    - "동일 depth 콘텐츠 전환 (예: 내 상담 / 받은 추천)"
    - "category navigation (예: 전체 / 진행중 / 완료)"
    - section switching (한 페이지 내 영역 전환)
  doNotUseFor:
    - CTA 대체 (저장/신청/다음 단계)
    - 필터 컨트롤 (FilterBar 사용)
    - 페이지 단위 라우팅 (좌측 메뉴 · Breadcrumb 사용)
    - 세그먼트형 단일 값 선택 (Tabs variant='segment' 사용)
  variantPolicy:
    line: 기본 — 모바일/PC 공통, 콘텐츠 전환. 활성 탭 하단 인디케이터. tone=neutral(진한 텍스트)/color(브랜드).
    chip: 강조형 — 알약(Pill) 필터 탭, 모바일/PC 카테고리 분류. tone=neutral(활성 다크 채움)/color(활성 브랜드 채움).
    segment: 연결된 회색 트랙 위 균등 분할 단일 값 토글(구 SegmentedControl 흡수) — 뷰/기간/상태. 콘텐츠 패널 전환 아님. tone=color 면 활성이 브랜드 채움.
---

## summary

line/chip/segment 3가지 variant + tone(neutral|color) + size(mobile|pc). items + activeKey + onTabChange. line/chip = 동일 depth 콘텐츠 전환 · category navigation · section switching(tablist) 전용. segment = 뷰/기간/상태 단일 값 토글(구 SegmentedControl 흡수, 콘텐츠 패널 전환 아님). CTA·필터·페이지 단위 라우팅 대체용으로 사용 금지.

## pitfalls

- items 형식은 {key, title}[]. label 같은 다른 키 이름 사용 시 렌더 실패.
- 변경 핸들러는 onTabChange (onChange 아님).
- Tab 을 CTA처럼 사용 금지 — '저장/신청/다음 단계' 등 액션은 Button 사용. Tab 은 보기 전환만.
- 같은 리스트의 '필터' 는 FilterBar, Tab 은 '뷰/카테고리/섹션 전환' — 둘을 섞어 쓰지 말 것.
- 세그먼트 모양의 단일 값 선택(뷰/기간/상태 토글)은 Tabs variant='segment' (mobile/pc). line/chip 은 패널 전환(tablist) 전용.
- Tab 라벨에 Badge/Count 를 과하게 붙이면 위계가 무너짐 — 필요 시 count 만, Badge 는 카드 본문에서.
- 캐포비(cashwalk-biz)는 chip 치수만 브랜드 토큰으로 override(radius 10·height 52·padding 20). 비활성 chip 컬러는 NudgeEAP 와 동일(subtle bg + subtle text, hover 시 surface.section + strong) — 흰 텍스트 저대비로 만들지 말 것.

## examplesHtml.do

```html
<nds-tabs active-key="home" variant="line" size="mobile">
  <nds-tabs-list>
    <nds-tabs-trigger key="home">홈</nds-tabs-trigger>
    <nds-tabs-trigger key="profile">프로필</nds-tabs-trigger>
  </nds-tabs-list>
  <nds-tabs-panel key="home">홈 콘텐츠</nds-tabs-panel>
  <nds-tabs-panel key="profile">프로필 콘텐츠</nds-tabs-panel>
</nds-tabs>
<script>tabs.addEventListener("tabs-change", e => console.log(e.detail.activeKey));</script>
```

## examplesHtml.dont

```html
<!-- panel 의 key 가 trigger 의 key 와 불일치 — 빈 화면이 노출됨 -->
<nds-tabs active-key="home">
  <nds-tabs-list><nds-tabs-trigger key="home">홈</nds-tabs-trigger></nds-tabs-list>
  <nds-tabs-panel key="HOME">홈 콘텐츠</nds-tabs-panel>
</nds-tabs>
```
