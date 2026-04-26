import { addons, types } from "@storybook/manager-api";
import React from "react";

const ADDON_ID = "nds-token-editor";
const PANEL_ID = `${ADDON_ID}/panel`;
const TOKEN_OVERRIDE_KEY = "nds-token-overrides";

/* ─── 토큰 분류 ─── */

function classifyToken(_key: string, value: string): "color" | "size" | "text" {
  if (value.startsWith("#") || value.startsWith("rgb")) return "color";
  if (/^\d+px$/.test(value)) return "size";
  return "text";
}

function groupTokens(vars: Record<string, string>) {
  const groups: Record<string, { key: string; value: string; type: "color" | "size" | "text" }[]> =
    {};
  for (const [key, value] of Object.entries(vars)) {
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
    else if (key.includes("--color-semantic")) group = "시맨틱 컬러";
    else if (key.includes("--radius")) group = "Radius";
    else if (key.includes("--font")) group = "Typography";
    if (!groups[group]) groups[group] = [];
    groups[group].push({ key, value, type: classifyToken(key, value) });
  }
  return groups;
}

/* ─── 브랜드 데이터 ─── */

const BRANDS: Record<string, { label: string; cssVars: Record<string, string> }> = {
  "nudge-eap": {
    label: "NudgeEAP",
    cssVars: {
      "--color-semantic-primary-main": "#2B96ED",
      "--color-semantic-primary-hover": "#017EE4",
      "--color-semantic-primary-pressed": "#1B65BA",
      "--color-semantic-primary-lighter": "#91CAF6",
      "--color-semantic-primary-bg": "#E3F2FC",
      "--color-semantic-primary-bgLighter": "#F1F8FD",
      "--color-semantic-primary-fg": "#FFFFFF",
      "--color-semantic-secondary-sub": "#ED2E77",
      "--color-semantic-error-main": "#F13F00",
      "--color-semantic-success-main": "#13BFA2",
      "--color-semantic-text-default": "#383838",
      "--color-semantic-text-subtle": "#666666",
      "--color-semantic-border-default": "#D8D8D8",
      "--color-semantic-border-focus": "#2B96ED",
      "--color-semantic-bg-coolGray": "#F3F4F6",
    },
  },
  trost: {
    label: "Trost (트로스트)",
    cssVars: {
      "--color-semantic-primary-main": "#FFF42E",
      "--color-semantic-primary-hover": "#FFE600",
      "--color-semantic-primary-pressed": "#E6D200",
      "--color-semantic-primary-fg": "#000000",
      "--color-semantic-secondary-sub": "#4968FF",
      "--color-semantic-error-main": "#FF4111",
      "--color-semantic-success-main": "#00BC78",
      "--color-semantic-text-default": "#333333",
      "--color-semantic-text-subtle": "#606060",
      "--color-semantic-border-default": "#E5E5E5",
      "--color-semantic-border-focus": "#4968FF",
      "--color-semantic-bg-coolGray": "#F4F5F7",
      "--nds-button-background": "#FFF42E",
      "--nds-button-text-color": "#000000",
      "--nds-button-radius": "9999px",
      "--nds-button-hover-background": "#FFE600",
      "--nds-card-radius": "12px",
      "--nds-card-border-color": "#E0E0E0",
      "--nds-chip-selected-background": "#333333",
      "--nds-chip-selected-text": "#FFFFFF",
      "--nds-chip-border": "#ECECEC",
      "--nds-chip-text": "#606060",
      "--nds-toggle-track-bg": "#EEEEEE",
      "--nds-toggle-track-active-bg": "#333333",
      "--nds-toast-background": "#000000",
      "--nds-toast-radius": "12px",
      "--nds-modal-radius": "12px",
      "--nds-bottom-sheet-radius": "16px",
      "--nds-app-bar-search-border-color": "#FFD92E",
      "--nds-app-bar-gnb-active-color": "#000000",
      "--nds-app-bar-gnb-inactive-color": "#999999",
      "--radius-sm": "6px",
      "--radius-xl": "20px",
    },
  },
  geniet: {
    label: "Geniet (지니어트)",
    cssVars: {
      "--color-semantic-primary-main": "#48C2C5",
      "--color-semantic-primary-hover": "#00A8AC",
      "--color-semantic-primary-fg": "#FFFFFF",
      "--color-semantic-text-default": "#111111",
      "--color-semantic-text-subtle": "#666666",
      "--color-semantic-border-default": "#ECECEC",
      "--color-semantic-border-focus": "#48C2C5",
      "--color-semantic-bg-coolGray": "#F5F5F5",
      "--nds-button-background": "#48C2C5",
      "--nds-button-text-color": "#FFFFFF",
      "--nds-button-radius": "8px",
      "--nds-button-hover-background": "#00A8AC",
      "--nds-card-radius": "8px",
      "--nds-app-bar-search-border-color": "#48C2C5",
      "--nds-app-bar-gnb-active-color": "#48C2C5",
      "--nds-app-bar-gnb-inactive-color": "#111111",
      "--radius-sm": "6px",
    },
  },
};

/* ─── 유틸: preview iframe의 브랜드 읽기 ─── */

function readBrandFromPreview(): string {
  try {
    const iframe = document.querySelector<HTMLIFrameElement>("#storybook-preview-iframe");
    if (iframe?.src) {
      const url = new URL(iframe.src);
      const g = url.searchParams.get("globals") || "";
      const m = g.match(/brand:([^;]+)/);
      if (m) return m[1];
    }
  } catch {
    /* 무시 */
  }
  return "nudge-eap";
}

/** 브랜드별 오버라이드 저장 키 */
const bKey = (brand: string) => `${TOKEN_OVERRIDE_KEY}:${brand}`;

/* ─── Panel ─── */

function TokenEditorPanel() {
  const [brand, setBrand] = React.useState(readBrandFromPreview);
  const [overrides, setOverrides] = React.useState<Record<string, string>>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(bKey(brand)) || "{}");
    } catch {
      return {};
    }
  });
  const [search, setSearch] = React.useState("");

  // iframe URL 변경 감지 (툴바에서 브랜드 변경 시 URL이 바뀜)
  React.useEffect(() => {
    const interval = setInterval(() => {
      const current = readBrandFromPreview();
      if (current && current !== brand && BRANDS[current]) {
        setBrand(current);
        try {
          setOverrides(JSON.parse(sessionStorage.getItem(bKey(current)) || "{}"));
        } catch {
          setOverrides({});
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [brand]);

  const theme = BRANDS[brand] || BRANDS["nudge-eap"];
  const changeCount = Object.keys(overrides).length;

  // 브랜드 전환 (패널에서 클릭)
  const switchBrand = React.useCallback((newBrand: string) => {
    setBrand(newBrand);
    try {
      setOverrides(JSON.parse(sessionStorage.getItem(bKey(newBrand)) || "{}"));
    } catch {
      setOverrides({});
    }
    // 툴바 동기화: iframe URL 변경
    const iframe = document.querySelector<HTMLIFrameElement>("#storybook-preview-iframe");
    if (iframe?.src) {
      const url = new URL(iframe.src);
      const globals = url.searchParams.get("globals") || "";
      const newGlobals = globals.replace(/brand:[^;]*/, "").replace(/^;|;$/g, "");
      url.searchParams.set("globals", `brand:${newBrand}${newGlobals ? ";" + newGlobals : ""}`);
      iframe.src = url.toString();
    }
  }, []);

  // sessionStorage + iframe :root 반영
  React.useEffect(() => {
    if (changeCount > 0) {
      sessionStorage.setItem(bKey(brand), JSON.stringify(overrides));
    } else {
      sessionStorage.removeItem(bKey(brand));
    }
    const iframe = document.querySelector<HTMLIFrameElement>("#storybook-preview-iframe");
    if (iframe?.contentDocument) {
      const root = iframe.contentDocument.documentElement;
      const merged = { ...theme.cssVars, ...overrides };
      for (const [key, value] of Object.entries(merged)) {
        root.style.setProperty(key, value);
      }
    }
  }, [overrides, changeCount, theme, brand]);

  const handleChange = (key: string, value: string) =>
    setOverrides((p) => ({ ...p, [key]: value }));
  const handleReset = (key: string) =>
    setOverrides((p) => {
      const n = { ...p };
      delete n[key];
      return n;
    });
  const handleResetAll = () => {
    setOverrides({});
    sessionStorage.removeItem(bKey(brand));
  };
  const handleExport = () => {
    if (changeCount === 0) return;
    const lines = Object.entries(overrides)
      .map(([k, v]) => `      "${k}": "${v}",`)
      .join("\n");
    navigator.clipboard.writeText(`// ${theme.label} 토큰 오버라이드\ncssVars: {\n${lines}\n}`);
  };

  const groups = groupTokens(theme.cssVars);

  return React.createElement(
    "div",
    {
      style: {
        padding: 12,
        fontSize: 13,
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        overflowY: "auto",
        height: "100%",
      },
    },
    // 툴바
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          gap: 6,
          marginBottom: 10,
          flexWrap: "wrap",
          alignItems: "center",
        },
      },
      ...Object.entries(BRANDS).map(([key, b]) =>
        React.createElement(
          "button",
          {
            key,
            onClick: () => switchBrand(key),
            style: {
              padding: "4px 10px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: brand === key ? 700 : 400,
              border: brand === key ? "1.5px solid #333" : "1px solid #DDD",
              background: brand === key ? "#F4F5F7" : "#fff",
              color: "#333",
              cursor: "pointer",
            },
          },
          b.label,
        ),
      ),
      React.createElement("input", {
        placeholder: "검색...",
        value: search,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
        style: {
          flex: 1,
          minWidth: 80,
          padding: "4px 8px",
          border: "1px solid #DDD",
          borderRadius: 6,
          fontSize: 11,
        },
      }),
      changeCount > 0 &&
        React.createElement(
          "button",
          {
            onClick: handleResetAll,
            style: {
              padding: "4px 8px",
              borderRadius: 6,
              fontSize: 11,
              border: "1px solid #DDD",
              background: "#fff",
              cursor: "pointer",
              color: "#666",
            },
          },
          `초기화(${changeCount})`,
        ),
      React.createElement(
        "button",
        {
          onClick: handleExport,
          style: {
            padding: "4px 8px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            border: "none",
            background: changeCount > 0 ? "#333" : "#EEE",
            color: changeCount > 0 ? "#fff" : "#999",
            cursor: changeCount > 0 ? "pointer" : "default",
          },
        },
        "복사",
      ),
    ),

    // 토큰 그룹
    ...Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([groupName, tokens]) => {
        const filtered = tokens.filter(
          (t) => !search || t.key.toLowerCase().includes(search.toLowerCase()),
        );
        if (filtered.length === 0) return null;
        return React.createElement(
          "div",
          { key: groupName, style: { marginBottom: 14 } },
          React.createElement(
            "div",
            {
              style: {
                fontSize: 11,
                fontWeight: 700,
                color: "#333",
                marginBottom: 6,
                paddingBottom: 4,
                borderBottom: "1px solid #EEE",
              },
            },
            `${groupName} (${filtered.length})`,
          ),
          ...filtered.map((token) => {
            const cur = overrides[token.key] ?? token.value;
            const modified = token.key in overrides;
            const shortName = token.key.replace(/^--(nds-|color-semantic-)/, "");
            return React.createElement(
              "div",
              {
                key: token.key,
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 6px",
                  marginBottom: 2,
                  borderRadius: 4,
                  background: modified ? "#FFFCE6" : "transparent",
                },
              },
              React.createElement(
                "div",
                {
                  style: {
                    flex: 1,
                    fontSize: 11,
                    color: "#333",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                  title: token.key,
                },
                shortName,
              ),
              token.type === "color" &&
                React.createElement("input", {
                  type: "color",
                  value: cur.startsWith("#") ? cur.slice(0, 7) : "#000000",
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(token.key, e.target.value),
                  style: {
                    width: 24,
                    height: 24,
                    border: "1px solid #DDD",
                    borderRadius: 4,
                    cursor: "pointer",
                    padding: 0,
                  },
                }),
              React.createElement("input", {
                type: "text",
                value: cur,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(token.key, e.target.value),
                style: {
                  width: token.type === "color" ? 70 : 90,
                  padding: "2px 6px",
                  border: "1px solid #DDD",
                  borderRadius: 4,
                  fontSize: 11,
                  fontFamily: "monospace",
                },
              }),
              modified &&
                React.createElement(
                  "button",
                  {
                    onClick: () => handleReset(token.key),
                    style: {
                      fontSize: 10,
                      color: "#F44",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      padding: 0,
                      whiteSpace: "nowrap",
                    },
                  },
                  "↩",
                ),
            );
          }),
        );
      }),
  );
}

/* ─── 스펙 오버레이 토글 패널 ─── */

const SPEC_OVERLAY_KEY = "nds-spec-overlay";
const SPEC_PANEL_ID = "nds-spec-overlay/panel";

function SpecOverlayPanel() {
  const [enabled, setEnabled] = React.useState(
    () => sessionStorage.getItem(SPEC_OVERLAY_KEY) === "true",
  );

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    sessionStorage.setItem(SPEC_OVERLAY_KEY, String(next));
    // preview iframe의 sessionStorage에도 동기화
    const iframe = document.querySelector<HTMLIFrameElement>("#storybook-preview-iframe");
    try {
      iframe?.contentWindow?.sessionStorage.setItem(SPEC_OVERLAY_KEY, String(next));
    } catch {
      /* 무시 */
    }
  };

  return React.createElement(
    "div",
    {
      style: { padding: 16, fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" },
    },
    React.createElement(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 } },
      React.createElement(
        "button",
        {
          onClick: toggle,
          style: {
            padding: "8px 20px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            border: "none",
            fontFamily: "inherit",
            background: enabled ? "#3B82F6" : "#E5E5E5",
            color: enabled ? "#fff" : "#666",
          },
        },
        enabled ? "📐 오버레이 ON" : "📐 오버레이 OFF",
      ),
      React.createElement(
        "span",
        { style: { fontSize: 12, color: "#999" } },
        enabled ? "스토리 위에서 요소를 hover하면 스펙이 표시됩니다" : "클릭하여 활성화하세요",
      ),
    ),
    React.createElement(
      "div",
      { style: { fontSize: 12, color: "#888", lineHeight: 1.8 } },
      React.createElement("div", null, "표시 항목:"),
      React.createElement(
        "div",
        { style: { paddingLeft: 12 } },
        "• 크기 (width × height)",
        React.createElement("br"),
        "• 폰트 (weight, size, line-height)",
        React.createElement("br"),
        "• 색상 (color, background → HEX)",
        React.createElement("br"),
        "• 패딩 / 마진",
        React.createElement("br"),
        "• 보더 / 라운딩",
        React.createElement("br"),
        "• Gap",
      ),
    ),
  );
}

/* ─── 애드온 등록 ─── */

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: "🎨 토큰",
    render: ({ active }) => (active ? React.createElement(TokenEditorPanel) : null),
  });
  addons.add(SPEC_PANEL_ID, {
    type: types.PANEL,
    title: "📐 스펙",
    render: ({ active }) => (active ? React.createElement(SpecOverlayPanel) : null),
  });
});
