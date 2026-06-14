/**
 * [GENIET-NUTRITION-DETAIL] 지니어트 식품 영양 백과 상세 페이지 목업
 *
 * DS 컴포넌트: Button, Card, Badge, Chip, Tab, ProgressBar, Avatar, Divider, Breadcrumb,
 *              StarRating, DataTable
 * Layout: MockupLayout (AppBar + AppFooter) — from mockup-layout
 * Inline SVG: ChefHatIcon, CartIcon, HelpIcon, FlameIcon, CheckMarkIcon — DS 아이콘에 없어 신규 생성
 * Missing (임시 구현): NutrientBar
 */
import React, { useState } from "react";
import {
  Button,
  Card,
  Badge,
  Chip,
  Tab,
  ProgressBar,
  Avatar,
  Divider,
  Breadcrumb,
  StarRating,
  DataTable,
} from "@nudge-design/react";
import {
  CalendarIcon,
  CommentIcon,
  RefreshIcon,
  SearchIcon,
  ThumbUpIcon,
} from "@nudge-design/icons";
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
 * 인라인 SVG 아이콘 — @nudge-design/icons 에 없어 신규 생성.
 * currentColor 기반이라 부모 color 또는 color prop으로 톤 제어 가능.
 * ──────────────────────────────────────────── */
type SvgIconProps = { size?: number; color?: string };

const SvgWrap = ({
  size = 20,
  color = "currentColor",
  children,
}: SvgIconProps & { children: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    style={{ color, flexShrink: 0 }}
  >
    {children}
  </svg>
);

const ChefHatIcon = (p: SvgIconProps) => (
  <SvgWrap {...p}>
    <path
      d="M7 11.5c-2.2 0-4-1.8-4-4 0-1.9 1.4-3.5 3.2-3.9C7 2.6 8.4 2 10 2c1.4 0 2.6.5 3.5 1.3C14.3 2.5 15.4 2 16.7 2c2.4 0 4.3 1.9 4.3 4.3 0 2-1.4 3.7-3.3 4.1V19a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-7.5Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M9 15h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </SvgWrap>
);

const CartIcon = (p: SvgIconProps) => (
  <SvgWrap {...p}>
    <path
      d="M3 4h2.2l2 11.2A2 2 0 0 0 9.2 17h8.4a2 2 0 0 0 2-1.6L21 8H7"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9.5" cy="20" r="1.5" fill="currentColor" />
    <circle cx="17" cy="20" r="1.5" fill="currentColor" />
  </SvgWrap>
);

const HelpIcon = (p: SvgIconProps) => (
  <SvgWrap {...p}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M9.5 9.2a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4V14"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </SvgWrap>
);

const FlameIcon = (p: SvgIconProps) => (
  <SvgWrap {...p}>
    <path
      d="M12 3c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.5.7-2.5 1.5-3.5C10.4 6.2 11 4.6 12 3Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M12 11c.4 1 1.5 1.7 1.5 3a1.5 1.5 0 0 1-3 0c0-.8.4-1.3.9-1.8.3-.3.5-.7.6-1.2Z"
      fill="currentColor"
    />
  </SvgWrap>
);

const CheckMarkIcon = (p: SvgIconProps) => (
  <SvgWrap {...p}>
    <path
      d="M5 12.5 10 17.5 19 7.5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgWrap>
);

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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--semantic-gap-comfortable)",
        padding: "8px 0",
      }}
    >
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
      <h2
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--semantic-gap-default)",
          fontSize: isMobile ? 20 : 24,
          fontWeight: 700,
          color: G.black,
          margin: 0,
        }}
      >
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
            {food.imageInitial}
          </div>

          {/* 텍스트 정보 */}
          <div style={{ flex: 1, width: "100%", textAlign: isMobile ? "center" : "left" }}>
            <div
              style={{
                display: "flex",
                gap: "var(--semantic-gap-default)",
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

            <StarRating value={food.rating} size={18} showValue />
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
                padding: "var(--semantic-inset-input) var(--semantic-inset-card-large)",
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
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 12,
                fontSize: 13,
                color: G.subtle,
              }}
            >
              <CalendarIcon size={16} color={G.subtle} />
              제철: {seasonalInfo.season} · {seasonalInfo.description}
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
        <Tab
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
              gap: "var(--semantic-gap-comfortable)",
              marginBottom: isMobile ? 32 : 40,
            }}
          >
            {food.benefits.map((b, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "var(--semantic-gap-comfortable)",
                  padding: "14px var(--semantic-inset-card)",
                  borderRadius: 12,
                  background: G.tealBgLight,
                }}
              >
                <CheckMarkIcon size={20} color={G.teal} />
                <span style={{ fontSize: 14, color: G.black, lineHeight: 1.6 }}>{b}</span>
              </div>
            ))}
          </div>

          <SectionTitle>섭취 주의사항</SectionTitle>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--semantic-gap-comfortable)",
            }}
          >
            {food.cautions.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "var(--semantic-gap-comfortable)",
                  padding: "14px var(--semantic-inset-card)",
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
          <DataTable
            data={comparisonFoods}
            rowKey={(f) => f.name}
            size="md"
            responsive="cards"
            columns={[
              {
                key: "name",
                title: "식품",
                render: (f, idx) => (
                  <span style={{ fontWeight: idx === 0 ? 700 : 400, color: G.black }}>
                    {f.name}
                    {idx === 0 && (
                      <Badge variant="ghost" color="brand" size="sm" style={{ marginLeft: 8 }}>
                        현재
                      </Badge>
                    )}
                  </span>
                ),
              },
              {
                key: "calories",
                title: "칼로리",
                align: "right",
                render: (f) => `${f.calories}kcal`,
              },
              { key: "fat", title: "지방", align: "right", render: (f) => `${f.fat}g` },
              { key: "protein", title: "단백질", align: "right", render: (f) => `${f.protein}g` },
              { key: "fiber", title: "식이섬유", align: "right", render: (f) => `${f.fiber}g` },
            ]}
          />
        </Section>
      )}

      <Divider />

      {/* ═══ 4. 관련 레시피 ═══ */}
      <Section bg={G.bgCool}>
        <SectionTitle sub={`${food.name}로 만들 수 있는 건강 레시피`}>
          <ChefHatIcon size={24} color={G.teal} /> 관련 레시피
        </SectionTitle>
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
              variant="outlined"
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
                  {recipe.imageInitial}
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--semantic-gap-tight)",
                  }}
                >
                  <StarRating value={recipe.rating} size={12} showValue />
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
        <SectionTitle sub={`${food.name} 관련 특가 상품`}>
          <CartIcon size={24} color={G.teal} /> 헬시딜
        </SectionTitle>
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
                  {deal.imageInitial}
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
                <StarRating value={deal.rating} size={11} showValue />
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
          <SectionTitle sub={`${food.reviewCount.toLocaleString()}개의 리뷰`}>
            <CommentIcon size={24} color={G.teal} /> 리뷰
          </SectionTitle>
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
            <StarRating value={food.rating} size={20} showValue />
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
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--semantic-gap-loose)" }}>
          {foodReviews.slice(0, 3).map((review) => (
            <Card key={review.id} variant="outlined">
              <Card.Header>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--semantic-gap-default)",
                  }}
                >
                  <Avatar name={review.userName} size="sm" />
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: G.black }}>
                      {review.userName}
                    </span>
                    <div style={{ marginTop: 2 }}>
                      <StarRating value={review.rating} size={12} showValue />
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
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "var(--semantic-gap-tight)",
                      fontSize: 12,
                      color: G.muted,
                    }}
                  >
                    <ThumbUpIcon size={14} color={G.muted} />
                    {review.helpful}명에게 도움됨
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
        <SectionTitle sub="비슷한 영양 프로필을 가진 식품">
          <RefreshIcon size={24} color={G.teal} /> 이런 식품도 살펴보세요
        </SectionTitle>
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
              variant="outlined"
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
                  {sf.imageInitial}
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
        <SectionTitle sub="자주 묻는 질문">
          <HelpIcon size={24} color={G.teal} /> FAQ
        </SectionTitle>
        <Accordion items={nutritionFaqs} />
      </Section>

      {/* ═══ 9. 인기 검색 식품 (사이드 콘텐츠 → 체류시간) ═══ */}
      <Section bg={G.tealBgLight}>
        <SectionTitle sub="지금 가장 많이 찾아보는 식품">
          <FlameIcon size={24} color={G.error} /> 인기 검색 식품
        </SectionTitle>
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--semantic-gap-comfortable)",
                  }}
                >
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
        <SectionTitle sub="관련 검색어로 더 많은 영양 정보를 찾아보세요">
          <SearchIcon size={24} color={G.teal} /> 관련 검색
        </SectionTitle>
        <div style={{ display: "flex", gap: "var(--semantic-gap-default)", flexWrap: "wrap" }}>
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
