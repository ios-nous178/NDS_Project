import React, { useState, useCallback, useEffect, useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { projectThemes } from "../project-themes";

/* ─── 토큰 카테고리 분류 ─── */

interface TokenDef {
  key: string;
  label: string;
  type: "color" | "size" | "text" | "shadow";
}

function classifyToken(key: string, value: string): TokenDef["type"] {
  if (value.startsWith("#") || value.startsWith("rgb") || value.startsWith("rgba")) return "color";
  if (value.includes("px") && !value.includes(" ")) return "size";
  if (value.includes("shadow") || (value.includes("rgba") && value.includes(","))) return "shadow";
  return "text";
}

function groupTokens(vars: Record<string, string>) {
  const groups: Record<string, { key: string; value: string; type: TokenDef["type"] }[]> = {};

  for (const [key, value] of Object.entries(vars)) {
    // --nds-button-background → Button
    // --semantic-primary-main → Semantic Color
    let group = "기타";
    if (key.includes("--nds-button")) group = "Button";
    else if (key.includes("--nds-input")) group = "Input";
    else if (key.includes("--nds-chip")) group = "Chip";
    else if (key.includes("--nds-card")) group = "Card";
    else if (key.includes("--nds-badge")) group = "Badge";
    else if (key.includes("--nds-toggle")) group = "Toggle";
    else if (key.includes("--nds-toast")) group = "Toast";
    else if (key.includes("--nds-modal")) group = "Modal";
    else if (key.includes("--nds-bottom-sheet")) group = "BottomSheet";
    else if (key.includes("--nds-app-bar")) group = "AppBar";
    else if (key.includes("--nds-footer")) group = "Footer";
    else if (key.includes("--nds-tab")) group = "Tab";
    else if (key.includes("--semantic")) group = "시맨틱 컬러";
    else if (key.includes("--radius")) group = "Radius";
    else if (key.includes("--font")) group = "Typography";

    if (!groups[group]) groups[group] = [];
    groups[group].push({ key, value, type: classifyToken(key, value) });
  }

  return groups;
}

/* ─── 토큰 에디터 컴포넌트 ─── */

function TokenEditor() {
  const [project, setProject] = useState("trost");
  const theme = projectThemes[project];
  const storageKey = `nds-token-overrides:${project}`;
  const [overrides, setOverrides] = useState<Record<string, string>>(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [search, setSearch] = useState("");
  const changeCount = Object.keys(overrides).length;

  // 프로젝트 변경 시 해당 프로젝트 저장값 로드
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`nds-token-overrides:${project}`);
      setOverrides(raw ? JSON.parse(raw) : {});
    } catch {
      setOverrides({});
    }
  }, [project]);

  // CSS 변수 실시간 적용 + sessionStorage 프로젝트별 저장
  useEffect(() => {
    const root = document.documentElement;
    const merged = { ...theme.cssVars, ...overrides };
    for (const [key, value] of Object.entries(merged)) {
      root.style.setProperty(key, value);
    }
    if (Object.keys(overrides).length > 0) {
      sessionStorage.setItem(storageKey, JSON.stringify(overrides));
    } else {
      sessionStorage.removeItem(storageKey);
    }
    return () => {
      for (const key of Object.keys(merged)) {
        root.style.removeProperty(key);
      }
    };
  }, [theme.cssVars, overrides, storageKey]);

  const handleChange = useCallback((key: string, value: string) => {
    setOverrides((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback((key: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const handleResetAll = useCallback(() => {
    setOverrides({});
    sessionStorage.removeItem(storageKey);
  }, [storageKey]);

  const handleExport = useCallback(() => {
    if (changeCount === 0) return;
    const lines = Object.entries(overrides)
      .map(([k, v]) => `      "${k}": "${v}",`)
      .join("\n");
    const code = `// project-themes.ts에 붙여넣기\ncssVars: {\n${lines}\n}`;
    navigator.clipboard.writeText(code).then(() => alert("클립보드에 복사되었습니다!"));
  }, [overrides, changeCount]);

  const groups = groupTokens(theme.cssVars);
  const groupNames = Object.keys(groups).sort((a, b) => {
    const order = [
      "시맨틱 컬러",
      "Button",
      "Chip",
      "Card",
      "Badge",
      "Input",
      "AppBar",
      "Footer",
      "Tab",
      "Toggle",
      "Toast",
      "Modal",
      "BottomSheet",
      "Radius",
      "Typography",
      "기타",
    ];
    return (
      (order.indexOf(a) === -1 ? 99 : order.indexOf(a)) -
      (order.indexOf(b) === -1 ? 99 : order.indexOf(b))
    );
  });

  return (
    <div
      style={{
        fontFamily: "'Pretendard Variable', Pretendard, -apple-system, sans-serif",
        maxWidth: 720,
        margin: "0 auto",
        padding: "var(--semantic-inset-modal)",
      }}
    >
      {/* 헤더 */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: "#333" }}>
          토큰 에디터
        </h1>
        <p style={{ fontSize: 14, color: "#666", margin: 0 }}>
          프로젝트 토큰을 실시간으로 수정하고 미리보기할 수 있습니다. 수정사항은 "코드 복사"로 내보낼
          수 있습니다.
        </p>
      </div>

      {/* 툴바 */}
      <div
        style={{
          display: "flex",
          gap: "var(--semantic-gap-comfortable)",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {/* 프로젝트 선택 */}
        <div style={{ display: "flex", gap: 6 }}>
          {Object.values(projectThemes).map((t) => (
            <button
              key={t.name}
              onClick={() => setProject(t.name)}
              style={{
                padding: "var(--semantic-inset-chip) var(--semantic-inset-card)",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: project === t.name ? 700 : 500,
                border: project === t.name ? "2px solid #333" : "1px solid #E5E5E5",
                background: project === t.name ? "#F4F5F7" : "#fff",
                color: project === t.name ? "#333" : "#666",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 검색 */}
        <input
          type="text"
          placeholder="토큰 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 160,
            padding: "var(--semantic-inset-chip) var(--semantic-inset-input)",
            border: "1px solid #E5E5E5",
            borderRadius: 8,
            fontSize: 13,
            fontFamily: "inherit",
            outline: "none",
          }}
        />

        {/* 액션 */}
        <div style={{ display: "flex", gap: "var(--semantic-gap-default)" }}>
          {changeCount > 0 && (
            <button
              onClick={handleResetAll}
              style={{
                padding: "var(--semantic-inset-chip) 14px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                border: "1px solid #E5E5E5",
                background: "#fff",
                color: "#666",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              전체 초기화 ({changeCount})
            </button>
          )}
          <button
            onClick={handleExport}
            disabled={changeCount === 0}
            style={{
              padding: "var(--semantic-inset-chip) 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              background: changeCount > 0 ? "#333" : "#E5E5E5",
              color: changeCount > 0 ? "#fff" : "#999",
              cursor: changeCount > 0 ? "pointer" : "default",
              fontFamily: "inherit",
            }}
          >
            코드 복사
          </button>
        </div>
      </div>

      {/* 토큰 그룹 */}
      {groupNames.map((groupName) => {
        const tokens = groups[groupName].filter(
          (t) => !search || t.key.toLowerCase().includes(search.toLowerCase()),
        );
        if (tokens.length === 0) return null;

        return (
          <div key={groupName} style={{ marginBottom: 28 }}>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#333",
                margin: "0 0 12px",
                paddingBottom: 8,
                borderBottom: "1px solid #ECECEC",
              }}
            >
              {groupName}
              <span style={{ fontSize: 12, fontWeight: 400, color: "#999", marginLeft: 8 }}>
                {tokens.length}개
              </span>
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--semantic-gap-default)",
              }}
            >
              {tokens.map((token) => {
                const currentValue = overrides[token.key] ?? token.value;
                const isModified = token.key in overrides;
                return (
                  <TokenRow
                    key={token.key}
                    tokenKey={token.key}
                    originalValue={token.value}
                    currentValue={currentValue}
                    type={token.type}
                    isModified={isModified}
                    onChange={handleChange}
                    onReset={handleReset}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {Object.keys(theme.cssVars).length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
          <p style={{ fontSize: 16 }}>이 프로젝트는 기본 토큰을 사용합니다.</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>오버라이드할 CSS 변수가 없습니다.</p>
        </div>
      )}
    </div>
  );
}

/* ─── 개별 토큰 행 ─── */

function TokenRow({
  tokenKey,
  originalValue,
  currentValue,
  type,
  isModified,
  onChange,
  onReset,
}: {
  tokenKey: string;
  originalValue: string;
  currentValue: string;
  type: TokenDef["type"];
  isModified: boolean;
  onChange: (key: string, value: string) => void;
  onReset: (key: string) => void;
}) {
  const colorInputRef = useRef<HTMLInputElement>(null);

  // --nds-button-background → button-background
  const shortName = tokenKey.replace(/^--(nds-|semantic-)/, "");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--semantic-gap-default)",
        padding: "var(--semantic-inset-chip) var(--semantic-inset-input)",
        borderRadius: 8,
        background: isModified ? "#FFFCE6" : "#FAFAFA",
        border: isModified ? "1px solid #FFE60050" : "1px solid transparent",
      }}
    >
      {/* 라벨 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#333",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap" as const,
          }}
        >
          {shortName}
        </div>
        <div style={{ fontSize: 11, color: "#999", fontFamily: "monospace" }}>{tokenKey}</div>
      </div>

      {/* 에디터 */}
      {type === "color" ? (
        <div style={{ display: "flex", alignItems: "center", gap: "var(--semantic-gap-default)" }}>
          <div
            onClick={() => colorInputRef.current?.click()}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: currentValue,
              border: "1px solid #DDD",
              cursor: "pointer",
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
            }}
          />
          <input
            ref={colorInputRef}
            type="color"
            value={currentValue.startsWith("#") ? currentValue.slice(0, 7) : "#000000"}
            onChange={(e) => onChange(tokenKey, e.target.value)}
            style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
          />
          <input
            type="text"
            value={currentValue}
            onChange={(e) => onChange(tokenKey, e.target.value)}
            style={{
              width: 90,
              padding: "4px var(--semantic-inset-chip)",
              border: "1px solid #DDD",
              borderRadius: 6,
              fontSize: 12,
              fontFamily: "monospace",
              color: "#333",
            }}
          />
        </div>
      ) : type === "size" ? (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="range"
            min={0}
            max={100}
            value={parseInt(currentValue) || 0}
            onChange={(e) => onChange(tokenKey, `${e.target.value}px`)}
            style={{ width: 80 }}
          />
          <input
            type="text"
            value={currentValue}
            onChange={(e) => onChange(tokenKey, e.target.value)}
            style={{
              width: 70,
              padding: "4px var(--semantic-inset-chip)",
              border: "1px solid #DDD",
              borderRadius: 6,
              fontSize: 12,
              fontFamily: "monospace",
              color: "#333",
            }}
          />
        </div>
      ) : (
        <input
          type="text"
          value={currentValue}
          onChange={(e) => onChange(tokenKey, e.target.value)}
          style={{
            width: 180,
            padding: "4px var(--semantic-inset-chip)",
            border: "1px solid #DDD",
            borderRadius: 6,
            fontSize: 12,
            fontFamily: "monospace",
            color: "#333",
          }}
        />
      )}

      {/* 리셋 */}
      {isModified && (
        <button
          onClick={() => onReset(tokenKey)}
          title={`원래 값: ${originalValue}`}
          style={{
            padding: "4px var(--semantic-inset-chip)",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
            border: "none",
            background: "#FF411115",
            color: "#FF4111",
            cursor: "pointer",
            fontFamily: "inherit",
            whiteSpace: "nowrap" as const,
          }}
        >
          되돌리기
        </button>
      )}
    </div>
  );
}

/* ─── Story ─── */

const meta: Meta = {
  title: "Tools/TokenEditor",
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj;
export const Default: Story = {
  render: () => <TokenEditor />,
};
