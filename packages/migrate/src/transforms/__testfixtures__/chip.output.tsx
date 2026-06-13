import { Chip } from "@nudge-design/react";
export function Tags() {
  return (
    <div>
      <Chip label="기본" />
      <Chip label="큰칩" className="lg" />
      <span className="chip">{dynamic}</span>
      <span className="chip"><b>요소</b></span>
    </div>
  );
}
