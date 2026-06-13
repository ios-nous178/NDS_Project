import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader, Button, Breadcrumb, Tabs } from "@nudge-design/react";

const meta: Meta<typeof PageHeader> = {
  title: "Components/Layout/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Playground: Story = {
  render: () => (
    <PageHeader
      title="감정 일기"
      subtitle="이번 주 4번 기록했어요"
      actions={<Button size="md">새 글 쓰기</Button>}
      bordered
    />
  ),
};

export const WithBack: Story = {
  tags: ["gallery"],
  name: "Recipe/뒤로가기",
  render: () => (
    <PageHeader
      title="상담 상세"
      subtitle="2026-05-15 14:00 · 김민지 상담사"
      onBack={() => alert("뒤로")}
      bordered
    />
  ),
};

export const WithBreadcrumb: Story = {
  tags: ["gallery"],
  name: "Recipe/브레드크럼 + 액션",
  render: () => (
    <PageHeader
      breadcrumb={
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "콘텐츠", href: "/contents" },
            { label: "마음챙김 가이드" },
          ]}
        />
      }
      title="마음챙김 가이드"
      subtitle="하루 5분, 호흡과 함께 시작하는 명상"
      actions={
        <>
          <Button variant="outlined">공유</Button>
          <Button>구독</Button>
        </>
      }
      bordered
    />
  ),
};

export const WithBottomTabs: Story = {
  name: "Recipe/하단 탭 (필터)",
  render: function Render() {
    const [tab, setTab] = React.useState("all");
    return (
      <PageHeader
        title="콘텐츠"
        bottom={
          <div style={{ padding: "0 24px" }}>
            <Tabs
              items={[
                { key: "all", title: "전체" },
                { key: "meditation", title: "명상" },
                { key: "sleep", title: "수면" },
                { key: "stress", title: "스트레스" },
              ]}
              activeKey={tab}
              onTabChange={setTab}
            />
          </div>
        }
        bordered
      />
    );
  },
};

export const NoSubtitle: Story = {
  name: "Edge/제목만",
  render: () => <PageHeader title="설정" bordered />,
};
