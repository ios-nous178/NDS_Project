---
"@nudge-design/react": major
"@nudge-design/html": major
"@nudge-design/styles": major
"@nudge-design/mcp": minor
---

컴포넌트 9종 제거 (BREAKING).

다음 컴포넌트를 react/styles/html 3면과 MCP 카탈로그·가이드에서 모두 제거했습니다:

- `ImageCropper` (`nds-image-cropper`)
- `PinPad` (`nds-pin-pad`)
- `SignaturePad` (`nds-signature-pad`)
- `VoiceRecorder` (`nds-voice-recorder`)
- `WaveformPlayer` (`nds-waveform-player`)
- `CoachMark` (`nds-coach-mark`)
- `Lightbox` (`nds-lightbox`)
- `PullToRefresh` (`nds-pull-to-refresh`)
- `ScoreGauge` (`nds-score-gauge`)

영향:

- `@nudge-design/react` — 위 컴포넌트 export 제거. (`GaugeLevel`·`CoachMarkPlacement` 등 동반 타입 포함)
- `@nudge-design/html` — `nds-*` 커스텀 엘리먼트 정의·런타임 등록·배럴 export 제거.
- `@nudge-design/styles` — 번들 `styles.css` 에서 해당 컴포넌트 스타일 제거.
- `@nudge-design/mcp` — 카탈로그·컴포넌트 가이드에서 제거. `get_guide({ topic: 'component:<Name>' })` 가 더 이상 위 컴포넌트를 반환하지 않습니다.

`viz-svg` 공유 헬퍼는 `Sparkline`/`CircularProgress` 가 계속 사용하므로 유지됩니다. `VerificationCodeInput`·`Tooltip`·`FormField`·`CircularProgress` 등 잔존 컴포넌트의 교차 안내 문구에서 제거된 컴포넌트 언급도 정리했습니다.
