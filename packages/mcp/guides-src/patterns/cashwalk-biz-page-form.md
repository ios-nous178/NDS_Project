---
examples:
  - verdict: good
    source: Figma 3615-522 (캐포비 Form 패턴 — 다단계 광고 등록)
    caption: Step Progress(캠페인→광고그룹→소재) + 상단 안내 콜아웃('캠페인이란?' info 카드 + 상품 소개서/광고 가이드 다운로드 버튼) + FormSection 반복(광고 정보/기간/예산, 섹션 gap 32) + 우측 미리보기 패널 400px + Footer(Step1 좌 목록으로/임시저장 · 우 다음 단계 solid, 상단 border, sticky).
  - verdict: bad
    source: 잘못된 등록 폼
    caption: 단건인데 Step Progress 부착 + 입력 타입을 매핑 없이 임의 선택 + Footer 를 inline 센터로 + 필드 px 를 여기서 재정의 — Form 패턴 위반.
metrics:
  status: Figma 실측 반영 (docs 3626-1041 / pattern 3615-522)
  composition: 01 Sidebar → 01b Page Header(title+부제, 페이지 배경 위) → 02 Step Progress → 02b 안내 콜아웃(선택) → 03 Form Sections → 04 Summary Panel(선택) → 05 Footer Actions
  shell: admin-shell
  stepProgress: 가로 막대 + Step N (Done/Current/Todo) · padding 32/48 · 하단 border 1px · Step≥3 필수
  formSectionGap: 32px (섹션 사이)
  twoColumn: 메인 폼(FILL) + Summary/Preview 패널 400px (선택)
  footer: 좌 [이전 단계]·[임시저장] / 우 [다음 단계]·[등록](Solid) · Step1 좌측은 [목록으로](이전 단계 대신) · 마지막 Step 우측 [등록] · padding 24/48 · 상단 border 1px · bg surface · 뷰포트 하단 sticky
  introCallout: "02b 안내 콜아웃(선택) — info 카드(`--semantic-bg-status-info` #E5F2FF · radius 12 · padding 24): 제목 + 본문 + (선택)다운로드 버튼(outlined+download). NoticeAlert(48px strip) 아님 = Card + Button"
  fieldSpecSsot: cashwalk-biz-form-layout (라벨 컬럼·필드 높이·필수 마커 px)
  prdComponentMapping: ≤40자 TextInput · >40자 Textarea · 단일≤3 SelectionButtonGroup · 단일>3 Dropdown · 다중 CheckboxGroup · ON/OFF Toggle · 날짜 DateInput · 파일 ImageUpload
  requiredFieldProp: FormField required=true
  conditionalField: Boolean variant 또는 컨테이너 hide
  relatedPatterns: cashwalk-biz-page-patterns, cashwalk-biz-selection-pattern, cashwalk-biz-action-pattern, admin-shell, cashwalk-biz-form-layout, cashwalk-biz-input, cashwalk-biz-button, cashwalk-biz-step-progress, cashwalk-biz-tab
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3615-522
references:
  - label: 캐포비 Form 패턴 SSOT — 다단계 등록 (Figma 3615-522)
    image: references/cashwalk-biz-form-pattern-3615-522.png
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3615-522
    caption: Step Progress + FormSection 반복 + 우측 미리보기 패널 + 좌/우 분리 Footer. metrics 는 이 노드 실측 기준.
    brand: cashwalk-biz
  - label: 캐포비 Form docs — PRD→컴포넌트 매핑 포함 (Figma 3626-1041)
    image: references/cashwalk-biz-form-docs-3626-1041.png
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-1041
    caption: 언제 사용 · Section 구조 · Layout Spec · Validate Rule(PRD→컴포넌트 매핑) 원문 스펙 문서.
    brand: cashwalk-biz
---

## summary

캐시워크 포 비즈니스 어드민 **Form 패턴** — 다단계 입력으로 새 항목을 등록하는 화면. 구성: 01 Sidebar → 01b Page Header(title+부제, 페이지 배경 위) → 02 Step Progress → 02b 안내 콜아웃(선택) → 03 Form Sections(FormSection 반복) → 04 Summary/Preview Panel(선택, 우측 400px) → 05 Footer Actions. **필드 단위 실측(라벨 컬럼·필드 높이·필수 마커 등)은 `pattern:cashwalk-biz-form-layout` 이 SSOT** — 이 패턴은 페이지 조립(Step/섹션/요약/Footer) + **PRD→컴포넌트 매핑**을 정의. shell 은 `pattern:admin-shell`. 오버뷰 `pattern:cashwalk-biz-page-patterns`. Figma docs 3626-1041 / pattern 3615-522 실측 반영.

## rules

- **언제 쓰나**: PRD 에 '등록 / 만들기 / 생성 / 신규 / Step' 키워드가 있고, 여러 정책 옵션을 단계별로 설정하거나 '캠페인 → 광고 → 소재'처럼 계층 구조를 등록할 때. **단건(한 화면, Step Progress 없음) 폼이면 이 page-form 이 아니라 `pattern:cashwalk-biz-form-layout` 이 페이지 SSOT** — 이름이 비슷하니 주의: 단건=form-layout, 다단계=page-form.
- **01b Page Header**: 좌측 타이틀 Bold 32 **+ (있으면) 부제 16/24 #666**. **타이틀/부제 아래에 divider(라인·border-bottom·hr) 를 넣지 말 것** — 여백만으로 다음 영역과 분리한다. **페이지 배경 위에 얹는다 — 박스 sticky `nds-shell__topbar` 로 감싸지 말 것**(topbar 박스는 list/detail/dashboard 용). 상세 px 는 `pattern:cashwalk-biz-form-layout` 의 페이지 헤더 참조(여기서 중복 정의 X).
- **02 Step Progress**: 가로 막대 + Step N 라벨(Done / Current / Todo 상태). 다단계 등록일 때 사용 — Step ≥ 3 이면 필수. 영역 padding **32/48**, 하단 **border 1px**. 단건이면 생략.
- **02b 안내 콜아웃 (선택)**: 폼 본문 위에 이 화면의 목적을 설명하는 안내 카드 — 제목(예 '캠페인이란?') + 본문 + (선택)다운로드 버튼('상품 소개서'·'광고 가이드', outlined + download 아이콘). 톤은 info(파랑 `--semantic-bg-status-info` #E5F2FF) 카드(radius 12·padding 24). **NoticeAlert(48px 인라인 strip)로 만들지 말 것** — 제목+본문+액션 버튼이 있는 멀티라인 안내는 별물(Card + 다운로드 Button). 한 화면에 1개, 폼 섹션 위에만.
- **03 Form Sections**: **FormSection 컴포넌트 반복** — 각 섹션 = 제목(예: '광고 정보') + 설명 + 필드 슬롯(label-좌측 + 입력 + helper). 섹션 사이 gap **32px**. 필드 슬롯의 라벨 컬럼·필드 높이·필수 마커 등 px·색은 `pattern:cashwalk-biz-form-layout` 을 그대로 따른다(여기서 중복 정의 X).
- **04 Summary / Preview Panel (선택)**: 메인 폼 우측 보조 패널 **400px** — 예상 성과·미리보기·입력 요약. 2컬럼 = 메인 폼(FILL) + 패널 400px. 없으면 단일 컬럼.
- **05 Footer Actions**: 페이지 끝 Footer — **좌측 [이전 단계]·[임시저장] / 우측 [다음 단계]·[등록](Solid)**. **Step1(이전 단계 없음)은 좌측 [이전 단계] 대신 [목록으로](outlined + 좌측 chevron) + [임시저장], Step2+ 부터 [이전 단계]. 마지막 Step 우측은 [다음 단계] 대신 [등록](Solid).** Footer 영역 padding **24/48**, 상단 **border 1px**, 배경 `--semantic-bg-surface-default`, **뷰포트 하단 sticky 고정**(폼이 길어도 항상 보이게 — 본문과 같이 스크롤되는 인라인 바 아님). (단건 폼의 inline 센터 [취소][저장] 클러스터는 `cashwalk-biz-form-layout` 참조 — 다단계는 좌/우 분리 sticky Footer.)
- **01 Sidebar**: admin-shell 의 Sidebar 컴포넌트. ready-made items 는 `pattern:cashwalk-biz-admin-sidebar` 복붙 + activeKey 만 변경.
- **Validate — PRD → 컴포넌트 매핑(정량)**: 글자 ≤ 40 → **TextInput** / 글자 > 40 → **Textarea** / 단일 선택 ≤ 3 → **SelectionButtonGroup** / 단일 선택 > 3 → **Dropdown** / 다중 선택 → **CheckboxGroup** / ON·OFF 즉시 적용 → **Toggle** / 날짜·시간 → **DateInput** / 이미지·파일 → **ImageUpload**.
- **Validate — 구조**: Step ≥ 3 → Step Progress 필수 / 필수 필드 → FormField `required=true` / 조건부 노출 → Boolean variant 또는 컨테이너 hide.

## avoid

- **Page Header 타이틀 아래에 라인(divider·border-bottom·hr) 추가 — 금지.** 여백만으로 분리. `pattern:page-header` 의 하단 보더(rule ⑤)는 캐포비 admin 에서 켜지 말 것.
- 필드 높이·라벨 컬럼·필수 마커 px 를 이 패턴에 중복 정의 (cashwalk-biz-form-layout 이 SSOT)
- 단건 폼에 불필요한 Step Progress — Step ≥ 3 일 때만
- 다단계 Footer 를 inline 센터 클러스터로 — 다단계는 좌(이전/임시저장)·우(다음/등록) 분리 sticky Footer + 상단 border
- Step1 좌측을 [이전 단계]로 — 이전 단계가 없는 첫 Step 은 [목록으로]. 마지막 Step 우측은 [다음 단계] 가 아니라 [등록]
- 안내 콜아웃(제목+본문+다운로드 버튼)을 NoticeAlert(48px strip)로 — 멀티라인 안내 카드는 Card + 다운로드 Button(info 톤)
- 입력 타입을 임의 선택 — PRD→컴포넌트 매핑(글자수/선택수/타입)으로 결정
- 요약/미리보기 패널 폭을 400px 외로 임의 설정
