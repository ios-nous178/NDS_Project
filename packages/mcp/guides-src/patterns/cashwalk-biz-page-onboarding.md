---
examples:
  - verdict: good
    source: Figma 3611-2 (캐포비 Onboarding 패턴 — 로그인 / 아이디 찾기 / 비밀번호 찾기)
    caption: 탈색 회색 캔버스 중앙 480px 카드. 01 Logo(중앙) → 02 Form(로그인=TextInput / 찾기=RadioGroup) → 03 Primary CTA(Solid/Primary/X-Large FILL yellow) → 04 Helper(TextButton). 세 화면 동일 골격.
  - verdict: bad
    source: 잘못된 온보딩 화면
    caption: 사이드바 부착 + 가변 폭 카드 + 좁은/2개 CTA + 보조 링크를 solid 버튼으로 — Onboarding 패턴 위반.
metrics:
  status: Figma 실측 반영 (docs 3626-792 / pattern 3611-2)
  composition: 01 Logo → 02 Form → 03 Primary CTA → 04 Helper
  shell: none (비로그인 — admin-shell 미적용)
  cardWidth: 480px (고정)
  cardPadding: 48px
  cardRadius: 16px (--semantic-bg radius/16)
  cardBg: --semantic-bg-surface-default (#FFFFFF)
  canvasBg: --semantic-bg-surface-subtle (#FAFAFA)
  cardItemSpacing: 40px (큰 단위 그룹간)
  cardAlign: vertical + horizontal center
  logo: BrandLogo 컴포넌트 — <nds-brand-logo brand='cashwalk-biz'> / <BrandLogo brand='cashwalk-biz' /> (중앙 정렬, height~40, data URI 내장). 전 온보딩 화면 가로형 lockup 통일 — 사이드바와 동일 로고 SSOT. (Figma 3611-2 로그인 화면은 세로형 lockup 으로 그려졌으나 DS 는 세로형 에셋이 없어 가로형으로 통일 — 의도된 divergence.)
  formLogin: TextInput (ID + Password eye 토글)
  formFind: RadioGroup (찾기 방법 선택 — 전화/이메일)
  primaryCta: "Button Solid/Primary/X-Large 가로 FILL · #FFD200 + 검정"
  helper: TextButton(Medium) 보조 링크
  validateStepThreshold: Step ≥ 3 → Multi-step Onboarding
  validateFieldThreshold: 필드 > 5 → cashwalk-biz-page-form 전환
  maxPrimarySolidPerScreen: 1
  relatedPatterns: cashwalk-biz-page-patterns, cashwalk-biz-button, cashwalk-biz-input
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3611-2
references:
  - label: 캐포비 Onboarding 패턴 SSOT — 로그인/아이디찾기/비밀번호찾기 (Figma 3611-2)
    image: references/cashwalk-biz-onboarding-3611-2.png
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3611-2
    caption: 세 인증 화면이 동일한 480px 중앙 카드 골격. 본 가이드 metrics 는 이 노드 실측 기준.
    brand: cashwalk-biz
  - label: 캐포비 Onboarding docs (Figma 3626-792)
    image: references/cashwalk-biz-onboarding-docs-3626-792.png
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3626-792
    caption: 언제 사용 · 지원 화면 · Section 구조 · Layout Spec · Validate Rule 원문 스펙 문서.
    brand: cashwalk-biz
---

## summary

캐시워크 포 비즈니스 어드민 **Onboarding 패턴** — 로그인 · 아이디 찾기 · 비밀번호 찾기 등 인증 진입 화면. shell(사이드바/네비) 없이 탈색 회색 캔버스 중앙에 480px 고정 카드 1개. 구성: 01 Logo → 02 Form → 03 Primary CTA → 04 Helper. 오버뷰 `pattern:cashwalk-biz-page-patterns`. CTA/입력 실측은 `pattern:cashwalk-biz-button` · `pattern:cashwalk-biz-input`. Figma docs 3626-792 / pattern 3611-2 실측 반영.

## rules

- **언제 쓰나**: PRD 에 '로그인 / 회원가입 / 비밀번호 찾기 / 이메일 인증 / 가입 완료' 키워드가 있고, 사이드바·네비게이션 없이 단독 흐름으로 진행되며, 단일 목적 + 단일 폼 + 단일 CTA 로 구성되는 화면.
- **중앙 카드 1개 (shell·GNB 없음)**: 비로그인 상태라 admin-shell(사이드바/topbar) **그리고 상단 GNB/글로벌 헤더 둘 다 미적용**. 캔버스 배경 = `--semantic-bg-surface-subtle`(#FAFAFA 탈색 회색), 그 위에 카드를 **수직+수평 중앙** 정렬. ⚠️ 상단에 GNB 바(raw `<header>`/`.topbar`/`nds-header`)를 두고 로고를 텍스트("cashwalk for business")로 박지 말 것 — 브랜드 식별은 **카드 안 `<nds-brand-logo>` 에셋 하나뿐**(validator `cashwalk-biz-onboarding-no-gnb` error).
- **카드 규격**: 폭 **480px 고정**, padding **48px**, 배경 `--semantic-bg-surface-default`(#FFFFFF), radius **16px**. 카드 내부 큰 단위 그룹(로고/폼/CTA/헬퍼) 간 간격 **40px**(itemSpacing). ⚠️ **카드 패딩을 빼면 CTA·컨텐츠가 카드 모서리에 full-bleed 로 붙는다** — full-width CTA 도 이 48px 패딩 *안에서* 카드 폭을 채워야지 모서리에 붙으면 안 됨(validator `onboarding-card-no-padding` error). `<nds-card>` 로 쓰면 패딩이 자동 적용된다.
- **01 Logo**: 카드 상단 중앙 정렬. **BrandLogo 컴포넌트로 박는다** — HTML `<nds-brand-logo brand="cashwalk-biz">` / React `<BrandLogo brand="cashwalk-biz" />`. 사이드바와 동일한 로고 SSOT 가 data URI 로 내장돼 단일 HTML 에서도 안 깨진다. **35KB base64 를 손으로 붙이거나 raw <img>/SVG 로 조립 금지**(모지바케·로고 유실 회귀의 직접 원인). 찾기 화면은 로고 아래 안내문(예: '캐시워크 for 비즈니스 계정의 아이디를 찾을 방법을 선택해 주세요.')을 둔다.
- **02 Form**: 로그인 화면은 **TextInput**(ID + Password, Password 는 eye 토글). 아이디/비밀번호 찾기 화면은 **RadioGroup**(찾기 방법 선택 — 전화/이메일). 입력 단위 스타일은 `pattern:cashwalk-biz-input`.
- **03 Primary CTA (단일 액션 화면)**: 로그인·찾기처럼 액션이 **하나뿐**인 화면은 Button **Solid / Primary / X-Large**, 가로 **FILL**(카드 폭 가득) — `<nds-button full-width>`. 캐포비 brand yellow(#FFD200) + 검정 텍스트. 화면당 primary CTA 1개. ⚠️ **모달 단일버튼(우측 hug)과 혼동 금지** — 단일 액션 온보딩 CTA 는 full-width 가 하드 계약(validator `onboarding-cta-not-fullwidth` error). 모달 단일버튼은 반대로 hug 우측정렬. (`pattern:cashwalk-biz-button`)
- **03b Footer Nav (멀티스텝 화면)**: 가입 심사처럼 **이전/다음(제출)** 이 있는 멀티스텝은 버튼을 카드 안에 넣지 않는다 — **카드(섹션) *아래* 분리된 캔버스 행**에 둔다(흰 바·상단 border·sticky 없음, 카드와 gap). **좌측 [이전 단계]**(Outlined, hug) + **우측 [다음 단계]/[제출]**(Solid/Primary, hug, 우측정렬). 멀티스텝 푸터의 버튼은 full-width 가 아니라 **hug** (validator 가 이전버튼/Stepper 존재를 감지해 full-width 강제를 면제). **제출(다음) Primary 버튼도 카드 안에 넣지 말 것** — 카드 안 Primary solid 는 `onboarding-multistep-cta-inside-card` error(이전버튼을 텍스트 링크로 두고 제출을 카드 안 full-width 로 박는 회귀 차단). 이전버튼을 카드 안에 넣으면 `onboarding-back-button-inside-card` warn. **상단엔 진행 표시 `Stepper`**(component:Stepper, variant=bar/numbered) — `Stepper` 가 있으면 validator 가 멀티스텝으로 인식한다.
- **03c 본인 인증 Section (휴대폰/이메일 → 인증번호)**: 연락처 입력(전화/이메일 TextInput) → **[인증번호 전송/재전송]은 별도 full-width 검정 버튼**(`<nds-button color="neutral" full-width>` — primary 노랑 아님, 인라인 버튼도 아님) → 그 아래 **인증번호 입력 = FieldActionRow(action 생략) + 코드 입력 + 우측 인라인 타이머**. 타이머는 `CountdownTimer tone="brand"`(캐포비 오렌지 #FD9B02). 인증 입력엔 인라인 확인 버튼을 두지 않고, 확정은 하단 [다음](primary full-width)으로 한다. raw <input> 6칸·자작 +/- 금지(`verification-manual-assembly` warn) — `nds-verification-code-input` 단일 박스 사용.
- **04 Helper**: 보조 링크는 **TextButton(Medium)** — 로그인 화면의 '아이디 찾기 | 비밀번호 찾기', 가입 유도 등. solid 버튼으로 만들지 않는다.
- **상태 분기는 같은 골격**: 로그인 / 아이디 찾기 / 비밀번호 찾기는 동일한 480px 중앙 카드 레이아웃의 변형. 화면마다 다른 골격을 만들지 않는다.
- **Validate**: ① 멀티스텝(이전/다음·제출) → 상단 진행 `Stepper`(component:Stepper) + 카드 아래 분리 Footer Nav(위 03b). ② Form 필드 > 5 → `pattern:cashwalk-biz-page-form` 전환 검토. ③ 외부 인증(SMS/Email) 필요 → **본인 인증 Section(위 03c)** 추가. ④ 이용약관 동의 필요 → Form 위에 CheckboxGroup 추가.

## avoid

- 온보딩 카드에 사이드바/topbar(admin-shell) 부착 — 비로그인 인증 화면은 중앙 카드만
- 상단 GNB/글로벌 헤더(raw <header>/.topbar/nds-header) 부착 + 텍스트 로고("cashwalk for business") — 온보딩은 GNB 없음, 로고는 카드 안 <nds-brand-logo> 에셋만 (`cashwalk-biz-onboarding-no-gnb`)
- 카드에 패딩을 안 줘서 CTA·컨텐츠가 카드 모서리에 full-bleed 로 붙기 — 카드 padding 48px(또는 <nds-card>) 필수 (`onboarding-card-no-padding`)
- 멀티스텝(Stepper 있음) 제출 버튼을 카드 안 full-width 로 박기 — 카드 아래 footer-nav 우측 hug 로 (`onboarding-multistep-cta-inside-card`)
- 카드 폭을 480px 외 값으로 (고정 폭 패턴)
- 로그인·아이디찾기·비밀번호찾기마다 다른 레이아웃 골격
- **단일 액션 화면**의 Primary CTA 를 카드 폭보다 좁게(hug) / 2개 이상 / outlined 로 (단, 멀티스텝은 이전+제출 footer nav 가 정상 — 위 03b)
- 멀티스텝의 [이전 단계]/제출 버튼을 카드 *안*에 넣기 — 카드와 분리해 하단 캔버스 footer nav 로 (`onboarding-back-button-inside-card`)
- 보조 링크(찾기·가입)를 solid 버튼으로 — TextButton(Medium) 텍스트 링크가 맞다
- 로고를 raw <img>/SVG 로 조립하거나 35KB base64 를 손으로 붙이기 — `<nds-brand-logo brand="cashwalk-biz">` / `<BrandLogo brand="cashwalk-biz" />` 사용
- 필드 6개 이상·3스텝 이상을 단일 온보딩 카드에 욱여넣기 (Validate Rule 위반 → Form/Multi-step 전환)
