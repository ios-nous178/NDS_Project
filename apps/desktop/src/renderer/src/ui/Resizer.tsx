/**
 * renderer/ui/Resizer.tsx — 패널 사이 세로 드래그 핸들.
 *
 * 패널 경계(absolute left)에 겹쳐 깔리는 투명 스트립. idle 일 땐 패널의 borderRight 가
 * 라인을 그리고, hover/drag 시 accent 라인을 덧그린다. setPointerCapture 로 드래그 중
 * iframe(미리보기) 위에서도 pointer 이벤트를 핸들이 계속 받는다.
 */
import { useRef, useState } from "react";
import { c } from "./theme.js";

export function Resizer({
  left,
  onDrag,
  onDragEnd,
  ariaLabel,
}: {
  /** 경계의 x(컨테이너 기준 px). 핸들은 이 좌표를 중심으로 깔린다. */
  left: number;
  /** 드래그 중 호출 — 절대 clientX 를 넘긴다(호출자가 컨테이너 rect 로 폭 환산). */
  onDrag: (clientX: number) => void;
  onDragEnd?: () => void;
  ariaLabel?: string;
}): React.JSX.Element {
  const [activeOrHover, setActiveOrHover] = useState<"idle" | "hover" | "active">("idle");
  const draggingRef = useRef(false);

  const end = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setActiveOrHover("idle");
    document.body.style.cursor = "";
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // capture 가 이미 풀렸으면 무시.
    }
    onDragEnd?.();
  };

  const shown = activeOrHover !== "idle";
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={ariaLabel}
      onPointerDown={(e) => {
        e.preventDefault();
        draggingRef.current = true;
        setActiveOrHover("active");
        document.body.style.cursor = "col-resize";
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (draggingRef.current) onDrag(e.clientX);
      }}
      onPointerUp={end}
      onPointerCancel={end}
      onPointerEnter={() => {
        if (!draggingRef.current) setActiveOrHover("hover");
      }}
      onPointerLeave={() => {
        if (!draggingRef.current) setActiveOrHover("idle");
      }}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: left - 3,
        width: 7,
        cursor: "col-resize",
        zIndex: 5,
        background: "transparent",
        display: "flex",
        justifyContent: "center",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: activeOrHover === "active" ? 2 : 1,
          height: "100%",
          background: shown ? c.accent : "transparent",
          transition: "background 90ms ease, width 90ms ease",
        }}
      />
    </div>
  );
}
