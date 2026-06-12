---
examples:
  - verdict: good
    source: Figma 3614-367 (캐포비 Detail 패턴 — 여름 시즌 프로모션 상세)
    caption: Breadcrumb('목록 / OO 상세', '/' divider) + 제목 + 상태칩 + 우측 액션 + Underline 탭(기본정보/성과/히스토리) + Info Card(key 240 고정 / value flex, row 16/24 border-bottom).
  - verdict: bad
    source: 잘못된 상세 화면
    caption: Breadcrumb 없이 진입 + 상세 안에 인라인 편집 폼 + 삭제를 primary 버튼으로 확인 Modal 없이 — Detail 패턴 위반.
metrics:
  status: Figma 실측 반영 (docs 3626-978 / pattern 3614-367)
  composition: 01 Sidebar → 02 Breadcrumb → 03 Header+Status+Actions → 04 Tab(underline) → 05 Info Card
  shell: admin-shell
  breadcrumb: Body3/Subtle · divider '/' · itemSpacing 8
  pageHeader: 제목 Heading1 Bold 32/40 + 상태 ActionChip (gap 12) + 우측 액션 버튼
  tabs: Underline (기본 정보 / 성과 / 히스토리 등)
  infoCardKeyWidth: 240px 고정
  infoCardValue: flex
  keyValueRowPadding: 16/24
  keyValueRowBorder: "border-bottom 1px #F5F5F5 (--semantic-border-normal-subtle)"
  deleteAction: Outlined/Neutral · 우측 끝 · 확인 Modal 필수
  validateTabThreshold: 데이터 항목 > 15 → Tab 분리 (탭당 5~8)
  relatedPatterns: cashwalk-biz-page-patterns, admin-shell, cashwalk-biz-page-list, cashwalk-biz-page-form, card-section
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3614-367
references:
  - label: 캐포비 Detail 패턴 SSOT — 여름 시즌 프로모션 상세 (Figma 3614-367)
    image: references/cashwalk-biz-detail-3614-367.png
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3614-367
    caption: Breadcrumb + 제목/상태칩/액션 + Underline 탭 + key-value Info Card. metrics 는 이 노드 실측 기준.
    brand: cashwalk-biz
  - label: 캐포비 Detail docs (Figma 3626-978)
    image: references/cashwalk-biz-detail-docs-3626-978.png
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-978
    caption: 언제 사용 · Section 구조 · Layout Spec · Validate Rule 원문 스펙 문서.
    brand: cashwalk-biz
---

## summary

캐시워크 포 비즈니스 어드민 **Detail 패턴** — 개별 항목의 정보를 보고 액션을 수행하는 화면. 구성: 01 Sidebar → 02 Breadcrumb → 03 PageHeader+Status+Actions → 04 Tab Navigation(underline) → 05 Info Card(key-value). List 에서 row 클릭 후 진입. shell 은 `pattern:admin-shell`. 오버뷰 `pattern:cashwalk-biz-page-patterns`. Figma docs 3626-978 / pattern 3614-367 실측 반영.

## rules

- **언제 쓰나**: PRD 에 '상세 / 정보 보기 / 수정 / 편집' 키워드가 있고, List 에서 row 클릭 후 진입하며, 관련 액션(수정/삭제/실행)이 동반될 때.
- **02 Breadcrumb (필수)**: 상위 페이지 경로를 명시(예: '배너광고 목록 / 여름 시즌 프로모션 상세'). 타이포 Body3/Subtle, **divider '/' 문자**, itemSpacing **8px**. 상세는 항상 목록에서 진입하므로 경로 생략 금지.
- **03 PageHeader + Status + Actions**: 좌측 제목(Heading1 Bold 32/40) + **상태 ActionChip**(title 과 gap **12px**), 우측 **액션 버튼들**(예: outline 보조 + solid 주). 삭제 같은 위험 액션은 별도 Outlined/Neutral 버튼으로 **우측 끝** 배치.
- **04 Tab Navigation**: **Underline 탭**(예: 기본 정보 / 성과 리포트 / 히스토리). 데이터 항목이 많으면 탭으로 분리.
- **05 Info Card**: 정보 블록 = **key-value rows**(또는 FormSection). **key 컬럼 width 240px 고정, value 컬럼 flex**. key-value row padding **16/24**, **border-bottom `--semantic-border-normal-subtle`(#F5F5F5)**. 카드 안 상단에 섹션 제목.
- **01 Sidebar**: admin-shell 의 Sidebar 컴포넌트(목록/대시보드와 동일 LNB). ready-made items 는 `pattern:cashwalk-biz-admin-sidebar` 복붙 + activeKey 만 변경.
- **편집은 Form 패턴으로 분리**: 상세 화면은 보기 중심. 편집 가능 필드만 있는 화면이면 Detail 이 아니라 `pattern:cashwalk-biz-page-form` 으로 만든다. 인라인 편집 폼을 상세에 펼치지 않는다.
- **Validate**: ① 데이터 항목 > 15개 → Tab 으로 분리(탭당 5~8개). ② 편집 가능 필드만 있는 경우 → Form 패턴으로 변경. ③ 삭제 액션 → 별도 Outlined/Neutral 버튼, 우측 끝 배치. ④ 위험 액션(삭제) → 확인 Modal 필수 호출. ⑤ 권한별 액션 숨김 → BOOLEAN prop 또는 변형 변경.

## avoid

- Breadcrumb 생략 (상세 진입 경로 불명확) · divider 를 '>' 등으로 (캐포비는 '/' 문자)
- 상세 화면 안에서 바로 인라인 편집 폼 펼치기 — 편집은 Form 패턴으로 분리
- Info Card key 컬럼을 가변 폭으로 — key 240px 고정 + value flex
- 삭제(위험) 액션을 solid/primary 로 또는 확인 Modal 없이 즉시 실행
- 데이터 항목 15개 초과를 한 카드에 나열 — Tab 으로 분리
