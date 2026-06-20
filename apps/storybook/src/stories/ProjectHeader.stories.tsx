import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NdsTag, ProjectScope } from "./_ndsTag";

/**
 * 프로젝트 완성형 헤더 — 목업 전용 html `nds-project-chrome`(`<nds-project-header project surface>`).
 * 공개 react 프로젝트 chrome 은 chrome 정리에서 제거됨. 프로젝트 로고·메뉴·CTA·색은 PROJECT_DATA SSOT.
 */
const meta: Meta = {
  title: "Projects/Header",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

const PROJECTS = ["nudge-eap", "trost", "geniet", "cashwalk-biz", "runmile"] as const;

const labelStyle: React.CSSProperties = {
  margin: "0 0 8px",
  padding: "0 16px",
  fontSize: 12,
  fontWeight: 700,
  color: "var(--semantic-text-subtle-default, #888)",
  fontFamily: "var(--font-family-default, sans-serif)",
  textTransform: "uppercase",
  letterSpacing: 0.4,
};

const sectionStyle: React.CSSProperties = { marginBottom: 40 };

/** 프로젝트별 헤더 스택 — 라벨 + nds-project-header. */
function HeaderStack({ surface, frameWidth }: { surface: string; frameWidth?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {PROJECTS.map((project) => (
        <div key={project} style={sectionStyle}>
          <p style={labelStyle}>
            {project} · {surface}
          </p>
          <div
            style={
              frameWidth
                ? {
                    width: frameWidth,
                    border: "1px solid var(--semantic-border-subtle-default, #eee)",
                    borderRadius: 12,
                    overflow: "hidden",
                  }
                : undefined
            }
          >
            <ProjectScope project={project}>
              <NdsTag
                tag="nds-project-header"
                attrs={{ project, surface, "active-key": "home" }}
              />
            </ProjectScope>
          </div>
        </div>
      ))}
    </div>
  );
}

export const Web: Story = {
  name: "Web (데스크탑)",
  render: () => <HeaderStack surface="web" />,
};

export const Mobile: Story = {
  name: "Mobile (앱)",
  render: () => <HeaderStack surface="mobile" frameWidth={360} />,
};

export const Webview: Story = {
  name: "Webview (뒤로가기+타이틀)",
  render: () => <HeaderStack surface="webview" frameWidth={360} />,
};
