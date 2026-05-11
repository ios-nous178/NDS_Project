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

| 컴포넌트            | 설명                                                                                                  | 상태      | Figma                                                                                                    | Storybook                                                                  | Docs                                                           | 활용 범위                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------- |
| **Button**          | 클릭 액션과 CTA를 위한 기본 버튼 컴포넌트                                                             | ✅ 구현됨 | [열기](https://www.figma.com/design/NUDGE-DS-EXAMPLE/NudgeEAP-Design-System?node-id=508-6962) (508:6962) | [열기](http://localhost:6006/?path=/docs/components-button--docs)          | [열기](http://localhost:3001/docs/components/button)           | 기본 CTA, 보조 액션, 필드 버튼                             |
| **Badge**           | 상태, 카테고리, 라벨을 짧게 표시하는 배지                                                             | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-badge--docs)           | [열기](http://localhost:3001/docs/components/badge)            | 상태 표시, 카테고리 태그, 보조 라벨                        |
| **Card**            | 범용 카드 프리미티브. 썸네일, 헤더, 바디, 푸터 슬롯을 제공하는 레이아웃 컴포넌트                      | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-card--docs)            | [열기](http://localhost:3001/docs/components/card)             | 상담사 카드, 프로그램 카드, 콘텐츠 카드, 안내 카드         |
| **Carousel**        | 가로 스와이프 슬라이더. drag, autoplay, loop, dots/counter 인디케이터 지원                            | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-carousel--docs)        | [열기](http://localhost:3001/docs/components/carousel)         | 홈 배너, 콘텐츠 추천, 이미지 갤러리, 온보딩 슬라이드       |
| **VideoPlayer**     | HTML5 video 래퍼. 포스터, 커스텀 컨트롤, 비율 조정 지원                                               | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-videoplayer--docs)     | [열기](http://localhost:3001/docs/components/video-player)     | 명상 영상, 상담 안내 영상, 콘텐츠 큐레이션                 |
| **FAB**             | Floating Action Button. 화면 하단 떠 있는 주요 액션. md/lg, primary/secondary/neutral, fixed 위치 4종 | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-fab--docs)             | [열기](http://localhost:3001/docs/components/fab)              | 일기 새로 작성, 감정 기록 추가, 빠른 만들기 액션           |
| **Sparkline**       | 미니 추이 차트 (line/area/bar). 축/레이블 없는 카드용 시각 신호                                       | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-sparkline--docs)       | [열기](http://localhost:3001/docs/components/sparkline)        | 메트릭 카드 추이, 리스트 트렌드, 대시보드 신호             |
| **ExpandableText**  | 긴 텍스트 줄 수 클램프 + 더보기/접기 자동 토글                                                        | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-expandabletext--docs)  | [열기](http://localhost:3001/docs/components/expandable-text)  | 일기 미리보기, 콘텐츠 설명, 약관 미리보기, 리뷰            |
| **StatCard**        | 메트릭 강조 카드. 라벨 + 큰 숫자/단위 + delta + Sparkline 슬롯                                        | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-statcard--docs)        | [열기](http://localhost:3001/docs/components/stat-card)        | 대시보드 메트릭 그리드, 리포트 요약 카드, 디테일 핵심 지표 |
| **AvatarGroup**     | 여러 아바타 겹침 표시 + 초과 +N. 5개 size, overlap 자동                                               | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-avatargroup--docs)     | [열기](http://localhost:3001/docs/components/avatar-group)     | 단체 상담 참여자, 챌린지 참가자, 팀/가족 표시              |
| **OnlineIndicator** | presence 점 (online/away/busy/offline). online은 자동 펄스                                            | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-onlineindicator--docs) | [열기](http://localhost:3001/docs/components/online-indicator) | 상담사 리스트 상태, 아바타 우하단 점, 그룹 채팅 참가자     |
| **ReactionPicker**  | 이모지 반응 칩 그룹. 다중/단일 선택, 카운트 표시 옵션                                                 | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-reactionpicker--docs)  | [열기](http://localhost:3001/docs/components/reaction-picker)  | 콘텐츠 좋아요/공감, 일기 반응, 챌린지 게시판               |
| **LikeButton**      | 좋아요 토글 + 카운트. 펑 애니메이션, 1000+ 자동 K 변환                                                | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-likebutton--docs)      | [열기](http://localhost:3001/docs/components/like-button)      | 콘텐츠/일기/댓글 단일 좋아요, 게시물 푸터                  |
| **PriceTag**        | 가격 + 할인율 + 원가 표시. 무료/유료 자동, 천 단위 콤마                                               | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-pricetag--docs)        | [열기](http://localhost:3001/docs/components/price-tag)        | 상품/콘텐츠/구독 가격, 결제 합계, 쿠폰 결과                |
| **StatusTimeline**  | 단계 진행 트래커. 가로/세로, current 기준 done/current/todo 자동 색                                   | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-statustimeline--docs)  | [열기](http://localhost:3001/docs/components/status-timeline)  | 배송 추적, 상담 진행, 신청 처리                            |

- **Button**: Figma 컴포넌트 세트 링크를 연결하면 Storybook Docs와 인벤토리 문서에 자동 반영됩니다. 화살표 CTA는 대표 전진 액션 1개에만 사용합니다.
- **Badge**: 색상 variant와 사용 목적을 Figma nomenclature와 맞춰두면 관리가 쉬워집니다. 장식성 섹션 라벨로 반복하지 않습니다.
- **Card**: CounselorCard 등 도메인 카드의 프리미티브. 도메인 의존 레시피는 프로젝트별로 조합합니다.
- **Carousel**: 포인터/터치 드래그 + 자동 재생을 한 컴포넌트로 통합.
- **VideoPlayer**: AudioPlayer의 영상 버전. 라이브 스트리밍/HLS는 별도 라이브러리 필요.
- **FAB**: 한 화면에 1개. StickyBottom CTA와 동시 사용 금지.
- **Sparkline**: 본격 차트 아님. 50+ 포인트는 부적합. baseline은 음수 데이터일 때만.
- **ExpandableText**: line-height 기반 측정. JournalEntry는 자체 클램프 있음 — 중첩 금지.
- **StatCard**: trend(up/down/flat)에 따라 delta 배지 색 자동. trailing 슬롯에 Sparkline 결합.
- **AvatarGroup**: Avatar 단독은 그대로 사용. AvatarGroup은 N명 ≥ 2 케이스.
- **OnlineIndicator**: online은 자동 펄스 — 별도 강조 효과 추가 X.
- **ReactionPicker**: value는 항상 string[] (single도 길이 0~1).
- **LikeButton**: ReactionPicker(여러 이모지)와 분리. controlled.
- **PriceTag**: amount+originalAmount 둘 다 number일 때 할인율 자동. prefix/unit 하나만 쓸 것.
- **StatusTimeline**: ActivityTimeline(자유 로그)과 분리. 정해진 선형 단계용.

## 입력

| 컴포넌트          | 설명                                                                                                | 상태      | Figma                                                                                                    | Storybook                                                                 | Docs                                                         | 활용 범위                                                    |
| ----------------- | --------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Input**         | 텍스트 입력, 검색, 인증 플로우를 다룰 수 있는 입력 필드                                             | ✅ 구현됨 | [열기](https://www.figma.com/design/NUDGE-DS-EXAMPLE/NudgeEAP-Design-System?node-id=430-4212) (430:4212) | [열기](http://localhost:6006/?path=/docs/components-input--docs)          | [열기](http://localhost:3001/docs/components/input)          | 기본 입력, 검색 필드, 인증번호 입력, 액션 버튼 결합 행       |
| **SearchInput**   | 검색 전용 입력 필드. 검색 아이콘, 클리어 버튼, Enter 검색을 기본 지원하며 outlined/filled 변형 제공 | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-searchinput--docs)    | [열기](http://localhost:3001/docs/components/search-input)   | 홈페이지 검색바, 웹뷰 검색박스, 센터/주소 검색, 콘텐츠 검색  |
| **Select**        | 드롭다운 선택 컴포넌트. Portal 기반 드롭다운, 외부 클릭/스크롤 자동 닫힘, 라벨/에러 지원            | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-select--docs)         | [열기](http://localhost:3001/docs/components/select)         | 상담 유형 선택, 필터 드롭다운, 가입 폼 선택 항목             |
| **Checkbox**      | 체크박스와 라디오 버튼. 네이티브 input 위에 커스텀 인디케이터, Group 레이아웃 지원                  | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-checkbox-radio--docs) | [열기](http://localhost:3001/docs/components/checkbox-radio) | 동의 체크, 옵션 선택, 상담 방식 선택, 필터 체크              |
| **Chip**          | 선택/삭제 가능한 태그 컴포넌트. outlined/filled/soft 변형, 3가지 크기 지원                          | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-chip--docs)           | [열기](http://localhost:3001/docs/components/chip)           | 필터 태그, 카테고리 선택, 상담 주제 선택, 키워드 태그        |
| **Calendar**      | 인라인 월간 캘린더 그리드. 날짜 선택, 마커, 비활성 날짜 처리 지원                                   | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-calendar--docs)       | [열기](http://localhost:3001/docs/components/calendar)       | 상담 예약, 감정 캘린더, 복약 캘린더, 일정 뷰                 |
| **NumberStepper** | 수량 조절 +/- 버튼 입력. min/max 자동 비활성, 단위 표시, 직접 타이핑 옵션                           | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-numberstepper--docs)  | [열기](http://localhost:3001/docs/components/number-stepper) | 복약 횟수, 챌린지 목표, 알림 빈도, 수량 입력                 |
| **Autocomplete**  | 입력값 기반 자동완성 드롭다운. 키보드 네비게이션, 매칭 하이라이트, 로딩/빈 상태                     | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-autocomplete--docs)   | [열기](http://localhost:3001/docs/components/autocomplete)   | 약 검색, 시설 검색, 키워드 추천                              |
| **SelectionCard** | 카드형 단일/다중 선택지. RadioCard/CheckboxCard 통합. Compound API.                                 | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-selectioncard--docs)  | [열기](http://localhost:3001/docs/components/selection-card) | 설문 선택지, 가입 플랜, 상담 방식, 관심사 선택               |
| **PhoneInput**    | 국가 다이얼 코드 + 휴대폰 번호 입력. ISO code 관리, 5개국 기본 지원                                 | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-phoneinput--docs)     | [열기](http://localhost:3001/docs/components/phone-input)    | 가입/본인 인증, 프로필 연락처, EAP 가입                      |
| **SignaturePad**  | 전자 서명 캔버스. ref로 clear/toDataURL/isEmpty 제어, PNG dataURL 추출                              | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-signaturepad--docs)   | [열기](http://localhost:3001/docs/components/signature-pad)  | EAP 가입 동의서, 상담 시작 동의, 의료/법적 동의 서명         |
| **TagInput**      | 태그 자유 입력. Enter/쉼표로 추가, Backspace로 삭제, maxTags 제한                                   | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-taginput--docs)       | [열기](http://localhost:3001/docs/components/tag-input)      | 관심사/키워드 입력, 일기 태그, 알림 키워드 등록              |
| **PinPad**        | PIN 키패드. 점 인디케이터 + 숫자 그리드, 셔플 옵션, 에러 흔들림                                     | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-pinpad--docs)         | [열기](http://localhost:3001/docs/components/pin-pad)        | 앱 진입 PIN, 간편 결제 비밀번호, 보안 키패드                 |
| **TimePicker**    | 시간만 선택 (HH:mm). step/min/max, 에러/헬퍼 지원                                                   | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-timepicker--docs)     | [열기](http://localhost:3001/docs/components/time-picker)    | 알림 시각, 복약 시간, 상담 슬롯 시작                         |
| **AddressSearch** | 주소 검색 + 상세 주소 입력. 외부 API 결과를 results로 받는 패턴                                     | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-addresssearch--docs)  | [열기](http://localhost:3001/docs/components/address-search) | 회원가입 주소, 배송 주소, 방문 상담 주소                     |
| **ImageCropper**  | 이미지 자르기 (원형/사각형). 드래그+줌, ref.toDataURL() PNG 추출                                    | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-imagecropper--docs)   | [열기](http://localhost:3001/docs/components/image-cropper)  | 프로필 사진 등록, 커버 이미지 자르기                         |
| **MentionInput**  | @멘션 자동완성 입력. 트리거 커스텀(#도 가능), 키보드 ↓↑/Enter/Esc                                   | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-mentioninput--docs)   | [열기](http://localhost:3001/docs/components/mention-input)  | 단체 상담 댓글, 그룹 채팅, 노트/일기 멘션, 해시태그 자동완성 |
| **AmountInput**   | 큰 금액 입력. 자동 천 단위 콤마, presets, max/min 클램프                                            | ✅ 구현됨 | 연결 필요                                                                                                | [열기](http://localhost:6006/?path=/docs/components-amountinput--docs)    | [열기](http://localhost:3001/docs/components/amount-input)   | 송금/결제, 후원/응원, 충전 금액                              |

- **Input**: 검색형, 인증형처럼 화면 패턴별 Figma 링크를 붙이면 기획/디자인 협업에 특히 유용합니다.
- **SearchInput**: HomePage SearchInput, WebView EapHomeSearchBox 패턴을 통합한 컴포넌트입니다.
- **Select**: WebView FilterSelect, HomePage SelectItem 패턴을 통합한 컴포넌트입니다. 옵션 15개 초과는 검색 가능 UI를 검토합니다.
- **Checkbox**: Checkbox, Radio, CheckboxGroup, RadioGroup, RadioGroupItem을 포함합니다.
- **Chip**: WebView FilterChip, HomePage CounselorSubjectChip 패턴을 통합한 컴포넌트입니다. 상태/분류/짧은 속성 표시용이며 안내문/섹션 장식으로 남발하지 않습니다.
- **Calendar**: DatePicker(popover 입력)와 분리. 캘린더 자체가 콘텐츠인 화면용.
- **NumberStepper**: Stepper(과정 인디케이터)와 다름. 작은 정수 값 조절 전용.
- **Autocomplete**: options는 외부 필터링 결과 — 비동기 검색 케이스를 1차 고려한 설계.
- **SelectionCard**: 단순 라벨만 있는 선택은 Radio/Checkbox 사용. SelectionCard는 카드 단위 의미 있는 선택지용.
- **PhoneInput**: ISO code(KR/US/...)로 state 관리. countries prop으로 국가 커스텀.
- **SignaturePad**: 터치 디바이스 호환. ref로 제출 시점에만 dataURL 추출 권장.
- **TagInput**: # 접두는 자동. 정해진 옵션은 SelectionCard 또는 Chip 토글 사용.
- **PinPad**: OtpInput과 분리. shuffleSeed는 useMemo로 고정.
- **TimePicker**: step은 초 단위 (5분=300). 슬롯 목록 선택은 TimeSlotPicker.
- **AddressSearch**: 검색 자체는 외부 API. value = 주소 + 상세 한 묶음.
- **ImageCropper**: 외부 이미지는 CORS 필요. outputSize 200~400 권장.
- **MentionInput**: users는 전체 목록(컴포넌트가 자동 필터). 텍스트는 plain — ID 보존은 외부 파싱.
- **AmountInput**: value=number|null (빈 입력은 null). NumberStepper(작은 정수)와 분리.

## 오버레이

| 컴포넌트        | 설명                                                                                   | 상태      | Figma                                                                                                      | Storybook                                                              | Docs                                                       | 활용 범위                                                 |
| --------------- | -------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------- |
| **Modal**       | 확장 가능한 구조와 접근성을 갖춘 대화형 모달                                           | ✅ 구현됨 | [열기](https://www.figma.com/design/NUDGE-DS-EXAMPLE/NudgeEAP-Design-System?node-id=612-18421) (612:18421) | [열기](http://localhost:6006/?path=/docs/components-modal--docs)       | [열기](http://localhost:3001/docs/components/modal)        | 확인 모달, 커스텀 콘텐츠 모달, 실서비스 마이그레이션 예시 |
| **Popup**       | 확인/취소 플로우에 맞는 alertdialog 기반 팝업                                          | ✅ 구현됨 | [열기](https://www.figma.com/design/NUDGE-DS-EXAMPLE/NudgeEAP-Design-System?node-id=612-18903) (612:18903) | [열기](http://localhost:6006/?path=/docs/components-popup--docs)       | [열기](http://localhost:3001/docs/components/popup)        | 확인/취소 팝업, 완료 안내 팝업, 리워드 안내               |
| **BottomSheet** | 화면 하단에서 올라오는 모바일 오버레이. 드래그 핸들, 포커스 트랩, 닫기 애니메이션 내장 | ✅ 구현됨 | 연결 필요                                                                                                  | [열기](http://localhost:6006/?path=/docs/components-bottomsheet--docs) | [열기](http://localhost:3001/docs/components/bottom-sheet) | 옵션 선택, 필터, 상담 유형 선택, 모바일 액션 시트         |
| **CoachMark**   | 온보딩 dim 툴팁. 특정 영역 강조 + 단계별 안내, placement 4방향                         | ✅ 구현됨 | 연결 필요                                                                                                  | [열기](http://localhost:6006/?path=/docs/components-coachmark--docs)   | [열기](http://localhost:3001/docs/components/coach-mark)   | 첫 진입 온보딩, 새 기능 출시 안내, 도움말 재생            |
| **Lightbox**    | 이미지 풀스크린 확대 모달. 키보드 네비, 좌우 버튼, 카운터, 캡션                        | ✅ 구현됨 | 연결 필요                                                                                                  | [열기](http://localhost:6006/?path=/docs/components-lightbox--docs)    | [열기](http://localhost:3001/docs/components/lightbox)     | 일기 사진 확대, 콘텐츠 이미지 갤러리, 검사 결과 이미지    |
| **ShareSheet**  | BottomSheet 형태 공유 모달. 4칸 그리드 + 링크 복사                                     | ✅ 구현됨 | 연결 필요                                                                                                  | [열기](http://localhost:6006/?path=/docs/components-sharesheet--docs)  | [열기](http://localhost:3001/docs/components/share-sheet)  | 콘텐츠/검사/일기 공유, 챌린지 인증, 추천인 링크           |

- **Modal**: 실서비스에 대응하는 Figma frame 또는 component set 링크를 연결하면 migration notes와 함께 보기 좋습니다.
- **Popup**: Alert/Confirm 계열 기획 화면과 Figma variant를 연결해두면 상태 누락 점검이 쉬워집니다.
- **BottomSheet**: WebView BottomSheet/ModalSheetBottom 패턴을 Modal과 동일한 접근성 수준으로 재구현한 컴포넌트입니다.
- **CoachMark**: Tooltip과 분리 (가벼운 hover용). selector 또는 element-getter로 target 지정.
- **Lightbox**: body 스크롤 잠금 자동. 1장이면 네비 자동 숨김.
- **ShareSheet**: 외부 SDK(카카오/SMS)는 targets onClick에서 직접 호출. clipboard는 HTTPS 필요.

## 내비게이션

| 컴포넌트      | 설명                                                            | 상태      | Figma     | Storybook                                                            | Docs                                                     | 활용 범위                                        |
| ------------- | --------------------------------------------------------------- | --------- | --------- | -------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------ |
| **Tabs**      | 탭 내비게이션. line/pill/square 변형과 슬라이딩 인디케이터 지원 | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-tabs--docs)      | [열기](http://localhost:3001/docs/components/tabs)       | 카테고리 전환, 검색 탭, 콘텐츠 분류, 필터 탭     |
| **FilterBar** | 가로 필터 칩 그룹. 다중/단일 선택, 카운트, 자동 초기화 버튼     | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-filterbar--docs) | [열기](http://localhost:3001/docs/components/filter-bar) | 콘텐츠/상품/상담사 리스트 필터, 검색 결과 필터링 |

- **Tabs**: WebView SlideTab(LINE/PILL/SQUARE/CIRCLE/CHALLENGE_SQUARE) 패턴을 통합한 컴포넌트입니다.
- **FilterBar**: Tabs(뷰 전환)과 분리. single은 다시 누르면 해제됨.

## 피드백

| 컴포넌트             | 설명                                                                            | 상태      | Figma     | Storybook                                                                   | Docs                                                            | 활용 범위                                          |
| -------------------- | ------------------------------------------------------------------------------- | --------- | --------- | --------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------- |
| **Toast**            | 일시적 피드백 메시지. Provider 기반 + 명령형 API, 4가지 variant 지원            | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-toast--docs)            | [열기](http://localhost:3001/docs/components/toast)             | 저장 완료, 에러 알림, 정보 안내, 액션 되돌리기     |
| **EmptyState**       | 빈 상태 화면. 아이콘, 제목, 설명, 액션 슬롯을 지원하는 빈 콘텐츠 표시 컴포넌트  | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-emptystate--docs)       | [열기](http://localhost:3001/docs/components/empty-state)       | 빈 리스트, 검색 결과 없음, 에러 상태, 첫 사용 안내 |
| **Snackbar**         | inline 알림. 액션(되돌리기), 닫기, 시맨틱 variant 지원. Toast와 분리된 컴포넌트 | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-snackbar--docs)         | [열기](http://localhost:3001/docs/components/snackbar)          | 되돌리기 메시지, 페이지 시스템 안내, 폼 결과 알림  |
| **CircularProgress** | 원형 진행도. value/max 비율, 라벨/캡션 커스텀, semantic 색상 지원               | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-circularprogress--docs) | [열기](http://localhost:3001/docs/components/circular-progress) | 일일 목표 달성률, 챌린지 진행, 업로드 진행도       |
| **NotificationItem** | 알림 리스트 한 건. kind 5종, 미읽음 점, 시간 라벨, 본문 2줄 클램프              | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-notificationitem--docs) | [열기](http://localhost:3001/docs/components/notification-item) | 알림 센터, 푸시 히스토리, 시스템 안내 리스트       |
| **CountdownTimer**   | 종료 시각까지 자동 카운트다운. 3가지 포맷, 임박 시 빨강 강조, onComplete/onTick | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-countdowntimer--docs)   | [열기](http://localhost:3001/docs/components/countdown-timer)   | 인증 만료, 라이브 시작까지, 챌린지/미션 마감       |
| **TipCard**          | 한 줄 인사이트/팁 카드. 4 tone, 라벨/제목/설명/액션, 카드 클릭                  | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-tipcard--docs)          | [열기](http://localhost:3001/docs/components/tip-card)          | 오늘의 팁, 새 콘텐츠 안내, 챌린지 완료 격려        |
| **Confetti**         | 축하 이펙트. canvas + RAF 기반, 색상/입자수/지속 커스텀                         | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-confetti--docs)         | [열기](http://localhost:3001/docs/components/confetti)          | 챌린지 완료, 첫 가입 환영, 검사 종료 (긍정 결과)   |

- **Toast**: WebView Toast.alert 패턴을 React Context 기반으로 재구현한 컴포넌트입니다.
- **EmptyState**: HomePage EmptyContent, WebView NoneEmpty/NoneList/NoneError 패턴을 통합한 컴포넌트입니다.
- **Snackbar**: Toast는 Provider+자동 dismiss, Snackbar는 직접 렌더링+사용자 제어.
- **CircularProgress**: ScoreGauge(단계 분류)와 분리, ProgressBar(가로)와 분리.
- **NotificationItem**: Toast/Snackbar와 분리. 알림 히스토리 한 건 표현용.
- **CountdownTimer**: endsAt은 useMemo로 고정. onComplete는 1회만 호출.
- **TipCard**: 위기는 CrisisCallout, 페이지 띠는 Banner. TipCard는 콘텐츠 안 카드.
- **Confetti**: active를 항상 true로 두지 말 것. onComplete에서 false 리셋.

## 레이아웃

| 컴포넌트            | 설명                                                                              | 상태      | Figma     | Storybook                                                                  | Docs                                                            | 활용 범위                                               |
| ------------------- | --------------------------------------------------------------------------------- | --------- | --------- | -------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------- |
| **FieldActionRow**  | 입력 + 버튼 조합 레이아웃. 인증번호 입력, 타이머, 에러/성공 상태 지원             | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-fieldactionrow--docs)  | [열기](http://localhost:3001/docs/components/field-action-row)  | 휴대폰 인증, 인증번호 확인, 이메일 인증, 쿠폰 코드 입력 |
| **MultiStepForm**   | 다단계 폼 컨테이너. 진행/검증/제출 관리, useMultiStepForm 훅 제공                 | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-multistepform--docs)   | [열기](http://localhost:3001/docs/components/multi-step-form)   | 회원가입, 본인 인증, 검사 단계, 챌린지 마법사           |
| **PageHeader**      | 페이지 단위 헤더. 제목 + 서브타이틀 + 뒤로가기 + 브레드크럼 + 액션 + 하단 탭 슬롯 | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-pageheader--docs)      | [열기](http://localhost:3001/docs/components/page-header)       | 디테일 화면 상단, 리스트 화면 헤더, 탭형 페이지         |
| **QuickActionGrid** | 홈 빠른 액션 그리드. 2/3/4칸, 아이콘 + 라벨 + 배지, iconBg 커스텀                 | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-quickactiongrid--docs) | [열기](http://localhost:3001/docs/components/quick-action-grid) | 홈 진입 메뉴, 마이페이지 빠른 메뉴                      |
| **PullToRefresh**   | 모바일 풀 투 리프레시. 최상단 당기면 onRefresh, Promise 자동 처리                 | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-pulltorefresh--docs)   | [열기](http://localhost:3001/docs/components/pull-to-refresh)   | 일기/콘텐츠 리스트 새로고침, 모바일 화면                |

- **FieldActionRow**: SignUpPhoneInput, SignUpSMSCodeInput, FormPhoneVerifyInput 패턴을 통합한 레이아웃 컴포넌트입니다.
- **MultiStepForm**: Stepper(인디케이터만)와 분리. canProceed 동기 boolean.
- **PageHeader**: AppBar(글로벌 네비)와 분리. onBack 지정 시 ← 자동 노출.
- **QuickActionGrid**: 4칸이 기본 균형. 5칸 배치는 어색 — 3 또는 4로 조정.
- **PullToRefresh**: 최상단(scrollTop=0)에서만 트리거. 모바일 우선.

## 도메인

| 컴포넌트             | 설명                                                                                | 상태      | Figma     | Storybook                                                                   | Docs                                                             | 활용 범위                                             |
| -------------------- | ----------------------------------------------------------------------------------- | --------- | --------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------- |
| **BreathingGuide**   | 호흡 가이드 애니메이션. 원형 확장/축소로 들숨/멈춤/날숨/쉼 시각화. phases 자유 정의 | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-breathingguide--docs)   | [열기](http://localhost:3001/docs/components/breathing-guide)    | 명상 시작, 이완 가이드, 위기 상황 진정, 잠들기 호흡   |
| **StreakCard**       | 연속 기록 트래커 카드. streak 숫자 + 최근 일자 점 그리드, today 자동 표시           | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-streakcard--docs)       | [열기](http://localhost:3001/docs/components/streak-card)        | 감정 기록 streak, 명상/복약 챌린지, 습관 트래킹       |
| **EmotionHeatmap**   | 월간 감정 히트맵. 5단계 색 강도, 빈 셀(기록 없음), 셀 클릭 진입                     | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-emotionheatmap--docs)   | [열기](http://localhost:3001/docs/components/emotion-heatmap)    | 기분 월간 리포트, 스트레스 트렌드, 30일 챌린지 시각화 |
| **AppointmentCard**  | 잡힌 상담 예약 카드. 날짜 블록 + 시간/방식/장소/상태 + 액션 버튼들                  | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-appointmentcard--docs)  | [열기](http://localhost:3001/docs/components/appointment-card)   | 내 예약 리스트, 홈 다음 일정, 상담사 페이지 다음 세션 |
| **JournalEntry**     | 감정 일기 카드. 무드 + 날짜 + 제목 + 본문 클램프 + 태그 + 썸네일                    | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-journalentry--docs)     | [열기](http://localhost:3001/docs/components/journal-entry)      | 감정 일기 리스트, 자유 메모, 챌린지 회고              |
| **ChatComposer**     | 채팅 입력바. 자동 확장 textarea, 빠른 응답, 첨부/마이크, 글자수 제한                | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-chatcomposer--docs)     | [열기](http://localhost:3001/docs/components/chat-composer)      | 1:1 채팅 상담, 챗봇 대화, AI 상담 입력                |
| **CallControlBar**   | 통화 컨트롤 바. 음소거/카메라/스피커/종료 + 통화 시간 표시                          | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-callcontrolbar--docs)   | [열기](http://localhost:3001/docs/components/call-control-bar)   | 화상 상담, 음성 상담, AI 통화 인터페이스              |
| **VoiceRecorder**    | 음성 메모 녹음 UI. 큰 버튼 + 타이머 + 펄스 인디케이터, maxSeconds 자동 종료         | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-voicerecorder--docs)    | [열기](http://localhost:3001/docs/components/voice-recorder)     | 감정 일기 음성 모드, 챗 음성 메시지, 상담 음성 메모   |
| **GreetingHeader**   | 홈 인삿말 카드. `{name}`님 자동, greeting/question/trailing/actions 슬롯            | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-greetingheader--docs)   | [열기](http://localhost:3001/docs/components/greeting-header)    | 홈 화면 최상단, 마이페이지 인삿말                     |
| **WaveformPlayer**   | 음성 메시지 파형 플레이어. peaks 사전계산 또는 의사 랜덤, 클릭 시 시킹              | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-waveformplayer--docs)   | [열기](http://localhost:3001/docs/components/waveform-player)    | 채팅 음성 메시지, 짧은 음성 메모 재생                 |
| **CommentItem**      | 댓글 한 건. 작성자 + 본문 + 좋아요/답글 슬롯 + 답글 트리                            | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-commentitem--docs)      | [열기](http://localhost:3001/docs/components/comment-item)       | 콘텐츠/일기/Q&A 댓글, 그룹 코멘트, 후기 페이지        |
| **ReviewCard**       | 별점 후기 카드 (0.5 단위). 작성자/제목/본문/태그/푸터/verified                      | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-reviewcard--docs)       | [열기](http://localhost:3001/docs/components/review-card)        | 상담 후기, 콘텐츠 리뷰, 상품 후기, 챌린지 후기        |
| **VotePoll**         | 짧은 투표 카드. 질문 + 옵션 + 결과 바. 투표 후 자동 결과 노출                       | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-votepoll--docs)         | [열기](http://localhost:3001/docs/components/vote-poll)          | 커뮤니티 투표, 챌린지 주제 정하기, 가벼운 의견 수렴   |
| **UserCard**         | 범용 프로필 미니카드. row/stacked, verified, action 슬롯                            | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-usercard--docs)         | [열기](http://localhost:3001/docs/components/user-card)          | 팔로우 리스트, 그룹 멤버, 추천 친구, 작성자 프로필    |
| **ProductCard**      | 상품 카드. 썸네일 1:1 + 뱃지 + 제목 + 가격(PriceTag) + 품절                         | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-productcard--docs)      | [열기](http://localhost:3001/docs/components/product-card)       | 굿즈/콘텐츠 그리드, 검색 결과, 추천 캐러셀            |
| **CouponCard**       | 쿠폰 카드. 좌측 할인율 + 우측 정보, 점선 + 반원 컷아웃 자동                         | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-couponcard--docs)       | [열기](http://localhost:3001/docs/components/coupon-card)        | 쿠폰함, EAP 무료 코드, 챌린지 보상권                  |
| **OrderSummaryCard** | 주문/예약 요약 카드. 라벨:값 행 + 합계 + CTA 슬롯, emphasis 강조                    | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-ordersummarycard--docs) | [열기](http://localhost:3001/docs/components/order-summary-card) | 결제 직전, 상담 예약 확인, 신청서 검토                |
| **CardVisual**       | 신용/체크카드 비주얼. 8개 브랜드 톤, 마지막 4자리만 표시                            | ✅ 구현됨 | 연결 필요 | [열기](http://localhost:6006/?path=/docs/components-cardvisual--docs)       | [열기](http://localhost:3001/docs/components/card-visual)        | 카드 등록, 결제 수단 관리, 결제 카드 선택             |

- **BreathingGuide**: 박스 호흡 기본, 4-7-8 등 커스텀 가능. cycles + onComplete로 종료.
- **StreakCard**: 최근 7~14일 점 그리드. 30일+ 트래킹은 EmotionHeatmap 검토.
- **EmotionHeatmap**: GitHub 잔디형 카드. 30일+ 트래킹용 — 그 미만은 StreakCard.
- **AppointmentCard**: CounselorCard(상담사 선택용)와 분리. 잡힌 일정 표시 전용.
- **JournalEntry**: 본문 3줄 클램프 기본. title 생략 가능.
- **ChatComposer**: ChatBubble과 짝. controlled, Enter=전송 / Shift+Enter=줄바꿈.
- **CallControlBar**: 카메라/스피커는 onChange 안 주면 버튼 자동 숨김. 종료 버튼 색 고정.
- **VoiceRecorder**: 마이크 접근/저장은 외부 처리. seconds는 외부 timer로 갱신.
- **GreetingHeader**: name에 '님' 직접 X. greeting은 외부에서 시간대 결정.
- **WaveformPlayer**: AudioPlayer(트랙바)와 분리된 컴팩트 메시지 형태.
- **CommentItem**: isReply로 답글 들여쓰기. 본문 줄바꿈 자동 보존.
- **ReviewCard**: rating 0~5 + 0.5 단위. 본문 pre-wrap 자동.
- **VotePoll**: 임상 척도는 LikertScale. count는 외부 state로 갱신.
- **UserCard**: CounselorCard(EAP 특화)와 분리된 일반 사용자용.
- **ProductCard**: 가격은 PriceTag 슬롯. 품절은 soldOut(오버레이), 라벨은 badge.
- **CouponCard**: discount/suffix 분리. disabled=true면 버튼 자동 변경.
- **OrderSummaryCard**: 할인은 emphasis='discount'. EAP 무료는 emphasis='info'.
- **CardVisual**: 전체 번호 넣어도 자동으로 마지막 4자리만. 보안 위해 의도적.
