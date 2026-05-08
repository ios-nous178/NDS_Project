import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CallControlBar } from "@nudge-eap/react";

const meta: Meta<typeof CallControlBar> = {
  title: "Components/CallControlBar",
  component: CallControlBar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof CallControlBar>;

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

export const VideoCall: Story = {
  name: "Recipe/화상 상담",
  render: function Render() {
    const [muted, setMuted] = useState(false);
    const [camera, setCamera] = useState(true);
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
      const t = setInterval(() => setSeconds((s) => s + 1), 1000);
      return () => clearInterval(t);
    }, []);
    return (
      <div style={{ width: 360 }}>
        <CallControlBar
          duration={formatTime(seconds)}
          muted={muted}
          onMutedChange={setMuted}
          cameraOn={camera}
          onCameraChange={setCamera}
          onEnd={() => alert("통화 종료")}
        />
      </div>
    );
  },
};

export const VoiceCall: Story = {
  name: "Recipe/음성 상담 (스피커)",
  render: function Render() {
    const [muted, setMuted] = useState(false);
    const [speaker, setSpeaker] = useState(false);
    return (
      <div style={{ width: 320 }}>
        <CallControlBar
          duration="03:42"
          muted={muted}
          onMutedChange={setMuted}
          speakerOn={speaker}
          onSpeakerChange={setSpeaker}
          onEnd={() => alert("종료")}
        />
      </div>
    );
  },
};

export const Minimal: Story = {
  name: "Edge/음소거 + 종료만",
  render: function Render() {
    const [muted, setMuted] = useState(false);
    return (
      <div style={{ width: 240 }}>
        <CallControlBar muted={muted} onMutedChange={setMuted} onEnd={() => undefined} />
      </div>
    );
  },
};
