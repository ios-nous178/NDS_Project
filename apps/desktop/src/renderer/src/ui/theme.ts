/**
 * renderer/ui/theme.ts — 데스크탑 하네스 다크 톤 SSOT (Phase 6).
 *
 * 전체 UI 를 터미널 배경(#1e1e1e)에 맞춘 다크 그레이로 통일한다. 인라인 스타일을 계속
 * 쓰되 색/공통 버튼만 여기서 import 해 hex 산재를 막는다(VS Code 다크 계열 팔레트).
 */
export const c = {
  bg: "#1e1e1e",
  bgPanel: "#252526",
  bgElevated: "#2d2d30",
  bgHover: "#2a2d2e",
  border: "#3c3c3c",
  borderSubtle: "#333333",
  text: "#d4d4d4",
  textMuted: "#858585",
  textFaint: "#6a6a6a",
  // 포인트 = 옐로우(Nudge 브랜드 톤). 다크 위에서 채움엔 검정 글자(accentText).
  accent: "#ffd33d",
  accentText: "#1e1e1e",
  accentBg: "rgba(255, 211, 61, 0.14)",
  green: "#89d185",
  red: "#f48771",
  yellow: "#e2c08d",
} as const;

export const font = "ui-sans-serif, -apple-system, system-ui, 'Segoe UI', sans-serif";
export const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

/** 커스텀 타이틀바: 헤더 빈 영역으로 창을 드래그. 상호작용 요소엔 noDrag 를 줘야 클릭됨. */
export const dragRegion = { WebkitAppRegion: "drag" } as unknown as React.CSSProperties;
export const noDrag = { WebkitAppRegion: "no-drag" } as unknown as React.CSSProperties;

/** 투명 bg + 보더 pill 버튼 (레퍼런스의 'Max 5x'/'Plus' 느낌, 다크). */
export const pillBtn: React.CSSProperties = {
  padding: "4px 12px",
  borderRadius: 999,
  border: `1px solid ${c.border}`,
  background: "transparent",
  color: c.text,
  cursor: "pointer",
  fontSize: 12,
  lineHeight: 1.4,
};

export const pillBtnActive: React.CSSProperties = {
  ...pillBtn,
  background: c.accentBg,
  borderColor: c.accent,
  color: c.accent,
};

export const primaryBtn: React.CSSProperties = {
  padding: "5px 14px",
  borderRadius: 6,
  border: "none",
  background: c.accent,
  color: c.accentText,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
};

export const primaryBtnDisabled: React.CSSProperties = {
  ...primaryBtn,
  background: c.bgElevated,
  color: c.textFaint,
  cursor: "not-allowed",
};

export const ghostBtn: React.CSSProperties = {
  padding: "5px 12px",
  borderRadius: 6,
  border: `1px solid ${c.border}`,
  background: c.bgElevated,
  color: c.text,
  cursor: "pointer",
  fontSize: 12,
};

export const dangerBtn: React.CSSProperties = {
  ...primaryBtn,
  background: c.red,
  color: "#1e1e1e",
};

export const tabIdle: React.CSSProperties = {
  padding: "6px 12px",
  border: "none",
  borderBottom: "2px solid transparent",
  background: "transparent",
  color: c.textMuted,
  cursor: "pointer",
  fontSize: 12,
};

export const tabActive: React.CSSProperties = {
  ...tabIdle,
  color: c.text,
  borderBottomColor: c.accent,
};

export const input: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "7px 10px",
  borderRadius: 6,
  border: `1px solid ${c.border}`,
  background: c.bg,
  color: c.text,
  fontSize: 13,
  fontFamily: font,
};
