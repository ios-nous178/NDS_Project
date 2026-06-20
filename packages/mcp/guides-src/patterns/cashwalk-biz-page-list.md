---
examples:
  - verdict: good
    source: Figma 3613-234 (캐포비 List 패턴 — 배너광고 목록)
    caption: 헤더(제목 + 등록하기) + FilterBar(검색·상태·기간) + 테이블(이미지·캠페인명·상태 Badge·노출수·클릭수·소진액·노출 Toggle·관리 수정/삭제) + 중앙 페이지네이션 + 페이지 사이즈 셀렉트.
  - verdict: bad
    source: 잘못된 목록 화면
    caption: 상태를 색 없는 텍스트로 + 노출을 체크박스로 + 행마다 버튼 흩뿌리기 + Empty state 없이 빈 테이블 — List 패턴 위반.
metrics:
  status: Figma 실측 반영 (docs 3626-915 / pattern 3613-234)
  composition: 01 Sidebar → 02 Header+등록하기 → 03 FilterBar → 04 Table → 05 Pagination
  shell: admin-shell
  pageTitle: "Heading1 Bold 32/40 #111"
  primaryAction: "'등록하기' Primary Button (헤더 우측)"
  filterBar: Search Input + Dropdown 필터 + DateRange · radius 12 · padding 20/24
  tableRadius: 12px
  tableRowPadding: 16/24
  tableRowBorder: "1px #F5F5F5 (row 사이)"
  tableHeaderBg: --semantic-bg-surface-subtle (#FAFAFA)
  rowCells: 썸네일 + 링크 텍스트 + 상태 Badge + 숫자(우측정렬) + 노출 Toggle + 관리(수정/삭제 아이콘)
  statusBadge: 진행중=success · 진행예정=subtle · 종료=neutral
  pagination: 중앙 정렬 · 버튼 32×32 · 현재 페이지 = 검정(#111) fill + 흰 텍스트 (project yellow 아님)
  pageSizeSelect: "'10개씩 보기' 셀렉트 (우측)"
  validatePaginationThreshold: Row > 50 필수 / ≤ 10 생략
  validateFilterThreshold: 필터 > 4 → 패널 분리
  resultState: "'등록된 OOO이 없습니다' + CTA 필수"
  relatedPatterns: cashwalk-biz-page-patterns, cashwalk-biz-action-pattern, admin-shell, action-row, dense-list, cashwalk-biz-page-detail, cashwalk-biz-badge-chip, cashwalk-biz-tab, cashwalk-biz-admin-alert-banner
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3613-234
references:
  - label: 캐포비 List 패턴 SSOT — 배너광고 목록 (Figma 3613-234)
    image: references/cashwalk-biz-list-3613-234.png
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3613-234
    caption: 헤더 + FilterBar + 상태배지/노출토글/관리 테이블 + 페이지네이션. metrics 는 이 노드 실측 기준.
    project: cashwalk-biz
  - label: 캐포비 List docs (Figma 3626-915)
    image: references/cashwalk-biz-list-docs-3626-915.png
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-915
    caption: 언제 사용 · Section 구조 · Layout Spec · Validate Rule 원문 스펙 문서.
    project: cashwalk-biz
---

## summary

캐시워크 포 비즈니스 어드민 **List 패턴** — 검색/필터/페이지네이션이 있는 데이터 목록 화면. 구성: 01 Sidebar → 02 페이지 헤더+Primary Action('등록하기') → 03 FilterBar → 04 Table(썸네일·상태배지·노출토글·수정/삭제) → 05 Pagination. Detail 진입 전 단계. shell 은 `pattern:admin-shell`. 오버뷰 `pattern:cashwalk-biz-page-patterns`. Figma docs 3626-915 / pattern 3613-234 실측 반영.

## rules

- **언제 쓰나**: PRD 에 '목록 / 조회 / 검색 / 필터링 / 리포트(테이블)' 키워드가 있고, 여러 row 데이터를 비교·탐색해야 하며, Detail 화면으로 진입하기 전 단계일 때.
- **02 페이지 헤더 + Primary Action**: 좌측 제목(Heading1 Bold 32/40) + 부제, 우측 **'등록하기' Primary Button** 1개(cashwalk-biz Solid/Primary = 노란 #FFD200 + 검정, `pattern:cashwalk-biz-button`). 목록의 주 액션은 헤더 우측에만 둔다.
- **(선택) 광고비/충전 안내 배너**: 잔액 소진 임박 등 조건 충족 시 페이지 헤더 아래·탭/FilterBar 위에 `pattern:cashwalk-biz-admin-alert-banner`(soft 옐로우 + 종 일러스트 + 노란 pill CTA) 1개. 상시 노출 아님.
- **03 FilterBar**: 테이블 위 한 줄(`pattern:action-row`) — Search Input + Dropdown 필터(상태 등) + 기간(DateRange). 카드 형태: radius **12px**, padding **20/24**. **상태 필터(활성/정지 등)는 Dropdown 필터 또는 상태 톤 칩으로 — solid 초록(활성)/빨강(정지) 버튼 금지**(테이블 상태 Badge 색과 충돌하고, 필터 선택과 상태 표시가 혼동됨).
- **04 Table**: 헤더 행 + 데이터 행. 헤더 행 배경 `--semantic-bg-surface-subtle`(#FAFAFA). 카드 radius **12px**, Row padding **16/24**, Row 사이 **1px border `#F5F5F5`**. 컬럼은 균등 또는 flex.
- **행 셀 컴포넌트**: 썸네일(이미지 컬럼) + 핵심 텍스트(클릭 시 Detail 진입 — 링크색) + **상태 = Badge**(진행중=success/green · 진행예정=subtle · 종료=neutral gray) + 숫자 컬럼 우측 정렬 + **노출 = Toggle**(노출 on green / 미노출 off) + **관리 = 수정(pencil)·삭제(trash) 아이콘 액션**. 상태를 raw 텍스트로, 노출을 체크박스로 만들지 않는다.
- **펼침(트리) 리포트 행 (선택)**: 날짜별/그룹별 리포트처럼 상위 행을 펼쳐 하위(캠페인·광고) 행을 보는 표는 `nds-data-table` 의 `sub-rows-key`(React `getSubRows`) — [+]/[−] 토글 + 자식 행 들여쓰기 자동. 표 하단 합계행이 같이 필요하면 StatsTable 의 `<tr class="is-summary">` 와 조합.
- **05 Pagination**: 중앙 정렬 페이지 번호, 버튼 **32×32**, **현재 페이지 = 검정(neutral 900 / #111) fill + 흰 텍스트**(project yellow 아님 — 노랑은 활성/선택 강조용이라 페이지네이션 현재 페이지와 시각 충돌). 우측에 페이지 사이즈 셀렉트('10개씩 보기') 배치 가능.
- **01 Sidebar**: admin-shell 의 Sidebar 컴포넌트(대시보드와 동일 LNB). ready-made items 는 `pattern:cashwalk-biz-admin-sidebar` 복붙 + activeKey 만 변경.
- **Validate**: ① Row > 50 → 페이지네이션 필수 / ≤ 10 → 페이지네이션 생략. ② 필터 > 4개 → 필터 패널 분리(좌측 또는 상단 collapsible). ③ Row 클릭 액션 있으면 → 행 hover effect + cursor pointer. ④ Empty state 필수 → '등록된 OOO이 없습니다' + CTA. ⑤ 정렬 가능 컬럼 → Header 셀에 화살표 아이콘.

## avoid

- 필터를 테이블과 떨어뜨려 본문 곳곳에 배치 — FilterBar 는 테이블 위 한 줄
- 상태를 raw 텍스트로 (Badge 미사용), 노출 on/off 를 체크박스로 (Toggle 미사용)
- 관리 컬럼에 수정/삭제 외 잡다한 버튼 추가
- 헤더에 '등록하기' 외 primary 액션 여러 개
- Empty state 를 빈 테이블로 방치 — '등록된 OOO이 없습니다' + CTA 필수
- FilterBar/Table radius 를 12px 외로 · 헤더 행 배경 누락
- 페이지네이션 현재 페이지를 project yellow fill 로 — 현재 페이지는 검정(#111) fill + 흰 텍스트
- 상태 필터를 solid 초록(활성)/빨강(정지) 버튼으로 — Dropdown 필터 또는 상태 톤 칩. 초록/빨강 solid 는 테이블 상태 Badge 와 충돌·혼동
