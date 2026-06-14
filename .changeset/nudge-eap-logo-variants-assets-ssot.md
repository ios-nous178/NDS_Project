---
"@nudge-design/assets": minor
---

NudgeEAP 로고 변종(koen/ko/en/en-dark/symbol)과 DAIN 마크의 SVG base64 dataURI 를 assets SSOT(`brand-logo-defaults` + `brand-logo-manifest`)에 추가했습니다.

이전에는 이 변종들의 base64 가 react `NudgeEAPLogo` 컴포넌트 안에만 있어, assets 매니페스트의 해당 파일명들은 빈 fallback(`""`)을 반환했습니다. 이제 모든 NudgeEAP 로고 변종이 `@nudge-design/assets` 에서 정상 dataURI 로 제공됩니다(`nudge-eap-logo.svg` 도 PNG fallback → 실제 SVG dataURI 로 교정).
