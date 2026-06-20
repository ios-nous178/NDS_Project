import React from "react";
import { projectThemes } from "./project-themes";

export interface ProjectScopeProps {
  project: keyof typeof projectThemes;
  children: React.ReactNode;
}

export function ProjectScope({ project, children }: ProjectScopeProps) {
  const theme = projectThemes[project];

  return React.createElement(
    "div",
    {
      "data-project": project,
      style: { display: "contents", ...theme.cssVars } as React.CSSProperties,
    },
    children,
  );
}
