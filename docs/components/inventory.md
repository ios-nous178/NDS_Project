---
sidebar_position: 1
title: 컴포넌트 인벤토리
---

<!-- AUTO-GENERATED FILE. Run `pnpm generate:component-inventory` after updating metadata/componentInventory.json. -->

# 컴포넌트 인벤토리

이 문서는 `metadata/componentInventory.json`을 기준으로 자동 생성됩니다.
기획자, 디자이너, 개발자가 같은 기준으로 Figma, Storybook, 구현 상태를 확인할 수 있도록 만든 연결표입니다.

메타데이터에 Figma 링크를 넣으면 이 문서와 Storybook Docs에 함께 반영됩니다.

## 일반

| 컴포넌트   | 설명                                                                             | 상태      | Figma                                                                                                    | Storybook                                                         | Docs                                                 | 활용 범위                                          |
| ---------- | -------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------- |
| **Button** | 클릭 액션과 CTA를 위한 기본 버튼 컴포넌트                                        | ✅ 구현됨 | [열기](https://www.figma.com/design/NUDGE-DS-EXAMPLE/NudgeEAP-Design-System?node-id=508-6962) (508:6962) | [열기](http://localhost:6006/?path=/docs/components-button--docs) | [열기](http://localhost:3001/docs/components/button) | 기본 CTA, 보조 액션, 필드 버튼                     |
| **Badge**  | 상태, 카테고리, 라벨을 짧게 표시하는 배지                                        | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-badge--docs)  | [열기](http://localhost:3001/docs/components/badge)  | 상태 표시, 카테고리 태그, 보조 라벨                |
| **Card**   | 범용 카드 프리미티브. 썸네일, 헤더, 바디, 푸터 슬롯을 제공하는 레이아웃 컴포넌트 | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-card--docs)   | [열기](http://localhost:3001/docs/components/card)   | 상담사 카드, 프로그램 카드, 콘텐츠 카드, 안내 카드 |

- **Button**: Figma 컴포넌트 세트 링크를 연결하면 Storybook Docs와 인벤토리 문서에 자동 반영됩니다.
- **Badge**: 색상 variant와 사용 목적을 Figma nomenclature와 맞춰두면 관리가 쉬워집니다.
- **Card**: CounselorCard 등 도메인 카드의 프리미티브. 도메인 의존 레시피는 프로젝트별로 조합합니다.

## 입력

| 컴포넌트        | 설명                                                                                                | 상태      | Figma                                                                                                    | Storybook                                                                 | Docs                                                         | 활용 범위                                                   |
| --------------- | --------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------- |
| **Input**       | 텍스트 입력, 검색, 인증 플로우를 다룰 수 있는 입력 필드                                             | ✅ 구현됨 | [열기](https://www.figma.com/design/NUDGE-DS-EXAMPLE/NudgeEAP-Design-System?node-id=430-4212) (430:4212) | [열기](http://localhost:6006/?path=/docs/components-input--docs)          | [열기](http://localhost:3001/docs/components/input)          | 기본 입력, 검색 필드, 인증번호 입력, 액션 버튼 결합 행      |
| **SearchInput** | 검색 전용 입력 필드. 검색 아이콘, 클리어 버튼, Enter 검색을 기본 지원하며 outlined/filled 변형 제공 | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-searchinput--docs)    | [열기](http://localhost:3001/docs/components/search-input)   | 홈페이지 검색바, 웹뷰 검색박스, 센터/주소 검색, 콘텐츠 검색 |
| **Select**      | 드롭다운 선택 컴포넌트. Portal 기반 드롭다운, 외부 클릭/스크롤 자동 닫힘, 라벨/에러 지원            | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-select--docs)         | [열기](http://localhost:3001/docs/components/select)         | 상담 유형 선택, 필터 드롭다운, 가입 폼 선택 항목            |
| **Checkbox**    | 체크박스와 라디오 버튼. 네이티브 input 위에 커스텀 인디케이터, Group 레이아웃 지원                  | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-checkbox-radio--docs) | [열기](http://localhost:3001/docs/components/checkbox-radio) | 동의 체크, 옵션 선택, 상담 방식 선택, 필터 체크             |
| **Chip**        | 선택/삭제 가능한 태그 컴포넌트. outlined/filled/soft 변형, 3가지 크기 지원                          | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-chip--docs)           | [열기](http://localhost:3001/docs/components/chip)           | 필터 태그, 카테고리 선택, 상담 주제 선택, 키워드 태그       |

- **Input**: 검색형, 인증형처럼 화면 패턴별 Figma 링크를 붙이면 기획/디자인 협업에 특히 유용합니다.
- **SearchInput**: HomePage SearchInput, WebView EapHomeSearchBox 패턴을 통합한 컴포넌트입니다.
- **Select**: WebView FilterSelect, HomePage SelectItem 패턴을 통합한 컴포넌트입니다.
- **Checkbox**: Checkbox, Radio, CheckboxGroup, RadioGroup, RadioGroupItem을 포함합니다.
- **Chip**: WebView FilterChip, HomePage CounselorSubjectChip 패턴을 통합한 컴포넌트입니다.

## 오버레이

| 컴포넌트        | 설명                                                                                   | 상태      | Figma                                                                                                      | Storybook                                                              | Docs                                                       | 활용 범위                                                 |
| --------------- | -------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------- |
| **Modal**       | 확장 가능한 구조와 접근성을 갖춘 대화형 모달                                           | ✅ 구현됨 | [열기](https://www.figma.com/design/NUDGE-DS-EXAMPLE/NudgeEAP-Design-System?node-id=612-18421) (612:18421) | [열기](http://localhost:6006/?path=/docs/components-modal--docs)       | [열기](http://localhost:3001/docs/components/modal)        | 확인 모달, 커스텀 콘텐츠 모달, 실서비스 마이그레이션 예시 |
| **Popup**       | 확인/취소 플로우에 맞는 alertdialog 기반 팝업                                          | ✅ 구현됨 | [열기](https://www.figma.com/design/NUDGE-DS-EXAMPLE/NudgeEAP-Design-System?node-id=612-18903) (612:18903) | [열기](http://localhost:6006/?path=/docs/components-popup--docs)       | [열기](http://localhost:3001/docs/components/popup)        | 확인/취소 팝업, 완료 안내 팝업, 리워드 안내               |
| **BottomSheet** | 화면 하단에서 올라오는 모바일 오버레이. 드래그 핸들, 포커스 트랩, 닫기 애니메이션 내장 | ✅ 구현됨 | 연결 필요                                                                                                  | [열기](http://localhost:6006/?path=/docs/components-bottomsheet--docs) | [열기](http://localhost:3001/docs/components/bottom-sheet) | 옵션 선택, 필터, 상담 유형 선택, 모바일 액션 시트         |

- **Modal**: 실서비스에 대응하는 Figma frame 또는 component set 링크를 연결하면 migration notes와 함께 보기 좋습니다.
- **Popup**: Alert/Confirm 계열 기획 화면과 Figma variant를 연결해두면 상태 누락 점검이 쉬워집니다.
- **BottomSheet**: WebView BottomSheet/ModalSheetBottom 패턴을 Modal과 동일한 접근성 수준으로 재구현한 컴포넌트입니다.

## 내비게이션

| 컴포넌트 | 설명                                                            | 상태      | Figma     | Storybook                                                       | Docs                                               | 활용 범위                                    |
| -------- | --------------------------------------------------------------- | --------- | --------- | --------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------- |
| **Tabs** | 탭 내비게이션. line/pill/square 변형과 슬라이딩 인디케이터 지원 | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-tabs--docs) | [열기](http://localhost:3001/docs/components/tabs) | 카테고리 전환, 검색 탭, 콘텐츠 분류, 필터 탭 |

- **Tabs**: WebView SlideTab(LINE/PILL/SQUARE/CIRCLE/CHALLENGE_SQUARE) 패턴을 통합한 컴포넌트입니다.

## 피드백

| 컴포넌트       | 설명                                                                           | 상태      | Figma     | Storybook                                                             | Docs                                                      | 활용 범위                                          |
| -------------- | ------------------------------------------------------------------------------ | --------- | --------- | --------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------- |
| **Toast**      | 일시적 피드백 메시지. Provider 기반 + 명령형 API, 4가지 variant 지원           | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-toast--docs)      | [열기](http://localhost:3001/docs/components/toast)       | 저장 완료, 에러 알림, 정보 안내, 액션 되돌리기     |
| **EmptyState** | 빈 상태 화면. 아이콘, 제목, 설명, 액션 슬롯을 지원하는 빈 콘텐츠 표시 컴포넌트 | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-emptystate--docs) | [열기](http://localhost:3001/docs/components/empty-state) | 빈 리스트, 검색 결과 없음, 에러 상태, 첫 사용 안내 |

- **Toast**: WebView Toast.alert 패턴을 React Context 기반으로 재구현한 컴포넌트입니다.
- **EmptyState**: HomePage EmptyContent, WebView NoneEmpty/NoneList/NoneError 패턴을 통합한 컴포넌트입니다.

## 레이아웃

| 컴포넌트           | 설명                                                                  | 상태      | Figma     | Storybook                                                                 | Docs                                                           | 활용 범위                                               |
| ------------------ | --------------------------------------------------------------------- | --------- | --------- | ------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------- |
| **FieldActionRow** | 입력 + 버튼 조합 레이아웃. 인증번호 입력, 타이머, 에러/성공 상태 지원 | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-fieldactionrow--docs) | [열기](http://localhost:3001/docs/components/field-action-row) | 휴대폰 인증, 인증번호 확인, 이메일 인증, 쿠폰 코드 입력 |

- **FieldActionRow**: SignUpPhoneInput, SignUpSMSCodeInput, FormPhoneVerifyInput 패턴을 통합한 레이아웃 컴포넌트입니다.
