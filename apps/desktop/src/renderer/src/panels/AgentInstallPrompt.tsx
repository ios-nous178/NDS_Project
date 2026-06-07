import { useCallback, useEffect, useState } from "react";
import type { AgentCheck, AgentType } from "../../../preload/index.js";
import { c, font, ghostBtn, mono, primaryBtn, primaryBtnDisabled } from "../ui/theme.js";

/**
 * 에이전트 CLI(주로 claude) 미설치 시 뜨는 설치 안내 모달.
 *
 * - npm 이 있으면 원클릭 `npm install -g` → 설치 중 스피너 → 끝나면 자동 재확인 → onReady().
 *   agentSearchPath 가 설치 위치를 하드코딩하므로 "새 터미널" 없이 바로 잡힌다.
 * - npm(Node.js) 이 없으면 Node.js 먼저 안내 + 명령 복사 + [다시 확인].
 * - 실패 시에만 raw 로그(output)를 펼쳐 보여준다.
 */
const CLAUDE_DOCS = "https://docs.claude.com/claude-code";
const NODE_DOCS = "https://nodejs.org/";

function nodeInstallCmd(platform: string): string {
  if (platform === "win32") return "winget install OpenJS.NodeJS.LTS";
  if (platform === "darwin") return "brew install node";
  return "https://nodejs.org 에서 LTS 설치";
}

export function AgentInstallPrompt({
  agentType,
  installHint,
  onClose,
  onReady,
}: {
  agentType: AgentType;
  installHint?: string;
  onClose: () => void;
  onReady: () => void;
}): React.JSX.Element {
  const platform = window.harness.platform;
  const [check, setCheck] = useState<AgentCheck | null>(null);
  const [phase, setPhase] = useState<"idle" | "installing" | "error">("idle");
  const [log, setLog] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const label = agentType === "claude" ? "Claude Code" : agentType;
  const nodeCmd = nodeInstallCmd(platform);

  const recheck = useCallback(async () => {
    const r = await window.harness.checkAgent(agentType);
    setCheck(r);
    if (r.found) onReady();
  }, [agentType, onReady]);

  useEffect(() => {
    void recheck();
  }, [recheck]);

  const install = useCallback(async () => {
    setPhase("installing");
    setLog("");
    const r = await window.harness.installAgent(agentType);
    if (r.ok) {
      onReady();
      return;
    }
    setLog(r.output || "설치에 실패했습니다.");
    setPhase("error");
    // 혹시 설치는 됐는데 ok 판정만 빗나간 경우를 대비해 상태 갱신.
    void window.harness.checkAgent(agentType).then(setCheck);
  }, [agentType, onReady]);

  const copy = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((k) => (k === key ? null : k)), 1500);
    } catch {
      /* clipboard 거부 시 무시 — 사용자가 직접 선택 복사 */
    }
  }, []);

  const installing = phase === "installing";
  const canAutoInstall = check?.canAutoInstall ?? false;
  const npmMissing = check != null && !check.npmFound;

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
      onClick={installing ? undefined : onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 460,
          maxWidth: "90vw",
          background: c.bgPanel,
          border: `1px solid ${c.border}`,
          borderRadius: 10,
          padding: 24,
          color: c.text,
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{label} 가 필요해요</div>
        <div style={{ fontSize: 12.5, color: c.textMuted, lineHeight: 1.6, marginBottom: 18 }}>
          {npmMissing
            ? "자동 설치에는 Node.js 가 필요합니다. 먼저 Node.js 를 설치한 뒤 다시 확인을 눌러 주세요."
            : "버튼 한 번이면 자동으로 설치됩니다. 설치 후 첫 실행에서 로그인만 한 번 해주면 끝이에요."}
        </div>

        {/* Node.js 미설치 분기 — 명령 안내 + 다시 확인 */}
        {npmMissing && (
          <div style={{ marginBottom: 16 }}>
            <CmdRow
              cmd={nodeCmd}
              copyable={platform !== "linux"}
              copied={copied === "node"}
              onCopy={() => copy(nodeCmd, "node")}
            />
            <button
              style={{ ...ghostBtn, marginTop: 8, fontSize: 12 }}
              onClick={() => window.harness.openExternal(NODE_DOCS)}
            >
              nodejs.org 열기 ↗
            </button>
          </div>
        )}

        {/* 설치 실패 로그 — 실패 시에만 노출 */}
        {phase === "error" && log && (
          <pre
            style={{
              fontFamily: mono,
              fontSize: 11,
              lineHeight: 1.5,
              color: c.red,
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: 6,
              padding: 10,
              margin: "0 0 14px",
              maxHeight: 200,
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {log}
          </pre>
        )}

        {/* 수동 설치 명령 — 항상 fallback 제공 */}
        {!npmMissing && (
          <CmdRow
            cmd="npm install -g @anthropic-ai/claude-code"
            copyable
            copied={copied === "claude"}
            onCopy={() => copy("npm install -g @anthropic-ai/claude-code", "claude")}
          />
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 18,
          }}
        >
          <button
            style={{ ...ghostBtn, fontSize: 12 }}
            onClick={() => window.harness.openExternal(CLAUDE_DOCS)}
          >
            설치 가이드 ↗
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={ghostBtn} onClick={onClose} disabled={installing}>
              닫기
            </button>
            {npmMissing ? (
              <button style={primaryBtn} onClick={() => void recheck()}>
                다시 확인
              </button>
            ) : (
              <button
                style={canAutoInstall && !installing ? primaryBtn : primaryBtnDisabled}
                onClick={() => void install()}
                disabled={!canAutoInstall || installing}
              >
                {installing ? "설치 중…" : phase === "error" ? "다시 시도" : `${label} 설치`}
              </button>
            )}
          </div>
        </div>

        {installing && (
          <div
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: c.textMuted,
            }}
          >
            <Spinner />
            설치 중입니다. 잠시만 기다려 주세요…
          </div>
        )}

        {installHint && phase === "idle" && !npmMissing && check == null && (
          <div style={{ marginTop: 12, fontSize: 11, color: c.textFaint }}>{installHint}</div>
        )}
      </div>
    </div>
  );
}

function CmdRow({
  cmd,
  copyable,
  copied,
  onCopy,
}: {
  cmd: string;
  copyable: boolean;
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
      {copyable && (
        <button
          style={{ ...ghostBtn, fontSize: 11, padding: "2px 8px", flexShrink: 0 }}
          onClick={onCopy}
        >
          {copied ? "복사됨" : "복사"}
        </button>
      )}
    </div>
  );
}

function Spinner(): React.JSX.Element {
  return (
    <span
      style={{
        width: 13,
        height: 13,
        border: `2px solid ${c.border}`,
        borderTopColor: c.accent,
        borderRadius: "50%",
        display: "inline-block",
        animation: "nds-spin 0.7s linear infinite",
      }}
    >
      <style>{"@keyframes nds-spin { to { transform: rotate(360deg); } }"}</style>
    </span>
  );
}
