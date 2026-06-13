import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Article, AttachmentItem, LikeButton } from "@nudge-design/react";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta = {
  title: "Components/Display/Article",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: getComponentDocsDescription("Article"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const BODY_HTML = `
  <p>안녕하세요, 운영팀입니다. 보다 안정적인 서비스 제공을 위해 아래 일정에 정기 점검을 진행합니다.</p>
  <ul>
    <li><strong>일시</strong>: 2026년 6월 20일(토) 02:00 ~ 05:00</li>
    <li><strong>영향</strong>: 점검 중 로그인 및 상담 예약 일시 중단</li>
  </ul>
  <p>이용에 불편을 드려 죄송합니다. 점검 완료 후 정상 운영됩니다.</p>
`;

/* ─── 대표: 공지 상세 (제목+메타 / 본문 / 첨부 / 액션) ─── */

export const Notice: Story = {
  tags: ["gallery"],
  name: "공지 상세",
  render: function Render() {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(12);
    return (
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <Article.Root>
          <Article.Header title="6월 정기 점검 안내">
            <span>운영팀</span>
            <span>·</span>
            <span>2026.06.13</span>
            <span>·</span>
            <span>조회 1,204</span>
          </Article.Header>
          <Article.Body html={BODY_HTML} />
          <Article.Attachments label="첨부파일">
            <AttachmentItem name="점검안내문.pdf" size={284_000} href="#" />
          </Article.Attachments>
          <Article.Actions>
            <LikeButton
              liked={liked}
              count={count}
              onChange={(next) => {
                setLiked(next);
                setCount((c) => c + (next ? 1 : -1));
              }}
            />
          </Article.Actions>
        </Article.Root>
      </div>
    );
  },
};

/* ─── 본문만 (FAQ 상세 등 첨부/액션 없는 케이스) ─── */

export const BodyOnly: Story = {
  tags: ["gallery"],
  name: "본문만 (FAQ 상세)",
  render: () => (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <Article.Root>
        <Article.Header title="환불은 어떻게 받나요?" level={3} />
        <Article.Body html="<p>결제일로부터 7일 이내, 미사용 상태인 경우 마이페이지 > 결제내역에서 환불을 신청할 수 있어요. 자세한 기준은 환불 정책을 참고해 주세요.</p>" />
      </Article.Root>
    </div>
  ),
};
