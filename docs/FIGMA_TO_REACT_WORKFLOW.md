# Figma to React Workflow

이 문서는 Figma 디자인을 기반으로 React 컴포넌트를 생성하고, 디자인 시스템과 지속적으로 동기화하기 위한 운영 워크플로우를 정리한 문서입니다.

핵심 목표는 다음과 같습니다.

- Figma 디자인을 빠르게 코드로 연결
- 디자인 토큰과 실제 구현의 드리프트 최소화
- Storybook, Docs, QA까지 이어지는 반자동화 체계 구축
- AI를 활용하되 사람이 최종 품질을 승인하는 구조 유지

이 문서의 결론은 단순합니다.

> 완전 자동 생성보다, 추적 가능하고 검증 가능한 반자동화가 더 현실적이고 오래 갑니다.

---

# 실무에서 꼭 가져갈 4가지

실무적으로는 아래 4가지를 반드시 같이 두는 것을 추천합니다.

1. `tokens` 를 Figma 값의 공식 번역 레이어로 둡니다.
2. 각 컴포넌트마다 `component spec` 과 `figma node id` 를 남깁니다.
3. Storybook을 시각 계약서처럼 운영합니다.
4. PR 템플릿에 Figma 링크, token 변경 여부, Storybook 반영 여부를 필수로 둡니다.

이 4가지가 있어야 Figma와 디자인 시스템의 1:1 매칭이 "사람이 기억해서 유지하는 방식"이 아니라 "작업 프로세스 안에서 계속 검증되는 방식"으로 바뀝니다.

---

# 1. 이 자동화는 의미가 있는가

의미는 있습니다. 다만 "Figma를 넣으면 완성된 프로덕션 코드가 자동 생성된다"는 기대치로 보면 실망할 가능성이 큽니다.

이 자동화가 진짜 의미 있는 지점은 다음과 같습니다.

- 반복적인 spec 정리 시간을 줄여줌
- variant, size, state 누락을 줄여줌
- 토큰 미적용 상태를 더 빨리 발견하게 해줌
- Storybook과 Docs 초안을 빠르게 만들어 QA 속도를 높여줌
- 디자이너, 개발자, 기획자가 같은 구조로 대화하게 해줌

반대로 자동화만으로 해결되지 않는 영역도 분명합니다.

- 디자인 의도 해석
- interaction 우선순위 판단
- 최종 픽셀 QA
- 접근성 최종 판단
- 기존 서비스 구조와의 통합 방식

즉, 자동화의 목적은 "사람을 대체"하는 것이 아니라 "드리프트와 반복 작업을 줄이는 것"입니다.

---

# 2. 1:1 매칭을 위해 필요한 관점

Figma와 디자인 시스템을 항상 1:1로 맞추고 싶다면, 가장 먼저 정해야 하는 것은 자동화 도구가 아니라 **Source of Truth 체계**입니다.

권장 우선순위는 아래와 같습니다.

1. 디자인 값의 Source of Truth는 Figma Tokens 또는 토큰 정의 문서
2. 개발 구현의 Source of Truth는 디자인 시스템 패키지
3. 시각 검증의 Source of Truth는 Storybook
4. 변경 이력의 Source of Truth는 Git 기반 문서와 PR 리뷰

중요한 점은 Figma와 React 컴포넌트를 직접 1:1로 묶으려 하지 않는 것입니다.

직접 연결

```text
Figma Component -> React Component
```

이 구조는 처음에는 빨라 보이지만, 시간이 지나면 variant naming, 상태 정의, 실제 제품 제약 때문에 쉽게 어긋납니다.

더 안정적인 구조는 아래와 같습니다.

```text
Figma
 -> Token / Component Spec
 -> Design System Code
 -> Storybook QA
 -> Consumer Apps
```

즉, Figma와 코드는 직접 맞붙는 것이 아니라 `tokens` 와 `component spec` 을 사이에 둔 상태로 동기화하는 편이 훨씬 안정적입니다.

실제 운영에서는 여기에 한 단계 더해 아래 메타데이터 레이어를 두는 것을 권장합니다.

```text
Figma Link / Node ID
 -> componentInventory.json
 -> Storybook Docs / Component Inventory
 -> 사람이 검토하고 보완
```

즉, 완전 자동 매칭보다 `자동 생성 가능한 연결표 + 사람이 보완하는 메타데이터` 구조가 현실적으로 가장 오래 갑니다.

---

# 3. 핵심 운영 원칙

## 3.1 Tokens First

Figma 값을 바로 코드 값으로 쓰지 않습니다.

예:

- `#2B96ED` 를 코드에 직접 쓰지 않고 `semantic.primary.main` 으로 매핑
- `8px` 를 코드에 직접 쓰지 않고 `radius.md` 로 매핑
- `16px` 을 직접 쓰지 않고 `spacing.16` 또는 팀 규칙에 맞는 spacing token으로 매핑

## 3.2 Spec Before Code

코드를 만들기 전에 반드시 spec을 먼저 만듭니다.

Spec에는 최소한 아래가 있어야 합니다.

- 목적
- variant
- size
- state
- 구조
- token mapping
- accessibility 요구사항
- edge case

## 3.3 Human Approval Gate

AI가 생성한 결과물은 반드시 사람이 승인합니다.

승인 게이트 예시:

1. Figma spec 승인
2. token mapping 승인
3. component API 승인
4. Storybook QA 승인
5. consumer app 반영 승인

## 3.4 Storybook as Visual Contract

Storybook은 단순 데모가 아니라 시각 계약서 역할을 해야 합니다.

디자인과 구현이 맞는지 확인하는 기준은 실제 앱보다 먼저 Storybook에서 확정하는 것이 좋습니다.

---

# 4. 추천 시스템 구조

Figma와 디자인 시스템을 장기적으로 안정적으로 맞추려면 아래 4층 구조가 좋습니다.

```text
Layer 1: Figma
- 디자인 원본
- variant, size, state 정의
- 토큰 스타일 정의

Layer 2: Design Tokens
- colors
- typography
- spacing
- radius
- sizing

Layer 3: Component Spec
- Button, Input, Card 같은 컴포넌트 계약
- props, states, slots, accessibility

Layer 4: Code + Storybook
- React implementation
- stories
- docs
- visual QA
```

이 구조의 장점은 변경 영향 범위가 분리된다는 점입니다.

- 색만 바뀌면 tokens 수정
- 구조가 바뀌면 component spec 수정
- 렌더링 문제가 있으면 code 수정
- 시각 차이는 Storybook에서 검증

---

# 5. 전체 워크플로우

```text
Figma
 ↓
디자인 정보 추출
 ↓
Token 매핑
 ↓
Component Spec 생성
 ↓
React Component 초안 생성
 ↓
Storybook 생성
 ↓
Docs 생성
 ↓
사람 QA / 수정
 ↓
패키지 반영
```

현재 레포에서는 이 흐름 일부를 아래 파일로 운영합니다.

- 메타데이터 원본: `metadata/componentInventory.json`
- 사이드바 자동 분류(Figma 정합/미정합): `apps/docs/sidebars.js`
- 컴포넌트 갤러리: `apps/docs/src/components/ComponentGallery.js`
- Storybook Docs 연결: `apps/storybook/src/componentDocs.ts`

---

# 6. Step 1. Figma 준비

AI와 자동화가 잘 동작하려면 Figma 정리 상태가 좋아야 합니다.

최소 요구사항:

- 컴포넌트 이름 규칙 통일
- variant property 정리
- size property 정리
- state property 정리
- Auto Layout 사용
- color / typography / effect 스타일 정리
- icon naming 정리
- disabled / loading / hover / pressed 등 상태 분리

예시:

- `Button / variant=primary / size=md / state=default`
- `Button / variant=primary / size=md / state=disabled`
- `Button / variant=secondary / size=sm / state=default`

Figma가 정리되지 않은 상태에서 자동화를 얹으면, AI가 만든 결과물도 결국 흔들립니다.

## 6.1 Figma 링크를 메타데이터에 연결

컴포넌트 수준의 연결은 아래처럼 운영합니다.

1. 디자이너가 Figma component set 또는 frame 링크를 확보
2. `node-id`를 함께 기록
3. `metadata/componentInventory.json`의 해당 컴포넌트 항목에 입력 (`figmaSynced` 포함)
4. 빌드 시 사이드바 "Figma 정합/미정합" 분류·갤러리 태그·Storybook 배지에 자동 반영 (별도 생성 명령 불필요)
5. Storybook Docs와 컴포넌트 갤러리에서 확인

예시:

```json
{
  "name": "Modal",
  "storybookTitle": "Components/Modal",
  "docsPath": "/docs/components/modal",
  "figmaUrl": "https://www.figma.com/design/FILE_KEY/Design-System?node-id=612-18421",
  "figmaNodeId": "612:18421"
}
```

이 방식의 장점은 아래와 같습니다.

- 사람이 직접 넣을 수 있음
- Storybook과 docs에 함께 반영됨
- 아직 링크가 없는 컴포넌트는 `연결 필요` 상태로 드러남
- 구현 상태, 사용 범위, 메모까지 같이 남길 수 있음

---

# 7. Step 2. 디자인 정보 추출

Figma에서 아래 정보를 구조화해서 추출합니다.

- 컴포넌트 이름
- variant 목록
- size 목록
- state 목록
- layout 구조
- padding / gap / radius
- typography
- color
- icon 유무
- slot 구조
- interaction 힌트

예시:

```json
{
  "component": "Button",
  "variants": ["primary", "secondary", "ghost"],
  "sizes": ["sm", "md", "lg"],
  "states": ["default", "hover", "pressed", "disabled", "loading"],
  "layout": {
    "height": 48,
    "paddingX": 16,
    "paddingY": 12,
    "radius": 8
  },
  "text": {
    "fontSize": 16,
    "fontWeight": 700,
    "lineHeight": 24
  }
}
```

이 단계 산출물은 `figma-spec.json` 같은 구조화된 파일이 좋습니다.

---

# 8. Step 3. Token 매핑

추출한 값은 바로 코드에 넣지 않고, 먼저 기존 토큰에 매핑합니다.

예시:

- `#2B96ED` -> `semantic.primary.main`
- `#ED2E77` -> `semantic.secondary.sub`
- `8px` -> `radius.md`
- `16px` -> `spacing.16`
- `16/24 Bold` -> `typeScale.body1` 또는 팀 규칙에 맞는 typography token

원칙:

1. 기존 token이 있으면 반드시 재사용
2. 비슷한 값이 있다고 임의로 새 token을 만들지 않기
3. token이 없으면 candidate로 기록하고 사람 승인 후 추가

이 단계가 중요한 이유는 Figma와 코드의 1:1 매칭이 사실상 "픽셀값 일치"가 아니라 "토큰 참조 일치"여야 유지 가능하기 때문입니다.

---

# 9. Step 4. Component Spec 생성

React 코드를 바로 생성하지 말고 먼저 `component-spec.md` 를 만듭니다.

포함 항목:

- 컴포넌트 목적
- variant
- size
- state
- props
- slot 구조
- accessibility 요구사항
- token mapping
- 예시 usage
- edge case

예시:

```ts
Component: Button

Props:
- variant: "primary" | "secondary" | "ghost"
- size: "sm" | "md" | "lg"
- disabled?: boolean
- loading?: boolean
- leftIcon?: ReactNode
- rightIcon?: ReactNode
- children: ReactNode

Accessibility:
- button element 사용
- disabled 전달
- loading 시 aria-busy 고려

Style tokens:
- borderRadius: radius.md
- paddingX: spacing.16
- font: typeScale.body1
```

Spec이 흔들리면 코드도 흔들립니다. 따라서 spec이 애매하면 생성 중단이 맞습니다.

---

# 10. Step 5. React 컴포넌트 초안 생성

Spec이 승인되면 React 컴포넌트 초안을 생성합니다.

생성 원칙:

- 기존 design token 사용
- 기존 컴포넌트 네이밍 규칙 준수
- Flat API 우선
- 필요한 경우 Compound API 확장 고려
- 접근성 속성 반영
- 확장 가능한 props 구조 유지
- 디자인을 임의로 개선하지 않기

예시 목표:

```tsx
<Button variant="primary" size="md">
  확인
</Button>
```

자동 생성된 코드는 "첫 번째 구현안"일 뿐, 최종본으로 간주하면 안 됩니다.

---

# 11. Step 6. Storybook 생성

컴포넌트가 생기면 Storybook stories를 함께 생성합니다.

반드시 포함할 항목:

- 기본 상태
- 모든 variant
- 모든 size
- disabled
- loading
- icon 포함 케이스
- 긴 텍스트
- 모바일 폭 대응
- edge case

Storybook은 단순 showcase가 아니라 QA 환경입니다.

즉, "코드가 돌아간다"보다 "디자인 계약이 유지된다"를 검증하는 공간이어야 합니다.

---

# 12. Step 7. Docs 생성

문서도 함께 생성합니다.

권장 섹션:

1. Overview
2. Variants
3. Sizes
4. States
5. Accessibility
6. Do and Don't
7. Examples

문서의 목적은 개발자만이 아니라 디자이너, 기획자도 같은 기준을 보게 하는 것입니다.

---

# 13. Step 8. QA 및 검수

자동 생성된 결과물은 반드시 검수합니다.

## UI QA

- spacing 일치 여부
- typography 일치 여부
- border radius 일치 여부
- 색상 일치 여부
- 상태별 시각 차이 일치 여부
- icon 정렬 일치 여부
- 줄바꿈 및 긴 텍스트 대응
- 모바일 대응

## 기술 QA

- props 구조 적절성
- token 재사용 여부
- 중복 구현 여부
- 확장 가능성
- 접근성 속성 반영 여부

## 문서 QA

- Storybook 상태 누락 여부
- Docs 예시 누락 여부
- 디자이너/기획자 관점 설명 부족 여부

---

# 14. 1:1 매칭을 위한 운영 시스템

여기가 가장 중요합니다. Figma와 코드가 계속 맞으려면 "생성"보다 "운영 규칙"이 있어야 합니다.

## 14.1 Token Sync 규칙

- Figma 스타일과 코드 토큰 이름을 가능하면 동일한 의미 체계로 유지
- 색상, spacing, typography는 사람이 임의 이름을 늘리지 않기
- 토큰 변경은 Figma와 코드가 같은 PR 또는 같은 작업 티켓으로 묶이게 하기

권장 예시:

- Figma: `primary/main`
- Code: `semantic.primary.main`
- CSS variable: `--primary-main`

완전히 같은 문자열까지 강제할 필요는 없지만, 의미 구조는 반드시 같아야 합니다.

## 14.2 Component Inventory 운영

컴포넌트마다 아래 메타데이터를 남기면 좋습니다.

- Figma component URL 또는 node id
- component owner
- 현재 구현 상태
- 관련 Storybook 경로
- 관련 토큰 목록
- 최근 동기화 날짜

예시:

```json
{
  "component": "Button",
  "figmaNode": "123:456",
  "storybook": "Components/Button",
  "tokens": ["semantic.primary.main", "spacing.16", "radius.md"],
  "status": "synced",
  "lastSyncedAt": "2026-04-09"
}
```

이런 inventory가 있으면 어떤 컴포넌트가 Figma와 어긋났는지 추적하기 쉬워집니다.

## 14.3 Drift Detection 체크포인트

드리프트를 줄이려면 아래 시점마다 체크해야 합니다.

1. Figma 변경 시
2. token 변경 시
3. component API 변경 시
4. Storybook 시각 변경 시
5. consumer app에서 임시 스타일 우회가 생겼을 때

즉, 동기화는 "정기 배치"보다 "변경 이벤트마다 체크"하는 편이 낫습니다.

## 14.4 PR 템플릿 연동

PR에 아래 질문을 넣으면 실무에서 도움이 큽니다.

- 관련 Figma 링크가 있는가
- 신규 token이 필요한가
- 기존 token을 재사용했는가
- Storybook 스토리를 추가했는가
- 시각 QA를 했는가

이건 자동화보다 훨씬 강력한 운영 장치가 됩니다.

## 14.5 Visual Regression

가능하면 Storybook 기반 visual regression도 붙이는 것이 좋습니다.

예:

- 주요 컴포넌트 snapshot
- variant/state 기준 비교
- icon alignment diff
- mobile width 기준 diff

이 단계가 있으면 Figma와의 1:1 완전 일치는 아니더라도, 적어도 "어제와 다른 이유 없는 변화"를 빨리 잡을 수 있습니다.

---

# 15. 자동화 가능한 영역과 불가능한 영역

## 자동화 가능한 영역

- Figma spec 요약
- variant/state 정리
- token 후보 매핑
- React 초안 생성
- Storybook 초안 생성
- Docs 초안 생성
- QA 체크리스트 생성

## 자동화하면 안 되는 영역

- token 최종 승인
- 애매한 interaction 확정
- 디자인 의도 추정
- 최종 시각 완성도 판정
- accessibility 최종 승인

---

# 16. 추천 산출물

각 컴포넌트 작업 시 아래 산출물을 남기면 유지보수가 쉬워집니다.

```text
1. figma-spec.json
2. token-mapping.json
3. component-spec.md
4. Component.tsx
5. Component.stories.tsx
6. component-docs.md
7. qa-checklist.md
```

선택적으로 아래도 추천합니다.

```text
8. component-inventory.json
9. visual-regression snapshot
10. figma node reference
```

---

# 17. 권장 폴더 구조

```text
NudgeEAPDesignSystem/
  packages/
    tokens/
    react/
    icons/
  apps/
    storybook/
  docs/
    TOKENS.md
    FIGMA_TO_REACT_WORKFLOW.md
  workflows/
    figma-to-react/
      figma-spec.json
      token-mapping.json
      component-spec.md
      qa-checklist.md
      component-inventory.json
```

---

# 18. 추천 시작 방식

처음에는 아래 컴포넌트부터 시작하는 것이 좋습니다.

- Button
- Input
- Badge
- Card
- Modal

이유:

- 구조가 비교적 명확함
- variant/state가 비교적 분명함
- 토큰 매핑 검증이 쉬움
- Storybook QA하기 좋음
- 실제 서비스 적용 범위가 넓음

---

# 19. 최종 제안

현재 팀 상황에서 가장 현실적인 방향은 아래입니다.

1. Figma를 직접 React로 생성하지 말고 먼저 token과 spec으로 분리
2. AI는 spec, story, docs 초안 생성에 집중
3. Storybook을 시각 계약서처럼 운영
4. component inventory와 PR 체크리스트로 드리프트 관리
5. "항상 완전 자동 동기화"보다 "변경 시 검증 가능한 동기화"를 목표로 삼기

즉, 이상적인 시스템은 이런 형태입니다.

```text
Figma
 -> Token Sync
 -> Component Spec
 -> React Component
 -> Storybook
 -> Visual QA
 -> Release
```

이 흐름이 갖춰지면, Figma와 디자인 시스템의 1:1 매칭은 "사람이 기억해서 유지하는 시스템"이 아니라 "작업 과정에서 자연스럽게 검증되는 시스템"으로 바뀝니다.
