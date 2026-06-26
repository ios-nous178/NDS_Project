---
"@nudge-design/react": patch
"@nudge-design/html": patch
"@nudge-design/tokens": patch
"@nudge-design/mcp": patch
---

Button — 캐시워크 ButtonGuide(Figma 262:1815) 정합: outlined-subtle variant · danger color · base S/XS 40/36

base 테마가 Cashwalk 이므로 base Button 을 캐시워크 ButtonGuide 에 맞췄습니다(전 프로젝트 공통).

- **variant="outlined-subtle" 신설** — 옅은 외곽선(borderRole.subtle)·가장 낮은 강조. 보조 옵션/선택지용. solid/soft/outlined 와 직교(primary·secondary·neutral·danger 전 color 지원).
- **color="danger" 신설** — red(시멘틱 status-error 토큰). 가이드 인가 조합은 danger·outlined-subtle(저강조 위험, 예: 삭제 보조)이나, 매트릭스 완전성을 위해 solid/soft/outlined 도 제공. raw hex 없이 status-error 토큰만 사용.
- **사이즈 S/XS = 40/36 으로 공통화** — base `sizing.button.sm` 42→40, `xs` 38→36(캐시워크 가이드). geniet·trost 가 갖고 있던 중복 height override 제거 → 공통값으로 통일(스페이싱 공통화와 동일 패턴). 모든 프로젝트 S/XS +−2px 미세 조정.
- react Button.tsx ↔ html nds-button.styles.ts styleMap 동기화, Storybook 스토리·MCP 가이드(colorMatrix/sizeMatrix) 갱신.
