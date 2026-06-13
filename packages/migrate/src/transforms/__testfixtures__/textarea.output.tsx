import { Textarea } from "@nudge-design/react";
export function F() {
  return (
    <div>
      <Textarea placeholder="메모" value={v} onChange={onV} rows={4} />
      <textarea>기본값있음</textarea>
    </div>
  );
}
