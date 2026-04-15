# Automation Workflow

이 문서는 NudgeEAP 디자인시스템 작업을 반복 가능하고 자동화하기 쉬운 업무 단위로 정리한 문서입니다.

목표는 단순히 "컴포넌트를 만든다"가 아니라, 아래 흐름을 일관되게 수행할 수 있게 만드는 것입니다.

- 기존 프로젝트 코드와 비교한다
- 실제 사용 가능성을 판단한다
- 디자인시스템 원칙에 맞게 컴포넌트를 만든다
- 접근성을 개선한다
- Storybook 예시를 실제 사용 코드 기준으로 만든다
- 변경 내용을 문서로 남긴다
- 검증까지 끝낸다

이 문서는 특히 아래 같은 요청을 자동화 가능한 업무로 바꾸기 위해 작성합니다.

- 접근성을 개선해달라
- 기존 코드와 비교해서 실제 사용 가능성을 체크해달라
- 컴포넌트를 만들어달라
- 기존 구조와 스타일 가이드, flat/compound hybrid 구조를 유지해달라
- Storybook 예시를 만들어달라
- 예시는 실제 사용하는 코드였으면 좋겠다
- 실제 코드 예시를 적용한 경우 문서로 기록해달라

## 전체 업무 흐름

```text
1. 기존 코드 탐색
2. 구조/스타일/상태 분석
3. 디자인시스템 구조 설계
4. 컴포넌트 구현
5. 접근성 개선
6. Storybook 기본 스토리 작성
7. 실서비스 예시 스토리 작성
8. Docs/Usage 문서 작성
9. Migration notes 기록
10. typecheck/build/lint 검증
```

## 1. 기존 코드 탐색 업무

새 컴포넌트를 만들거나 기존 컴포넌트를 개선할 때 가장 먼저 해야 하는 일입니다.

해야 할 일:

- Homepage, Webview 등 실제 서비스 프로젝트에서 동일 역할 UI를 찾습니다.
- 최소 1개 이상, 가능하면 2~3개 이상의 사용 예시를 모읍니다.
- 다음 정보를 기록합니다.
  - 파일 경로
  - 컴포넌트 이름
  - props 구조
  - 주요 상태
  - 스타일 방식
  - 프로젝트 의존성

기록 예시:

- `NudgeEAPHomePage/src/app/components/Modal.tsx`
- `NudgeEAPWebview/src/app.component/modal/Modal.tsx`
- `NudgeEAPWebview/src/app.feature/sound/component/playlist/PlaylistEditModal.tsx`

자동화 포인트:

- 역할명(`Modal`, `Button`, `Badge`) 기준 파일 검색
- 실제 사용처 검색
- 경로 목록 md 초안 자동 생성

## 2. 구조/스타일/상태 분석 업무

찾은 실제 코드들을 기준으로, 디자인시스템 컴포넌트가 흡수해야 할 요구사항을 정리합니다.

분석 항목:

- 레이아웃 구조
- variant
- size
- 상태값
- 버튼/아이콘/슬롯 존재 여부
- 애니메이션 유무
- `styled-components` 또는 Tailwind 의존 여부
- 내부 DOM 구조 의존 여부
- 데이터 기반 UI 여부

결론은 아래 3단계로 판정합니다.

- 바로 대체 가능
- 부분 대체 가능
- 추가 설계 필요

자동화 포인트:

- 분석 결과 템플릿 자동 생성
- 교체 가능성 분류 표 자동 생성

## 3. 디자인시스템 구조 설계 업무

이 단계에서는 "그냥 비슷하게 구현"하는 게 아니라, 레포의 구조 원칙을 유지하는지 확인합니다.

반드시 확인할 것:

- 기존 스타일 구조 가이드를 따르는가
- `flat API`가 필요한가
- `compound API`가 필요한가
- 둘 다 유지해야 하는가
- 프로젝트 확장을 위한 스타일 표면이 충분한가

현재 기준 설계 원칙:

- 기본 스타일 < 프로젝트 스타일 < 외부 커스텀 props/style
- 가능하면 `className`, `slotProps`, `data-slot`, CSS 변수 제공
- 기본 사용은 `flat`
- 확장 사용은 `compound`

자동화 포인트:

- 새 컴포넌트 생성 시 기본 API 템플릿 제공
- slot 구조 체크리스트 자동 제공

## 4. 컴포넌트 구현 업무

구현 시 단순 렌더링보다 아래를 같이 봐야 합니다.

해야 할 일:

- 컴포넌트 파일 생성 또는 수정
- export index 반영
- 토큰 사용 여부 확인
- 확장 가능한 스타일 구조 반영
- props 타입 정리
- Storybook에서 다룰 수 있는 형태로 구성

구현 원칙:

- 디자인시스템 스타일 가이드 유지
- 기존 프로젝트 패턴 흡수 가능하게 설계
- inline style 과다 사용 방지
- 실제 서비스 UI를 옮길 수 있는 확장 포인트 확보

자동화 포인트:

- 컴포넌트 boilerplate 생성
- index export 자동 반영
- slot/className/data-slot 자동 템플릿 적용

## 5. 접근성 개선 업무

이 단계는 나중에 붙이는 옵션이 아니라 기본 작업에 포함됩니다.

체크리스트:

- 키보드로 사용 가능한가
- focus 이동이 자연스러운가
- focus trap이 필요한가
- `Escape` 닫기가 필요한가
- `aria-label`, `aria-labelledby`, `aria-describedby`가 필요한가
- 닫기 버튼이나 아이콘 버튼에 라벨이 있는가
- disabled/readOnly/error 상태가 전달되는가
- `button`에 `type="button"`이 있는가

대표 예시:

- `Modal`: `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap, escape close
- `Popup`: `alertdialog`, 버튼 포커스 이동
- `Input`: error/helper/readOnly/disabled 상태 전달

자동화 포인트:

- a11y 체크리스트 자동 생성
- Storybook a11y 스토리 자동 생성

## 6. 실사용 가능성 검토 업무

이 단계는 "컴포넌트가 예쁘냐"가 아니라, "실제 프로젝트에서 교체 가능한가"를 보는 단계입니다.

해야 할 일:

- 실제 프로젝트 코드와 디자인시스템 컴포넌트를 나란히 비교
- props 차이 확인
- 레이아웃 차이 확인
- 애니메이션 차이 확인
- 스타일 확장 가능 여부 확인
- 마이그레이션 시 필요한 추가 작업 정리

결과는 문서로 남깁니다.

기록 예시:

- 바로 교체 가능
- Storybook 예시로 먼저 검증 필요
- className/slotProps 확장 필요
- 전역 모달 시스템이라 마지막에 다뤄야 함

자동화 포인트:

- 비교 결과 md 초안 자동 생성
- 파일 경로 목록 자동 수집

## 7. Storybook 기본 스토리 작성 업무

컴포넌트를 만들었다면 최소한 아래 스토리는 기본 세트로 둡니다.

기본 세트:

- Playground
- variant
- size
- 상태별 예시
- disabled/readOnly/error 예시
- a11y 또는 interaction 예시

원칙:

- Storybook은 데모가 아니라 QA 환경입니다.
- 기본 동작과 경계 조건이 보여야 합니다.

자동화 포인트:

- 기본 stories 템플릿 생성
- argTypes/args 기본 구성 자동화

## 8. 실서비스 예시 스토리 작성 업무

이 단계가 중요합니다.

단순한 예제가 아니라 실제 서비스에서 쓰는 코드 느낌을 재현해야 합니다.

원칙:

- 실제 프로젝트 문구 사용
- 실제 데이터 구조 반영
- 실제 레이아웃과 상태를 최대한 닮게 구성
- 필요하면 여러 방식 비교
  - UI만 옮긴 버전
  - `slotProps` 버전
  - `className` 버전
  - `compound` 버전

예시:

- `WebView Playlist Edit UI`
- `Homepage Counseling App Download`
- `Webview Participate Reward`

자동화 포인트:

- 실제 프로젝트 파일 기반 스토리 초안 생성
- Storybook 그룹 구조 자동 추천

## 9. Docs/Usage 문서 작성 업무

스토리만으로 끝내지 않고, 복붙 가능한 예시도 같이 제공합니다.

해야 할 일:

- `Show code`가 읽기 좋도록 `source.code` 제공
- MDX/Usage 문서 작성
- 기본 사용법 + 실제 사용 패턴 같이 제공

예시 문서:

- `Guides/Modal Usage`

자동화 포인트:

- MDX usage 문서 템플릿 생성
- story source code 자동 삽입

## 10. 문서화 업무

실제 코드 비교나 적용 시도 결과는 문서로 남깁니다.

문서 종류:

- 스타일 구조 가이드
- migration notes
- component inventory
- automation workflow

특히 migration notes에는 아래를 기록합니다.

- 어떤 프로젝트 파일을 봤는지
- 어떤 컴포넌트를 비교했는지
- 어디까지 교체 가능한지
- 어떤 추가 설계가 필요했는지
- 대응되는 Storybook 예제 위치

자동화 포인트:

- migration notes 템플릿 생성
- README 링크 자동 추가

## 11. 검증 업무

작업은 구현에서 끝나지 않습니다.

최소 검증:

- `tsc --noEmit`
- Storybook build
- 패키지 build
- lint / format

확인 포인트:

- 타입 오류가 새 작업 때문인지 기존 이슈인지 구분
- Storybook에 새 스토리가 실제로 잡히는지 확인
- Docs/MDX 페이지가 노출되는지 확인

자동화 포인트:

- PR 전 검증 스크립트 묶기
- Storybook build / docs build를 CI에 포함

## 반복 가능한 업무 템플릿

아래 순서를 하나의 표준 작업 단위로 볼 수 있습니다.

### 컴포넌트 작업 템플릿

1. 기존 프로젝트에서 동일 역할 UI 찾기
2. 구조/props/상태/스타일 차이 분석
3. 디자인시스템 구조 원칙에 맞게 설계
4. 컴포넌트 구현
5. 접근성 개선
6. Storybook 기본 스토리 추가
7. 실서비스 예시 스토리 추가
8. Docs/Usage 문서 추가
9. migration notes 기록
10. typecheck/build/lint 검증

### 실사용 가능성 검토 템플릿

1. 프로젝트 파일 경로 수집
2. props 비교
3. 스타일 구조 비교
4. 교체 가능성 판정
5. 개선 포인트 추출
6. Storybook 재현 예시 생성
7. md 기록 남기기

### 접근성 개선 템플릿

1. 키보드 사용성 확인
2. focus 이동/복귀 확인
3. aria 속성 확인
4. 버튼/입력의 상태 전달 확인
5. Storybook a11y 검증

## 자동화 가치가 큰 업무 우선순위

### 우선순위 1

- 새 컴포넌트 생성 템플릿
- Storybook 기본 스토리 생성
- Usage MDX 생성

### 우선순위 2

- 실제 프로젝트 대조 리포트 생성
- migration notes 생성
- 파일 경로 자동 수집

### 우선순위 3

- 접근성 체크리스트 자동 생성
- 디자인시스템 구조 준수 체크
- Storybook 실서비스 예시 생성 보조

## 결론

지금까지의 작업 패턴을 정리하면,
NudgeEAP 디자인시스템에서 자동화해야 하는 핵심은 "컴포넌트 생성" 하나가 아닙니다.

실제로는 아래 전체 흐름을 자동화해야 합니다.

```text
기존 코드 탐색
-> 구조 분석
-> 디자인시스템 구조 설계
-> 컴포넌트 구현
-> 접근성 개선
-> Storybook 기본 예시
-> Storybook 실서비스 예시
-> Docs 작성
-> Migration 문서화
-> 검증
```

즉, 자동화의 목표는
"빠르게 만든다"보다
"실제로 쓸 수 있는 상태까지 반복 가능하게 만든다"에 가깝습니다.
