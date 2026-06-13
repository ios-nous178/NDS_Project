---
{}
---

## summary

종료 시각까지 자동 카운트다운. 1초 단위 갱신, 10초 이하 빨강 강조, mm:ss/hh:mm:ss/remaining 포맷. **tone="brand"** 면 진행 중 시간을 브랜드 액센트색(캐포비=오렌지 #FD9B02)으로 — 인증 입력의 타이머처럼 강조할 때. (urgent ≤10s 빨강은 tone 과 무관하게 우선.)

## pitfalls

- endsAt을 매 렌더 새로 계산하면 카운트가 흔들림 — useMemo로 고정.
- onComplete는 0초 도달 시 1회만. 재시작은 endsAt을 새로 set.
- remaining 포맷은 자연어 — 정확한 카운트가 필요하면 mm:ss/hh:mm:ss.
- 기본 색은 텍스트 기본(회색계). 캐포비 본인인증 코드 입력의 오렌지 타이머처럼 강조하려면 tone="brand" (react `tone="brand"` / html `tone="brand"`). 인증 코드 입력 우측에 겹쳐 배치할 때도 컴포넌트 자체 색이 기본 회색이라, 캐포비 오렌지로 보이려면 반드시 tone="brand" 를 줘야 한다.

## recommended

- 인증 만료: useMemo로 expiry 고정 + onComplete로 재발송
- 라이브 시작: format='remaining' (자연어)
- 마감 카운트: 임박 시 빨강 강조 자동

## examplesHtml.do

```html
<nds-countdown-timer ends-at="2026-12-31T23:59:59+09:00"
  label="이벤트 종료까지" expired-text="이벤트가 종료되었어요"></nds-countdown-timer>
```

## examplesHtml.dont

```html
<!-- ends-at 이 과거값이고 expired-text 누락 — '0초' 가 영원히 표시됨 -->
<nds-countdown-timer ends-at="2020-01-01T00:00:00Z"></nds-countdown-timer>
```
