import React from "react";
import { brandThemes } from "./brand-themes";

export interface BrandScopeProps {
  brand: keyof typeof brandThemes;
  children: React.ReactNode;
}

export function BrandScope({ brand, children }: BrandScopeProps) {
  const theme = brandThemes[brand];

  return React.createElement(
    "div",
    {
      "data-brand": brand,
      style: { display: "contents", ...theme.cssVars } as React.CSSProperties,
    },
    children,
  );
}
