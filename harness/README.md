# Harness v2 — Design System 기반 목업 파이프라인

> mockup-layout + 강제 매핑 규칙 + 반응형 체크리스트 적용

## 파이프라인 흐름

```
기획자: PRD (자연어, Notion, 채팅)
    |
    v
[Harness 1] ── HARNESS_1_PROMPT.md
    |
    v
PRD.md (구조화된 기획서)
    |
    v
[Harness 2 v2] ── HARNESS_2_PROMPT.md
    |               ├── DS Registry (componentInventory.json)
    |               └── mockup-layout.tsx (공통 레이아웃)
    v
UI_SCHEMA.md + Coverage + 강제 매핑 + 반응형 체크포인트
    |
    v
[Mockup Renderer v2] ── MOCKUP_RENDERER_PROMPT.md
    |                     ├── DS Registry
    |                     ├── mockup-layout.tsx
    |                     └── Self-Check 8항목
    v
{Mockup}.tsx + mock-data.ts + {Mockup}.stories.tsx
    |
    v
Storybook 확인 → 기획자 피드백 → (필요 시 재생성)
```

## v1 → v2 변경점

| v1 문제                                 | v2 해결                                                 |
| --------------------------------------- | ------------------------------------------------------- |
| 헤더/푸터 매번 인라인 → 스토리와 불일치 | MockupLayout 필수 (brand prop으로 3개 브랜드 커버)      |
| DS 컴포넌트 있는데 인라인 구현          | 강제 매핑 규칙 (Tabs, Pagination, Select 등 10개)       |
| 컴포넌트 API 틀림 (Chip children 등)    | Renderer에 자주 틀리는 API 명시 + Self-Check            |
| 모바일 반응형 미흡                      | Harness 2에서 반응형 체크포인트 식별, Renderer에 패턴표 |
| UI 통일성 부족                          | UI Schema에 패턴 참조 추가                              |
| 모든 CTA/새 영역을 과하게 강조          | CTA/강조 UX 가드레일 + MCP `get_pattern_guide` 활용     |

## 기획자 사용법

기획자는 코드를 몰라도 됩니다.

1. **PRD 작성**: Notion 또는 대화로 기능 요구사항 전달
2. **목업 생성 요청**: Claude에게 "이 PRD로 트로스트 목업 만들어줘"
3. **Storybook 확인**: 배포된 URL에서 Desktop/Mobile 뷰 확인
4. **피드백**: "검색 필터 위치 바꿔줘", "카드에 이미지 넣어줘" 등 자연어로 요청
5. **반복**: 만족할 때까지 피드백 루프

## 디렉토리 구조

```
harness/
  README.md                        ← 이 파일
  HARNESS_1_PROMPT.md              ← Ticket → PRD.md
  HARNESS_2_PROMPT.md              ← PRD → UI Schema + Coverage (v2)
  MOCKUP_RENDERER_PROMPT.md        ← Schema → React 목업 (v2)

apps/storybook/src/stories/
  mockup-layout.tsx                ← 브랜드 공통 레이아웃 (MockupLayout)
  {Brand}{Page}Mockup.tsx          ← 목업 컴포넌트
  {brand}-{page}-mock-data.ts      ← 더미 데이터
  {Brand}{Page}Mockup.stories.tsx  ← 스토리 (Default + Mobile)
```

## Self-Check (Renderer 생성 후)

- [ ] MockupLayout으로 감쌌는가
- [ ] DS에 있는 컴포넌트를 인라인으로 만들지 않았는가
- [ ] 강제 매핑 규칙 10개 모두 준수했는가
- [ ] 화살표 CTA는 대표 액션 1개에만 있는가
- [ ] Chip/Badge가 장식이 아니라 상태/분류/속성 표시로 쓰였는가
- [ ] 안내 영역 강조 장치가 과하지 않은가
- [ ] useIsMobile()로 모바일 분기 처리했는가
- [ ] 스토리에 Default + Mobile 둘 다 있는가
- [ ] tsc --noEmit 통과하는가
