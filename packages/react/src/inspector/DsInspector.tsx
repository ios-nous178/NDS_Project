import { useCallback, useEffect, useRef, useState } from "react";

/**
 * DsInspector — 런타임 DS 컴포넌트 사용 시각화 오버레이.
 *
 * 외부 mockup 프로젝트의 main.tsx 또는 App.tsx 에 dev-only 로 마운트하면,
 * 화면 우하단 floating 버튼이 뜨고 클릭(또는 Ctrl/Cmd+Shift+D) 시 페이지의
 * 모든 element 를 분류해 outline + 카운트로 표시한다.
 *
 *   - DS    (초록 실선): className 에 `nds-` prefix → @nudge-eap/react 컴포넌트
 *   - antd  (주황 실선): className 에 `ant-` prefix → antd 컴포넌트
 *   - native(빨강 점선): plain <button>/<input>/<select> 등 raw HTML primitive
 *
 * production 빌드에 노출되지 않도록 사용 시점에 `import.meta.env.DEV` 등으로
 * 가드하는 것을 권장.
 */

type Category = "ds" | "antd" | "native";

interface InspectorStats {
  ds: number;
  antd: number;
  native: number;
}

const DS_CLASS_PREFIX = "nds-";
const ANTD_CLASS_PREFIX = "ant-";
const NATIVE_TAGS = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "FORM", "LABEL"]);

const CATEGORY_COLOR: Record<Category, string> = {
  ds: "#22c55e",
  antd: "#f97316",
  native: "#ef4444",
};

const CATEGORY_LABEL: Record<Category, string> = {
  ds: "DS",
  antd: "antd",
  native: "native",
};

function elementClassList(el: Element): string[] {
  const cls = (el as HTMLElement).className;
  if (typeof cls === "string") return cls.split(/\s+/);
  // SVGElement.className is SVGAnimatedString
  if (cls && typeof (cls as { baseVal?: string }).baseVal === "string") {
    return (cls as { baseVal: string }).baseVal.split(/\s+/);
  }
  return [];
}

function classify(el: Element): Category | null {
  const classes = elementClassList(el);
  if (classes.some((c) => c.startsWith(DS_CLASS_PREFIX))) return "ds";
  if (classes.some((c) => c.startsWith(ANTD_CLASS_PREFIX))) return "antd";
  if (NATIVE_TAGS.has(el.tagName)) return "native";
  return null;
}

const STYLE_ID = "nds-inspector-style";
const UI_ATTR = "data-nds-inspector-ui";
const MARK_ATTR = "data-nds-inspect";

function injectOutlineStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    [${MARK_ATTR}="ds"] { outline: 2px solid ${CATEGORY_COLOR.ds} !important; outline-offset: -2px !important; }
    [${MARK_ATTR}="antd"] { outline: 2px solid ${CATEGORY_COLOR.antd} !important; outline-offset: -2px !important; }
    [${MARK_ATTR}="native"] { outline: 2px dashed ${CATEGORY_COLOR.native} !important; outline-offset: -2px !important; }
  `;
  document.head.appendChild(s);
}

function removeOutlineStyle() {
  document.getElementById(STYLE_ID)?.remove();
}

function clearMarks() {
  document.querySelectorAll(`[${MARK_ATTR}]`).forEach((el) => el.removeAttribute(MARK_ATTR));
}

function scanAndMark(): InspectorStats {
  const counts: InspectorStats = { ds: 0, antd: 0, native: 0 };
  const all = document.body.querySelectorAll("*");
  all.forEach((el) => {
    if (el.closest(`[${UI_ATTR}]`)) return;
    const cat = classify(el);
    if (cat) {
      el.setAttribute(MARK_ATTR, cat);
      counts[cat] += 1;
    } else if (el.hasAttribute(MARK_ATTR)) {
      el.removeAttribute(MARK_ATTR);
    }
  });
  return counts;
}

export interface DsInspectorProps {
  /** 페이지 로드 시 기본 활성 상태. 기본값 false. */
  defaultEnabled?: boolean;
  /** outline 표시 기본값. 기본값 true. */
  defaultOutline?: boolean;
}

export function DsInspector({
  defaultEnabled = false,
  defaultOutline = true,
}: DsInspectorProps = {}) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [showOutline, setShowOutline] = useState(defaultOutline);
  const [stats, setStats] = useState<InspectorStats>({ ds: 0, antd: 0, native: 0 });
  const rafRef = useRef<number | null>(null);

  const refresh = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      setStats(scanAndMark());
    });
  }, []);

  // 키보드 단축키 Ctrl/Cmd + Shift + D
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        setEnabled((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // enable / disable 부수효과
  useEffect(() => {
    if (!enabled) {
      removeOutlineStyle();
      clearMarks();
      setStats({ ds: 0, antd: 0, native: 0 });
      return;
    }
    if (showOutline) injectOutlineStyle();
    else removeOutlineStyle();
    refresh();
    const obs = new MutationObserver(refresh);
    obs.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      obs.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, showOutline, refresh]);

  const total = stats.ds + stats.antd + stats.native;
  const dsRatio = total === 0 ? 0 : Math.round((stats.ds / total) * 100);

  return (
    <div
      {...{ [UI_ATTR]: "" }}
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 2147483647,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Pretendard', 'Apple SD Gothic Neo', sans-serif",
        fontSize: 12,
        lineHeight: 1.4,
        color: "#111",
      }}
    >
      {!enabled && (
        <button
          type="button"
          onClick={() => setEnabled(true)}
          title="DS Inspector 켜기 (Ctrl/Cmd+Shift+D)"
          style={{
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 9999,
            padding: "8px 14px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          🔍 DS Inspector
        </button>
      )}
      {enabled && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
            padding: 12,
            minWidth: 220,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <strong style={{ fontSize: 13 }}>DS Inspector</strong>
            <button
              type="button"
              onClick={() => setEnabled(false)}
              aria-label="Inspector 끄기"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: 16,
                lineHeight: 1,
                color: "#666",
              }}
            >
              ×
            </button>
          </div>
          <StatRow color={CATEGORY_COLOR.ds} label={CATEGORY_LABEL.ds} count={stats.ds} />
          <StatRow color={CATEGORY_COLOR.antd} label={CATEGORY_LABEL.antd} count={stats.antd} />
          <StatRow
            color={CATEGORY_COLOR.native}
            label={CATEGORY_LABEL.native}
            count={stats.native}
          />
          <div
            style={{
              marginTop: 8,
              paddingTop: 8,
              borderTop: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              color: "#666",
            }}
          >
            <span>총 {total}</span>
            <span>
              DS 비율 <strong style={{ color: "#111" }}>{dsRatio}%</strong>
            </span>
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginTop: 10,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={showOutline}
              onChange={(e) => setShowOutline(e.target.checked)}
            />
            <span>outline 표시</span>
          </label>
          <div style={{ marginTop: 6, color: "#999", fontSize: 11 }}>
            Ctrl/Cmd + Shift + D 로 토글
          </div>
        </div>
      )}
    </div>
  );
}

interface StatRowProps {
  color: string;
  label: string;
  count: number;
}

function StatRow({ color, label, count }: StatRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "3px 0",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 10,
          height: 10,
          borderRadius: 2,
          background: color,
          flexShrink: 0,
        }}
      />
      <span style={{ flex: 1 }}>{label}</span>
      <strong>{count}</strong>
    </div>
  );
}
