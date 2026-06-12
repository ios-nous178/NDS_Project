---
{}
---

## summary

HTML5 video 래퍼. 포스터/제목/길이 오버레이 + 커스텀 재생 UI 또는 nativeControls.

## pitfalls

- autoPlay는 muted=true와 함께가 아니면 브라우저가 차단. autoPlay만 단독으로 켜지 말 것.
- 유튜브/비메오 embed 용도가 아님 — src는 mp4/webm 같은 호스팅된 영상.
- 라이브 스트리밍/HLS는 미지원. HLS.js 등 별도 라이브러리를 video DOM에 부착하는 패턴 필요.
- nativeControls=true로 두면 커스텀 오버레이는 무시됨. 둘 중 하나만.

## recommended

- 명상 영상: <VideoPlayer src=... poster=... title='아침 명상' durationLabel='5:30' />
- 스토리 형식: aspectRatio='9 / 16'
- 자동 반복 미리보기: autoPlay muted loop

## examplesHtml.do

```html
<nds-video-player src="/intro.mp4" poster="/cover.jpg"
  title="첫 회기 안내" duration-label="3:42" muted></nds-video-player>
```

## examplesHtml.dont

```html
<!-- aspect-ratio 형식 위반 (CSS aspect-ratio 형식: "16 / 9") -->
<nds-video-player src="/v.mp4" aspect-ratio="16:9"></nds-video-player>
```
