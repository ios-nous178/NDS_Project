import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ContentViewer } from "@nudge-design/react";

const meta: Meta<typeof ContentViewer> = {
  title: "Components/Domain/ContentViewer",
  component: ContentViewer,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ContentViewer>;

const w = (children: React.ReactNode) => <div style={{ maxWidth: 720 }}>{children}</div>;

const articleHtml = `
<h2>오늘의 명상 가이드</h2>
<p>편안한 자리에 앉아 어깨에 힘을 빼고, <strong>천천히 호흡</strong>에 집중해보세요. 자연스럽게 들어오고 나가는 숨에만 주의를 기울입니다.</p>
<h3>5분 호흡 명상 단계</h3>
<ol>
  <li>4초간 코로 천천히 들이쉽니다.</li>
  <li>2초간 멈춥니다.</li>
  <li>6초간 입으로 길게 내쉽니다.</li>
  <li>이 호흡을 5분간 반복합니다.</li>
</ol>
<blockquote>호흡이 어려우면 멈추지 말고, 그저 평소처럼 숨쉬는 것에 집중해도 충분합니다.</blockquote>
<p>참고 자료: <a href="https://example.com/meditation">공식 명상 가이드</a></p>
`;

export const Default: Story = {
  name: "State/Default",
  render: () => w(<ContentViewer html={articleHtml} />),
};

const phqHtml = `
<h3>PHQ-9 결과 해석</h3>
<p>총점 <strong>14점</strong>은 <em>중등도 우울</em>에 해당합니다. 지난 2주간 일상에 영향을 주는 증상이 자주 나타났음을 의미합니다.</p>
<h4>권장 다음 단계</h4>
<ul>
  <li>전문 상담사와 상담을 시작</li>
  <li>일상에서 가능한 활동량 확보 (산책 등)</li>
  <li>4주 후 재검사로 추이 확인</li>
</ul>
<p>주의: 자해·자살 사고가 있다면 <strong>1393</strong>(자살예방상담)으로 연락해 주세요.</p>
`;

export const AssessmentExplanation: Story = {
  name: "Recipe/Assessment Explanation",
  render: () => w(<ContentViewer html={phqHtml} />),
};

const dangerousHtml = `
<p>본문 안전 처리 데모입니다.</p>
<script>alert("xss")</script>
<p onclick="alert('xss')">이 단락의 onclick은 자동 제거됩니다.</p>
<p>안전한 링크는 그대로: <a href="https://example.com">example</a></p>
<p>위험한 링크는 차단: <a href="javascript:alert('xss')">click</a></p>
`;

export const Sanitized: Story = {
  name: "Recipe/Sanitize Dangerous HTML",
  render: () =>
    w(
      <>
        <h4 style={{ margin: "0 0 8px" }}>입력 HTML</h4>
        <pre
          style={{
            background: "#F4F5F7",
            padding: "var(--semantic-inset-input)",
            fontSize: 12,
            marginBottom: 16,
            whiteSpace: "pre-wrap",
          }}
        >
          {dangerousHtml}
        </pre>
        <h4 style={{ margin: "0 0 8px" }}>렌더 결과 (sanitize 자동)</h4>
        <ContentViewer html={dangerousHtml} />
      </>,
    ),
};
