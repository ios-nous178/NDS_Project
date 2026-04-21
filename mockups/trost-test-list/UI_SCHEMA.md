# [TROST-TEST-LIST] UI Schema

## Schema (JSON)

```json
{
  "page": "TrostTestListPage",
  "sections": [
    {
      "id": "hero",
      "type": "Section",
      "children": [
        { "type": "Text", "variant": "h1", "content": "무료 심리검사 종류 & 자가진단" },
        { "type": "Text", "variant": "subtitle", "content": "우울증, 스트레스, 자존감..." },
        {
          "type": "Button",
          "variant": "primary",
          "size": "lg",
          "label": "3분만에 내 상태 확인하기",
          "action": "scrollTo:test-list"
        },
        {
          "type": "Grid",
          "columns": 4,
          "mobileColumns": 2,
          "children": [
            {
              "type": "Button",
              "variant": "soft",
              "label": "우울",
              "action": "navigate:depression-type-test"
            },
            {
              "type": "Button",
              "variant": "soft",
              "label": "스트레스",
              "action": "navigate:job-stress-test"
            },
            {
              "type": "Button",
              "variant": "soft",
              "label": "자존감",
              "action": "navigate:self-esteem-test"
            },
            {
              "type": "Button",
              "variant": "soft",
              "label": "모르겠다면 종합검사",
              "action": "navigate:comprehensive-test"
            }
          ]
        }
      ]
    },
    {
      "id": "info-hub",
      "type": "Section",
      "children": [
        { "type": "Text", "variant": "body", "content": "editorial-text-block" },
        {
          "type": "Grid",
          "columns": 4,
          "children": [
            { "type": "Badge", "color": "blue", "label": "증상형" },
            { "type": "Badge", "color": "green", "label": "자기 이해형" },
            { "type": "Badge", "color": "yellow", "label": "상황형" },
            { "type": "Badge", "color": "magenta", "label": "종합형" }
          ]
        }
      ]
    },
    {
      "id": "test-list",
      "type": "Section",
      "children": [
        { "type": "Text", "variant": "h2", "content": "무료로 할 수 있는 온라인 심리검사" },
        {
          "type": "Grid",
          "columns": 2,
          "mobileColumns": 1,
          "children": [
            {
              "type": "Card",
              "repeat": { "count": "tests.length", "template": "TestCard" },
              "slots": {
                "header": [
                  { "type": "Text", "variant": "rank" },
                  { "type": "Badge", "color": "dynamic", "label": "typeKeyword" }
                ],
                "body": [
                  { "type": "Text", "variant": "h3", "content": "testName" },
                  { "type": "Text", "variant": "body2", "content": "testDescription" }
                ],
                "footer": [
                  { "type": "Text", "variant": "caption", "content": "participants / duration" }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "id": "emotion-routing",
      "type": "Section",
      "children": [
        { "type": "Text", "variant": "h2", "content": "지금 내 감정/상황에 맞는 심리검사 추천" },
        {
          "type": "Grid",
          "columns": 4,
          "mobileColumns": 2,
          "mobileLastFullWidth": true,
          "children": [
            {
              "type": "Card",
              "slots": { "body": [{ "type": "Text", "content": "우울" }] },
              "action": "navigate:depression-type-test"
            },
            {
              "type": "Card",
              "slots": { "body": [{ "type": "Text", "content": "자존감" }] },
              "action": "navigate:self-esteem-test"
            },
            {
              "type": "Card",
              "slots": { "body": [{ "type": "Text", "content": "성격·기질" }] },
              "action": "navigate:personality-test"
            },
            {
              "type": "Card",
              "slots": { "body": [{ "type": "Text", "content": "스트레스" }] },
              "action": "navigate:job-stress-test"
            }
          ]
        }
      ]
    },
    {
      "id": "selection-guide",
      "type": "Section",
      "children": [
        { "type": "Text", "variant": "h2", "content": "심리검사 선택 가이드" },
        { "type": "Text", "variant": "body", "content": "guide-long-form-text" },
        {
          "type": "Grid",
          "columns": 2,
          "mobileHidden": true,
          "children": [
            {
              "type": "Card",
              "slots": { "body": [{ "type": "Text", "content": "증상 기준으로" }] }
            },
            {
              "type": "Card",
              "slots": { "body": [{ "type": "Text", "content": "상황 기준으로" }] }
            }
          ]
        }
      ]
    },
    {
      "id": "differentiator",
      "type": "Section",
      "children": [
        {
          "type": "Text",
          "variant": "h2",
          "content": "무료 온라인 심리 검사, 트로스트가 다른 이유"
        },
        {
          "type": "Grid",
          "columns": 3,
          "mobileColumns": 1,
          "children": [
            {
              "type": "Card",
              "slots": { "body": [{ "type": "Text", "content": "전문 심리검사 도구 기반" }] }
            },
            {
              "type": "Card",
              "slots": { "body": [{ "type": "Text", "content": "맞춤 결과 해석 제공" }] }
            },
            {
              "type": "Card",
              "slots": { "body": [{ "type": "Text", "content": "전문 상담사 연계" }] }
            }
          ]
        }
      ]
    },
    {
      "id": "faq",
      "type": "Section",
      "children": [
        { "type": "Text", "variant": "h2", "content": "무료 심리 검사 FAQ" },
        {
          "type": "Accordion",
          "repeat": { "count": "faqs.length", "template": "FAQItem" },
          "slots": {
            "trigger": [{ "type": "Text", "variant": "h3", "content": "question" }],
            "content": [{ "type": "Text", "variant": "body", "content": "answer" }]
          }
        }
      ]
    },
    {
      "id": "related-tags",
      "type": "Section",
      "children": [
        { "type": "Text", "variant": "h2", "content": "이런 검사도 찾고 있으신가요?" },
        {
          "type": "ChipGroup",
          "children": [
            {
              "type": "Chip",
              "variant": "outlined",
              "label": "tagLabel",
              "action": "navigate:linkedTest"
            }
          ],
          "repeat": { "count": "tags.length", "template": "TagChip" }
        }
      ]
    },
    {
      "id": "next-actions",
      "type": "Section",
      "children": [
        { "type": "Text", "variant": "h2", "content": "검사 후에는 다음 행동으로" },
        {
          "type": "Grid",
          "columns": 3,
          "mobileColumns": 1,
          "children": [
            {
              "type": "Card",
              "slots": { "body": [{ "type": "Text", "content": "전문 상담사 찾기" }] },
              "action": "navigate:find-counselor"
            },
            {
              "type": "Card",
              "slots": { "body": [{ "type": "Text", "content": "커뮤니티 보러가기" }] },
              "action": "navigate:community"
            },
            {
              "type": "Card",
              "slots": { "body": [{ "type": "Text", "content": "콘텐츠 보러가기" }] },
              "action": "navigate:contents"
            }
          ]
        }
      ]
    },
    {
      "id": "sticky-bottom-bar",
      "type": "StickyBottomBar",
      "children": [
        {
          "type": "Button",
          "variant": "primary",
          "size": "lg",
          "label": "무료 심리검사 시작하기",
          "action": "navigate:comprehensive-test"
        }
      ]
    }
  ]
}
```

## Coverage Report

### Covered (DS에 있는 컴포넌트)

- **Button** — Hero CTA, 감정 버튼, 하단 배너 CTA
- **Badge** — 검사 유형 키워드 (증상형/자기이해형/상황형/종합형)
- **Card** — 검사 카드, 감정 라우팅 카드, 차별점 카드, 다음 행동 카드
- **Chip** — 관련 검색 태그 칩
- **Toast** — (잠재적) 알림 피드백

### Missing (DS에 없는 컴포넌트)

- **Accordion** — FAQ 접기/펼치기 (현재 DS에 없음)
- **StickyBottomBar** — 하단 고정 배너 (현재 DS에 없음)

### Ambiguous (판단 필요)

- **없음**

### Product Comp 후보

- **TestCard** — 심리검사 전용 카드 (순위 + 유형 Badge + 참여인원 등). Card 조합으로 구성 가능하나 반복 사용될 패턴
- **EmotionRoutingCard** — 감정별 라우팅 카드 (아이콘 + 감정명). Card 조합으로 구성 가능
- **DifferentiatorCard** — 차별점 카드. Card 조합으로 구성 가능

### Coverage Rate

```
covered:    5 (Button, Badge, Card, Chip, Toast)
missing:    2 (Accordion, StickyBottomBar)
ambiguous:  0
total:      7
coverage_rate: 0.71 (71%)
```

## DS Gate 사전 판단

| Missing 컴포넌트    | 자동 분류                     | 근거                                                           |
| ------------------- | ----------------------------- | -------------------------------------------------------------- |
| **Accordion**       | DS 신규 후보 (사람 판단 필요) | FAQ, 가이드 등 여러 제품에서 재사용 가능성 높음. L2 Core 후보. |
| **StickyBottomBar** | DS 신규 후보 (사람 판단 필요) | CTA 바 패턴으로 여러 랜딩 페이지에서 재사용 가능. L2 후보.     |

**권장**: 두 컴포넌트 모두 범용성이 높아 DS L2 확장 제안. 단, POC 목업에서는 HTML+Tailwind로 임시 구현 후 DS 트랙에서 병렬 개발.
