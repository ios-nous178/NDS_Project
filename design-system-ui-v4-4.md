# Design System 기반 UI 개발 구조 (v4.4)

## 1. 이 구조의 6가지 축

| #   | 축                    | 한 줄 요약                                                                     |
| --- | --------------------- | ------------------------------------------------------------------------------ |
| 1   | **Harness**           | AI 호출 + .md 산출물 계약으로 결과물 품질을 보장한다                           |
| 2   | **궁극 목표**         | Ticket에서부터 DS 기반 HTML 목업을 빠르게 뽑아낸다 + DS와 제품이 병렬 성장한다 |
| 3   | **수단**              | Harness를 적극 활용해 자동화한다. AI는 compiler가 아니라 accelerator           |
| 4   | **통일 원칙**         | 기획자의 목업, 디자이너의 Figma, FE의 UI(+Storybook) 모두 같은 DS를 쓴다       |
| 5   | **Human-in-the-loop** | 자동화가 강할수록 사람이 판단하는 gate가 중요하다                              |
| 6   | **반복 루프**         | 한 방에 뽑는 게 아니라 싸고 빠르게 반복한다                                    |

---

## 2. 목적

기획 → 디자인 → 개발 전달 과정의 비효율을 줄이고, **기획자가 Ticket 제출 시점부터 DS 기반 HTML 목업을 확인할 수 있는** 구조를 만듭니다.

주요 목표

- 기획 → 디자인 → 개발 전달 비용 감소
- Ticket → HTML 목업의 lead time 단축 (Figma 없이도 확인 가능)
- Design System 기반 UI 일관성 확보
- Figma → Code 자동 생성 한계 해결
- AI 활용 가능한 UI 개발 구조 확보 — AI 산출물은 .md로 표준화
- DS를 제품과 함께 성장시키는 프로세스 확립

---

## 3. 핵심 철학

### Figma ↔ Code 구조 정렬

Figma 레이어 구조와 코드 컴포넌트 구조는 다릅니다. 목표는 자동 변환이 아니라 **양쪽이 같은 DS 컴포넌트를 공유**하는 것.

### Design System = evolving system

완성된 DS로 시작하지 않습니다. 제품 개발 → 필요 발견 → DS 확장 루프.

### 통일된 DS vocabulary

기획자, 디자이너, FE가 같은 DS 이름으로 소통.

### Harness

AI로 구조화, 산출물은 .md로 git에 저장.

### Human-in-the-loop

자동화가 강할수록 사람 판단 gate가 중요.

### 반복 루프

한 방 자동화가 아닌 싼 반복.

---

## 4. Harness란

**Harness = AI 호출 단계 + 마크다운(.md) 산출물 계약**

### 구성

1. Input contract
2. Prompt / agent
3. Output contract (.md)
4. Review gate

### 왜 .md인가

- 버전 관리 (git)
- 팀 검토 (PR diff)
- 다음 AI context 재사용
- 편차 제어
- 도구 독립성
- 반복 비용 절감 (축 6)

### 이 구조의 Harness 2개

- **Harness 1**: 비정형 입력 → PRD.md
- **Harness 2**: PRD.md → UI Schema.md + DS Coverage

---

## 5. 전체 아키텍처 (v4.4 — 병렬 트랙 시각화)

두 가지 다이어그램을 함께 제시합니다. **버전 A**는 양쪽 트랙을 나란히 두어 병렬성을 강조하고, **버전 B**는 세로 흐름으로 간결하게 정리합니다.

### 버전 A — 병렬 트랙 다이어그램

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

### 버전 B — 간결 흐름

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

---

## 5-bis. 두 트랙의 리듬과 연결점

### 리듬이 다른 두 트랙

| 트랙        | 리듬              | 흐름 형태                          |
| ----------- | ----------------- | ---------------------------------- |
| 서비스 트랙 | 티켓 주기 (일/주) | 위 → 아래 **파이프라인**           |
| DS 트랙     | 분기 주기 + 긴급  | Inbox → Sprint → Registry **루프** |

두 트랙은 **서로 다른 속도로 독립 운영**되며, 세 군데 연결점으로 동기화됩니다.

### 3개 연결점

| #   | 연결                              | 방향        | 의미                                         |
| --- | --------------------------------- | ----------- | -------------------------------------------- |
| 1   | **Harness 2 ← DS Registry**       | DS → 서비스 | Harness 2가 최신 DS vocabulary로 Schema 생성 |
| 2   | **Mockup Renderer ← DS Registry** | DS → 서비스 | 최신 DS 컴포넌트로 목업 렌더                 |
| 3   | **DS Gate → DS Inbox**            | 서비스 → DS | Gate 결과에 따라 이슈 자동 생성              |

### 핵심 피드백 루프

**DS 트랙의 산출물(Registry 업데이트)이 서비스 트랙의 시작점(Harness 2, Mockup)에 자동 반영되는 고리**가 축 2("DS 병렬 성장")의 실제 구현.

```
티켓 A: DS 신규 "SegmentControl" 요청 → DS Inbox
          ↓
      DS Sprint에서 개발
          ↓
      Registry 업데이트
          ↓
티켓 B (다음 티켓): Harness 2가 자동으로 SegmentControl을 vocabulary에 포함
          ↓
      티켓 B에서 즉시 재사용 가능
```

### 임시 Product comp → DS 교체

Slow path(DS 신규)로 판정된 티켓은 **Product comp 임시 구현으로 선출시**하고, DS 트랙에서 컴포넌트가 완성되면 **분기별 리팩토링으로 DS 교체**합니다. 이 흐름이 "DS 개발이 티켓 블로킹 안 함" 원칙을 물리적으로 구현.

### v4.4 변경점

- 기존 세로 파이프라인이 병렬 트랙으로 재구성
- DS Registry가 두 트랙을 이어주는 **공통 자원**으로 명시
- Registry 업데이트 → 다음 티켓 자동 반영 루프 가시화
- 임시 Product comp → DS 교체 흐름이 DS 트랙 안에 포함

---

## 6. 단계별 책임 매트릭스

| 단계                         | 주체                      | 입력                        | 출력                                | 자동화 수준            |
| ---------------------------- | ------------------------- | --------------------------- | ----------------------------------- | ---------------------- |
| Ticket 생성                  | PM/요청자                 | 요구사항                    | 자연어 티켓                         | 수동                   |
| **Harness 1**                | AI + PM/FE 리뷰           | 티켓                        | PRD.md                              | AI + human gate        |
| **Harness 2**                | AI + 서비스 FE 리뷰       | PRD.md                      | UI Schema.md + Coverage             | AI + human gate        |
| **Mockup 렌더링**            | AI (Claude Code)          | Schema + PRD + Registry     | React 목업                          | 완전 자동 (재량 제한)  |
| **기획자 리뷰 루프**         | 기획자                    | 목업                        | 승인 / 수정 요청                    | 수동 (축 6 반복)       |
| **PRD 안정화 트리거**        | 기획자                    | 승인 표시                   | "디자인/개발 넘김"                  | 수동 (개선 필요 — §15) |
| **DS 판단 Gate — 자동 분류** | 분류 스크립트             | Coverage + Registry         | 자동 outcome 또는 human 필요 플래그 | 자동                   |
| **DS 판단 Gate — 사람 판단** | DS 오너                   | 애매/신규 case              | 4가지 outcome 중 결정               | 수동 (gate)            |
| **DS repo 이슈 자동 생성**   | GitHub Actions            | Gate 결과                   | GitHub issue + Notion row           | 완전 자동              |
| Figma 구성                   | 서비스 Figma 디자이너     | UI Schema + DS              | Figma 화면                          | 수동                   |
| Code Connect                 | DS 오너                   | 신규 DS                     | Connect 정의                        | 수동 (1회성)           |
| 구현                         | 서비스 FE + Claude Code   | Figma + PRD + Schema + 목업 | React 코드                          | AI assist              |
| DS 개발                      | DS FE + DS Figma 디자이너 | DS-Extension issue          | DS 컴포넌트 + Figma library         | AI assist              |

---

## 7. 역할 정의

### 4개 역할

| 역할                      | 책임                                                | 리듬             |
| ------------------------- | --------------------------------------------------- | ---------------- |
| **서비스 FE**             | 제품 티켓 구현, Product comp 개발, 비즈니스 로직    | 티켓 주기        |
| **DS FE**                 | L1/L2 개발, Code Connect, Registry, Mockup Renderer | 분기 주기 + 긴급 |
| **서비스 Figma 디자이너** | DS 인스턴스로 제품 화면 구성                        | 티켓 주기        |
| **DS Figma 디자이너**     | DS Figma library, 토큰, L1/L2 Figma 유지            | 분기 주기 + 긴급 |

### DS 오너

DS FE 중 한 명 또는 별도 리드가 겸함.

- DS 판단 Gate의 애매/신규 case 최종 승인권
- DS 확장 로드맵
- L3 → L2 승격 심사
- **주간 DS repo inbox 리뷰** (§15)
- **분기별 자동 분류 정확도 감사** (§15)

### RACI

| 활동                         | 서비스 FE | DS FE | 서비스 Figma | DS Figma | DS 오너         |
| ---------------------------- | --------- | ----- | ------------ | -------- | --------------- |
| Harness 1, 2 리뷰            | **R**     | C     | C            | I        | I               |
| Mockup 피드백 루프           | C         | C     | C            | I        | I               |
| PRD 안정화 트리거            | I         | I     | I            | I        | I (기획자 주도) |
| DS 판단 자동 분류 감사       | I         | C     | I            | I        | **A**           |
| DS 판단 사람 판단            | C         | C     | C            | C        | **A**           |
| DS repo inbox 리뷰           | I         | C     | I            | C        | **A**           |
| DS 신규 코드 개발            | I         | **R** | I            | C        | **A**           |
| DS 신규 Figma 개발           | I         | C     | I            | **R**    | **A**           |
| Product comp 개발 (코드)     | **R**     | C     | C            | I        | I               |
| Product comp 디자인          | I         | I     | **R**        | C        | I               |
| Figma 화면 refine            | C         | I     | **R**        | I        | I               |
| Code Connect 매핑            | I         | **R** | I            | C        | **A**           |
| Mockup Renderer 유지         | I         | **R** | I            | I        | **A**           |
| Storybook + DS Registry 유지 | C         | **R** | I            | I        | **A**           |
| 제품 티켓 구현               | **R**     | I     | I            | I        | I               |

---

## 8. Harness 1 — Input Structuring

### 입력

비정형 자연어

### 역할

- 자연어를 PRD 템플릿에 매핑
- 누락 항목 질문
- UI 관점으로 정리

### 출력 (PRD.md)

```markdown
# [티켓ID] 회원가입 페이지

## 화면 목표

신규 사용자 가입

## 구성 요소

- 이메일 입력 / 비밀번호 입력
- 회원가입 버튼 / 구글 로그인 버튼
- 비밀번호 찾기 링크

## 제약

- 모바일 우선

## 미정/추가 확인 필요

- 이메일 인증 여부
- 약관 동의 UI 위치
```

---

## 9. Harness 2 — UI Structuring

### 입력

PRD.md + DS Registry

### 출력 (UI Schema.md)

````markdown
# [티켓ID] UI Schema

```json
{
  "type": "Form",
  "children": [
    { "type": "Input", "name": "email" },
    { "type": "Input", "name": "password" },
    { "type": "Button", "variant": "primary" }
  ]
}
```

## Coverage

- covered: Form, Input, Button
- missing: SegmentControl
- ambiguous: SocialLoginButton
- coverage_rate: 0.75
````

---

## 10. UI Schema 5원칙

1. **Thin Structure** — 구조만
2. **DS Vocabulary Only** — L1/L2만
3. **Ephemeral** — 저장 금지
4. **상태/로직 없음**
5. **사람 Gate 유지**

### 실패 패턴

| 패턴 | 증상                                  |
| ---- | ------------------------------------- |
| A    | 타입이 페이지명 (`CampaignLandingV2`) |
| B    | 비즈니스 로직 유입                    |
| C    | 저장 자산 격상                        |
| D    | Product comp 증식                     |
| E    | 검토 생략                             |

---

## 11. Mockup Renderer ⭐ (접근 C)

**Claude Code가 UI Schema + PRD + DS Registry로 React 목업 파일을 생성.**

### 입력

- UI Schema.md (구조 고정)
- PRD.md (인터랙션 맥락)
- DS Registry (사용 가능 컴포넌트 고정)

### AI 재량 범위

**허용**:

- `useState` 등 얕은 상태 관리
- 이벤트 핸들러 (`onClick`, `onChange`, `onSubmit`)
- 모달 토글, 탭 전환, 단순 유효성 피드백
- 조건부 렌더링 (로그인/비로그인)

**금지**:

- DS 바깥 컴포넌트 추가
- UI Schema 구조 변경
- 외부 API 호출 코드
- 실제 비즈니스 로직

### 일관성 보장 근거

- DS 컴포넌트: Storybook 고정
- UI Schema 구조: Harness 2 확정
- AI는 얕은 상태/이벤트만 채움

### 출력

```
/mockups/{ticketId}/
  mockup.tsx       ← Claude Code 생성, ephemeral
  mock-data.ts
```

Storybook 동적 페이지로 호스팅, 티켓/PR에 목업 URL 자동 코멘트.

### 반복 비용 완화 (축 6)

- UI Schema.md + PRD.md 해시 기준 캐싱
- 변경 없으면 재사용, 변경 시만 AI 재호출

### 숨은 강점

Mockup React는 ephemeral이지만 **서비스 FE 구현의 시작점**으로 활용. 인터랙션 초안 역할.

### `<Missing />` 처리

Gate 전 단계에서는 missing 컴포넌트를 `<Missing type="X" />` placeholder로 렌더. 기획자도 DS 확장 필요성 인지 가능 → 축 2 "DS 병렬 성장" 입력.

---

## 12. UI Schema / Mockup Renderer의 한계

### 표현 한계 6영역

| 영역                         | 대응                                    |
| ---------------------------- | --------------------------------------- |
| 복잡한 조건부 구조           | 복수 Schema variants                    |
| 동적 반복                    | `repeat: { count, template }` 최소 허용 |
| 깊은 데이터 바인딩           | Mock data 자동 생성                     |
| 복잡 레이아웃 제약           | Figma 우회                              |
| 커스텀 시각 (차트, 지도)     | `<Unsupported />` placeholder           |
| 고급 인터랙션 (드래그앤드롭) | Figma 프로토타입                        |

### 티켓 유형별 적합성

| 유형           | 적합성    | 예시                |
| -------------- | --------- | ------------------- |
| 정적 폼/리스트 | 매우 높음 | 회원가입, 설정      |
| CRUD           | 매우 높음 | 게시물, 사용자 관리 |
| 간단 상세      | 높음      | 프로필, 상품 상세   |
| 조건부 화면    | 중간      | 로그인 상태별 홈    |
| 복잡 Form Flow | 낮음      | 7단계 마법사        |
| 인터랙션 중심  | 낮음      | 드래그앤드롭, 채팅  |
| 시각화 중심    | 매우 낮음 | 대시보드, 차트      |
| 실시간         | 매우 낮음 | 라이브 스트림       |

**대부분 CRUD 티켓의 70~80%는 "매우 높음/높음"**. 부적합은 초기부터 Figma 트랙 직행.

### Escape Hatch

- DS Registry 바깥 컴포넌트 2개 이상 필요
- 조건 분기 3개 이상
- 커스텀 시각 요소
- 인터랙션이 허용 범위 밖

→ Mockup 건너뛰고 즉시 Figma 트랙. Harness 2 출력 시 자동 flag 가능.

---

## 13. PRD 안정화 트리거

### 정의

**기획자가 "디자인/개발팀에 넘김"을 수동으로 체크한 시점.**

이 체크가 있기 전까지는:

- 기획자가 PRD/Mockup 계속 수정 가능
- DS 판단 Gate 트리거되지 않음
- Coverage missing은 `<Missing />` placeholder로만 시각화 (경고 X)

이 체크가 된 직후:

- DS 판단 Gate 자동 실행
- 이후 PRD 변경은 새 티켓 또는 명시적 revert

### 왜 이 시점인가

- 기획자 루프 중간에 Gate 돌리면 **헛수고** (PRD 수정으로 판단 무효화)
- DS 오너 부하 감소 (한 번만 판단)
- Gate가 **"Figma/DS 착수 전 최종 체크포인트"** 역할을 정확히 수행

### 개선 필요 사항 [TODO]

- 현재는 **수동 트리거** — 기획자가 버튼 누름
- 향후 자동화 가능성 검토:
  - 반복 횟수 한도 도달 시 자동 트리거 (예: 5회)
  - 기획자가 일정 시간 수정 없을 때 자동 트리거
  - Harness 2 출력이 N회 연속 동일하면 수렴으로 판단
- 자동화하되 기획자 override 가능하게 유지

---

## 14. DS 판단 Gate

### 위치

**PRD 안정화 트리거 직후.** Mockup 피드백 루프가 끝난 뒤에만 실행.

### 4가지 Outcome + 자동/사람 분리

```
Coverage 결과
  ↓
자동 분류기 (AI + rule)
  ↓
┌───────────────────┬──────────────────┬────────────────┐
↓                   ↓                  ↓                ↓
[자동: 기존 DS      [자동: Product    [사람: DS 신규   [사람: 티켓 보류
 재사용 가능]        comp 후보]          or 애매]          — 스펙 재확인]
     즉시 패스          자동 이슈 생성    DS 오너 판단      기획자에게 환송
                                         ↓ 판단 후
                                         자동 이슈 생성
```

### 자동 분류 로직 (개념)

```typescript
function autoClassify(coverage: Coverage, registry: DSRegistry) {
  if (coverage.missing.length === 0) {
    return { outcome: "AUTO_REUSE", needsHumanGate: false };
  }

  const classified = coverage.missing.map((comp) => {
    // 유사 DS 탐색
    const similar = findSimilar(comp, registry);
    if (similar.score > 0.8) {
      return { type: "REUSE_SUGGESTION", target: similar };
    }

    // 비즈니스 맥락 키워드 (AI 분류)
    if (isBusinessDomainComponent(comp)) {
      return { type: "AUTO_PRODUCT_COMP" };
    }

    // 나머지는 사람 판단
    return { type: "NEEDS_HUMAN_GATE" };
  });

  return {
    classified,
    needsHumanGate: classified.some((c) => c.type === "NEEDS_HUMAN_GATE"),
  };
}
```

### 사람 판단 기준 (DS 신규 vs 애매 case만)

| 기준          | DS 신규                    | Product comp              |
| ------------- | -------------------------- | ------------------------- |
| 재사용 가능성 | 여러 제품에서 쓰일 것 같음 | 특정 제품 전용            |
| 범용성        | UI primitive               | 비즈니스 맥락 강함        |
| 복잡도        | L1/L2 단순 조합            | 여러 L2 조합 feature unit |
| 디자인 통일성 | 시각 통일 필요             | 제품별 다양 OK            |
| 빈도          | 분기 2~3회 이상            | 1회성                     |

**쉬운 공식**: "다른 제품 티켓에서도 이게 나올 것 같은가?"

### 판단 속도 — 티켓 블로킹 방지

| Path              | 상황                          | 티켓 진행                                   |
| ----------------- | ----------------------------- | ------------------------------------------- |
| **Fast** (자동)   | Coverage 통과, 기존 DS 재사용 | 즉시                                        |
| **Medium** (자동) | Product comp 자동 분류        | 즉시 (이슈 자동 생성 후)                    |
| **Slow** (사람)   | DS 신규 or 애매               | 이슈 자동 생성 후 진행, DS 개발은 병렬 트랙 |

**원칙**: 어떤 outcome이든 **티켓 lead time에 DS 개발이 포함되지 않음.**

---

## 15. DS repo 이슈 자동 생성

Gate 결과에 따라 **GitHub Issue + Notion DB**에 자동으로 row 생성.

### 왜 이중 관리인가

| 채널             | 역할                                                                   |
| ---------------- | ---------------------------------------------------------------------- |
| **GitHub Issue** | 개발 워크플로우, PR 연결, 상태 트래킹, 개발자 친화                     |
| **Notion DB**    | 대시보드, 3-제품 rule 집계, 분기 리뷰 자료, 비개발자(디자이너/PM) 접근 |

자동 연동: GitHub issue 생성 시 Notion DB row 자동 추가 (GitHub Actions + Notion API).

### 이슈 종류

#### DS-Extension Issue (DS 신규 추가 시)

```markdown
Title: [DS 신규] SegmentControl 컴포넌트 제안
Labels: ds-extension, new-component, priority:tbd

## 발견 맥락

- 티켓: #1234 (회원가입 페이지)
- UI Schema 조각:
  {
  "type": "SegmentControl",
  "options": ["개인", "법인"]
  }
- PRD 링크: [PRD.md]

## 유사 DS 후보

- (자동 분류기가 찾은 유사 컴포넌트 — 없으면 공란)

## Trinity

- [ ] React 구현
- [ ] Storybook story
- [ ] Figma 컴포넌트

## 제품 사용 추적

- 제품 1: 회원가입 (#1234)
- 제품 2: —
- 제품 3: —
```

#### Product Component Issue (Product comp 생성 시)

```markdown
Title: [Product] SocialLogin 컴포넌트
Labels: product-component, product:{repo_name}

## 발견 맥락

- 티켓: #1234
- UI Schema 조각: ...

## 재사용 카운트

- 현재: 1개 제품에서 사용
- 3개 이상 사용 시 L2 승격 후보

## Trinity

- [ ] Product repo PR (자동 스캐폴드 생성됨: #PR번호)
- [ ] Product storybook 등록
```

### 왜 Product comp도 이슈로 관리하나

사용자 질문에서 제기된 고민: "많이 만들어질 수 있는데 이슈가 맞나?"

**답**: 이슈가 맞음. 이유:

- 3-제품 rule 자동 판정에 **"몇 개 제품에서 쓰였나"** 트래킹 필수
- 이슈로 쌓이면 분기 DS 리뷰 inbox로 바로 사용
- Notion DB에서 라벨별 집계 → 대시보드 구성 가능
- 같은 시스템 + 라벨만 분리 → 관리 비용 최소

### Product comp 자동 스캐폴드 범위

Gate에서 "Product comp 자동 분류" 결정 시:

1. **서비스 repo에 PR 자동 생성** — 빈 컴포넌트 파일 + 기본 구조 (UI Schema 기반)
2. **Product storybook 스텁 파일 추가**
3. **DS repo에 Product Component issue 생성** (위 템플릿)
4. **Notion DB row 추가**

서비스 FE는 PR을 받아서 실제 로직 채워넣기만 하면 됨.

---

## 16. Design System 3-Layer

### Level 1 — Foundation

Color, Spacing, Typography, Radius, Shadow, Grid

### Level 2 — Core Components

Button, Input, Select, Checkbox, Tabs, Modal, Card, Badge, Avatar

### Level 3 — Product Components

SocialLogin, CheckoutForm, ChatMessage, NotificationItem

**Level 3는 Design System이 아님.** UI Schema vocabulary 바깥.

---

## 17. Product Component 거버넌스

| 항목      | 위치                        |
| --------- | --------------------------- |
| Code      | Product repository          |
| Storybook | Product storybook           |
| Figma     | Product library (DS와 분리) |
| 책임      | Product team                |

### L3 → L2 승격 (자동 트래킹으로 강화)

- **DS repo Product 이슈의 "재사용 카운트"가 3개 이상** → L2 승격 후보
- 분기별 DS 리뷰에서 승격 심사
- L3끼리 구조 중복 발견 시 공통 L2 추출

자동 트래킹이 Notion DB에서 돌아가므로 **오너가 수동으로 세지 않아도 됨.**

---

## 18. DS Coverage Check

```typescript
// scripts/ds-coverage.ts
const schema = loadUISchema(ticketId);
const dsComponents = await loadDSRegistry();
const coverage = checkCoverage(schema, dsComponents);
```

출력 예시

```json
{
  "covered": ["Form", "Input", "Button"],
  "missing": ["SegmentControl"],
  "ambiguous": ["SocialLoginButton"],
  "coverage_rate": 0.75
}
```

`missing` 있으면 **PRD 안정화 이후** DS 판단 Gate 트리거.

---

## 19. Figma 규칙 + Enforcement

| 규칙                 | Enforcement              |
| -------------------- | ------------------------ |
| DS Library만 사용    | Figma plugin 주간 리포트 |
| Instance detach 금지 | 파일 lint 리포트         |
| Auto Layout 필수     | 리뷰 체크리스트          |
| Design Token만 사용  | Variables 강제           |
| Frame 계층           | Figma plugin             |

---

## 20. Code Connect

L1/L2 1:1 매핑에 집중. Composition은 Claude Code가 PRD + Schema + 목업 + Connect 메타 종합해서 생성.

---

## 21. Storybook + DS Registry

- **Storybook** = 사람용 (doc + dev + test + Mockup Renderer 호스팅)
- **DS Registry** = 기계용 (Harness 2 / Coverage / Mockup / Claude Code의 입력)

---

## 22. AI 활용 Pipeline

| #   | 이름                  | I/O                                        | 자동화              |
| --- | --------------------- | ------------------------------------------ | ------------------- |
| 1   | Harness 1             | Ticket → PRD.md                            | AI + gate           |
| 2   | Harness 2             | PRD.md → Schema + Coverage                 | AI + gate           |
| 3   | **Mockup Renderer**   | Schema + PRD + Registry → React 목업       | AI 자동 (재량 제한) |
| 4   | **DS 판단 자동 분류** | Coverage + Registry → outcome/human 플래그 | AI + rule           |
| 5   | **이슈 자동 생성**    | Gate 결과 → GitHub issue + Notion row      | 완전 자동           |
| 6   | Figma → Code 초안     | Figma + .md + 목업 → React                 | AI assist           |
| 7   | DS 확장 자동화        | 이슈 → React + Storybook + Figma 가이드    | AI assist           |
| 8   | VRT 요약              | Playwright diff → PR comment               | AI assist           |

---

## 23. 도입 전략

### Phase 0 — 측정 (2주)

Baseline 측정. §25 참조.

### Phase 1 — Foundation + Core DS + Mockup Renderer (1~2개월)

- L1 (tokens) + L2 10~15개 + Storybook
- DS Registry 추출 스크립트
- **Mockup Renderer 구축** (접근 C, 재량 제한 시스템 프롬프트)
- 역할 지정 (DS FE, DS Figma 디자이너)

### Phase 2 — Harness 1, 2 + Mockup 루프 (1~2개월)

- Harness 1, 2 구축
- DS Coverage Check 자동화
- 기획자 피드백 루프 운영
- 이 시점에서 **PRD → Mockup 루프가 완성됨** (Gate는 아직 수동)

### Phase 3 — DS 판단 Gate + 자동 이슈 (1개월)

- PRD 안정화 트리거 (수동 버튼)
- 자동 분류기 구축
- GitHub + Notion 자동 연동
- **DS 오너 주간 inbox 리뷰 루틴 시작**
- **분기별 자동 분류 정확도 감사 시작**

### Phase 4 — Code Connect + Figma Enforcement (1개월)

- L2에 Code Connect
- Figma enforcement plugin

### Phase 5 — 기존 제품 마이그레이션 (지속)

---

## 24. 실패 시나리오

| #   | 시나리오                                                                          | 대응                                                 |
| --- | --------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1   | DS 전담자 없음                                                                    | DS FE/DS Figma 지정 필수                             |
| 2   | DS Figma 디자이너 미지정                                                          | 코드/Figma 싱크 붕괴 방지 위해 분리                  |
| 3   | Harness 산출물 템플릿 없음                                                        | 템플릿 사전 작성                                     |
| 4   | UI Schema 영구 저장                                                               | ephemeral 강제 (CI commit 거부)                      |
| 5   | UI Schema 5원칙 위반                                                              | Mockup Renderer가 자동 탐지                          |
| 6   | L3 거버넌스 없음                                                                  | 분기 리뷰 + 3-제품 rule + 자동 트래킹                |
| 7   | Figma enforcement 차단형                                                          | 가시화로만 처리                                      |
| 8   | DS Registry 없음                                                                  | Phase 1 필수                                         |
| 9   | Mockup Renderer 없이 Harness만                                                    | 축 2 실종                                            |
| 10  | DS 개발이 티켓 블로킹                                                             | 병렬 트랙 + 이슈 자동 생성                           |
| 11  | Mockup Renderer가 DS 바깥 생성                                                    | 시스템 프롬프트 재량 제한                            |
| 12  | **DS repo 이슈가 쌓이기만 함** (아무도 안 봄)                                     | **DS 오너 주간 inbox 리뷰 루틴 필수**                |
| 13  | **자동 분류기가 잘못 판단** (Product로 분류했는데 DS였음)                         | **분기별 자동 분류 정확도 감사**                     |
| 14  | **서비스 FE가 Product comp 자동 생성 기능 남용** (DS로 갔어야 할 걸 다 Product로) | **Product comp 비율 모니터링 지표 추가**             |
| 15  | PRD 안정화 트리거를 기획자가 누르지 않음 (무한 루프)                              | **반복 횟수 한도 5회 + Figma 트랙 강제 전환 escape** |
| 16  | 기획자가 트리거 후에도 PRD 수정 요청                                              | 새 티켓 또는 명시적 revert 프로세스                  |

### Anti-pattern

- ❌ "언젠가 쓸" 컴포넌트 DS 선제 추가
- ❌ Figma → Code 완전 자동화 목표
- ❌ UI Schema에 페이지 이름/비즈니스 로직
- ❌ Storybook을 문서로만 취급
- ❌ DS 완성 후 제품 개발 시작
- ❌ Mockup Renderer 없이 Harness만 도입
- ❌ DS 판단을 티켓 blocker로
- ❌ Mockup Renderer가 DS 바깥 컴포넌트 쓰게 방치
- ❌ **DS 판단 Gate를 PRD 루프 중간에 배치** (헛수고)
- ❌ **이슈 자동 생성만 하고 inbox 리뷰 안 함**
- ❌ **Product comp로 도피해서 DS 확장 회피**

---

## 25. Phase 0 측정 계획

수치를 먼저 정하지 않음. Phase 0에서 baseline 측정 후 KPI 확정.

### 측정할 지표 후보

| 지표                             | 측정 방법                   | 축 연결           |
| -------------------------------- | --------------------------- | ----------------- |
| Ticket lead time                 | 티켓 생성 → merge           | 축 2              |
| PRD 재작성 횟수                  | PR/코멘트 스레드 길이       | 축 1              |
| **기획자 첫 UI 확인 시점**       | 티켓 → 기획자 UI 확인       | **축 2 핵심**     |
| Figma ↔ 구현 불일치 QA 반려      | QA 티켓 라벨                | 축 4              |
| DS 미커버 비율                   | Coverage 리포트 집계        | 축 2              |
| 기획자 피드백 반복 횟수          | 티켓 당 수정 요청 코멘트 수 | 축 6              |
| DS 판단 Gate 처리 시간           | missing 발견 → 판단 완료    | §14               |
| **DS 판단 자동화 비율**          | auto / total Gate 처리      | §14               |
| **Product comp vs DS 신규 비율** | 라벨 집계                   | 안티패턴 모니터링 |

### 실행

1. 최근 완료 UI 티켓 **10개** 선정 (Trost, Cashwalk 등)
2. 위 지표 중 **2~3개만** 측정
3. Slack/Jira 히스토리 수집
4. 엑셀 한 장 리포트

### 템플릿

| 지표     | Baseline | 3개월 목표 | 6개월 목표 |
| -------- | -------- | ---------- | ---------- |
| (지표 1) | _TBD_    | _TBD_      | _TBD_      |
| (지표 2) | _TBD_    | _TBD_      | _TBD_      |
| (지표 3) | _TBD_    | _TBD_      | _TBD_      |

---

## 26. 최종 요약

### 6개 축

1. Harness (AI + .md)
2. 궁극 목표 (Ticket → DS HTML 목업 + DS 병렬 성장)
3. 수단 (Harness 자동화)
4. 통일 원칙 (3 주체가 같은 DS)
5. Human-in-the-loop
6. 반복 루프

### 구현 스택

- Harness 1, 2 (AI + .md)
- UI Schema (ephemeral IR, 5원칙)
- Mockup Renderer (접근 C, 재량 제한)
- **PRD 안정화 트리거** (기획자 수동 — 개선 필요)
- **DS 판단 Gate** (자동 분류 + 사람 판단 분리)
- **자동 이슈 생성** (GitHub + Notion)
- **병렬 트랙 구조** (서비스 트랙 ⇄ DS 트랙, Registry가 연결)
- 4개 역할 + DS 오너
- 3-Layer DS + Product comp 거버넌스 (자동 트래킹)
- Code Connect (L1/L2)
- Figma Enforcement (가시화)
- Storybook + DS Registry

핵심: **PRD → Code 자동화가 아니라 각 단계 마찰 최소화 + 싼 반복 + DS 확장의 자동 inbox화 + 두 트랙의 Registry 매개 동기화**.

> Design System은 완성된 상태로 만들려고 하면 실패한다.  
> 제품 개발 → DS 필요 발견 → DS 확장 루프가 정답이다.  
> 그 루프가 티켓 속도를 막지 않아야 한다.  
> 확장 요청은 자동 inbox로 수집하고, 주간 리뷰로 소화한다.  
> DS 업데이트는 Registry를 통해 다음 티켓 파이프라인에 자동 반영된다.

---

## 부록 — 다음 단계

1. Phase 0 측정 계획 수립
2. 역할 지정 (DS FE, DS Figma, DS 오너)
3. L2 컴포넌트 15개 확정
4. Harness 1, 2 프롬프트 템플릿
5. Mockup Renderer 프로토타입 (재량 제한 시스템 프롬프트)
6. DS Registry 추출 스크립트
7. **자동 분류기 설계** (유사도 매칭 + 비즈니스 맥락 감지)
8. **GitHub + Notion 자동 연동 스크립트** (GitHub Actions + Notion API)
9. **DS 오너 주간 inbox 리뷰 리듬** (회의 or Slack)
10. **PRD 안정화 트리거 자동화 연구** [개선 필요]
11. Pilot 프로젝트 선정
