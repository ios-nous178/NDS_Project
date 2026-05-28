import clsx from "clsx";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { Button, Badge, Input, Chip } from "@nudge-design/react";
import {
  ArrowNextIcon,
  ChevronRightIcon,
  SearchIcon,
  StarIcon,
  HomeIcon,
  FavoriteIcon,
  CalendarIcon,
  LinkIcon,
} from "@nudge-design/icons";
import styles from "./index.module.css";

const NOTION_INSTALL_GUIDE_URL =
  "https://www.notion.so/cashwalkteam/35ea054b7d82807bb097c6c9d6b3d272";

function buildStorybookUrl(baseUrl, query) {
  const trimmed = baseUrl.replace(/\/$/, "");
  return query ? `${trimmed}/?path=${query}` : `${trimmed}/`;
}

/* ──────────────────────────────────────────
   Section 1 — Hero
   ────────────────────────────────────────── */

function Hero({ dsVersion }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.heroInner}>
          <img
            src="/img/logo.svg"
            alt=""
            aria-hidden="true"
            className={styles.heroLogo}
            width="64"
            height="64"
          />
          {dsVersion ? <span className={styles.heroEyebrow}>v{dsVersion}</span> : null}
          <h1 className={styles.heroTitle}>넛지 디자인시스템</h1>
          <p className={styles.heroDesc}>
            넛지의 다양한 서비스의 공통 컴포넌트, 토큰, 아이콘, MCP 가이드를 한 곳에서 관리합니다.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   Section 2 — Real component previews
   ────────────────────────────────────────── */

function ComponentPreviewGrid() {
  return (
    <section className={clsx(styles.section, styles.sectionAlt)}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Components</span>
          <h2>컴포넌트 미리보기</h2>
          <p>
            이 섹션에 보이는 미리보기는 모두 <code>@nudge-design/react</code>로 렌더링한 실제
            컴포넌트입니다.
            <br />
            카드를 클릭하면 각 문서로 이동해 props와 사용 가이드를 바로 확인할 수 있어요.
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
            <span className={styles.eyebrowOnDark}>MCP Server</span>
            <h2 className={styles.mcpTitle}>
              AI 에게 한국어로 부탁하면
              <br />
              규칙대로 짚어서 만들어 줍니다.
            </h2>
            <p className={styles.mcpDesc}>
              <code>nudge-ds</code> MCP 서버가 원칙·컴포넌트·토큰·아이콘을 추측 없이 찾아오고,
              작성한 목업의 토큰 위반과 금지 패턴까지 검증합니다. 15개 도구가 백그라운드에서
              동작합니다.
            </p>
            <div className={styles.mcpLinks}>
              <Link to="/NUDGE_DS_MCP_USAGE" className={styles.mcpLinkPrimary}>
                사용 가이드
                <ArrowNextIcon size={14} />
              </Link>
              <Link to="/guide/mcp-tools-reference" className={styles.mcpLinkSecondary}>
                15개 도구 레퍼런스
              </Link>
            </div>
          </div>

          <div className={styles.mcpChatCard}>
            <div className={styles.mcpChatRow}>
              <span className={styles.mcpAvatar}>You</span>
              <p className={styles.mcpBubble}>
                [PRD 문서 첨부] PRD 지키고, 디자인 시스템 규칙을 지켜서 목업 생성해줘.
              </p>
            </div>
            <div className={styles.mcpChatRow}>
              <span className={clsx(styles.mcpAvatar, styles.mcpAvatarAi)}>AI</span>
              <p className={clsx(styles.mcpBubble, styles.mcpBubbleAi)}>
                <code>get_guide(&#123; topic: 'principles' &#125;)</code> →{" "}
                <code>find_component(&#123; query: 'mood' &#125;)</code> →{" "}
                <code>get_guide(&#123; topic: 'component:MoodSelector' &#125;)</code> → 작성 →{" "}
                <code>validate_mockup</code> 토큰 위반 0건.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   Section 6 — External resources & shortcuts
   ────────────────────────────────────────── */

function Resources({ storybookUrl }) {
  const items = [
    {
      eyebrow: "Setup",
      title: "설치 / 업데이트 가이드",
      desc: "비개발자용 환경 셋업과 업데이트 절차를 Notion 문서에서 확인하세요.",
      href: NOTION_INSTALL_GUIDE_URL,
      cta: "Notion 열기",
      external: true,
    },
    {
      eyebrow: "Storybook",
      title: "전체 컴포넌트 카탈로그",
      desc: "All Components 스토리에서 모든 컴포넌트를 한 번에 둘러볼 수 있어요.",
      href: buildStorybookUrl(storybookUrl, "/story/foundations-all-components--catalog-all"),
      cta: "Storybook 열기",
      external: true,
    },
    {
      eyebrow: "Storybook",
      title: "아이콘",
      desc: "Foundations · Icons 스토리에서 84개 아이콘을 모두 미리볼 수 있어요.",
      href: buildStorybookUrl(storybookUrl, "/story/foundations-icons--all"),
      cta: "Storybook 열기",
      external: true,
    },
  ];

  return (
    <section className={styles.sectionTight}>
      <div className={styles.container}>
        <ul className={styles.linkList}>
          {items.map((r) => (
            <li key={r.title}>
              <a
                className={styles.linkRow}
                href={r.href}
                {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span className={styles.linkChip}>{r.eyebrow}</span>
                <div className={styles.linkBody}>
                  <strong className={styles.linkTitle}>{r.title}</strong>
                  <span className={styles.linkDesc}>{r.desc}</span>
                </div>
                <span className={styles.linkCta} aria-hidden="true">
                  {r.external ? <LinkIcon size={16} /> : <ArrowNextIcon size={16} />}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────
   Page
   ────────────────────────────────────────── */

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const storybookUrl = siteConfig.customFields?.storybookUrl || "/storybook/";
  const dsVersion = siteConfig.customFields?.dsVersion;
  return (
    <Layout
      title="넛지 디자인시스템"
      description="넛지의 다양한 서비스의 공통 컴포넌트, 토큰, 아이콘, MCP 가이드를 한 곳에서 관리합니다."
    >
      <main className={styles.page}>
        <Hero dsVersion={dsVersion} />
        <Resources storybookUrl={storybookUrl} />
        <ComponentPreviewGrid />
        <CodeShowcase />
        <McpPitch />
      </main>
    </Layout>
  );
}
