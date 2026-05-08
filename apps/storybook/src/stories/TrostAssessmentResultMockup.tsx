/**
 * [TROST-ASSESSMENT-RESULT] 트로스트 PHQ-9 검사 결과 페이지 목업
 *
 * 목표: 검사 결과 시각화 → 상담 전환
 * DS 컴포넌트: ScoreGauge, AssessmentResultCard, CrisisCallout, CounselorCard, ActivityTimeline,
 *              Breadcrumb, Button, Divider
 * Layout: MockupLayout, useIsMobile from mockup-layout
 */
import React from "react";
import {
  ScoreGauge,
  AssessmentResultCard,
  CrisisCallout,
  CounselorCard,
  ActivityTimeline,
  Breadcrumb,
  Button,
  Divider,
} from "@nudge-eap/react";
import { MockupLayout, useIsMobile } from "./mockup-layout";
import {
  result as defaultResult,
  crisisInfo as defaultCrisis,
  recommendedCounselors,
  history,
  type AssessmentResult,
  type CrisisInfo,
} from "./trost-assessment-result-mock-data";

/* 트로스트 컬러 (헤더/푸터·배경에서만 활용) */
const T = {
  black: "#333333",
  subtle: "#606060",
  border: "#E5E5E5",
  bgCool: "#F4F5F7",
  white: "#FFFFFF",
} as const;

interface TrostAssessmentResultMockupProps {
  /** 결과 데이터 (기본: PHQ-9 14점 moderate) */
  result?: AssessmentResult;
  /** 위기 안내 표시 여부/내용 (severe일 때만 권장) */
  crisis?: CrisisInfo;
}

/* ─── Section header ─── */
const SectionTitle = ({ title, helper }: { title: string; helper?: string }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.black }}>{title}</h2>
    {helper && <p style={{ margin: 0, fontSize: 13, color: T.subtle }}>{helper}</p>}
  </div>
);

export function TrostAssessmentResultMockup({
  result = defaultResult,
  crisis = defaultCrisis,
}: TrostAssessmentResultMockupProps) {
  const isMobile = useIsMobile();
  const showCrisis = crisis.show || result.level === "severe";

  return (
    <MockupLayout
      brand="trost"
      activeGnbKey="test"
      disclaimer="본 검사 결과는 자가 진단 참고용이며, 임상적 진단을 대체하지 않습니다. 정확한 진단은 의료기관에 방문해 받아주세요."
      stickyBottom={
        <Button color="primary" variant="solid" fullWidth size="lg" onClick={() => {}}>
          상담사 예약하기
        </Button>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 24 : 32,
          padding: isMobile ? "16px 20px 24px" : "24px 32px 40px",
          maxWidth: 760,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "심리검사", href: "/test" },
            { label: result.examShort, href: `/test/${result.examShort.toLowerCase()}` },
            { label: "결과" },
          ]}
        />

        {/* 헤더 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 13, color: T.subtle }}>{result.takenAt}에 응답</span>
          <h1 style={{ margin: 0, fontSize: isMobile ? 22 : 26, fontWeight: 700, color: T.black }}>
            {result.examName} 결과
          </h1>
        </div>

        {/* ScoreGauge — 메인 시각 */}
        <div
          style={{
            background: T.white,
            border: `1px solid ${T.border}`,
            borderRadius: 16,
            padding: isMobile ? "20px 16px" : "32px 24px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: 360 }}>
            <ScoreGauge
              value={result.score}
              max={result.maxScore}
              segments={result.segments}
              showLegend={!isMobile}
            />
          </div>
        </div>

        {/* AssessmentResultCard — 요약 */}
        <AssessmentResultCard
          title={result.examName}
          score={result.score}
          maxScore={result.maxScore}
          level={result.level}
          description={result.summary}
        />

        {/* 위기 안내 (severe) */}
        {showCrisis && (
          <CrisisCallout
            tone="danger"
            title={crisis.title}
            description={crisis.description}
            actions={crisis.phones.map((p) => ({
              label: p.label,
              phoneNumber: p.phoneNumber,
              variant: p.variant,
            }))}
          />
        )}

        {/* 상세 해석 */}
        <section>
          <SectionTitle title="결과 해석" />
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: T.black }}>
            {result.detail}
          </p>
        </section>

        <Divider />

        {/* 추천 상담사 */}
        <section>
          <SectionTitle
            title="이 결과에 추천하는 상담사"
            helper="결과 단계에 맞춰 큐레이션됐어요"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {recommendedCounselors.map((c) => (
              <CounselorCard
                key={c.id}
                name={c.name}
                jobTitle={c.jobTitle}
                rating={c.rating}
                reviewCount={c.reviewCount}
                tags={c.tags}
                bio={c.bio}
                ctaLabel="예약"
                onCtaClick={() => {}}
                onCardClick={() => {}}
              />
            ))}
          </div>
        </section>

        <Divider />

        {/* 이력 타임라인 */}
        <section>
          <SectionTitle title="검사 이력" helper="최근 6개월" />
          <ActivityTimeline items={history} />
        </section>
      </div>
    </MockupLayout>
  );
}

export default TrostAssessmentResultMockup;
