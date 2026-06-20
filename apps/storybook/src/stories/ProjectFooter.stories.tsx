import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NdsTag, ProjectScope } from "./_ndsTag";

/**
 * 프로젝트 완성형 푸터 — 목업 전용 html `<nds-project-footer project surface>`.
 * 각 프로젝트는 **native footer surface 하나**만 가진다:
 *   · Web(데스크탑): nudge-eap · cashwalk-biz
 *   · App(모바일):  trost(dark) · geniet · runmile
 * 그래서 데스크탑 스토리에 app 전용 프로젝트가 안 보이는 건 "미구현"이 아니라 surface 차이다.
 */
const meta: Meta = {
  title: "Projects/Footer",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

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

/** 프로젝트별 푸터 (프로젝트+native surface). 각 프로젝트 색을 ProjectScope 로 스코프. */
function FooterRow({ project, surface }: { project: string; surface: string }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <p style={labelStyle}>
        {project} · {surface}
      </p>
      <ProjectScope project={project}>
        <NdsTag tag="nds-project-footer" attrs={{ project, surface }} />
      </ProjectScope>
    </div>
  );
}

/** 데스크톱 웹 푸터가 있는 프로젝트 (web 전용). */
export const Web: Story = {
  name: "Web (데스크탑) — nudge-eap · cashwalk-biz",
  render: () => (
    <div>
      <FooterRow project="nudge-eap" surface="web" />
      <FooterRow project="cashwalk-biz" surface="web" />
    </div>
  ),
};

/** 앱 푸터 (app 전용 — trost 는 dark). */
export const App: Story = {
  name: "App (모바일) — trost · geniet · runmile",
  render: () => (
    <div>
      <FooterRow project="trost" surface="app" />
      <FooterRow project="geniet" surface="app" />
      <FooterRow project="runmile" surface="app" />
    </div>
  ),
};
