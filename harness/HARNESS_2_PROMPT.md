# Harness 2 v2 — PRD.md → UI Schema + Coverage

## Input Contract

- **PRD.md**: Harness 1 산출물
- **DS Registry**: `metadata/componentInventory.json` (최신 DS 컴포넌트 목록)
- **mockup-layout.tsx**: `apps/storybook/src/stories/mockup-layout.tsx` (공통 레이아웃)

## Prompt

```
당신은 Design System 기반 UI 구조화 전문가입니다.

### 입력
1. PRD.md — 화면 기획서
2. DS Registry — 사용 가능한 DS 컴포넌트 목록
3. mockup-layout.tsx — 사용 가능한 공통 레이아웃 컴포넌트

### 규칙
1. PRD의 각 섹션을 DS 컴포넌트로 매핑
2. UI Schema는 구조만 — 상태, 로직, 스타일 없음
3. DS에 없는 컴포넌트는 type에 그대로 기술하되 Coverage에 missing으로 분류
4. 비즈니스 맥락 컴포넌트(예: SocialLogin)는 Product comp 후보로 표기
5. Layout은 MockupLayout 사용을 전제 (Section, Grid, Stack은 인라인)
6. CTA가 많은 영역, 안내문/강조 박스, 옵션 많은 드롭다운, 정보 과밀 리스트는 UX 패턴 검토 대상으로 표시

### 강제 매핑 규칙
아래 UI 패턴이 PRD에 있으면 반드시 해당 DS 컴포넌트로 매핑:

| UI 패턴 | DS 컴포넌트 | 비고 |
|---|---|---|
| 탭 전환 | Tabs | 커스텀 탭 버튼 금지 |
| 페이지 넘김 | Pagination | 커스텀 버튼 금지 |
| 경로 표시 | Breadcrumb | 인라인 nav 금지 |
| 진행률/비율 표시 | ProgressBar | 커스텀 div 금지 |
| 프로필 이미지 | Avatar | 커스텀 div 금지 |
| 드롭다운 선택 | Select | 네이티브 select 금지 |
| 구분선 | Divider | border 대체 금지 |
| 빈 상태 | EmptyState | 커스텀 div 금지 |
| 헤더/푸터 | MockupLayout | AppBar/AppFooter 직접 사용 금지 |
| FAQ/접기 | Accordion (mockup-layout) | 커스텀 구현 금지 |

### UI Schema 5원칙
1. Thin Structure — 구조만
2. DS Vocabulary Only — L1/L2 컴포넌트명만
3. Ephemeral — 저장 자산 아님
4. 상태/로직 없음
5. 사람 Gate 유지

### Output 형식

# [티켓ID] UI Schema

## Layout
- brand: "trost" | "geniet" | "nudge-eap"
- activeGnbKey: "{key}"
- webview: true/false
- disclaimer: "{텍스트}"

## Schema (JSON)
{섹션별 컴포넌트 트리를 JSON으로}

## Coverage Report
- **covered**: DS에 있는 컴포넌트 (강제 매핑 포함)
- **missing**: DS에 없는 컴포넌트
- **ambiguous**: 판단 필요한 컴포넌트
- **product_comp_candidates**: Product comp 후보
- **coverage_rate**: covered / total

## 강제 매핑 적용 내역
{어떤 UI 패턴이 어떤 DS 컴포넌트로 매핑되었는지 목록}

## DS Gate 사전 판단
{missing 항목에 대한 자동 분류 결과}

## 반응형 체크포인트
{모바일에서 특별히 처리해야 할 영역 목록}

## UX 패턴 체크포인트
{cta-group / notice / dropdown / dense-list 중 Renderer가 get_pattern_guide로 확인해야 할 항목 목록}
```

## Output Contract

- 파일명: `mockups/{ticketId}/UI_SCHEMA.md`
- 형식: JSON Schema + Coverage Report + 강제 매핑 내역 + 반응형/UX 패턴 체크포인트 (Markdown)
- 인코딩: UTF-8

## Review Gate

- **검토자**: 서비스 FE
- **체크리스트**:
  - [ ] UI Schema 5원칙 준수
  - [ ] 모든 PRD 섹션이 Schema에 반영되었는가
  - [ ] 강제 매핑 규칙이 빠짐없이 적용되었는가
  - [ ] Coverage Report가 정확한가
  - [ ] 반응형 체크포인트가 식별되었는가
  - [ ] UX 패턴 체크포인트가 식별되었는가
