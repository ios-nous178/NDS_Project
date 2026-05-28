/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MedicationItem } from "@nudge-design/react";

const meta: Meta<typeof MedicationItem> = {
  title: "Components/MedicationItem",
  component: MedicationItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof MedicationItem>;

const w = (children: React.ReactNode) => <div style={{ width: 420 }}>{children}</div>;

export const Default: Story = {
  name: "State/Default (Read Only)",
  render: () =>
    w(<MedicationItem name="졸로프트" dosage="50mg / 1정" times={["morning"]} note="식후 30분" />),
};

export const WithCheck: Story = {
  name: "State/With Check",
  render: () => {
    const [taken, setTaken] = useState(false);
    return w(
      <MedicationItem
        name="라믹탈"
        dosage="25mg"
        times={["morning", "evening"]}
        note="식후 즉시"
        taken={taken}
        onTakenChange={setTaken}
      />,
    );
  },
};

export const Taken: Story = {
  name: "State/Taken",
  render: () =>
    w(
      <MedicationItem
        name="멜라토닌"
        dosage="3mg"
        times={["bedtime"]}
        taken
        onTakenChange={() => {}}
      />,
    ),
};

export const List: Story = {
  name: "Recipe/Daily List",
  render: () => {
    const [t, setT] = useState<Record<string, boolean>>({ a: true, b: false, c: false });
    return (
      <div
        style={{
          width: 420,
          display: "flex",
          flexDirection: "column",
          gap: "var(--semantic-gap-default)",
        }}
      >
        <MedicationItem
          name="졸로프트"
          dosage="50mg"
          times={["morning"]}
          note="식후 30분"
          taken={t.a}
          onTakenChange={(v) => setT({ ...t, a: v })}
        />
        <MedicationItem
          name="라믹탈"
          dosage="25mg"
          times={["noon", "evening"]}
          taken={t.b}
          onTakenChange={(v) => setT({ ...t, b: v })}
        />
        <MedicationItem
          name="멜라토닌"
          dosage="3mg"
          times={["bedtime"]}
          taken={t.c}
          onTakenChange={(v) => setT({ ...t, c: v })}
        />
      </div>
    );
  },
};
