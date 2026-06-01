import { useCallback, useState } from "react";
import type { ClaudeInstall } from "../../../preload/index.js";
import { c, font, ghostBtn, mono, primaryBtn } from "../ui/theme.js";

/**
 * claude 설정 충돌 사후 안내 모달.
 *
 * 앱이 spawn 한 claude 가 settings 적용 중 `Object not disposable` 등으로 죽으면(보통 구버전/중복
 * 설치가 원인) main 이 설치 목록을 스캔해 보내고, 이 패널이 "어느 claude 를 정리할지" 안내한다.
 * 특정 원인을 단정하지 않고 "활성본만 남기고 정리 후 재시도" 톤 — 어떤 경우든 도움되게.
 */
function removalCmd(install: ClaudeInstall): string {
  // npm/노드버전매니저(nvm·volta·asdf·nodenv) 아래면 전역 패키지 제거, 아니면 파일 직접 삭제.
  return /[\\/](\.nvm|\.volta|\.asdf|\.nodenv|node|npm)[\\/]/i.test(install.path)
    ? "npm rm -g @anthropic-ai/claude-code"
    : `rm -f "${install.path}"`;
}

export function AgentConflictPrompt({
  installs,
  onClose,
  onRetry,
}: {
  installs: ClaudeInstall[];
  onClose: () => void;
  onRetry: () => void;
}): React.JSX.Element {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((k) => (k === key ? null : k)), 1500);
    } catch {
      /* clipboard 거부 시 무시 — 사용자가 직접 선택 복사 */
    }
  }, []);

  // 활성본(앱이 실제로 띄운 것)은 유지, 나머지(특히 동봉본 제외한 PATH 설치본)는 정리 후보.
  const cleanupTargets = installs.filter((i) => !i.active && !i.bundled);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        fontFamily: font,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 520,
          maxWidth: "90vw",
          background: c.bgPanel,
          border: `1px solid ${c.border}`,
          borderRadius: 10,
          padding: 24,
          color: c.text,
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
          claude 설정 충돌이 감지됐어요
        </div>
        <div style={{ fontSize: 12.5, color: c.textMuted, lineHeight: 1.6, marginBottom: 16 }}>
          claude 가 여러 개 설치돼 있어 앱이 구버전/충돌본을 띄운 것 같아요. 아래에서{" "}
          <b>활성본만 남기고 나머지를 정리</b>한 뒤 다시 시도하면 해결됩니다.
        </div>

        {/* 감지된 claude 설치 목록 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {installs.map((i) => (
            <div
              key={i.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: c.bg,
                border: `1px solid ${i.active ? c.accent : c.border}`,
                borderRadius: 6,
                padding: "8px 10px",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <code
                  style={{
                    fontFamily: mono,
                    fontSize: 12,
                    color: c.text,
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={i.path}
                >
                  {i.path}
                </code>
                <span style={{ fontSize: 11, color: c.textFaint }}>
                  {i.version ? `v${i.version}` : "버전 확인 불가"}
                </span>
              </div>
              <Badge active={i.active} bundled={i.bundled} />
            </div>
          ))}
        </div>

        {/* 정리 명령 — 활성/동봉 제외 후보별 */}
        {cleanupTargets.length > 0 && (
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 11.5, color: c.textMuted, marginBottom: 6 }}>
              정리할 claude (활성본·동봉본 제외):
            </div>
            {cleanupTargets.map((i) => {
              const cmd = removalCmd(i);
              return (
                <div
                  key={i.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: c.bg,
                    border: `1px solid ${c.border}`,
                    borderRadius: 6,
                    padding: "8px 10px",
                    marginBottom: 6,
                  }}
                >
                  <code
                    style={{
                      fontFamily: mono,
                      fontSize: 12,
                      color: c.text,
                      flex: 1,
                      overflow: "auto",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cmd}
                  </code>
                  <button
                    style={{ ...ghostBtn, fontSize: 11, padding: "2px 8px", flexShrink: 0 }}
                    onClick={() => void copy(cmd, i.path)}
                  >
                    {copied === i.path ? "복사됨" : "복사"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ fontSize: 11, color: c.textFaint, marginBottom: 16 }}>
          확인용: 터미널에서 <code style={{ fontFamily: mono }}>which -a claude</code> 로 중복
          설치를 한눈에 볼 수 있어요.
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button style={ghostBtn} onClick={onClose}>
            닫기
          </button>
          <button style={primaryBtn} onClick={onRetry}>
            다시 시도
          </button>
        </div>
      </div>
    </div>
  );
}

function Badge({ active, bundled }: { active: boolean; bundled: boolean }): React.JSX.Element {
  const label = active ? "활성 (앱이 띄움)" : bundled ? "앱 동봉" : "정리 권장";
  const color = active ? c.accent : bundled ? c.textMuted : c.red;
  return (
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 600,
        color,
        border: `1px solid ${color}`,
        borderRadius: 4,
        padding: "2px 6px",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
