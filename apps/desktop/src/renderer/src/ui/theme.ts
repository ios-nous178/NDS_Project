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
  // 포인트 = 옐로우(Nudge 프로젝트 톤). 다크 위에서 채움엔 검정 글자(accentText).
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

/**
 * 모든 버튼 공통 — macOS Chromium 의 네이티브 버튼 베젤(투명 bg 위에 검정 링으로 보임)과
 * 기본 focus outline 을 제거한다. 인라인이라 UA 스타일(:focus 포함)을 무조건 이긴다.
 * 각 버튼 스타일이 이걸 spread 로 먼저 깔고 시작한다.
 */
export const btnReset = {
  WebkitAppearance: "none",
  appearance: "none",
  outline: "none",
  boxShadow: "none",
} as unknown as React.CSSProperties;

/** 투명 bg + 보더 pill 버튼 (레퍼런스의 'Max 5x'/'Plus' 느낌, 다크). */
export const pillBtn: React.CSSProperties = {
  ...btnReset,
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
  // border shorthand 전체로 지정(borderColor longhand 와 섞으면 active→inactive 복귀 시
  // React 가 longhand 만 제거해 border-color 가 검정으로 깨지는 버그가 난다).
  border: `1px solid ${c.accent}`,
  color: c.accent,
};

export const primaryBtn: React.CSSProperties = {
  ...btnReset,
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
  ...btnReset,
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

/** 중지 등 파괴적 동작의 고스트 변형 — 투명 bg + 빨강 보더/글자. 다른 pill 들과 톤 통일. */
export const dangerGhostBtn: React.CSSProperties = {
  ...btnReset,
  padding: "5px 14px",
  borderRadius: 6,
  border: `1px solid ${c.red}`,
  background: "transparent",
  color: c.red,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
};

/**
 * 3개 섹션(채팅기록 / 채팅 / 미리보기) 내부 헤더의 공통 높이. 가장 큰 1번 섹션 헤더에
 * 맞춘 값 — 세 헤더가 한 줄로 정렬되도록 모두 이 높이를 쓴다.
 */
export const SECTION_HEADER_H = 44;

/** 탭바 — 고정 높이라 섹션 헤더 높이가 항상 일정. 세그먼트 그룹 + 우측 pill 을 담는다. */
export const tabBar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  height: SECTION_HEADER_H,
  boxSizing: "border-box",
  flexShrink: 0,
  padding: "0 14px",
  borderBottom: `1px solid ${c.borderSubtle}`,
  background: c.bgPanel,
};

/** 세그먼트 컨트롤 컨테이너 — 어두운 well 안에 칩들이 붙어 들어간다(밑줄/검정 영역 제거). */
export const segGroup: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 2,
  padding: 3,
  borderRadius: 8,
  background: c.bg,
  border: `1px solid ${c.border}`,
};

export const segItem: React.CSSProperties = {
  ...btnReset,
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "3px 11px",
  borderRadius: 6,
  border: "none",
  background: "transparent",
  color: c.textMuted,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 500,
  whiteSpace: "nowrap",
};

/** 선택 칩 — 웹/앱 pill 과 같은 은은한 노랑으로 통일. */
export const segItemActive: React.CSSProperties = {
  ...segItem,
  background: c.accentBg,
  color: c.accent,
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
