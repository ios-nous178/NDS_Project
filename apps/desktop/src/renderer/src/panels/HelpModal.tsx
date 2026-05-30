import { useCallback, useState } from "react";
import type { UpdateCheckResult } from "../../../preload/index.js";
import { Logo } from "../ui/Logo.js";
import {
  btnReset,
  c,
  font,
  ghostBtn,
  mono,
  primaryBtn,
  primaryBtnDisabled,
  segGroup,
  segItem,
  segItemActive,
} from "../ui/theme.js";

/**
 * 헬프 센터(상단 ? 버튼) — 사용 가이드 · 문의/피드백 · 정보/링크 · 변경사항.
 *
 * 문의/피드백은 기존 피드백과 같은 경로(로컬 `.ds-feedback-log.jsonl`)로 적재한다(webhook OFF).
 * 종류는 코멘트 앞에 [문의]/[버그]/[제안] 태그로 구분 — FeedbackKind 는 그대로 "feedback".
 */

type HelpTab = "guide" | "contact" | "info" | "changelog";

const REPO_URL = "https://github.com/cashwalk/NudgeEAPDesignSystem";

const LINKS: { label: string; url: string; note: string; glyph: string }[] = [
  {
    label: "Storybook",
    url: "http://localhost:6006",
    note: "컴포넌트 데모 · 로컬 dev 서버",
    glyph: "S",
  },
  { label: "GitHub 저장소", url: REPO_URL, note: "소스 · 이슈 · 릴리즈", glyph: "G" },
  { label: "이슈 등록", url: `${REPO_URL}/issues/new`, note: "버그 · 기능 제안", glyph: "+" },
];

const GUIDE_STEPS: { title: string; body: string }[] = [
  {
    title: "1. 프로젝트 열기",
    body: "상단 '프로젝트 열기'로 목업이 담길 폴더를 고릅니다. <nds-*> 를 쓰는 HTML 이 자동으로 목록에 잡힙니다.",
  },
  {
    title: "2. 새 목업 시작",
    body: "'+ 새 목업'에서 브랜드·화면 종류·기획서·레퍼런스를 고정하면 에이전트가 DS 규칙대로 생성합니다.",
  },
  {
    title: "3. 미리보기 · 검증",
    body: "우측 탭에서 생성 결과를 실시간 미리보기(웹/앱)로 확인하고, '검증'에서 DS 규칙 위반을 점검합니다.",
  },
  {
    title: "4. 피드백 · 소스",
    body: "'피드백' 탭에 수정요청을 남기면 로컬 로그에 쌓입니다. '소스'에서 원본 HTML 을 그대로 볼 수 있습니다.",
  },
  {
    title: "5. 공유본 내보내기",
    body: "상단 '내보내기'로 이미지·자산이 한 파일에 박힌 자체완결 HTML 을 만듭니다 — 원본은 건드리지 않습니다.",
  },
];

const CHANGES: { version: string; items: string[] }[] = [
  {
    version: "데스크탑 패키징",
    items: [
      "Windows 지원 + macOS universal 빌드",
      "릴리즈 워크플로우 자동화",
      "헬프 센터(?) 추가",
      "새 버전 알림 — 헤더 배너 · 헬프센터에서 바로 다운로드",
    ],
  },
  {
    version: "실시간 미리보기",
    items: [
      "생성 중인 목업 자동 추적",
      "3분할 패널 너비 드래그 조절",
      "공유본(자체완결 HTML) 내보내기",
    ],
  },
  {
    version: "인테이크 · 채팅",
    items: [
      "목업 인테이크 폼(브랜드·기획서·레퍼런스 고정)",
      "Claude/Codex 인앱 에이전트",
      "채팅 기록 보기·제목 편집",
    ],
  },
];

type ContactKind = "문의" | "버그" | "제안";

export function HelpModal({
  projectPath,
  selectedMockup,
  appVersion,
  platform,
  update,
  onClose,
}: {
  projectPath: string | null;
  selectedMockup: string | null;
  appVersion: string;
  platform: string;
  update: UpdateCheckResult | null;
  onClose: () => void;
}): React.JSX.Element {
  const [tab, setTab] = useState<HelpTab>("guide");
  const [kind, setKind] = useState<ContactKind>("문의");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  const submit = useCallback(async () => {
    const comment = text.trim();
    if (!comment || !projectPath) return;
    setBusy(true);
    setToast(null);
    try {
      const res = await window.harness.submitFeedback({
        projectPath,
        kind: "feedback",
        screen: `[${kind}] 헬프센터`,
        comment: `[${kind}] ${comment}`,
        mockupFile: selectedMockup ?? "",
      });
      if (res.ok) {
        setToast({ ok: true, msg: `${kind} 접수됨 — 로컬 로그에 저장` });
        setText("");
      } else {
        setToast({ ok: false, msg: res.error ?? "저장 실패" });
      }
    } catch (e) {
      setToast({ ok: false, msg: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }, [text, projectPath, kind, selectedMockup]);

  const open = useCallback((url: string) => void window.harness.openExternal(url), []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          // 탭을 바꿔도 모달이 출렁이지 않도록 크기 고정(내용은 본문 영역에서만 스크롤).
          width: 560,
          height: 480,
          maxWidth: "92vw",
          maxHeight: "86vh",
          display: "flex",
          flexDirection: "column",
          background: c.bgPanel,
          border: `1px solid ${c.border}`,
          borderRadius: 8,
          fontFamily: font,
          color: c.text,
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 20px 0",
          }}
        >
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: 15 }}>도움말 · 문의</strong>
            <div style={{ color: c.textMuted, fontSize: 11, marginTop: 3 }}>
              사용 방법, 문의/피드백, 변경사항을 한곳에서 봅니다.
            </div>
          </div>
          <button onClick={onClose} style={{ ...ghostBtn, padding: "4px 10px" }} title="닫기">
            ✕
          </button>
        </div>

        {/* 탭 */}
        <div style={{ padding: "12px 20px 0", display: "flex" }}>
          <div style={segGroupInline}>
            {(
              [
                ["guide", "사용 가이드"],
                ["contact", "문의·피드백"],
                ["info", "정보·링크"],
                ["changelog", "변경사항"],
              ] as [HelpTab, string][]
            ).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)} style={tab === t ? segItemActive : segItem}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 본문 — 고정 높이 모달 안에서 이 영역만 스크롤. */}
        <div style={{ flex: 1, minHeight: 0, padding: 20, overflow: "auto" }}>
          {tab === "guide" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {GUIDE_STEPS.map((s) => (
                <div key={s.title}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 3 }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: c.textMuted, lineHeight: 1.55 }}>
                    {s.body}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "contact" && (
            <div>
              <div style={{ ...segGroupInline, marginBottom: 12 }}>
                {(["문의", "버그", "제안"] as ContactKind[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setKind(k)}
                    style={kind === k ? segItemActive : segItem}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  kind === "버그"
                    ? "무엇을 하다가, 무엇이 잘못됐나요? 재현 순서가 있으면 함께 적어주세요."
                    : kind === "제안"
                      ? "어떤 기능/개선이 있으면 좋을까요?"
                      : "궁금한 점이나 막힌 부분을 자유롭게 적어주세요."
                }
                rows={6}
                style={textareaStyle}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                <button
                  onClick={() => void submit()}
                  disabled={!text.trim() || !projectPath || busy}
                  style={!text.trim() || !projectPath || busy ? primaryBtnDisabled : primaryBtn}
                >
                  {busy ? "보내는 중…" : "보내기"}
                </button>
                {!projectPath && (
                  <span style={{ fontSize: 11, color: c.yellow }}>
                    프로젝트를 열어야 저장됩니다.
                  </span>
                )}
              </div>
              {toast && (
                <div style={{ ...toastBox, color: toast.ok ? c.green : c.red }}>
                  {toast.ok ? "✓ " : "✗ "}
                  {toast.msg}
                </div>
              )}
              <div style={{ color: c.textFaint, fontSize: 11, marginTop: 10, lineHeight: 1.5 }}>
                로컬 <code>.ds-feedback-log.jsonl</code> 에 저장됩니다(외부 전송 없음). 빠른 답이
                필요하면{" "}
                <button onClick={() => open(`${REPO_URL}/issues/new`)} style={linkBtn}>
                  GitHub 이슈
                </button>
                로 남겨주세요.
              </div>
            </div>
          )}

          {tab === "info" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* 버전 카드 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  padding: 14,
                  borderRadius: 10,
                  border: `1px solid ${c.border}`,
                  background: c.bg,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <Logo size={32} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: c.text }}>Nudge Studio</div>
                    <div style={{ fontSize: 11, color: c.textMuted, marginTop: 2 }}>
                      Design System Powered Mockup Builder
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 4,
                    }}
                  >
                    <span style={versionChip}>v{appVersion || "?"}</span>
                    <span style={{ fontSize: 10, color: c.textFaint, fontFamily: mono }}>
                      {platform}
                    </span>
                  </div>
                </div>
                <UpdateRow update={update} onOpen={open} />
              </div>

              {/* 링크 */}
              <div>
                <div style={kvLabel}>바로가기</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {LINKS.map((l) => (
                    <LinkRow key={l.url} {...l} onOpen={open} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "changelog" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {CHANGES.map((c2) => (
                <div key={c2.version}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 5 }}>
                    {c2.version}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, color: c.textMuted, fontSize: 12.5 }}>
                    {c2.items.map((it) => (
                      <li key={it} style={{ marginBottom: 3, lineHeight: 1.5 }}>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div style={{ color: c.textFaint, fontSize: 11 }}>
                전체 변경 이력은{" "}
                <button onClick={() => open(`${REPO_URL}/commits`)} style={linkBtn}>
                  GitHub 커밋
                </button>
                에서 볼 수 있습니다.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 버전 카드 하단 업데이트 상태 줄 — 조회 중 / 최신 / 새 버전 / 실패 를 한 줄로 표현.
 * 새 버전이면 "다운로드" 버튼이 Release 페이지를 기본 브라우저로 연다(자동설치 없음).
 */
function UpdateRow({
  update,
  onOpen,
}: {
  update: UpdateCheckResult | null;
  onOpen: (url: string) => void;
}): React.JSX.Element {
  const top = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingTop: 12,
    borderTop: `1px solid ${c.border}`,
    fontSize: 12,
  } as const;

  if (!update) {
    return (
      <div style={{ ...top, color: c.textFaint }}>
        <span>업데이트 확인 중…</span>
      </div>
    );
  }
  if (update.hasUpdate && update.latestVersion && update.releaseUrl) {
    const url = update.releaseUrl;
    return (
      <div style={top}>
        <span style={{ color: c.accent, fontWeight: 600 }}>
          새 버전 v{update.latestVersion} 사용 가능
        </span>
        <span style={{ color: c.textFaint }}>(현재 v{update.currentVersion})</span>
        <button
          onClick={() => onOpen(url)}
          style={{ ...primaryBtn, marginLeft: "auto", fontSize: 11.5, padding: "4px 12px" }}
        >
          다운로드 ↗
        </button>
      </div>
    );
  }
  if (update.error) {
    return (
      <div style={{ ...top, color: c.textFaint }}>
        <span>업데이트 확인 실패 — 네트워크를 확인하세요.</span>
      </div>
    );
  }
  return (
    <div style={{ ...top, color: c.textMuted }}>
      <span style={{ color: c.green }}>✓</span>
      <span>최신 버전입니다.</span>
    </div>
  );
}

/** 정보 탭의 링크 한 줄 — 전체폭 클릭 카드 + hover 강조 + 우측 ↗. */
function LinkRow({
  label,
  note,
  url,
  glyph,
  onOpen,
}: {
  label: string;
  note: string;
  url: string;
  glyph: string;
  onOpen: (url: string) => void;
}): React.JSX.Element {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={() => onOpen(url)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={url}
      style={{
        ...btnReset,
        display: "flex",
        alignItems: "center",
        gap: 11,
        width: "100%",
        textAlign: "left",
        padding: "10px 12px",
        borderRadius: 8,
        cursor: "pointer",
        background: hover ? c.bgHover : c.bg,
        border: `1px solid ${hover ? c.accent : c.border}`,
        transition: "background 0.12s, border-color 0.12s",
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: 26,
          height: 26,
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 700,
          fontFamily: mono,
          color: c.accent,
          background: c.accentBg,
        }}
      >
        {glyph}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: c.text }}>
          {label}
        </span>
        <span style={{ display: "block", fontSize: 11, color: c.textFaint, marginTop: 1 }}>
          {note}
        </span>
      </span>
      <span style={{ flexShrink: 0, fontSize: 13, color: hover ? c.accent : c.textFaint }}>↗</span>
    </button>
  );
}

const segGroupInline: React.CSSProperties = { ...segGroup, alignSelf: "flex-start" };
const versionChip: React.CSSProperties = {
  fontSize: 11,
  fontFamily: mono,
  color: c.accent,
  padding: "2px 8px",
  borderRadius: 999,
  background: c.accentBg,
  border: `1px solid ${c.accent}`,
};
const kvLabel: React.CSSProperties = {
  fontSize: 11,
  color: c.textMuted,
  fontWeight: 600,
  marginBottom: 5,
};
const textareaStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "8px 10px",
  borderRadius: 6,
  border: `1px solid ${c.border}`,
  background: c.bg,
  color: c.text,
  fontSize: 13,
  fontFamily: "inherit",
  resize: "vertical",
};
const linkBtn: React.CSSProperties = {
  ...btnReset,
  background: "transparent",
  border: "none",
  padding: 0,
  color: c.accent,
  cursor: "pointer",
  fontSize: "inherit",
  textDecoration: "underline",
};
const toastBox: React.CSSProperties = {
  marginTop: 10,
  padding: "6px 10px",
  borderRadius: 6,
  background: c.bgElevated,
  border: `1px solid ${c.border}`,
  fontSize: 12,
  fontWeight: 600,
};
