---
{}
---

## summary

이미지 자르기 (circle/square). 드래그+줌, ref.toDataURL()로 PNG 추출.

## pitfalls

- 외부 이미지(https) 자르기는 CORS 헤더 필요 — 서버 응답에 Access-Control-Allow-Origin 없으면 dataURL이 비어나옴.
- outputSize는 보통 200-400 — 너무 작으면 화질 저하.
- CSS transform 기반 변환이라 매우 큰 이미지(>4000px)는 모바일에서 끊길 수 있음.

## recommended

- 프로필 사진: shape='circle' outputSize=200
- 커버: shape='square' size=320

## examplesHtml.do

```html
<nds-image-cropper src="/photo.jpg" shape="circle" output-size="512x512"
  label="프로필 사진 자르기"></nds-image-cropper>
<script>
// 적용 버튼에서 직접 호출:
const dataUrl = await document.querySelector("nds-image-cropper").toDataURL();
</script>
```

## examplesHtml.dont

```html
<!-- src 없이 즉시 노출 — 빈 영역만 보임 -->
<nds-image-cropper shape="circle"></nds-image-cropper>
```
