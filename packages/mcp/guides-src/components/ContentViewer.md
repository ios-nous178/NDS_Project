---
{}
---

## summary

HTML/리치 텍스트 본문 렌더러. 위험 태그 자동 정리 + 이미지 lazy + 외부 링크 noopener 자동.

## pitfalls

- html prop은 가능한 한 호출부에서 sanitize한 안전한 HTML을 넘기는 게 정석. 컴포넌트 내장 sanitize는 보완책 (script/iframe/on*=/javascript: 정도만 정리).
- 사용자 입력 HTML은 반드시 서버나 DOMPurify 같은 라이브러리로 1차 처리 후 넘길 것 — 내장 sanitize는 알려진 attack vector만 커버.
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
