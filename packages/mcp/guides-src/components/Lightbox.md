---
{}
---

## summary

이미지 풀스크린 확대 모달. 키보드(Esc/←/→) + 좌우 버튼 + 카운터 + 캡션.

## pitfalls

- body.overflow 잠금이 자동 처리. 외부에서 또 잠그지 말 것.
- 이미지 1장이면 좌우 네비 자동 숨김 — 외부에서 조건 분기 불필요.
- src는 미리 로드된 이미지 권장 — 큰 원본 이미지 직접 띄우면 첫 진입 지연.

## recommended

- 갤러리: 썸네일 그리드 + onClick으로 idx 설정 + open
- 단일: 이미지 1장 + caption로 컨텍스트 제공

## examplesHtml.do

```html
<nds-lightbox open index="0"
  images='[{"src":"/p1.jpg","alt":"사진 1","caption":"…"},{"src":"/p2.jpg","alt":"사진 2"}]'></nds-lightbox>
<script>el.addEventListener("lightbox-close", () => el.removeAttribute("open"));</script>
```

## examplesHtml.dont

```html
<!-- alt 누락 — 이미지 의미 전달 실패 -->
<nds-lightbox open images='[{"src":"/p.jpg"}]'></nds-lightbox>
```
