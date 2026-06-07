---
"@nudge-design/mcp": patch
---

목업 작업 가이드에 기존 작업폴더 충돌 확인과 산출물 절대경로 보고를 강제한다.

- 새 목업 요청에서 같은 기획으로 보이는 작업폴더가 명백히 보이면 기존 폴더를 수정하기 전에 v2 생성 여부를 묻도록 CLAUDE.md/AGENTS.md 템플릿과 visual-reference 패턴 가이드에 hard gate를 추가.
- 목업 완료 응답에는 `dist/index.html` 상대경로만 쓰지 않고 최종 산출물 full 절대경로를 항상 포함하도록 완료 게이트와 셋업 안내를 보강.
