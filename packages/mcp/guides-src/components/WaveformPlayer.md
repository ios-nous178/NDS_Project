---
{}
---

## summary

음성 메시지 재생 (파형 시각화). AudioPlayer가 트랙바 형태라면 WaveformPlayer는 컴팩트 메시지용.

## pitfalls

- peaks 미지정 시 src 기반 의사 랜덤 — 정확한 파형이 필요하면 서버 메타데이터로 전달.
- 긴 콘텐츠(>5분)는 AudioPlayer가 더 적합.
- 막대 개수(bars)는 32-48 권장. 너무 많으면 모바일에서 막대가 1px 미만으로 줄어듦.

## recommended

- 채팅 음성 메시지: 기본 사용
- 내 메시지: color=primary, 상대 메시지: color='#666'

## examplesHtml.do

```html
<nds-waveform-player src="/voice.mp3" bars="36"
  peaks="[0.3,0.5,0.7,0.4,0.6,0.8]"></nds-waveform-player>
```

## examplesHtml.dont

```html
<!-- raw <audio controls> 로 음성 메모 표시 — 파형/색/진행도 토큰 미적용 -->
<audio controls src="/voice.mp3"></audio>
```
