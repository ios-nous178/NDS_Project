import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { VideoPlayer } from "@nudge-design/react";

const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const SAMPLE_POSTER =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg";

const meta: Meta<typeof VideoPlayer> = {
  title: "Components/Display/VideoPlayer",
  component: VideoPlayer,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof VideoPlayer>;

export const Playground: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <VideoPlayer
        src={SAMPLE_VIDEO}
        poster={SAMPLE_POSTER}
        title="Big Buck Bunny"
        durationLabel="9:56"
      />
    </div>
  ),
};

export const NativeControls: Story = {
  name: "Variant/네이티브 컨트롤",
  render: () => (
    <div style={{ width: 480 }}>
      <VideoPlayer src={SAMPLE_VIDEO} poster={SAMPLE_POSTER} nativeControls />
    </div>
  ),
};

export const Square: Story = {
  name: "Variant/1:1 비율",
  render: () => (
    <div style={{ width: 320 }}>
      <VideoPlayer
        src={SAMPLE_VIDEO}
        poster={SAMPLE_POSTER}
        aspectRatio="1 / 1"
        title="짧은 명상"
      />
    </div>
  ),
};

export const NoTitle: Story = {
  name: "Recipe/제목 없이",
  render: () => (
    <div style={{ width: 480 }}>
      <VideoPlayer src={SAMPLE_VIDEO} poster={SAMPLE_POSTER} />
    </div>
  ),
};
