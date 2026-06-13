---
{}
---

## summary

HTML/리치 텍스트 본문 렌더러. allowlist 기반 sanitize(허용 prose 태그/속성/URL 스킴만) + 이미지 lazy + 외부 링크 noopener 자동.

## pitfalls

- 내장 sanitize는 allowlist 방식 — 허용 prose 태그(p/h1-6/ul/ol/li/blockquote/pre/code/table/a/img/strong/em…)·속성·http(s)/mailto/tel/상대 URL 만 남기고 나머지는 unwrap·제거(클라이언트 DOM). 문자열 단계에서 script/iframe/on*=/javascript:/vbscript: 도 선제거.
- 그래도 신뢰할 수 없는 사용자 입력은 서버나 DOMPurify 로 1차 처리 후 넘기는 게 안전(심층 방어) — 내장 sanitize 는 클라이언트에서만 allowlist 를 강제하고, SSR 동기 출력은 문자열 1차 방어까지만 적용된다.
- 내부 링크는 그대로 — http(s)로 시작하는 외부 링크에만 target=_blank + rel='noopener noreferrer' 자동.
- 본문 안 table/blockquote/pre 까지 표준 스타일 적용됨 — 검사 해설/명상 가이드 등 긴 본문에 적합.

## recommended

- 검사 결과 해설, 명상 가이드 본문, 정신건강 콘텐츠 — externalLinkBlank로 외부 참고자료 안전 노출
- 이미지 많은 본문은 imageLazy로 초기 렌더 부담 감소

## examplesHtml.do

```html
<nds-content-viewer html="&lt;p&gt;안전한 본문&lt;/p&gt;"></nds-content-viewer>
```

## examplesHtml.dont

```html
<!-- 사용자 입력 HTML 을 no-sanitize 로 그대로 — XSS 위험 -->
<nds-content-viewer no-sanitize html="…사용자 HTML…"></nds-content-viewer>
```
