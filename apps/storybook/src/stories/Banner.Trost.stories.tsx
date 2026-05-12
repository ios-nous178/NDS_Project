import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Banner } from "@nudge-eap/react";
import { ChevronRightIcon } from "@nudge-eap/icons";

const meta: Meta = {
  title: "Brands/Trost/Banner",
  parameters: { layout: "padded" },
  globals: { brand: "trost" },
};
export default meta;
type Story = StoryObj;

const TROST_ONELINK = "https://trost.onelink.me/";

export const AppDownload: Story = {
  name: "Desktop/앱 다운로드 배너",
  render: () => (
    <Banner
      title="지금 들은 음원이 마음에 들었다면?"
      description="더 많은 수면/힐링 사운드를 트로스트 앱에서 들어보세요."
      actionLabel="앱 다운로드 하기"
      actionHref={TROST_ONELINK}
      imageSrc="/images/home/img-download-app.webp"
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
          padding: "24px 0",
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
              gap: 4,
              marginTop: 16,
              padding: "12px 32px",
              background: "#4968FF",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              borderRadius: 24,
              textDecoration: "none",
            }}
          >
            앱 다운로드 하기
            <ChevronRightIcon size={20} color="var(--eap-icon-inverse-default)" aria-hidden />
          </a>
        </div>
        <img
          src="https://assets.trost.co.kr/images/home/img-download-app.webp"
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
          gap: 10,
        }}
      >
        <img
          src="https://assets.trost.co.kr/images/home/img-trost-channel-toggle.webp"
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
          src="https://assets.trost.co.kr/images/home/img-atoz-guide.webp"
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
      fullImageSrc="https://assets.trost.co.kr/images/home/img-banner-trost-download.webp"
      fullImageSrcSet="https://assets.trost.co.kr/images/home/img-banner-trost-download.webp 320w, https://assets.trost.co.kr/images/home/img-banner-trost-download@2x.webp 640w, https://assets.trost.co.kr/images/home/img-banner-trost-download@3x.webp 960w"
      imageAlt="트로스트 앱 다운로드"
      style={{ aspectRatio: "360 / 96" }}
    />
  ),
};
