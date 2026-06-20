---
examples:
  - verdict: good
    source: Figma 3612-9 (캐포비 Dashboard 패턴)
    caption: Sidebar + 헤더(제목 + 기간조회/자료다운로드 Pill) + 노란 틴트 Summary Strip(인라인 지표 4종 구분선) + 라인/바 2-up 차트 카드(h360) + 항목별 통계 테이블. 카드 12/24.
  - verdict: bad
    source: 잘못된 대시보드
    caption: 지표를 KPI 카드 4장 grid 로 + 차트 종류 불명 + 데이터 없을 때 빈 차트 방치 — Dashboard 패턴 위반.
metrics:
  status: Figma 실측 반영 (docs 3626-855 / pattern 3612-9)
  composition: 01 Sidebar → 02 Header+Actions → 03 Summary Strip → 04 Charts(2-up) → 05 Stats Table
  shell: admin-shell (Sidebar 3304:617)
  mainAreaPadding: 48px
  sectionItemSpacing: 32px
  pageTitle: "Heading1 Bold 32/40 #111"
  headerActions: "Pill — [기간 조회] outline + [자료 다운로드] solid yellow #FFD200"
  summaryStrip: "인라인 지표 strip (개별 KPI 카드 미사용) · 라벨 Caption 12/16 #666 + 값 Bold · 세로 구분선 · bg Yellow/100 #FFFAE5"
  charts: 라인 + 바 2-up (gridline·범례) · 카드 높이 360px
  statsTable: 헤더 행(연회색) + 데이터 행 · 숫자 우측 정렬
  cardRadius: 12px
  cardPadding: 24px
  cardBorder: "1px #F5F5F5 (--semantic-border-normal-subtle)"
  cardBg: --semantic-bg-surface-default (#FFFFFF)
  canvasBg: --semantic-bg-surface-subtle (#FAFAFA)
  validateSummaryThreshold: 핵심 지표 ≤ 4 → Summary Strip / >4 → 별도 카드·그리드
  resultState: 데이터 없음 → 회색 패널 + 안내문
  relatedPatterns: cashwalk-biz-page-patterns, admin-shell, dense-list
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3612-9
references:
  - label: 캐포비 Dashboard 패턴 SSOT (Figma 3612-9)
    image: references/cashwalk-biz-dashboard-3612-9.png
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3612-9
    caption: Sidebar + 헤더 Pill + 노란 틴트 Summary Strip + 라인/바 2-up + 통계 테이블. metrics 는 이 노드 실측 기준.
    project: cashwalk-biz
  - label: 캐포비 Dashboard docs (Figma 3626-855)
    image: references/cashwalk-biz-dashboard-docs-3626-855.png
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-855
    caption: 언제 사용 · Section 구조 · Layout Spec · Validate Rule 원문 스펙 문서.
    project: cashwalk-biz
---

## summary

캐시워크 포 비즈니스 어드민 **Dashboard 패턴** — 주요 지표·통계·차트를 한눈에 보여주는 통계/현황 화면. 구성: 01 Sidebar → 02 Page Header+Actions(Pill) → 03 Summary Strip(인라인 지표, **개별 KPI 카드 미사용**) → 04 Charts(라인+바 2-up) → 05 Stats Table. shell 은 `pattern:admin-shell`. 오버뷰 `pattern:cashwalk-biz-page-patterns`. Figma docs 3626-855 / pattern 3612-9 실측 반영.

## rules

- **언제 쓰나**: PRD 에 '대시보드 / 메인 / 홈 / 요약 / 현황 / KPI' 키워드가 있고, 여러 데이터를 시각화해 한눈에 보여줘야 하며, 사용자가 가장 먼저 보는 진입 화면일 때.
- **Main Area**: admin-shell content 영역 padding **48px**, 섹션 간 itemSpacing **32px**. 섹션 순서는 위→아래로 요약→추세→상세: 02 Header → 03 Summary → 04 Charts → 05 Table.
- **02 Page Header + Actions**: 좌측 제목(Heading1 Bold 32/40) + 부제, 우측 **Pill 액션** — [기간 조회](outline/white pill) + [자료 다운로드](solid yellow #FFD200 pill + download 아이콘). 본문에 액션을 흩뿌리지 않고 헤더 우측에 모은다.
- **03 Summary Strip (개별 KPI 카드 미사용)**: 핵심 지표를 **한 줄 strip** 으로 — 좌측 상태 라벨(예: '전체 캠페인 성과' + '실시간 집계 · {갱신시각} 기준'), 우측에 지표들을 **세로 구분선으로 나눠 인라인** 배치. 각 지표 = 라벨(Caption 12/16 #666) 위, 값(Bold) 아래. strip 배경은 project 노란 틴트 `Yellow/100 (#FFFAE5)`. **KPI 마다 별도 카드를 만들지 않는다.**
- **04 Charts**: 차트 카드 안에 **라인 차트 + 바 차트 2-up**(좌 추이 라인 / 우 항목별 비교 바). gridline + 범례 포함. 차트 카드 높이 **360px**(기본).
- **05 Stats Table**: 항목별 통계 테이블 — 헤더 행(연회색 bg) + 데이터 행. 우측 정렬 숫자 컬럼(노출수/클릭수/전환율/소진액 등).
- **카드 규격(차트·테이블 공통)**: radius **12px**, padding **24px**, border **1px `--semantic-border-normal-subtle`(#F5F5F5)**, bg `--semantic-bg-surface-default`(#FFFFFF). 페이지 캔버스는 `--semantic-bg-surface-subtle`(#FAFAFA).
- **01 Sidebar**: 좌측 LNB = Sidebar 컴포넌트(Figma 3304:617) — 계정 정보 + 광고/자산/계정 관리 섹션. admin-shell 의 nds-shell__sidebar 슬롯. **items 를 새로 만들지 말고 `pattern:cashwalk-biz-admin-sidebar` 의 ready-made 트리를 복붙(아이콘 inline 완료)하고 activeKey 만 이 화면 키로.**
- **Validate**: ① 핵심 지표 ≤ 4개 → Summary Strip, 그 이상 → 별도 통계 카드/그리드 검토. ② Chart 종류(Line/Bar/Donut) 명시 — Chart Library 25종 참조. ③ 데이터 없음 → Empty State 변형(회색 패널 + 안내문). ④ 갱신 시각 필요 → Header(또는 Summary)에 '마지막 갱신 mm/dd hh:mm' 추가.

## avoid

- Summary 지표를 **개별 KPI 카드**(카드 4장 grid)로 — 캐포비 대시보드는 노란 틴트 인라인 strip 1개
- 요약·차트·테이블 위계를 뒤섞어 배치
- 헤더 Pill 액션 대신 본문 곳곳에 액션 버튼 분산
- 차트 카드 radius/padding 을 폼 카드(16/48)와 다르게 임의 설정 — 대시보드 카드는 12/24
- 데이터 없음 상태를 빈 차트/빈 테이블로 방치 — Empty State 패널 + 안내문
- 차트 종류를 정의 없이 그리기 (Line/Bar/Donut 중 무엇인지 명시)
