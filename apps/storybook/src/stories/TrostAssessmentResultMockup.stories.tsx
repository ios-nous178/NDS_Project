import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TrostAssessmentResultMockup } from "./TrostAssessmentResultMockup";
import { result, severeResult, crisisInfo } from "./trost-assessment-result-mock-data";

const meta: Meta<typeof TrostAssessmentResultMockup> = {
  title: "Mockups/Trost/Assessment Result",
  component: TrostAssessmentResultMockup,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TrostAssessmentResultMockup>;

export const Default: Story = {
  name: "Desktop / Moderate",
  parameters: { viewport: { defaultViewport: "desktop" } },
  render: () => <TrostAssessmentResultMockup result={result} />,
};

export const Severe: Story = {
  name: "Desktop / Severe (위기 안내)",
  parameters: { viewport: { defaultViewport: "desktop" } },
  render: () => (
    <TrostAssessmentResultMockup result={severeResult} crisis={{ ...crisisInfo, show: true }} />
  ),
};

export const Mobile: Story = {
  name: "Mobile / Moderate",
  parameters: { viewport: { defaultViewport: "mobile1" } },
  render: () => <TrostAssessmentResultMockup result={result} />,
};

export const MobileSevere: Story = {
  name: "Mobile / Severe",
  parameters: { viewport: { defaultViewport: "mobile1" } },
  render: () => (
    <TrostAssessmentResultMockup result={severeResult} crisis={{ ...crisisInfo, show: true }} />
  ),
};
