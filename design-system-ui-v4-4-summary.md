# Design System 기반 UI 개발 구조 — 요약 (v4.4)

> 10분 안에 핵심 파악. 상세는 [풀 문서](./design-system-ui-v4-4.md) 참조.

---

## 1. 6가지 축

| #   | 축                | 한 줄                                         |
| --- | ----------------- | --------------------------------------------- |
| 1   | Harness           | AI + .md 계약으로 결과물 품질 보장            |
| 2   | 궁극 목표         | **Ticket → DS 기반 HTML 목업** + DS 병렬 성장 |
| 3   | 수단              | Harness 활용한 자동화 (AI는 accelerator)      |
| 4   | 통일 원칙         | 기획자 / 디자이너 / FE 모두 같은 DS           |
| 5   | Human-in-the-loop | 자동화가 강할수록 사람 gate 중요              |
| 6   | 반복 루프         | 싸고 빠르게 반복                              |

---

## 2. 전체 아키텍처 (v4.4 — 병렬 트랙 시각화)

**버전 A (병렬 트랙 — 권장)** 또는 **버전 B (간결)** 중 선택.

### 버전 A — 병렬 트랙

```
═══════════════════════════════════════════════════════════════════════
║  서비스 트랙 (티켓 리듬)                 ║  DS 트랙 (분기 리듬)      ║
═══════════════════════════════════════════════════════════════════════
║                                         ║                           ║
║  Ticket (비정형)                        ║   ┌──────────────────┐   ║
║    ↓                                    ║   │ DS Inbox         │   ║
║  Harness 1 ← AI + .md                   ║   │ (GitHub+Notion)  │   ║
║    ↓                                    ║   │                  │   ║
║  PRD.md                                 ║   │ - DS-Extension   │   ║
║    ↓                                    ║   │ - Product comp   │   ║
║  Harness 2 ← AI + .md ────── DS Registry─║──│ - 재사용 카운트   │   ║
║    ↓           (최신 DS 참조)            ║   └────────┬─────────┘   ║
║  UI Schema + Coverage                   ║            ↓              ║
║    ↓                                    ║   DS 오너 주간 리뷰        ║
║  Mockup Renderer ⭐ ────── DS Registry ─║── (우선순위 결정)          ║
║    ↓     (DS 컴포넌트로 렌더)             ║            ↓              ║
║  기획자 피드백 루프 ↺ (축 6)             ║   ┌─────────────────┐    ║
║    ↓                                    ║   │ DS 개발 Sprint  │    ║
║  [PRD 안정화 트리거]                     ║   │                 │    ║
║    ↓                                    ║   │ DS FE:          │    ║
║  [DS 판단 Gate]                         ║   │  React 개발     │    ║
║   ├ [자동] 기존 DS 재사용               ║   │  Code Connect   │    ║
║   ├ [자동] Product comp ── 이슈 생성 ───║─→ │ DS Figma:       │    ║
║   └ [사람] DS 오너 판단 ── 이슈 생성 ───║─→ │  Figma library  │    ║
║     ↓                                   ║   └────────┬────────┘    ║
║  ┌──────────────────────┐               ║            ↓              ║
║  │ 제품 구현            │               ║   Registry 업데이트 ──────║─┐
║  │  Figma refine        │               ║            ↓              ║ │
║  │  Claude Code 구현    │               ║   (다음 Harness 2부터     ║ │
║  │  (필요시 Product comp│               ║    자동 반영)             ║ │
║  │   임시 구현)         │               ║            ↓              ║ │
║  └──────────┬───────────┘               ║   임시 Product comp →     ║ │
║             ↓                           ║   DS 교체 리팩토링 ────── ║─┤
║          출시                            ║   (분기별 정리)          ║ │
║             ↓                           ║                           ║ │
║  Storybook (Product 섹션) ───────────── ║ ── Storybook (DS 섹션)    ║ │
║                                         ║                           ║ │
═══════════════════════════════════════════════════════════════════════
                  ↑                                                    │
                  └────────────────────────────────────────────────────┘
             (DS 업데이트가 다음 티켓 파이프라인에 자동 반영)
```

### 버전 B — 간결

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
서비스 트랙 (티켓 리듬)    ⇄⇄⇄    DS 트랙 (분기 리듬)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ticket → Harness 1 → PRD.md
              ↓
         Harness 2 ←──────── DS Registry
              ↓                    ↑
         UI Schema + Coverage      │
              ↓                    │
         Mockup ⭐ ←──────── DS Registry
              ↓                    ↑
         기획자 루프 ↺              │
              ↓                    │
         PRD 안정화                │
              ↓                    │
         DS Gate ───이슈───→ DS Inbox
              │                    ↓
              ↓               주간 리뷰
         제품 구현                  ↓
         (Figma+Code)           DS Sprint
              ↓                    │
            출시                   ↓
                              Registry 업데이트 ──┐
                                                  │
     (다음 티켓부터 최신 DS 자동 반영) ←───────────┘
```

### 두 트랙의 연결점 3개

| 연결                     | 방향        | 의미                             |
| ------------------------ | ----------- | -------------------------------- |
| **Harness 2 ← Registry** | DS → 서비스 | 최신 DS vocabulary로 Schema 생성 |
| **Mockup ← Registry**    | DS → 서비스 | 최신 DS 컴포넌트로 목업 렌더     |
| **Gate → Inbox**         | 서비스 → DS | Gate 결과에 따라 이슈 자동 생성  |

**핵심**: DS 트랙의 Registry 업데이트가 다음 티켓 파이프라인에 자동 반영 → 축 2("DS 병렬 성장")의 실제 구현.

### v4.4 변경점

- DS 트랙을 병렬 트랙으로 재구성 (기존: Gate 이후에만 분기되는 것처럼 보임)
- Registry가 두 트랙을 잇는 공통 자원으로 명시
- 임시 Product comp → DS 교체 흐름 포함

---

## 3. Harness

**AI 호출 + 마크다운(.md) 산출물 계약**

- Harness 1: Ticket → PRD.md
- Harness 2: PRD → UI Schema.md + Coverage

---

## 4. 4개 역할 + DS 오너

| 역할                      | 책임                                     | 리듬      |
| ------------------------- | ---------------------------------------- | --------- |
| **서비스 FE**             | 제품 티켓 구현, Product comp             | 티켓 주기 |
| **DS FE**                 | L1/L2, Code Connect, Mockup Renderer     | 분기 주기 |
| **서비스 Figma 디자이너** | 제품 화면 구성                           | 티켓 주기 |
| **DS Figma 디자이너**     | DS Figma library 유지                    | 분기 주기 |
| **DS 오너**               | DS 의사결정 Accountable, 주간 inbox 리뷰 | -         |

---

## 5. Mockup Renderer ⭐ (접근 C)

**Claude Code가 Schema + PRD + Registry로 React 목업 생성.**

### AI 재량 (엄격 제한)

**허용**: `useState`, 이벤트 핸들러, 모달 토글, 단순 유효성, 조건부 렌더링  
**금지**: DS 바깥 컴포넌트, Schema 구조 변경, API 호출, 비즈니스 로직

### 일관성 근거

- DS 컴포넌트: Storybook 고정
- Schema 구조: Harness 2 확정
- AI는 얕은 상태/이벤트만 채움

### 반복 비용

UI Schema + PRD 해시 기반 캐싱.

### 숨은 강점

Mockup React는 ephemeral이지만 **서비스 FE 구현의 시작점** 역할.

---

## 6. UI Schema 5원칙 + 한계

### 5원칙

1. Thin Structure
2. DS Vocabulary Only
3. Ephemeral
4. 상태/로직 없음
5. 사람 Gate 유지

### 표현 한계 (80/20)

**적합**: 정적 폼/리스트, CRUD, 상세 화면 (대부분 티켓)  
**부적합**: 복잡 Form Flow, 인터랙션/시각화 중심, 실시간 → Figma 트랙 직행

---

## 7. PRD 안정화 트리거

**기획자가 "디자인/개발 넘김" 수동 체크한 시점.**

이 체크 전:

- PRD/Mockup 계속 수정 가능
- DS Gate 트리거 안 됨
- missing은 `<Missing />` 로만 시각화

이 체크 직후:

- DS Gate 자동 실행
- PRD 변경은 새 티켓 or 명시적 revert

### 개선 필요 [TODO]

현재 수동 트리거. 향후 자동화 검토:

- 반복 횟수 한도 (예: 5회)
- 일정 시간 수정 없을 시
- Harness 2 출력이 N회 연속 동일

---

## 8. DS 판단 Gate — 자동 + 사람 분리

### 4가지 Outcome

```
Coverage 결과
  ↓
자동 분류기 (AI + rule)
  ↓
┌───────────────┬───────────────┬──────────────┬───────────┐
↓               ↓               ↓              ↓
[자동]         [자동]          [사람]        [사람]
기존 DS 재사용  Product comp   DS 신규/애매   티켓 보류
즉시 패스       이슈 자동 생성  DS 오너 판단   기획자 환송
```

### 자동 분류 규칙

- Coverage 통과 → 자동 재사용 판정
- Registry에 유사 컴포넌트 score > 0.8 → 자동 재사용 제안
- 비즈니스 맥락 키워드 (`Social`, `Checkout`, `Chat` 등) → 자동 Product comp
- 그 외 → 사람 판단

### 판단 속도 (티켓 블로킹 방지)

| Path          | 상황           | 티켓 진행                              |
| ------------- | -------------- | -------------------------------------- |
| Fast (자동)   | 기존 DS 재사용 | 즉시                                   |
| Medium (자동) | Product comp   | 즉시 (이슈 자동 생성)                  |
| Slow (사람)   | DS 신규/애매   | 이슈 자동 생성 후 진행, DS는 병렬 트랙 |

---

## 9. DS repo 이슈 자동 생성

### 이중 관리

| 채널             | 역할                                       |
| ---------------- | ------------------------------------------ |
| **GitHub Issue** | 개발 워크플로우, PR 연결, 상태 트래킹      |
| **Notion DB**    | 대시보드, 3-제품 rule 집계, 분기 리뷰 자료 |

GitHub issue 생성 시 Notion DB row 자동 추가 (GitHub Actions + Notion API).

### 이슈 종류

**DS-Extension Issue** (신규 추가): UI Schema 조각 + PRD 링크 + Trinity 체크리스트 (React / Storybook / Figma) + 제품 사용 추적

**Product Component Issue** (Product comp): 재사용 카운트 (3개 이상이면 L2 승격 후보) + Trinity + 자동 스캐폴드 PR 링크

### Product comp도 이슈로 관리하는 이유

- 3-제품 rule 자동 판정에 **"몇 개 제품에서 쓰였나"** 트래킹 필요
- 분기 DS 리뷰 inbox로 사용
- 라벨별 집계 → 대시보드

---

## 10. Design System 3-Layer

| Level         | 예시                       | 관리             |
| ------------- | -------------------------- | ---------------- |
| L1 Foundation | Color, Spacing, Typography | DS FE + DS Figma |
| L2 Core       | Button, Input, Modal       | DS FE + DS Figma |
| L3 Product    | SocialLogin, CheckoutForm  | Product team     |

**L3 → L2 승격**: Notion DB의 재사용 카운트 3 이상 → 분기 리뷰.

---

## 11. 8가지 AI Pipeline

| #   | 이름                  | I/O                                   |
| --- | --------------------- | ------------------------------------- |
| 1   | Harness 1             | Ticket → PRD.md                       |
| 2   | Harness 2             | PRD → Schema + Coverage               |
| 3   | **Mockup Renderer**   | **Schema + PRD → React 목업**         |
| 4   | **DS 판단 자동 분류** | Coverage → outcome/human 플래그       |
| 5   | **이슈 자동 생성**    | Gate 결과 → GitHub issue + Notion row |
| 6   | Figma → Code 초안     | Figma + .md + 목업 → React            |
| 7   | DS 확장 자동화        | 이슈 → React + Story + Figma 가이드   |
| 8   | VRT 요약              | Playwright diff → PR comment          |

---

## 12. 도입 로드맵

| Phase | 기간    | 핵심                                                           |
| ----- | ------- | -------------------------------------------------------------- |
| 0     | 2주     | Baseline 측정                                                  |
| 1     | 1~2개월 | L1/L2 + Storybook + Registry + **Mockup Renderer** + 역할 지정 |
| 2     | 1~2개월 | Harness 1, 2 + **Mockup 루프 완성** (Gate는 아직 수동)         |
| 3     | 1개월   | **PRD 트리거 + DS Gate + 이슈 자동 생성 + 주간 리뷰 시작**     |
| 4     | 1개월   | Code Connect + Figma enforcement                               |
| 5     | 지속    | 기존 제품 마이그레이션                                         |

---

## 13. 실패 TOP 추가 (v4.3 핵심 위험)

1. DS repo 이슈가 쌓이기만 함 → **DS 오너 주간 inbox 리뷰 루틴 필수**
2. 자동 분류기가 잘못 판단 → **분기별 자동 분류 정확도 감사**
3. 서비스 FE가 Product comp 남용 → **Product comp vs DS 신규 비율 모니터링**
4. PRD 안정화 트리거 안 눌림 (무한 루프) → **반복 5회 한도 + Figma 트랙 escape**
5. Gate가 Mockup 루프 중간에 배치됨 (구버전 실수) → Gate는 **트리거 이후**

---

## 14. KPI — Phase 0 이후 확정

### 지표 후보

- Ticket lead time (축 2)
- PRD 재작성 횟수 (축 1)
- **기획자 첫 UI 확인 시점** (축 2)
- Figma ↔ 구현 불일치 QA 반려 (축 4)
- DS 미커버 비율 (축 2)
- 기획자 피드백 반복 횟수 (축 6)
- DS 판단 Gate 처리 시간
- **DS 판단 자동화 비율** (auto / total)
- **Product comp vs DS 신규 비율** (안티패턴 감지)

| 지표     | Baseline | 3개월 | 6개월 |
| -------- | -------- | ----- | ----- |
| (지표 1) | _TBD_    | _TBD_ | _TBD_ |
| (지표 2) | _TBD_    | _TBD_ | _TBD_ |
| (지표 3) | _TBD_    | _TBD_ | _TBD_ |

---

## 15. 한 문장

> **Harness(AI + .md)로 Ticket을 PRD와 UI Schema로 컴파일하고, Mockup Renderer가 AI로 DS 기반 React 목업을 즉시 생성해 기획자와 싸게 반복한 뒤 — 기획자 안정화 트리거로 DS 판단 Gate가 자동 분류 또는 사람 판단을 거쳐 GitHub + Notion 이슈를 자동 생성하며 병렬 트랙으로 티켓을 블로킹하지 않고, DS 트랙의 Registry 업데이트가 다음 티켓에 자동 반영되는 DS 중심 UI 개발 파이프라인.**

---

## 다음 단계

1. Phase 0 측정 계획
2. 역할 지정
3. L2 15개 리스트
4. Harness 1, 2 프롬프트
5. Mockup Renderer 프로토타입 (재량 제한)
6. DS Registry 스크립트
7. **자동 분류기 설계** (유사도 + 비즈니스 감지)
8. **GitHub + Notion 연동 스크립트**
9. **DS 오너 주간 inbox 리뷰 리듬 확정**
10. **PRD 안정화 트리거 자동화 연구** [TODO]
11. Pilot 프로젝트 선정
