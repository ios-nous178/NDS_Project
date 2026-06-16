import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { List, ListItem, Avatar, Badge, Toggle, Button } from "@nudge-design/react";
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

function ThumbnailExample() {
  const Thumb = () => (
    <div
      aria-hidden="true"
      style={{
        width: 72,
        height: 72,
        borderRadius: 8,
        background: "var(--semantic-bg-surface-subtle)",
        flexShrink: 0,
      }}
    />
  );
  return (
    <div style={{ width: 360 }}>
      <List variant="divided">
        <ListItem
          size="xl"
          leading={<Thumb />}
          title="단호박 닭가슴살 샐러드"
          description="포만감 높은 저칼로리 한 끼"
          metadata="320 kcal · 4.5 ★ · 리뷰 128"
          onSelect={() => {}}
        />
        <ListItem
          size="xl"
          leading={<Thumb />}
          title="그릭요거트 볼"
          description="단백질 가득 아침 식단"
          metadata="210 kcal · 4.7 ★ · 리뷰 86"
          onSelect={() => {}}
        />
      </List>
    </div>
  );
}

/* ─── Trost 가이드 (platform × layout) ─── */

function PcAvatarExample() {
  // PC Avatar — 48 원형 + 이름/역할 + 명시 액션 Button(small·solid). h80(avatarPc).
  const people = [
    { name: "김민지", role: "가족 / 대인관계 전문" },
    { name: "박서연", role: "우울 / 불안 전문" },
    { name: "이지훈", role: "청소년 / 진로" },
  ];
  return (
    <div style={{ width: 520 }}>
      <List variant="divided" platform="pc">
        {people.map((p) => (
          <ListItem
            key={p.name}
            layout="avatar"
            leading={<Avatar name={p.name} size="sm" />}
            title={`${p.name} 상담사`}
            description={p.role}
            trailing={
              <Button size="sm" variant="solid" color="primary">
                상담 예약
              </Button>
            }
          />
        ))}
      </List>
    </div>
  );
}

function PcTableExample() {
  // PC Table — body 가 가로 컬럼 행. date│category│name(flex-spacer)│status(brand). h64(tablePc).
  // 기본 표 전용 — 정렬·페이지네이션·셀 편집이 필요하면 DataTable.
  const rows = [
    { date: "2026.05.20", category: "개인 상담", name: "김민지 상담사", status: "완료" },
    { date: "2026.05.18", category: "심리 검사", name: "박서연 상담사", status: "예약" },
    { date: "2026.05.15", category: "가족 상담", name: "이지훈 상담사", status: "진행 중" },
  ];
  return (
    <div style={{ width: 640 }}>
      <List variant="divided" platform="pc">
        {rows.map((r) => (
          <ListItem key={r.date} layout="table" onSelect={() => {}}>
            <span data-col="date">{r.date}</span>
            <span data-col="category">{r.category}</span>
            <span data-col="name">{r.name}</span>
            <span data-col="status">{r.status}</span>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

function PcCompactExample() {
  // PC Compact — 고밀도 설정/관리자 행. h42(compactPc). 모바일 금지(48 touch 미달).
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [sms, setSms] = useState(false);
  return (
    <div style={{ width: 480 }}>
      <List variant="card" platform="pc">
        <ListItem
          layout="compact"
          title="푸시 알림"
          trailing={<Toggle checked={push} onCheckedChange={setPush} />}
        />
        <ListItem
          layout="compact"
          title="이메일 알림"
          trailing={<Toggle checked={email} onCheckedChange={setEmail} />}
        />
        <ListItem
          layout="compact"
          title="SMS 알림"
          trailing={<Toggle checked={sms} onCheckedChange={setSms} />}
        />
      </List>
    </div>
  );
}

function MobileThumbnailActionExample() {
  // Mobile Thumbnail — h124(thumbnailMobile). 72×72 썸네일 + 3번째 줄 brand 액션 링크.
  const Thumb = () => (
    <div
      aria-hidden="true"
      style={{
        width: 72,
        height: 72,
        borderRadius: 8,
        background: "var(--semantic-bg-surface-subtle)",
        flexShrink: 0,
      }}
    />
  );
  return (
    <div style={{ width: 360 }}>
      <List variant="divided" platform="mobile">
        <ListItem
          layout="thumbnail"
          leading={<Thumb />}
          title="단호박 닭가슴살 샐러드"
          description="포만감 높은 저칼로리 한 끼"
          metadata="320 kcal · 4.5 ★ · 리뷰 128"
          actionLink="주문 다시하기"
          onActionLinkSelect={() => {}}
        />
        <ListItem
          layout="thumbnail"
          leading={<Thumb />}
          title="그릭요거트 볼"
          description="단백질 가득 아침 식단"
          metadata="210 kcal · 4.7 ★ · 리뷰 86"
          actionLink="주문 다시하기"
          onActionLinkSelect={() => {}}
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

function HeaderFooterExample() {
  return (
    <div style={{ width: 360 }}>
      <List
        variant="divided"
        header={
          <>
            <span>공지사항</span>
            <span style={{ color: "var(--semantic-text-muted-default)" }}>전체 12</span>
          </>
        }
        footer={
          <Button fullWidth variant="outlined" size="sm">
            더 보기 (전체 12)
          </Button>
        }
      >
        <ListItem title="6월 정기 점검 안내" trailing={<Chevron />} onSelect={() => {}} />
        <ListItem title="개인정보 처리방침 개정 안내" trailing={<Chevron />} onSelect={() => {}} />
        <ListItem title="신규 상담사 합류 소식" trailing={<Chevron />} onSelect={() => {}} />
      </List>
    </div>
  );
}

export const HeaderFooter: Story = {
  tags: ["gallery"],
  name: "Recipe/header·footer 슬롯 (제목 + 더보기)",
  render: () => <HeaderFooterExample />,
};

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
export const Thumbnail: Story = {
  tags: ["gallery"],
  name: "Recipe/Thumbnail (xl · 72×72 이미지 + 메타)",
  render: () => <ThumbnailExample />,
};
export const WithMetadata: Story = {
  tags: ["gallery"],
  name: "Recipe/Metadata 포함 (Title + Description + Metadata)",
  render: () => <MetadataExample />,
};

/* ─── Trost 가이드 (platform × layout) ─── */
export const PcAvatar: Story = {
  tags: ["gallery"],
  name: "Trost/PC Avatar (layout='avatar' · Button trailing · h80)",
  render: () => <PcAvatarExample />,
};
export const PcTable: Story = {
  tags: ["gallery"],
  name: "Trost/PC Table (layout='table' · 다중 컬럼 · h64)",
  render: () => <PcTableExample />,
};
export const PcCompact: Story = {
  tags: ["gallery"],
  name: "Trost/PC Compact (layout='compact' · 고밀도 · h42)",
  render: () => <PcCompactExample />,
};
export const MobileThumbnailAction: Story = {
  tags: ["gallery"],
  name: "Trost/Mobile Thumbnail (layout='thumbnail' · h124 + 액션 링크)",
  render: () => <MobileThumbnailActionExample />,
};
