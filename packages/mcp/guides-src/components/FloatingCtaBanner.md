---
figmaNodeUrl: https://www.figma.com/design/xElupkAmYc8zHCiq0fowLD/?node-id=91-3
sizeMatrix:
  pcWidth: 440px (min-width) — fixed 추천
  pcHeight: 68px
  pcPadding: 14px 24px 14px 16px
  pcIcon: 48 × 48
  pcCaption: Body3 14/20 Regular · cv.textRole.subtle
  pcCtaText: Body1 16/24 Bold · cv.textRole.brand
  pcArrow: 20 × 20 · ChevronRightIcon · currentColor (project)
  pcBottomOffset: 32px (기본)
  pcGap: 12px (icon ↔ text)
  mobileWidth: 288px (min-width)
  mobileHeight: 60px
  mobilePadding: 12px 16px 12px 12px
  mobileIcon: 32 × 32
  mobileCaption: Caption2 12/16 Regular · cv.textRole.subtle
  mobileCtaText: Caption1 13/18 Bold · cv.textRole.brand
  mobileArrow: 16 × 16 · ChevronRightIcon
  mobileBottomOffset: 16px (기본)
  mobileGap: 8px
  radius: pill (radius.full = 9999) — 완전 캡슐형
  border: 1px solid cv.borderRole.brand
  background: cv.surface.default (#FFFFFF 고정)
  shadow: shadow[2] = 0 4px 12px rgba(0,0,0,0.10) (가이드의 0.08 와 가장 가까운 토큰)
stateMatrix:
  default: border project · shadow overlay (shadow[2])
  hover: translateY(-1px) · shadow[3] — PC only
  active: translateY(0) · shadow[1]
  floating: position:fixed · left:50% · translateX(-50%) · z-index sticky(200) · bottom=bottomOffset
  note: Disabled 상태는 정의하지 않음 — CTA 진입 트리거이므로 항상 active.
usagePolicy:
  useFor:
    - 음식/검색 결과 0건 페이지 하단 floating 진입 배너 (Geniet 식단 도메인 패턴)
    - 단일 메시지 + 단일 액션의 하단 sticky CTA 모듈
  doNotUseFor:
    - 다중 액션 (버튼 2개 이상) — Bottom Sheet 또는 Modal
    - 긴 안내문 + 액션 — Banner (페이지 상단 띠)
    - 토스트성 일시 알림 → Toast / Snackbar
    - 사이드바 카드형 진입 → Card
  limits:
    captionLines: 1
    ctaTextLines: 1
    actionsPerBanner: 1
    radiusVariants: pill 만 (직사각형 금지)
---

## summary

페이지 하단 sticky CTA 배너. pill (radius 100) + project border 1px + shadow. 좌측 일러스트(leadingIcon) + 캡션(보조) + 강조 CTA 텍스트 + 우측 chevron 아이콘. 기본 `floating=true` 시 position:fixed 로 화면 하단 중앙 자동 고정.

## pitfalls

- Chevron 은 텍스트 '>' 로 그리지 말 것 — 내부에서 `<ChevronRightIcon>` 아이콘으로 자동 렌더. showArrow=false 로 숨김만 가능.
- Border / CTA / Arrow 색은 모두 시멘틱(`cv.borderRole.brand`, `cv.textRole.brand`) 참조 — raw hex override 금지. 프로젝트별 실제 매핑(예: Geniet mint, NudgeEAP blue)은 `packages/tokens/src/projects/*.semantic.ts` 에 정의.
- CTA 텍스트 색은 `cv.textRole.brand` 고정 — underline / weight 변경 / 다른 강조색 적용 금지.
- radius 는 항상 pill (`radius.full`) — 직사각형 radius 8/12 변형 금지 (Figma DO/Don't 룰).
- floating=true 시 부모에 `position: relative` 가 있어도 화면 fixed — 컨테이너 내부 sticky 가 필요하면 floating=false + 부모에서 직접 position:sticky 처리.
- 캡션은 1줄 ellipsis 고정 — 두 줄 wrap 금지. 메시지 길면 ctaText 로 옮기거나 캡션 자체를 줄일 것 (단일 메시지 + 단일 액션 원칙).
- 다중 CTA(버튼 2개 이상) 사용 금지 — 이 컴포넌트는 단일 액션 floating 진입 배너 전용.
- PC size 는 height 68 / Mobile size 는 height 60 — 두 사이즈 외에 커스텀 height 금지 (specs 표 기준).

## recommended

- 검색 결과 0건 또는 카테고리 진입 시: <FloatingCtaBanner caption="찾는 음식이 없으신가요?" ctaText="음식 직접 등록하러 가기" leadingIcon={<SaladIcon/>} onClick={…} />
- 반응형: 모바일 < 768px 에서 size="mobile" 로 분기 (자동 분기 없음 — 외부 미디어쿼리/JS 로 결정).
- Bottom Nav / Safe Area 가 있으면 `bottomOffset` 을 그 만큼 더해 겹침 방지.
- 인라인 배치가 필요하면 floating=false — 부모 폭에 맞춰 inline-flex 로 렌더.

## accessibility

- 전체가 <button type='button'>. ariaLabel 미지정 시 ctaText 가 string 이면 그걸 그대로 사용.
- leadingIcon / arrow 는 aria-hidden — 음성 인식 시 ctaText 만 읽힘.
- ctaText 가 ReactNode(아이콘 포함 등) 면 ariaLabel 명시적으로 넘길 것.

## examplesHtml.do

```html
<nds-floating-cta-banner caption="상담사 매칭이 완료됐어요"
  cta-text="확인하기" floating size="mobile" bottom-offset="80"></nds-floating-cta-banner>
<script>el.addEventListener("nds-floating-cta-click", () => navigate("/match"));</script>
```

## examplesHtml.dont

```html
<!-- floating + bottom-offset 0 — 하단 탭바를 가림 -->
<nds-floating-cta-banner floating bottom-offset="0"></nds-floating-cta-banner>
```
