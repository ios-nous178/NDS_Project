/**
 * [MONEPLE-COMMUNITY-HOME] 모네플 커뮤니티 홈 목업
 *
 * Reference: /Users/nudge_133/Desktop/모네플05
 * Goal: Moneple05의 실제 보드형 홈 구조와 레거시 CSS 변수 사용 방식을 맞춘다.
 */
import React from "react";
import { Badge, Button, Chip } from "@nudge-eap/react";
import { MockupLayout, useIsMobile } from "./mockup-layout";

const menuGroups = [
  {
    title: "커뮤니티",
    items: ["전체글", "BEST 인기글", "공지사항", "자유게시판", "질문게시판"],
  },
  {
    title: "관심 게시판",
    items: ["마음건강", "직장생활", "건강관리", "관계고민", "일상 기록"],
  },
] as const;

const bestPosts = [
  { rank: 1, title: "퇴근 후에도 일이 머릿속에서 떠나지 않을 때", comments: 18 },
  { rank: 2, title: "아침 루틴을 바꾸고 무기력감이 줄었어요", comments: 12 },
  { rank: 3, title: "팀 회의 전 긴장감을 낮추는 나만의 방법", comments: 9 },
  { rank: 4, title: "잠들기 전 생각이 많아지는 날의 기록", comments: 16 },
] as const;

const posts = [
  {
    type: "notice",
    board: "공지",
    title: "모네플 커뮤니티 운영정책 안내",
    author: "운영자",
    date: "05.08",
    views: "1,204",
    comments: 0,
  },
  {
    type: "notice",
    board: "공지",
    title: "익명 게시판 신고 및 차단 기능 업데이트",
    author: "운영자",
    date: "05.07",
    views: "842",
    comments: 0,
  },
  {
    type: "post",
    board: "마음건강",
    title: "요즘 별일 아닌 말에도 쉽게 지치는 것 같아요",
    author: "익명",
    date: "10:16",
    views: "142",
    comments: 11,
  },
  {
    type: "post",
    board: "직장생활",
    title: "업무 메신저 알림만 와도 가슴이 답답해져요",
    author: "하루정리",
    date: "09:44",
    views: "98",
    comments: 7,
  },
  {
    type: "post",
    board: "건강관리",
    title: "점심 산책 15분이 생각보다 큰 차이를 만들었어요",
    author: "노란노트",
    date: "어제",
    views: "231",
    comments: 14,
  },
  {
    type: "post",
    board: "관계고민",
    title: "가까운 사람에게 실망했을 때 마음을 정리하는 법",
    author: "익명",
    date: "어제",
    views: "176",
    comments: 10,
  },
] as const;

const tabs = ["전체", "인기", "공지", "자유", "질문"] as const;

function Sidebar() {
  return (
    <aside className="moneple-side">
      <section className="moneple-login">
        <strong>모네플 커뮤니티</strong>
        <p>로그인하고 관심 게시판을 저장해 보세요.</p>
        <Button size="sm" fullWidth>
          로그인
        </Button>
      </section>

      <nav className="moneple-menu" aria-label="커뮤니티 메뉴">
        {menuGroups.map((group, groupIndex) => (
          <section key={group.title} className="moneple-menu-section">
            <h2>{group.title}</h2>
            {group.items.map((item, itemIndex) => (
              <button
                key={item}
                className={groupIndex === 0 && itemIndex === 0 ? "is-active" : undefined}
                type="button"
              >
                {item}
              </button>
            ))}
          </section>
        ))}
      </nav>

      <section className="moneple-side-best">
        <h2>실시간 인기글</h2>
        <ol>
          {bestPosts.map((post) => (
            <li key={post.rank}>
              <span>{post.rank}</span>
              <p>{post.title}</p>
              <strong>[{post.comments}]</strong>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}

function BoardHeader() {
  return (
    <header className="moneple-board-header">
      <div>
        <h1>전체글</h1>
        <p>모네플 회원들이 나누는 오늘의 이야기</p>
      </div>
      <Button size="sm">글쓰기</Button>
    </header>
  );
}

function BoardTabs() {
  return (
    <div className="moneple-tabs" role="tablist" aria-label="게시판 필터">
      {tabs.map((tab, index) => (
        <Chip
          key={tab}
          label={tab}
          size="sm"
          variant={index === 0 ? "fill" : "ghost"}
          color="neutral"
          onClick={() => undefined}
        />
      ))}
    </div>
  );
}

function BestStrip() {
  return (
    <section className="moneple-best-strip">
      <div className="moneple-strip-title">
        <Badge variant="fill" color="brand" size="sm">
          BEST
        </Badge>
        <strong>많이 읽은 글</strong>
      </div>
      <div className="moneple-strip-list">
        {bestPosts.slice(0, 3).map((post) => (
          <a key={post.rank} href="#">
            <span>{post.rank}</span>
            {post.title}
            <strong>[{post.comments}]</strong>
          </a>
        ))}
      </div>
    </section>
  );
}

function PostTable() {
  return (
    <section className="moneple-board">
      <div className="moneple-table-head">
        <span>게시판</span>
        <span>제목</span>
        <span>글쓴이</span>
        <span>등록일</span>
        <span>조회</span>
      </div>
      {posts.map((post) => (
        <a
          className={post.type === "notice" ? "moneple-row is-notice" : "moneple-row"}
          href="#"
          key={post.title}
        >
          <span className="moneple-board-name">{post.board}</span>
          <span className="moneple-post-title">
            {post.title}
            {post.comments > 0 && <strong>[{post.comments}]</strong>}
          </span>
          <span>{post.author}</span>
          <span>{post.date}</span>
          <span>{post.views}</span>
        </a>
      ))}
    </section>
  );
}

function MobilePostList() {
  return (
    <section className="moneple-mobile-list">
      {posts.map((post) => (
        <a
          className={
            post.type === "notice" ? "moneple-mobile-post is-notice" : "moneple-mobile-post"
          }
          href="#"
          key={post.title}
        >
          <div>
            <span>{post.board}</span>
            <small>{post.date}</small>
          </div>
          <h2>
            {post.title}
            {post.comments > 0 && <strong>[{post.comments}]</strong>}
          </h2>
          <p>
            {post.author} · 조회 {post.views}
          </p>
        </a>
      ))}
    </section>
  );
}

function BoardFooter() {
  return (
    <footer className="moneple-board-footer">
      <div className="moneple-pages">
        <button type="button">1</button>
        <button type="button">2</button>
        <button type="button">3</button>
      </div>
      <label>
        <span>검색</span>
        <input placeholder="게시글 검색" />
      </label>
    </footer>
  );
}

function MonepleCommunityStyles() {
  return (
    <style>{`
      .moneple-community {
        min-height: 100%;
        background: var(--semantic-bg-white, #FFFFFF);
        color: var(--semantic-text-default, #333333);
        font-family: var(--font-web);
      }

      .moneple-shell {
        width: min(1080px, calc(100vw - 40px));
        margin: 40px auto 0;
        padding-bottom: 80px;
        display: grid;
        grid-template-columns: 220px minmax(0, 780px);
        column-gap: 40px;
        align-items: start;
      }

      .moneple-side,
      .moneple-content {
        min-width: 0;
      }

      .moneple-login,
      .moneple-menu,
      .moneple-side-best,
      .moneple-best-strip,
      .moneple-board {
        background: var(--semantic-bg-white, #FFFFFF);
        border: 1px solid var(--semantic-border-default, #EDEDED);
        border-radius: 8px;
      }

      .moneple-login {
        padding: 16px;
      }

      .moneple-login strong {
        display: block;
        font-size: 16px;
        line-height: 24px;
      }

      .moneple-login p {
        margin: 6px 0 14px;
        color: var(--semantic-text-placeholder, #999999);
        font-size: 13px;
        line-height: 19px;
      }

      .moneple-menu,
      .moneple-side-best {
        margin-top: 24px;
        overflow: hidden;
      }

      .moneple-menu-section + .moneple-menu-section {
        border-top: 1px solid var(--semantic-border-default, #EDEDED);
      }

      .moneple-menu h2,
      .moneple-side-best h2 {
        margin: 0;
        padding: 14px 16px;
        border-bottom: 1px solid var(--semantic-border-default, #EDEDED);
        color: var(--semantic-text-default, #333333);
        font-size: 15px;
        line-height: 22px;
      }

      .moneple-menu button {
        width: 100%;
        min-height: 40px;
        padding: 9px 16px;
        border: 0;
        background: transparent;
        color: var(--semantic-text-subtle, #666666);
        font-family: inherit;
        font-size: 14px;
        line-height: 20px;
        text-align: left;
        cursor: pointer;
      }

      .moneple-menu button:hover {
        background: var(--semantic-bg-light, #F5F5F5);
      }

      .moneple-menu button.is-active {
        color: var(--semantic-caution-text, #FF9D00);
        font-weight: 700;
      }

      .moneple-side-best ol {
        list-style: none;
        margin: 0;
        padding: 8px 0;
      }

      .moneple-side-best li {
        display: grid;
        grid-template-columns: 24px minmax(0, 1fr) auto;
        gap: 6px;
        align-items: center;
        padding: 8px 14px;
        font-size: 13px;
        line-height: 18px;
      }

      .moneple-side-best p {
        margin: 0;
        overflow: hidden;
        color: var(--semantic-text-default, #333333);
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .moneple-side-best span {
        color: var(--semantic-text-placeholder, #999999);
        font-weight: 700;
      }

      .moneple-side-best strong,
      .moneple-post-title strong,
      .moneple-strip-list strong,
      .moneple-mobile-post strong {
        color: var(--semantic-error-main, #FF4111);
        margin-left: 4px;
      }

      .moneple-content {
        display: grid;
        gap: 16px;
      }

      .moneple-board-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 16px;
        padding-bottom: 16px;
        border-bottom: 2px solid var(--semantic-text-strong, #151515);
      }

      .moneple-board-header h1 {
        margin: 0;
        color: var(--semantic-text-strong, #151515);
        font-size: 24px;
        line-height: 34px;
        letter-spacing: 0;
      }

      .moneple-board-header p {
        margin: 3px 0 0;
        color: var(--semantic-text-placeholder, #999999);
        font-size: 13px;
        line-height: 18px;
      }

      .moneple-tabs {
        display: flex;
        gap: 8px;
        overflow-x: auto;
      }

      .moneple-best-strip {
        padding: 14px 16px;
        display: grid;
        grid-template-columns: 132px minmax(0, 1fr);
        gap: 14px;
        align-items: center;
      }

      .moneple-strip-title,
      .moneple-strip-list a {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }

      .moneple-strip-title strong {
        font-size: 14px;
        line-height: 20px;
      }

      .moneple-strip-list {
        display: grid;
        gap: 8px;
        min-width: 0;
      }

      .moneple-strip-list a {
        color: var(--semantic-text-default, #333333);
        font-size: 13px;
        line-height: 18px;
        text-decoration: none;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .moneple-strip-list span {
        color: var(--semantic-text-placeholder, #999999);
        font-weight: 700;
      }

      .moneple-board {
        overflow: hidden;
      }

      .moneple-table-head,
      .moneple-row {
        display: grid;
        grid-template-columns: 92px minmax(0, 1fr) 86px 70px 64px;
        gap: 10px;
        align-items: center;
        min-height: 48px;
        padding: 0 16px;
        font-size: 13px;
        line-height: 18px;
      }

      .moneple-table-head {
        background: var(--semantic-bg-light, #F5F5F5);
        color: var(--semantic-text-placeholder, #999999);
        font-weight: 700;
      }

      .moneple-row {
        border-top: 1px solid var(--semantic-border-default, #EDEDED);
        color: var(--semantic-text-placeholder, #999999);
        text-decoration: none;
      }

      .moneple-row:hover {
        background: var(--semantic-bg-light, #F5F5F5);
      }

      .moneple-row.is-notice {
        background: var(--semantic-primary-bg, #FFFCE4);
      }

      .moneple-board-name {
        color: var(--semantic-text-subtle, #666666);
        font-weight: 600;
      }

      .moneple-post-title {
        min-width: 0;
        overflow: hidden;
        color: var(--semantic-text-default, #333333);
        font-weight: 500;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .moneple-board-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin-top: 4px;
      }

      .moneple-pages {
        display: flex;
        gap: 4px;
      }

      .moneple-pages button {
        width: 32px;
        height: 32px;
        border: 1px solid var(--semantic-border-default, #EDEDED);
        border-radius: 4px;
        background: var(--semantic-bg-white, #FFFFFF);
        color: var(--semantic-text-subtle, #666666);
        font-family: inherit;
      }

      .moneple-pages button:first-child {
        border-color: var(--semantic-text-default, #333333);
        color: var(--semantic-text-default, #333333);
        font-weight: 700;
      }

      .moneple-board-footer label {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--semantic-text-placeholder, #999999);
        font-size: 13px;
      }

      .moneple-board-footer input {
        width: 190px;
        height: 34px;
        padding: 0 12px;
        border: 1px solid var(--semantic-border-default, #EDEDED);
        border-radius: 4px;
        background: var(--semantic-bg-white, #FFFFFF);
        color: var(--semantic-text-default, #333333);
        font-family: inherit;
        font-size: 13px;
      }

      .moneple-mobile-list {
        display: none;
      }

      @media (max-width: 899px) {
        .moneple-shell {
          width: min(100vw - 32px, 560px);
          margin-top: 24px;
          display: block;
          padding-bottom: 48px;
        }

        .moneple-side,
        .moneple-board {
          display: none;
        }

        .moneple-board-header {
          align-items: center;
          padding-bottom: 14px;
        }

        .moneple-board-header h1 {
          font-size: 22px;
          line-height: 30px;
        }

        .moneple-best-strip {
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .moneple-mobile-list {
          display: grid;
          gap: 0;
          overflow: hidden;
          border: 1px solid var(--semantic-border-default, #EDEDED);
          border-radius: 8px;
          background: var(--semantic-bg-white, #FFFFFF);
        }

        .moneple-mobile-post {
          padding: 14px 16px;
          border-top: 1px solid var(--semantic-border-default, #EDEDED);
          color: inherit;
          text-decoration: none;
        }

        .moneple-mobile-post:first-child {
          border-top: 0;
        }

        .moneple-mobile-post.is-notice {
          background: var(--semantic-primary-bg, #FFFCE4);
        }

        .moneple-mobile-post div {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: var(--semantic-text-placeholder, #999999);
          font-size: 12px;
          line-height: 16px;
        }

        .moneple-mobile-post span {
          color: var(--semantic-text-subtle, #666666);
          font-weight: 700;
        }

        .moneple-mobile-post h2 {
          margin: 7px 0 0;
          color: var(--semantic-text-default, #333333);
          font-size: 15px;
          line-height: 22px;
          letter-spacing: 0;
        }

        .moneple-mobile-post p {
          margin: 8px 0 0;
          color: var(--semantic-text-placeholder, #999999);
          font-size: 12px;
          line-height: 16px;
        }

        .moneple-board-footer {
          justify-content: center;
        }

        .moneple-board-footer label {
          display: none;
        }
      }
    `}</style>
  );
}

export default function MonepleCommunityHomeMockup() {
  const isMobile = useIsMobile(900);

  return (
    <MockupLayout
      brand="moneple"
      activeGnbKey="community"
      webview
      webviewTitle="커뮤니티"
      disclaimer="본 화면은 디자인시스템 검토를 위한 목업입니다. Moneple05 실제 앱의 보드 레이아웃과 CSS 변수 체계를 기준으로 구성했습니다."
    >
      <MonepleCommunityStyles />
      <main className="moneple-community">
        <div className="moneple-shell">
          <Sidebar />
          <section className="moneple-content">
            <BoardHeader />
            <BoardTabs />
            <BestStrip />
            {isMobile ? <MobilePostList /> : <PostTable />}
            <BoardFooter />
          </section>
        </div>
      </main>
    </MockupLayout>
  );
}
