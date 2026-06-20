---
metrics:
  status: skeleton — Figma 실측 대기
  patternCount: 5
  patterns: onboarding / dashboard / list / detail / form
  figmaFile: 7dCJU5lNPfgcAjFPwbbLIu (📐 Page Pattern)
  assemblyOrder: ① 패턴 선택 → ② 섹션 구조화 → ③ 컴포넌트 조립 → ④ validate
  relatedPatterns: cashwalk-biz-page-{onboarding,dashboard,list,detail,form}, cashwalk-biz-action-pattern, cashwalk-biz-selection-pattern, admin-shell, cashwalk-biz-form-layout, cashwalk-biz-button, cashwalk-biz-input, cashwalk-biz-tab, cashwalk-biz-badge-chip, cashwalk-biz-step-progress
references:
  - label: Onboarding docs
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-792
    project: cashwalk-biz
  - label: Onboarding pattern
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3611-2
    project: cashwalk-biz
  - label: Dashboard docs
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-855
    project: cashwalk-biz
  - label: Dashboard pattern
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3612-9
    project: cashwalk-biz
  - label: List docs
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-915
    project: cashwalk-biz
  - label: List pattern
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3613-234
    project: cashwalk-biz
  - label: Detail docs
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-978
    project: cashwalk-biz
  - label: Detail pattern
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3614-367
    project: cashwalk-biz
  - label: Form docs
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-1041
    project: cashwalk-biz
  - label: Form pattern
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3615-522
    project: cashwalk-biz
  - label: Action docs (#06 — 페이지 패턴 아닌 액션 규칙)
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=4023-1128
    project: cashwalk-biz
  - label: Action pattern
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3993-965
    project: cashwalk-biz
  - label: Selection docs (#07 — 페이지 패턴 아닌 선택 규칙)
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=4023-1194
    project: cashwalk-biz
  - label: Selection pattern
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3995-1036
    project: cashwalk-biz
---

## summary

**[Page Pattern System 오버뷰]** 캐시워크 포 비즈니스 어드민 화면을 5개 페이지 패턴으로 표준화 — Onboarding / Dashboard / List / Detail / Form. 개별 컴포넌트부터 쌓지 말고 'PRD → 페이지 패턴 매핑 → 섹션 구조화 → 패턴 내 반복 컴포넌트 조립' 순서로 화면을 만든다. 패턴별 상세는 `pattern:cashwalk-biz-page-{onboarding|dashboard|list|detail|form}`. 필드/CTA/입력 단위 실측은 `pattern:cashwalk-biz-form-layout` · `pattern:cashwalk-biz-button` · `pattern:cashwalk-biz-input`, shell 보일러플레이트는 `pattern:admin-shell`. Figma 7dCJU5lNPfgcAjFPwbbLIu (📐 Page Pattern).

## rules

- **먼저 패턴을 고른다 (하드 게이트)**: 새 어드민 화면을 받으면 PRD 의 목적을 5개 패턴 중 하나로 먼저 분류한다 — 로그인/계정복구=Onboarding, 통계/요약 홈=Dashboard, 목록·검색=List, 단건 상세/탭=Detail, 등록·수정=Form. **Form 은 다시 단건/다단계로 갈린다 — 한 화면(Step Progress 없음, 제목+부제+콘텐츠 하단 우측 정렬 [취소][저장])=`cashwalk-biz-form-layout`, 다단계(캠페인→광고→소재 등 Step Progress)=`cashwalk-biz-page-form`. 이름이 비슷하니 하단 액션이 헷갈리면 단건은 콘텐츠 끝 우측 정렬 [취소][저장](별도 바·고정 없음), 다단계는 좌/우 분리 Footer.** 분류 없이 컴포넌트부터 배치하지 않는다. **이건 권고가 아니라 강제다** — surface=admin + project=cashwalk-biz 화면은 패턴 선언이 없으면 validate 가 error(`cashwalk-biz-admin-page-pattern`)로 막는다.
- **패턴 선언 방법**: HTML 목업은 루트에 `data-page-pattern` 마커 — 예: `<html data-project="cashwalk-biz" data-page-pattern="list">`(또는 body / .mockup-screen). DesignSpec 은 `screen.pagePattern` 필드에 `onboarding|dashboard|list|detail|form` 중 하나. surfaceKind=admin 은 nudge.surface 마커에서 자동 주입되니 보통 pagePattern 만 채우면 된다.
- **조립 순서 고정**: ① 페이지 패턴 선택 → ② 패턴의 섹션 슬롯 채우기(섹션 단위 구조화) → ③ 섹션 안 반복 컴포넌트(테이블·필터·필드·차트)를 DS 컴포넌트로 조립 → ④ validate. 역순(컴포넌트 먼저)으로 가면 패턴 일관성이 깨진다.
- **shell 은 공통**: 모든 패턴은 사이드바 + topbar + content 의 `admin-shell`(nds-shell 계열) 위에 얹힌다. 패턴은 content 영역의 섹션 구성만 정의한다 — raw shell CSS 재정의 금지(`pattern:admin-shell`).
- **한 화면 = 한 패턴**: 한 페이지에 List + Form 을 섞지 않는다. 인라인 등록이 필요하면 List 안의 모달/드로어로 Form 패턴을 띄우되, 패턴 경계는 유지한다.
- **필드/버튼/입력 실측은 위임**: 페이지 패턴은 '무엇이 어디에' 까지만 정의. 라벨 컬럼·필드 높이·CTA 알약 같은 px 단위는 `cashwalk-biz-form-layout` / `cashwalk-biz-button` / `cashwalk-biz-input` 가 SSOT.
- **페이지 패턴 위에 얹는 액션·선택 규칙(페이지 패턴 아님)**: 추가/등록 액션의 배치·문구(AddButton 3변형 + FilterBar 우측 CTA)는 `pattern:cashwalk-biz-action-pattern`, 계층/대량 항목 선택(Trigger + Modal Picker + SelectedItemsPanel)은 `pattern:cashwalk-biz-selection-pattern`. 둘 다 List/Form 등 어느 패턴 위에도 얹히는 가로 규칙이라 pagePattern 선언과 별개다.

## avoid

- 패턴 분류 없이 컴포넌트부터 화면에 배치
- 한 페이지에 두 패턴(예: 목록 + 등록 폼)을 한 흐름으로 섞기
- 페이지 패턴 가이드 안에 필드 높이·CTA px 같은 컴포넌트 단위 실측을 중복 정의 (cashwalk-biz-* 컴포넌트 가이드가 SSOT)
- admin-shell 대신 raw <div class="page"> + grid CSS 로 shell 직접 작성
