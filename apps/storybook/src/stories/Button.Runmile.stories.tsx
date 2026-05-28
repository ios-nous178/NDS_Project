import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@nudge-design/react";

/**
 * Brands/Runmile/Button — Figma 111:477.
 *
 * 3 sematic (Primary / Secondary / Assistive) × 2 style (Solid / Outlined) × 5 size (Mini/Small/Medium/Large/XL) × 3 state.
 * 매핑 키:
 *   - Solid/Primary    → variant="solid"   color="primary"
 *   - Solid/Secondary  → variant="solid"   color="secondary"    (Runmile = black bg + white text)
 *   - Solid/Assistive  → variant="solid"   color="assistive"
 *   - Outlined/Primary → variant="outlined" color="primary"
 *   - Outlined/Secondary → variant="outlined" color="secondary"
 *   - Outlined/Assistive → variant="outlined" color="assistive"
 *
 * 모든 색은 시멘틱 토큰 cascade. brand="runmile" data-attribute 가 있으면 자동.
 */

const meta: Meta<typeof Button> = {
  title: "Brands/Runmile/Button",
  component: Button,
  parameters: { layout: "padded" },
  globals: { brand: "runmile" },
};
export default meta;
type Story = StoryObj<typeof Button>;

const SIZES = ["sm", "md", "lg", "xl"] as const;
type Size = (typeof SIZES)[number];

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginBottom: 24,
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
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        {children}
      </div>
    </div>
  );
}

function ColorMatrix({ variant }: { variant: "solid" | "outlined" }) {
  return (
    <>
      {(["primary", "secondary", "assistive"] as const).map((color) => (
        <Row key={color} title={`${variant} · ${color}`}>
          {SIZES.map((size) => (
            <Button key={size} variant={variant} color={color} size={size}>
              text
            </Button>
          ))}
          <Button variant={variant} color={color} size="md" disabled>
            disabled
          </Button>
        </Row>
      ))}
    </>
  );
}

export const Solid: Story = {
  name: "Solid (Primary / Secondary / Assistive × Size + Disabled)",
  render: () => <ColorMatrix variant="solid" />,
};

export const Outlined: Story = {
  name: "Outlined (Primary / Secondary / Assistive × Size + Disabled)",
  render: () => <ColorMatrix variant="outlined" />,
};

export const Comparison: Story = {
  name: "Figma 비교 (Large × 6 condition)",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Row title="Solid">
        <Button variant="solid" color="primary" size="lg">
          text
        </Button>
        <Button variant="solid" color="secondary" size="lg">
          text
        </Button>
        <Button variant="solid" color="assistive" size="lg">
          text
        </Button>
      </Row>
      <Row title="Outlined">
        <Button variant="outlined" color="primary" size="lg">
          text
        </Button>
        <Button variant="outlined" color="secondary" size="lg">
          text
        </Button>
        <Button variant="outlined" color="assistive" size="lg">
          text
        </Button>
      </Row>
    </div>
  ),
};
