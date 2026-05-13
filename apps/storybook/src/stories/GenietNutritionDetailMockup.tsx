/**
 * [GENIET-NUTRITION-DETAIL] 지니어트 식품 영양 백과 상세 페이지 목업
 *
 * DS 컴포넌트: Button, Card, Badge, Chip, Tabs, ProgressBar, Avatar, Divider, Breadcrumb
 * Layout: MockupLayout (AppBar + AppFooter) — from mockup-layout
 * Missing (임시 구현): StarRating, NutrientBar, ComparisonChart
 *
 * SEO 전략:
 * - 식품별 개별 URL → 수만 개 랜딩 페이지 자동 생성
 * - 구조화 데이터 (영양 정보, 리뷰, 레시피) → 리치 스니펫
 * - 내부 링크 (관련 식품, 레시피, 헬시딜) → 크롤링 깊이 확보
 * - 롱테일 키워드 (아보카도 칼로리, 아보카도 효능 등) → 검색 유입
 *
 * 체류시간 전략:
 * - 영양소 시각화 → 탐색 유도
 * - 식품 비교 차트 → 인터랙션
 * - 관련 레시피·헬시딜·리뷰 → 서비스 순환
 * - FAQ → 정보성 콘텐츠 소비
 * - 유사 식품 추천 → 추가 페이지 탐색
 */
import React, { useState } from "react";
import {
  Button,
  Card,
  Badge,
  Chip,
  Tabs,
  ProgressBar,
  Avatar,
  Divider,
  Breadcrumb,
} from "@nudge-eap/react";
import { StarIcon } from "@nudge-eap/icons";
import { MockupLayout, useIsMobile, Accordion } from "./mockup-layout";
import {
  currentFood,
  comparisonFoods,
  relatedRecipes,
  healthyDeals,
  foodReviews,
  similarFoods,
  nutritionFaqs,
  relatedSearchTags,
  seasonalInfo,
  trendingFoods,
} from "./geniet-nutrition-mock-data";

/* ────────────────────────────────────────────
 * 지니어트 브랜드 컬러 상수
 * ──────────────────────────────────────────── */
const G = {
  teal: "#48C2C5",
  tealHover: "#00A8AC",
  tealBg: "#E4F6F7",
  tealBgLight: "#F0FAFA",
  black: "#111111",
  subtle: "#666666",
  muted: "#999999",
  border: "#ECECEC",
  bgCool: "#F5F5F5",
  white: "#FFFFFF",
  error: "#FF3258",
  success: "#55D695",
  star: "#FFB800",
} as const;

/* ────────────────────────────────────────────
 * [Missing] StarRating — 별점 표시
 * ──────────────────────────────────────────── */
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon
          key={i}
          size={size}
          color={
            i <= Math.round(rating)
              ? "var(--semantic-icon-status-caution)"
              : "var(--semantic-icon-disabled-default)"
          }
        />
      ))}
      <span style={{ marginLeft: 4, fontSize: size - 2, color: G.subtle, fontWeight: 600 }}>
        {rating}
      </span>
    </span>
  );
}

/* ────────────────────────────────────────────
 * [Missing] NutrientBar — 영양소 바 (일일 권장량 대비)
 * ──────────────────────────────────────────── */
function NutrientBar({
  name,
  amount,
  unit,
  percent,
}: {
  name: string;
  amount: string;
  unit: string;
  percent: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
      <span style={{ width: 80, fontSize: 14, color: G.black, fontWeight: 500, flexShrink: 0 }}>
        {name}
      </span>
      <div style={{ flex: 1 }}>
        <ProgressBar
          value={percent}
          max={100}
          size="sm"
          color={percent > 20 ? G.teal : undefined}
        />
      </div>
      <span style={{ width: 70, fontSize: 13, color: G.subtle, textAlign: "right", flexShrink: 0 }}>
        {amount}
        {unit}
      </span>
      <span style={{ width: 40, fontSize: 12, color: G.muted, textAlign: "right", flexShrink: 0 }}>
        {percent}%
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────
 * 가격 포맷
 * ──────────────────────────────────────────── */
function formatPrice(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

/* ════════════════════════════════════════════
 * 메인 컴포넌트
 * ════════════════════════════════════════════ */
export default function GenietNutritionDetailMockup() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("nutrition");
  const [expandedNutrients, setExpandedNutrients] = useState(false);
  const maxW = isMobile ? "100%" : 1080;
  const px = isMobile ? 16 : 0;

  const Section = ({
    children,
    bg,
    noPadding,
  }: {
    children: React.ReactNode;
    bg?: string;
    noPadding?: boolean;
  }) => (
    <section
      style={{ background: bg || G.white, padding: noPadding ? 0 : `${isMobile ? 24 : 40}px 0` }}
    >
      <div style={{ maxWidth: maxW, margin: "0 auto", padding: `0 ${px}px` }}>{children}</div>
    </section>
  );

  const SectionTitle = ({ children, sub }: { children: React.ReactNode; sub?: string }) => (
    <div style={{ marginBottom: isMobile ? 16 : 24 }}>
      <h2 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: G.black, margin: 0 }}>
        {children}
      </h2>
      {sub && <p style={{ fontSize: 14, color: G.subtle, marginTop: 4 }}>{sub}</p>}
    </div>
  );

  const food = currentFood;
  const displayedNutrients = expandedNutrients ? food.nutrients : food.nutrients.slice(0, 5);

  return (
    <MockupLayout brand="geniet" activeGnbKey="review">
      {/* ═══ 1. 브레드크럼 ═══ */}
      <Section noPadding>
        <div style={{ padding: `${isMobile ? 12 : 16}px 0` }}>
          <Breadcrumb
            items={[
              { label: "식품 영양 백과", href: "/nutrition" },
              { label: food.category, href: `/nutrition?category=${food.category}` },
              { label: food.name },
            ]}
          />
        </div>
      </Section>

      {/* ═══ 2. 히어로 — 식품 기본 정보 ═══ */}
      <Section>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 20 : 40,
            alignItems: isMobile ? "center" : "flex-start",
          }}
        >
          {/* 식품 이미지 (이모지 placeholder) */}
          <div
            style={{
              width: isMobile ? 180 : 240,
              height: isMobile ? 180 : 240,
              borderRadius: 24,
              background: G.tealBgLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? 80 : 120,
              flexShrink: 0,
            }}
          >
            {food.imageEmoji}
          </div>

          {/* 텍스트 정보 */}
          <div style={{ flex: 1, width: "100%", textAlign: isMobile ? "center" : "left" }}>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 8,
                justifyContent: isMobile ? "center" : "flex-start",
              }}
            >
              <Badge variant="ghost" color="brand">
                {food.category}
              </Badge>
              <Badge variant="ghost" color="success">
                슈퍼푸드
              </Badge>
            </div>

            <h1
              style={{
                fontSize: isMobile ? 28 : 36,
                fontWeight: 700,
                color: G.black,
                margin: "0 0 4px",
              }}
            >
              {food.name}
            </h1>
            <p style={{ fontSize: 15, color: G.muted, margin: "0 0 12px" }}>{food.nameEn}</p>

            <StarRating rating={food.rating} size={18} />
            <span style={{ marginLeft: 8, fontSize: 14, color: G.subtle }}>
              리뷰 {food.reviewCount.toLocaleString()}개
            </span>

            <p
              style={{
                fontSize: 15,
                color: G.subtle,
                lineHeight: 1.7,
                marginTop: 16,
                textAlign: isMobile ? "center" : "left",
              }}
            >
              {food.description}
            </p>

            {/* 칼로리 하이라이트 */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: 6,
                marginTop: 16,
                padding: "12px 20px",
                borderRadius: 12,
                background: G.tealBg,
              }}
            >
              <span style={{ fontSize: isMobile ? 32 : 40, fontWeight: 700, color: G.teal }}>
                {food.calories}
              </span>
              <span style={{ fontSize: 16, color: G.tealHover, fontWeight: 500 }}>kcal</span>
              <span style={{ fontSize: 13, color: G.subtle, marginLeft: 4 }}>
                / {food.servingSize}
              </span>
            </div>

            {/* 제철 정보 */}
            <div style={{ marginTop: 12, fontSize: 13, color: G.subtle }}>
              🗓️ 제철: {seasonalInfo.season} · {seasonalInfo.description}
            </div>

            {/* 태그 */}
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginTop: 16,
                justifyContent: isMobile ? "center" : "flex-start",
              }}
            >
              {food.tags.map((tag) => (
                <Chip key={tag} label={tag} variant="ghost" color="brand" size="sm" />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Divider />

      {/* ═══ 3. 탭 영역 — 영양정보 / 효능·주의 / 비교 ═══ */}
      <Section noPadding>
        <Tabs
          items={[
            { key: "nutrition", title: "영양 정보" },
            { key: "benefits", title: "효능 · 주의사항" },
            { key: "comparison", title: "식품 비교" },
          ]}
          activeKey={activeTab}
          onTabChange={setActiveTab}
          variant="line"
          size={isMobile ? "mobile" : "pc"}
          fullWidth={isMobile}
        />
      </Section>

      {/* ── 3a. 영양 정보 탭 ── */}
      {activeTab === "nutrition" && (
        <Section>
          <SectionTitle sub={`${food.servingSize} 기준 · 일일 권장 섭취량 대비 (%)`}>
            영양 성분표
          </SectionTitle>
          <div
            style={{
              background: G.bgCool,
              borderRadius: 16,
              padding: isMobile ? 16 : 24,
            }}
          >
            {displayedNutrients.map((n) => (
              <NutrientBar
                key={n.name}
                name={n.name}
                amount={n.amount}
                unit={n.unit}
                percent={n.dailyPercent}
              />
            ))}
            {food.nutrients.length > 5 && (
              <Button
                variant="soft"
                size="sm"
                onClick={() => setExpandedNutrients(!expandedNutrients)}
                style={{ marginTop: 8 }}
              >
                {expandedNutrients ? "접기" : `영양소 ${food.nutrients.length - 5}개 더 보기`}
              </Button>
            )}
          </div>
        </Section>
      )}

      {/* ── 3b. 효능 · 주의사항 탭 ── */}
      {activeTab === "benefits" && (
        <Section>
          <SectionTitle>건강 효능</SectionTitle>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginBottom: isMobile ? 32 : 40,
            }}
          >
            {food.benefits.map((b, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: G.tealBgLight,
                }}
              >
                <span style={{ color: G.teal, fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 14, color: G.black, lineHeight: 1.6 }}>{b}</span>
              </div>
            ))}
          </div>

          <SectionTitle>섭취 주의사항</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {food.cautions.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: 12,
                  background: "#FFF5F5",
                }}
              >
                <span style={{ color: G.error, fontWeight: 700, flexShrink: 0 }}>!</span>
                <span style={{ fontSize: 14, color: G.black, lineHeight: 1.6 }}>{c}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── 3c. 식품 비교 탭 ── */}
      {activeTab === "comparison" && (
        <Section>
          <SectionTitle sub="100g 기준 영양소 비교">비슷한 과일과 비교</SectionTitle>
          {/* 비교 테이블 — 데스크탑 */}
          {!isMobile ? (
            <div style={{ borderRadius: 12, border: `1px solid ${G.border}`, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: G.bgCool }}>
                    <th
                      style={{
                        padding: "14px 16px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: G.black,
                      }}
                    >
                      식품
                    </th>
                    <th
                      style={{
                        padding: "14px 16px",
                        textAlign: "right",
                        fontWeight: 600,
                        color: G.black,
                      }}
                    >
                      칼로리
                    </th>
                    <th
                      style={{
                        padding: "14px 16px",
                        textAlign: "right",
                        fontWeight: 600,
                        color: G.black,
                      }}
                    >
                      지방
                    </th>
                    <th
                      style={{
                        padding: "14px 16px",
                        textAlign: "right",
                        fontWeight: 600,
                        color: G.black,
                      }}
                    >
                      단백질
                    </th>
                    <th
                      style={{
                        padding: "14px 16px",
                        textAlign: "right",
                        fontWeight: 600,
                        color: G.black,
                      }}
                    >
                      식이섬유
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFoods.map((f, i) => (
                    <tr
                      key={f.name}
                      style={{
                        background: i === 0 ? G.tealBgLight : G.white,
                        borderTop: `1px solid ${G.border}`,
                      }}
                    >
                      <td
                        style={{
                          padding: "14px 16px",
                          fontWeight: i === 0 ? 700 : 400,
                          color: G.black,
                        }}
                      >
                        {f.emoji} {f.name}
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right", color: G.subtle }}>
                        {f.calories}kcal
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right", color: G.subtle }}>
                        {f.fat}g
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right", color: G.subtle }}>
                        {f.protein}g
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right", color: G.subtle }}>
                        {f.fiber}g
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* 비교 카드 — 모바일 */
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {comparisonFoods.map((f, i) => (
                <div
                  key={f.name}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: i === 0 ? G.tealBgLight : G.bgCool,
                    border: i === 0 ? `2px solid ${G.teal}` : "none",
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
                    <span style={{ fontSize: 16, fontWeight: i === 0 ? 700 : 500 }}>
                      {f.emoji} {f.name}
                    </span>
                    <span style={{ fontSize: 14, color: G.teal, fontWeight: 700 }}>
                      {f.calories}kcal
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 13, color: G.subtle }}>
                    <span>지방 {f.fat}g</span>
                    <span>단백질 {f.protein}g</span>
                    <span>식이섬유 {f.fiber}g</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      <Divider />

      {/* ═══ 4. 관련 레시피 ═══ */}
      <Section bg={G.bgCool}>
        <SectionTitle sub={`${food.name}로 만들 수 있는 건강 레시피`}>🍳 관련 레시피</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? 12 : 16,
          }}
        >
          {relatedRecipes.slice(0, isMobile ? 3 : 6).map((recipe) => (
            <Card
              key={recipe.id}
              variant="elevated"
              clickable
              thumbnail={
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: G.tealBgLight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isMobile ? 40 : 48,
                  }}
                >
                  {recipe.imageEmoji}
                </div>
              }
              thumbnailRatio={isMobile ? "5/3" : "4/3"}
              title={recipe.title}
              subtitle={`${recipe.calories}kcal · ${recipe.cookTime}`}
              meta={
                <Badge
                  variant="ghost"
                  color={recipe.difficulty === "쉬움" ? "success" : "neutral"}
                  size="sm"
                >
                  {recipe.difficulty}
                </Badge>
              }
              footer={
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <StarRating rating={recipe.rating} size={12} />
                  <span style={{ fontSize: 12, color: G.muted }}>({recipe.reviewCount})</span>
                </div>
              }
              footerNoBorder
            />
          ))}
        </div>
        {isMobile && (
          <Button
            variant="outlined"
            fullWidth
            style={{ marginTop: 16, borderColor: G.teal, color: G.teal }}
          >
            레시피 {relatedRecipes.length}개 모두 보기
          </Button>
        )}
      </Section>

      {/* ═══ 5. 헬시딜 연동 ═══ */}
      <Section>
        <SectionTitle sub={`${food.name} 관련 특가 상품`}>🛒 헬시딜</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: isMobile ? 12 : 16,
          }}
        >
          {healthyDeals.map((deal) => (
            <Card
              key={deal.id}
              variant="outlined"
              clickable
              thumbnail={
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: G.bgCool,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isMobile ? 36 : 48,
                    position: "relative",
                  }}
                >
                  {deal.imageEmoji}
                  {deal.badge && (
                    <div style={{ position: "absolute", top: 8, left: 8 }}>
                      <Badge variant="fill" color="brand" size="sm">
                        {deal.badge}
                      </Badge>
                    </div>
                  )}
                </div>
              }
              thumbnailRatio="1/1"
              title={deal.title}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: G.error }}>
                  {deal.discountPercent}%
                </span>
                <span style={{ fontSize: 16, fontWeight: 700, color: G.black }}>
                  {formatPrice(deal.salePrice)}
                </span>
              </div>
              <span style={{ fontSize: 12, color: G.muted, textDecoration: "line-through" }}>
                {formatPrice(deal.originalPrice)}
              </span>
              <div style={{ marginTop: 6 }}>
                <StarRating rating={deal.rating} size={11} />
                <span style={{ fontSize: 11, color: G.muted, marginLeft: 2 }}>
                  ({deal.reviewCount})
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Divider />

      {/* ═══ 6. 사용자 리뷰 ═══ */}
      <Section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: isMobile ? 16 : 24,
          }}
        >
          <SectionTitle sub={`${food.reviewCount.toLocaleString()}개의 리뷰`}>💬 리뷰</SectionTitle>
          <Button variant="outlined" size="sm" style={{ borderColor: G.teal, color: G.teal }}>
            리뷰 작성
          </Button>
        </div>

        {/* 리뷰 요약 */}
        <div
          style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 12 : 32,
            padding: isMobile ? 16 : 24,
            borderRadius: 16,
            background: G.tealBgLight,
            marginBottom: isMobile ? 20 : 24,
          }}
        >
          <div style={{ textAlign: isMobile ? "left" : "center" }}>
            <div style={{ fontSize: isMobile ? 36 : 48, fontWeight: 700, color: G.teal }}>
              {food.rating}
            </div>
            <StarRating rating={food.rating} size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["콜레스테롤 관리", "키토 식단", "이유식", "건강한 지방", "전문가 추천"].map(
                (tag) => (
                  <Chip key={tag} label={tag} variant="ghost" color="brand" size="sm" />
                ),
              )}
            </div>
            <p style={{ fontSize: 13, color: G.subtle, marginTop: 8, margin: "8px 0 0" }}>
              가장 많이 언급된 키워드
            </p>
          </div>
        </div>

        {/* 리뷰 목록 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {foodReviews.slice(0, 3).map((review) => (
            <Card key={review.id} variant="outlined">
              <Card.Header>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar name={review.userName} size="sm" />
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: G.black }}>
                      {review.userName}
                    </span>
                    <div style={{ marginTop: 2 }}>
                      <StarRating rating={review.rating} size={12} />
                    </div>
                  </div>
                </div>
                <Card.Meta>
                  <span style={{ fontSize: 12, color: G.muted }}>{review.date}</span>
                </Card.Meta>
              </Card.Header>
              <Card.Body>
                <p style={{ fontSize: 14, color: G.subtle, lineHeight: 1.7, margin: 0 }}>
                  {review.content}
                </p>
              </Card.Body>
              <Card.Footer noBorder>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={{ display: "flex", gap: 6 }}>
                    {review.tags.map((tag) => (
                      <Chip key={tag} label={tag} variant="outlined" color="brand" size="sm" />
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: G.muted }}>
                    👍 {review.helpful}명에게 도움됨
                  </span>
                </div>
              </Card.Footer>
            </Card>
          ))}
        </div>
        <Button variant="soft" fullWidth style={{ marginTop: 12 }}>
          리뷰 {food.reviewCount.toLocaleString()}개 모두 보기
        </Button>
      </Section>

      <Divider />

      {/* ═══ 7. 유사 식품 추천 (SEO 내부 링크 + 체류시간) ═══ */}
      <Section bg={G.bgCool}>
        <SectionTitle sub="비슷한 영양 프로필을 가진 식품">🔄 이런 식품도 살펴보세요</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            gap: isMobile ? 12 : 16,
          }}
        >
          {similarFoods.map((sf) => (
            <Card
              key={sf.id}
              variant="elevated"
              clickable
              thumbnail={
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isMobile ? 36 : 48,
                  }}
                >
                  {sf.imageEmoji}
                </div>
              }
              thumbnailRatio="1/1"
              title={sf.name}
              meta={
                <Badge variant="ghost" color="neutral" size="sm">
                  {sf.category}
                </Badge>
              }
            >
              <span style={{ fontSize: 13, color: G.subtle }}>
                {sf.calories}kcal · {sf.mainNutrient} {sf.mainNutrientAmount}
              </span>
            </Card>
          ))}
        </div>
      </Section>

      {/* ═══ 8. FAQ (SEO 구조화 데이터) ═══ */}
      <Section>
        <SectionTitle sub="자주 묻는 질문">❓ FAQ</SectionTitle>
        <Accordion items={nutritionFaqs} />
      </Section>

      {/* ═══ 9. 인기 검색 식품 (사이드 콘텐츠 → 체류시간) ═══ */}
      <Section bg={G.tealBgLight}>
        <SectionTitle sub="지금 가장 많이 찾아보는 식품">🔥 인기 검색 식품</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: isMobile ? 8 : 12,
          }}
        >
          {trendingFoods.map((tf, i) => (
            <Card key={tf.name} variant="outlined" clickable>
              <Card.Body>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: G.teal,
                      width: 20,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{tf.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: G.black }}>{tf.name}</div>
                    <div style={{ fontSize: 11, color: G.muted }}>{tf.calories}kcal</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Section>

      {/* ═══ 10. 관련 검색 태그 (SEO 내부 링크 허브) ═══ */}
      <Section>
        <SectionTitle sub="관련 검색어로 더 많은 영양 정보를 찾아보세요">🔍 관련 검색</SectionTitle>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {relatedSearchTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              variant="outlined"
              color="brand"
              size="md"
              onClick={() => {}}
            />
          ))}
        </div>
      </Section>
    </MockupLayout>
  );
}
