import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import { Button, Badge, Input, Chip } from "@nudge-eap/react";
import {
  ArrowNextIcon,
  ChevronRightIcon,
  SearchIcon,
  StarIcon,
  HomeIcon,
  FavoriteIcon,
  CalendarIcon,
} from "@nudge-eap/icons";
import styles from "./index.module.css";

/* ──────────────────────────────────────────
   Section 1 — Hero
   ────────────────────────────────────────── */

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.heroInner}>
          <span className={styles.heroEyebrow}>
            <span className={styles.heroEyebrowDot} />
            v0.1.0 · Figma 정합 검증 진행 중
          </span>
          <h1 className={styles.heroTitle}>
            기획·디자인·개발이
            <br />
            <span className={styles.heroGradient}>한 언어로</span> 만드는
            <br />
            넛지 디자인시스템
          </h1>
          <p className={styles.heroDesc}>
            React 컴포넌트 · 84개 아이콘 · 디자인 토큰 · MCP 도구를 한 번에.
            <br />
            Figma 컴포넌트와 1:1 동기화되어, 사람과 AI 모두가 같은 기준으로 작업합니다.
          </p>
          <div className={styles.heroActions}>
            <Link to="/getting-started" className={styles.btnPrimary}>
              5분 만에 시작하기
              <ArrowNextIcon size={16} />
            </Link>
            <Link to="/components/overview" className={styles.btnSecondary}>
              컴포넌트 둘러보기
            </Link>
          </div>
          <ul className={styles.heroChips}>
            <li>
              <span className={styles.heroChipDot} />
              Figma Synced
            </li>
            <li>
              <span className={styles.heroChipDot} />
              Type-safe React
            </li>
            <li>
              <span className={styles.heroChipDot} />
              MCP for Claude
            </li>
            <li>
              <span className={styles.heroChipDot} />
              Trost · Geniet · NudgeEAP
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   Section 2 — Feature pills (replaces stats)
   ────────────────────────────────────────── */

const FEATURES = [
  {
    eyebrow: "Components",
    title: "100+ React 컴포넌트",
    desc: "Button · Modal · Input 부터 ChatBubble · MoodSelector 같은 도메인 컴포넌트까지.",
    link: "/components/overview",
    linkLabel: "전체 보기",
  },
  {
    eyebrow: "Icons",
    title: "84개 SVG 아이콘",
    desc: "Figma Iconography(379:490) 기준 24×24 / currentColor 규약으로 통일.",
    link: "/components/icons",
    linkLabel: "카탈로그",
  },
  {
    eyebrow: "MCP",
    title: "Claude용 MCP 31개 도구",
    desc: "한국어로 부탁하면 컴포넌트·토큰·아이콘을 자동으로 찾아줍니다.",
    link: "/guide/mcp-tools-reference",
    linkLabel: "도구 보기",
  },
];

function Features() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.featureGrid}>
          {FEATURES.map((f) => (
            <Link key={f.title} to={f.link} className={styles.featureCard}>
              <span className={styles.featureEyebrow}>{f.eyebrow}</span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
              <span className={styles.featureLink}>
                {f.linkLabel}
                <ChevronRightIcon size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   Section 3 — Real component previews
   ────────────────────────────────────────── */

function ComponentPreviewGrid() {
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Components</span>
          <h2>실제 동작하는 컴포넌트</h2>
          <p>
            이 페이지에 보이는 모든 미리보기는 <code>@nudge-eap/react</code>의 실제 컴포넌트입니다.
            카드를 클릭하면 각 문서로 이동해 props와 사용 가이드를 볼 수 있어요.
          </p>
        </div>

        <div className={styles.previewGrid}>
          <Link to="/components/button" className={styles.previewCard}>
            <div className={styles.previewHead}>
              <span className={styles.previewName}>Button</span>
              <span className={clsx(styles.previewBadge, styles.previewBadgeSynced)}>
                Figma Synced
              </span>
            </div>
            <div className={styles.previewBody}>
              <Button>확인</Button>
              <Button variant="outlined">취소</Button>
            </div>
            <div className={styles.previewFoot}>
              <span>4 variants · 6 sizes · 3 colors</span>
              <ChevronRightIcon size={14} />
            </div>
          </Link>

          <Link to="/components/input" className={styles.previewCard}>
            <div className={styles.previewHead}>
              <span className={styles.previewName}>Input</span>
              <span className={clsx(styles.previewBadge, styles.previewBadgeSynced)}>
                Figma Synced
              </span>
            </div>
            <div className={styles.previewBody} style={{ alignItems: "stretch" }}>
              <div style={{ width: "100%", maxWidth: 240 }}>
                <Input label="이메일" placeholder="example@nudge.co" />
              </div>
            </div>
            <div className={styles.previewFoot}>
              <span>Helper variant 4종 · Compound API</span>
              <ChevronRightIcon size={14} />
            </div>
          </Link>

          <Link to="/components/modal" className={styles.previewCard}>
            <div className={styles.previewHead}>
              <span className={styles.previewName}>Modal</span>
              <span className={clsx(styles.previewBadge, styles.previewBadgeSynced)}>
                Figma Synced
              </span>
            </div>
            <div className={styles.previewBody}>
              <div className={styles.fauxModal}>
                <p className={styles.fauxModalTitle}>상담을 예약할까요?</p>
                <p className={styles.fauxModalDesc}>전문 상담사와의 일정을 잡습니다.</p>
                <div className={styles.fauxModalActions}>
                  <Button variant="outlined" size="md">
                    취소
                  </Button>
                  <Button size="md">예약</Button>
                </div>
              </div>
            </div>
            <div className={styles.previewFoot}>
              <span>Flat + Compound API · Portal</span>
              <ChevronRightIcon size={14} />
            </div>
          </Link>

          <Link to="/components/badge" className={styles.previewCard}>
            <div className={styles.previewHead}>
              <span className={styles.previewName}>Badge</span>
              <span className={styles.previewBadge}>Stable</span>
            </div>
            <div className={styles.previewBody}>
              <Badge variant="fill" color="brand">
                신규
              </Badge>
              <Badge variant="ghost" color="success">
                완료
              </Badge>
              <Badge variant="line" color="error">
                필수
              </Badge>
            </div>
            <div className={styles.previewFoot}>
              <span>상태 · 카테고리 · 라벨</span>
              <ChevronRightIcon size={14} />
            </div>
          </Link>

          <Link to="/components/chip" className={styles.previewCard}>
            <div className={styles.previewHead}>
              <span className={styles.previewName}>Chip</span>
              <span className={styles.previewBadge}>Stable</span>
            </div>
            <div className={styles.previewBody}>
              <Chip label="우울감" />
              <Chip label="번아웃" />
              <Chip label="수면" />
            </div>
            <div className={styles.previewFoot}>
              <span>필터 · 카테고리 · 키워드</span>
              <ChevronRightIcon size={14} />
            </div>
          </Link>

          <Link to="/components/icons" className={styles.previewCard}>
            <div className={styles.previewHead}>
              <span className={styles.previewName}>Icons</span>
              <span className={clsx(styles.previewBadge, styles.previewBadgeSynced)}>
                Figma Synced
              </span>
            </div>
            <div className={styles.previewBody}>
              <span className={styles.iconChip}>
                <HomeIcon size={20} />
              </span>
              <span className={styles.iconChip}>
                <SearchIcon size={20} />
              </span>
              <span className={styles.iconChip}>
                <StarIcon size={20} />
              </span>
              <span className={styles.iconChip}>
                <FavoriteIcon size={20} />
              </span>
              <span className={styles.iconChip}>
                <CalendarIcon size={20} />
              </span>
            </div>
            <div className={styles.previewFoot}>
              <span>84개 · 24×24 · currentColor</span>
              <ChevronRightIcon size={14} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   Section 4 — Code + MCP showcase
   ────────────────────────────────────────── */

function CodeShowcase() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.codeShowcaseGrid}>
          <div className={styles.codeShowcaseText}>
            <span className={styles.eyebrow}>Hybrid API</span>
            <h2 className={styles.codeShowcaseTitle}>
              간단한 건 Flat,
              <br />
              복잡한 건 Compound.
            </h2>
            <p className={styles.codeShowcaseDesc}>
              모든 핵심 컴포넌트는 두 가지 사용 방식을 모두 지원합니다. 빠르게 끝내고 싶을 땐
              props만, 슬롯을 깊게 다뤄야 할 땐 Compound로.
            </p>
            <Link to="/guide/styling" className={styles.codeShowcaseLink}>
              스타일링 / 슬롯 가이드
              <ArrowNextIcon size={14} />
            </Link>
          </div>

          <div className={styles.codePair}>
            <div className={styles.codeCard}>
              <span className={styles.codeBadge}>Flat</span>
              <pre className={styles.codeBlockMini}>
                {`<Modal
  open={open}
  onClose={close}
  title="알림"
  onConfirm={handle}
>
  내용
</Modal>`}
              </pre>
            </div>
            <div className={styles.codeCard}>
              <span className={styles.codeBadge}>Compound</span>
              <pre className={styles.codeBlockMini}>
                {`<Modal.Root open={open} onClose={close}>
  <Modal.Overlay />
  <Modal.Content>
    <Modal.Header title="알림" />
    <Modal.Body>내용</Modal.Body>
    <Modal.Footer onConfirm={handle} />
  </Modal.Content>
</Modal.Root>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   Section 5 — MCP pitch
   ────────────────────────────────────────── */

function McpPitch() {
  return (
    <section className={clsx(styles.section, styles.mcpSection)}>
      <div className={styles.container}>
        <div className={styles.mcpInner}>
          <div className={styles.mcpText}>
            <span className={styles.eyebrowOnDark}>MCP for Claude</span>
            <h2 className={styles.mcpTitle}>
              Claude한테 한국어로 부탁하면
              <br />
              나머지는 자동입니다.
            </h2>
            <p className={styles.mcpDesc}>
              <code>nudge-eap-ds</code> MCP 서버가 컴포넌트·토큰·아이콘을 자동으로 찾고, 잘못된
              사용은 검증해서 잡아줍니다. 31개 도구가 백그라운드에서 동작합니다.
            </p>
            <div className={styles.mcpLinks}>
              <Link to="/NUDGE_EAP_DS_MCP_USAGE" className={styles.mcpLinkPrimary}>
                사용 가이드
                <ArrowNextIcon size={14} />
              </Link>
              <Link to="/guide/mcp-tools-reference" className={styles.mcpLinkSecondary}>
                도구 31개 레퍼런스
              </Link>
            </div>
          </div>

          <div className={styles.mcpChatCard}>
            <div className={styles.mcpChatRow}>
              <span className={styles.mcpAvatar}>You</span>
              <p className={styles.mcpBubble}>상담 예약 화면 만들어줘. 트로스트 브랜드로.</p>
            </div>
            <div className={styles.mcpChatRow}>
              <span className={clsx(styles.mcpAvatar, styles.mcpAvatarAi)}>AI</span>
              <p className={clsx(styles.mcpBubble, styles.mcpBubbleAi)}>
                <code>get_scope_advisory</code> · <code>get_brand_info('trost')</code> ·
                <code>get_component_guide('Button')</code>… 완료. 코드 작성합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   Section 6 — Role-based quick links
   ────────────────────────────────────────── */

const ROLES = [
  {
    label: "기획자",
    title: "컴포넌트 선택부터",
    desc: "어떤 상황에 어떤 컴포넌트인지, 의사결정 트리로 따라가세요.",
    link: "/components/overview",
    cta: "선택 가이드",
  },
  {
    label: "디자이너",
    title: "Figma↔코드 매핑",
    desc: "각 컴포넌트의 Figma node와 정합 상태를 인벤토리에서 확인하세요.",
    link: "/components/inventory",
    cta: "컴포넌트 인벤토리",
  },
  {
    label: "개발자",
    title: "설치부터 5분",
    desc: "tgz 설치, main.tsx import, 첫 컴포넌트 사용까지.",
    link: "/getting-started",
    cta: "시작하기",
  },
];

function RoleQuickLinks() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Quick Start</span>
          <h2>역할별 시작점</h2>
          <p>당신의 자리에서 가장 빨리 쓸 수 있는 문서로 안내합니다.</p>
        </div>
        <div className={styles.roleGrid}>
          {ROLES.map((r) => (
            <Link key={r.label} to={r.link} className={styles.roleCard}>
              <span className={styles.roleLabel}>{r.label}</span>
              <strong className={styles.roleTitle}>{r.title}</strong>
              <p className={styles.roleDesc}>{r.desc}</p>
              <span className={styles.roleCta}>
                {r.cta}
                <ArrowNextIcon size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   Page
   ────────────────────────────────────────── */

export default function Home() {
  return (
    <Layout
      title="넛지 디자인시스템"
      description="기획·디자인·개발이 한 언어로 만드는 넛지 디자인시스템"
    >
      <main className={styles.page}>
        <Hero />
        <Features />
        <ComponentPreviewGrid />
        <CodeShowcase />
        <McpPitch />
        <RoleQuickLinks />
      </main>
    </Layout>
  );
}
