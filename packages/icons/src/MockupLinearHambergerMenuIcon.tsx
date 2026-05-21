import React from "react";

export interface MockupLinearHambergerMenuIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearHambergerMenuIcon = React.forwardRef<SVGSVGElement, MockupLinearHambergerMenuIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
    </svg>
  )
);

MockupLinearHambergerMenuIcon.displayName = "MockupLinearHambergerMenuIcon";
