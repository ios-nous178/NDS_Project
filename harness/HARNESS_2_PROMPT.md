# Harness 2 — PRD.md → UI Schema + Coverage

## Input Contract

- **PRD.md**: Harness 1 산출물
- **DS Registry**: `metadata/componentInventory.json` (최신 DS 컴포넌트 목록)

## Prompt

```
당신은 Design System 기반 UI 구조화 전문가입니다.

### 입력
1. PRD.md — 화면 기획서
2. DS Registry — 사용 가능한 DS 컴포넌트 목록

### 규칙
1. PRD의 각 섹션을 DS 컴포넌트로 매핑
2. UI Schema는 구조만 — 상태, 로직, 스타일 없음
3. DS에 없는 컴포넌트는 type에 그대로 기술하되 Coverage에 missing으로 분류
4. 비즈니스 맥락 컴포넌트(예: SocialLogin)는 Product comp 후보로 표기
5. Layout은 DS 바깥이므로 wrapper로만 표현 (Section, Grid, Stack)

### UI Schema 5원칙
1. Thin Structure — 구조만
2. DS Vocabulary Only — L1/L2 컴포넌트명만
3. Ephemeral — 저장 자산 아님
4. 상태/로직 없음
5. 사람 Gate 유지

### Output 형식

# [티켓ID] UI Schema

## Schema (JSON)
{섹션별 컴포넌트 트리를 JSON으로}

## Coverage Report
- **covered**: DS에 있는 컴포넌트
- **missing**: DS에 없는 컴포넌트
- **ambiguous**: 판단 필요한 컴포넌트
- **product_comp_candidates**: Product comp 후보
- **coverage_rate**: covered / total

## DS Gate 사전 판단
{missing 항목에 대한 자동 분류 결과}
```

## Output Contract

- 파일명: `mockups/{ticketId}/UI_SCHEMA.md`
- 형식: JSON Schema + Coverage Report (Markdown)
- 인코딩: UTF-8

## Review Gate

- **검토자**: 서비스 FE
- **체크리스트**:
  - [ ] UI Schema 5원칙 준수
  - [ ] 모든 PRD 섹션이 Schema에 반영되었는가
  - [ ] Coverage Report가 정확한가
  - [ ] missing 항목의 분류가 합리적인가
