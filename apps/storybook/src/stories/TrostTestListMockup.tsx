/**
 * [TROST-TEST-LIST] 트로스트 심리검사 목록 페이지 목업
 *
 * Mockup Renderer 산출물 — ephemeral
 * DS 컴포넌트: Button, Badge, Card, Chip
 * Missing (임시 구현): Accordion, StickyBottomBar
 *
 * 🎨 Trost 브랜드 테마 적용 (trostSemantic, trostTheme)
 */
import React, { useState } from "react";
import { Button, Chip } from "@nudge-eap/react";
import {
  trostSemantic,
  trostTheme,
  trostNeutral,
  trostCobalt,
  trostPink,
  trostYellow,
} from "@nudge-eap/tokens";
import {
  tests,
  faqs,
  relatedTags,
  emotionRoutes,
  infoHubText,
  selectionGuideText,
  type PsychTest,
} from "./trost-test-list-mock-data";

/* ────────────────────────────────────────────
 * Trost 테마 상수
 * ──────────────────────────────────────────── */
const font = trostTheme.typography!.fontFamily!.web;
const shadow = trostTheme.elevation!.shadow!;
const rd = trostTheme.spacing!.radius!;

/* ────────────────────────────────────────────
 * Missing DS 컴포넌트 — 임시 구현
 * DS 트랙에서 Accordion, StickyBottomBar 개발 후 교체 예정
 * ──────────────────────────────────────────── */

/** [Missing] Accordion — DS에 없으므로 Trost 토큰 기반 임시 구현 */
function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            border: `1px solid ${trostSemantic.border.light}`,
            borderRadius: rd.lg,
            overflow: "hidden",
            background: trostSemantic.bg.white,
          }}
        >
          <button
            style={{
              width: "100%",
              textAlign: "left",
              padding: "16px 20px",
              fontFamily: font,
              fontWeight: 600,
              fontSize: 15,
              lineHeight: "22px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: trostSemantic.text.default,
            }}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span>{item.question}</span>
            <span
              style={{
                color: trostSemantic.text.disabled,
                fontSize: 20,
                transition: "transform 0.2s",
                transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
              }}
            >
              +
            </span>
          </button>
          {openIndex === i && (
            <div
              style={{
                padding: "0 20px 16px",
                color: trostSemantic.text.subtle,
                fontFamily: font,
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/** [Missing] StickyBottomBar — DS에 없으므로 Trost 토큰 기반 임시 구현 */
function StickyBottomBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: trostSemantic.bg.white,
        borderTop: `1px solid ${trostSemantic.border.light}`,
        padding: "12px 16px",
        zIndex: trostTheme.elevation!.zIndex!.bottomFixedInput,
        boxShadow: shadow.up,
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

/* ────────────────────────────────────────────
 * 유형별 커스텀 색상 (Trost 팔레트)
 * ──────────────────────────────────────────── */
const typeColors: Record<PsychTest["typeKeyword"], { bg: string; text: string }> = {
  증상형: { bg: trostPink[100], text: trostPink[500] },
  "자기 이해형": { bg: trostCobalt[100], text: trostCobalt[500] },
  상황형: { bg: trostSemantic.caution.bg, text: trostSemantic.caution.main },
  종합형: { bg: trostYellow.light, text: "#8B7A00" },
};

/* ────────────────────────────────────────────
 * 참여인원 포맷터
 * ──────────────────────────────────────────── */
function formatParticipants(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만명`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천명`;
  return `${n}명`;
}

/* ════════════════════════════════════════════
 * 메인 목업 컴포넌트
 * ════════════════════════════════════════════ */
export default function TrostTestListMockup() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: trostSemantic.bg.white,
        fontFamily: font,
        paddingBottom: 80,
      }}
    >
      {/* ── 섹션 1: Hero ── */}
      <section
        style={{
          background: `linear-gradient(170deg, ${trostYellow.light} 0%, ${trostSemantic.bg.white} 60%)`,
          padding: "56px 20px 48px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: trostSemantic.text.default,
              lineHeight: 1.3,
              marginBottom: 12,
            }}
          >
            무료 심리검사 종류
            <br />
            &amp; 자가진단
          </h1>
          <p
            style={{
              color: trostSemantic.text.subtle,
              fontSize: 15,
              lineHeight: 1.6,
              marginBottom: 28,
            }}
          >
            우울증, 스트레스, 자존감, 성격 유형까지 —
            <br />
            3분이면 내 마음 상태를 확인할 수 있습니다.
          </p>
          <Button
            variant="solid"
            size="lg"
            onClick={() =>
              document.getElementById("test-list")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            3분만에 내 상태 확인하기
          </Button>

          {/* 감정별 빠른 진입 */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 10,
              marginTop: 28,
            }}
          >
            {[
              { label: "우울", url: "/test/depression-type" },
              { label: "스트레스", url: "/test/job-stress" },
              { label: "자존감", url: "/test/self-esteem" },
              { label: "종합검사", url: "/test/comprehensive" },
            ].map((btn) => (
              <Button
                key={btn.label}
                variant="outlined"
                size="sm"
                onClick={() => console.log(`navigate: ${btn.url}`)}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 섹션 2: 정보형 허브 블록 ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "48px 20px" }}>
        <div
          style={{
            background: trostSemantic.bg.coolGray,
            borderRadius: rd.lg,
            padding: "28px 24px",
          }}
        >
          <div
            style={{
              color: trostSemantic.text.subtle,
              fontSize: 14,
              lineHeight: 1.85,
              whiteSpace: "pre-line",
            }}
          >
            {infoHubText}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 20,
            }}
          >
            {(["증상형", "자기 이해형", "상황형", "종합형"] as const).map((type) => (
              <span
                key={type}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 12px",
                  borderRadius: rd.pill,
                  background: typeColors[type].bg,
                  color: typeColors[type].text,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 섹션 3: 심리검사 목록 ── */}
      <section id="test-list" style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 48px" }}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: trostSemantic.text.default,
            marginBottom: 8,
          }}
        >
          무료로 할 수 있는 온라인 심리검사
        </h2>
        <p
          style={{
            fontSize: 14,
            color: trostSemantic.text.subtle,
            marginBottom: 24,
          }}
        >
          최근 7일 참여 인기순으로 정렬됩니다.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
          }}
        >
          {tests.map((test) => (
            <div
              key={test.id}
              onClick={() => console.log(`navigate: ${test.url}`)}
              style={{
                border: `1px solid ${trostSemantic.border.light}`,
                borderRadius: rd.lg,
                padding: "20px",
                cursor: "pointer",
                background: trostSemantic.bg.white,
                transition: "box-shadow 0.2s, transform 0.2s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = shadow.sm;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* 상단: 순위 + 유형 배지 */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: trostCobalt[500],
                  }}
                >
                  {test.rank}위
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    padding: "3px 10px",
                    borderRadius: rd.pill,
                    background: typeColors[test.typeKeyword].bg,
                    color: typeColors[test.typeKeyword].text,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {test.typeKeyword}
                </span>
              </div>
              {/* 검사명 */}
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: trostSemantic.text.default,
                  marginBottom: 6,
                }}
              >
                {test.name}
              </div>
              {/* 설명 */}
              <div
                style={{
                  fontSize: 13,
                  color: trostSemantic.text.subtle,
                  lineHeight: 1.6,
                  marginBottom: 16,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {test.description}
              </div>
              {/* 하단 메타 */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  fontSize: 12,
                  color: trostSemantic.text.disabled,
                }}
              >
                <span>{formatParticipants(test.participants)} 참여</span>
                <span>·</span>
                <span>{test.duration}</span>
                <span>·</span>
                <span>{test.questions}문항</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 섹션 4: 감정/상황별 추천 ── */}
      <section
        style={{
          background: trostSemantic.bg.coolGray,
          padding: "48px 20px",
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: trostSemantic.text.default,
              marginBottom: 24,
            }}
          >
            지금 내 감정/상황에 맞는 심리검사 추천
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
            }}
          >
            {emotionRoutes.map((route) => (
              <div
                key={route.label}
                onClick={() => console.log(`navigate: ${route.url}`)}
                style={{
                  background: trostSemantic.bg.white,
                  borderRadius: rd.lg,
                  padding: "24px 16px",
                  textAlign: "center",
                  cursor: "pointer",
                  boxShadow: shadow.sm,
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 10 }}>{route.emoji}</div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: trostSemantic.text.default,
                  }}
                >
                  {route.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: trostSemantic.text.subtle,
                    marginTop: 6,
                    lineHeight: 1.4,
                  }}
                >
                  {route.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 섹션 5: 심리검사 선택 가이드 ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "48px 20px" }}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: trostSemantic.text.default,
            marginBottom: 24,
          }}
        >
          심리검사 선택 가이드
        </h2>
        <div
          style={{
            color: trostSemantic.text.subtle,
            fontSize: 14,
            lineHeight: 1.85,
            whiteSpace: "pre-line",
            marginBottom: 28,
          }}
        >
          {selectionGuideText}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            {
              emoji: "🔍",
              title: "증상 기준으로 찾기",
              desc: "우울, 공황 등 증상별 검사 보기",
            },
            {
              emoji: "📋",
              title: "상황 기준으로 찾기",
              desc: "직장, 취업 등 상황별 검사 보기",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                border: `1px solid ${trostSemantic.border.light}`,
                borderRadius: rd.lg,
                padding: "24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 16,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = trostSemantic.bg.coolGray;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = trostSemantic.bg.white;
              }}
            >
              <span style={{ fontSize: 28 }}>{item.emoji}</span>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    color: trostSemantic.text.default,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: trostSemantic.text.subtle,
                    marginTop: 4,
                  }}
                >
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 섹션 6: 트로스트가 다른 이유 ── */}
      <section
        style={{
          background: trostNeutral[1000],
          padding: "56px 20px",
          color: trostSemantic.text.inverse,
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 32,
              color: trostSemantic.text.inverse,
            }}
          >
            무료 온라인 심리 검사,
            <br />
            <span style={{ color: trostYellow.primary }}>트로스트</span>가 다른 이유
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              {
                icon: "🧪",
                title: "전문 심리검사 도구 기반",
                desc: "PHQ-9, 로젠버그 자존감 척도 등 검증된 도구를 사용합니다.",
              },
              {
                icon: "📊",
                title: "맞춤 결과 해석 제공",
                desc: "단순 점수가 아닌, 상태별 맞춤 해석과 조언을 제공합니다.",
              },
              {
                icon: "👩‍⚕️",
                title: "전문 상담사 연계",
                desc: "검사 결과에 따라 전문 상담사와 바로 연결할 수 있습니다.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: rd.lg,
                  padding: "28px 20px",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    marginBottom: 8,
                    color: trostSemantic.text.inverse,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: trostNeutral[400],
                  }}
                >
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 섹션 7: FAQ ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "48px 20px" }}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: trostSemantic.text.default,
            marginBottom: 24,
          }}
        >
          무료 심리 검사 FAQ
        </h2>
        {/* [Missing] Accordion — DS 트랙에서 개발 후 교체 */}
        <Accordion items={faqs} />
      </section>

      {/* ── 섹션 8: 관련 검색 태그 ── */}
      <section
        style={{
          background: trostSemantic.bg.coolGray,
          padding: "48px 20px",
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: trostSemantic.text.default,
              marginBottom: 24,
            }}
          >
            이런 검사도 찾고 있으신가요?
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {relatedTags.map((tag) => (
              <Chip
                key={tag.label}
                variant="outlined"
                size="md"
                shape="pill"
                onClick={() => console.log(`navigate: ${tag.linkedTestUrl}`)}
              >
                {tag.label}
              </Chip>
            ))}
          </div>
        </div>
      </section>

      {/* ── 섹션 9: 다음 행동 안내 ── */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "48px 20px" }}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: trostSemantic.text.default,
            marginBottom: 24,
          }}
        >
          검사 후에는 다음 행동으로
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            {
              icon: "👩‍⚕️",
              title: "전문 상담사 찾기",
              desc: "검사 결과를 바탕으로 전문 상담을 받아보세요.",
              url: "/counselor",
              accent: trostCobalt[500],
            },
            {
              icon: "💬",
              title: "커뮤니티 보러가기",
              desc: "비슷한 고민을 가진 사람들과 이야기를 나눠보세요.",
              url: "/community",
              accent: trostPink[500],
            },
            {
              icon: "📖",
              title: "콘텐츠 보러가기",
              desc: "마음에 힘이 되는 명언과 글을 읽어보세요.",
              url: "/contents",
              accent: trostSemantic.success.main,
            },
          ].map((item) => (
            <div
              key={item.title}
              onClick={() => console.log(`navigate: ${item.url}`)}
              style={{
                border: `1px solid ${trostSemantic.border.light}`,
                borderRadius: rd.lg,
                padding: "24px 20px",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = item.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = trostSemantic.border.light;
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: trostSemantic.text.default,
                  marginBottom: 6,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: trostSemantic.text.subtle,
                  lineHeight: 1.6,
                }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 섹션 10: 하단 고정 배너 ── */}
      {/* [Missing] StickyBottomBar — DS 트랙에서 개발 후 교체 */}
      <StickyBottomBar>
        <Button
          variant="solid"
          size="lg"
          style={{ width: "100%" }}
          onClick={() => console.log("navigate: /test/comprehensive")}
        >
          무료 심리검사 시작하기
        </Button>
      </StickyBottomBar>
    </div>
  );
}
