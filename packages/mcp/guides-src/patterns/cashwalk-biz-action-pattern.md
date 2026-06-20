---
examples:
  - verdict: good
    source: Figma 3993-965 (캐포비 Action 패턴)
    caption: AddButton 3변형(Dashed '+ 지역 추가' / Primary '+ 새 퀴즈 등록' / Soft '+ 옵션 추가') + FilterBar 우측 끝 [+ 퀴즈 등록하기] 노란 Primary 1개(좌측 DateInput 2 + 검색). 텍스트 전부 '+ 명사'.
  - verdict: bad
    source: 잘못된 액션 배치
    caption: FilterBar 에 [등록][Export][설정] 3개 나열 + '+ 추가하기' 동사형 중복 + Dashed 를 페이지 메인 CTA 로 — Action 패턴 위반.
metrics:
  status: Figma 실측 반영 (docs 4023-1128 / pattern 3993-965)
  composition: AddButton 3변형(Dashed/Primary/Soft) + FilterBar 우측 Primary CTA 1개
  addButtonVariants: "Dashed(빈 자리·1px 점선·흰 배경) / Primary(페이지 진입·Solid #FFD100) / Soft(인라인·Soft/Neutral Medium)"
  addButtonSize: Button Medium (44h)
  addButtonTextFormat: "'+ 명사' (동사형 + '+' 중복 금지)"
  filterBarCta: "우측 끝 Solid/Primary 노랑 #FFD100 1개 · 좌측 DateInput 2 + TextInput 검색"
  filterBarBox: 패딩 상하 12 / 좌우 16 · bg surface-soft · radius 8
  ctaPlacement: FilterBar 우측 끝 (layoutSizingHorizontal=FILL spacer)
  maxFilterBarActions: 1
  narrowViewport: 텍스트 숨기고 [+] 아이콘만
  secondaryActions: FilterBar 금지 — 상단 메뉴 / 행별 / 액션 칩으로 분산
  validatePrdMapping: +명사 강제 · 진입=Solid/Primary · 빈 슬롯=Dashed · 인라인=Soft/Neutral · FilterBar 액션 1개
  relatedPatterns: cashwalk-biz-page-patterns, cashwalk-biz-page-list, cashwalk-biz-selection-pattern, cashwalk-biz-button, action-row
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3993-965
references:
  - label: 캐포비 Action 패턴 SSOT (Figma 3993-965)
    image: references/cashwalk-biz-action-pattern-3993-965.png
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3993-965
    caption: AddButton 3변형 + FilterBar 우측 Primary CTA + 안티패턴 + 결정 트리 + Do/Don't. metrics 는 이 노드 실측 기준.
    project: cashwalk-biz
  - label: 캐포비 Action docs (Figma 4023-1128)
    image: references/cashwalk-biz-action-docs-4023-1128.png
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=4023-1128
    caption: 언제 사용 · Section 구조 · Layout Spec · Validate Rule(PRD→컴포넌트 매핑) 원문 스펙 문서.
    project: cashwalk-biz
---

## summary

캐시워크 포 비즈니스 어드민 **Action 패턴 (#06)** — 어드민 화면에 자주 등장하는 '추가/등록' 액션의 표준 배치·문구. AddButton 3변형(Dashed 빈 자리 · Primary 페이지 진입 · Soft 인라인 추가) + FilterBar 우측 Primary CTA 1개. **페이지 패턴이 아니라 액션 규칙** — List/Form 등 어느 페이지 패턴 위에도 얹힌다. 버튼 실측은 `pattern:cashwalk-biz-button`, 오버뷰 `pattern:cashwalk-biz-page-patterns`. 대량/계층 선택의 진입 버튼은 `pattern:cashwalk-biz-selection-pattern`. Figma docs 4023-1128 / pattern 3993-965 실측 반영.

## rules

- **언제 쓰나**: PRD 에 '등록 / 추가 / 새로 만들기' 키워드가 있거나, 리스트 페이지 FilterBar 우측에 메인 액션 1개가 필요하거나, SelectedItemsPanel 같은 '빈 슬롯' 에 항목을 추가할 수 있어야 할 때.
- **AddButton 은 3변형 — 맥락으로 고른다 (결정 트리 Q1)**: ① **Dashed (추가 자리)** = 1px 점선 테두리 + 흰 배경, '+ 지역 추가' 처럼 SelectedItemsPanel 등 '비어있는 추가 자리' 를 표현(⚠ 전용 컴포넌트 미생성 — 현재는 합성, 추후 전용 컴포넌트 권장). ② **Primary (페이지·플로우 진입)** = Solid/Primary 캐포비 노랑(#FFD100), '+ 새 퀴즈 등록' 같은 메인 진입 CTA → 실제 Button 인스턴스. ③ **Soft (인라인 추가)** = Soft/Neutral Medium, 리스트 마지막 행 '[+ 옵션 추가]' 같은 작은 인라인 추가 → 실제 Button 인스턴스.
- **텍스트는 항상 '+ 명사' 형식**: '+ 지역 추가 / + 카테고리 추가 / + 이미지 추가'. ⚠ 동사형('추가하기')과 '+' 를 동시에 쓰지 않는다 — '+ 추가하기' 는 의미 중복. 명사형으로 강제.
- **AddButton 크기**: Button Medium (44h) 권장 (`pattern:cashwalk-biz-button`).
- **FilterBar Primary CTA — 우측 끝 1개만**: 리스트 페이지 FilterBar 우측 끝에 주 액션 1개를 둘 수 있다. 페이지에서 가장 빈번한 액션 1개('+ 퀴즈 등록하기', '+ 새 메시지')를 필터·검색과 같은 라인에 둬 도달성을 높인다. 색 = Solid/Primary 노랑(#FFD100). 좌측 영역 = DateInput 2개 + TextInput(검색) 실제 컴포넌트 인스턴스. CTA 는 우측 끝, `layoutSizingHorizontal=FILL` spacer 로 밀어낸다.
- **FilterBar 박스**: 패딩 상하 12 / 좌우 16, 배경 `surface-soft`, radius 8.
- **좁은 화면**: 폭이 좁아지면 CTA 텍스트를 숨기고 아이콘만 노출([+] floating).
- **안티패턴 (하드)**: FilterBar 에 액션 버튼 2개 이상 나열 금지 — 시각 위계가 깨지고 클릭 망설임을 유발한다. 보조 액션(Export·Delete·Setting 등)은 FilterBar 에 두지 말고 페이지 상단 메뉴 / 행별 액션 / 검색 결과 위 액션 칩으로 분산. CTA 없는 페이지는 FilterBar 를 필터·검색만으로 깨끗하게 둔다.
- **Validate (PRD → 컴포넌트 매핑)**: ① 텍스트가 '+ 명사' 형식인가 → 명사형 강제. ② 페이지·플로우 진입 액션 → Button Solid/Primary. ③ 빈 슬롯에 추가 → Dashed AddButton(전용 컴포넌트 추후 권장). ④ 리스트 마지막 행 인라인 → Button Soft/Neutral. ⑤ FilterBar 우측 액션은 1개만.

## avoid

- AddButton 텍스트에 '+' 와 동사 동시 사용 ('+ 추가하기') — 의미 중복, '+ 명사' 로
- FilterBar 에 액션 버튼 2개 이상 나열 — 보조 액션은 상단 메뉴/행별/액션 칩으로 분산
- Dashed AddButton 을 페이지 메인 CTA 로 사용 (위계 약함 — 메인 진입은 Primary)
- Primary AddButton 을 인라인 추가에 사용 (시각 과잉 — 인라인은 Soft/Neutral)
- 리스트 행별 액션을 FilterBar 로 모으기
- Secondary 액션(Export·Delete·Setting)을 FilterBar 우측에 두기
