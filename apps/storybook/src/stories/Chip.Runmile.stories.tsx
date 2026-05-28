import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "@nudge-design/react";

/**
 * Brands/Runmile/Chip — Figma 172:566.
 *
 * 5 type 매핑 (base Chip API + 시멘틱 토큰 cascade — 별도 컴포넌트 없음):
 *   - assetive1 (default light)   → variant="outlined" color="neutral"
 *   - assetive2 (filled light)    → variant="ghost"    color="neutral"
 *   - main1     (filled brand)    → variant="fill"     color="brand"
 *   - main2     (outlined brand)  → variant="outlined" color="brand"
 *   - secondary (dark inverse)    → variant="fill"     color="neutral" (Runmile fill.neutral = gray900)
 *
 * Runmile semantic.ts 가 fill.neutral.default = gray900, border.normal = gray400 으로
 * 정의돼 있어 별도 override 없이 동작.
 */

const meta: Meta<typeof Chip> = {
  title: "Brands/Runmile/Chip",
  component: Chip,
  parameters: { layout: "padded" },
  globals: { brand: "runmile" },
};
export default meta;
type Story = StoryObj<typeof Chip>;

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--semantic-text-muted-default)",
          fontFamily: "ui-monospace, SFMono-Regular, monospace",
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {children}
      </div>
    </div>
  );
}

export const FiveTypes: Story = {
  name: "5 type 매핑 (Figma 172:566)",
  render: () => (
    <div>
      <Row title='assetive1  =  variant="outlined" color="neutral"'>
        <Chip label="text" variant="outlined" color="neutral" />
      </Row>
      <Row title='assetive2  =  variant="ghost" color="neutral"'>
        <Chip label="text" variant="ghost" color="neutral" />
      </Row>
      <Row title='main1      =  variant="fill" color="brand"'>
        <Chip label="text" variant="fill" color="brand" />
      </Row>
      <Row title='main2      =  variant="outlined" color="brand"'>
        <Chip label="text" variant="outlined" color="brand" />
      </Row>
      <Row title='secondary  =  variant="fill" color="neutral"'>
        <Chip label="text" variant="fill" color="neutral" />
      </Row>
    </div>
  ),
};

export const Selectable: Story = {
  name: "선택 가능 (selected → brand fill)",
  render: () => {
    function Demo() {
      const [active, setActive] = useState(2);
      const labels = ["전체", "5km", "10km", "하프", "풀"];
      return (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {labels.map((label, i) => (
            <Chip
              key={label}
              label={label}
              variant="outlined"
              color="neutral"
              selected={active === i}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      );
    }
    return <Demo />;
  },
};
