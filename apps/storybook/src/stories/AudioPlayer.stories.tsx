/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AudioPlayer } from "@nudge-eap/react";

const meta: Meta<typeof AudioPlayer> = {
  title: "Components/AudioPlayer",
  component: AudioPlayer,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof AudioPlayer>;

export const Default: Story = {
  name: "State/Default",
  render: () => {
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState(0);
    return (
      <div style={{ width: 420 }}>
        <AudioPlayer
          title="마음을 편안하게 하는 호흡 명상"
          subtitle="10분 가이드 · 박지수"
          playing={playing}
          onPlayPause={setPlaying}
          currentTime={time}
          duration={600}
          onSeek={setTime}
        />
      </div>
    );
  },
};

export const Playing: Story = {
  name: "State/Playing Midway",
  render: () => {
    const [playing, setPlaying] = useState(true);
    const [time, setTime] = useState(180);
    return (
      <div style={{ width: 420 }}>
        <AudioPlayer
          title="잠들기 전 바디스캔"
          subtitle="15분 가이드"
          playing={playing}
          onPlayPause={setPlaying}
          currentTime={time}
          duration={900}
          onSeek={setTime}
        />
      </div>
    );
  },
};

export const WithSkip: Story = {
  name: "Recipe/Series Player",
  render: () => {
    const [playing, setPlaying] = useState(false);
    const [time, setTime] = useState(45);
    return (
      <div style={{ width: 420 }}>
        <AudioPlayer
          title="스트레스 해소 시리즈 (3/7)"
          subtitle="이완 호흡법"
          playing={playing}
          onPlayPause={setPlaying}
          currentTime={time}
          duration={420}
          onSeek={setTime}
          onSkipBack={() => {}}
          onSkipForward={() => {}}
        />
      </div>
    );
  },
};
