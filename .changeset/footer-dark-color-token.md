---
"@nudge-design/styles": patch
---

Footer — dark web variant 의 텍스트 색을 raw hex 대신 semantic 토큰으로 교체.

`--nds-footer-color: #fff` → `cv.textRole.inverse`(`--semantic-text-inverse-default`). 배경(`cv.textRole.normal`)과 짝을 이루는 토큰 참조로 정리 — 시각 변화 없음, raw hex 위반 제거.
