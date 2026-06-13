import { Badge } from "@nudge-design/react";
export function Tags() {
  return (
    <div>
      <Badge color="success">완료</Badge>
      <Badge className="extra">기본</Badge>
      <Badge color="error" className="pill">위험</Badge>
      <span className="label">뱃지아님</span>
    </div>
  );
}
