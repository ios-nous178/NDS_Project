---
"@nudge-design/tokens": patch
---

브랜드 프로필(brand-profiles) 신설 — 브랜드별 의미/정책 차이를 한 파일의 데이터로 수렴.
검정 CTA 매핑(캐포비 neutral · Geniet secondary), 금지 Button color, 모달 정책(confirm 검정 CTA·단일버튼 hug·세로스택 금지), 알림 컴포넌트 금지(캐포비 Toast), 어드민 Page Pattern System 적용 여부, slug 별칭(cashpobi 등)이 들어간다. 목업 validator 는 이제 브랜드 slug 를 하드코딩하지 않고 프로필을 읽는다 — 새 브랜드가 같은 정책을 선언하면 검증룰이 코드 수정 없이 그대로 적용된다.
