export function Toolbar() {
  return (
    <div>
      <button className="btn-primary" onClick={save}>저장</button>
      <button className="btn-outline extra" disabled>취소</button>
      <button className={cx("btn-primary")}>동적은 건드리지 않음</button>
      <button className="plain">인식 안 되면 그대로</button>
    </div>
  );
}
