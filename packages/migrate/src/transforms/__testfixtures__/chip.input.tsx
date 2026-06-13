export function Tags() {
  return (
    <div>
      <span className="chip">기본</span>
      <span className="chip lg">큰칩</span>
      <span className="chip">{dynamic}</span>
      <span className="chip"><b>요소</b></span>
    </div>
  );
}
