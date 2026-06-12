---
{}
---

## summary

일반 이미지 표준 — aspectRatio + fit + rounded + lazy + fallback + placeholder. Avatar(사람 얼굴)와 다른 콘텐츠 이미지용.

## pitfalls

- Avatar는 사람 얼굴/이니셜 전용 — 콘텐츠 썸네일·검사 결과 이미지·일반 이미지는 MediaThumbnail.
- aspectRatio 미지정 시 부모 너비에 따라 의도치 않은 높이가 잡힐 수 있음 — 카드/그리드에서는 명시 권장.
- alt는 필수 — 장식 이미지면 빈 문자열(alt="") 명시.
- fallbackSrc는 onError 시 한 번 시도 → 그래도 실패면 placeholder. 무한 루프 방지를 위해 fallback 자체가 또 실패하면 placeholder만 표시.
- rounded="pill"는 정사각형(aspectRatio="1/1")과 함께 써야 자연스러움 — 직사각형에 pill은 길쭉한 알약 모양.

## recommended

- 콘텐츠 카드 썸네일: aspectRatio="16/9" rounded="md"
- 리스트 썸네일: aspectRatio="1/1" rounded="md" width=64
- 프로필성 이미지지만 Avatar로 처리 어려운 케이스: aspectRatio="1/1" rounded="pill"

## examplesHtml.do

```html
<nds-media-thumbnail src="/thumb.jpg" alt="썸네일"
  width="120" fit="cover" rounded="md"></nds-media-thumbnail>
```

## examplesHtml.dont

```html
<!-- alt 누락 + fallback 없음 — 로드 실패 시 빈 박스 -->
<nds-media-thumbnail src="/thumb.jpg"></nds-media-thumbnail>
```
