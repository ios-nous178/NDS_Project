# Storybook 컴포넌트 테스트 커버리지 진단 보고서

기준일: 2026-04-12

이 문서는 NudgeEAP Design System 저장소의 현재 상태를 기준으로, Storybook 중심의 컴포넌트 테스트 수준과 전체 디자인시스템 품질 체계를 냉정하게 진단한 보고서다.

---

## 1. 결론 요약

현재 이 저장소는 "스토리북 기반 컴포넌트 QA의 폭"은 생각보다 넓다. 반면 "깊이 있는 컴포넌트 테스트 안전망"은 아직 초기 단계다.

- Storybook 스토리 커버리지: 좋음
- Storybook `play` 기반 상호작용 커버리지: 넓지만 깊이는 보통 이하
- Vitest 기반 컴포넌트/통합 테스트: 부족
- CI에서 강제되는 테스트 품질 게이트: 부분적
- 디자인시스템 문서화/인벤토리 구조: 좋음
- Figma-Code 추적성: 낮음

냉정하게 평가하면, 현재 수준은 다음에 가깝다.

> "데모 중심 Storybook" 단계는 이미 넘었고, "QA 친화적인 Storybook 운영"까지는 왔다. 하지만 "리팩터링에도 견디는 테스트 체계"라고 부르기에는 아직 이르다.

---

## 2. 핵심 수치

실제 저장소 기준으로 확인한 수치다.

### 구현/문서/스토리 현황

- 구현 컴포넌트 수: 15개
- 컴포넌트 스토리 파일 수: 15개
- 토큰/reference 스토리 파일 포함 전체 story 파일 수: 20개
- 컴포넌트 문서 페이지 수: 15개
- 컴포넌트 인벤토리 메타데이터 등록: 15/15

### Storybook 상호작용 테스트 현황

- `play` 함수가 있는 컴포넌트 스토리 파일: 15/15
- 전체 `play` 시나리오 수: 35개
- Storybook test-runner CI 연결: 있음
- Storybook a11y 실패 처리: 있음

### React 테스트 현황

- Vitest 테스트 파일 수: 4개
- 실제 테스트 케이스 수: 13개
- 테스트 대상 컴포넌트/플로우: `Input`, `Tabs`, `Toast`, `FieldActionRow`
- 실행 결과: 13/13 통과
- 타입체크 결과: 통과

### 추적성/운영 현황

- Figma 링크 커버리지: 4/15 = 27%
- Chromatic 워크플로우: 있음
- Chromatic 필수성: 토큰 없으면 skip, required gate로 보긴 어려움
- 코드 커버리지 수치 산출: 없음

---

## 3. 현재 수준 판정

### 3.1 Storybook 기반 컴포넌트 테스트 커버리지

판정: **범위는 넓음, 깊이는 중하**

좋은 점:

- 구현된 15개 컴포넌트 전부에 Storybook이 있다.
- 구현된 15개 컴포넌트 전부에 최소 1개 이상의 `play` 시나리오가 있다.
- 버튼, 입력, 탭, 셀렉트, 모달류처럼 상호작용이 있는 컴포넌트에 실제 클릭/키보드/상태 변화 검증이 들어가 있다.
- a11y addon이 `error` 레벨로 설정되어 있어서 기본 접근성 위반을 Storybook test-runner에서 잡을 수 있다.

한계:

- 많은 `play` 테스트가 happy path 중심이다.
- 고난도 컴포넌트에서 포털, 포커스 복원, 스크롤 잠금, outside click, ESC, disabled option, edge keyboard navigation 같은 실패하기 쉬운 계약이 충분히 분해되어 있지 않다.
- Storybook `play` 테스트는 실제로는 "사용 시나리오 검증"에 가깝고, 세밀한 상태 조합 회귀를 촘촘하게 막는 용도로는 부족하다.

종합하면 Storybook 기준 컴포넌트 테스트 커버리지는:

- **폭 기준:** 80~90점
- **깊이 기준:** 45~55점
- **실무 안전망 기준 종합:** 60점 전후

즉, "한 번씩 만져보는 QA 수준"은 꽤 올라왔지만, "회귀를 강하게 막는 테스트망"이라고 보기는 어렵다.

### 3.2 Vitest 기반 컴포넌트 테스트 커버리지

판정: **초기 도입 단계**

현재 테스트는 아래만 존재한다.

- `Input`: 3개
- `Tabs`: 2개
- `Toast`: 2개
- `FieldActionRow` 통합: 6개

즉, 구현 컴포넌트 15개 중 실질적으로 테스트된 것은 4개뿐이다. 컴포넌트 기준으로 보면 약 27% 수준이다.

더 중요한 문제는, 이 테스트들이 존재해도 루트 CI에서 `pnpm test`가 돌지 않는다는 점이다.

- `packages/react/package.json`에는 `test` 스크립트가 있음
- 그러나 `turbo.json`에는 `test` task가 없음
- `.github/workflows/ci.yml`에도 Vitest 실행 step이 없음

따라서 현재 React 테스트는 "존재는 하지만 강제되지 않는 안전망"이다. 이건 체감보다 훨씬 낮게 봐야 한다.

### 3.3 숫자로 된 코드 커버리지는 없음

판정: **정량 커버리지 부재**

`packages/react/vitest.config.ts`에서 `coverage.enabled`가 `false`다. 즉 현재 저장소는 line/branch/function coverage를 공식적으로 측정하지 않는다.

따라서 "몇 % 커버됐나?"라는 질문에 대해 정직하게 답하면:

> 컴포넌트별 breadth는 대략 볼 수 있지만, 코드 커버리지는 아직 공식 수치가 없다.

---

## 4. 컴포넌트별 평가

| 컴포넌트       | Storybook | `play` | Vitest    | 현재 평가                                |
| -------------- | --------- | -----: | --------- | ---------------------------------------- |
| Button         | 있음      |      4 | 없음      | Storybook QA는 좋지만 단위 안전망 없음   |
| Badge          | 있음      |      1 | 없음      | 시각 확인 위주, 계약 검증 얕음           |
| Input          | 있음      |      4 | 있음      | 현재 가장 균형 잡힌 편                   |
| Modal          | 있음      |      2 | 없음      | 리스크 높은데 자동 테스트 부족           |
| Popup          | 있음      |      3 | 없음      | 접근성/포커스 계약 대비 단위 테스트 부족 |
| SearchInput    | 있음      |      3 | 없음      | 입력 계약은 있지만 세부 회귀 방어 약함   |
| Tabs           | 있음      |      2 | 있음      | 기본 계약은 커버, 더 확장 필요           |
| BottomSheet    | 있음      |      2 | 없음      | 오버레이/애니메이션/포커스 리스크 큼     |
| Select         | 있음      |      2 | 없음      | 포털/위치/닫힘 규칙 대비 부족            |
| Checkbox       | 있음      |      3 | 없음      | group/radio까지 고려하면 테스트 부족     |
| Toast          | 있음      |      2 | 있음      | provider 기반 계약 일부만 검증           |
| EmptyState     | 있음      |      2 | 없음      | 접근성 구조 검증은 있으나 단순한 편      |
| Card           | 있음      |      1 | 없음      | 레이아웃/slot contract 검증 부족         |
| Chip           | 있음      |      2 | 없음      | 선택/삭제/키보드 조합 테스트 부족        |
| FieldActionRow | 있음      |      2 | 통합 있음 | 통합 시나리오는 강함, 단위 계약은 약함   |

### 고위험인데 테스트가 부족한 컴포넌트

우선순위가 가장 높은 것은 다음이다.

1. `Modal`
2. `Select`
3. `BottomSheet`
4. `Popup`
5. `Checkbox` / `Radio`

이유는 모두 포털, 포커스, 키보드, 닫힘 규칙, disabled 상태, 접근성 역할 같은 실패 확률 높은 계약을 갖고 있기 때문이다.

---

## 5. 주요 발견 사항

### 5.1 강점

#### 1. Storybook 운영 수준이 "데모"는 이미 넘어섰다

- 대부분의 컴포넌트가 `State`, `Recipe`, `Interaction`, `QA`로 나뉘어 있다.
- 단순 전시가 아니라 계약서처럼 스토리를 쓰려는 의도가 분명하다.
- `interactionTest.ts`로 사용자 이벤트 속도와 step pause를 통일해 둔 점도 좋다.

#### 2. 문서화와 인벤토리 구조가 좋다

- `metadata/componentInventory.json`
- `docs/components/*`
- `apps/storybook/src/componentDocs.ts`

이 세 축이 연결되어 있어서 "무엇이 구현됐는지"를 파악하기 쉽다. 디자인시스템에서 이건 꽤 큰 장점이다.

#### 3. FieldActionRow 통합 테스트는 좋은 출발점이다

MSW를 붙여서 실제 플로우를 검증하는 방식은 매우 실전적이다. 이 방식은 단순 렌더링 테스트보다 훨씬 가치가 높다.

### 5.2 약점

#### 1. 가장 큰 약점은 "Vitest가 CI에 걸려 있지 않다"는 점

이건 구조적으로 중요하다. 테스트가 있어도 CI가 안 돌면 팀 차원 품질 게이트가 아니다.

#### 2. 복잡한 오버레이 컴포넌트의 단위 테스트가 거의 없다

`Modal`, `Popup`, `BottomSheet`, `Select`는 코드 복잡도가 높은데도 Storybook `play` 위주다. 이건 회귀 방어력이 약하다.

#### 3. 코드 커버리지 수치가 없다

정량 관리가 불가능하다. 지금은 "느낌상 많이 테스트했다"와 "실제로 코드가 얼마나 실행됐는지"를 구분할 수 없다.

#### 4. 문서와 실제 구현이 일부 어긋난다

`README.md`에는 아직 `@nudge-eap/react`에 Button만 구현된 것처럼 적혀 있다. 실제 상태와 맞지 않는다. 외부 협업자에게 잘못된 인상을 줄 수 있다.

#### 5. Figma 연결률이 낮다

현재 Figma 링크는 27%다. 문서 구조는 좋은데 추적성 데이터가 비어 있어서 반쪽짜리다.

---

## 6. 테스트 외 관점에서 본 디자인시스템 평가

### 6.1 아키텍처

판정: **방향은 좋고, 공통 primitive 정리는 아직 덜 됨**

좋은 점:

- `tokens`, `react`, `icons`, `tailwind-preset`, `storybook`, `docs`로 분리된 monorepo 구조가 명확하다.
- 토큰 기반 접근이 비교적 잘 지켜지고 있다.
- Flat + Compound API라는 원칙이 문서와 구현에 같이 반영되어 있다.

아쉬운 점:

- 오버레이 계열(`Modal`, `Popup`, `BottomSheet`, `Select`)에서 포털, 스크롤 잠금, 포커스 처리 로직이 여러 파일에 분산되어 있다.
- `internal/web.tsx`가 일부 공통 기능을 담당하지만, 오버레이 primitive가 완전히 공통화된 상태는 아니다.
- 따라서 수정 시 중복 버그가 생기기 쉽다.

### 6.2 스타일링 시스템

판정: **실용적이지만 유지보수 리스크가 있음**

좋은 점:

- CSS 변수 + extracted CSS 전략은 프레임워크 비의존성과 확장성 측면에서 합리적이다.
- `data-slot` 기반 확장 포인트도 명확하다.

주의할 점:

- `extract-styles.mjs`는 TS 소스를 문자열 파싱 + `new Function`으로 평가한다.
- 지금 규모에서는 작동하지만, 문법이 복잡해질수록 추출 스크립트가 깨질 가능성이 있다.
- 스타일 정의가 컴포넌트 파일 내부의 큰 템플릿 문자열에 묶여 있어, 장기적으로는 파일 가독성이 떨어질 수 있다.

### 6.3 문서/운영

판정: **상당히 좋음**

좋은 점:

- 문서가 많고, 실제 운영 흐름까지 적어 두었다.
- 테스트 전략 문서와 QA 자동화 계획이 분리되어 있다.
- 단순 사용법 문서가 아니라 운영 문서까지 있는 점은 강점이다.

아쉬운 점:

- 문서가 실제 구현 속도보다 앞서 있다.
- 일부 문서는 "계획"이고, 실제 저장소는 아직 그 단계에 도달하지 않았다.

즉 문서 성숙도는 높은데, 테스트/운영 자동화 구현은 그만큼 따라오지 못했다.

---

## 7. 가장 먼저 고쳐야 할 것

### P0

#### 1. Vitest를 CI에 연결

반드시 해야 한다.

- `turbo.json`에 `test` task 추가
- 루트 `package.json` 또는 CI에서 `pnpm test` 계열 실행
- `.github/workflows/ci.yml`에 React test step 추가

이 작업 전후의 차이는 매우 크다. 지금은 테스트가 "옵션"이다.

#### 2. 고위험 컴포넌트 단위 테스트 추가

우선순위:

1. `Modal`
2. `Select`
3. `BottomSheet`
4. `Popup`
5. `Checkbox` / `Radio`

검증 항목:

- ESC 닫기
- overlay click 닫기
- focus trap
- focus restore
- body scroll lock
- disabled option / disabled action
- keyboard navigation
- portal 렌더링

#### 3. 커버리지 리포트 활성화

`coverage.enabled = true`로 바꾸고 최소한 text summary라도 CI에 남겨야 한다.

목표값 예시:

- P0 컴포넌트 line coverage 80%+
- 전체 `packages/react` line coverage 60%+에서 시작

### P1

#### 4. Storybook `play` 테스트를 실패 시나리오까지 확장

지금은 성공 경로가 많다. 다음을 추가하는 것이 좋다.

- `Select`: disabled option 선택 방지, 바깥 클릭 닫힘
- `Modal`: ESC, focus restore
- `BottomSheet`: closing animation 후 닫힘, mask close off 동작
- `Checkbox/Radio`: group 내 선택 규칙
- `Chip`: delete action, selected state, keyboard

#### 5. 오버레이 공통 primitive 정리

`Modal`, `Popup`, `BottomSheet`, `Select`가 공유하는 아래 로직을 공통화하는 편이 낫다.

- portal mount
- dismissable layer
- scroll lock
- focus trap / restore
- escape handling

### P2

#### 6. Figma 링크 27%를 최소 80%까지 끌어올리기

지금 구조상 메타데이터 체계는 좋다. 데이터만 채우면 된다. 투자 대비 효과가 높다.

#### 7. README 현실화

첫 진입 문서가 실제 상태를 반영해야 한다. 지금 README는 저장소가 과소평가되어 보인다.

---

## 8. 추천 로드맵

### 1주 안에 할 일

- Vitest를 CI에 연결
- `Modal`, `Select` 테스트 추가
- coverage summary 켜기
- README 업데이트

### 2~3주 안에 할 일

- `BottomSheet`, `Popup`, `Checkbox/Radio`, `Chip` 테스트 추가
- Storybook `play` 실패 시나리오 확장
- Figma 링크 대량 보강

### 1개월 안에 할 일

- 오버레이 공통 primitive 정리
- 토큰 영향도 분석 자동화 고도화
- Chromatic required gate 정책 정리

---

## 9. 최종 평가

현재 이 디자인시스템은 "정리 안 된 실험 저장소"는 아니다. 오히려 문서화, Storybook 구조, 인벤토리, 컴포넌트 수, 토큰 분리까지 보면 꽤 빠르게 성숙해지고 있는 저장소다.

하지만 테스트 관점에서는 아직 분명한 공백이 있다.

- Storybook 커버리지는 넓다.
- Vitest 커버리지는 얕다.
- CI 강제력은 불완전하다.
- 정량 커버리지는 없다.

따라서 현재 수준을 한 줄로 요약하면:

> "컴포넌트 테스트를 시작한 프로젝트"를 넘어 "좋은 QA 습관이 자리잡기 시작한 프로젝트"지만, 아직 "안전하게 리팩터링 가능한 수준"까지는 아니다.

가장 중요한 다음 한 걸음은 Storybook을 더 늘리는 것이 아니라, 이미 만든 테스트를 CI와 정량 커버리지로 연결하고 고위험 컴포넌트의 Vitest를 채우는 것이다.
