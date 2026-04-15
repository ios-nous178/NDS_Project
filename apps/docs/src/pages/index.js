import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import { ChevronRightIcon, ArrowNextIcon } from "@nudge-eap/icons";
import styles from "./index.module.css";

const components = [
  {
    name: "Button",
    desc: "4가지 변형, 6가지 사이즈",
    link: "/docs/components/button",
    icon: "👆",
    color: "#2B96ED",
  },
  {
    name: "Badge",
    desc: "6가지 상태 색상 변형",
    link: "/docs/components/badge",
    icon: "🏷️",
    color: "#ED2E77",
  },
  {
    name: "Input",
    desc: "라벨, 에러, 클리어 지원",
    link: "/docs/components/input",
    icon: "✏️",
    color: "#00A07C",
  },
  {
    name: "Modal",
    desc: "포커스 트랩, 접근성 내장",
    link: "/docs/components/modal",
    icon: "🪟",
    color: "#017EE4",
  },
  {
    name: "Popup",
    desc: "확인/취소 Alert Dialog",
    link: "/docs/components/popup",
    icon: "💬",
    color: "#FFA100",
  },
];

const tokens = [
  { name: "색상", desc: "7개 팔레트 + 시멘틱", link: "/docs/tokens/colors", icon: "🎨" },
  { name: "타이포그래피", desc: "12단계 타입 스케일", link: "/docs/tokens/typography", icon: "Aa" },
  { name: "간격", desc: "Spacing, Radius, Sizing", link: "/docs/tokens/spacing", icon: "📐" },
];

const quickLinks = [
  {
    title: "시작하기",
    desc: "설치부터 첫 컴포넌트 사용까지",
    link: "/docs/getting-started",
    icon: "🚀",
  },
  {
    title: "디자인 원칙",
    desc: "NDS의 6가지 핵심 설계 철학",
    link: "/docs/guide/design-principles",
    icon: "📖",
  },
  {
    title: "스타일링 가이드",
    desc: "CSS 변수, slotProps, data-slot 커스터마이징",
    link: "/docs/guide/styling",
    icon: "🎯",
  },
  {
    title: "스토리북",
    desc: "컴포넌트 인터랙티브 데모",
    link: "http://localhost:6006",
    icon: "📚",
    external: true,
  },
];

function ComponentCard({ name, desc, link, icon, color }) {
  return (
    <Link to={link} className={styles.componentCard}>
      <div className={styles.componentIcon} style={{ "--accent": color }}>
        <span>{icon}</span>
      </div>
      <div className={styles.componentInfo}>
        <strong>{name}</strong>
        <span>{desc}</span>
      </div>
      <ChevronRightIcon size={16} className={styles.arrow} />
    </Link>
  );
}

function TokenCard({ name, desc, link, icon }) {
  return (
    <Link to={link} className={styles.tokenCard}>
      <span className={styles.tokenIcon}>{icon}</span>
      <strong>{name}</strong>
      <span className={styles.tokenDesc}>{desc}</span>
    </Link>
  );
}

function QuickLinkCard({ title, desc, link, icon, external }) {
  const Component = external ? "a" : Link;
  const props = external ? { href: link, target: "_blank", rel: "noopener" } : { to: link };
  return (
    <Component className={styles.quickLink} {...props}>
      <span className={styles.quickLinkIcon}>{icon}</span>
      <div>
        <strong>{title}</strong>
        <span>{desc}</span>
      </div>
    </Component>
  );
}

export default function Home() {
  return (
    <Layout title="NudgeEAP Design System" description="토큰, 컴포넌트, 워크플로우를 한곳에서">
      <main className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroBadge}>Design System</div>
            <h1 className={styles.heroTitle}>
              일관된 제품 경험을 위한
              <br />
              <span className={styles.heroGradient}>디자인 시스템</span>
            </h1>
            <p className={styles.heroDesc}>
              NudgeEAP Design System은 토큰 기반의 컴포넌트 라이브러리입니다.
              <br />
              Figma와 코드 사이의 간극을 줄이고, 빠르고 일관된 UI 개발을 지원합니다.
            </p>
            <div className={styles.heroActions}>
              <Link to="/docs/getting-started" className={styles.btnPrimary}>
                시작하기
                <ArrowNextIcon size={16} />
              </Link>
              <Link to="/docs/components/overview" className={styles.btnSecondary}>
                컴포넌트 보기
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className={styles.statsSection}>
          <div className={clsx(styles.container, styles.statsGrid)}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>5</span>
              <span className={styles.statLabel}>React 컴포넌트</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>20+</span>
              <span className={styles.statLabel}>아이콘</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>60+</span>
              <span className={styles.statLabel}>디자인 토큰</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>4</span>
              <span className={styles.statLabel}>npm 패키지</span>
            </div>
          </div>
        </section>

        {/* Components */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Components</span>
              <h2>컴포넌트</h2>
              <p>Flat API와 Compound API를 모두 지원하는 React 컴포넌트입니다.</p>
            </div>
            <div className={styles.componentGrid}>
              {components.map((c) => (
                <ComponentCard key={c.name} {...c} />
              ))}
            </div>
          </div>
        </section>

        {/* Tokens */}
        <section className={clsx(styles.section, styles.sectionAlt)}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Design Tokens</span>
              <h2>디자인 토큰</h2>
              <p>Figma 실측 기반의 색상, 타이포그래피, 간격 토큰입니다.</p>
            </div>
            <div className={styles.tokenGrid}>
              {tokens.map((t) => (
                <TokenCard key={t.name} {...t} />
              ))}
            </div>
            <div className={styles.codePreview}>
              <div className={styles.codeHeader}>
                <span className={styles.codeDot} style={{ background: "#FF5F57" }} />
                <span className={styles.codeDot} style={{ background: "#FEBC2E" }} />
                <span className={styles.codeDot} style={{ background: "#28C840" }} />
                <span className={styles.codeTitle}>App.tsx</span>
              </div>
              <pre className={styles.codeBlock}>
{`import { Button, Badge } from "@nudge-eap/react";
import { colors } from "@nudge-eap/tokens";

function App() {
  return (
    <>
      <Badge variant="primary">신규</Badge>
      <Button variant="solid" size="lg">
        시작하기
      </Button>
    </>
  );
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Quick Links</span>
              <h2>바로가기</h2>
              <p>필요한 문서로 빠르게 이동하세요.</p>
            </div>
            <div className={styles.quickLinkGrid}>
              {quickLinks.map((q) => (
                <QuickLinkCard key={q.title} {...q} />
              ))}
            </div>
          </div>
        </section>

        {/* API Pattern Preview */}
        <section className={clsx(styles.section, styles.sectionAlt)}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <span className={styles.eyebrow}>Hybrid API</span>
              <h2>두 가지 사용 방식</h2>
              <p>모든 컴포넌트는 Flat API와 Compound API를 모두 지원합니다.</p>
            </div>
            <div className={styles.apiGrid}>
              <div className={styles.apiCard}>
                <div className={styles.apiLabel}>Flat API</div>
                <p className={styles.apiDesc}>Props만으로 빠르게 사용</p>
                <pre className={styles.apiCode}>
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
              <div className={styles.apiCard}>
                <div className={styles.apiLabel}>Compound API</div>
                <p className={styles.apiDesc}>각 슬롯을 자유롭게 조합</p>
                <pre className={styles.apiCode}>
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
        </section>
      </main>
    </Layout>
  );
}
