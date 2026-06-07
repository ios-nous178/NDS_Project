import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { VoiceRecorder, type VoiceRecorderState } from "@nudge-design/react";

const meta: Meta<typeof VoiceRecorder> = {
  title: "Components/Domain/VoiceRecorder",
  component: VoiceRecorder,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof VoiceRecorder>;

const useTimer = (state: VoiceRecorderState) => {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (state !== "recording") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [state]);
  return [seconds, setSeconds] as const;
};

export const Playground: Story = {
  render: function Render() {
    const [state, setState] = useState<VoiceRecorderState>("idle");
    const [seconds, setSeconds] = useTimer(state);
    return (
      <div style={{ width: 280 }}>
        <VoiceRecorder
          state={state}
          onStateChange={(s) => {
            if (s === "idle") setSeconds(0);
            setState(s);
          }}
          seconds={seconds}
          onComplete={(sec) => alert(`녹음 완료: ${sec}초`)}
        />
      </div>
    );
  },
};

export const WithMaxLength: Story = {
  name: "Edge/최대 30초",
  render: function Render() {
    const [state, setState] = useState<VoiceRecorderState>("idle");
    const [seconds, setSeconds] = useTimer(state);
    return (
      <div style={{ width: 280 }}>
        <VoiceRecorder
          state={state}
          onStateChange={(s) => {
            if (s === "idle") setSeconds(0);
            setState(s);
          }}
          seconds={seconds}
          maxSeconds={30}
          onComplete={(sec) => alert(`자동 종료 또는 사용자 종료: ${sec}초`)}
        />
      </div>
    );
  },
};

export const Idle: Story = {
  name: "State/대기",
  render: () => <VoiceRecorder state="idle" onStateChange={() => undefined} seconds={0} />,
};

export const Recording: Story = {
  name: "State/녹음 중 (정적)",
  render: () => <VoiceRecorder state="recording" onStateChange={() => undefined} seconds={47} />,
};
