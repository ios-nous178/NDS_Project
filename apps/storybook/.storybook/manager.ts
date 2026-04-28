import { addons, types } from "@storybook/manager-api";
import React from "react";
import { ICON_NAMES, ICON_SVGS } from "./icon-registry";

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

/* ─── CSS 편집기 패널 ─── */

const CSS_EDITOR_PANEL_ID = "nds-css-editor/panel";

interface CssElementInfo {
  path: string;
  tag: string;
  classes: string[];
  id: string;
  styles: Record<string, string>;
  tokenVars: { name: string; value: string; prop: string }[];
  children: { index: number; tag: string; text: string }[];
  imgSrc?: string;
  bgImage?: string;
}

function CssEditorPanel() {
  const h = React.createElement;
  const [selectMode, setSelectMode] = React.useState(false);
  const [info, setInfo] = React.useState<CssElementInfo | null>(null);
  const [styleOvr, setStyleOvr] = React.useState<Record<string, string>>({});
  const [tokenOvr, setTokenOvr] = React.useState<Record<string, string>>({});
  const [customCss, setCustomCss] = React.useState(() => {
    try {
      return sessionStorage.getItem("nds-css-editor:css") || "";
    } catch {
      return "";
    }
  });
  const [newProp, setNewProp] = React.useState("");
  const [newVal, setNewVal] = React.useState("");
  const [childOrder, setChildOrder] = React.useState<number[]>([]);
  const [hiddenChildren, setHiddenChildren] = React.useState<Set<number>>(new Set());
  const [textEditing, setTextEditing] = React.useState(false);
  const [boxModel, setBoxModel] = React.useState(false);
  const [showPalette, setShowPalette] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [showIcons, setShowIcons] = React.useState(false);
  const [iconSearch, setIconSearch] = React.useState("");
  const [iconSize, setIconSize] = React.useState(24);
  const [iconColor, setIconColor] = React.useState("currentColor");

  // ── Undo/Redo 히스토리 (최대 50단계) ──
  type Snap = {
    s: Record<string, string>;
    t: Record<string, string>;
    css: string;
    co: number[];
    hc: number[];
  };
  const histRef = React.useRef<Snap[]>([]);
  const histPos = React.useRef(-1);
  const isRestoring = React.useRef(false);

  // 상태 변경 시 히스토리 푸시
  React.useEffect(() => {
    if (isRestoring.current) {
      isRestoring.current = false;
      return;
    }
    const snap: Snap = {
      s: { ...styleOvr },
      t: { ...tokenOvr },
      css: customCss,
      co: [...childOrder],
      hc: Array.from(hiddenChildren),
    };
    // 직전과 동일하면 스킵
    const last = histRef.current[histPos.current];
    if (last && JSON.stringify(last) === JSON.stringify(snap)) return;
    // redo 히스토리 잘라내기
    histRef.current = histRef.current.slice(0, histPos.current + 1);
    histRef.current.push(snap);
    if (histRef.current.length > 50) histRef.current.shift();
    histPos.current = histRef.current.length - 1;
  }, [styleOvr, tokenOvr, customCss, childOrder, hiddenChildren]);

  const restoreSnap = React.useCallback((snap: Snap) => {
    isRestoring.current = true;
    setStyleOvr(snap.s);
    setTokenOvr(snap.t);
    setCustomCss(snap.css);
    setChildOrder(snap.co);
    setHiddenChildren(new Set(snap.hc));
  }, []);

  const canUndo = histPos.current > 0;
  const canRedo = histPos.current < histRef.current.length - 1;

  const undo = React.useCallback(() => {
    if (histPos.current <= 0) return;
    histPos.current--;
    restoreSnap(histRef.current[histPos.current]);
  }, [restoreSnap]);

  const redo = React.useCallback(() => {
    if (histPos.current >= histRef.current.length - 1) return;
    histPos.current++;
    restoreSnap(histRef.current[histPos.current]);
  }, [restoreSnap]);

  // Ctrl+Z / Ctrl+Shift+Z 단축키
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  // preview에서 요소 선택 메시지 수신
  React.useEffect(() => {
    const fn = (e: MessageEvent) => {
      if (e.data?.type === "nds-css-select") {
        setInfo(e.data.payload);
        setStyleOvr({});
        setTokenOvr({});
        setChildOrder((e.data.payload.children || []).map((_: unknown, i: number) => i));
        setHiddenChildren(new Set());
        setTextEditing(false);
        setImageUrl("");
      }
    };
    window.addEventListener("message", fn);
    return () => window.removeEventListener("message", fn);
  }, []);

  // 선택 모드 동기화
  React.useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>("#storybook-preview-iframe");
    try {
      iframe?.contentWindow?.postMessage({ type: "nds-css-mode", enabled: selectMode }, "*");
    } catch {
      /* 무시 */
    }
  }, [selectMode]);

  // childOrder → CSS order 매핑
  const childOrders = React.useMemo(() => {
    if (!info?.children.length) return {};
    const isDefault = childOrder.every((v, i) => v === i);
    if (isDefault) return {};
    const map: Record<number, number> = {};
    childOrder.forEach((origIdx, pos) => {
      map[origIdx] = pos;
    });
    return map;
  }, [childOrder, info]);

  // 변경사항 적용
  React.useEffect(() => {
    const iframe = document.querySelector<HTMLIFrameElement>("#storybook-preview-iframe");
    try {
      iframe?.contentWindow?.postMessage(
        {
          type: "nds-css-apply",
          styleOvr,
          tokenOvr,
          customCss,
          childOrders,
          hiddenChildren: Array.from(hiddenChildren),
          textEditing,
          boxModel,
          imageReplace: imageUrl || undefined,
        },
        "*",
      );
      sessionStorage.setItem("nds-css-editor:css", customCss);
    } catch {
      /* 무시 */
    }
  }, [styleOvr, tokenOvr, customCss, childOrders, hiddenChildren, textEditing, boxModel, imageUrl]);

  const isColor = (v: string) => /^#|^rgb/.test(v);
  const childOrderChanged = childOrder.some((v, i) => v !== i);
  const changeCount =
    Object.keys(styleOvr).length +
    Object.keys(tokenOvr).length +
    (customCss.trim() ? 1 : 0) +
    (childOrderChanged ? 1 : 0) +
    hiddenChildren.size;

  const handleExport = () => {
    const lines: string[] = [];
    if (Object.keys(tokenOvr).length) {
      lines.push(":root {");
      for (const [k, v] of Object.entries(tokenOvr)) lines.push(`  ${k}: ${v};`);
      lines.push("}");
    }
    if (info && Object.keys(styleOvr).length) {
      lines.push(`\n${info.path} {`);
      for (const [k, v] of Object.entries(styleOvr)) lines.push(`  ${k}: ${v};`);
      lines.push("}");
    }
    if (childOrderChanged && info) {
      lines.push(`\n/* 자식 요소 순서 */`);
      childOrder.forEach((origIdx, pos) => {
        if (origIdx !== pos)
          lines.push(`${info.path} > :nth-child(${origIdx + 1}) { order: ${pos}; }`);
      });
    }
    if (customCss.trim()) lines.push(`\n/* 커스텀 */\n${customCss}`);
    if (lines.length) navigator.clipboard.writeText(lines.join("\n"));
  };

  const buildCssContent = (): string => {
    const brand = readBrandFromPreview();
    const now = new Date();
    const header = `/* NudgeEAP Design Override — ${brand} — ${now.toISOString().slice(0, 10)} */\n`;
    const parts: string[] = [header];

    // 토큰 오버라이드
    if (Object.keys(tokenOvr).length) {
      parts.push(":root {");
      for (const [k, v] of Object.entries(tokenOvr)) parts.push(`  ${k}: ${v};`);
      parts.push("}\n");
    }
    // 요소 스타일
    if (info && Object.keys(styleOvr).length) {
      parts.push(`${info.path} {`);
      for (const [k, v] of Object.entries(styleOvr)) parts.push(`  ${k}: ${v} !important;`);
      parts.push("}\n");
    }
    // 자식 순서
    if (childOrderChanged && info) {
      childOrder.forEach((origIdx, pos) => {
        if (origIdx !== pos)
          parts.push(`${info.path} > :nth-child(${origIdx + 1}) { order: ${pos}; }`);
      });
      if (childOrderChanged) parts.push("");
    }
    // 숨긴 요소
    if (hiddenChildren.size > 0 && info) {
      for (const idx of hiddenChildren) {
        parts.push(`${info.path} > :nth-child(${idx + 1}) { display: none !important; }`);
      }
      parts.push("");
    }
    // 커스텀
    if (customCss.trim()) parts.push(customCss);
    return parts.join("\n");
  };

  const handleDownloadCss = () => {
    const content = buildCssContent();
    if (!content.trim()) return;
    const brand = readBrandFromPreview();
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const blob = new Blob([content], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `override-${brand}-${dateStr}.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const [reportBusy, setReportBusy] = React.useState(false);

  const handleReport = async () => {
    setReportBusy(true);
    try {
      const iframe = document.querySelector<HTMLIFrameElement>("#storybook-preview-iframe");
      const brand = readBrandFromPreview();
      const storyName = (() => {
        try {
          if (iframe?.src) {
            const url = new URL(iframe.src);
            return (url.searchParams.get("id") || "unknown")
              .replace(/^mockups-/, "")
              .replace(/--.*$/, "");
          }
        } catch {
          /* 무시 */
        }
        return "unknown";
      })();
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      // 스크린샷 캡처
      let screenshotDataUrl = "";
      if (iframe?.contentWindow && iframe.contentDocument) {
        try {
          const h2c = await loadHtml2Canvas(iframe.contentWindow);
          // 오버레이 잠시 숨기기
          const tooltip = iframe.contentDocument.getElementById("nds-spec-tooltip");
          const highlight = iframe.contentDocument.getElementById("nds-spec-highlight");
          const boxOvr = iframe.contentDocument.getElementById("nds-css-box-overlay");
          if (tooltip) tooltip.style.display = "none";
          if (highlight) highlight.style.display = "none";
          if (boxOvr) boxOvr.style.display = "none";

          const canvas = await h2c(iframe.contentDocument.body, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#FFFFFF",
            width: iframe.contentDocument.body.scrollWidth,
            height: Math.min(iframe.contentDocument.body.scrollHeight, 3000),
            windowWidth: iframe.contentDocument.body.scrollWidth,
            windowHeight: iframe.contentDocument.body.scrollHeight,
          });
          screenshotDataUrl = canvas.toDataURL("image/png");
        } catch {
          /* 스크린샷 실패해도 리포트는 생성 */
        }
      }

      // 변경 항목 수집
      const tokenItems = Object.entries(tokenOvr).map(([k, v]) => {
        const brandTheme = BRANDS[brand] || BRANDS["nudge-eap"];
        const orig = brandTheme.cssVars[k] || "—";
        const shortName = k.replace(/^--(nds-|color-semantic-)/, "");
        return { name: shortName, varName: k, from: orig, to: v };
      });

      const styleItems = Object.entries(styleOvr).map(([k, v]) => {
        const orig = info?.styles[k] || "—";
        return { prop: k, from: orig, to: v };
      });

      const layoutItems: string[] = [];
      if (childOrderChanged) layoutItems.push("자식 요소 순서 변경");
      if (hiddenChildren.size > 0) {
        const names = Array.from(hiddenChildren).map((i) => {
          const c = info?.children[i];
          return c ? `<${c.tag}> ${c.text}` : `#${i}`;
        });
        layoutItems.push(`요소 숨김: ${names.join(", ")}`);
      }

      // HTML 리포트 생성
      const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>디자인 변경 리포트 — ${storyName}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Pretendard',-apple-system,BlinkMacSystemFont,sans-serif;max-width:840px;margin:0 auto;padding:48px 24px;color:#333;line-height:1.6}
h1{font-size:22px;border-bottom:2px solid #333;padding-bottom:12px;margin-bottom:8px}
.meta{font-size:12px;color:#888;margin-bottom:32px;display:flex;gap:8px;flex-wrap:wrap}
.meta span{background:#F3F4F6;padding:2px 10px;border-radius:4px}
h2{font-size:16px;margin:28px 0 12px;display:flex;align-items:center;gap:8px}
.badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700}
.badge-token{background:#DBEAFE;color:#1D4ED8}
.badge-style{background:#FEF3C7;color:#92400E}
.badge-layout{background:#D1FAE5;color:#065F46}
.badge-custom{background:#F3E8FF;color:#6B21A8}
.code{background:#1E1E1E;color:#D4D4D4;padding:16px;border-radius:8px;font-family:'SF Mono',Monaco,Consolas,monospace;font-size:12px;white-space:pre;overflow-x:auto;margin:8px 0}
.change{padding:8px 12px;border-left:3px solid #3B82F6;margin-bottom:6px;background:#F8FAFC;border-radius:0 6px 6px 0;font-size:13px}
.change .prop{font-weight:700;color:#1E40AF}
.change .from{color:#999;text-decoration:line-through}
.change .to{color:#059669;font-weight:600}
.change .arrow{color:#999;margin:0 6px}
.screenshot{max-width:100%;border:1px solid #E5E7EB;border-radius:8px;margin-top:12px}
.empty{color:#999;font-size:13px;font-style:italic}
.section{margin-bottom:24px}
</style>
</head>
<body>
<h1>📋 디자인 변경 리포트</h1>
<div class="meta">
<span>🏷 ${brand}</span>
<span>📄 ${storyName}</span>
<span>📅 ${dateStr}</span>
</div>

${
  tokenItems.length > 0
    ? `
<div class="section">
<h2><span class="badge badge-token">TOKEN</span> 토큰 변경 — 바로 적용 가능</h2>
${tokenItems.map((t) => `<div class="change"><span class="prop">${t.name}</span><span class="arrow">→</span><span class="from">${t.from}</span><span class="arrow">→</span><span class="to">${t.to}</span></div>`).join("\n")}
<div class="code">${tokenItems.map((t) => `${t.varName}: ${t.to};`).join("\n")}</div>
</div>`
    : ""
}

${
  styleItems.length > 0
    ? `
<div class="section">
<h2><span class="badge badge-style">STYLE</span> 스타일 변경 — 스크린샷 참고</h2>
${info ? `<div style="font-size:12px;color:#666;margin-bottom:8px">대상: <code>${info.path}</code></div>` : ""}
${styleItems.map((s) => `<div class="change"><span class="prop">${s.prop}</span><span class="arrow">→</span><span class="from">${s.from}</span><span class="arrow">→</span><span class="to">${s.to}</span></div>`).join("\n")}
<div class="code">${info ? `${info.path} {\n${styleItems.map((s) => `  ${s.prop}: ${s.to};`).join("\n")}\n}` : styleItems.map((s) => `${s.prop}: ${s.to};`).join("\n")}</div>
</div>`
    : ""
}

${
  layoutItems.length > 0
    ? `
<div class="section">
<h2><span class="badge badge-layout">LAYOUT</span> 레이아웃 변경</h2>
${layoutItems.map((l) => `<div class="change">${l}</div>`).join("\n")}
</div>`
    : ""
}

${
  customCss.trim()
    ? `
<div class="section">
<h2><span class="badge badge-custom">CUSTOM</span> 커스텀 CSS</h2>
<div class="code">${customCss.replace(/</g, "&lt;")}</div>
</div>`
    : ""
}

<div class="section">
<h2>📸 적용 후 스크린샷</h2>
${screenshotDataUrl ? `<img class="screenshot" src="${screenshotDataUrl}" alt="변경 후 스크린샷">` : `<p class="empty">스크린샷 캡처에 실패했습니다.</p>`}
</div>

</body>
</html>`;

      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `design-report-${brand}-${storyName}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      /* 무시 */
    } finally {
      setReportBusy(false);
    }
  };

  const handleResetAll = () => {
    setStyleOvr({});
    setTokenOvr({});
    setCustomCss("");
    if (info) setChildOrder(info.children.map((_, i) => i));
    setHiddenChildren(new Set());
    setTextEditing(false);
    setBoxModel(false);
    setImageUrl("");
    const iframe = document.querySelector<HTMLIFrameElement>("#storybook-preview-iframe");
    try {
      iframe?.contentWindow?.postMessage({ type: "nds-css-reset" }, "*");
    } catch {
      /* 무시 */
    }
  };

  // 행 렌더링 헬퍼
  const row = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    onReset: (() => void) | null,
    modified: boolean,
  ) =>
    h(
      "div",
      {
        key: label,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "3px 6px",
          marginBottom: 1,
          borderRadius: 4,
          background: modified ? "#FFFCE6" : "transparent",
        },
      },
      h(
        "div",
        {
          style: {
            width: 110,
            fontSize: 11,
            color: "#666",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap" as const,
            flexShrink: 0,
          },
          title: label,
        },
        label,
      ),
      isColor(value) &&
        h("input", {
          type: "color",
          value: value.startsWith("#") ? value.slice(0, 7) : "#000000",
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
          style: {
            width: 22,
            height: 22,
            border: "1px solid #DDD",
            borderRadius: 3,
            padding: 0,
            cursor: "pointer",
          },
        }),
      h("input", {
        type: "text",
        value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
        style: {
          flex: 1,
          minWidth: 0,
          padding: "2px 6px",
          border: "1px solid #DDD",
          borderRadius: 3,
          fontSize: 11,
          fontFamily: "monospace",
        },
      }),
      onReset &&
        modified &&
        h(
          "button",
          {
            onClick: onReset,
            style: {
              fontSize: 10,
              color: "#F44",
              border: "none",
              background: "none",
              cursor: "pointer",
              padding: 0,
            },
          },
          "↩",
        ),
    );

  const sectionHeader = (title: string, count?: number) =>
    h(
      "div",
      {
        style: {
          fontSize: 11,
          fontWeight: 700,
          color: "#333",
          marginBottom: 4,
          paddingBottom: 4,
          borderBottom: "1px solid #EEE",
        },
      },
      count !== undefined ? `${title} (${count})` : title,
    );

  return h(
    "div",
    {
      style: {
        padding: 12,
        fontSize: 13,
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
        overflowY: "auto" as const,
        height: "100%",
      },
    },
    // ── 툴바 ──
    h(
      "div",
      { style: { display: "flex", gap: 6, marginBottom: 10, alignItems: "center" } },
      h(
        "button",
        {
          onClick: () => setSelectMode(!selectMode),
          style: {
            padding: "4px 12px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            border: "none",
            background: selectMode ? "#F59E0B" : "#E5E5E5",
            color: selectMode ? "#fff" : "#666",
          },
        },
        selectMode ? "🎯 선택 중..." : "🎯 요소 선택",
      ),
      info &&
        h(
          "button",
          {
            onClick: () => {
              const next = !textEditing;
              setTextEditing(next);
              if (next) setSelectMode(false);
            },
            style: {
              padding: "4px 8px",
              borderRadius: 6,
              fontSize: 11,
              cursor: "pointer",
              border: "none",
              background: textEditing ? "#8B5CF6" : "#E5E5E5",
              color: textEditing ? "#fff" : "#666",
            },
          },
          "📝",
        ),
      info &&
        h(
          "button",
          {
            onClick: () => setBoxModel(!boxModel),
            style: {
              padding: "4px 8px",
              borderRadius: 6,
              fontSize: 11,
              cursor: "pointer",
              border: "none",
              background: boxModel ? "#10B981" : "#E5E5E5",
              color: boxModel ? "#fff" : "#666",
            },
            title: "여백 시각화",
          },
          "📦",
        ),
      changeCount > 0 &&
        h(
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
      h(
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
            cursor: "pointer",
            marginLeft: "auto",
          },
        },
        "CSS 복사",
      ),
      h(
        "button",
        {
          onClick: handleReport,
          disabled: reportBusy,
          style: {
            padding: "4px 8px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            border: "none",
            background: changeCount > 0 ? "#6D28D9" : "#EEE",
            color: changeCount > 0 ? "#fff" : "#999",
            cursor: reportBusy ? "wait" : "pointer",
          },
        },
        reportBusy ? "생성 중..." : "📋 리포트",
      ),
      h(
        "button",
        {
          onClick: handleDownloadCss,
          style: {
            padding: "4px 8px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            border: "none",
            background: changeCount > 0 ? "#0369A1" : "#EEE",
            color: changeCount > 0 ? "#fff" : "#999",
            cursor: "pointer",
          },
        },
        "💾 CSS",
      ),
    ),
    // ── Undo/Redo 바 ──
    (canUndo || canRedo) &&
      h(
        "div",
        {
          style: {
            display: "flex",
            gap: 4,
            marginBottom: 8,
            alignItems: "center",
            fontSize: 10,
            color: "#999",
          },
        },
        h(
          "button",
          {
            onClick: undo,
            disabled: !canUndo,
            style: {
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 10,
              border: "1px solid #DDD",
              background: canUndo ? "#fff" : "#F5F5F5",
              color: canUndo ? "#333" : "#CCC",
              cursor: canUndo ? "pointer" : "default",
            },
          },
          "↩ 실행취소",
        ),
        h(
          "button",
          {
            onClick: redo,
            disabled: !canRedo,
            style: {
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 10,
              border: "1px solid #DDD",
              background: canRedo ? "#fff" : "#F5F5F5",
              color: canRedo ? "#333" : "#CCC",
              cursor: canRedo ? "pointer" : "default",
            },
          },
          "↪ 다시실행",
        ),
        h("span", null, `${histPos.current}/${histRef.current.length - 1}`),
      ),

    // ── 선택된 요소 or 안내 ──
    info
      ? h(
          React.Fragment,
          null,
          // 요소 태그
          h(
            "div",
            {
              style: {
                fontSize: 12,
                fontWeight: 700,
                color: "#7C3AED",
                marginBottom: 10,
                padding: "6px 10px",
                background: "#F5F3FF",
                borderRadius: 6,
                overflow: "hidden",
              },
            },
            h(
              "div",
              null,
              `<${info.tag}${info.id ? "#" + info.id : ""}${info.classes.length ? "." + info.classes.slice(0, 3).join(".") : ""}>`,
            ),
            h(
              "div",
              {
                style: {
                  fontSize: 10,
                  color: "#999",
                  fontWeight: 400,
                  marginTop: 2,
                  wordBreak: "break-all" as const,
                },
              },
              info.path,
            ),
          ),

          // ── 이미지 교체 ──
          (info.imgSrc || info.bgImage) &&
            h(
              "div",
              { style: { marginBottom: 12 } },
              sectionHeader("이미지 교체"),
              // 현재 이미지 미리보기
              h("img", {
                src: imageUrl || info.imgSrc || info.bgImage || "",
                style: {
                  width: "100%",
                  maxHeight: 80,
                  objectFit: "cover" as const,
                  borderRadius: 4,
                  border: "1px solid #EEE",
                  marginBottom: 6,
                  display: "block",
                },
              }),
              // URL 입력
              h(
                "div",
                { style: { display: "flex", gap: 4, marginBottom: 4 } },
                h("input", {
                  type: "text",
                  placeholder: "이미지 URL 붙여넣기",
                  value: imageUrl,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => setImageUrl(e.target.value),
                  style: {
                    flex: 1,
                    padding: "4px 6px",
                    border: "1px solid #DDD",
                    borderRadius: 4,
                    fontSize: 11,
                  },
                }),
                imageUrl &&
                  h(
                    "button",
                    {
                      onClick: () => setImageUrl(""),
                      style: {
                        fontSize: 10,
                        color: "#F44",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      },
                    },
                    "↩",
                  ),
              ),
              // 파일 업로드
              h("input", {
                type: "file",
                accept: "image/*",
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === "string") setImageUrl(reader.result);
                  };
                  reader.readAsDataURL(file);
                },
                style: { fontSize: 10, width: "100%" },
              }),
            ),

          // ── 아이콘 삽입 ──
          h(
            "div",
            { style: { marginBottom: 12 } },
            h(
              "div",
              {
                onClick: () => setShowIcons(!showIcons),
                style: {
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#333",
                  marginBottom: 4,
                  paddingBottom: 4,
                  borderBottom: "1px solid #EEE",
                  cursor: "pointer",
                  userSelect: "none" as const,
                },
              },
              `${showIcons ? "▼" : "▶"} 아이콘 (${ICON_NAMES.length})`,
            ),
            showIcons &&
              h(
                React.Fragment,
                null,
                // 검색 + 사이즈 + 색상
                h(
                  "div",
                  { style: { display: "flex", gap: 4, marginBottom: 6, alignItems: "center" } },
                  h("input", {
                    placeholder: "아이콘 검색...",
                    value: iconSearch,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      setIconSearch(e.target.value),
                    style: {
                      flex: 1,
                      padding: "3px 6px",
                      border: "1px solid #DDD",
                      borderRadius: 4,
                      fontSize: 10,
                    },
                  }),
                  h("input", {
                    type: "number",
                    value: iconSize,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      setIconSize(Number(e.target.value) || 24),
                    title: "사이즈 (px)",
                    style: {
                      width: 36,
                      padding: "3px 4px",
                      border: "1px solid #DDD",
                      borderRadius: 4,
                      fontSize: 10,
                      textAlign: "center" as const,
                    },
                  }),
                  h("input", {
                    type: "color",
                    value: iconColor === "currentColor" ? "#383838" : iconColor,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      setIconColor(e.target.value),
                    title: "아이콘 색상",
                    style: {
                      width: 22,
                      height: 22,
                      border: "1px solid #DDD",
                      borderRadius: 3,
                      padding: 0,
                      cursor: "pointer",
                    },
                  }),
                ),
                // 아이콘 그리드
                h(
                  "div",
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))",
                      gap: 3,
                      maxHeight: 200,
                      overflowY: "auto" as const,
                      padding: 2,
                    },
                  },
                  ...ICON_NAMES.filter(
                    (n) => !iconSearch || n.includes(iconSearch.toLowerCase()),
                  ).map((name) => {
                    // SVG에 사이즈/색상 적용
                    const svg = (ICON_SVGS[name] || "")
                      .replace(/width="[^"]*"/, `width="${iconSize}"`)
                      .replace(/height="[^"]*"/, `height="${iconSize}"`)
                      .replace(/currentColor/g, iconColor);
                    return h("div", {
                      key: name,
                      onClick: () => {
                        const iframe = document.querySelector<HTMLIFrameElement>(
                          "#storybook-preview-iframe",
                        );
                        try {
                          iframe?.contentWindow?.postMessage(
                            {
                              type: "nds-css-icon",
                              svg: (ICON_SVGS[name] || "")
                                .replace(/width="[^"]*"/, `width="${iconSize}"`)
                                .replace(/height="[^"]*"/, `height="${iconSize}"`)
                                .replace(/currentColor/g, iconColor),
                              name,
                            },
                            "*",
                          );
                        } catch {
                          /* 무시 */
                        }
                      },
                      title: name,
                      dangerouslySetInnerHTML: { __html: svg },
                      style: {
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 4,
                        border: "1px solid #EEE",
                        cursor: "pointer",
                        background: "#fff",
                        overflow: "hidden" as const,
                      },
                    });
                  }),
                ),
              ),
          ),

          // ── 레이아웃 ──
          info.children.length > 0 &&
            h(
              "div",
              { style: { marginBottom: 12 } },
              sectionHeader("레이아웃"),
              // 레이아웃 모드 버튼
              h(
                "div",
                { style: { display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" as const } },
                ...(
                  [
                    ["가로", { display: "flex", "flex-direction": "row" }],
                    ["세로", { display: "flex", "flex-direction": "column" }],
                    ["2열", { display: "grid", "grid-template-columns": "repeat(2, 1fr)" }],
                    ["3열", { display: "grid", "grid-template-columns": "repeat(3, 1fr)" }],
                    ["리스트", { display: "block" }],
                    ["wrap", { "flex-wrap": "wrap" }],
                  ] as [string, Record<string, string>][]
                ).map(([label, props]) =>
                  h(
                    "button",
                    {
                      key: label,
                      onClick: () => setStyleOvr((p) => ({ ...p, ...props })),
                      style: {
                        padding: "3px 8px",
                        borderRadius: 4,
                        fontSize: 10,
                        border: "1px solid #DDD",
                        background: "#fff",
                        cursor: "pointer",
                        color: "#333",
                      },
                    },
                    label,
                  ),
                ),
              ),
              // gap 조절
              h(
                "div",
                { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 8 } },
                h("span", { style: { fontSize: 11, color: "#666", width: 30 } }, "gap"),
                h("input", {
                  type: "range",
                  min: 0,
                  max: 48,
                  step: 4,
                  value: parseInt(styleOvr["gap"] || info.styles["gap"] || "0") || 0,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    setStyleOvr((p) => ({ ...p, gap: e.target.value + "px" })),
                  style: { flex: 1 },
                }),
                h(
                  "span",
                  {
                    style: { fontSize: 11, color: "#999", width: 36, textAlign: "right" as const },
                  },
                  styleOvr["gap"] || info.styles["gap"] || "0px",
                ),
              ),
              // 자식 요소 순서
              sectionHeader("자식 요소 순서", childOrder.length),
              ...childOrder.map((origIdx, pos) => {
                const child = info.children[origIdx];
                if (!child) return null;
                const moved = origIdx !== pos;
                return h(
                  "div",
                  {
                    key: `child-${origIdx}`,
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "3px 6px",
                      marginBottom: 1,
                      borderRadius: 4,
                      background: moved ? "#FFFCE6" : "transparent",
                      fontSize: 11,
                    },
                  },
                  // 순서 버튼
                  h(
                    "button",
                    {
                      onClick: () => {
                        if (pos <= 0) return;
                        setChildOrder((p) => {
                          const n = [...p];
                          [n[pos - 1], n[pos]] = [n[pos], n[pos - 1]];
                          return n;
                        });
                      },
                      disabled: pos === 0,
                      style: {
                        fontSize: 10,
                        border: "none",
                        background: "none",
                        cursor: pos > 0 ? "pointer" : "default",
                        padding: "0 2px",
                        color: pos > 0 ? "#333" : "#CCC",
                      },
                    },
                    "▲",
                  ),
                  h(
                    "button",
                    {
                      onClick: () => {
                        if (pos >= childOrder.length - 1) return;
                        setChildOrder((p) => {
                          const n = [...p];
                          [n[pos], n[pos + 1]] = [n[pos + 1], n[pos]];
                          return n;
                        });
                      },
                      disabled: pos === childOrder.length - 1,
                      style: {
                        fontSize: 10,
                        border: "none",
                        background: "none",
                        cursor: pos < childOrder.length - 1 ? "pointer" : "default",
                        padding: "0 2px",
                        color: pos < childOrder.length - 1 ? "#333" : "#CCC",
                      },
                    },
                    "▼",
                  ),
                  // 순서 번호
                  h(
                    "span",
                    {
                      style: {
                        width: 18,
                        textAlign: "center" as const,
                        color: moved ? "#F59E0B" : "#999",
                        fontWeight: moved ? 700 : 400,
                      },
                    },
                    pos + 1,
                  ),
                  // 자식 설명
                  h(
                    "span",
                    {
                      style: {
                        flex: 1,
                        color: hiddenChildren.has(origIdx) ? "#CCC" : "#333",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap" as const,
                        textDecoration: hiddenChildren.has(origIdx) ? "line-through" : "none",
                      },
                    },
                    `<${child.tag}> ${child.text}`,
                  ),
                  // 숨기기 토글
                  h(
                    "button",
                    {
                      onClick: () =>
                        setHiddenChildren((prev) => {
                          const next = new Set(prev);
                          if (next.has(origIdx)) next.delete(origIdx);
                          else next.add(origIdx);
                          return next;
                        }),
                      style: {
                        fontSize: 11,
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        padding: "0 2px",
                        opacity: hiddenChildren.has(origIdx) ? 0.4 : 1,
                      },
                      title: hiddenChildren.has(origIdx) ? "보이기" : "숨기기",
                    },
                    hiddenChildren.has(origIdx) ? "👁‍🗨" : "👁",
                  ),
                );
              }),
            ),

          // ── 토큰 ──
          info.tokenVars.length > 0 &&
            h(
              "div",
              { style: { marginBottom: 12 } },
              sectionHeader("토큰", info.tokenVars.length),
              ...info.tokenVars.map((tv) => {
                const cur = tokenOvr[tv.name] ?? tv.value;
                const mod = tv.name in tokenOvr;
                const shortName = tv.name.replace(/^--(nds-|color-semantic-)/, "");
                return row(
                  shortName,
                  cur,
                  (v) => setTokenOvr((p) => ({ ...p, [tv.name]: v })),
                  () =>
                    setTokenOvr((p) => {
                      const n = { ...p };
                      delete n[tv.name];
                      return n;
                    }),
                  mod,
                );
              }),
            ),

          // ── 스타일 ──
          h(
            "div",
            { style: { marginBottom: 12 } },
            sectionHeader(
              "스타일",
              Object.keys(info.styles).length +
                Object.keys(styleOvr).filter((p) => !(p in info.styles)).length,
            ),
            ...Object.entries(info.styles).map(([prop, origVal]) => {
              const cur = styleOvr[prop] ?? origVal;
              const mod = prop in styleOvr;
              return row(
                prop,
                cur,
                (v) => setStyleOvr((p) => ({ ...p, [prop]: v })),
                () =>
                  setStyleOvr((p) => {
                    const n = { ...p };
                    delete n[prop];
                    return n;
                  }),
                mod,
              );
            }),
            // 추가된 속성
            ...Object.entries(styleOvr)
              .filter(([prop]) => !(prop in (info?.styles || {})))
              .map(([prop, val]) =>
                row(
                  prop,
                  val,
                  (v) => setStyleOvr((p) => ({ ...p, [prop]: v })),
                  () =>
                    setStyleOvr((p) => {
                      const n = { ...p };
                      delete n[prop];
                      return n;
                    }),
                  true,
                ),
              ),
          ),

          // ── 속성 추가 ──
          h(
            "div",
            {
              style: {
                display: "flex",
                gap: 4,
                marginBottom: 12,
                paddingTop: 4,
                borderTop: "1px solid #EEE",
              },
            },
            h("input", {
              placeholder: "속성명",
              value: newProp,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewProp(e.target.value),
              style: {
                width: 110,
                padding: "4px 6px",
                border: "1px solid #DDD",
                borderRadius: 4,
                fontSize: 11,
              },
            }),
            h("input", {
              placeholder: "값",
              value: newVal,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNewVal(e.target.value),
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === "Enter" && newProp && newVal) {
                  setStyleOvr((p) => ({ ...p, [newProp]: newVal }));
                  setNewProp("");
                  setNewVal("");
                }
              },
              style: {
                flex: 1,
                padding: "4px 6px",
                border: "1px solid #DDD",
                borderRadius: 4,
                fontSize: 11,
              },
            }),
            h(
              "button",
              {
                onClick: () => {
                  if (newProp && newVal) {
                    setStyleOvr((p) => ({ ...p, [newProp]: newVal }));
                    setNewProp("");
                    setNewVal("");
                  }
                },
                style: {
                  padding: "4px 8px",
                  borderRadius: 4,
                  fontSize: 11,
                  border: "1px solid #DDD",
                  background: "#fff",
                  cursor: "pointer",
                },
              },
              "+",
            ),
          ),
        )
      : h(
          "div",
          {
            style: {
              color: "#999",
              fontSize: 12,
              padding: "20px 0",
              textAlign: "center" as const,
            },
          },
          selectMode ? "스토리에서 요소를 클릭하세요" : "🎯 요소 선택을 클릭하여 시작하세요",
        ),

    // ── 커스텀 CSS ──
    h(
      "div",
      { style: { marginTop: 4 } },
      sectionHeader("커스텀 CSS"),
      h("textarea", {
        value: customCss,
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomCss(e.target.value),
        placeholder: ".my-class {\n  color: red;\n  border-radius: 12px;\n}",
        spellCheck: false,
        style: {
          width: "100%",
          minHeight: 80,
          padding: 8,
          border: "1px solid #DDD",
          borderRadius: 6,
          fontSize: 11,
          fontFamily: "'SF Mono', Monaco, Consolas, monospace",
          lineHeight: 1.5,
          resize: "vertical" as const,
          boxSizing: "border-box" as const,
        },
      }),
    ),

    // ── 토큰 팔레트 ──
    h(
      "div",
      { style: { marginTop: 8 } },
      h(
        "div",
        {
          onClick: () => setShowPalette(!showPalette),
          style: {
            fontSize: 11,
            fontWeight: 700,
            color: "#333",
            marginBottom: 4,
            paddingBottom: 4,
            borderBottom: "1px solid #EEE",
            cursor: "pointer",
            userSelect: "none" as const,
          },
        },
        `${showPalette ? "▼" : "▶"} 토큰 팔레트`,
      ),
      showPalette &&
        (() => {
          const brand = readBrandFromPreview();
          const theme = BRANDS[brand] || BRANDS["nudge-eap"];
          const colorTokens = Object.entries(theme.cssVars).filter(([, v]) => /^#|^rgb/.test(v));
          const sizeTokens = Object.entries(theme.cssVars).filter(([, v]) => /^\d+px$/.test(v));
          return h(
            React.Fragment,
            null,
            // 컬러 스와치
            h(
              "div",
              { style: { display: "flex", flexWrap: "wrap" as const, gap: 4, marginBottom: 8 } },
              ...colorTokens.map(([key, val]) =>
                h("div", {
                  key,
                  onClick: () => navigator.clipboard.writeText(val),
                  title: `${key.replace(/^--/, "")}\n${val}\n클릭하여 복사`,
                  style: {
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: val,
                    border: "1px solid rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    position: "relative" as const,
                  },
                }),
              ),
            ),
            // 사이즈 토큰
            sizeTokens.length > 0 &&
              h(
                "div",
                { style: { display: "flex", flexWrap: "wrap" as const, gap: 4 } },
                ...sizeTokens.map(([key, val]) =>
                  h(
                    "span",
                    {
                      key,
                      onClick: () => navigator.clipboard.writeText(val),
                      title: `${key.replace(/^--/, "")}\n클릭하여 복사`,
                      style: {
                        padding: "2px 6px",
                        borderRadius: 4,
                        fontSize: 10,
                        border: "1px solid #DDD",
                        background: "#F9FAFB",
                        cursor: "pointer",
                        color: "#666",
                      },
                    },
                    `${key.replace(/^--(nds-|radius-)/, "")} ${val}`,
                  ),
                ),
              ),
          );
        })(),
    ),
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

/* ─── HTML Export 패널 ─── */

const HTML_EXPORT_PANEL_ID = "nds-html-export/panel";

/** preview iframe URL에서 스토리 이름 추출 */
function getStoryName(): string {
  try {
    const iframe = document.querySelector<HTMLIFrameElement>("#storybook-preview-iframe");
    if (iframe?.src) {
      const url = new URL(iframe.src);
      const id = url.searchParams.get("id") || "";
      // "mockups-trost심리검사목록--default" → "trost심리검사목록"
      return id.replace(/^mockups-/, "").replace(/--.*$/, "") || "mockup";
    }
  } catch {
    /* 무시 */
  }
  return "mockup";
}

/** 폰트 CDN 링크 (브랜드별) */
const FONT_LINKS: Record<string, string> = {
  trost:
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">',
  geniet:
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap">',
  "nudge-eap":
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">',
};

/** 이미지를 base64 data URI로 변환 */
async function imgToDataUri(img: HTMLImageElement): Promise<string> {
  // 이미 data URI이면 그대로
  if (img.src.startsWith("data:")) return img.src;

  try {
    // fetch로 blob 가져와서 변환 (CORS 안전)
    const res = await fetch(img.src);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(img.src);
      reader.readAsDataURL(blob);
    });
  } catch {
    // fetch 실패 시 canvas fallback
    try {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width || 100;
      canvas.height = img.naturalHeight || img.height || 100;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      return canvas.toDataURL("image/png");
    } catch {
      return img.src;
    }
  }
}

/** CSS background-image url()을 base64로 변환 */
async function inlineCssBgImages(cssText: string, baseUrl: string): Promise<string> {
  const urlRegex = /url\(["']?((?!data:)[^"')]+)["']?\)/g;
  const matches = [...cssText.matchAll(urlRegex)];
  if (matches.length === 0) return cssText;

  let result = cssText;
  for (const match of matches) {
    try {
      const imgUrl = new URL(match[1], baseUrl).href;
      const res = await fetch(imgUrl);
      const blob = await res.blob();
      const dataUri: string = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(match[1]);
        reader.readAsDataURL(blob);
      });
      result = result.replaceAll(match[0], `url("${dataUri}")`);
    } catch {
      // 변환 실패하면 원본 유지
    }
  }
  return result;
}

/** html2canvas를 iframe 내부에 동적 로드 */
type Html2CanvasFn = (
  el: HTMLElement,
  opts?: Record<string, unknown>,
) => Promise<HTMLCanvasElement>;

async function loadHtml2Canvas(iframeWin: Window): Promise<Html2CanvasFn> {
  const win = iframeWin as Window & { html2canvas?: Html2CanvasFn };
  if (win.html2canvas) return win.html2canvas;
  return new Promise((resolve, reject) => {
    const script = iframeWin.document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    script.onload = () => resolve(win.html2canvas!);
    script.onerror = () => reject(new Error("html2canvas 로드 실패"));
    iframeWin.document.head.appendChild(script);
  });
}

function HtmlExportPanel() {
  const [status, setStatus] = React.useState<string>("");
  const [exporting, setExporting] = React.useState(false);
  const [snapping, setSnapping] = React.useState(false);
  const [scale, setScale] = React.useState(2);

  const handleSnapshot = async () => {
    const iframe = document.querySelector<HTMLIFrameElement>("#storybook-preview-iframe");
    if (!iframe?.contentWindow || !iframe.contentDocument) {
      setStatus("미리보기 iframe을 찾을 수 없습니다.");
      return;
    }

    setSnapping(true);
    setStatus("스냅샷 캡처 중...");

    try {
      const iframeWin = iframe.contentWindow;
      const doc = iframe.contentDocument;

      // Storybook 오버레이 숨기기
      const tooltip = doc.getElementById("nds-spec-tooltip");
      const highlight = doc.getElementById("nds-spec-highlight");
      if (tooltip) tooltip.style.display = "none";
      if (highlight) highlight.style.display = "none";

      const html2canvas = await loadHtml2Canvas(iframeWin);
      const canvas = await html2canvas(doc.body, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#FFFFFF",
        width: doc.body.scrollWidth,
        height: doc.body.scrollHeight,
        windowWidth: doc.body.scrollWidth,
        windowHeight: doc.body.scrollHeight,
      });

      const storyName = getStoryName();
      const brand = readBrandFromPreview();

      canvas.toBlob((blob: Blob | null) => {
        if (!blob) {
          setStatus("캡처 실패");
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${storyName}-${brand}@${scale}x.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setStatus(`${storyName}-${brand}@${scale}x.png 저장 완료!`);
      }, "image/png");
    } catch (err) {
      setStatus(`오류: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSnapping(false);
      setTimeout(() => setStatus(""), 4000);
    }
  };

  const handleExport = async () => {
    const iframe = document.querySelector<HTMLIFrameElement>("#storybook-preview-iframe");
    if (!iframe?.contentDocument) {
      setStatus("미리보기 iframe을 찾을 수 없습니다.");
      return;
    }

    setExporting(true);
    setStatus("내보내는 중...");

    try {
      const doc = iframe.contentDocument;
      const brand = readBrandFromPreview();
      const baseUrl = iframe.src;

      // 1. 모든 스타일시트의 CSS 규칙 수집
      let cssText = "";
      for (const sheet of doc.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            cssText += rule.cssText + "\n";
          }
        } catch {
          // cross-origin 무시
        }
      }

      // 2. :root 인라인 스타일 (브랜드 CSS 변수 오버라이드) 수집
      const rootStyle = doc.documentElement.style;
      let rootVars = "";
      for (let i = 0; i < rootStyle.length; i++) {
        const prop = rootStyle[i];
        rootVars += `  ${prop}: ${rootStyle.getPropertyValue(prop)};\n`;
      }
      if (rootVars) {
        cssText += `:root {\n${rootVars}}\n`;
      }

      // 3. CSS 내 background-image url()을 base64로 변환
      cssText = await inlineCssBgImages(cssText, baseUrl);

      // 4. body 복제 후 Storybook 전용 요소 제거
      const bodyClone = doc.body.cloneNode(true) as HTMLElement;
      bodyClone.querySelector("#nds-spec-tooltip")?.remove();
      bodyClone.querySelector("#nds-spec-highlight")?.remove();

      // 5. 모든 <img> src를 base64 data URI로 변환
      const origImgs = doc.body.querySelectorAll<HTMLImageElement>("img");
      const cloneImgs = bodyClone.querySelectorAll<HTMLImageElement>("img");
      for (let i = 0; i < origImgs.length; i++) {
        if (origImgs[i].src && !origImgs[i].src.startsWith("data:")) {
          cloneImgs[i].src = await imgToDataUri(origImgs[i]);
        }
      }

      // 6. inline style의 background-image도 변환
      const allEls = bodyClone.querySelectorAll<HTMLElement>("*");
      for (const el of allEls) {
        const bg = el.style.backgroundImage;
        if (bg && bg.includes("url(") && !bg.includes("data:")) {
          el.style.backgroundImage = await inlineCssBgImages(bg, baseUrl);
        }
      }

      // 7. standalone HTML 생성
      const storyName = getStoryName();
      const fontLink = FONT_LINKS[brand] || FONT_LINKS["nudge-eap"];
      const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${storyName} — ${(BRANDS[brand] || BRANDS["nudge-eap"]).label}</title>
${fontLink}
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
${cssText}
</style>
</head>
<body>
${bodyClone.innerHTML}
</body>
</html>`;

      // 8. 다운로드
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${storyName}-${brand}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus(`${storyName}-${brand}.html 저장 완료!`);
    } catch (err) {
      setStatus(`오류: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setExporting(false);
      setTimeout(() => setStatus(""), 4000);
    }
  };

  const busy = exporting || snapping;

  const btnStyle = (active: boolean, disabled: boolean): React.CSSProperties => ({
    padding: "10px 24px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    cursor: disabled ? "wait" : "pointer",
    border: "none",
    background: disabled ? "#999" : active ? "#333" : "#555",
    color: "#fff",
    fontFamily: "inherit",
  });

  return React.createElement(
    "div",
    {
      style: {
        padding: 16,
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      },
    },
    // 버튼 행
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 12,
          flexWrap: "wrap" as const,
        },
      },
      React.createElement(
        "button",
        { onClick: handleExport, disabled: busy, style: btnStyle(true, busy) },
        exporting ? "내보내는 중..." : "HTML 저장",
      ),
      React.createElement(
        "button",
        { onClick: handleSnapshot, disabled: busy, style: btnStyle(false, busy) },
        snapping ? "캡처 중..." : "PNG 저장",
      ),
      // 배율 선택
      React.createElement(
        "span",
        { style: { fontSize: 11, color: "#888", marginLeft: 4 } },
        "배율",
      ),
      ...[1, 2, 3].map((s) =>
        React.createElement(
          "button",
          {
            key: s,
            onClick: () => setScale(s),
            style: {
              padding: "4px 8px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: scale === s ? 700 : 400,
              border: scale === s ? "1.5px solid #333" : "1px solid #DDD",
              background: scale === s ? "#F4F5F7" : "#fff",
              color: "#333",
              cursor: "pointer",
            },
          },
          `${s}x`,
        ),
      ),
    ),
    // 상태 메시지
    status &&
      React.createElement(
        "div",
        {
          style: {
            marginBottom: 12,
            fontSize: 12,
            color: status.startsWith("오류") ? "#F44" : "#13BFA2",
          },
        },
        status,
      ),
    // 설명
    React.createElement(
      "div",
      { style: { fontSize: 12, color: "#888", lineHeight: 1.8 } },
      React.createElement("div", null, "현재 스토리를 외부 파일로 내보냅니다."),
      React.createElement(
        "div",
        { style: { paddingLeft: 12, marginTop: 4 } },
        React.createElement("strong", null, "HTML"),
        " — 단독 HTML 파일 (CSS/이미지 인라인, 브라우저에서 바로 열기 가능)",
        React.createElement("br"),
        React.createElement("strong", null, "PNG"),
        " — 스크린샷 이미지 (전체 페이지 캡처, 배율 선택 가능)",
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
  addons.add(CSS_EDITOR_PANEL_ID, {
    type: types.PANEL,
    title: "✏️ CSS",
    render: ({ active }) => (active ? React.createElement(CssEditorPanel) : null),
  });
  addons.add(HTML_EXPORT_PANEL_ID, {
    type: types.PANEL,
    title: "💾 HTML",
    render: ({ active }) => (active ? React.createElement(HtmlExportPanel) : null),
  });
});
