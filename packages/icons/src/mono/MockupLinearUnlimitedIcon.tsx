import React from "react";

export interface MockupLinearUnlimitedIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearUnlimitedIcon = React.forwardRef<SVGSVGElement, MockupLinearUnlimitedIconProps>(
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
      <path d="M10.18 9.32a4.474 4.474 0 0 0-3.64-1.87c-2.51 0-4.55 2.04-4.55 4.55s2.04 4.55 4.55 4.55c1.69 0 3.26-.89 4.13-2.34L12 12l1.32-2.21a4.821 4.821 0 0 1 4.13-2.34C19.96 7.45 22 9.49 22 12s-2.04 4.55-4.55 4.55c-1.5 0-2.81-.74-3.64-1.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearUnlimitedIcon.displayName = "MockupLinearUnlimitedIcon";
