import { Button } from "@nudge-design/react";
export function Toolbar() {
  return (
    <div>
      <Button variant="solid" onClick={save}>저장</Button>
      <Button variant="outlined" disabled className="extra">취소</Button>
      <button className={cx("btn-primary")}>동적은 건드리지 않음</button>
      <button className="plain">인식 안 되면 그대로</button>
    </div>
  );
}
