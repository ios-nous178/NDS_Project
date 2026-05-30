export function PreviewPanel({
  relPath,
  bust,
}: {
  relPath: string | null;
  bust: number;
}): React.JSX.Element {
  if (!relPath)
    return (
      <div style={{ color: "#999", fontSize: 13, padding: 16 }}>
        파일을 선택하면 미리보기가 표시됩니다.
      </div>
    );

  const src = window.harness.previewUrl(relPath, bust);
  return (
    <iframe
      // src(쿼리 캐시버스터)가 바뀌면 자동 리로드. 저장 시 bust 증가로 갱신.
      src={src}
      title="mockup preview"
      sandbox="allow-scripts"
      style={{ width: "100%", height: "100%", border: "none", background: "#fff" }}
    />
  );
}
