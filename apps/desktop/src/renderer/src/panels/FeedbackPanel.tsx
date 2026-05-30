import { useCallback, useEffect, useState } from "react";
import type { FeedbackKind } from "@nudge-design/mockup-core";

/**
 * 현재 선택된 목업에 대한 유저 피드백 수집(Phase 3).
 *
 * ① 수정요청: "이 목업에 수정요청이 있나요?" 예/아니요 토글 → 예면 내용 + [보고] (revision-request)
 * ② 기타 피드백: 별도 자유 입력 + [보내기] (feedback)
 *
 * 저장은 로컬 `.ds-feedback-log.jsonl` 만(webhook OFF). 제출 후 확인 메시지 + 입력 초기화.
 * 과거 피드백 인라인 목록은 후속.
 */
export function FeedbackPanel({
  projectPath,
  screen,
}: {
  projectPath: string | null;
  /** 현재 선택된 목업 rel 경로(screen = mockupFile). 미선택이면 null → 비활성. */
  screen: string | null;
}): React.JSX.Element {
  const [hasRevision, setHasRevision] = useState<boolean | null>(null);
  const [revisionText, setRevisionText] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [busy, setBusy] = useState<FeedbackKind | null>(null);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  // 목업이 바뀌면 입력/상태 초기화.
  useEffect(() => {
    setHasRevision(null);
    setRevisionText("");
    setFeedbackText("");
    setToast(null);
  }, [screen]);

  const submit = useCallback(
    async (kind: FeedbackKind, comment: string) => {
      if (!projectPath || !screen) return;
      setBusy(kind);
      setToast(null);
      try {
        const res = await window.harness.submitFeedback({
          projectPath,
          kind,
          screen,
          comment,
          mockupFile: screen,
        });
        if (res.ok) {
          setToast({
            ok: true,
            msg: kind === "revision-request" ? "수정요청 보고됨" : "피드백 전송됨",
          });
          if (kind === "revision-request") {
            setRevisionText("");
            setHasRevision(null);
          } else {
            setFeedbackText("");
          }
        } else {
          setToast({ ok: false, msg: res.error ?? "저장 실패" });
        }
      } catch (e) {
        setToast({ ok: false, msg: (e as Error).message });
      } finally {
        setBusy(null);
      }
    },
    [projectPath, screen],
  );

  if (!projectPath || !screen)
    return (
      <div style={{ color: "#999", fontSize: 13 }}>목업을 선택하면 피드백을 남길 수 있습니다.</div>
    );

  return (
    <div style={{ fontSize: 13 }}>
      {/* ① 수정요청 */}
      <div style={{ fontWeight: 600, color: "#344054", marginBottom: 6 }}>
        이 목업에 수정요청이 있나요?
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: hasRevision ? 8 : 0 }}>
        <button
          onClick={() => setHasRevision(true)}
          style={hasRevision === true ? toggleOn : toggleOff}
        >
          예
        </button>
        <button
          onClick={() => {
            setHasRevision(false);
            setRevisionText("");
          }}
          style={hasRevision === false ? toggleOn : toggleOff}
        >
          아니요
        </button>
      </div>

      {hasRevision === true && (
        <div>
          <textarea
            value={revisionText}
            onChange={(e) => setRevisionText(e.target.value)}
            placeholder="어디를 어떻게 고쳐야 하나요?"
            rows={3}
            style={textareaStyle}
          />
          <button
            onClick={() => submit("revision-request", revisionText)}
            disabled={!revisionText.trim() || busy != null}
            style={
              busy === "revision-request" || !revisionText.trim() ? primaryBtnDisabled : primaryBtn
            }
          >
            {busy === "revision-request" ? "보고 중…" : "수정요청 보고"}
          </button>
        </div>
      )}

      {/* ② 기타 피드백 */}
      <div
        style={{
          fontWeight: 600,
          color: "#344054",
          margin: "16px 0 6px",
          borderTop: "1px solid #eaecf0",
          paddingTop: 12,
        }}
      >
        기타 피드백
      </div>
      <textarea
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
        placeholder="좋았던 점, 제안 등 자유롭게 남겨주세요."
        rows={3}
        style={textareaStyle}
      />
      <button
        onClick={() => submit("feedback", feedbackText)}
        disabled={!feedbackText.trim() || busy != null}
        style={busy === "feedback" || !feedbackText.trim() ? primaryBtnDisabled : primaryBtn}
      >
        {busy === "feedback" ? "전송 중…" : "피드백 보내기"}
      </button>

      {toast && (
        <div style={{ ...toastBox, color: toast.ok ? "#067647" : "#d92d20" }}>
          {toast.ok ? "✓ " : "✗ "}
          {toast.msg}
        </div>
      )}
      <div style={{ color: "#98a2b3", fontSize: 11, marginTop: 8 }}>
        로컬 <code>.ds-feedback-log.jsonl</code> 에 저장됩니다(외부 전송 없음).
      </div>
    </div>
  );
}

const toggleBase: React.CSSProperties = {
  padding: "5px 16px",
  borderRadius: 6,
  border: "1px solid #d0d5dd",
  cursor: "pointer",
  fontSize: 13,
};
const toggleOff: React.CSSProperties = { ...toggleBase, background: "#fff", color: "#344054" };
const toggleOn: React.CSSProperties = {
  ...toggleBase,
  background: "#175cd3",
  borderColor: "#175cd3",
  color: "#fff",
};
const textareaStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #d0d5dd",
  fontSize: 13,
  fontFamily: "inherit",
  resize: "vertical",
  marginBottom: 6,
};
const primaryBtn: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "none",
  background: "#175cd3",
  color: "#fff",
  cursor: "pointer",
  fontSize: 13,
};
const primaryBtnDisabled: React.CSSProperties = {
  ...primaryBtn,
  background: "#d0d5dd",
  cursor: "not-allowed",
};
const toastBox: React.CSSProperties = {
  marginTop: 8,
  padding: "6px 10px",
  borderRadius: 6,
  background: "#f9fafb",
  border: "1px solid #eaecf0",
  fontSize: 12,
  fontWeight: 600,
};
