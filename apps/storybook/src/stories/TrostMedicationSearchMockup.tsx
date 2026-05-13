/**
 * [TROST-MEDICATION-SEARCH] 트로스트 복용약 찾기 페이지 목업
 *
 * DS 컴포넌트: SearchInput, Button, Card, Badge, Chip, Pagination
 * Layout: MockupLayout (AppBar + AppFooter + StickyBottomBar), Accordion — from mockup-layout
 * Missing (임시 구현): PillImage, ShapeIcon, SearchTabs
 */
import React, { useState, useMemo } from "react";
import { SearchInput, Button, Card, Badge, Chip, Pagination, Select } from "@nudge-eap/react";
import { MockupLayout, useIsMobile, Accordion } from "./mockup-layout";
import {
  medications,
  categories,
  popularSearches,
  symptoms,
  pillShapes,
  pillColors,
  faqs,
  relatedTags,
  cautionGuides,
  type Medication,
  type MedicationCategory,
  type CautionLevel,
  type PillShape,
  type PillColor,
} from "./trost-medication-mock-data";

/* ────────────────────────────────────────────
 * 트로스트 브랜드 컬러 상수
 * ──────────────────────────────────────────── */
const T = {
  yellow: "#FFF42E",
  yellowHover: "#FFE600",
  black: "#333333",
  subtle: "#606060",
  border: "#E5E5E5",
  bgCool: "#F4F5F7",
  cobalt: "#4968FF",
  white: "#FFFFFF",
} as const;

/* ────────────────────────────────────────────
 * Missing DS 컴포넌트 — 트로스트 스타일 임시 구현
 * ──────────────────────────────────────────── */

/** [Missing] PillImage — 약 외형 SVG 렌더러 */
function PillImage({
  shape,
  color,
  imprint,
  size = 80,
}: {
  shape: PillShape;
  color: PillColor;
  imprint?: string;
  size?: number;
}) {
  const colorMap: Record<PillColor, string> = {
    흰색: "#F0F0F0",
    노란색: "#FFD54F",
    분홍색: "#F48FB1",
    파란색: "#64B5F6",
    초록색: "#81C784",
    주황색: "#FFB74D",
    빨간색: "#E57373",
  };
  const fill = colorMap[color];
  const stroke = color === "흰색" ? "#D5D5D5" : fill;

  const shapeEl: Record<PillShape, React.ReactNode> = {
    원형: <circle cx="40" cy="40" r="32" fill={fill} stroke={stroke} strokeWidth="1.5" />,
    타원형: (
      <ellipse cx="40" cy="40" rx="36" ry="26" fill={fill} stroke={stroke} strokeWidth="1.5" />
    ),
    캡슐: (
      <>
        <rect
          x="6"
          y="22"
          width="68"
          height="36"
          rx="18"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.5"
        />
        <line x1="40" y1="22" x2="40" y2="58" stroke={stroke} strokeWidth="1" opacity="0.4" />
      </>
    ),
    장방형: (
      <rect
        x="6"
        y="24"
        width="68"
        height="32"
        rx="6"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
    ),
    삼각형: <polygon points="40,10 72,66 8,66" fill={fill} stroke={stroke} strokeWidth="1.5" />,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ flexShrink: 0 }}>
      <rect width="80" height="80" rx="12" fill={T.bgCool} />
      {shapeEl[shape]}
      {imprint && (
        <text
          x="40"
          y="44"
          textAnchor="middle"
          fontSize="8"
          fontWeight="600"
          fill={color === "흰색" ? "#999" : "#fff"}
          style={{ pointerEvents: "none" }}
        >
          {imprint}
        </text>
      )}
    </svg>
  );
}

/** [Missing] ShapeIcon — 약 모양 아이콘 (식약처 스타일) */
function ShapeIcon({
  shape,
  active,
  size = 36,
}: {
  shape: PillShape;
  active: boolean;
  size?: number;
}) {
  const color = active ? T.black : "#C0C0C0";
  const stroke = active ? T.black : "#BABABA";
  const icons: Record<PillShape, React.ReactNode> = {
    원형: (
      <circle
        cx="20"
        cy="20"
        r="14"
        fill={color}
        opacity={active ? 0.15 : 0.08}
        stroke={stroke}
        strokeWidth="1.5"
      />
    ),
    타원형: (
      <ellipse
        cx="20"
        cy="20"
        rx="17"
        ry="11"
        fill={color}
        opacity={active ? 0.15 : 0.08}
        stroke={stroke}
        strokeWidth="1.5"
      />
    ),
    캡슐: (
      <g>
        <rect
          x="3"
          y="12"
          rx="8"
          width="34"
          height="16"
          fill={color}
          opacity={active ? 0.15 : 0.08}
          stroke={stroke}
          strokeWidth="1.5"
        />
        <line
          x1="20"
          y1="12"
          x2="20"
          y2="28"
          stroke={stroke}
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      </g>
    ),
    장방형: (
      <rect
        x="4"
        y="13"
        rx="4"
        width="32"
        height="14"
        fill={color}
        opacity={active ? 0.15 : 0.08}
        stroke={stroke}
        strokeWidth="1.5"
      />
    ),
    삼각형: (
      <polygon
        points="20,6 35,34 5,34"
        fill={color}
        opacity={active ? 0.15 : 0.08}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      {icons[shape]}
    </svg>
  );
}

/* ────────────────────────────────────────────
 * 유틸
 * ──────────────────────────────────────────── */

const cautionBadgeColor: Record<CautionLevel, "success" | "caution" | "error"> = {
  낮음: "success",
  보통: "caution",
  높음: "error",
};

function formatUserCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만명`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}천명`;
  return `${n}명`;
}

/* ────────────────────────────────────────────
 * 검색 모드
 * ──────────────────────────────────────────── */

type SearchMode = "name" | "symptom" | "shape";

const searchModes: { key: SearchMode; label: string; icon: string }[] = [
  { key: "name", label: "약 이름", icon: "💊" },
  { key: "symptom", label: "증상으로 찾기", icon: "🩺" },
  { key: "shape", label: "약 모양으로 찾기", icon: "🔍" },
];

/* ════════════════════════════════════════════
 * 메인 목업 컴포넌트
 * ════════════════════════════════════════════ */
export default function TrostMedicationSearchMockup() {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("name");
  const [selectedCategory, setSelectedCategory] = useState<"전체" | MedicationCategory>("전체");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedShape, setSelectedShape] = useState<PillShape | null>(null);
  const [selectedColor, setSelectedColor] = useState<PillColor | null>(null);
  const [sortBy, setSortBy] = useState<"popular" | "name" | "caution">("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const toggleSymptom = (key: string) =>
    setSelectedSymptoms((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    );

  const filteredMedications = useMemo(() => {
    setCurrentPage(1); // 필터 변경 시 1페이지로
    return medications.filter((med) => {
      const matchesCategory = selectedCategory === "전체" || med.category === selectedCategory;

      if (searchMode === "name") {
        const matchesSearch =
          !searchQuery ||
          med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          med.category.includes(searchQuery);
        return matchesCategory && matchesSearch;
      }

      if (searchMode === "symptom") {
        const matchesSymptoms =
          selectedSymptoms.length === 0 || selectedSymptoms.some((s) => med.symptoms.includes(s));
        return matchesCategory && matchesSymptoms;
      }

      if (searchMode === "shape") {
        const matchesShape = !selectedShape || med.pill.shape === selectedShape;
        const matchesColor = !selectedColor || med.pill.color === selectedColor;
        return matchesCategory && matchesShape && matchesColor;
      }

      return matchesCategory;
    });
  }, [searchQuery, selectedCategory, searchMode, selectedSymptoms, selectedShape, selectedColor]);

  const sortedMedications = useMemo(() => {
    const list = [...filteredMedications];
    if (sortBy === "popular") list.sort((a, b) => b.userCount - a.userCount);
    else if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    else if (sortBy === "caution") {
      const order: Record<CautionLevel, number> = { 높음: 0, 보통: 1, 낮음: 2 };
      list.sort((a, b) => order[a.cautionLevel] - order[b.cautionLevel]);
    }
    return list;
  }, [filteredMedications, sortBy]);

  const totalPages = Math.ceil(sortedMedications.length / ITEMS_PER_PAGE);
  const paginatedMedications = sortedMedications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <MockupLayout
      brand="trost"
      activeGnbKey="medicine"
      onSearch={(v) => {
        setSearchMode("name");
        setSearchQuery(v);
      }}
      disclaimer="본 페이지의 약물 정보는 일반적인 참고용이며, 의학적 진단이나 처방을 대체하지 않습니다. 정확한 복용법과 주의사항은 반드시 담당 의료진과 상담하세요."
      stickyBottom={
        <Button
          variant="solid"
          size="lg"
          style={{ width: "100%" }}
          onClick={() => console.log("navigate: /counselor?specialty=medication")}
        >
          복약 상담 신청하기
        </Button>
      }
    >
      {/* ══════════════════════════════════════
         섹션 1: Hero + 검색 탭 (이름 / 증상 / 모양)
         ══════════════════════════════════════ */}
      <section
        style={{
          background: `linear-gradient(180deg, ${T.bgCool} 0%, ${T.white} 100%)`,
          padding: isMobile ? "32px 16px 28px" : "48px 16px 40px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? 22 : 28,
            fontWeight: 700,
            color: T.black,
            margin: "0 0 8px",
            lineHeight: 1.36,
          }}
        >
          복용약 검색
        </h1>
        <p
          style={{
            color: T.subtle,
            fontSize: isMobile ? 14 : 15,
            margin: "0 0 24px",
            lineHeight: 1.5,
          }}
        >
          약 이름, 증상, 약 모양으로 내가 먹는 약을 찾아보세요
        </p>

        {/* ── 검색 모드 탭 ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 0,
            background: T.bgCool,
            borderRadius: 12,
            padding: 4,
            maxWidth: 420,
            margin: "0 auto 20px",
          }}
        >
          {searchModes.map((mode) => (
            <button
              key={mode.key}
              onClick={() => setSearchMode(mode.key)}
              style={{
                flex: 1,
                padding: isMobile ? "10px 2px" : "10px 4px",
                border: "none",
                cursor: "pointer",
                borderRadius: 10,
                fontSize: isMobile ? 13 : 14,
                fontWeight: searchMode === mode.key ? 700 : 500,
                background: searchMode === mode.key ? T.white : "transparent",
                color: searchMode === mode.key ? T.black : T.subtle,
                boxShadow: searchMode === mode.key ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.2s",
                fontFamily: "inherit",
                whiteSpace: "nowrap" as const,
              }}
            >
              <span style={{ marginRight: isMobile ? 2 : 4 }}>{mode.icon}</span>
              {mode.label}
            </button>
          ))}
        </div>

        {/* ── 검색 모드별 UI (통일: 섹션라벨 + 카드셀렉터 + 초기화) ── */}
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "left" }}>
          {/* ━━ 약 이름 검색 ━━ */}
          {searchMode === "name" && (
            <>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.black, marginBottom: 12 }}>
                  약 이름 · 성분명
                </div>
                <SearchInput
                  variant="outlined"
                  placeholder="예) 렉사프로, 에스시탈로프람"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
                  onClear={() => setSearchQuery("")}
                  onSearch={() => {}}
                  slotProps={{
                    wrapper: {
                      style: {
                        minHeight: isMobile ? 48 : 52,
                        borderColor: T.yellowHover,
                        borderWidth: 2,
                        borderRadius: 12,
                        fontSize: 15,
                      } as React.CSSProperties,
                    },
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.black, marginBottom: 12 }}>
                  인기 검색어
                </div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                  {popularSearches.map((keyword) => (
                    <Chip
                      key={keyword}
                      label={keyword}
                      variant={searchQuery === keyword ? "fill" : "outlined"}
                      color="brand"
                      size="sm"
                      onClick={() => setSearchQuery(searchQuery === keyword ? "" : keyword)}
                    />
                  ))}
                </div>
              </div>
              {searchQuery && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <Button variant="outlined-sub" size="sm" onClick={() => setSearchQuery("")}>
                    선택 초기화
                  </Button>
                </div>
              )}
            </>
          )}

          {/* ━━ 증상으로 찾기 ━━ */}
          {searchMode === "symptom" && (
            <>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.black, marginBottom: 12 }}>
                  증상 (복수 선택 가능)
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "repeat(4, 1fr)" : "repeat(4, 1fr)",
                    gap: 8,
                  }}
                >
                  {symptoms.map((s) => {
                    const active = selectedSymptoms.includes(s.key);
                    return (
                      <button
                        key={s.key}
                        onClick={() => toggleSymptom(s.key)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: isMobile ? 4 : 8,
                          padding: isMobile ? "12px 4px" : "16px 12px",
                          borderRadius: 12,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          border: `1px solid ${active ? T.black : T.border}`,
                          background: active ? T.bgCool : T.white,
                          transition: "all 0.15s",
                        }}
                      >
                        <span style={{ fontSize: isMobile ? 20 : 24 }}>{s.icon}</span>
                        <span
                          style={{
                            fontSize: isMobile ? 11 : 12,
                            fontWeight: active ? 700 : 500,
                            color: active ? T.black : T.subtle,
                          }}
                        >
                          {s.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {selectedSymptoms.length > 0 && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <Button variant="outlined-sub" size="sm" onClick={() => setSelectedSymptoms([])}>
                    선택 초기화
                  </Button>
                </div>
              )}
            </>
          )}

          {/* ━━ 약 모양으로 찾기 ━━ */}
          {searchMode === "shape" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.black, marginBottom: 12 }}>
                  모양
                </div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                  {pillShapes.map((s) => {
                    const active = selectedShape === s.key;
                    return (
                      <button
                        key={s.key}
                        onClick={() => setSelectedShape(active ? null : s.key)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          padding: "16px 12px",
                          borderRadius: 12,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          border: `1px solid ${active ? T.black : T.border}`,
                          background: active ? T.bgCool : T.white,
                          transition: "all 0.15s",
                          minWidth: 80,
                          flexShrink: 0,
                        }}
                      >
                        <ShapeIcon shape={s.key} active={active} />
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: active ? 700 : 500,
                            color: active ? T.black : T.subtle,
                          }}
                        >
                          {s.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.black, marginBottom: 12 }}>
                  색상
                </div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                  {pillColors.map((c) => {
                    const active = selectedColor === c.key;
                    return (
                      <button
                        key={c.key}
                        onClick={() => setSelectedColor(active ? null : c.key)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          padding: "12px 12px",
                          borderRadius: 12,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          border: `1px solid ${active ? T.black : T.border}`,
                          background: active ? T.bgCool : T.white,
                          transition: "all 0.15s",
                          minWidth: 56,
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            background: c.hex,
                            border: c.key === "흰색" ? "1.5px solid #DDD" : "none",
                          }}
                        />
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: active ? 700 : 400,
                            color: active ? T.black : T.subtle,
                          }}
                        >
                          {c.key}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              {(selectedShape || selectedColor) && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <Button
                    variant="outlined-sub"
                    size="sm"
                    onClick={() => {
                      setSelectedShape(null);
                      setSelectedColor(null);
                    }}
                  >
                    선택 초기화
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── 섹션 2: 카테고리 필터 ── */}
      <section style={{ maxWidth: 768, margin: "0 auto", padding: "24px 16px 0" }}>
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 4,
            flexWrap: isMobile ? "nowrap" : "wrap",
          }}
        >
          {categories.map((cat) => (
            <Chip
              key={cat.key}
              label={cat.label}
              variant={selectedCategory === cat.key ? "fill" : "outlined"}
              color="brand"
              size={isMobile ? "sm" : "md"}
              onClick={() => setSelectedCategory(cat.key as "전체" | MedicationCategory)}
            />
          ))}
        </div>
      </section>

      {/* ── 섹션 3: 약물 목록 (정렬 + 페이지네이션) ── */}
      <section style={{ maxWidth: 768, margin: "0 auto", padding: "24px 16px 40px" }}>
        {/* 헤더: 결과 수 + 정렬 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 700, color: T.black, margin: 0 }}>
            {selectedCategory === "전체" ? "전체 약물" : selectedCategory}{" "}
            <span style={{ color: T.cobalt, fontWeight: 700 }}>{sortedMedications.length}</span>건
          </h2>
          <Select
            options={[
              { value: "popular", label: "인기순" },
              { value: "name", label: "이름순" },
              { value: "caution", label: "주의등급순" },
            ]}
            value={sortBy}
            onValueChange={(v) => {
              setSortBy(v as typeof sortBy);
              setCurrentPage(1);
            }}
            fullWidth={false}
          />
        </div>

        {sortedMedications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: T.subtle }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💊</div>
            <p style={{ fontSize: 16, fontWeight: 500 }}>검색 결과가 없습니다</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>다른 조건으로 검색해보세요</p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {paginatedMedications.map((med) => (
                <MedicationCard key={med.id} med={med} isMobile={isMobile} />
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}

            {/* 페이지 정보 */}
            <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: T.subtle }}>
              {sortedMedications.length}개 중 {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, sortedMedications.length)}개 표시
            </div>
          </>
        )}
      </section>

      {/* ── 섹션 4: 복용 주의사항 가이드 ── */}
      <section style={{ background: T.bgCool, padding: isMobile ? "32px 16px" : "40px 16px" }}>
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 8px" }}>
            약물 복용, 이것만은 꼭 기억하세요
          </h2>
          <p style={{ fontSize: 14, color: T.subtle, margin: "0 0 24px", lineHeight: 1.5 }}>
            정신건강 약물을 안전하게 복용하기 위해 반드시 알아두어야 할 사항입니다.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? "100%" : "220px"}, 1fr))`,
              gap: 12,
            }}
          >
            {cautionGuides.map((guide) => (
              <Card key={guide.title} variant="elevated">
                <Card.Body>
                  <div style={{ textAlign: "center", padding: "8px 0" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>{guide.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: T.black, marginBottom: 8 }}>
                      {guide.title}
                    </div>
                    <div style={{ fontSize: 14, color: T.subtle, lineHeight: 1.5 }}>
                      {guide.description}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── 섹션 5: FAQ ── */}
      <section
        style={{ maxWidth: 768, margin: "0 auto", padding: isMobile ? "32px 16px" : "40px 16px" }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 20px" }}>
          복용약 관련 자주 묻는 질문
        </h2>
        <Accordion items={faqs} />
      </section>

      {/* ── 섹션 6: 상담 연계 CTA ── */}
      <section style={{ background: T.bgCool, padding: isMobile ? "32px 16px" : "40px 16px" }}>
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 8px" }}>
            약에 대해 더 궁금한 점이 있으신가요?
          </h2>
          <p style={{ fontSize: 14, color: T.subtle, margin: "0 0 24px", lineHeight: 1.5 }}>
            복용 중인 약물에 대한 걱정, 전문가와 함께 해결하세요.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? "100%" : "280px"}, 1fr))`,
              gap: 12,
            }}
          >
            <Card
              variant="outlined"
              clickable
              onClick={() => console.log("navigate: /counselor?specialty=medication")}
            >
              <Card.Body>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: `${T.yellow}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    👩‍⚕️
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: T.black, marginBottom: 4 }}>
                      전문 상담사 찾기
                    </div>
                    <div style={{ fontSize: 14, color: T.subtle }}>
                      약물 복용 ��련 심리 상담을 받아보세요
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Card
              variant="outlined"
              clickable
              onClick={() => console.log("navigate: /counseling/medication")}
            >
              <Card.Body>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: `${T.cobalt}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    💬
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: T.black, marginBottom: 4 }}>
                      복약 고민 나누기
                    </div>
                    <div style={{ fontSize: 14, color: T.subtle }}>
                      비슷한 경험을 가진 사람들과 이야기해보세요
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </section>

      {/* ── 섹션 7: 관련 검색 태그 ── */}
      <section
        style={{ maxWidth: 768, margin: "0 auto", padding: isMobile ? "32px 16px" : "40px 16px" }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, color: T.black, margin: "0 0 16px" }}>
          이런 약물 정보도 찾고 있으신가요?
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {relatedTags.map((tag) => (
            <Chip
              key={tag.label}
              label={tag.label}
              variant="outlined"
              color="brand"
              size="md"
              onClick={() => console.log(`navigate: ${tag.url}`)}
            />
          ))}
        </div>
      </section>
    </MockupLayout>
  );
}

/* ────────────────────────────────────────────
 * MedicationCard — 이미지 포함 카드
 * ──────────────────────────────────────────── */
function MedicationCard({ med, isMobile }: { med: Medication; isMobile: boolean }) {
  return (
    <Card
      variant="outlined"
      clickable
      onClick={() => console.log(`navigate: /medication/${med.id}`)}
    >
      <Card.Body>
        <div style={{ display: "flex", gap: isMobile ? 10 : 16 }}>
          {/* 약 이미지 */}
          <PillImage
            shape={med.pill.shape}
            color={med.pill.color}
            imprint={med.pill.imprint}
            size={isMobile ? 56 : 80}
          />

          {/* 약 정보 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* 상단: 카테고리 + 주의등급 */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
              <Badge variant="ghost" color="neutral">
                {med.category}
              </Badge>
              <Badge variant="ghost" color={cautionBadgeColor[med.cautionLevel]}>
                주의 {med.cautionLevel}
              </Badge>
            </div>

            {/* 약명 + 성분명 */}
            <div
              style={{
                fontWeight: 700,
                fontSize: isMobile ? 15 : 16,
                color: T.black,
                lineHeight: 1.3,
              }}
            >
              {med.name}
            </div>
            <div
              style={{
                fontSize: isMobile ? 12 : 13,
                color: T.cobalt,
                fontWeight: 500,
                margin: "2px 0",
              }}
            >
              {med.genericName}
            </div>

            {/* 설명 — 모바일에서 1줄 */}
            {!isMobile && (
              <>
                <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
                  {med.manufacturer}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: T.subtle,
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }}
                >
                  {med.description}
                </div>
              </>
            )}

            {/* 부작용 태그 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: isMobile ? 6 : 8 }}>
              {med.sideEffects.slice(0, isMobile ? 2 : 3).map((se) => (
                <span
                  key={se}
                  style={{
                    fontSize: isMobile ? 10 : 11,
                    color: T.subtle,
                    background: T.bgCool,
                    padding: "2px 6px",
                    borderRadius: 4,
                  }}
                >
                  {se}
                </span>
              ))}
              {med.sideEffects.length > (isMobile ? 2 : 3) && (
                <span style={{ fontSize: isMobile ? 10 : 11, color: "#999", padding: "2px 4px" }}>
                  +{med.sideEffects.length - (isMobile ? 2 : 3)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card.Body>
      <Card.Footer>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            fontSize: isMobile ? 12 : 13,
            color: T.subtle,
          }}
        >
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span>{formatUserCount(med.userCount)} 조회</span>
            {!isMobile && (
              <>
                <span style={{ color: T.border }}>|</span>
                <span>
                  {med.pill.shape} · {med.pill.color}
                </span>
              </>
            )}
          </div>
          <span style={{ color: T.cobalt, fontWeight: 600 }}>상세보기 →</span>
        </div>
      </Card.Footer>
    </Card>
  );
}
