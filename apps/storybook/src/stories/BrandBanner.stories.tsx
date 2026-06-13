import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Banner } from "@nudge-design/react";
import { ChevronRightIcon } from "@nudge-design/icons";

/**
 * Brands/Banner — 공용 `Banner` 컴포넌트의 브랜드별 사용 예시를 한 파일에 모은 카탈로그.
 * 컴포넌트는 하나(Banner)지만 브랜드마다 카피·색(인라인 `--nds-banner-*`)·이미지가 다르다.
 * 각 스토리가 `globals.brand` 로 테마를 건다.
 */

const meta: Meta = {
  title: "Brands/Banner",
  // 사이드바·docs 에서 숨김 — "Brands/<Brand>/개요" mdx 의 <Canvas> 로 본다.
  tags: ["!dev", "!autodocs"],
  parameters: { layout: "padded" },
};
export default meta;
type Story = StoryObj;

const mobileFrame = (Story: React.ComponentType, maxWidth = 480, padding?: string) => (
  <div style={{ maxWidth, ...(padding ? { padding } : null) }}>
    <Story />
  </div>
);

/* ═══════════════════ NudgeEAP ═══════════════════ */

export const NudgeEAPIntro: Story = {
  name: "NudgeEAP/Desktop · EAP 프로그램 안내",
  globals: { brand: "nudge-eap" },
  render: () => (
    <Banner
      title="직원 심리 건강, 지금 시작하세요"
      description="넛지 EAP 프로그램으로 조직의 멘탈 헬스를 관리하세요."
      actionLabel="도입 문의하기"
      actionHref="https://eapkorea.co.kr"
      style={
        {
          "--nds-banner-background": "var(--semantic-bg-brand-subtle)",
          "--nds-banner-radius": "8px",
          "--nds-banner-action-color": "var(--semantic-text-brand-default)",
        } as React.CSSProperties
      }
    />
  ),
};

export const NudgeEAPTestRecommend: Story = {
  name: "NudgeEAP/Mobile · 심리검사 추천",
  globals: { brand: "nudge-eap" },
  decorators: [(Story) => mobileFrame(Story)],
  render: () => (
    <Banner
      title="번아웃이 의심되시나요?"
      description="3분 자가진단으로 현재 상태를 확인해 보세요."
      actionLabel="검사 시작하기"
      style={
        {
          "--nds-banner-background": "var(--semantic-bg-brand-subtle)",
          "--nds-banner-radius": "8px",
          "--nds-banner-title-font-size": "16px",
          "--nds-banner-desc-font-size": "14px",
          "--nds-banner-action-font-size": "14px",
          "--nds-banner-action-color": "var(--semantic-text-brand-default)",
        } as React.CSSProperties
      }
    />
  ),
};

export const NudgeEAPAppDownload: Story = {
  name: "NudgeEAP/Mobile · 앱 다운로드",
  globals: { brand: "nudge-eap" },
  decorators: [(Story) => mobileFrame(Story)],
  render: () => (
    <Banner
      variant="outlined"
      title="넛지 EAP 앱에서 더 편리하게"
      description="언제 어디서든 상담 신청과 심리검사를 받아보세요."
      actionLabel="앱 다운로드"
      actionHref="#"
      style={
        {
          "--nds-banner-radius": "8px",
        } as React.CSSProperties
      }
    />
  ),
};

/* ═══════════════════ Geniet ═══════════════════ */

export const GenietHealthyDeal: Story = {
  name: "Geniet/Desktop · 헬시딜 프로모션",
  globals: { brand: "geniet" },
  render: () => (
    <Banner
      title="오늘의 헬시딜"
      description="건강한 식품을 특가로 만나보세요. 매일 새로운 상품이 업데이트됩니다."
      actionLabel="헬시딜 보러가기"
      actionHref="/cashdeal"
      imageSrc="https://placehold.co/120x120/E4F6F7/48C2C5?text=Deal"
      imageWidth={120}
      imageHeight={120}
      style={
        {
          "--nds-banner-background": "#E4F6F7",
          "--nds-banner-radius": "12px",
          "--nds-banner-action-color": "#48C2C5",
        } as React.CSSProperties
      }
    />
  ),
};

export const GenietFriendInvite: Story = {
  name: "Geniet/Mobile · 친구초대 이벤트",
  globals: { brand: "geniet" },
  decorators: [(Story) => mobileFrame(Story)],
  render: () => (
    <Banner
      title="친구 초대하고 포인트 받기"
      description="초대한 친구가 가입하면 서로 1,000P를 드려요."
      actionLabel="친구 초대하기"
      style={
        {
          "--nds-banner-background": "#ECF8F9",
          "--nds-banner-radius": "8px",
          "--nds-banner-title-font-size": "16px",
          "--nds-banner-desc-font-size": "14px",
          "--nds-banner-action-color": "#48C2C5",
        } as React.CSSProperties
      }
    />
  ),
};

export const GenietDietRecord: Story = {
  name: "Geniet/Mobile · 식단 기록 유도",
  globals: { brand: "geniet" },
  decorators: [(Story) => mobileFrame(Story)],
  render: () => (
    <Banner
      variant="outlined"
      title="오늘 뭐 드셨나요?"
      description="식단을 기록하고 건강 리포트를 받아보세요."
      actionLabel="기록하기"
      actionHref="/record"
      style={
        {
          "--nds-banner-radius": "8px",
        } as React.CSSProperties
      }
    />
  ),
};

/* ═══════════════════ Trost ═══════════════════ */

const TROST_ONELINK = "https://trost.onelink.me/";
const TROST_DOWNLOAD_APP_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDYiIGhlaWdodD0iMTMwIiB2aWV3Qm94PSIwIDAgMTA2IDEzMCI+PHJlY3Qgd2lkdGg9IjEwNiIgaGVpZ2h0PSIxMzAiIHJ4PSIxNCIgZmlsbD0iI0RERTlGRiIvPjxyZWN0IHg9IjE2IiB5PSIxOCIgd2lkdGg9Ijc0IiBoZWlnaHQ9Ijk0IiByeD0iMTAiIGZpbGw9IiNGRkZGRkYiLz48cmVjdCB4PSIyNyIgeT0iMzIiIHdpZHRoPSI1MiIgaGVpZ2h0PSI1MiIgcng9IjEyIiBmaWxsPSIjNDk2OEZGIiBvcGFjaXR5PSIwLjE0Ii8+PHBhdGggZD0iTTUzIDQwdjI4bTAgMCAxMC0xMG0tMTAgMTAtMTAtMTBNMzggODBoMzAiIHN0cm9rZT0iIzQ5NjhGRiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48dGV4dCB4PSI1MyIgeT0iMTAyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiMzMzMiPlRyb3N0IEFwcDwvdGV4dD48L3N2Zz4=";
const TROST_CHANNEL_TOGGLE_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAxMDAgNjAiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNjAiIHJ4PSIxMiIgZmlsbD0iI0Y0RjVGNyIvPjxyZWN0IHg9IjgiIHk9IjEyIiB3aWR0aD0iODQiIGhlaWdodD0iMzYiIHJ4PSIxOCIgZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSIjRDhEOEQ4Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMTMiIGZpbGw9IiM0OTY4RkYiLz48cmVjdCB4PSI0NiIgeT0iMjEiIHdpZHRoPSIyOCIgaGVpZ2h0PSIxOCIgcng9IjkiIGZpbGw9IiNFM0U5RkYiLz48L3N2Zz4=";
const TROST_ATOZ_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MiIgaGVpZ2h0PSI3MiIgdmlld0JveD0iMCAwIDcyIDcyIj48cmVjdCB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHJ4PSIxMiIgZmlsbD0iI0VDRUZGRiIvPjx0ZXh0IHg9IjM2IiB5PSIzMSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjMzMzIj5BPC90ZXh0Pjx0ZXh0IHg9IjM2IiB5PSI1MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjNDk2OEZGIj5aPC90ZXh0Pjwvc3ZnPg==";
const TROST_BANNER_FULL_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NjAiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgOTYwIDI1NiI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeDI9IjEiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNFQ0VGRkYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNEQ0U2RkYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iOTYwIiBoZWlnaHQ9IjI1NiIgcng9IjI4IiBmaWxsPSJ1cmwoI2cpIi8+PHJlY3QgeD0iNTYiIHk9IjU2IiB3aWR0aD0iNDQwIiBoZWlnaHQ9IjE0NCIgcng9IjIwIiBmaWxsPSIjRkZGRkZGIi8+PHRleHQgeD0iODgiIHk9IjEyMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjM0IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjMzMzIj5Ucm9zdCBBcHAgRG93bmxvYWQ8L3RleHQ+PHRleHQgeD0iODgiIHk9IjE2MiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iNDAwIiBmaWxsPSIjNDk2OEZGIj5TbGVlcCAmIGhlYWxpbmcgc291bmQ8L3RleHQ+PHJlY3QgeD0iNTk2IiB5PSI0OCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIxNjAiIHJ4PSIyMiIgZmlsbD0iI0ZGRkZGRiIgb3BhY2l0eT0iMC45Ii8+PGNpcmNsZSBjeD0iNzI2IiBjeT0iMTI4IiByPSI1MCIgZmlsbD0iIzQ5NjhGRiIgb3BhY2l0eT0iMC4xOCIvPjxwYXRoIGQ9Ik03MjYgODR2NTZtMCAwIDIwLTIwbS0yMCAyMC0yMC0yMCIgc3Ryb2tlPSIjNDk2OEZGIiBzdHJva2Utd2lkdGg9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=";

export const TrostAppDownload: Story = {
  name: "Trost/Desktop · 앱 다운로드 배너",
  globals: { brand: "trost" },
  render: () => (
    <Banner
      title="지금 들은 음원이 마음에 들었다면?"
      description="더 많은 수면/힐링 사운드를 트로스트 앱에서 들어보세요."
      actionLabel="앱 다운로드 하기"
      actionHref={TROST_ONELINK}
      imageSrc={TROST_DOWNLOAD_APP_IMAGE}
      imageAlt="트로스트 앱"
      imageWidth={106}
      imageHeight={130}
      style={
        {
          "--nds-banner-background": "var(--color-cobalt-100, #EDF0FF)",
          "--nds-banner-padding": "0 40px 0 32px",
          "--nds-banner-radius": "12px",
          "--nds-banner-title-font-size": "22px",
          "--nds-banner-title-line-height": "1.36",
          "--nds-banner-desc-font-size": "18px",
          "--nds-banner-desc-color": "var(--color-gray-800, #333)",
          "--nds-banner-action-font-size": "16px",
          "--nds-banner-action-color": "#FFFFFF",
        } as React.CSSProperties
      }
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "var(--semantic-inset-modal) 0",
        }}
      >
        <div>
          <div
            className="nds-banner__title"
            style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.36, marginBottom: 4 }}
          >
            지금 들은 음원이 마음에 들었다면?
          </div>
          <div
            className="nds-banner__description"
            style={{ fontSize: 18, lineHeight: 1.44, color: "#333" }}
          >
            더 많은 수면/힐링 사운드를 트로스트 앱에서 들어보세요.
          </div>
          <a
            href={TROST_ONELINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--semantic-gap-tight)",
              marginTop: 16,
              padding: "var(--semantic-inset-input) 32px",
              background: "#4968FF",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              borderRadius: 24,
              textDecoration: "none",
            }}
          >
            앱 다운로드 하기
            <ChevronRightIcon size={20} color="var(--semantic-icon-inverse-default)" aria-hidden />
          </a>
        </div>
        <img
          src={TROST_DOWNLOAD_APP_IMAGE}
          alt="앱"
          width={106}
          height={130}
          style={{ marginRight: 0, flexShrink: 0 }}
        />
      </div>
    </Banner>
  ),
};

export const TrostCashtalkSubs: Story = {
  name: "Trost/Desktop · 채널 구독 배너",
  globals: { brand: "trost" },
  render: () => (
    <Banner
      style={
        {
          "--nds-banner-background": "var(--color-gray-cool-100, #F4F5F7)",
          "--nds-banner-radius": "12px",
          "--nds-banner-padding": "2px 24px",
          height: 64,
        } as React.CSSProperties
      }
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          gap: "var(--semantic-gap-default)",
        }}
      >
        <img
          src={TROST_CHANNEL_TOGGLE_IMAGE}
          alt=""
          width={100}
          height={60}
          style={{ objectFit: "contain" }}
        />
        <span style={{ fontSize: 18, fontWeight: 700, lineHeight: "1.44" }}>
          트로스트 채널 소식 받기
        </span>
        <a
          href="#"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 2,
            fontSize: 16,
            fontWeight: 500,
            color: "#4968FF",
            textDecoration: "none",
            marginLeft: 8,
          }}
        >
          채널 바로가기
          <ChevronRightIcon size={20} color="#4968FF" aria-hidden />
        </a>
      </div>
    </Banner>
  ),
};

export const TrostAtoZGuide: Story = {
  name: "Trost/Mobile · 심리상담 A to Z",
  globals: { brand: "trost" },
  decorators: [(Story) => mobileFrame(Story, 480, "0 16px")],
  render: () => (
    <Banner
      style={
        {
          "--nds-banner-background": "#ECEFFF",
          "--nds-banner-radius": "8px",
          "--nds-banner-padding": "0 13px 0 20px",
          height: 86,
        } as React.CSSProperties
      }
      href="https://humartcompany.notion.site/6-A-to-Z-f5cb4991953e4fcd8157c67a1a1ff09d"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.38, color: "#333" }}>
            이런 고민도 상담을 받아도 되나요?
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              lineHeight: 1.5,
              color: "#4968FF",
              marginTop: 2,
            }}
          >
            심리상담 A to Z
          </div>
        </div>
        <img src={TROST_ATOZ_IMAGE} alt="" width={72} height={72} style={{ objectFit: "contain" }} />
      </div>
    </Banner>
  ),
};

export const TrostMobileDownload: Story = {
  name: "Trost/Mobile · 앱 다운로드 이미지 배너",
  globals: { brand: "trost" },
  decorators: [(Story) => mobileFrame(Story, 480, "0 20px")],
  render: () => (
    <Banner
      variant="image"
      href={TROST_ONELINK}
      fullImageSrc={TROST_BANNER_FULL_IMAGE}
      imageAlt="트로스트 앱 다운로드"
      style={{ aspectRatio: "360 / 96" }}
    />
  ),
};
