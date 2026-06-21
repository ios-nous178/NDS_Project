---
figmaNodeUrl: https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=171-9899
references:
  - label: Trost Modal & Popup Guide — 4 variants (Compact/Default × Destructive/Positive)
    url: https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=171-9899
    caption: 트로스트 모달 가이드. Positive=프로젝트 노랑 #FFF42E + 검은 텍스트(저장·구독·확인), Destructive=검정 #000 + 흰 텍스트(삭제·차단·해지). radius 16 · 상단 패딩 24 · 버튼 2개 가로(우측 primary, h44 r8) · backdrop 0.4. teal(서플 색) 금지 — 노랑 유지.
    project: trost
  - label: CashwalkBiz Admin Modal Guide — 4 patterns
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3418-471
    caption: Cashwalk for Business · ModalGuide. Single / Dual / With Close / Confirm+Slot 4가지 슬롯 기반 admin 패턴 SSOT.
    project: cashwalk-biz
  - label: CashwalkBiz ⑥ 선택/피커 모달 — 지역 선택 (SSOT)
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-50116
    caption: 대형 2컬럼 선택 모달(좌 검색+체크박스 트리 / 우 SelectedItemsPanel) + 본문 풀폭 옐로우 '적용' CTA. dimensions.selectionModal SSOT. (빈 셸 3001-50787 의 400centered·radius10 적용 버튼은 오류.)
    project: cashwalk-biz
  - label: CashwalkBiz ⑦ 데이터 로더 모달 — 소재 불러오기
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-32822
    caption: 대형 선택형 DataTable 모달(행 radio 선택 + 페이지네이션 + 'N개씩 보기') + 푸터 취소(outlined)/불러오기(검정 pill). dimensions.dataLoaderModal SSOT.
    project: cashwalk-biz
matrixOverrides:
  cashwalk-biz:
    dimensions:
      width: 480px (PC admin desktop · base 332/294 와 다름)
      radius: 16px (base 8)
      padding: 32px 균등 (base 비대칭 28/16/16)
      gapBodyToFooter: 20px (base 24)
      buttonHeight: 48px pill · 폭 128px 고정 (Single·Dual 모두 우측 정렬 · Figma ModalGuide 3418-471 갱신 — 옛 44px/120px 폐기) — 모달 액션 버튼 shape 는 pill 이 맞음. default 사각으로 바꾸거나 44/120 으로 되돌리지 말 것.
      footerLayout: Single(확정 1개) = 우측 정렬 · 128px 고정 폭 · 검정 pill — **full-width 아님**. Dual(취소+확정) = 우측 정렬 · 128px 고정 ×2(취소 outlined + 확정 검정). HTML 은 `<div slot="footer">` 로 감싸면 자동으로 .nds-modal__footer 로 승격돼 이 레이아웃이 적용됨(버튼 2개면 data-has-both-actions="true" 자동). single 에 full-width 를 붙이거나 footer 컨테이너 없이 버튼만 두면(본문 가운데 끼임) 회귀.
      confirmCta: 주 action(확인/적용) = color="neutral" variant="solid" → 캐포비 시그니처 **검정 CTA**(#111 배경·흰 텍스트, buttonBg.neutral 토큰 cascade). (캐포비는 secondary tone 이 Figma 미정의라 Button/validator 가 경고 — 검정은 neutral 이 정답. secondary 는 하위호환 잔재.) 취소/닫기 = color="neutral" variant="outlined", 파괴적 확정(삭제 등)만 color="error".
      titleTypo: Title2 18·26 좌측 정렬 (base 중앙 정렬)
      bodyTypo: Body2 14·20 medium 좌측 정렬 (base 중앙 정렬)
      dataModal: "**⑤ Data Modal (대형·조회 전용, 확인 팝업 ①~④ 와 구분)**: 목록/상세 데이터를 조회·확인하는 대형 모달. width ~560+ · **radius 12 · padding 24 · gap 16**(확인 모달의 16/32 와 다름) · border #E5E7EB. 헤더 = 제목(16 Bold) + 우상단 Close X(#999, 푸터 CTA 없음 — 조회 전용). 본문 = DataTable(헤더행 bg #F7F8FA · 셀 border #EEE · 36px · 12px) — 상세 + 목록 등 다중 테이블 가능. 페이지 패턴 아님 → Modal + DataTable 조합. Figma ModalGuide 3418-471(⑤ Data Modal 3832-1057)."
      selectionModal: "**⑥ 선택/피커 모달 (대형·다중 선택)**: 항목을 검색·다중 선택해 적용하는 대형 모달(예: 지역·카테고리·타겟 선택). **width ~960 · radius 16 · padding 48 · 흰 배경**. 헤더 = 제목 Bold 24 #383838(좌) + Close X 28(#999, 우). 본문 = **2컬럼(각 ~422 · 높이 ~652 · gap 20)**: 좌 = 필터(검색 input + '전체 선택' 체크박스 + 시/도▸시/군/구 체크박스 트리, 선택 시 옐로우 체크) / 우 = `SelectedItemsPanel`(component:SelectedItemsPanel · SelectedItemRow) — '선택한 N개' + '선택 해제'(reset) + 제거 가능한 선택 항목 리스트. **모달 안 패널은 '선택 해제'만 — '추가 선택' 버튼 노출 금지(HTML `hide-add` 속성 필수 · React `onAdd` 미전달). '추가 선택'은 모달 밖 페이지/타겟팅 폼에서만 쓰며 secondary Button + plus(+) 아이콘.** 푸터 = **본문 풀폭 단일 '적용' CTA**: Solid/Primary(옐로우 #FFD200·검정 텍스트, **pill**) · 비활성 = Neutral/400 #DDD. ⚠️ 확인팝업(①~④)의 '우측 hug 검정 pill' 규칙을 적용하지 말 것 — 선택 적용은 **풀폭 옐로우**. 버튼 shape 는 모달 BottomCTA 라 pill 이며, 시안 3001:50787(빈 셸)의 radius10·400centered 적용 버튼은 오류 — 채워진 SSOT 는 **3001:50116**(풀폭 적용). Figma 3001-50116."
      dataLoaderModal: "**⑦ 데이터 로더 모달 (⑤ Data Modal 의 선택형)**: 기존 항목을 표에서 골라 불러오는 대형 모달(예: 소재 불러오기). ⑤ 구조 + **행 선택(radio/check) + 페이지네이션 + 푸터 액션**. 헤더 = 제목 Bold 24 + 검색 input + Close X. 본문 = 선택형 DataTable(상태칩·이미지·텍스트 컬럼 등) + 하단 페이지네이션 + 'N개씩 보기' 드롭다운. 푸터 = **취소(color=\"neutral\" outlined) + 불러오기(color=\"secondary\" solid · 검정 pill)** 각 ~170×56 (확인팝업 dual 푸터와 동일). 조회 전용 ⑤ 와 달리 선택·확정 액션이 있다. Figma 3001-32822."
      activationCondition: '`<html data-project="cashwalk-biz">` 가 박힌 환경에서만 자동 적용 — 그 외에서는 base 모바일 스펙 유지'
  trost:
    dimensions:
      radius: 16px (가이드 171:9899 Radius/2xl · base 8 → 트로스트 토큰 modal.radius)
      padding: 24px(top) / 16 좌우·하단 (base 28/16/16 → 트로스트 토큰 modal.padTop=24)
      buttons: 2개 가로(우측 primary) · width 130 · height 44 · radius 8 · backdrop rgba(0,0,0,0.4)
      confirmCta: 'Positive(저장·구독·확인) = 프로젝트 노랑 #FFF42E + 검은 텍스트(confirmCta 토큰이 프로젝트별 자기 값 — 트로스트=검정 자동, 별도 설정 불필요). 비가역(삭제·차단·해지) = confirmTone="destructive"(react) / 검정 nds-button color="neutral"(html) → 검정 #1A1A1A + 흰 텍스트. ⚠️ teal(서플 primary) 색 쓰지 말 것 — 트로스트는 노랑 유지.'
      activationCondition: '<html data-project="trost"> — base 토큰 cascade 로 자동 (radius/padTop 은 트로스트 컴포넌트 토큰)'
usagePolicy:
  useFor:
    - 즉각적 판단/응답이 필요한 확인 (삭제 확인, 결제 확인)
    - 현재 흐름 중단이 정당화되는 중요한 결정
    - 추가 입력 없이 한 화면에서 결정을 마쳐야 하는 짧은 폼
    - (캐시워크 포 비즈니스 admin) 검수/등록/노출 변경 같은 admin 워크플로우의 확인 다이얼로그
    - (캐시워크 포 비즈니스 admin) 목록/상세 데이터 조회 — Data Modal(대형 · 본문 DataTable · Close X · 푸터 CTA 최소). 확인 팝업(①~④)과 사이즈/역할 구분(dimensions.dataModal 참조).
  doNotUseFor:
    - 단순 정보 전달 — inline Notice / Banner / section 안내 사용
    - 긴 콘텐츠/스크롤 페이지 — 별도 페이지나 BottomSheet 검토 (단, 데이터 조회 목적의 대형 모달은 캐포비 Data Modal 패턴 허용)
    - 여러 단계 분기 — Wizard / 별도 페이지
    - 에러 메시지 — Toast 또는 inline error 사용
  emphasisRule: 핵심 action 1 + 보조 action 1 구조가 기본. Modal 안에 또 다른 강조 영역을 쌓지 말 것.
---

## summary

사용자의 현재 흐름을 일시적으로 중단하고 중요한 결정/응답을 받기 위한 오버레이 UI. (기본/모바일) Radius 8 / 카드 padding 비대칭 28·16·16 / PC 332 · Mobile 294 / 본문↔버튼 24px gap / 50% overlay / shadow.md. Type: default / title(헤더) / Image(64×64 아이콘+타이틀). Button: 최대 2개. (기본/모바일) 1개=Primary full-width, 2개=Outlined Cancel + Primary OK 가로 분할. **(캐포비 admin) 1개=우측 정렬 · 128px 고정 · 검정 pill (full-width 아님), 2개=우측 정렬 128px ×2** (버튼 48px pill) — 버튼 배치는 actionsLayout('split'=가로균등 | 'end'=우측 hug) 으로 제어하고, 생략 시 프로젝트 기본이 강제된다(캐포비=end, 그 외=split. react=actionsLayout prop, html=actions-layout 속성). full-width 붙이지 말 것. Modal API/props 는 project 무관 동일 — 색/pill 모양은 프로젝트 토큰, 배치만 actionsLayout(data-layout) variant. project 별 spec 변형 (예: admin desktop 4가지 패턴) 은 get_guide({ topic:'component:Modal', project:'<slug>' }).dimensions 또는 matrixOverrides 참조.

## pitfalls

- Modal 내부에 다시 큰 그림자/보더를 추가하지 말 것 (이미 shadow 토큰이 적용됨).
- ESC/오버레이 클릭으로 닫히는 기본 동작을 막으면 접근성 저해.
- 버튼은 최대 2개까지만 사용. 3개 이상이 필요하면 BottomSheet 검토.
- maxWidth 미지정 시 base 기본 폭은 PC 332 / 모바일 294. project 별 변형 (예: cashwalk-biz admin desktop 480) 은 get_guide({ topic:'component:Modal', project:'<slug>' }).dimensions 또는 matrixOverrides 로 확인. 모바일 화면이면 device='mobile' 명시.
- ModalHeader/Body/Footer 자체에 padding 을 더하지 말 것 — 카드 패딩은 ModalContent 가 담당.
- 단순 정보 전달용으로 Modal 사용 금지 — inline Notice / Banner / section 안내 우선. Modal 은 사용자의 즉각적 판단/응답이 필요할 때만.
- Modal 내부 강조 최소화: 핵심 action 1개 + 보조 action 1개 구조가 기본. Body 안에 또 다른 Card·Project BG·Chip 그룹을 쌓지 말 것.
- **확인 CTA 색은 confirmCta 토큰이 자동 — 프로젝트별 자기 값으로 합성된다.** Modal/Popup 의 기본 confirm(positive) 버튼은 bg=confirmCta(프로젝트 색: 트로스트=노랑·나머지=project·캐포비=검정) + **텍스트=confirmCta.text(트로스트=검정/나머지=흰/캐포비=흰)**. 노랑 위 흰 글씨 회귀는 해소됨 — Modal footer 에 `color`/text 를 직접 박지 말 것. **비가역(파괴적) 액션은 `confirmTone="destructive"`**(react `<Modal confirmTone="destructive">` / ModalFooter) → 검정 Neutral CTA + 흰 텍스트(프로젝트 무관, neutral-solid 토큰). HTML `<nds-modal>` 은 footer 가 consumer slot 이라 destructive = `<nds-button color="neutral" variant="solid">삭제</nds-button>` 로 표현(별도 속성 없음). 트로스트: 저장·구독=기본(노랑) / 삭제·차단=destructive(검정).
- 캐포비 admin 모달의 주 action(확인/적용)은 color="neutral" variant="solid" — 프로젝트 시그니처 **검정 CTA**(#111·흰 텍스트). 취소/닫기는 color="neutral" variant="outlined", 파괴적 확정만 color="error". 모달 버튼 shape 는 **pill 유지가 맞다**(Figma ModalGuide 3418-471) — default 사각으로 바꾸지 말 것. **★ footer 버튼은 주·보조(취소/아웃라인) 가리지 않고 전부 `shape="pill"`** — 보조 버튼에 빠뜨려 pill+각진 버튼이 섞이는 게 흔한 회귀. validator `project-modal-footer-button-shape`(project-profiles cashwalk-biz.modal.footerButtonShape="pill") 가 pill 누락 버튼을 잡는다. (캐포비는 secondary tone 이 없어 Button/validator 가 경고하니 검정은 neutral 로. 검정인데 색이 틀리면 data-project="cashwalk-biz" 미설정 — 색 hex 를 직접 박지 말고 cascade 로 해결.)
- **★ 캐포비 확인/팝업 모달 버튼에 `color` 를 절대 생략하지 말 것 — 생략하면 노랑(primary)이 된다.** Button/<nds-button> 의 기본 color 는 `primary`(노랑)라, 모달 footer 에 `<nds-button>비즈니스 그룹 만들기</nds-button>` 처럼 color 를 안 적으면 캐포비 검정 CTA 가 아니라 노랑 버튼이 렌더된다(5회+ 재발한 회귀의 근본). **반드시 `color="neutral" variant="solid" shape="pill"` 를 명시**한다. validator `project-modal-confirm-cta` 가 확인/팝업 모달의 primary/색생략 footer 버튼을 error 로 잡는다. (본문 풀폭 옐로우 적용 버튼이 정상인 곳은 선택/피커(⑥)·데이터로더(⑦) 같은 대형 모달뿐 — max-width 720+.)
- **모달/팝업 버튼이 2개일 때는 항상 가로 정렬을 유지한다 — 라벨이 길어 안 들어가도 세로 스택 금지.** 좁아서 한 줄에 안 들어가면 세로로 쌓지 말고 **라벨 텍스트를 줄인다**(예: "비즈니스 그룹 만들기"→"그룹 만들기", "나중에 다시 하기"→"나중에", "지금 확인할게요"→"확인"). 모달 footer 에 `flex-direction:column` / `actions-layout="stack"` 을 넣지 말 것 — validator `project-modal-footer-stacked` 가 warn. (모달 버튼 라벨은 1~2 단어로.)
- **★ 캐포비 단일 버튼 모달은 우측 정렬 hug 검정 pill — full-width 아님.** 흔한 회귀: 버튼 1개인데 full-width 로 깔리거나 본문 가운데에 끼는 것. 원인은 (a) `<nds-button full-width>` 를 붙임 또는 (b) footer 를 `<div slot="footer">` 로 감싸지 않고 버튼만 본문에 둠. 해법: `<div slot="footer"><nds-button color="neutral" variant="solid" shape="pill">확인</nds-button></div>` — slot="footer" 가 .nds-modal__footer 로 승격되고, 캐포비 single cascade 가 `justify-content:flex-end` 로 우측 정렬 + hug 너비를 만든다(full-width 금지). 2개일 때만 가로 분할. **단, 이 규칙은 확인/결정 팝업(①~④) 한정** — 모달 종류별로 푸터가 다르다(아래).
- **모달 종류별 푸터 결정 트리** (혼동 금지): ① 확인/결정 팝업 = 우측 hug **검정 pill**(color="neutral" — 캐포비엔 secondary 없음), 취소는 neutral outlined. ② 선택/피커 모달(⑥, dimensions.selectionModal) = **본문 풀폭 단일 "적용" 옐로우 Solid/Primary pill** (검정 아님·hug 아님). ③ 데이터 로더(⑦, dimensions.dataLoaderModal) = 취소(outlined) + 불러오기 **검정 pill**. ④ 조회 전용 Data Modal(⑤) = 푸터 CTA 없음(Close X 만). 어떤 모달인지 먼저 정하고 그 푸터를 쓸 것 — 선택 모달에 검정 hug 를, 확인 팝업에 옐로우 풀폭을 쓰면 회귀.
- **④ Confirm + Slot — 두 개의 독립 슬롯**(Figma ModalGuide 3418-471 · Variant Showcase): 확인 모달은 severity 슬롯과 본문 컨트롤 슬롯을 **각각 독립적으로** 끼울 수 있다(둘 다 / 하나만 / 없음 모두 가능 — 두 슬롯은 swipe 시안에서 슬롯 a·b 로 분리돼 있다). ❶ **slot a — severity(Notice 3종: info / caution / error, + success)**: 심각도 표시. Figma 는 헤더 제목 앞 pill Badge 로 그리지만, `<Modal title>`/`<nds-modal title>` 헤더는 타이틀 전용이라 **DS 표준은 본문 첫 자식 `nds-notice-alert`(variant=info/caution/error)** 로 표현한다(헤더에 직접 배지를 박아야 하면 저수준 `Modal.Header` children 으로 `Badge` 조립). ❷ **slot b — BodyContent 컨트롤(4종)**: `ContentSlot`(기본 — 회색 안내 박스 `fill/neutral-subtle` 배경·radius 12·높이 48) / `nds-input`(TextInput) / `nds-select`(Dropdown) / `nds-date-picker`(DateInput) 중 하나. 두 슬롯 모두 **설명 `<p>` 와 함께 본문 children 형제로** 둔다(슬롯은 footer 가 아니라 본문 — `slot="footer"` 붙이지 말 것). ModalBody 가 세로 스택 + 자동 간격(캐포비 20px / base `--semantic-gap-default`)을 잡으므로 **슬롯마다 wrapper/margin 으로 간격을 직접 주지 말 것**(직접 주면 이중 간격 회귀). 슬롯은 full-width 로 늘어남. 푸터는 ①과 동일(취소 neutral outlined + 확정 검정 neutral · 48px pill w128).
- **높이/스크롤·중첩 팝오버는 DS 가 알아서 처리한다 — 손대지 말 것.** (a) 본문이 길어 화면을 넘으면 ModalContent 가 뷰포트(카드 패딩 제외) 안으로 max-height 를 걸고 **헤더/푸터는 고정한 채 본문(.nds-modal__body)만 스크롤**한다. 모달 패널에 직접 height/max-height/overflow 를 박아 이 동작을 깨지 말 것(`--nds-modal-max-height` 로 상한만 오버라이드 가능). (b) 본문 슬롯의 `nds-date-picker`/`nds-select` 캘린더·드롭다운은 `document.body` 로 portal 되어 모달 `overflow:hidden` 밖으로 뜬다(잘리지 않음) — 팝오버를 모달 밖으로 빼내려고 별도 컨테이너/position 을 만들지 말 것.
- **런마일(Modal 가이드 5085:27)**: 컨테이너 radius **3XL 24** · **Elevation/3**(0 4px 13px α0.06) · **Title=Text/Strong**(#221E1F) · **Body=Text/Normal**(subtle #4E5968) **13/18**. 모두 `components.modal`(radius/shadow/titleColor/bodyColor/bodyFontSize/bodyLineHeight) 슬롯 — 타 프로젝트 fallback 유지. overlay #000 α0.5 · 흰 surface · Confirm=오렌지 Solid · Cancel=Outlined 좌 + Confirm 우(actionsLayout split). 단일=Confirm only, 이중=Cancel+Confirm. 본문 3줄↑/입력 폼이면 BottomSheet·별도 페이지 권장. (치수 296/328 은 React DEVICE_WIDTH 하드코딩이라 base 294/332 유지 — 4px 차.) **Popup**(가운데 confirm)도 런마일 radius 20·Elevation/3 정합(`components.popup`).

## examplesHtml.do

```html
<!-- 2버튼(가로 분할): 취소 + 확정. slot="footer" 는 자동으로 .nds-modal__footer 로 승격됨 -->
<nds-modal open title="신청을 취소할까요?" max-width="400" closable>
  <p>입력한 내용은 저장되지 않아요.</p>
  <div slot="footer">
    <nds-button color="neutral" variant="outlined">닫기</nds-button>
    <nds-button color="error" variant="solid">취소하기</nds-button>
  </div>
</nds-modal>
<!-- 캐포비(data-project="cashwalk-biz") 단일 버튼: 우측 정렬 · hug 너비 · 검정 pill (full-width 아님). full-width 속성 붙이지 말 것 — footer cascade 가 우측 정렬 처리 -->
<nds-modal open title="검수를 승인할까요?" max-width="480">
  <p>승인하면 즉시 노출됩니다.</p>
  <div slot="footer">
    <nds-button color="neutral" variant="solid" shape="pill">승인</nds-button>
  </div>
</nds-modal>
<!-- ④ Confirm + Slot: 두 독립 슬롯 — slot a(severity)=nds-notice-alert(info/caution/error) + slot b(BodyContent)=Input/Select/DatePicker 중 하나. 설명 <p> 와 슬롯을 본문 children 형제로 두면 ModalBody 가 자동 간격(캐포비 20px)으로 쌓는다 — 직접 wrapper/margin 불필요. 슬롯은 full-width. -->
<nds-modal open title="종료 사유를 입력해주세요" max-width="480">
  <p>광고비는 전액 청구되며 환불·보상·재집행은 불가합니다.</p>
  <nds-notice-alert variant="caution" message="종료 후에는 되돌릴 수 없어요."></nds-notice-alert>
  <nds-input label="사유" placeholder="사유를 입력하세요"></nds-input>
  <div slot="footer">
    <nds-button color="neutral" variant="outlined">취소</nds-button>
    <nds-button color="neutral" variant="solid">확정</nds-button>
  </div>
</nds-modal>
<script>modal.addEventListener("modal-close", () => modal.removeAttribute("open"));</script>
```

## examplesHtml.dont

```html
<!-- closable + max-width 누락 + 본문 없음 — 의도/구조가 부족 -->
<nds-modal open></nds-modal>
<!-- raw <dialog> 로 모달 흉내 — focus trap / 토큰이 적용 안 됨 -->
<dialog open><p>알림</p></dialog>
```
