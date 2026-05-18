import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* ─── Types ─── */

export type HighlightMode = "off" | "area" | "component" | "all";

interface DSHighlightContextValue {
  mode: HighlightMode;
  cycle: () => void;
  registerArea: (id: string, el: HTMLElement | null) => void;
}

const MODE_LABELS: Record<HighlightMode, string> = {
  off: "OFF",
  area: "영역",
  component: "개별",
  all: "전체",
};

const MODES: HighlightMode[] = ["off", "area", "component", "all"];

/* ─── Context ─── */

const DSHighlightContext = createContext<DSHighlightContextValue>({
  mode: "off",
  cycle: () => {},
  registerArea: () => {},
});

export const useDSHighlight = () => useContext(DSHighlightContext);

/* ─── NDS 컴포넌트 자동 감지 ─── */

function extractNdsName(el: Element): string | null {
  for (const cls of el.classList) {
    const match = cls.match(/^nds-(.+)__root$/);
    if (match) {
      return match[1]
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join("");
    }
  }
  return null;
}

/* ─── Overlay Rect ─── */

interface OverlayRect {
  id: string;
  label: string;
  top: number;
  left: number;
  width: number;
  height: number;
  color: string;
}

const AREA_COLOR = "#2b96ed";
const COMPONENT_COLOR = "rgba(237, 46, 119, 0.8)";

/* ─── Provider ─── */

/**
 * DS 하이라이트 Provider — NDS 컴포넌트 디버깅 도구
 *
 * 활성화:
 * - URL: ?ds=1
 * - 키보드: Ctrl+Shift+D / Cmd+Shift+D
 *
 * 모드 순환: OFF → 영역 → 개별 → 전체 → OFF
 */
export interface DSHighlightProviderProps {
  /** 앱 콘텐츠 (하위에서 DSMark 사용 가능) */
  children: React.ReactNode;
  /** 초기 모드 (기본: "off") */
  defaultMode?: HighlightMode;
}

export const DSHighlightProvider: React.FC<DSHighlightProviderProps> = ({
  children,
  defaultMode = "off",
}) => {
  const [mode, setMode] = useState<HighlightMode>(defaultMode);
  const [devMode, setDevMode] = useState(defaultMode !== "off");
  const areasRef = useRef<Map<string, HTMLElement>>(new Map());

  const cycle = useCallback(() => {
    setMode((prev) => {
      const idx = MODES.indexOf(prev);
      return MODES[(idx + 1) % MODES.length];
    });
  }, []);

  const registerArea = useCallback((id: string, el: HTMLElement | null) => {
    if (el) {
      areasRef.current.set(id, el);
    } else {
      areasRef.current.delete(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("ds") === "1") {
      setDevMode(true);
      setMode("all");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setDevMode(true);
        setMode((prev) => {
          const idx = MODES.indexOf(prev);
          return MODES[(idx + 1) % MODES.length];
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <DSHighlightContext.Provider value={{ mode, cycle, registerArea }}>
      {children}
      {devMode && <DSHighlightToggle />}
      {mode !== "off" && <DSOverlayPortal mode={mode} areasRef={areasRef} />}
    </DSHighlightContext.Provider>
  );
};

/* ─── DSMark ─── */

export interface DSMarkProps {
  /** 오버레이에 표시할 DS 영역 라벨 */
  label: string;
  /** 래핑할 콘텐츠 */
  children: React.ReactNode;
  /** 래퍼 div에 추가할 className */
  className?: string;
}

/**
 * DS 교체 영역 등록 래퍼.
 * 래핑 div에 ref를 등록하고, Portal 오버레이에서 rect를 측정하여 그림.
 */
export const DSMark: React.FC<DSMarkProps> = ({ label, children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { registerArea } = useDSHighlight();

  useEffect(() => {
    registerArea(label, ref.current);
    return () => registerArea(label, null);
  }, [label, registerArea]);

  return (
    <div ref={ref} className={className} data-ds-mark={label}>
      {children}
    </div>
  );
};

/* ─── Overlay Portal ─── */

const DSOverlayPortal: React.FC<{
  mode: HighlightMode;
  areasRef: React.RefObject<Map<string, HTMLElement>>;
}> = ({ mode, areasRef }) => {
  const [rects, setRects] = useState<OverlayRect[]>([]);
  const [mounted, setMounted] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const measure = () => {
      const next: OverlayRect[] = [];

      if (mode === "area" || mode === "all") {
        areasRef.current?.forEach((el, label) => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            next.push({
              id: `area-${label}`,
              label: `DS: ${label}`,
              top: r.top + window.scrollY,
              left: r.left + window.scrollX,
              width: r.width,
              height: r.height,
              color: AREA_COLOR,
            });
          }
        });
      }

      if (mode === "component" || mode === "all") {
        const els = document.querySelectorAll('[class*="__root"]');
        els.forEach((el) => {
          const name = extractNdsName(el);
          if (!name) return;
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            next.push({
              id: `comp-${name}-${r.top}-${r.left}`,
              label: name,
              top: r.top + window.scrollY,
              left: r.left + window.scrollX,
              width: r.width,
              height: r.height,
              color: COMPONENT_COLOR,
            });
          }
        });
      }

      setRects(next);
      rafRef.current = requestAnimationFrame(measure);
    };

    rafRef.current = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mode, mounted, areasRef]);

  if (!mounted) return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        overflow: "visible",
        pointerEvents: "none",
        zIndex: 99998,
      }}
    >
      {rects.map((rect) => (
        <div key={rect.id}>
          <div
            style={{
              position: "absolute",
              top: rect.top - 3,
              left: rect.left - 3,
              width: rect.width + 6,
              height: rect.height + 6,
              border: `2px dashed ${rect.color}`,
              borderRadius: 8,
              pointerEvents: "none",
            }}
          />
          <span
            style={{
              position: "absolute",
              top: rect.top - 14,
              left: rect.left + 4,
              background: rect.color,
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              padding: "1px 6px",
              borderRadius: 3,
              whiteSpace: "nowrap",
              lineHeight: "16px",
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              pointerEvents: "none",
            }}
          >
            {rect.label}
          </span>
        </div>
      ))}
    </div>,
    document.body,
  );
};

/* ─── Draggable Toggle Button ─── */

const DRAG_THRESHOLD = 5;

const DSHighlightToggle: React.FC = () => {
  const { mode, cycle } = useDSHighlight();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const dragState = useRef({
    dragging: false,
    didDrag: false,
    startX: 0,
    startY: 0,
    elX: 0,
    elY: 0,
  });

  useEffect(() => {
    setPos({
      left: window.innerWidth - 180,
      top: window.innerHeight - 64,
    });
  }, []);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      const s = dragState.current;
      if (!s.dragging) return;
      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;
      if (!s.didDrag && Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
      s.didDrag = true;
      setPos({ left: s.elX + dx, top: s.elY + dy });
    };

    const handleUp = () => {
      dragState.current.dragging = false;
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!pos) return;
    dragState.current = {
      dragging: true,
      didDrag: false,
      startX: e.clientX,
      startY: e.clientY,
      elX: pos.left,
      elY: pos.top,
    };
    btnRef.current?.setPointerCapture(e.pointerId);
  };

  const handleClick = () => {
    if (!dragState.current.didDrag) cycle();
  };

  if (!pos) return null;

  return createPortal(
    <button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      style={{
        position: "fixed",
        left: pos.left,
        top: pos.top,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        gap: "var(--gap-default)",
        padding: "10px var(--inset-card)",
        borderRadius: 999,
        border: "none",
        background: mode === "off" ? "#383838" : "#2b96ed",
        color: "#fff",
        fontSize: 13,
        fontWeight: 700,
        cursor: "grab",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        transition: "background 0.2s",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: mode === "off" ? "#666" : "#fff",
          transition: "background 0.2s",
        }}
      />
      DS {MODE_LABELS[mode]}
    </button>,
    document.body,
  );
};
