import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GenietFooter } from "@nudge-design/react";
import { getBrandFixture } from "../brand-fixtures";

const b = getBrandFixture("geniet");

const meta: Meta = {
  title: "Components/Footer",
  parameters: { layout: "fullscreen" },
  globals: { brand: "geniet" },
};
export default meta;
type Story = StoryObj;

export const GenietInfoFooter: Story = {
  name: "Geniet/Mobile",
  render: () => (
    <GenietFooter
      links={b.footer.links}
      company={b.footer.company}
      extra={b.footer.extra}
      logo={{
        src: b.logo.footer.src,
        width: b.logo.footer.width,
        height: b.logo.footer.height,
      }}
    />
  ),
};
