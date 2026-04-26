/**
 * [TROST-MEDICATION-SEARCH] 트로스트 복용약 찾기 페이지 목업
 *
 * Mockup Renderer 산출물 — ephemeral
 * DS 컴포넌트: AppBar, AppFooter, SearchInput, Button, Card, Badge, Chip
 * Missing (임시 구현): Accordion, StickyBottomBar
 */
import React, { useState, useMemo } from "react";
import { AppBar, AppFooter, SearchInput, Button, Card, Badge, Chip } from "@nudge-eap/react";
import {
  medications,
  categories,
  popularSearches,
  faqs,
  relatedTags,
  cautionGuides,
  type MedicationCategory,
  type CautionLevel,
} from "./mock-data";

/* ────────────────────────────────────────────
 * 트로스트 브랜드 컬러 상수
 * brand-themes.ts 의 Trost 토큰 참조
 * ──────────────────────────────────────────── */
const TROST = {
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

/** [Missing] Accordion — 트로스트 스타일 */
function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            border: `1px solid ${TROST.border}`,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <button
            style={{
              width: "100%",
              textAlign: "left",
              padding: "16px 20px",
              fontWeight: 600,
              fontSize: 15,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: openIndex === i ? TROST.bgCool : TROST.white,
              border: "none",
              cursor: "pointer",
              color: TROST.black,
              fontFamily: "inherit",
              transition: "background 0.2s",
            }}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <span>{item.question}</span>
            <span
              style={{
                color: "#999",
                fontSize: 18,
                transition: "transform 0.2s",
                transform: openIndex === i ? "rotate(45deg)" : "none",
              }}
            >
              +
            </span>
          </button>
          {openIndex === i && (
            <div
              style={{
                padding: "0 20px 16px",
                color: TROST.subtle,
                fontSize: 14,
                lineHeight: 1.6,
                background: TROST.bgCool,
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

/** [Missing] StickyBottomBar — 트로스트 스타일 */
function StickyBottomBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: TROST.white,
        borderTop: `1px solid ${TROST.border}`,
        padding: "12px 16px",
        paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
        zIndex: 50,
        boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ maxWidth: 768, margin: "0 auto" }}>{children}</div>
    </div>
  );
}

/* ────────────────────────────────────────────
 * 유틸
 * ──────────────────────────────────────────── */

const cautionBadgeVariant: Record<CautionLevel, "success" | "caution" | "error"> = {
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
 * 트로스트 GNB 데이터
 * ──────────────────────────────────────────── */

const gnbItems = [
  { key: "test", label: "심리검사", href: "/test" },
  { key: "counselor", label: "상담사 찾기", href: "/counselor" },
  { key: "medication", label: "복용약 찾기", href: "/medication" },
  { key: "community", label: "커뮤니티", href: "/community" },
];

const footerLinks = [
  { label: "이용약관", href: "/terms", bold: false },
  { label: "개인정보처리방침", href: "/privacy", bold: true },
  { label: "이메일 무단수집 거부", href: "/anti-spam", bold: false },
];

const companyInfo = {
  name: "(주)마인드카페",
  ceo: "이태우",
  address: "서울특별시 성동구 왕십리로 115, 헤이그라운드 6층",
  bizNumber: "738-88-00662",
  copyright: "© 2024 MindCafe Inc. All rights reserved.",
};

/* ════════════════════════════════════════════
 * 메인 목업 컴포넌트
 * ════════════════════════════════════════════ */
export default function TrostMedicationSearchMockup() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"전체" | MedicationCategory>("전체");

  const filteredMedications = useMemo(() => {
    return medications.filter((med) => {
      const matchesCategory = selectedCategory === "전체" || med.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.category.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: TROST.white,
        fontFamily:
          "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, sans-serif",
        paddingBottom: 80, // StickyBottomBar 높이만큼
      }}
    >
      {/* ── AppBar (헤더) ── */}
      <AppBar position="sticky" elevated>
        {/* 2단 구조: MainBar + NavBar */}
        <div style={{ width: "100%" }}>
          <AppBar.MainBar maxWidth={1080}>
            <AppBar.Logo
              src="/brand-logos/trost-logo.svg"
              alt="트로스트"
              href="/"
              style={{ height: 28 }}
            />
            <AppBar.SearchBar
              placeholder="약 이름 또는 성분명 검색"
              onSearch={(v) => setSearchQuery(v)}
            />
            <AppBar.AuthMenu
              items={[
                { key: "login", label: "로그인" },
                { key: "signup", label: "회원가입" },
              ]}
              separator="divider"
            />
          </AppBar.MainBar>
          <AppBar.Divider />
          <AppBar.NavBar maxWidth={1080}>
            <AppBar.GNB items={gnbItems} activeKey="medication" />
          </AppBar.NavBar>
        </div>
      </AppBar>

      {/* ── 섹션 1: Hero + 검색 ── */}
      <section
        style={{
          background: `linear-gradient(180deg, ${TROST.bgCool} 0%, ${TROST.white} 100%)`,
          padding: "48px 16px 40px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: TROST.black,
            margin: "0 0 12px",
            lineHeight: 1.36,
          }}
        >
          복용약 검색 — 내가 먹는 약, 제대로 알기
        </h1>
        <p
          style={{
            color: TROST.subtle,
            fontSize: 15,
            margin: "0 0 32px",
            lineHeight: 1.5,
          }}
        >
          부작용, 상호작용, 복용 주의사항까지 한눈에 확인하세요.
          <br />
          정확한 약물 정보로 안심하고 복용하세요.
        </p>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <SearchInput
            variant="outlined"
            placeholder="약 이름 또는 성분명을 검색해보세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
            onClear={() => setSearchQuery("")}
            onSearch={() => {}}
            slotProps={{
              wrapper: {
                style: {
                  minHeight: 56,
                  borderColor: TROST.yellowHover,
                  borderWidth: 2,
                  borderRadius: 28,
                  fontSize: 16,
                } as React.CSSProperties,
              },
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 8,
            marginTop: 20,
          }}
        >
          {popularSearches.map((keyword) => (
            <Chip
              key={keyword}
              label={keyword}
              variant="outlined"
              size="sm"
              shape="pill"
              onClick={() => setSearchQuery(keyword)}
            />
          ))}
        </div>
      </section>

      {/* ── 섹션 2: 카테고리 필터 ── */}
      <section
        style={{
          maxWidth: 768,
          margin: "0 auto",
          padding: "24px 16px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {categories.map((cat) => (
            <Chip
              key={cat.key}
              label={cat.label}
              variant={selectedCategory === cat.key ? "strong" : "outlined"}
              size="md"
              shape="pill"
              onClick={() => setSelectedCategory(cat.key as "전체" | MedicationCategory)}
            />
          ))}
        </div>
      </section>

      {/* ── 섹션 3: 약물 목록 ── */}
      <section
        style={{
          maxWidth: 768,
          margin: "0 auto",
          padding: "24px 16px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: TROST.black,
              margin: 0,
            }}
          >
            {selectedCategory === "전체" ? "전체 약물" : selectedCategory}{" "}
            <span style={{ color: TROST.cobalt, fontWeight: 700 }}>
              {filteredMedications.length}
            </span>
            건
          </h2>
        </div>

        {filteredMedications.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: TROST.subtle,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>💊</div>
            <p style={{ fontSize: 16, fontWeight: 500 }}>검색 결과가 없습니다</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>다른 약 이름이나 성분명으로 검색해보세요</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340, 1fr))",
              gap: 12,
            }}
          >
            {filteredMedications.map((med) => (
              <Card
                key={med.id}
                variant="outlined"
                clickable
                onClick={() => console.log(`navigate: /medication/${med.id}`)}
              >
                <Card.Header>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Badge variant="neutral">{med.category}</Badge>
                    <Badge variant={cautionBadgeVariant[med.cautionLevel]}>
                      주의 {med.cautionLevel}
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Card.Title>{med.name}</Card.Title>
                  <p
                    style={{
                      fontSize: 13,
                      color: TROST.cobalt,
                      margin: "2px 0 8px",
                      fontWeight: 500,
                    }}
                  >
                    {med.genericName}
                  </p>
                  <Card.Subtitle>{med.description}</Card.Subtitle>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 4,
                      marginTop: 12,
                    }}
                  >
                    {med.sideEffects.slice(0, 3).map((se) => (
                      <span
                        key={se}
                        style={{
                          fontSize: 12,
                          color: TROST.subtle,
                          background: TROST.bgCool,
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}
                      >
                        {se}
                      </span>
                    ))}
                    {med.sideEffects.length > 3 && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#999",
                          padding: "2px 4px",
                        }}
                      >
                        +{med.sideEffects.length - 3}
                      </span>
                    )}
                  </div>
                </Card.Body>
                <Card.Footer>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      fontSize: 13,
                      color: TROST.subtle,
                    }}
                  >
                    <span>{formatUserCount(med.userCount)} 조회</span>
                    <span style={{ color: TROST.cobalt, fontWeight: 600 }}>상세보기 →</span>
                  </div>
                </Card.Footer>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ── 섹션 4: 복용 주의사항 가이드 ── */}
      <section
        style={{
          background: TROST.bgCool,
          padding: "40px 16px",
        }}
      >
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: TROST.black,
              margin: "0 0 8px",
            }}
          >
            약물 복용, 이것만은 꼭 기억하세요
          </h2>
          <p
            style={{
              fontSize: 14,
              color: TROST.subtle,
              margin: "0 0 24px",
              lineHeight: 1.5,
            }}
          >
            정신건강 약물을 안전하게 복용하기 위해 반드시 알아두어야 할 사항입니다.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {cautionGuides.map((guide) => (
              <Card key={guide.title} variant="elevated">
                <Card.Body>
                  <div style={{ textAlign: "center", padding: "8px 0" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>{guide.icon}</div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: TROST.black,
                        marginBottom: 8,
                      }}
                    >
                      {guide.title}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: TROST.subtle,
                        lineHeight: 1.5,
                      }}
                    >
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
        style={{
          maxWidth: 768,
          margin: "0 auto",
          padding: "40px 16px",
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: TROST.black,
            margin: "0 0 20px",
          }}
        >
          복용약 관련 자주 묻는 질문
        </h2>
        <Accordion items={faqs} />
      </section>

      {/* ── 섹션 6: 상담 연계 CTA ── */}
      <section
        style={{
          background: TROST.bgCool,
          padding: "40px 16px",
        }}
      >
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: TROST.black,
              margin: "0 0 8px",
            }}
          >
            약에 대해 더 궁금한 점이 있으신가요?
          </h2>
          <p
            style={{
              fontSize: 14,
              color: TROST.subtle,
              margin: "0 0 24px",
              lineHeight: 1.5,
            }}
          >
            복용 중인 약물에 대한 걱정, 전문가와 함께 해결하세요.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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
                      background: `${TROST.yellow}40`,
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
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: TROST.black,
                        marginBottom: 4,
                      }}
                    >
                      전문 상담사 찾기
                    </div>
                    <div style={{ fontSize: 14, color: TROST.subtle }}>
                      약물 복용 관련 심리 상담을 받아보세요
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
                      background: `${TROST.cobalt}15`,
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
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: TROST.black,
                        marginBottom: 4,
                      }}
                    >
                      복약 고민 나누기
                    </div>
                    <div style={{ fontSize: 14, color: TROST.subtle }}>
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
        style={{
          maxWidth: 768,
          margin: "0 auto",
          padding: "40px 16px",
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: TROST.black,
            margin: "0 0 16px",
          }}
        >
          이런 약물 정보도 찾고 있으신가요?
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {relatedTags.map((tag) => (
            <Chip
              key={tag.label}
              label={tag.label}
              variant="outlined"
              size="md"
              shape="pill"
              onClick={() => console.log(`navigate: ${tag.url}`)}
            />
          ))}
        </div>
      </section>

      {/* ── AppFooter (푸터) ── */}
      <AppFooter.Info
        style={{
          background: TROST.black,
          padding: "32px 16px",
        }}
      >
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          <AppFooter.Links links={footerLinks} />
          <AppFooter.CompanyInfo data={companyInfo} />
          <AppFooter.Extra>
            <p style={{ marginTop: 12, lineHeight: 1.6 }}>
              본 페이지의 약물 정보는 일반적인 참고용이며, 의학적 진단이나 처방을 대체하지 않습니다.
              <br />
              정확한 복용법과 주의사항은 반드시 담당 의료진과 상담하세요.
            </p>
          </AppFooter.Extra>
        </div>
      </AppFooter.Info>

      {/* ── StickyBottomBar (모바일 고정 CTA) ── */}
      <StickyBottomBar>
        <Button
          variant="solid"
          size="lg"
          style={{ width: "100%" }}
          onClick={() => console.log("navigate: /counselor?specialty=medication")}
        >
          복약 상담 신청하기
        </Button>
      </StickyBottomBar>
    </div>
  );
}
