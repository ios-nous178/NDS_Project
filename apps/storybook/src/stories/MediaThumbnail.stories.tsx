import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MediaThumbnail } from "@nudge-eap/react";

const meta: Meta<typeof MediaThumbnail> = {
  title: "Components/MediaThumbnail",
  component: MediaThumbnail,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof MediaThumbnail>;

const SAMPLE = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80";

export const Default: Story = {
  name: "State/Default 16:9",
  render: () => <MediaThumbnail src={SAMPLE} alt="산 풍경" aspectRatio="16/9" width={400} />,
};

export const Square: Story = {
  name: "Ratio/Square",
  render: () => <MediaThumbnail src={SAMPLE} alt="" aspectRatio="1/1" width={200} rounded="lg" />,
};

export const Pill: Story = {
  name: "Rounded/Pill (avatar-like)",
  render: () => <MediaThumbnail src={SAMPLE} alt="" aspectRatio="1/1" width={80} rounded="pill" />,
};

export const Contain: Story = {
  name: "Fit/Contain",
  render: () => (
    <MediaThumbnail
      src={SAMPLE}
      alt="contain"
      aspectRatio="16/9"
      width={400}
      fit="contain"
      rootStyle={{ background: "#F4F5F7" }}
    />
  ),
};

export const Fallback: Story = {
  name: "Recipe/Fallback on Error",
  render: () => (
    <MediaThumbnail
      src="https://invalid.example.com/missing.png"
      fallbackSrc={SAMPLE}
      alt="loaded fallback"
      aspectRatio="16/9"
      width={400}
    />
  ),
};

export const Placeholder: Story = {
  name: "State/Placeholder (no fallback)",
  render: () => (
    <MediaThumbnail
      src="https://invalid.example.com/missing2.png"
      alt="placeholder"
      aspectRatio="16/9"
      width={400}
    />
  ),
};
