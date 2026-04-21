# Harness 구조 — Design System 기반 UI 개발 파이프라인

> v4.4 문서 기반. Harness = AI 호출 단계 + .md 산출물 계약.

## 파이프라인 흐름

```
Ticket (비정형)
    |
    v
[Harness 1] ── HARNESS_1_PROMPT.md
    |
    v
PRD.md (구조화된 기획서)
    |
    v
[Harness 2] ── HARNESS_2_PROMPT.md  <── DS Registry (componentInventory.json)
    |
    v
UI_SCHEMA.md + Coverage (DS 매핑)
    |
    v
[Mockup Renderer] ── MOCKUP_RENDERER_PROMPT.md  <── DS Registry
    |
    v
mockup.tsx + mock-data.ts (React 목업, ephemeral)
    |
    v
Storybook 호스팅 → 기획자 피드백 루프
```

## 디렉토리 구조

```
harness/
  README.md                    ← 이 파일
  HARNESS_1_PROMPT.md          ← Harness 1: Ticket → PRD.md
  HARNESS_2_PROMPT.md          ← Harness 2: PRD → UI Schema + Coverage
  MOCKUP_RENDERER_PROMPT.md    ← Mockup Renderer: Schema → React 목업

mockups/{ticketId}/
  PRD.md                       ← Harness 1 산출물
  UI_SCHEMA.md                 ← Harness 2 산출물
  mockup.tsx                   ← Mockup Renderer 산출물 (ephemeral)
  mock-data.ts                 ← Mock 데이터
```

## Harness 4요소

각 Harness는 다음 4가지로 구성:

1. **Input contract** — 입력 형식/출처 명시
2. **Prompt / agent** — AI 프롬프트 템플릿
3. **Output contract (.md)** — 산출물 형식 고정
4. **Review gate** — 사람 검토 단계

## DS Registry 연동

- `metadata/componentInventory.json`이 DS Registry 역할
- Harness 2, Mockup Renderer 모두 이 파일을 참조
- DS 컴포넌트 추가/변경 시 Registry 업데이트 → 다음 파이프라인부터 자동 반영

## 산출물 원칙

- 모든 중간 산출물은 `.md`로 git에 저장
- UI Schema는 **ephemeral** — 저장 자산이 아닌 중간 표현
- mockup.tsx도 ephemeral — 구현 시작점으로만 활용
- PRD.md만 영구 자산
