/**
 * [TROST-MEDICATION-DETAIL] 트로스트 복용약 상세 페이지 목업
 *
 * 목표: SEO(구조화 콘텐츠), 체류시간(탭+인터랙션), 상담 전환률
 * DS 컴포넌트: AppBar, AppFooter, Button, Card, Badge, Chip, Tabs, Breadcrumb, ProgressBar, Avatar
 * Layout: MockupLayout, useIsMobile, Accordion, StickyBottomBar from mockup-layout
 */
import React, { useState } from "react";
import {
  Button,
  Card,
  Badge,
  Chip,
  Tabs,
  Breadcrumb,
  ProgressBar,
  Avatar,
  Select,
} from "@nudge-eap/react";
import { getBrandFixture } from "../brand-fixtures";
import { MockupLayout, useIsMobile, Accordion } from "./mockup-layout";
import {
  medicationDetail as med,
  type SimilarDrug,
  type CommunityPost,
  type Counselor,
} from "./trost-medication-detail-mock-data";

/** mobileHeight for sticky tab positioning */
const TROST_MOBILE_HEADER_HEIGHT = getBrandFixture("trost").header.mobileHeight;

/* ── 트로스트 컬러 ── */
const T = {
  yellow: "#FFF42E",
  yellowHover: "#FFE600",
  black: "#333333",
  subtle: "#606060",
  border: "#E5E5E5",
  bgCool: "#F4F5F7",
  cobalt: "#4968FF",
  white: "#FFFFFF",
  error: "#FF4111",
  caution: "#FFA100",
  success: "#00BC78",
} as const;

/* ════════════════════════════════════════
 * 임시 컴포넌트
 * ════════════════════════════════════════ */

function PillImage({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
      <rect width="120" height="120" rx="16" fill={T.bgCool} />
      <circle cx="60" cy="56" r="36" fill="#F0F0F0" stroke="#D5D5D5" strokeWidth="1.5" />
      <text x="60" y="60" textAnchor="middle" fontSize="11" fontWeight="600" fill="#999">
        {med.pill.imprint}
      </text>
      <text x="60" y="100" textAnchor="middle" fontSize="10" fill="#999">
        {med.pill.shape} · {med.pill.color}
      </text>
    </svg>
  );
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 16 16">
          <path
            d="M8 1.3l2 4.1 4.5.6-3.3 3.2.8 4.5L8 11.4l-4 2.3.8-4.5L1.5 6l4.5-.6z"
            fill={i <= Math.round(rating) ? "#FFD54F" : "#E0E0E0"}
          />
        </svg>
      ))}
      <span style={{ fontSize: 14, fontWeight: 700, color: T.black, marginLeft: 4 }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function FrequencyBar({ percent, severity }: { percent: number; severity: string }) {
  const color = severity === "심각" ? T.error : severity === "보통" ? T.caution : T.cobalt;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
      <ProgressBar value={percent} max={100} size="sm" color={color} style={{ flex: 1 }} />
      <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 36, textAlign: "right" }}>
        {percent}%
      </span>
    </div>
  );
}

/** CTA 배너 — 전환률 핵심 */
function CounselingCTA({
  title,
  desc,
  compact,
}: {
  title: string;
  desc: string;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${T.yellow}30 0%, ${T.cobalt}10 100%)`,
        border: `1px solid ${T.yellow}60`,
        borderRadius: 16,
        padding: compact ? "14px 16px" : "20px 24px",
        display: "flex",
        alignItems: compact ? "center" : "flex-start",
        gap: compact ? 12 : 16,
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: compact ? 15 : 17,
            color: T.black,
            marginBottom: compact ? 2 : 6,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: compact ? 13 : 14, color: T.subtle, lineHeight: 1.5 }}>{desc}</div>
      </div>
      <Button
        variant="solid"
        size={compact ? "sm" : "md"}
        style={compact ? {} : { width: "100%" }}
        onClick={() => console.log("navigate: /counselor?medication=" + med.id)}
      >
        상담사 찾기
      </Button>
    </div>
  );
}

const severityBadge: Record<string, "error" | "caution" | "primary"> = {
  금기: "error",
  경고: "caution",
  주의: "primary",
};
const severityColor: Record<string, string> = { 심각: T.error, 보통: T.caution, 경미: T.cobalt };
const cautionColor: Record<string, string> = { 높음: T.error, 보통: T.caution, 낮음: T.success };

function formatCount(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천`;
  return `${n}`;
}

/* ════════════════════════════════════════
 * 메인 컴포넌트
 * ════════════════════════════════════════ */
export default function TrostMedicationDetailMockup() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<
    "info" | "sideEffects" | "interactions" | "dosage" | "reviews"
  >("info");
  const [showAllSideEffects, setShowAllSideEffects] = useState(false);
  const [reviewSort, setReviewSort] = useState<"helpful" | "recent">("helpful");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const sortedReviews = [...med.reviews].sort((a, b) =>
    reviewSort === "helpful"
      ? b.helpful - a.helpful
      : new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const tabs = isMobile
    ? [
        { key: "info" as const, label: "기본정보" },
        { key: "sideEffects" as const, label: "부작용" },
        { key: "interactions" as const, label: "상호작용" },
        { key: "dosage" as const, label: "용법" },
        { key: "reviews" as const, label: `리뷰(${med.reviewCount})` },
      ]
    : [
        { key: "info" as const, label: "기본정보" },
        { key: "sideEffects" as const, label: "부작용" },
        { key: "interactions" as const, label: "상호작용" },
        { key: "dosage" as const, label: "용법·용량" },
        { key: "reviews" as const, label: `리뷰 ${med.reviewCount}` },
      ];

  return (
    <MockupLayout
      brand="trost"
      activeGnbKey="medicine"
      webview
      webviewTitle={med.name}
      disclaimer="본 페이지의 약물 정보는 일반적인 참고용이며, 의학적 진단이나 처방을 대체하지 않습니다. 정확한 복용법과 주의사항은 반드시 담당 의료진과 상담하세요."
      stickyBottom={
        <>
          {!isMobile && (
            <Button
              variant="outlined"
              size="lg"
              style={{ flex: 1 }}
              onClick={() => console.log("navigate: /test/depression-phq9")}
            >
              우울증 자가진단
            </Button>
          )}
          <Button
            variant="solid"
            size={isMobile ? "lg" : "lg"}
            style={{ flex: isMobile ? 1 : 2, width: isMobile ? "100%" : undefined }}
            onClick={() => console.log("navigate: /counselor?medication=" + med.id)}
          >
            이 약 관련 상담받기
          </Button>
        </>
      }
    >
      {/* ══════════════════════════════════════
         섹션 1: 약물 Hero
         ══════════════════════════════════════ */}
      <section style={{ background: T.bgCool }}>
        <div
          style={{
            maxWidth: 768,
            margin: "0 auto",
            padding: isMobile ? "24px 16px 0" : "40px 16px 0",
          }}
        >
          {/* Breadcrumb (SEO) */}
          {!isMobile && (
            <Breadcrumb
              items={[
                { label: "복용약 찾기", href: "/medication" },
                { label: med.category, href: `/medication?category=${med.category}` },
                { label: med.name },
              ]}
              style={{ marginBottom: 16 }}
            />
          )}

          {/* 카���고리 배지 */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            <Badge variant="neutral" style={{ whiteSpace: "nowrap" }}>
              {med.category}
            </Badge>
            <Badge variant="neutral" style={{ whiteSpace: "nowrap" }}>
              {med.subCategory}
            </Badge>
            {med.insuranceCovered && (
              <Badge variant="success" style={{ whiteSpace: "nowrap" }}>
                급여 적용
              </Badge>
            )}
          </div>

          {/* 메인: 이미지 + 약명 가로 배치 */}
          <div
            style={{
              display: "flex",
              gap: isMobile ? 16 : 24,
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <PillImage size={isMobile ? 80 : 100} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1
                style={{
                  fontSize: isMobile ? 26 : 36,
                  fontWeight: 700,
                  color: T.black,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {med.name}
              </h1>
              <p
                style={{
                  fontSize: isMobile ? 14 : 16,
                  color: T.cobalt,
                  fontWeight: 600,
                  margin: "4px 0 0",
                }}
              >
                {med.genericName}
              </p>
              <p style={{ fontSize: 13, color: T.subtle, margin: "4px 0 0" }}>
                {med.manufacturer} · {med.approvalDate} 허가
              </p>
            </div>
          </div>

          {/* 별점 바 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              padding: "14px 0",
              borderTop: `1px solid ${T.border}`,
            }}
          >
            <StarRating rating={med.avgRating} />
            <span style={{ fontSize: 13, color: T.subtle }}>
              리뷰 {formatCount(med.reviewCount)}개
            </span>
            <span style={{ width: 1, height: 12, background: T.border }} />
            <span style={{ fontSize: 13, color: T.subtle }}>조회 {formatCount(med.userCount)}</span>
          </div>
        </div>

        {/* 퀵 스탯 카드 */}
        <div style={{ maxWidth: 768, margin: "0 auto", padding: "0 16px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            <div
              style={{
                background: T.white,
                borderRadius: 12,
                padding: isMobile ? "14px 12px" : "16px 20px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, color: T.subtle, marginBottom: 4 }}>주의등급</div>
              <div
                style={{
                  fontSize: isMobile ? 16 : 18,
                  fontWeight: 700,
                  color: cautionColor[med.cautionLevel],
                }}
              >
                {med.cautionLevel}
              </div>
            </div>
            <div
              style={{
                background: T.white,
                borderRadius: 12,
                padding: isMobile ? "14px 12px" : "16px 20px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, color: T.subtle, marginBottom: 4 }}>부작용</div>
              <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: T.black }}>
                {med.sideEffects.length}건
              </div>
            </div>
            <div
              style={{
                background: T.white,
                borderRadius: 12,
                padding: isMobile ? "14px 12px" : "16px 20px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, color: T.subtle, marginBottom: 4 }}>상호작용</div>
              <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: T.black }}>
                {med.interactions.length}건
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
         탭 네비게이션
         ══════════════════════════════════════ */}
      <div
        style={{
          position: "sticky",
          top: isMobile ? TROST_MOBILE_HEADER_HEIGHT : 0,
          background: T.white,
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          <Tabs
            items={tabs.map((tab) => ({ key: tab.key, title: tab.label }))}
            activeKey={activeTab}
            onTabChange={(key) => setActiveTab(key as typeof activeTab)}
            variant="line"
            fullWidth={!isMobile}
            slotProps={{
              list: {
                style: isMobile
                  ? ({
                      overflowX: "auto",
                      WebkitOverflowScrolling: "touch",
                      scrollbarWidth: "none",
                      gap: 0,
                    } as React.CSSProperties)
                  : undefined,
              },
              trigger: {
                style: isMobile
                  ? ({
                      fontSize: 13,
                      padding: "0 14px",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    } as React.CSSProperties)
                  : undefined,
              },
            }}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════
         탭 콘텐츠
         ══════════════════════════════════════ */}
      <div style={{ maxWidth: 768, margin: "0 auto", padding: "0 16px" }}>
        {/* ━━ 기본정보 ━━ */}
        {activeTab === "info" && (
          <div style={{ padding: "32px 0" }}>
            {/* 설명 */}
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 16px" }}>
                약물 설명
              </h2>
              <p style={{ fontSize: 15, color: T.black, lineHeight: 1.8, whiteSpace: "pre-line" }}>
                {med.description}
              </p>
            </section>

            {/* CTA 1 */}
            <CounselingCTA
              title="렉사프로 복용, 혼자 고민하지 마세요"
              desc="약물 복용 과정에서의 불안, 부작용 스트레스를 전문 상담사와 함께 해결하세요."
            />

            {/* 작용 기전 */}
            <section style={{ margin: "40px 0" }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 16px" }}>
                작용 기전
              </h2>
              <p style={{ fontSize: 15, color: T.black, lineHeight: 1.8, whiteSpace: "pre-line" }}>
                {med.mechanism}
              </p>
            </section>

            {/* 적응증 */}
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 16px" }}>
                적응증
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {med.indications.map((ind, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "12px 16px",
                      background: T.bgCool,
                      borderRadius: 10,
                    }}
                  >
                    <span style={{ color: T.cobalt, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                      ✓
                    </span>
                    <span style={{ fontSize: 14, color: T.black, lineHeight: 1.5 }}>{ind}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 금기사항 */}
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 16px" }}>
                금기사항
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {med.contraindications.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "12px 16px",
                      background: `${T.error}08`,
                      borderRadius: 10,
                      border: `1px solid ${T.error}15`,
                    }}
                  >
                    <span style={{ color: T.error, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                      ✕
                    </span>
                    <span style={{ fontSize: 14, color: T.black, lineHeight: 1.5 }}>{c}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 약물 외형 정보 */}
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 16px" }}>
                약물 외형 정보
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {[
                  { label: "모양", value: med.pill.shape },
                  { label: "색상", value: med.pill.color },
                  { label: "각인", value: med.pill.imprint },
                  { label: "크기", value: med.pill.size },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{ padding: "14px 16px", background: T.bgCool, borderRadius: 10 }}
                  >
                    <div style={{ fontSize: 12, color: T.subtle, marginBottom: 4 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: T.black }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 관련 콘텐츠 */}
            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 16px" }}>
                관련 콘텐츠
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {med.relatedArticles.slice(0, 3).map((a) => (
                  <Card
                    key={a.id}
                    variant="outlined"
                    clickable
                    onClick={() => console.log(`navigate: ${a.url}`)}
                  >
                    <Card.Body>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div>
                          <Badge variant="neutral">{a.category}</Badge>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 15,
                              color: T.black,
                              margin: "8px 0 4px",
                            }}
                          >
                            {a.title}
                          </div>
                          <div style={{ fontSize: 13, color: T.subtle, lineHeight: 1.5 }}>
                            {a.summary}
                          </div>
                        </div>
                        <span
                          style={{ fontSize: 12, color: T.subtle, flexShrink: 0, marginLeft: 12 }}
                        >
                          {a.readTime}
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ━━ 부작용 ━━ */}
        {activeTab === "sideEffects" && (
          <div style={{ padding: "32px 0" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 8px" }}>
              부작용
            </h2>
            <p style={{ fontSize: 14, color: T.subtle, margin: "0 0 24px", lineHeight: 1.5 }}>
              임상 시험 및 시판 후 조사에서 보고된 부작용입니다. 발생 빈도와 대처법을 확인하세요.
            </p>

            {/* 부작용 목록 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(showAllSideEffects ? med.sideEffects : med.sideEffects.slice(0, 6)).map((se) => (
                <div
                  key={se.name}
                  style={{
                    padding: "16px 20px",
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: T.black }}>
                        {se.name}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: severityColor[se.severity],
                          background: `${severityColor[se.severity]}12`,
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}
                      >
                        {se.severity}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: T.subtle }}>{se.frequency}</span>
                  </div>
                  <FrequencyBar percent={se.percent} severity={se.severity} />
                  <p style={{ fontSize: 13, color: T.subtle, lineHeight: 1.6, margin: "10px 0 0" }}>
                    {se.description}
                  </p>
                </div>
              ))}
            </div>

            {med.sideEffects.length > 6 && (
              <button
                onClick={() => setShowAllSideEffects(!showAllSideEffects)}
                style={{
                  display: "block",
                  margin: "16px auto 0",
                  padding: "10px 24px",
                  border: `1px solid ${T.border}`,
                  borderRadius: 20,
                  background: T.white,
                  color: T.subtle,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {showAllSideEffects ? "접기" : `전체 ${med.sideEffects.length}개 보기`}
              </button>
            )}

            {/* 부작용 CTA */}
            <div style={{ marginTop: 32 }}>
              <CounselingCTA
                title="부작용이 걱정되시나요?"
                desc="부작용으로 인한 불안, 복약 중단 고민을 상담사와 나눠보세요. 약물 치료를 포기하기 전에 도움을 받을 수 있습니다."
              />
            </div>
          </div>
        )}

        {/* ━━ 상호작용 ━━ */}
        {activeTab === "interactions" && (
          <div style={{ padding: "32px 0" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 8px" }}>
              약물 상호작용
            </h2>
            <p style={{ fontSize: 14, color: T.subtle, margin: "0 0 24px", lineHeight: 1.5 }}>
              {med.name}와 함께 복용 시 주의해야 할 약물 목록입니다. 복용 중인 약이 있다면 반드시
              의사에게 알려주세요.
            </p>

            {/* 심각도별 그룹 */}
            {(["금기", "경고", "주의"] as const).map((severity) => {
              const items = med.interactions.filter((i) => i.severity === severity);
              if (items.length === 0) return null;
              return (
                <div key={severity} style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Badge variant={severityBadge[severity]}>{severity}</Badge>
                    <span style={{ fontSize: 13, color: T.subtle }}>{items.length}건</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {items.map((inter) => (
                      <div
                        key={inter.drugName}
                        style={{
                          padding: "14px 20px",
                          border: `1px solid ${T.border}`,
                          borderRadius: 12,
                        }}
                      >
                        <div
                          style={{ fontWeight: 700, fontSize: 15, color: T.black, marginBottom: 6 }}
                        >
                          {inter.drugName}
                        </div>
                        <p style={{ fontSize: 13, color: T.subtle, lineHeight: 1.6, margin: 0 }}>
                          {inter.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* 상호작용 CTA */}
            <CounselingCTA
              compact
              title="복용 중인 약이 여러 개인가요?"
              desc="약물 병용에 대한 불안, 전문 상담사에게 물어보세요."
            />
          </div>
        )}

        {/* ━━ 용법·용량 ━━ */}
        {activeTab === "dosage" && (
          <div style={{ padding: "32px 0" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 16px" }}>
              용법 · 용량
            </h2>

            {/* 용량 — 데스크탑: 테이블 / 모바일: 카드 */}
            {isMobile ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
                {med.dosages.map((d, i) => (
                  <div
                    key={i}
                    style={{ border: `1px solid ${T.border}`, borderRadius: 12, padding: 16 }}
                  >
                    <div
                      style={{ fontWeight: 700, fontSize: 15, color: T.black, marginBottom: 10 }}
                    >
                      {d.target}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 11, color: T.subtle, marginBottom: 2 }}>초기</div>
                        <div style={{ fontSize: 13, color: T.black }}>
                          {d.initial.replace("1일 1회", "").trim()}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: T.subtle, marginBottom: 2 }}>유지</div>
                        <div style={{ fontSize: 13, color: T.black }}>
                          {d.maintenance.replace("1일 1회", "").trim()}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: T.subtle, marginBottom: 2 }}>최대</div>
                        <div style={{ fontSize: 13, color: T.cobalt, fontWeight: 600 }}>
                          {d.max}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ overflowX: "auto", marginBottom: 32 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${T.black}` }}>
                      {["대상", "초기 용량", "유지 용량", "최대 용량"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 12px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: T.black,
                            whiteSpace: "nowrap" as const,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {med.dosages.map((d, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                        <td
                          style={{
                            padding: "12px 12px",
                            fontWeight: 600,
                            color: T.black,
                            whiteSpace: "nowrap" as const,
                          }}
                        >
                          {d.target}
                        </td>
                        <td style={{ padding: "12px 12px", color: T.subtle }}>{d.initial}</td>
                        <td style={{ padding: "12px 12px", color: T.subtle }}>{d.maintenance}</td>
                        <td style={{ padding: "12px 12px", color: T.cobalt, fontWeight: 600 }}>
                          {d.max}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 주의사항 */}
            <h3 style={{ fontSize: 18, fontWeight: 700, color: T.black, margin: "0 0 16px" }}>
              복용 시 주의사항
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
              {med.precautions.map((p, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "14px 16px",
                    background: T.bgCool,
                    borderRadius: 10,
                  }}
                >
                  <span style={{ fontWeight: 700, color: T.caution, fontSize: 16, flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 14, color: T.black, lineHeight: 1.6 }}>{p}</span>
                </div>
              ))}
            </div>

            {/* 보관 */}
            <div
              style={{
                padding: "16px 20px",
                background: T.bgCool,
                borderRadius: 12,
                marginBottom: 32,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: T.black, marginBottom: 6 }}>
                보관 방법
              </div>
              <div style={{ fontSize: 14, color: T.subtle }}>{med.storage}</div>
            </div>

            <CounselingCTA
              compact
              title="복용법이 헷갈리시나요?"
              desc="상담사가 복약 습관 형성을 도와드립니다."
            />
          </div>
        )}

        {/* ━━ 리뷰 ━━ */}
        {activeTab === "reviews" && (
          <div style={{ padding: "32px 0" }}>
            {/* 리뷰 요약 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 16 : 24,
                marginBottom: 24,
                padding: isMobile ? "16px" : "24px",
                background: T.bgCool,
                borderRadius: 16,
              }}
            >
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: isMobile ? 32 : 40, fontWeight: 700, color: T.black }}>
                  {med.avgRating.toFixed(1)}
                </div>
                <StarRating rating={med.avgRating} size={14} />
                <div style={{ fontSize: 13, color: T.subtle, marginTop: 4 }}>
                  {formatCount(med.reviewCount)}개 리뷰
                </div>
              </div>
              <div style={{ flex: 1 }}>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = med.reviews.filter((r) => r.rating === star).length;
                  const pct = med.reviews.length > 0 ? (count / med.reviews.length) * 100 : 0;
                  return (
                    <div
                      key={star}
                      style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}
                    >
                      <span
                        style={{ fontSize: 12, color: T.subtle, width: 16, textAlign: "right" }}
                      >
                        {star}
                      </span>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: "#E5E5E5" }}>
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            borderRadius: 3,
                            background: "#FFD54F",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 정렬 + 리뷰 작성 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", gap: 8 }}>
                {(
                  [
                    ["helpful", "도움순"],
                    ["recent", "최신순"],
                  ] as const
                ).map(([key, label]) => (
                  <Chip
                    key={key}
                    label={label}
                    variant="outlined"
                    selected={reviewSort === key}
                    size="sm"
                    shape="pill"
                    onClick={() => setReviewSort(key)}
                  />
                ))}
              </div>
              <Button variant="solid" size="sm" onClick={() => setShowReviewForm(!showReviewForm)}>
                {showReviewForm ? "취소" : "리뷰 작성"}
              </Button>
            </div>

            {/* 리뷰 작성 폼 */}
            {showReviewForm && (
              <ReviewForm drugName={med.name} onClose={() => setShowReviewForm(false)} />
            )}

            {/* 리뷰 목록 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {sortedReviews.map((r) => (
                <div
                  key={r.id}
                  style={{ padding: "20px", border: `1px solid ${T.border}`, borderRadius: 12 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: T.black }}>
                          {r.nickname}
                        </span>
                        <span style={{ fontSize: 12, color: T.subtle }}>
                          {r.age} · 복용 {r.duration}
                        </span>
                      </div>
                      <StarRating rating={r.rating} size={12} />
                    </div>
                    <span style={{ fontSize: 12, color: T.subtle }}>{r.date}</span>
                  </div>
                  <p style={{ fontSize: 14, color: T.black, lineHeight: 1.7, margin: "0 0 12px" }}>
                    {r.content}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {r.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: 11,
                            color: T.cobalt,
                            background: `${T.cobalt}10`,
                            padding: "3px 8px",
                            borderRadius: 4,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: 12, color: T.subtle }}>👍 {r.helpful}명에게 도움</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 리뷰 CTA */}
            <div style={{ marginTop: 32 }}>
              <CounselingCTA
                title="나도 비슷한 경험이 있다면"
                desc="혼자 고민하지 말고, 같은 약을 복용하는 분들의 경험을 공유하고 전문 상담을 받아보세요."
              />
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
         유사 약물 비교 (강화)
         ══════════════════════════════════════ */}
      <section style={{ background: T.bgCool, padding: "40px 16px" }}>
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 8px" }}>
            {med.name} vs 유사 약물 비교
          </h2>
          <p style={{ fontSize: 14, color: T.subtle, margin: "0 0 20px" }}>
            같은 계열 약물을 비교해보세요. 약 변경은 반드시 의사와 상의하세요.
          </p>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
            {med.similarDrugs.map((drug) => (
              <SimilarDrugCard
                key={drug.id}
                drug={drug}
                currentDrug={med.name}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
         커뮤니티 연동
         ══════════════════════════════════════ */}
      <section style={{ maxWidth: 768, margin: "0 auto", padding: "40px 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 4px" }}>
              {med.name} 커뮤니티
            </h2>
            <p style={{ fontSize: 14, color: T.subtle, margin: 0 }}>
              같은 약을 복용하는 분들의 경험과 팁
            </p>
          </div>
          <Button
            variant="outlined-sub"
            size="sm"
            onClick={() => console.log("navigate: /community?medication=" + med.id)}
          >
            전체보기
          </Button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {med.communityPosts.map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Button
            variant="soft"
            size="md"
            onClick={() => console.log("navigate: /community/write?tag=" + med.name)}
          >
            나도 경험 공유하기
          </Button>
        </div>
      </section>

      {/* ══════════════════════════════════════
         추천 상담사
         ══════════════════════════════════════ */}
      <section style={{ background: T.bgCool, padding: "40px 16px" }}>
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 4px" }}>
            {med.name} 복용 상담 전문가
          </h2>
          <p style={{ fontSize: 14, color: T.subtle, margin: "0 0 20px" }}>
            약물 복용 관련 상담 경험이 풍부한 전문 상담사를 추천합니다
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {med.recommendedCounselors.map((counselor) => (
              <CounselorCard key={counselor.id} counselor={counselor} isMobile={isMobile} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
         FAQ
         ══════════════════════════════════════ */}
      <section style={{ maxWidth: 768, margin: "0 auto", padding: "40px 16px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 20px" }}>
          {med.name} 자주 묻는 질문
        </h2>
        <Accordion items={med.faqs} />
      </section>

      {/* ══════════════════════════════════════
         관련 콘텐츠 (전체)
         ══════════════════════════════════════ */}
      <section style={{ background: T.bgCool, padding: "40px 16px" }}>
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 16px" }}>
            함께 읽으면 좋은 콘텐츠
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "100%" : "280px"}, 1fr))`,
              gap: 12,
            }}
          >
            {med.relatedArticles.map((a) => (
              <Card
                key={a.id}
                variant="outlined"
                clickable
                onClick={() => console.log(`navigate: ${a.url}`)}
              >
                <Card.Body>
                  <div
                    style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}
                  >
                    <Badge variant="neutral">{a.category}</Badge>
                    <span style={{ fontSize: 12, color: T.subtle }}>{a.readTime}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: T.black, marginBottom: 4 }}>
                    {a.title}
                  </div>
                  <div style={{ fontSize: 13, color: T.subtle, lineHeight: 1.5 }}>{a.summary}</div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </MockupLayout>
  );
}

/* ────────────────────────────────────────────
 * SimilarDrugCard — 비교 카드
 * ──────────────────────────────────────────── */
function SimilarDrugCard({
  drug,
  currentDrug,
  isMobile,
}: {
  drug: SimilarDrug;
  currentDrug: string;
  isMobile: boolean;
}) {
  const cautionColors: Record<string, string> = { 높음: T.error, 보통: T.caution, 낮음: T.success };
  return (
    <div
      onClick={() => console.log(`navigate: /medication/${drug.id}`)}
      style={{
        minWidth: isMobile ? 260 : 300,
        flexShrink: 0,
        cursor: "pointer",
        background: T.white,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: 20,
        transition: "box-shadow 0.15s",
      }}
    >
      {/* 상단: 이름 + 별점 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <Badge variant="neutral">{drug.category}</Badge>
            {drug.insuranceCovered && <Badge variant="success">급여</Badge>}
          </div>
          <div style={{ fontWeight: 700, fontSize: 18, color: T.black }}>{drug.name}</div>
          <div style={{ fontSize: 13, color: T.cobalt, fontWeight: 500 }}>{drug.genericName}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 16 16">
              <path
                d="M8 1.3l2 4.1 4.5.6-3.3 3.2.8 4.5L8 11.4l-4 2.3.8-4.5L1.5 6l4.5-.6z"
                fill="#FFD54F"
              />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.black }}>
              {drug.avgRating.toFixed(1)}
            </span>
          </div>
          <div style={{ fontSize: 11, color: T.subtle }}>{drug.reviewCount}개 리뷰</div>
        </div>
      </div>

      {/* 주요 부작용 */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.subtle, marginBottom: 6 }}>
          주요 부작용
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {drug.topSideEffects.map((se) => (
            <span
              key={se}
              style={{
                fontSize: 11,
                color: T.subtle,
                background: T.bgCool,
                padding: "3px 8px",
                borderRadius: 4,
              }}
            >
              {se}
            </span>
          ))}
        </div>
      </div>

      {/* 장점/단점 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.success, marginBottom: 4 }}>
            장점
          </div>
          {drug.pros.slice(0, 2).map((p) => (
            <div key={p} style={{ fontSize: 12, color: T.black, lineHeight: 1.6 }}>
              + {p}
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.error, marginBottom: 4 }}>단점</div>
          {drug.cons.slice(0, 2).map((c) => (
            <div key={c} style={{ fontSize: 12, color: T.black, lineHeight: 1.6 }}>
              - {c}
            </div>
          ))}
        </div>
      </div>

      {/* 하단 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 12,
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <span style={{ fontSize: 12, color: cautionColors[drug.cautionLevel], fontWeight: 600 }}>
          주의등급 {drug.cautionLevel}
        </span>
        <span style={{ fontSize: 13, color: T.cobalt, fontWeight: 600 }}>
          {currentDrug}와 비교 →
        </span>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
 * CommunityPostCard — 커뮤니티 게시글 카드
 * ──────────────────────────────────────────── */
function CommunityPostCard({ post }: { post: CommunityPost }) {
  return (
    <Card
      variant="outlined"
      clickable
      onClick={() => console.log(`navigate: /community/post/${post.id}`)}
    >
      <Card.Body>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <Badge variant="neutral">{post.category}</Badge>
          <span style={{ fontSize: 12, color: T.subtle }}>{post.date}</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, color: T.black, marginBottom: 6 }}>
          {post.title}
        </div>
        <p
          style={{
            fontSize: 13,
            color: T.subtle,
            lineHeight: 1.6,
            margin: "0 0 12px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
          }}
        >
          {post.preview}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 11,
                  color: T.cobalt,
                  background: `${T.cobalt}10`,
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, fontSize: 12, color: T.subtle, flexShrink: 0 }}>
            <span>❤️ {post.likeCount}</span>
            <span>💬 {post.commentCount}</span>
          </div>
        </div>
        <div style={{ fontSize: 12, color: T.subtle, marginTop: 8 }}>by {post.author}</div>
      </Card.Body>
    </Card>
  );
}

/* ────────────────────────────────────────────
 * CounselorCard — 상담사 추천 카드
 * ──────────────────────────────────────────── */
function CounselorCard({ counselor, isMobile }: { counselor: Counselor; isMobile: boolean }) {
  return (
    <div
      style={{
        background: T.white,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: isMobile ? 16 : 24,
        transition: "box-shadow 0.15s",
      }}
    >
      <div style={{ display: "flex", gap: isMobile ? 12 : 20 }}>
        {/* 프로필 아바타 */}
        <Avatar name={counselor.name} size={isMobile ? "lg" : "xl"} />

        {/* 정보 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 17, color: T.black }}>{counselor.name}</span>
            <span style={{ fontSize: 13, color: T.subtle }}>{counselor.title}</span>
            {counselor.availableToday && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.success,
                  background: `${T.success}12`,
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                오늘 상담 가능
              </span>
            )}
          </div>

          {/* 별점 + 경력 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="13" height="13" viewBox="0 0 16 16">
                <path
                  d="M8 1.3l2 4.1 4.5.6-3.3 3.2.8 4.5L8 11.4l-4 2.3.8-4.5L1.5 6l4.5-.6z"
                  fill="#FFD54F"
                />
              </svg>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.black }}>
                {counselor.rating}
              </span>
              <span style={{ fontSize: 12, color: T.subtle }}>({counselor.reviewCount})</span>
            </div>
            <span style={{ fontSize: 12, color: T.subtle }}>경력 {counselor.experience}</span>
            <span style={{ fontSize: 12, color: T.cobalt, fontWeight: 600 }}>
              약물 상담 {counselor.medicationCounselCount}회
            </span>
          </div>

          {/* 전문 분야 */}
          <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
            {counselor.specialties.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: 11,
                  color: T.subtle,
                  background: T.bgCool,
                  padding: "3px 8px",
                  borderRadius: 4,
                }}
              >
                {s}
              </span>
            ))}
          </div>

          {/* 소개 */}
          <p
            style={{
              fontSize: 13,
              color: T.subtle,
              lineHeight: 1.6,
              margin: "0 0 14px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
            }}
          >
            {counselor.introduction}
          </p>

          {/* 하단: 가격 + CTA */}
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "stretch" : "center",
              gap: isMobile ? 10 : 0,
              paddingTop: 12,
              borderTop: `1px solid ${T.border}`,
              marginTop: 4,
            }}
          >
            <div>
              <span style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: T.black }}>
                {counselor.price.toLocaleString()}원
              </span>
              <span style={{ fontSize: 12, color: T.subtle, marginLeft: 4 }}>/ 50분</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                variant="outlined-sub"
                size="sm"
                style={isMobile ? { flex: 1 } : {}}
                onClick={() => console.log(`navigate: /counselor/${counselor.id}`)}
              >
                프로필
              </Button>
              <Button
                variant="solid"
                size="sm"
                style={isMobile ? { flex: 2 } : {}}
                onClick={() => console.log(`navigate: /counselor/${counselor.id}/book`)}
              >
                상담 신청
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
 * ReviewForm — 리뷰 작성 폼
 * ──────────────────────────────────────────── */
const REVIEW_TAGS = [
  "효과 좋음",
  "부작용 적음",
  "부작용 있음",
  "초기 적응 필요",
  "상담 병행",
  "장기 복용",
  "졸림 있음",
  "수면 개선",
  "불안 개선",
  "식욕 변화",
];
const DURATIONS = ["1주 미만", "1~4주", "1~3개월", "3~6개월", "6개월~1년", "1년 이상"];
const AGE_RANGES = ["10대", "20대", "30대", "40대", "50대", "60대 이상"];

function ReviewForm({ drugName, onClose }: { drugName: string; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [duration, setDuration] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 5 ? [...prev, tag] : prev,
    );

  const isValid = rating > 0 && duration && content.length >= 20;

  const handleSubmit = () => {
    console.log("submit review:", { rating, duration, ageRange, content, selectedTags });
    onClose();
  };

  return (
    <div
      style={{
        border: `2px solid ${T.yellow}`,
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        background: T.white,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, color: T.black, margin: 0 }}>
          {drugName} 복용 리뷰 작성
        </h3>
        <button
          onClick={onClose}
          style={{
            border: "none",
            background: "none",
            fontSize: 20,
            color: T.subtle,
            cursor: "pointer",
            padding: 4,
          }}
        >
          ×
        </button>
      </div>

      {/* 별점 */}
      <div style={{ marginBottom: 24 }}>
        <label
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.black,
            display: "block",
            marginBottom: 10,
          }}
        >
          전반적인 만족도 <span style={{ color: T.error }}>*</span>
        </label>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              style={{ border: "none", background: "none", cursor: "pointer", padding: 2 }}
            >
              <svg width="32" height="32" viewBox="0 0 16 16">
                <path
                  d="M8 1.3l2 4.1 4.5.6-3.3 3.2.8 4.5L8 11.4l-4 2.3.8-4.5L1.5 6l4.5-.6z"
                  fill={star <= (hoverRating || rating) ? "#FFD54F" : "#E0E0E0"}
                  style={{ transition: "fill 0.1s" }}
                />
              </svg>
            </button>
          ))}
          {rating > 0 && (
            <span style={{ fontSize: 14, fontWeight: 700, color: T.black, marginLeft: 8 }}>
              {["", "별로예요", "아쉬워요", "보통이에요", "만족해요", "매우 만족해요"][rating]}
            </span>
          )}
        </div>
      </div>

      {/* 복용 기간 + 연령대 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        <Select
          label="복용 기간 *"
          placeholder="선택하세요"
          options={DURATIONS.map((d) => ({ value: d, label: d }))}
          value={duration}
          onValueChange={setDuration}
        />
        <Select
          label="연령대"
          placeholder="선택하세요"
          options={AGE_RANGES.map((a) => ({ value: a, label: a }))}
          value={ageRange}
          onValueChange={setAgeRange}
        />
      </div>

      {/* 리뷰 내용 */}
      <div style={{ marginBottom: 24 }}>
        <label
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.black,
            display: "block",
            marginBottom: 8,
          }}
        >
          복용 경험을 자유롭게 적어주세요 <span style={{ color: T.error }}>*</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`${drugName} 복용 후 느낀 점, 효과, 부작용 경험 등을 솔직하게 적어주세요.\n다른 복용자에게 큰 도움이 됩니다. (최소 20자)`}
          style={{
            width: "100%",
            minHeight: 140,
            padding: "14px 16px",
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            fontSize: 14,
            color: T.black,
            fontFamily: "inherit",
            lineHeight: 1.7,
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 12, color: content.length < 20 ? T.subtle : T.success }}>
            {content.length < 20 ? `${20 - content.length}자 더 입력해주세요` : "작성 가능"}
          </span>
          <span style={{ fontSize: 12, color: T.subtle }}>{content.length}자</span>
        </div>
      </div>

      {/* 태그 선택 */}
      <div style={{ marginBottom: 24 }}>
        <label
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: T.black,
            display: "block",
            marginBottom: 4,
          }}
        >
          키워드 태그 선택
        </label>
        <p style={{ fontSize: 12, color: T.subtle, margin: "0 0 10px" }}>
          최대 5개까지 선택할 수 있어요
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {REVIEW_TAGS.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              variant="outlined"
              selected={selectedTags.includes(tag)}
              size="sm"
              shape="pill"
              onClick={() => toggleTag(tag)}
            />
          ))}
        </div>
      </div>

      {/* 안내 */}
      <div
        style={{
          padding: "12px 16px",
          background: T.bgCool,
          borderRadius: 10,
          marginBottom: 20,
          fontSize: 13,
          color: T.subtle,
          lineHeight: 1.6,
        }}
      >
        리뷰는 익명으로 게시되며, 다른 복용자의 의사결정에 도움이 됩니다. 개인정보(이름, 병원명
        등)는 포함하지 말아주세요. 작성된 리뷰는 검수 후 게시됩니다.
      </div>

      {/* 제출 */}
      <div style={{ display: "flex", gap: 10 }}>
        <Button variant="outlined-sub" size="lg" style={{ flex: 1 }} onClick={onClose}>
          취소
        </Button>
        <Button
          variant="solid"
          size="lg"
          style={{ flex: 2, opacity: isValid ? 1 : 0.4 }}
          onClick={handleSubmit}
        >
          리뷰 등록하기
        </Button>
      </div>
    </div>
  );
}
