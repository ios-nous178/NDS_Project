/**
 * [TROST-TEST-LIST] 트로스트 심리검사 목록 페이지 목업
 *
 * Mockup Renderer 산출물 — ephemeral
 * DS 컴포넌트: Button, Badge, Card, Chip
 * Missing (임시 구현): Accordion, StickyBottomBar
 */
import React, { useState } from "react";
import { Button, Badge, Card, Chip } from "@nudge-eap/react";
import {
  tests,
  faqs,
  relatedTags,
  emotionRoutes,
  infoHubText,
  selectionGuideText,
  type PsychTest,
} from "./mock-data";

/* ────────────────────────────────────────────
 * Missing DS 컴포넌트 — 임시 구현
 * DS 트랙에서 Accordion, StickyBottomBar 개발 후 교체 예정
 * ──────────────────────────────────────────── */

/** [Missing] Accordion — DS에 없으므로 HTML+Tailwind 임시 구현 */
function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-neutral-200 rounded-lg overflow-hidden">
          <button
            className="w-full text-left px-5 py-4 font-semibold text-base flex justify-between items-center hover:bg-neutral-50 transition-colors"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span>{item.question}</span>
            <span className="text-neutral-400 text-xl">{openIndex === i ? "−" : "+"}</span>
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4 text-neutral-600 text-sm leading-relaxed">{item.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}

/** [Missing] StickyBottomBar — DS에 없으므로 HTML+Tailwind 임시 구현 */
function StickyBottomBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-3 z-50 shadow-lg">
      <div className="max-w-3xl mx-auto">{children}</div>
    </div>
  );
}

/* ────────────────────────────────────────────
 * 유형별 Badge variant 매핑
 * ──────────────────────────────────────────── */
const typeKeywordVariant: Record<
  PsychTest["typeKeyword"],
  "primary" | "secondary" | "caution" | "error"
> = {
  증상형: "error",
  "자기 이해형": "primary",
  상황형: "caution",
  종합형: "secondary",
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
    <div className="min-h-screen bg-white pb-20">
      {/* ── 섹션 1: Hero ── */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-12 md:py-20 text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-neutral-900 mb-3">
          무료 심리검사 종류 &amp; 자가진단
        </h1>
        <p className="text-neutral-600 text-sm md:text-base mb-8 max-w-xl mx-auto">
          우울증, 스트레스, 자존감, 성격 유형까지 —<br />
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
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[
            { label: "우울", url: "/test/depression-type" },
            { label: "스트레스", url: "/test/job-stress" },
            { label: "자존감", url: "/test/self-esteem" },
            { label: "모르겠다면 종합검사", url: "/test/comprehensive" },
          ].map((btn) => (
            <Button
              key={btn.label}
              variant="soft"
              size="sm"
              onClick={() => console.log(`navigate: ${btn.url}`)}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </section>

      {/* ── 섹션 2: 정보형 허브 블록 ── */}
      <section className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-neutral-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
          {infoHubText}
        </div>
        <div className="flex flex-wrap gap-2 mt-6">
          <Badge variant="primary">증상형</Badge>
          <Badge variant="success">자기 이해형</Badge>
          <Badge variant="caution">상황형</Badge>
          <Badge variant="secondary">종합형</Badge>
        </div>
      </section>

      {/* ── 섹션 3: 심리검사 목록 ── */}
      <section id="test-list" className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">
          무료로 할 수 있는 온라인 심리검사
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((test) => (
            <Card
              key={test.id}
              variant="outlined"
              clickable
              onClick={() => console.log(`navigate: ${test.url}`)}
            >
              <Card.Header>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-600">{test.rank}위</span>
                  <Badge variant={typeKeywordVariant[test.typeKeyword]}>{test.typeKeyword}</Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <Card.Title>{test.name}</Card.Title>
                <Card.Subtitle>{test.description}</Card.Subtitle>
              </Card.Body>
              <Card.Footer>
                <div className="flex gap-3 text-xs text-neutral-500">
                  <span>{formatParticipants(test.participants)} 참여</span>
                  <span>{test.duration}</span>
                  <span>{test.questions}문항</span>
                </div>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 섹션 4: 감정/상황별 추천 ── */}
      <section className="bg-neutral-50 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">
            지금 내 감정/상황에 맞는 심리검사 추천
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {emotionRoutes.map((route, i) => {
              const isLast = emotionRoutes.length % 2 !== 0 && i === emotionRoutes.length - 1;
              return (
                <Card
                  key={route.label}
                  variant="elevated"
                  clickable
                  onClick={() => console.log(`navigate: ${route.url}`)}
                  className={isLast ? "col-span-2 md:col-span-1" : ""}
                >
                  <Card.Body>
                    <div className="text-center py-2">
                      <div className="text-3xl mb-2">{route.emoji}</div>
                      <div className="font-semibold text-neutral-900">{route.label}</div>
                      <div className="text-xs text-neutral-500 mt-1">{route.description}</div>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 섹션 5: 심리검사 선택 가이드 ── */}
      <section className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">
          심리검사 선택 가이드
        </h2>
        <div className="text-neutral-700 text-sm md:text-base leading-relaxed whitespace-pre-line mb-6">
          {selectionGuideText}
        </div>
        {/* PC에서만 노출되는 진입 카드 */}
        <div className="hidden md:grid grid-cols-2 gap-4">
          <Card variant="outlined" clickable>
            <Card.Body>
              <div className="text-center py-4">
                <div className="font-semibold text-neutral-900">증상 기준으로 찾기</div>
                <div className="text-sm text-neutral-500 mt-1">우울, 공황 등 증상별 검사 보기</div>
              </div>
            </Card.Body>
          </Card>
          <Card variant="outlined" clickable>
            <Card.Body>
              <div className="text-center py-4">
                <div className="font-semibold text-neutral-900">상황 기준으로 찾기</div>
                <div className="text-sm text-neutral-500 mt-1">직장, 취업 등 상황별 검사 보기</div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </section>

      {/* ── 섹션 6: 트로스트가 다른 이유 ── */}
      <section className="bg-neutral-50 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">
            무료 온라인 심리 검사, 트로스트가 다른 이유
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "전문 심리검사 도구 기반",
                desc: "PHQ-9, 로젠버그 자존감 척도 등 검증된 도구를 사용합니다.",
              },
              {
                title: "맞춤 결과 해석 제공",
                desc: "단순 점수가 아닌, 상태별 맞춤 해석과 조언을 제공합니다.",
              },
              {
                title: "전문 상담사 연계",
                desc: "검사 결과에 따라 전문 상담사와 바로 연결할 수 있습니다.",
              },
            ].map((item) => (
              <Card key={item.title} variant="outlined">
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Subtitle>{item.desc}</Card.Subtitle>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── 섹션 7: FAQ ── */}
      <section className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">무료 심리 검사 FAQ</h2>
        {/* [Missing] Accordion — DS 트랙에서 개발 후 교체 */}
        <Accordion items={faqs} />
      </section>

      {/* ── 섹션 8: 관련 검색 태그 ── */}
      <section className="bg-neutral-50 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">
            이런 검사도 찾고 있으신가요?
          </h2>
          <div className="flex flex-wrap gap-2">
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
      <section className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">
          검사 후에는 다음 행동으로
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "전문 상담사 찾기",
              desc: "검사 결과를 바탕으로 전문 상담을 받아보세요.",
              url: "/counselor",
            },
            {
              title: "커뮤니티 보러가기",
              desc: "비슷한 고민을 가진 사람들과 이야기를 나눠보세요.",
              url: "/community",
            },
            {
              title: "콘텐츠 보러가기",
              desc: "마음에 힘이 되는 명언과 글을 읽어보세요.",
              url: "/contents",
            },
          ].map((item) => (
            <Card
              key={item.title}
              variant="outlined"
              clickable
              onClick={() => console.log(`navigate: ${item.url}`)}
            >
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Subtitle>{item.desc}</Card.Subtitle>
              </Card.Body>
            </Card>
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
