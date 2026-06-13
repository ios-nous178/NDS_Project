import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { WaveformPlayer } from "@nudge-design/react";

const SAMPLE_AUDIO = "https://www.kozco.com/tech/piano2.wav";

const meta: Meta<typeof WaveformPlayer> = {
  title: "Components/Display/WaveformPlayer",
  component: WaveformPlayer,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof WaveformPlayer>;

export const Playground: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <WaveformPlayer src={SAMPLE_AUDIO} />
    </div>
  ),
};

export const WithPeaks: Story = {
  tags: ["gallery"],
  name: "Recipe/사전 계산된 파형",
  render: () => (
    <div style={{ width: 320 }}>
      <WaveformPlayer
        src={SAMPLE_AUDIO}
        peaks={[
          0.3, 0.5, 0.8, 0.6, 0.9, 0.7, 0.4, 0.5, 0.7, 0.6, 0.3, 0.4, 0.5, 0.8, 0.6, 0.5, 0.3, 0.7,
          0.9, 0.6, 0.4,
        ]}
      />
    </div>
  ),
};

export const CustomColor: Story = {
  name: "Variant/사용자 컬러",
  render: () => (
    <div style={{ width: 320 }}>
      <WaveformPlayer src={SAMPLE_AUDIO} color="var(--semantic-text-status-success)" />
    </div>
  ),
};

export const InChat: Story = {
  name: "Recipe/채팅 음성 메시지",
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--semantic-gap-default)",
        width: 320,
      }}
    >
      <div style={{ alignSelf: "flex-end" }}>
        <WaveformPlayer src={SAMPLE_AUDIO} />
      </div>
      <div style={{ alignSelf: "flex-start" }}>
        <WaveformPlayer src={SAMPLE_AUDIO} color="#666" />
      </div>
    </div>
  ),
};
