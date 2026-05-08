# UI Schema — Trost 심리검사 목록 페이지 (v4)

## 페이지 IA 트리

```
<Page route="/test">
  <Trost.TrostDesktopHeader />              ← 디자인 시스템 기존
  <main>
    <HeroSection />                         ← 1
    <InfoHubSection />                      ← 2 (NEW)
    <TestListSection />                     ← 3
    <EmotionRoutingSection />               ← 4
    <SelectionGuideSection />               ← 5
    <WhyTrostSection />                     ← 6 (NEW)
    <FAQSection />                          ← 7
    <RelatedTagChipsSection />              ← 8
    <NextActionSection />                   ← 9
  </main>
  <Trost.TrostDesktopFooter />              ← 디자인 시스템 기존
  <StickyBottomCTA />                       ← 10 (sticky)
</Page>
```

## 컴포넌트 레지스트리

### 기존 (디자인 시스템)

| 이름                       | 출처               | 사용 위치                     |
| -------------------------- | ------------------ | ----------------------------- |
| `Button`                   | `@nudge-eap/react` | Hero CTA, 다음 행동, Sticky   |
| `Card`                     | `@nudge-eap/react` | InfoHub, 라우팅, FeaturePoint |
| `Chip`                     | `@nudge-eap/react` | 유형 뱃지, 태그칩             |
| `Badge`                    | `@nudge-eap/react` | NEW 표시                      |
| `Trost.TrostDesktopHeader` | `@nudge-eap/react` | 상단 고정 헤더                |
| `Trost.TrostDesktopFooter` | `@nudge-eap/react` | 하단 푸터                     |

### 신규 (이번 페이지 + 편입 대상)

#### `TestCard`

```ts
interface TestCardProps {
  id: string;
  rank: number; // 1~10 (정렬 표시용)
  title: string;
  thumbnailSrc: string; // 16:9
  kind: "증상형" | "자기 이해형" | "상황형" | "종합형";
  durationMinutes: number; // ex. 3
  participantCount: number; // ex. 123456
  href: string; // 검사 시작 페이지
  newBadge?: boolean;
}
```

#### `InfoHubCard`

```ts
interface InfoHubCardProps {
  kind: "증상형" | "자기 이해형" | "상황형" | "종합형";
  description: string; // 30~60자
  examples: string[]; // 매핑된 검사명 2~3개
  iconSrc?: string;
}
```

#### `RoutingCard`

```ts
interface RoutingCardProps {
  emotion: "우울" | "자존감" | "성격/기질" | "스트레스";
  subtitle: string; // "우울 유형 검사 바로가기"
  iconSrc?: string;
  href: string;
}
```

#### `FeaturePoint`

```ts
interface FeaturePointProps {
  iconSrc: string;
  title: string;
  description: string;
}
```

#### `FAQAccordion`

```ts
interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  defaultOpenIndex?: number; // default 0
  /** true면 JSON-LD FAQPage 스크립트도 자동 렌더 */
  emitJsonLd?: boolean;
}
```

#### `TagChipGroup`

```ts
interface TagChip {
  label: string;
  href: string;
}

interface TagChipGroupProps {
  chips: TagChip[];
  onClick?: (chip: TagChip) => void;
}
```

#### `StickyBottomCTA`

```ts
interface StickyBottomCTAProps {
  message: string; // "지금 바로 내 마음 상태 확인해보세요"
  ctaLabel: string; // "무료 심리검사 시작하기"
  ctaHref: string;
  zIndex?: number; // default: token zIndex.bottomFixedInput = 200
}
```

#### `NextActionCard`

```ts
interface NextActionCardProps {
  title: string; // "전문 상담사 찾기"
  description: string;
  ctaLabel: string;
  href: string;
  illustrationSrc?: string;
}
```

## 섹션별 JSX 의사코드

### 1) Hero

```tsx
<HeroSection>
  <h1>무료 심리검사 종류 - 나에게 맞는 자가진단 찾기</h1>
  <p className="sub">우울증 · 자존감 · 직무 스트레스까지...</p>
  <Button size="xl" onClick={scrollToList}>
    3분만에 내 상태 확인하기
  </Button>
  <div className="emotions">
    {emotions.map((e) => (
      <EmotionPill {...e} />
    ))}
  </div>
</HeroSection>
```

### 2) InfoHub

```tsx
<InfoHubSection>
  <h2>나에게 맞는 심리검사, 이렇게 고르세요</h2>
  <p className="long-form">{800~1000자 에디토리얼}</p>
  <div className="grid-4">
    <InfoHubCard kind="증상형" ... />
    <InfoHubCard kind="자기 이해형" ... />
    <InfoHubCard kind="상황형" ... />
    <InfoHubCard kind="종합형" ... />
  </div>
</InfoHubSection>
```

### 3) TestList

```tsx
<TestListSection id="test-list">
  <h2>무료로 할 수 있는 온라인 심리검사 Top 10</h2>
  <p>최근 7일간 가장 많이 한 순서대로 정렬했어요</p>
  <div className="grid">
    {tests.map((t) => (
      <TestCard {...t} />
    ))}
  </div>
  <script type="application/ld+json">{ItemListSchema}</script>
</TestListSection>
```

### 7) FAQ

```tsx
<FAQSection>
  <h2>무료 심리 검사 FAQ</h2>
  <FAQAccordion items={FAQ_ITEMS} emitJsonLd />
</FAQSection>
```

## 반응형 브레이크포인트

- `< 768px` — 모바일 (1열 주류, 그리드 2열)
- `768 ~ 1024px` — 태블릿 (Hero 가로 4열 감정 버튼 유지)
- `>= 1024px` — 데스크탑 (Grid 3~4열, sticky 헤더)

## 토큰 사용 맵

| 요소                         | 토큰                                     |
| ---------------------------- | ---------------------------------------- |
| Hero 배경                    | `semantic.primary.bg` (연노랑 #FFF8B8)   |
| Hero H1 색                   | `neutral[1000]` (#000)                   |
| 검사 유형 뱃지 배경          | `secondary.bgLighter` 변형 (유형별 상이) |
| 카드 radius                  | `radius.lg` (12)                         |
| 태그칩 radius                | `radius.xl` (20, pill)                   |
| FAQ hairline 보더            | `shadow.hairline`                        |
| Sticky CTA z-index           | `zIndex.bottomFixedInput` (200)          |
| Overlay (FAQ open 시 모바일) | `bg.overlay` (rgba(0,0,0,0.7))           |

## JSON-LD 샘플 (§3.7 FAQPage)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "심리검사는 무료로 할 수 있나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "트로스트의 심리검사는 모두 무료로 제공되며, 언제든지 부담 없이 바로 시작할 수 있습니다."
      }
    }
  ]
}
```
