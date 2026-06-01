import { useCallback, useState } from "react";
import type { ClaudeInstall } from "../../../preload/index.js";
import { c, font, ghostBtn, mono, primaryBtn } from "../ui/theme.js";

/**
 * claude 설정 충돌 사후 안내 모달.
 *
 * 앱이 spawn 한 claude 가 settings 적용 중 `Object not disposable` 등으로 죽으면(보통 구버전/중복
 * 설치가 원인) main 이 설치 목록을 스캔해 보내고, 이 패널이 "어느 claude 를 정리할지" 안내한다.
 *
 * 두 갈래를 구분한다:
 *  · 활성본(앱이 실제로 띄운 것)이 구버전 → 활성본을 업데이트/정리하라고 안내(이 경우가 진짜 원인).
 *  · 활성본은 멀쩡하고 다른 중복본이 있음 → 중복본 정리 안내.
 */
function removalCmd(install: ClaudeInstall): string {
  // npm/노드버전매니저(nvm·volta·asdf·nodenv) 아래면 전역 패키지 제거, 아니면 파일 직접 삭제.
  return /[\\/](\.nvm|\.volta|\.asdf|\.nodenv|node|npm)[\\/]/i.test(install.path)
    ? "npm rm -g @anthropic-ai/claude-code"
    : `rm -f "${install.path}"`;
}

/** "1.2.3" 버전 비교 — a<b 면 음수. 숫자 파트만, 누락 파트는 0. */
function cmpSemver(a: string, b: string): number {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i += 1) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
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

  // 활성본 = 앱이 실제로 띄운 것. 설치된 것 중 최고 버전보다 낮으면 = 구버전이 먼저 잡힌 것(진짜 원인).
  const active = installs.find((i) => i.active);
  const versions = installs.map((i) => i.version).filter((v): v is string => !!v);
  const bestVersion = versions.reduce((m, v) => (cmpSemver(v, m) > 0 ? v : m), versions[0] ?? "");
  const activeOutdated =
    !!active?.version && !!bestVersion && cmpSemver(active.version, bestVersion) < 0;

  // 활성/동봉 제외한 나머지 = 중복본(정리 후보).
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
          {activeOutdated ? (
            <>
              앱이 띄운 claude(활성본)가 <b>구버전 v{active?.version}</b> 이에요. 최신{" "}
              <b>v{bestVersion}</b> 으로 업데이트하거나, 이 구버전을 정리해 최신본이 잡히게 한 뒤
              다시 시도하세요.
            </>
          ) : (
            <>
              claude 가 여러 개 설치돼 있어 앱이 충돌본을 띄운 것 같아요. 아래에서{" "}
              <b>활성본만 남기고 나머지를 정리</b>한 뒤 다시 시도하면 해결됩니다.
            </>
          )}
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
                border: `1px solid ${i.active ? (activeOutdated ? c.red : c.accent) : c.border}`,
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
              <Badge active={i.active} bundled={i.bundled} outdated={i.active && activeOutdated} />
            </div>
          ))}
        </div>

        {/* 활성본이 구버전인 경우 — 업데이트 또는 활성본 자체 정리 안내 */}
        {activeOutdated && active && (
          <div
            style={{
              border: `1px solid ${c.red}`,
              borderRadius: 6,
              padding: "10px 12px",
              marginBottom: 12,
              background: "rgba(229,72,77,0.07)",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: c.red, marginBottom: 8 }}>
              활성본 v{active.version} 이 구버전이에요 — 둘 중 하나로 해결하세요
            </div>
            <div style={{ fontSize: 11, color: c.textMuted, marginBottom: 4 }}>
              ① 업데이트(권장)
            </div>
            <CmdRow
              cmd="claude update"
              copied={copied === "active-update"}
              onCopy={() => void copy("claude update", "active-update")}
            />
            <div style={{ fontSize: 11, color: c.textMuted, margin: "8px 0 4px" }}>
              ② 또는 이 구버전을 정리(최신본이 잡히게)
            </div>
            <CmdRow
              cmd={removalCmd(active)}
              copied={copied === active.path}
              onCopy={() => void copy(removalCmd(active), active.path)}
            />
          </div>
        )}

        {/* 중복본 정리 — 활성/동봉 제외 후보별 */}
        {cleanupTargets.length > 0 && (
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 11.5, color: c.textMuted, marginBottom: 6 }}>
              정리할 중복 claude (활성본·동봉본 제외):
            </div>
            {cleanupTargets.map((i) => (
              <CmdRow
                key={i.path}
                cmd={removalCmd(i)}
                copied={copied === i.path}
                onCopy={() => void copy(removalCmd(i), i.path)}
              />
            ))}
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

function CmdRow({
  cmd,
  copied,
  onCopy,
}: {
  cmd: string;
  copied: boolean;
  onCopy: () => void;
}): React.JSX.Element {
  return (
    <div
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
        onClick={onCopy}
      >
        {copied ? "복사됨" : "복사"}
      </button>
    </div>
  );
}

function Badge({
  active,
  bundled,
  outdated,
}: {
  active: boolean;
  bundled: boolean;
  outdated?: boolean;
}): React.JSX.Element {
  const label = active
    ? outdated
      ? "활성 · 구버전"
      : "활성 (앱이 띄움)"
    : bundled
      ? "앱 동봉"
      : "정리 권장";
  const color = active ? (outdated ? c.red : c.accent) : bundled ? c.textMuted : c.red;
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
