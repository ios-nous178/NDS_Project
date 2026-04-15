# Modal Migration Notes

이 문서는 NudgeEAP 디자인시스템의 `Modal`을 실제 서비스 프로젝트에 적용하기 위해
검토했던 대상 파일과 교체 가능성, 대응 전략을 기록한 문서입니다.

목적은 아래 3가지입니다.

1. 어떤 실제 프로젝트 파일을 기준으로 대조했는지 남기기
2. 어떤 모달은 바로 옮길 수 있고, 어떤 모달은 추가 작업이 필요한지 정리하기
3. Storybook 예제와 실제 프로젝트 파일의 연결 고리를 남기기

## 기준 컴포넌트

- 디자인시스템 Modal:
  - `NudgeEAPDesignSystem/packages/react/src/Modal.tsx`

## 실제 프로젝트에서 확인한 파일

### Homepage

- 기본 모달
  - `NudgeEAPHomePage/src/app/components/Modal.tsx`
- 앱 다운로드 모달
  - `NudgeEAPHomePage/src/app/(primary)/service/components/CounselingAppDownloadModal.tsx`
- 상담 프로필 영역 모달 조합
  - `NudgeEAPHomePage/src/app/(primary)/service/search/partner/profile/components/BaseCounselingModal.tsx`

### Webview

- 기본 모달
  - `NudgeEAPWebview/src/app.component/modal/Modal.tsx`
- 플레이리스트 수정 모달
  - `NudgeEAPWebview/src/app.feature/sound/component/playlist/PlaylistEditModal.tsx`
- 참여 코드 모달
  - `NudgeEAPWebview/src/app.feature/challenge/component/ParticipationCodeModal.tsx`
- 모달 DOM 진입점
  - `NudgeEAPWebview/src/app.component/modal/module/ModalDom.tsx`
- 참여 보상 모달 콘텐츠
  - `NudgeEAPWebview/src/app.feature/challenge/detail/component/reward/ParticipateRewardModalContent.tsx`

## 실제로 대조한 핵심 케이스

### 1. Webview PlaylistEditModal

대상 파일:

- `NudgeEAPWebview/src/app.feature/sound/component/playlist/PlaylistEditModal.tsx`

확인 포인트:

- `styled(Modal)` 패턴 사용
- 내부 `.modal-content`, `.modal-content-footer` 같은 구조에 의존
- 입력창과 하단 버튼 2개가 있는 커스텀 바디 레이아웃

결론:

- 초기 디자인시스템 Modal 구조로는 바로 교체 불가
- 이유는 `styled-components`가 내부 슬롯을 안정적으로 제어할 수 없었기 때문
- 이후 디자인시스템 Modal에 아래를 추가하면서 교체 가능성 확보
  - `className`
  - 슬롯별 `className`
  - `slotProps`
  - `data-slot`
  - CSS 변수 기반 기본 스타일

Storybook 대응 예제:

- `Components/Modal > WebView Playlist Edit UI`
- `Components/Modal > WebView Playlist Edit With Slot Props`
- `Components/Modal > WebView Playlist Edit With Class Names`
- `Guides/Modal Usage`

### 2. Homepage CounselingAppDownloadModal

대상 파일:

- `NudgeEAPHomePage/src/app/(primary)/service/components/CounselingAppDownloadModal.tsx`

확인 포인트:

- 기본 본문 텍스트 + 하단 CTA 1개 구조
- footer를 통째로 커스텀해서 사용
- 프로젝트에서는 가운데 정렬된 CTA처럼 보이지만,
  디자인시스템에서는 `fullWidth` CTA로도 표현 가능

결론:

- 디자인시스템 Modal로 비교적 쉽게 이전 가능한 케이스
- 다만 custom footer에 `fullWidth` 버튼이 들어갈 때,
  footer 레이아웃 계산이 안전해야 함

실제 수정 메모:

- 디자인시스템 `Modal.Footer` custom layout에 `box-sizing: border-box` 추가
- custom footer 자식에 `min-width: 0` 추가
- 이 수정으로 full width 버튼이 잘리는 현상 방지

Storybook 대응 예제:

- `Components/Modal > Homepage Counseling App Download`

### 3. Webview Participate Reward Modal

대상 파일:

- `NudgeEAPWebview/src/app.component/modal/module/ModalDom.tsx`
- `NudgeEAPWebview/src/app.feature/challenge/detail/component/reward/ParticipateRewardModalContent.tsx`

확인 포인트:

- title + description + 목록형 콘텐츠 + confirm/cancel 버튼 조합
- 실제 서비스에서는 쿠폰/리워드 목록 같은 데이터가 모달 안에 들어감

결론:

- 디자인시스템 flat modal 또는 popup 계열로 충분히 모델링 가능
- 리스트형 본문과 CTA 버튼 구성을 Storybook에 먼저 올려서 시각 검증 가능

Storybook 대응 예제:

- `Components/Modal > Webview Participate Reward`
- `Components/Popup > Reward Guide Example`

## 교체 가능성 요약

### 바로 적용해보기 좋은 케이스

- `CounselingAppDownloadModal`
- 본문이 단순한 confirm / alert / complete 계열 모달
- title / description / button group 중심 모달

### 확장 구조가 필요한 케이스

- `PlaylistEditModal`
- 내부 입력 폼, 커스텀 footer, 프로젝트별 세부 spacing 조정이 많은 모달
- `styled(Modal)` 또는 슬롯별 class 제어가 필요한 모달

### 추가 설계가 더 필요한 케이스

- `ModalDom`처럼 동적 렌더링으로 여는 전역 모달 시스템
- close animation, root mount/unmount 타이밍, 포털 전략까지 맞춰야 하는 케이스

## 이번 작업으로 확보된 것

디자인시스템 Modal은 현재 아래 방향으로 확장되었습니다.

- flat API 지원
- compound API 지원
- 루트 및 슬롯별 `className`
- 슬롯별 `slotProps`
- `data-slot`
- CSS 변수 기반 기본 스타일
- 키보드 접근성
- custom footer 레이아웃 안정화

즉, 이 문서에 적힌 실제 프로젝트 모달들을 기준으로
"Storybook에서 먼저 구조를 재현하고, 이후 프로젝트에 점진 적용" 하는 흐름이 가능해졌습니다.

## 추천 마이그레이션 순서

1. `CounselingAppDownloadModal` 같은 단순 구조부터 시범 적용
2. `PlaylistEditModal`처럼 프로젝트 커스터마이징이 많은 모달은 `slotProps/className` 패턴으로 이전
3. `ModalDom` 계열은 마지막에 전역 열기 API까지 포함해 설계

## 참고

스타일 확장 구조 원칙은 아래 문서를 함께 봅니다.

- `NudgeEAPDesignSystem/docs/STYLING_STRUCTURE_GUIDE.md`
