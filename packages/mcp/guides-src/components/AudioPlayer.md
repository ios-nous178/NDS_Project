---
{}
---

## summary

명상/이완 가이드 플레이어. 재생/일시정지/시크/이전/다음.

## pitfalls

- playing/currentTime/duration은 외부 상태 — useState + audio ref + timeupdate 이벤트로 동기화. DS는 UI만 제공.
- onSeek 미제공이면 슬라이더가 disabled. 시크 막을 거면 명시적으로.
- title prop도 HTMLDivElement.title과 충돌하지 않도록 Omit됨. ReactNode 가능.
- onSkipBack/Forward는 옵셔널 — 단일 트랙이면 둘 다 생략하면 표시 안 됨.

## recommended

- 10분 미만 단일 가이드: SkipBack/Forward 생략. 시리즈 재생만 둘 다 부착.

## examplesHtml.do

```html
<nds-audio-player title="3분 호흡 명상" subtitle="저녁용" duration="180"></nds-audio-player>
<script>el.addEventListener("audio-play", play);</script>
```

## examplesHtml.dont

```html
<!-- raw <audio controls> -> DS 스킨 / 진행도 라벨이 적용 안 됨 -->
<audio controls src="/m.mp3"></audio>
```
