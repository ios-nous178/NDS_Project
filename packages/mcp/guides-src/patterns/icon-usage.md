---
metrics:
  maxHeadingIconsPerScreen: 4
  allowedLocations: AppBar buttons / Bottom Tab / IconButton / 카테고리 그룹 / 상태 아이콘 / Form field affordance
  consistencyRule: same-hierarchy-text → same-icon-decision
  selectionPriority: project-specific → nudge-eap-default → mockup-default(MockupLinear/MockupBold) → generated-custom
  relatedPatterns: icon-color, iconography
---

## summary

아이콘은 장식이 아니라 행동 / 상태 / affordance 전달 목적에만 사용한다. 어디에 써도 되고 어디에 쓰면 안 되는지를 정의하는 화이트리스트 / 블랙리스트. 아이콘 컬러는 get_guide({ topic: 'pattern:icon-color' }), 사이즈/스타일은 get_guide({ topic: 'pattern:iconography' }) 참고.

## rules

- **flex 행 안 인라인 아이콘은 `flex-shrink:0` + 고정 width/height 필수** — 텍스트 옆(상태 뱃지 옆 [i], 칩 안, 라벨 옆)에 둔 SVG 는 flex 자식이라 공간이 부족하면 가로폭이 0 까지 눌려 세로로 찌그러진다(회귀: '반려' 뱃지 옆 [i] 아이콘이 1px 너비로 찌그러짐). DS 입력/체크박스는 아이콘 슬롯에 이미 flex-shrink:0 을 주지만(Input prefix/suffix·Checkbox indicator), 손수 넣은 SVG 는 작성자가 `flex-shrink:0; width:16px; height:16px` 를 직접 줘야 한다. find_icon 산출 SVG 도 컨테이너가 flex 면 동일.
- **필수 선택 순서**: 프로젝트 전용 아이콘 → NudgeEAP 기본 아이콘 → MockupLinear*/MockupBold* 목업 기본 아이콘 → 자체 생성 SVG. find_icon 으로 앞 단계 후보를 먼저 확인하고, 없을 때만 다음 단계로 이동.
- 허용 위치 (화이트리스트):
    · AppBar / Header 기능 버튼 (검색 · 알림 · 뒤로가기 · 메뉴)
    · Bottom Tab Navigation
    · IconButton
    · 동일 위계의 카테고리 그룹 (Concern Grid · Category Grid)
    · 상태 아이콘 (Success · Warning · Error)
    · Form Field affordance (검색 · 캘린더 · 드롭다운 토글)
- 동일 위계의 텍스트는 아이콘 사용 여부가 일관되어야 한다 — 같은 GNB / 같은 카드 리스트 / 같은 헤딩 그룹 안에서 일부에만 아이콘이 붙으면 hierarchy 가 깨진다.
- 헤딩 앞 아이콘 5개 이상 사용 시 자동 위반 — 아이콘을 hierarchy 표현 수단으로 쓰지 않는다.
- 아이콘이 필요한지 판단 기준: 액션을 호출하는가? 상태를 전달하는가? affordance(입력 가능/스크롤 가능 등)를 알리는가? 셋 중 하나도 아니면 아이콘 없이 텍스트만.
- 스타일 혼용 금지 — 한 화면에서 Line(stroke) 과 Filled 를 같은 의미 그룹에서 섞지 않는다 (iconography 패턴 참고).

## avoid

- 서브타이틀(h3/h4) 앞 장식 아이콘
- Form Label 앞 장식 아이콘
- 본문 텍스트 앞 decorative icon
- 일부 헤딩에만 icon 사용 (한 화면 안에서 불일치)
- hierarchy 와 무관한 icon 추가 (강조용으로 색만 다른 아이콘 끼우기)
- 모든 텍스트 앞에 icon 사용 — affordance 가 없는 장식
- colorful icon 과다 사용 / 의미 없는 emoji
- 아이콘 스타일 혼용 (Line + Filled 가 같은 그룹에서 공존)
- 앞 우선순위의 아이콘을 확인하지 않고 자체 SVG 생성
- **`<path d="…">` 글리프를 손으로 추정해 그리기** — 형태가 깨진/엉뚱한 아이콘이 된다(회귀: 필터 '초기화' 버튼에 깨진 path). 필요한 모양은 `find_icon({ query })` 로 먼저 찾고(예: reset/refresh/rotate → 정상 새로고침 글리프), 산출 SVG 를 그대로 쓴다. 정말 없을 때만 자체 작성.
