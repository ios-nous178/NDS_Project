import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { List, ListItem, Avatar, Badge, Toggle } from "@nudge-design/react";
import { ChevronRightIcon } from "@nudge-design/icons";
import { getComponentDocsDescription } from "../componentDocs";

const meta: Meta = {
  title: "Components/Layout/List",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: getComponentDocsDescription("List"),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const Chevron = () => (
  <ChevronRightIcon size={16} color="var(--semantic-icon-normal-default)" aria-hidden="true" />
);

function CardExample() {
  return (
    <div style={{ width: 360 }}>
      <List variant="card">
        <ListItem
          leading={<Avatar name="김민지" size="sm" />}
          title="김민지 상담사"
          description="가족 / 대인관계 전문"
          trailing={<Chevron />}
          onSelect={() => {}}
        />
        <ListItem
          leading={<Avatar name="박서연" size="sm" />}
          title="박서연 상담사"
          description="우울 / 불안 전문"
          trailing={<Chevron />}
          onSelect={() => {}}
        />
        <ListItem
          leading={<Avatar name="이지훈" size="sm" />}
          title="이지훈 상담사"
          description="청소년 / 진로"
          trailing={
            <Badge variant="fill" color="brand">
              신규
            </Badge>
          }
          onSelect={() => {}}
        />
      </List>
    </div>
  );
}

function SettingsExample() {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <div style={{ width: 360 }}>
      <List variant="card">
        <ListItem
          title="푸시 알림"
          description="앱 푸시 메시지 수신"
          trailing={<Toggle checked={push} onCheckedChange={setPush} />}
        />
        <ListItem
          title="이메일 알림"
          description="중요 알림 이메일 수신"
          trailing={<Toggle checked={email} onCheckedChange={setEmail} />}
        />
        <ListItem
          title="마케팅 수신"
          description="이벤트 및 혜택 안내"
          trailing={<Toggle checked={marketing} onCheckedChange={setMarketing} />}
        />
      </List>
    </div>
  );
}

function PlainNavExample() {
  const [active, setActive] = useState("home");
  const items = [
    { key: "home", label: "홈" },
    { key: "counsel", label: "상담" },
    { key: "test", label: "심리검사" },
    { key: "diary", label: "마음일기" },
    { key: "mypage", label: "마이페이지" },
  ];
  return (
    <div style={{ width: 240 }}>
      <List variant="plain">
        {items.map((it) => (
          <ListItem
            key={it.key}
            title={it.label}
            active={active === it.key}
            onSelect={() => setActive(it.key)}
            trailing={active === it.key ? <Chevron /> : undefined}
            size="sm"
          />
        ))}
      </List>
    </div>
  );
}

function MetadataExample() {
  return (
    <div style={{ width: 360 }}>
      <List variant="divided">
        <ListItem
          leading={<Avatar name="김민지" size="sm" />}
          title="김민지 상담사"
          description="가족 / 대인관계 전문"
          metadata="2026.05.20 · 상담 완료"
          trailing={<Chevron />}
          onSelect={() => {}}
        />
        <ListItem
          leading={<Avatar name="박서연" size="sm" />}
          title="박서연 상담사"
          description="우울 / 불안 전문"
          metadata="2026.05.18 · 상담 예약"
          trailing={<Chevron />}
          onSelect={() => {}}
        />
      </List>
    </div>
  );
}

function DividedExample() {
  return (
    <div style={{ width: 360 }}>
      <List variant="divided">
        <ListItem title="공지사항" trailing={<Chevron />} onSelect={() => {}} />
        <ListItem title="자주 묻는 질문" trailing={<Chevron />} onSelect={() => {}} />
        <ListItem title="이용 약관" trailing={<Chevron />} onSelect={() => {}} />
        <ListItem title="개인정보 처리방침" trailing={<Chevron />} onSelect={() => {}} />
        <ListItem title="버전 정보" trailing="v1.2.3" />
      </List>
    </div>
  );
}

export const CardWithAvatars: Story = {
  tags: ["gallery"],
  name: "Recipe/카드 + 아바타 (상담사 목록)",
  render: () => <CardExample />,
};
export const SettingsList: Story = {
  name: "Recipe/설정 (Toggle trailing)",
  render: () => <SettingsExample />,
};
export const PlainNav: Story = {
  name: "Recipe/Plain (네비게이션)",
  render: () => <PlainNavExample />,
};
export const Divided: Story = { name: "Recipe/Divided (메뉴)", render: () => <DividedExample /> };
export const WithMetadata: Story = {
  tags: ["gallery"],
  name: "Recipe/Metadata 포함 (Title + Description + Metadata)",
  render: () => <MetadataExample />,
};
