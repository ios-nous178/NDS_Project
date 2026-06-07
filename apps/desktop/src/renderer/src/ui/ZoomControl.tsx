import { useEffect, useRef, useState } from "react";
import { c, segGroup, segItem } from "./theme.js";
import { ZOOM_MAX, ZOOM_MIN } from "../panels/PreviewPanel.js";

/** 가운데 % 버튼이 여는 프리셋 메뉴. 화면맞춤·실제 크기·배율 프리셋을 한 곳에 모아
 *  상단 툴바에 버튼을 더 늘리지 않는다. */
const PRESETS = [0.5, 0.75, 1, 1.5, 2] as const;

/**
 * 미리보기 확대/축소 컨트롤. −/퍼센트/+ 세그먼트.
 * 가운데 퍼센트 버튼은 클릭 시 드롭다운(화면맞춤 / 실제 크기 / 프리셋)을 연다.
 */
export function ZoomControl({
  zoom,
  onAdjust,
  onSet,
  onFit,
}: {
  zoom: number;
  /** 현재 배율에 delta 를 더한다(−/+ 버튼). */
  onAdjust: (delta: number) => void;
  /** 배율을 절대값으로 설정한다(프리셋 / 실제 크기). */
  onSet: (zoom: number) => void;
  /** 미리보기 영역에 꽉 차도록 배율을 맞춘다(화면맞춤). */
  onFit: () => void;
}): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent): void => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pct = Math.round(zoom * 100);

  const menuItem = (label: string, onClick: () => void, active = false): React.JSX.Element => (
    <button
      type="button"
      onClick={() => {
        onClick();
        setOpen(false);
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = c.bgHover;
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "7px 12px",
        border: "none",
        borderRadius: 4,
        background: active ? c.accentBg : "transparent",
        color: active ? c.accent : c.text,
        cursor: "pointer",
        fontSize: 12,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <div style={segGroup}>
        <button
          onClick={() => onAdjust(-0.1)}
          disabled={zoom <= ZOOM_MIN}
          title="축소"
          aria-label="축소"
          style={{ ...segItem, padding: "3px 9px", opacity: zoom <= ZOOM_MIN ? 0.4 : 1 }}
        >
          −
        </button>
        <button
          onClick={() => setOpen((o) => !o)}
          title="배율 옵션"
          aria-haspopup="menu"
          aria-expanded={open}
          style={{
            ...segItem,
            padding: "3px 6px",
            minWidth: 50,
            justifyContent: "center",
            gap: 4,
            color: open ? c.accent : segItem.color,
          }}
        >
          {pct}%
          <span aria-hidden style={{ fontSize: 8, opacity: 0.7 }}>
            ▼
          </span>
        </button>
        <button
          onClick={() => onAdjust(0.1)}
          disabled={zoom >= ZOOM_MAX}
          title="확대"
          aria-label="확대"
          style={{ ...segItem, padding: "3px 9px", opacity: zoom >= ZOOM_MAX ? 0.4 : 1 }}
        >
          +
        </button>
      </div>
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            zIndex: 50,
            minWidth: 132,
            background: c.bgElevated,
            border: `1px solid ${c.border}`,
            borderRadius: 6,
            padding: 4,
            boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
          }}
        >
          {menuItem("화면맞춤", onFit)}
          {menuItem("실제 크기 (100%)", () => onSet(1), pct === 100)}
          <div style={{ height: 1, background: c.border, margin: "4px 0" }} />
          {PRESETS.map((p) => menuItem(`${Math.round(p * 100)}%`, () => onSet(p), pct === p * 100))}
        </div>
      )}
    </div>
  );
}
