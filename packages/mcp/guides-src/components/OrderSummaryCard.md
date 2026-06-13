---
{}
---

## summary

**범용 요약 카드** (도메인 무관) — 라벨:값 행 + 강조 합계 + CTA 슬롯. 결제뿐 아니라 예약 확인·신청서 검토·구독 요약 등 "키-값 원장 + 합계" 패턴 전반에 쓰입니다(이름이 Order 로 시작하지만 커머스 전용 아님 — 추후 SummaryCard 별칭 후보). emphasis로 할인/안내 강조.

## pitfalls

- 할인은 emphasis='discount' (빨간색). 음수 금액에 직접 색칠하지 말 것.
- rows 너무 많으면(8+) 한 화면 정보 과다 — 핵심만 추려서.
- total은 ReactNode — PriceTag 또는 문자열 자유.

## recommended

- 결제: 상품 금액/쿠폰/포인트/배송비 + 합계
- EAP 무료 상담: 회사 부담 emphasis='info'

## examplesHtml.do

```html
<nds-order-summary-card title="결제 요약"
  rows='[{"label":"상품 가격","value":"50,000원"},{"label":"할인","value":"-5,000원"}]'
  total-label="합계" total="45,000원"></nds-order-summary-card>
```

## examplesHtml.dont

```html
<!-- rows 를 string 으로 — 줄이 렌더되지 않음. 반드시 JSON 배열 -->
<nds-order-summary-card rows="상품 50000"></nds-order-summary-card>
```
