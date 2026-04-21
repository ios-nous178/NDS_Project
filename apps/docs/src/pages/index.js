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
    abbr: "Btn",
    color: "#2B96ED",
  },
  {
    name: "Badge",
    desc: "6가지 상태 색상 라벨",
    link: "/docs/components/badge",
    abbr: "Bdg",
    color: "#ED2E77",
  },
  {
    name: "Card",
    desc: "썸네일, 헤더, 바디, 푸터",
    link: "/docs/components/card",
    abbr: "Crd",
    color: "#6C7280",
  },
  {
    name: "Input",
    desc: "라벨, 에러, 클리어 지원",
    link: "/docs/components/input",
    abbr: "Inp",
    color: "#00A07C",
  },
  {
    name: "SearchInput",
    desc: "검색 아이콘, Enter 트리거",
    link: "/docs/components/search-input",
    abbr: "Src",
    color: "#00A07C",
  },
  {
    name: "Select",
    desc: "Portal 기반 드롭다운",
    link: "/docs/components/select",
    abbr: "Sel",
    color: "#00A07C",
  },
  {
    name: "Chip",
    desc: "선택/삭제 가능 태그",
    link: "/docs/components/chip",
    abbr: "Chp",
    color: "#9061F9",
  },
  {
    name: "Tabs",
    desc: "line/pill/square 변형",
    link: "/docs/components/tabs",
    abbr: "Tab",
    color: "#017EE4",
  },
  {
    name: "Modal",
    desc: "포커스 트랩, 접근성 내장",
    link: "/docs/components/modal",
    abbr: "Mdl",
    color: "#017EE4",
  },
  {
    name: "Popup",
    desc: "확인/취소 Alert Dialog",
    link: "/docs/components/popup",
    abbr: "Pop",
    color: "#FFA100",
  },
  {
    name: "BottomSheet",
    desc: "드래그 핸들, 애니메이션",
    link: "/docs/components/bottom-sheet",
    abbr: "Bts",
    color: "#017EE4",
  },
  {
    name: "Toast",
    desc: "일시적 피드백 메시지",
    link: "/docs/components/toast",
    abbr: "Tst",
    color: "#FFA100",
  },
];

const tokens = [
  { name: "색상", desc: "7개 팔레트 + 시멘틱", link: "/docs/tokens/colors", icon: "\uD83C\uDFA8" },
  { name: "타이포그래피", desc: "12단계 타입 스케일", link: "/docs/tokens/typography", icon: "Aa" },
  {
    name: "간격",
    desc: "Spacing, Radius, Sizing",
    link: "/docs/tokens/spacing",
    icon: "\uD83D\uDCCF",
  },
];

const quickLinks = [
  {
    title: "시작하기",
    desc: "설치부터 첫 컴포넌트 사용까지",
    link: "/docs/getting-started",
    icon: "\uD83D\uDE80",
  },
  {
    title: "컴포넌트 선택 가이드",
    desc: "어떤 상황에 어떤 컴포넌트를 쓸지 의사결정 트리",
    link: "/docs/components/overview",
    icon: "\uD83E\uDDED",
  },
  {
    title: "디자인 원칙",
    desc: "NDS의 핵심 설계 철학",
    link: "/docs/guide/design-principles",
    icon: "\uD83D\uDCD6",
  },
  {
    title: "스타일링 가이드",
    desc: "CSS 변수, slotProps, data-slot 커스터마이징",
    link: "/docs/guide/styling",
    icon: "\uD83C\uDFAF",
  },
];

function ComponentCard({ name, desc, link, abbr, color }) {
  return (
    <Link to={link} className={styles.componentCard}>
      <div className={styles.componentIcon} style={{ "--accent": color }}>
        <span>{abbr}</span>
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

function QuickLinkCard({ title, desc, link, icon }) {
  return (
    <Link to={link} className={styles.quickLink}>
      <span className={styles.quickLinkIcon}>{icon}</span>
      <div>
        <strong>{title}</strong>
        <span>{desc}</span>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <Layout
      title="NudgeEAP Design System"
      description="Figma와 코드 사이의 간극을 줄이는 디자인 시스템"
    >
      <main className={styles.page}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroBadge}>NudgeEAP Design System</div>
            <h1 className={styles.heroTitle}>
              기획, 디자인, 개발이
              <br />
              <span className={styles.heroGradient}>같은 언어로</span> 소통하는 시스템
            </h1>
            <p className={styles.heroDesc}>
              15개 React 컴포넌트, 디자인 토큰, 83종 아이콘을 제공합니다.
              <br />
              Figma와 1:1 동기화. 사람과 AI 모두 읽을 수 있는 문서.
            </p>
            <div className={styles.heroActions}>
              <Link to="/docs/getting-started" className={styles.btnPrimary}>
                시작하기
                <ArrowNextIcon size={16} />
              </Link>
              <Link to="/docs/components/overview" className={styles.btnSecondary}>
                컴포넌트 선택 가이드
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className={styles.statsSection}>
          <div className={clsx(styles.container, styles.statsGrid)}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>15</span>
              <span className={styles.statLabel}>React 컴포넌트</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>83</span>
              <span className={styles.statLabel}>아이콘</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNumber}>100+</span>
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
              <p>
                Flat API와 Compound API를 모두 지원합니다. 어떤 컴포넌트를 써야 할지 모르겠다면{" "}
                <Link to="/docs/components/overview">선택 가이드</Link>를 확인하세요.
              </p>
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
                {`import { Button, Badge, Modal } from "@nudge-eap/react";
import { colors } from "@nudge-eap/tokens";

function App() {
  return (
    <>
      <Badge variant="success">완료</Badge>
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
              <span className={styles.eyebrow}>Quick Start</span>
              <h2>바로가기</h2>
              <p>
                역할에 맞는 문서로 빠르게 이동하세요. 자세한 역할별 가이드는{" "}
                <Link to="/docs/intro">소개 페이지</Link>에서 확인할 수 있습니다.
              </p>
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
