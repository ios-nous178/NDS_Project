/**
 * Teamwork (팀워크) Brand Theme — cashwalk(캐시워크) accent 형제.
 *
 * cashwalk 구조·status·neutral CTA·input focus 를 그대로 상속하고 brand 색 슬롯만
 * **Cornflower** accent 로 스왑한다(디자이너 결정 2026-06-21 "브랜드 색 전면 스왑").
 * 팔레트는 cashwalk 와 동일(Cornflower 램프가 이미 cashwalk.palette 에 있음) — 재사용.
 *
 * 스왑 규칙·유지 슬롯은 cashwalk-accent.semantic.ts 참조.
 */

import type { ProjectTheme } from "./types.js";
import { cashwalkTheme } from "./cashwalk.js";
import { cashwalkAccentSemantic } from "./cashwalk-accent.semantic.js";

export const teamworkSemantic = cashwalkAccentSemantic("cornflower");

export const teamworkTheme: ProjectTheme = {
  name: "teamwork",
  actionsLayout: "end",
  palette: cashwalkTheme.palette, // cashwalk 와 동일 팔레트(cornflower=accent 포함)
  semantic: teamworkSemantic,
  elevation: cashwalkTheme.elevation, // cashwalk elevation(4단계) 상속
};
