import { useEffect, useRef, useState } from "react";
import { c, font, input, mono as monoFont } from "./theme.js";

/**
 * 다크 테마 커스텀 드롭다운 — 네이티브 <select> 대체.
 * 바깥 클릭 / ESC 로 닫히고, 선택 항목은 옐로우 포인트로 강조한다.
 */
export interface DropdownOption {
  value: string;
  label: string;
}

export function Dropdown({
  value,
  options,
  onChange,
  placeholder = "선택",
  disabled = false,
  mono = false,
}: {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** 값 표기를 모노스페이스로(파일 경로/슬러그 등). */
  mono?: boolean;
}): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);
  const fam = mono ? monoFont : font;

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

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        style={{
          ...input,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          textAlign: "left",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          fontFamily: fam,
          color: selected ? c.text : c.textFaint,
          borderColor: open ? c.accent : c.border,
        }}
      >
        <span
          style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}
        >
          {selected ? selected.label : placeholder}
        </span>
        <span
          aria-hidden
          style={{
            color: c.textMuted,
            fontSize: 10,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.12s ease",
          }}
        >
          ▼
        </span>
      </button>
      {open && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 50,
            background: c.bgElevated,
            border: `1px solid ${c.border}`,
            borderRadius: 6,
            padding: 4,
            maxHeight: 240,
            overflowY: "auto",
            boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
          }}
        >
          {options.map((o) => {
            const active = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(o.value);
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
                  padding: "7px 10px",
                  border: "none",
                  borderRadius: 4,
                  background: active ? c.accentBg : "transparent",
                  color: active ? c.accent : c.text,
                  cursor: "pointer",
                  fontSize: 13,
                  fontFamily: fam,
                }}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
