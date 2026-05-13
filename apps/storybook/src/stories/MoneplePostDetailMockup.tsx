/**
 * [MONEPLE-POST-DETAIL] 모네플 게시글 상세 목업
 *
 * Reference: /Users/nudge_133/Desktop/모네플05
 * Goal: 실제 게시글 상세의 납작한 보드형 흐름을 DS 시맨틱 토큰으로 재현한다.
 */
import React from "react";
import { Badge, Button, Chip, CommentItem, Textarea } from "@nudge-eap/react";
import { MockupLayout } from "./mockup-layout";

const post = {
  board: "마음건강",
  title: "요즘 별일 아닌 말에도 쉽게 지치는 것 같아요",
  author: "익명 유저",
  date: "2026.05.08 10:16",
  views: 142,
  likes: 12,
  scraps: 3,
  comments: 4,
} as const;

const sideMenus = ["전체글", "BEST 인기글", "공지사항", "자유게시판", "질문게시판"] as const;

const comments = [
  {
    author: "노란노트",
    content: "저도 비슷한 날이 많아요. 잠깐 산책하고 나면 조금 정리가 되더라고요.",
    time: "8분 전",
    like: 2,
  },
  {
    author: "익명 유저",
    content: "말을 꺼내는 것만으로도 도움이 될 때가 있죠. 오늘은 무리하지 마세요.",
    time: "14분 전",
    like: 1,
  },
  {
    author: "하루정리",
    content: "저는 퇴근 후 알림을 끄는 시간을 정해두니 조금 나아졌어요.",
    time: "29분 전",
    like: 0,
  },
] as const;

function MoneplePostDetailStyles() {
  return (
    <style>{`
      .moneple-detail {
        min-height: 100%;
        background: var(--semantic-bg-white, #FFFFFF);
        color: var(--semantic-text-default, #333333);
        font-family: var(--font-web);
      }

      .moneple-detail-shell {
        position: relative;
        width: min(1080px, calc(100vw - 40px));
        margin: 40px auto 0;
        padding-bottom: 80px;
        display: grid;
        grid-template-columns: 220px minmax(0, 780px);
        column-gap: 40px;
        align-items: start;
      }

      .moneple-detail-ad {
        position: absolute;
        top: 140px;
        right: -250px;
        width: 220px;
        min-height: 180px;
        padding: 16px;
        border: 1px solid var(--semantic-border-default, #EDEDED);
        border-radius: 8px;
        background: var(--semantic-bg-light, #F5F5F5);
        color: var(--semantic-text-placeholder, #999999);
        font-size: 12px;
        line-height: 18px;
      }

      .moneple-detail-side,
      .moneple-detail-content {
        min-width: 0;
      }

      .moneple-side-card,
      .moneple-detail-copy,
      .moneple-detail-guide,
      .moneple-comment-composer,
      .moneple-comments {
        border: 1px solid var(--semantic-border-default, #EDEDED);
        border-radius: 8px;
        background: var(--semantic-bg-white, #FFFFFF);
      }

      .moneple-side-card {
        overflow: hidden;
      }

      .moneple-side-card + .moneple-side-card {
        margin-top: 24px;
      }

      .moneple-side-card h2 {
        margin: 0;
        padding: 14px 16px;
        border-bottom: 1px solid var(--semantic-border-default, #EDEDED);
        color: var(--semantic-text-default, #333333);
        font-size: 15px;
        line-height: 22px;
      }

      .moneple-side-card p {
        margin: 0;
        padding: 14px 16px;
        color: var(--semantic-text-placeholder, #999999);
        font-size: 13px;
        line-height: 19px;
      }

      .moneple-side-card button {
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

      .moneple-side-card button:hover {
        background: var(--semantic-bg-light, #F5F5F5);
      }

      .moneple-side-card button.is-active {
        color: var(--semantic-caution-text, #FF9D00);
        font-weight: 700;
      }

      .moneple-detail-content {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .moneple-detail-article {
        padding-bottom: 12px;
      }

      .moneple-label-row {
        display: flex;
        gap: 6px;
        margin-bottom: 16px;
      }

      .moneple-detail-title {
        margin: 0 0 16px;
        color: var(--semantic-text-strong, #151515);
        font-size: 30px;
        font-weight: 700;
        line-height: 40px;
        letter-spacing: 0;
        word-break: break-all;
      }

      .moneple-post-info {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--semantic-border-default, #EDEDED);
      }

      .moneple-author {
        display: flex;
        align-items: center;
        min-width: 0;
        color: var(--semantic-text-strong, #151515);
        font-size: 14px;
        font-weight: 500;
      }

      .moneple-date-stat {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 12px;
        color: var(--semantic-text-placeholder, #999999);
        font-size: 14px;
        line-height: 20px;
        white-space: nowrap;
      }

      .moneple-detail-copy {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 10px 14px;
        color: var(--semantic-text-placeholder, #999999);
        font-size: 13px;
        line-height: 18px;
      }

      .moneple-detail-copy code {
        overflow: hidden;
        color: var(--semantic-text-subtle, #666666);
        font-family: inherit;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .moneple-detail-guide {
        padding: 9px 14px;
        background: var(--semantic-bg-light, #F5F5F5);
        color: var(--semantic-text-subtle, #666666);
        font-size: 13px;
        line-height: 20px;
      }

      .moneple-editor-viewer {
        padding: 12px 0 4px;
        color: var(--semantic-text-default, #333333);
        font-size: 15px;
        line-height: 28px;
        word-break: break-word;
      }

      .moneple-editor-viewer p {
        margin: 0 0 18px;
      }

      .moneple-editor-image {
        margin: 22px 0;
        padding: 18px;
        border: 1px solid var(--semantic-border-default, #EDEDED);
        border-radius: 8px;
        background: var(--semantic-bg-light, #F5F5F5);
      }

      .moneple-editor-image strong {
        display: block;
        color: var(--semantic-text-default, #333333);
        font-size: 14px;
        line-height: 20px;
      }

      .moneple-editor-image span {
        display: block;
        margin-top: 6px;
        color: var(--semantic-text-placeholder, #999999);
        font-size: 13px;
        line-height: 19px;
      }

      .moneple-reactions {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin: 48px 0 20px;
      }

      .moneple-reaction {
        min-width: 84px;
        height: 44px;
        border: 1px solid var(--semantic-border-default, #EDEDED);
        border-radius: 9999px;
        background: var(--semantic-bg-white, #FFFFFF);
        color: var(--semantic-text-default, #333333);
        font-family: inherit;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
      }

      .moneple-reaction.is-active {
        border-color: var(--semantic-primary-main, #FFF42E);
        background: var(--semantic-primary-main, #FFF42E);
      }

      .moneple-icon-menu {
        display: flex;
        justify-content: center;
        gap: 10px;
        padding: 12px 0 20px;
        border-bottom: 1px solid var(--semantic-border-default, #EDEDED);
      }

      .moneple-icon-menu button {
        min-width: 54px;
        padding: 6px 8px;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: var(--semantic-text-placeholder, #999999);
        font-family: inherit;
        font-size: 12px;
        line-height: 18px;
        cursor: pointer;
      }

      .moneple-icon-menu button:hover {
        background: var(--semantic-bg-light, #F5F5F5);
      }

      .moneple-page-buttons {
        display: flex;
        justify-content: space-between;
        gap: 10px;
      }

      .moneple-page-buttons .right {
        display: flex;
        gap: 8px;
      }

      .moneple-comment-composer {
        padding: 16px;
      }

      .moneple-composer-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-top: 10px;
      }

      .moneple-composer-footer span {
        color: var(--semantic-text-placeholder, #999999);
        font-size: 12px;
        line-height: 16px;
      }

      .moneple-comments {
        overflow: hidden;
      }

      .moneple-comments-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 16px;
        border-bottom: 1px solid var(--semantic-border-default, #EDEDED);
      }

      .moneple-comments-head h2 {
        margin: 0;
        color: var(--semantic-text-default, #333333);
        font-size: 16px;
        line-height: 24px;
      }

      .moneple-comment-list {
        padding: 0 16px 16px;
      }

      .moneple-comment-like {
        border: 0;
        background: transparent;
        padding: 0;
        color: var(--semantic-text-placeholder, #999999);
        font-family: inherit;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
      }

      @media (max-width: 899px) {
        .moneple-detail-shell {
          width: min(100vw - 32px, 560px);
          margin-top: 24px;
          display: block;
          padding-bottom: 48px;
        }

        .moneple-detail-side,
        .moneple-detail-ad {
          display: none;
        }

        .moneple-detail-content {
          gap: 16px;
        }

        .moneple-detail-title {
          font-size: 20px;
          line-height: 30px;
        }

        .moneple-post-info {
          flex-direction: column;
          gap: 8px;
        }

        .moneple-date-stat {
          justify-content: flex-start;
          font-size: 13px;
        }

        .moneple-detail-copy {
          align-items: flex-start;
          flex-direction: column;
          gap: 8px;
        }

        .moneple-page-buttons,
        .moneple-composer-footer,
        .moneple-comments-head {
          align-items: flex-start;
          flex-direction: column;
        }

        .moneple-page-buttons .right {
          width: 100%;
          justify-content: flex-end;
        }
      }
    `}</style>
  );
}

function Sidebar() {
  return (
    <aside className="moneple-detail-side">
      <section className="moneple-side-card">
        <h2>커뮤니티</h2>
        {sideMenus.map((menu, index) => (
          <button key={menu} className={index === 0 ? "is-active" : undefined} type="button">
            {menu}
          </button>
        ))}
      </section>
      <section className="moneple-side-card">
        <h2>게시판 안내</h2>
        <p>마음건강에 대한 경험과 고민을 부담 없이 나누는 공간입니다.</p>
      </section>
    </aside>
  );
}

function PostHeader() {
  return (
    <>
      <div className="moneple-label-row">
        <Badge variant="primary" size="sm">
          {post.board}
        </Badge>
        <Badge variant="neutral" size="sm">
          인기글
        </Badge>
      </div>
      <h1 className="moneple-detail-title">{post.title}</h1>
      <div className="moneple-post-info">
        <button className="moneple-author" type="button">
          {post.author}
        </button>
        <div className="moneple-date-stat">
          <span>{post.date}</span>
          <span>조회 {post.views}</span>
          <span>추천 {post.likes}</span>
          <span>스크랩 {post.scraps}</span>
        </div>
      </div>
    </>
  );
}

function UrlCopy() {
  return (
    <div className="moneple-detail-copy">
      <code>https://moneple.com/community/post/129887101</code>
      <Button size="xs" variant="outlined-sub">
        URL 복사
      </Button>
    </div>
  );
}

function ArticleBody() {
  return (
    <div className="moneple-editor-viewer">
      <p>
        요즘은 별일 아닌 말에도 쉽게 지치고, 퇴근하고 나서도 하루 종일 들었던 말들이 계속 떠오르는
        것 같아요.
      </p>
      <p>
        예전에는 그냥 넘길 수 있었던 일인데 요즘은 마음에 오래 남아서 스스로가 너무 예민해진 건
        아닌지 고민됩니다. 비슷한 경험이 있는 분들은 어떻게 쉬어가고 계신가요?
      </p>
      <div className="moneple-editor-image">
        <strong>첨부 이미지 영역</strong>
        <span>
          실제 서비스에서는 에디터 본문에 업로드한 이미지나 임베드 콘텐츠가 이 위치에 표시됩니다.
        </span>
      </div>
      <p>
        오늘은 알림을 잠깐 끄고 산책을 해보려고 합니다. 작은 방법이라도 나눠주시면 참고해볼게요.
      </p>
    </div>
  );
}

function ReactionArea() {
  return (
    <>
      <div className="moneple-reactions">
        <button className="moneple-reaction is-active" type="button">
          추천 {post.likes}
        </button>
        <button className="moneple-reaction" type="button">
          비추천 0
        </button>
      </div>
      <div className="moneple-icon-menu">
        <button type="button">스크랩</button>
        <button type="button">공유</button>
        <button type="button">신고</button>
      </div>
    </>
  );
}

function BottomNavigation() {
  return (
    <div className="moneple-page-buttons">
      <Button variant="outlined-sub" size="sm">
        수정
      </Button>
      <div className="right">
        <Button variant="outlined-sub" size="sm">
          이전글
        </Button>
        <Button size="sm">목록</Button>
      </div>
    </div>
  );
}

function CommentComposer() {
  return (
    <section className="moneple-comment-composer">
      <Textarea placeholder="댓글을 입력하세요" rows={3} />
      <div className="moneple-composer-footer">
        <span>서로를 존중하는 댓글을 남겨주세요.</span>
        <Button size="sm">등록</Button>
      </div>
    </section>
  );
}

function Comments() {
  return (
    <section className="moneple-comments">
      <header className="moneple-comments-head">
        <h2>댓글 {post.comments}</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Chip label="등록순" size="sm" variant="strong" selected />
          <Chip label="최신순" size="sm" variant="outlined" />
        </div>
      </header>
      <div className="moneple-comment-list">
        {comments.map((comment) => (
          <CommentItem
            key={comment.content}
            author={comment.author}
            text={comment.content}
            time={comment.time}
            likeAction={
              <button className="moneple-comment-like" type="button">
                좋아요 {comment.like}
              </button>
            }
            onReply={() => undefined}
          />
        ))}
      </div>
    </section>
  );
}

export default function MoneplePostDetailMockup() {
  return (
    <MockupLayout
      brand="moneple"
      activeGnbKey="community"
      webview
      webviewTitle={post.title}
      disclaimer="본 화면은 디자인시스템 검토를 위한 목업입니다. Moneple05 실제 앱의 게시글 상세 흐름과 DS 시맨틱 토큰을 기준으로 구성했습니다."
    >
      <MoneplePostDetailStyles />
      <main className="moneple-detail">
        <div className="moneple-detail-shell">
          <div className="moneple-detail-ad">PC 게시글 상세 우측 상단 광고 영역</div>
          <Sidebar />
          <section className="moneple-detail-content">
            <article className="moneple-detail-article">
              <PostHeader />
              <UrlCopy />
              <div className="moneple-detail-guide">
                마음건강 게시판은 경험 공유를 위한 공간이며, 전문 상담이나 진단을 대체하지 않습니다.
              </div>
              <ArticleBody />
              <ReactionArea />
            </article>
            <BottomNavigation />
            <CommentComposer />
            <Comments />
          </section>
        </div>
      </main>
    </MockupLayout>
  );
}
