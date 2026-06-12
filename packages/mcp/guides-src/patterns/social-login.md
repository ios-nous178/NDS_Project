---
metrics:
  assets: "@nudge-design/assets/files/shared/sns-logos/{service}-{color}.svg (4 서비스 × 색상)"
  services: naver(white/main) · kakao(black/main) · google(white/main) · apple(white/black)
  layout: 풀폭 세로 스택 기본 · 가로 아이콘 행 보조
  heightBucket: 48px (pattern:action-row)
---

## summary

소셜/간편 로그인(네이버·카카오·구글·애플) 버튼. DS 는 4 서비스 × 색상 로고 자산(@nudge-design/assets `sns-logos/`, Figma 107:1045)을 제공한다 — **이니셜 텍스트(G/K/N)나 손글씨 SVG 로 때우지 말고 이 자산을 버튼에 박는다.** 자산은 brand 차원이 아니라 제3자 서비스 차원이라 모든 브랜드 화면에서 쓸 수 있고, 단일 HTML 목업은 `@nudge-design/assets/files/shared/sns-logos/{service}-{color}.svg` 를 `<img src>` 에 그대로 쓰면 build_singlefile_html 이 base64 인라인한다.

## rules

- do — 풀폭 브랜드 버튼 세로 스택: `<button style="height:48px;background:#FEE500"><img src="@nudge-design/assets/files/shared/sns-logos/kakao-black.svg" width="18" height="18" alt=""> 카카오로 시작하기</button>` (네이버는 bg #03C75A + naver-white, 구글은 흰 bg+보더 + google-main). don't — `<span>G</span><span>K</span><span>N</span>` 이니셜 텍스트.
- 서비스 식별은 **공식 로고 자산**으로 — `@nudge-design/assets/files/shared/sns-logos/{service}-{color}.svg`. 보유 조합: naver(white/main) · kakao(black/main) · google(white/main) · apple(white/black). 이니셜 글자(G/K/N)·이모지·손글씨 SVG 금지.
- 서비스 시그니처 색을 버튼 bg 로 — 카카오 #FEE500(로고 kakao-black) · 네이버 #03C75A(로고 naver-white) · 구글 흰 bg + 1px 보더(로고 google-main, 멀티컬러 G) · 애플 검정 bg(로고 apple-white). bg 와 대비되는 로고 색을 고른다.
- 라벨은 '○○로 시작하기' / '○○로 계속하기' 처럼 행동이 분명하게. 로고만 있는 아이콘 버튼이면 aria-label 로 서비스명 보강.
- 배치는 풀폭 세로 스택이 기본(식별·터치 영역 명확). 가로 아이콘 행(원형 버튼)은 보조 — 이때도 텍스트 이니셜이 아니라 로고 자산을 원 안에 넣는다.
- 버튼 높이는 폼의 다른 입력/CTA 와 같은 height bucket(48 권장)으로 맞춘다 — pattern:action-row.
- 현재 자산은 Runmile 라이브러리 원본이지만 제3자 서비스 자산이라 brand 무관하게 사용 가능. get_brand 의 snsLogos 가 해당 브랜드에 안 떠도 자산 경로로 직접 인라인하면 된다.

## avoid

- 이니셜/약자 텍스트(G·K·N)로 소셜 버튼을 표현 — 어떤 서비스인지 식별 불가 + 브랜드 가이드 위반.
- 로고를 raw <svg> 손글씨나 임의 이모지로 대체 — 공식 자산을 쓴다.
- 모든 서비스를 같은 회색/검정 버튼으로 통일 — 서비스 시그니처 색으로 구분되어야 즉시 인지된다.
- 상대경로(/sns-logos/x.svg)를 단일 HTML 목업에 쓰기 — 단독 파일에서 깨진다. inlineRef(@nudge-design/assets/files/…)로 써야 base64 인라인.
