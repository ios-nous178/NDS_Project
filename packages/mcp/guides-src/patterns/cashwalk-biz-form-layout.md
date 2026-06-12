---
examples:
  - verdict: good
    source: Figma 290:1197 캐시워크 포 비즈니스 admin form (퀴즈 등록하기)
    caption: PageTitle 32 Bold (+부제, 아래 divider 없음) → 섹션 헤딩 24 Bold (카드 밖) → 카드 padding 48×36 radius 16 → 라벨-인라인-좌측 (172px) + 필드 h-40 rounded-10 → 콘텐츠 하단 우측 정렬 [취소][저장](별도 흰 바·고정 없음).
  - verdict: bad
    source: 잘못된 admin form 레이아웃
    caption: "라벨-위 흐름 + 헤더를 박스 sticky topbar 로 감쌈 + 부제 삭제 + #FF4141 필수마커 — 모두 캐시워크 포 비즈니스 admin form 컨벤션 위반."
metrics:
  pageBg: "#FAFAFA"
  pageTitle: "Pretendard Bold 32/60 #383838"
  pageSubtitle: "Pretendard Regular 16/24 #666 (레퍼런스에 있으면 유지 — title-only 축소 금지)"
  pageHeaderContainer: 페이지 배경 위 (박스/sticky nds-shell__topbar 아님)
  titleDivider: 없음 — 타이틀/부제 아래 divider·border·hr 금지 (여백 ~76px 만)
  sectionHeading: "Pretendard Bold 24/30 #383838 (카드 밖 위)"
  sectionHeadingToCardGap: ~54px
  cardPadding: 48px × 36px (px × py)
  cardRadius: 16px
  cardBorder: "1px #ECECEC"
  cardShadow: 0 10px 20px rgba(102,102,102,0.05)
  interCardGap: ~64–80px (의미 단위 가변)
  labelColumnWidth: 172px
  fieldWidth: Field Width 6단계 px 고정 — xs120/sm200/md304(default)/lg400/xl488/full100%. 폼 일반 입력 Medium 304, Textarea Full. 스케일 SSOT=pattern:cashwalk-biz-input.
  labelTypography: "Pretendard Medium 16/24 #666"
  requiredMarker: "라벨 옆 ' *' #FC3500"
  fieldHeight: 40px (nds-input/nds-select 동일 — input default 는 brand :root 로 cascade, 48 로 두면 select 와 어긋남)
  fieldRadius: 10px
  fieldBorder: "1px #D8D8D8"
  fieldBg: white
  placeholderColor: "#999"
  helperTypography: "Pretendard Regular 14/20 #666 (counter #999)"
  actionBarPosition: 콘텐츠 하단 인라인 액션 (별도 흰 배경 바·sticky/fixed 고정·풀폭 상단 border 없음 · 페이지 배경 위)
  actionBarAlignment: right
  ctaSize: cashwalk-biz-button BottomCTA 참조 (저장=primary solid, 취소=outlined)
  ctaPrimary: "bg #FFD200 + 검정"
  ctaCancel: "white + 1px #D8D8D8 + #666"
  ctaDisabled: "bg #D8D8D8 + 흰 텍스트"
  maxPrimarySolidPerScreen: 1
  validationTiming: onBlur or submit
  targetingRegion: 페이지 SelectedItemsPanel → 첫 선택/추가 선택 클릭 시 selection modal(CheckboxTree + SelectedItemsPanel hide-add + full-width yellow 적용)
  targetingGender: SelectionButtonGroup(전체/특정 성별) + selected Chip(남성/여성/알 수 없음). Select/Radio/CheckboxGroup/Segmented 금지.
  relatedPatterns: cashwalk-biz-input, cashwalk-biz-button, cta-group
figmaNodeUrl: https://www.figma.com/design/9lJ9XCwVYFSoZGcmRuJtI4/%ED%95%9C%EA%B5%AD-%EC%BA%90%EC%8B%9C%EC%9B%8C%ED%81%AC_WEB-Dev?node-id=290-1197
references:
  - label: 캐시워크 포 비즈니스 admin 폼 SSOT — 퀴즈 등록하기 (Figma 290:1197)
    image: references/cashwalk-biz-form-290-1197.png
    caption: 캐시워크 포 비즈니스 admin 폼 페이지 SSOT 스크린샷. 본 가이드 metrics 는 이 노드 실측 기준.
    brand: cashwalk-biz
  - label: 캐시워크 포 비즈니스 사이드바 — 광고/운영/관리 3섹션 (Figma 168:1250)
    image: references/cashwalk-biz-sidebar-168-1250.png
    caption: 본문 좌측 LNB. 폼 페이지의 사이드바 컨텍스트.
    brand: cashwalk-biz
  - label: 캐시워크 포 비즈니스 사이드바 — 서브메뉴 펼침 변형 (Figma 290:1593)
    image: references/cashwalk-biz-sidebar-290-1593.png
    caption: 퀴즈 관리 sub-item 펼친 상태 (등록하기/목록/통계). 폼 진입 경로.
    brand: cashwalk-biz
---

## summary

캐시워크 포 비즈니스 admin 폼 페이지 레이아웃 — 'PageTitle 32 Bold (+부제) → 섹션 헤딩 24 Bold (카드 밖) → 카드(48×36 padding · radius 16) → 라벨-인라인-좌측 (172px 컬럼) 필드 → **콘텐츠 하단 우측 정렬 [취소][저장] 인라인 액션**(별도 흰 배경 바·sticky 고정 없음)' 표준. Figma 290:1197 (퀴즈 등록하기) 실측. 필드 단위 컴포넌트 정책은 pattern:cashwalk-biz-input, CTA 정책은 pattern:cashwalk-biz-button 과 함께 본다.

## rules

- **페이지 컨테이너**: 사이드바(좌 300px) 우측 본문. 페이지 bg `#FAFAFA`, 콘텐츠 컬럼 폭 1491px (실측), 좌측 padding 32px.
- **페이지 헤더**: 좌측 정렬 — 타이틀 Pretendard **Bold 32 / lh 60** #383838 **+ (있으면) 바로 아래 부제** Pretendard Regular 16/24 #666. **레퍼런스에 부제가 있으면 반드시 유지 — title-only 로 축소 금지.** **타이틀/부제 아래에 divider(밑줄·border-bottom·hr) 를 넣지 말 것** — 헤더는 라인 없이 여백만 두고 다음 섹션으로 바로 이어진다. 타이틀/부제 아래 ~76px 여백 후 섹션 헤딩 시작. **페이지 배경 위에 얹는다 — 별도 박스/sticky `nds-shell__topbar` 로 감싸지 말 것**(topbar 박스는 list/detail/dashboard 용). 우측에는 액션 두지 말 것(액션은 콘텐츠 하단 우측 정렬 [취소][저장]).
- **섹션 헤딩 (카드 위 분리 노출)**: 헤딩(예: '기본 정보') 은 카드 **밖** 위에 위치 — Pretendard **Bold 24 / lh 30** #383838. 헤딩 아래 ~54px 후 카드 시작.
- **섹션 카드**: 카드 padding **48px × 36px**, `radius 16px`, border 1px `#ECECEC`, bg white, soft shadow `0 10px 20px rgba(102,102,102,0.05)`.
- **필드 레이아웃 = 라벨-인라인-좌측 (label column)** — admin 폼 가독성/정렬 위해 라벨이 필드 좌측 고정 폭. 라벨 컬럼 **172px**. 입력 필드 가로 너비는 **Field Width 6단계 스케일**(xs 120 / sm 200 / **md 304 default** / lg 400 / xl 488 / full 100%)에서 **px 고정**으로 선택 — 폼 일반 입력 = **Medium 304px**, 같은 행 input 은 같은 사이즈로 통일, Textarea 는 Full(100%). (임의 너비 ~684/228 류·hug·% 금지 — 스케일·use case 는 `pattern:cashwalk-biz-input` 의 Field Width 가 SSOT.) 라벨은 row 중앙 정렬.
- **라벨 타이포**: Pretendard **Medium 16 / lh 24, #666** (text.subtle). 'strong' 색을 쓰지 않는다 — 빽빽한 폼에서 라벨은 subtle 로 둬도 위계가 명확.
- **필드 컴포넌트**: 높이 **40px** (`nds-input`/`nds-select` 동일 높이로 정렬 — nds-input 은 size 미지정(default)이면 브랜드 :root 40 으로 cascade 되고 `size="compact"` 도 40. **48 로 두면 nds-select(40) 와 높이가 어긋남**), `radius 10px`, border 1px `#D8D8D8`, bg white, placeholder 16px #999. 검정 focus border·정확한 radius 는 `pattern:cashwalk-biz-input` 참조.
- **행 높이**: ~102-106px (라벨+필드+helper 포함). 라벨↔필드 ~5px, 필드↔helper ~10-14px.
- **Helper text**: Pretendard Regular **14 / lh 20, #666**. 글자 수 카운터(`0/30`) 는 14 Medium #999 우측 정렬.
- **필수 마커**: 라벨 옆 ` *` color **`#FC3500`** (Coral Red-Orange). 'optional' 표기 X.
- **액션바 = 콘텐츠 하단 우측 정렬 [취소][저장] 인라인 액션**: 폼 콘텐츠 맨 끝에 **페이지 배경 위로 우측 정렬** 배치 — **별도 흰 배경 바(`--semantic-bg-surface-default`)·풀폭 상단 border·sticky/fixed 고정을 두지 않는다.** 저장=primary solid, 취소=outlined — CTA shape/색 실측은 `pattern:cashwalk-biz-button` (BottomCTA) 가 SSOT. Disabled: `#D8D8D8` neutral.
- **액션 위계**: primary solid CTA 1개. 파괴(삭제) 액션은 별도 위치(헤더 우측 또는 카드 우측 상단) 분리.
- **선택 chip / 활성 토큰**: `bg #FFFAE2 + border #FFD200` (옅은 노란 + 노란 보더) + Bold #111. 강조 숫자/카운트는 `#FD9B02` (amber).
- **타겟팅 지역 선택(캐포비 한정 SSOT)**: 폼 페이지에는 `SelectedItemsPanel` 로 현재 선택 지역을 보여주고, 첫 선택/추가 선택 클릭 시에만 대형 선택 모달을 연다. 모달 본문은 좌측 `CheckboxTree`(검색 + 전체선택 + 시/도▸시/군/구) + 우측 `SelectedItemsPanel hide-add`(선택 해제 + 제거 가능한 SelectedItemRow) 조합, 푸터는 본문 풀폭 옐로우 `적용` CTA. **모달 안 우측 패널에는 '추가 선택' 버튼을 절대 두지 않는다**(HTML `hide-add`, React `onAdd` 미전달) — 모달 안에 입력 버튼이 2개처럼 보이는 회귀 방지.
- **타겟팅 성별 선택(캐포비 한정 SSOT)**: 성별 필드는 `SelectionButtonGroup` 으로 `전체 / 특정 성별` 을 먼저 고르고, `특정 성별` 상태에서만 selection chip 묶음(`<nds-chip selected interactive>남성</nds-chip>`, `<nds-chip selected interactive>여성</nds-chip>`, 필요 시 `알 수 없음`)을 노출한다. Select / RadioGroup / CheckboxGroup 로 대체하지 말 것 — 캐포비 타겟팅 폼에서는 입력 종류가 흔들리면 목업 품질이 가장 크게 흔들린다.
- **우측 보조 사이드 카드 (선택)**: 메인 필드 우측에 요약 카드 (border #ECECEC rounded-16 padding 25×32 w-406) — 미리보기/도움말.
- **유효성 검사**: 입력 중 에러 표시 X (onBlur/submit). 글자 수 카운터만 실시간.

## avoid

- **타이틀 아래에 라인(divider·border-bottom·hr·밑줄) 추가 — 금지.** 캐시워크 포 비즈니스 폼 헤더는 라인 없이 여백만으로 분리한다. PageHeader 컴포넌트면 `bordered` 를 켜지 말 것.
- 라벨을 필드 위에 배치 (label-above 2단 흐름) — 캐시워크 포 비즈니스 admin 은 인라인-좌측 (172px 라벨 컬럼) 패턴.
- 페이지 헤더 우측에 [저장] 버튼 — 하단 [취소][저장] 액션과 중복.
- 필수 마커 색을 `#FF4141` 으로 — 캐시워크 포 비즈니스 폼은 `#FC3500` (Coral Red-Orange).
- Disabled CTA 를 Yellow/100 (#FFFAE5) 로 — 폼 액션바 disabled 는 `#D8D8D8` neutral gray.
- 하단 액션을 **센터** 정렬하거나 알약 cluster 로 묶기 — 하단 [취소][저장] 은 **콘텐츠 끝 우측 정렬**이 표준(별도 흰 배경 바·sticky 고정 없이 페이지 배경 위).
- CTA 모양을 8px rounded 사각형 — Figma 는 56h rounded-28 알약 (pill).
- 필드 border-radius 를 8px 로 — Figma 는 10px.
- 필수 라벨을 brand yellow 로 강조 — 노랑은 활성/선택용. 필수는 빨강-주황 별표만.
- 캐포비 타겟팅 지역 선택을 Chip 인라인 나열/평면 CheckboxGroup/작은 팝오버로 구현 — 폼 페이지 `SelectedItemsPanel` + 대형 선택 모달(`CheckboxTree` + `SelectedItemsPanel hide-add`)이 SSOT.
- 캐포비 타겟팅 성별 선택을 Select/RadioGroup/CheckboxGroup 로 구현 — `SelectionButtonGroup` + selected Chip 묶음이 SSOT.
- 한 폼 안에 카드 간격 일정한 24px — Figma 는 의미 단위 64-80px 가변.
