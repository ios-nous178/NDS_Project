import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Banner } from "@nudge-design/react";
import { ChevronRightIcon } from "@nudge-design/icons";

const meta: Meta = {
  title: "Brands/Trost/Banner",
  parameters: { layout: "padded" },
  globals: { brand: "trost" },
};
export default meta;
type Story = StoryObj;

const TROST_ONELINK = "https://trost.onelink.me/";
const TROST_DOWNLOAD_APP_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDYiIGhlaWdodD0iMTMwIiB2aWV3Qm94PSIwIDAgMTA2IDEzMCI+PHJlY3Qgd2lkdGg9IjEwNiIgaGVpZ2h0PSIxMzAiIHJ4PSIxNCIgZmlsbD0iI0RERTlGRiIvPjxyZWN0IHg9IjE2IiB5PSIxOCIgd2lkdGg9Ijc0IiBoZWlnaHQ9Ijk0IiByeD0iMTAiIGZpbGw9IiNGRkZGRkYiLz48cmVjdCB4PSIyNyIgeT0iMzIiIHdpZHRoPSI1MiIgaGVpZ2h0PSI1MiIgcng9IjEyIiBmaWxsPSIjNDk2OEZGIiBvcGFjaXR5PSIwLjE0Ii8+PHBhdGggZD0iTTUzIDQwdjI4bTAgMCAxMC0xMG0tMTAgMTAtMTAtMTBNMzggODBoMzAiIHN0cm9rZT0iIzQ5NjhGRiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48dGV4dCB4PSI1MyIgeT0iMTAyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiMzMzMiPlRyb3N0IEFwcDwvdGV4dD48L3N2Zz4=";
const TROST_CHANNEL_TOGGLE_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAxMDAgNjAiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNjAiIHJ4PSIxMiIgZmlsbD0iI0Y0RjVGNyIvPjxyZWN0IHg9IjgiIHk9IjEyIiB3aWR0aD0iODQiIGhlaWdodD0iMzYiIHJ4PSIxOCIgZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSIjRDhEOEQ4Ii8+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMTMiIGZpbGw9IiM0OTY4RkYiLz48cmVjdCB4PSI0NiIgeT0iMjEiIHdpZHRoPSIyOCIgaGVpZ2h0PSIxOCIgcng9IjkiIGZpbGw9IiNFM0U5RkYiLz48L3N2Zz4=";
const TROST_ATOZ_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MiIgaGVpZ2h0PSI3MiIgdmlld0JveD0iMCAwIDcyIDcyIj48cmVjdCB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHJ4PSIxMiIgZmlsbD0iI0VDRUZGRiIvPjx0ZXh0IHg9IjM2IiB5PSIzMSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjMzMzIj5BPC90ZXh0Pjx0ZXh0IHg9IjM2IiB5PSI1MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjNDk2OEZGIj5aPC90ZXh0Pjwvc3ZnPg==";
const TROST_BANNER_FULL_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NjAiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgOTYwIDI1NiI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeDI9IjEiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNFQ0VGRkYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNEQ0U2RkYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iOTYwIiBoZWlnaHQ9IjI1NiIgcng9IjI4IiBmaWxsPSJ1cmwoI2cpIi8+PHJlY3QgeD0iNTYiIHk9IjU2IiB3aWR0aD0iNDQwIiBoZWlnaHQ9IjE0NCIgcng9IjIwIiBmaWxsPSIjRkZGRkZGIi8+PHRleHQgeD0iODgiIHk9IjEyMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjM0IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjMzMzIj5Ucm9zdCBBcHAgRG93bmxvYWQ8L3RleHQ+PHRleHQgeD0iODgiIHk9IjE2MiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iNDAwIiBmaWxsPSIjNDk2OEZGIj5TbGVlcCAmIGhlYWxpbmcgc291bmQ8L3RleHQ+PHJlY3QgeD0iNTk2IiB5PSI0OCIgd2lkdGg9IjI2MCIgaGVpZ2h0PSIxNjAiIHJ4PSIyMiIgZmlsbD0iI0ZGRkZGRiIgb3BhY2l0eT0iMC45Ii8+PGNpcmNsZSBjeD0iNzI2IiBjeT0iMTI4IiByPSI1MCIgZmlsbD0iIzQ5NjhGRiIgb3BhY2l0eT0iMC4xOCIvPjxwYXRoIGQ9Ik03MjYgODR2NTZtMCAwIDIwLTIwbS0yMCAyMC0yMC0yMCIgc3Ryb2tlPSIjNDk2OEZGIiBzdHJva2Utd2lkdGg9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=";

export const AppDownload: Story = {
  name: "Desktop/앱 다운로드 배너",
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

export const CashtalkSubs: Story = {
  name: "Desktop/채널 구독 배너",
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

export const AtoZGuide: Story = {
  name: "Mobile/심리상담 A to Z",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, padding: "0 16px" }}>
        <Story />
      </div>
    ),
  ],
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
        <img
          src={TROST_ATOZ_IMAGE}
          alt=""
          width={72}
          height={72}
          style={{ objectFit: "contain" }}
        />
      </div>
    </Banner>
  ),
};

export const MobileDownload: Story = {
  name: "Mobile/앱 다운로드 이미지 배너",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480, padding: "0 20px" }}>
        <Story />
      </div>
    ),
  ],
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
