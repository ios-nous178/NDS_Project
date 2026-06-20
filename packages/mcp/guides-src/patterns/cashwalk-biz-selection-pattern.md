---
examples:
  - verdict: good
    source: Figma 3995-1036 (캐포비 Selection 패턴 — 지역 선택)
    caption: "[+ 지역 추가] Trigger → 760×440 좌(검색+트리 Checkbox)/우(선택 누적 경로 + ×) Modal + [적용] → 페이지 SelectedItemsPanel('선택한 지역 48개', 카운트 노랑, 경로 행). 시/도 > 시/군/구 계층."
  - verdict: bad
    source: 잘못된 선택 화면
    caption: 30개 미만 평면인데 모달로 분리 + 모달 푸터 [취소][적용][초기화] 3개 + Trigger 없이 패널만 — Selection 패턴 위반.
metrics:
  status: Figma 실측 반영 (docs 4023-1194 / pattern 3995-1036)
  composition: ① Trigger(Dashed AddButton) → ② Modal Picker(TreePicker) → ③ SelectedItemsPanel
  trigger: Dashed AddButton '+ 지역 추가' (action-pattern Dashed 재사용 · 전용 컴포넌트 추후 권장)
  modalPickerSize: 760×440 (좌 380 + 우 379 · 헤더 56 · 푸터 72)
  modalLeft: TextInput 검색 + 트리(Checkbox 인스턴스) · 행 48h · depth padding-left +16 · 체크박스 좌측
  modalRight: 선택 누적 · 행 32h · 경로 표시 + × 개별 해제 · 헤더 카운트 + 전체 해제
  modalFooter: Primary [적용] 1개
  treeBehavior: 부모 체크=자식 전체 / 일부 자식=부모 indeterminate
  selectedItemsPanel: "헤더(라벨 + 카운트 #FFD100 + 전체 해제) · 행=경로 + × · 6개+ 내부 스크롤 · 0개 빈 상태 + Trigger 강조"
  panelLocations: 페이지 내(5~30 · 지속 노출) / 모달 내 우측(30+·계층)
  validateCountThreshold: < 30 평면 → Checkbox 인라인 / ≥ 30 또는 계층 → Modal Picker(TreePicker)
  validatePanelRule: 선택 결과 페이지 노출 → SelectedItemsPanel 필수
  maxModalFooterActions: 1
  relatedPatterns: cashwalk-biz-page-patterns, cashwalk-biz-action-pattern, cashwalk-biz-page-form, cashwalk-biz-page-list, component:Checkbox, component:Modal, component:TextInput
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3995-1036
references:
  - label: 캐포비 Selection 패턴 SSOT — 지역 선택 (Figma 3995-1036)
    image: references/cashwalk-biz-selection-pattern-3995-1036.png
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3995-1036
    caption: Trigger + 좌우 분할 Modal Picker(트리/선택 누적) + SelectedItemsPanel + 결정 트리 + Do/Don't. metrics 는 이 노드 실측 기준.
    project: cashwalk-biz
  - label: 캐포비 Selection docs (Figma 4023-1194)
    image: references/cashwalk-biz-selection-docs-4023-1194.png
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=4023-1194
    caption: 언제 사용 · Section 구조 · Layout Spec · Validate Rule(PRD→컴포넌트 매핑) 원문 스펙 문서.
    project: cashwalk-biz
---

## summary

캐시워크 포 비즈니스 어드민 **Selection 패턴 (#07)** — 계층/대량 항목 선택을 한 세트로 묶는 표준. **Trigger + Modal Picker(TreePicker) + SelectedItemsPanel** 3요소. 지역(시/도 > 시/군/구)·카테고리·타겟팅처럼 항목이 많거나(≥30) 계층 구조이고 선택 결과를 페이지에 지속 노출해야 할 때. 진입 버튼은 `pattern:cashwalk-biz-action-pattern` 의 Dashed AddButton 재사용. 오버뷰 `pattern:cashwalk-biz-page-patterns`. Figma docs 4023-1194 / pattern 3995-1036 실측 반영.

## rules

- **언제 쓰나**: PRD 에 '지역 선택 / 카테고리 선택 / 타겟팅' 같은 다중 선택 키워드가 있고, 항목 수가 30개 이상이거나 계층 구조(시/도 > 시/군/구)이며, 선택 결과가 페이지 안에 지속 노출되어야 할 때.
- **3요소를 한 세트로 묶는다**: ① Trigger ② Modal Picker(TreePicker) ③ SelectedItemsPanel. 셋 중 하나만 떼어 쓰지 않는다(특히 Trigger 없이 패널만, 패널 없이 모달만 금지).
- **① Trigger**: 선택 진입점 = **Dashed AddButton 형태**('+ 지역 추가', 1px 점선 + 흰 배경 — `pattern:cashwalk-biz-action-pattern` 의 Dashed 변형 재사용). 클릭 시 Modal Picker 가 현재 선택 항목으로 초기화돼 열린다. 텍스트는 '+ 명사'('+ 지역 추가' / '+ 카테고리 추가'). ⚠ 전용 AddButton 컴포넌트 미생성 — 추후 권장.
- **② Modal Picker (좌·우 분할)**: 크기 **760×440** (좌측 380 + 우측 379 · 헤더 56 · 푸터 72). **좌측(≈50%)** = TextInput 검색 + 트리(각 행에 실제 Checkbox 인스턴스 · 행 **48h** · depth 별 padding-left **+16** · 체크박스 좌측). **우측(≈50%)** = 선택 누적 패널(SelectedItemsPanel 과 동일 구조 · 행 **32h** · 경로 표시 '강원도 > 강릉시' + × 개별 해제 · 헤더에 카운트 + 전체 해제). **푸터** = 우측 Primary CTA **[적용] 1개만**.
- **트리 동작**: 부모 체크 시 자식 모두 선택 / 일부 자식만 선택 시 부모는 **indeterminate**. [적용] 을 누르면 SelectedItemsPanel 에 반영되고 모달이 닫힌다.
- **③ SelectedItemsPanel**: 페이지 안에 선택 결과를 항상 보이게 누적. 헤더 = 라벨 + **선택 카운트(노란 #FFD100 강조)** + 우측 [+ 추가 선택]/[전체 해제]. 각 행 = **경로 표시** + × 개별 해제. 항목 6개 이상이면 max-height + 내부 스크롤(페이지 흐름 보호). 빈 상태(0개) = '선택한 항목 없음' + Trigger 강조. 본문은 컨텐츠 슬롯(리스트/풀/테이블 Swap).
- **SelectedItemsPanel 은 두 위치에서 같은 구조 공유**: 페이지 내(지속 노출 + 다른 필드와 병렬 · 다중 5~30개) / 모달 내 우측(선택 집중 · 다중 30+·계층).
- **Validate (PRD → 컴포넌트 매핑 · 결정 트리)**: ① 항목 < 30 + 평면 구조 → Checkbox 그룹 **인라인**(모달 불필요). ② 항목 ≥ 30 또는 계층 구조 → **Modal Picker(TreePicker)**. ③ 선택 결과가 페이지에 노출돼야 함 → **SelectedItemsPanel 필수**(모달 안에서만 보이면 생략 가능).

## avoid

- Trigger 없이 SelectedItemsPanel 만 노출 (진입점 누락)
- Modal Picker 안에 또 다른 모달 중첩
- 체크박스 인라인으로 충분(항목 < 30 + 평면)한데 모달로 분리
- Modal 푸터에 [취소]+[적용]+[초기화] 3개 이상 — Primary [적용] 1개만
- SelectedItemsPanel 행에 경로(강원도 > 강릉시) 없이 말단 이름만 표시
- 선택 결과를 모달 닫으면 사라지게 — 페이지 지속 노출이 필요하면 SelectedItemsPanel 유지
