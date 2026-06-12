---
metrics:
  placement: 본문 최상단(PageHeader 아래·탭/FilterBar 위) · 페이지당 1개 · 조건부 노출
  box: bg --semantic-bg-brand-subtle(#FFF4C0) · radius 16 · padding 20/24 · no shadow/border
  illustration: "@nudge-design/assets charge-alert-bell(종) · 60×60"
  title: "Bold 18/30 #383838"
  description: "Medium 16/24 #383838"
  cta: "우측 단일 Solid/Primary(노란 #FFD200 + 검정) pill — cashwalk-biz-button SSOT"
  relatedPatterns: cashwalk-biz-page-list, cashwalk-biz-page-form, cashwalk-biz-button, cashwalk-biz-page-patterns
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-21374
---

## summary

캐시워크 포 비즈니스 admin **광고비/충전 안내 배너** — 페이지 본문 상단(PageHeader 아래)에 얹는 soft 옐로우 알림 카드. 구성: 좌측 일러스트(@nudge-design/assets `charge-alert-bell`) + 제목/설명 + 우측 단일 CTA(노란 pill). NoticeAlert(48px 인라인 strip)·Banner(우측 이미지)·FloatingCtaBanner(하단 sticky pill)와 구분 — 일러스트 동반 멀티라인 안내 카드. Figma 3001-21374.

## rules

- **언제 쓰나**: 잔액 소진 임박 등 계정/광고 상태에 대한 능동 안내 + 즉시 행동(충전) 유도가 필요할 때. 단순 정책 안내는 page-form 의 02b 안내 콜아웃(info) 또는 NoticeAlert.
- **배치**: 리스트/폼 페이지 본문 최상단(PageHeader 아래, 탭/FilterBar 위). 페이지당 1개. 상시 노출이 아니라 조건 충족 시(잔액 임박)에만.
- **박스**: bg `--semantic-bg-brand-subtle`(soft 옐로우 #FFF4C0 계열) · radius **16** · padding 20/24 · 그림자·보더 없음 · 그라데이션 금지.
- **좌측 일러스트**: `@nudge-design/assets` 의 `charge-alert-bell`(종) — 표시 크기 60×60. 라인 아이콘으로 대체하지 말 것(일러스트 자산).
- **텍스트**: 제목 Bold **18/30** `--semantic-text-strong`(#383838) + 설명 Medium **16/24** 동일 계열. 제목에 개수/금액을 직접 박지 말고 본문에서 서술.
- **CTA**: 우측 단일 버튼 = cashwalk-biz **Solid/Primary(노란 #FFD200 + 검정 텍스트) · pill** (`pattern:cashwalk-biz-button` SSOT 그대로). 검정/파랑/outlined 로 바꾸지 말 것 · 버튼 2개 이상 금지(단일 행동).

## avoid

- 라인 아이콘으로 종 일러스트 대체 — 일러스트 자산(charge-alert-bell) 사용
- NoticeAlert(48px strip)로 제목+설명+CTA 욱여넣기 — 멀티라인 안내 카드는 별물
- CTA 를 검정/파랑/outlined 로 — 충전 같은 주 행동은 노란 Solid/Primary pill
- 배너를 페이지에 여러 개 쌓기 / 상시 노출 — 조건 충족 시 1개
- 그라데이션 배경 — 단색 brand-subtle 토큰만
