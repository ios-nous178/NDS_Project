import React from "react";

export interface MockupLinearMinusIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearMinusIcon = React.forwardRef<SVGSVGElement, MockupLinearMinusIconProps>(
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
      <path d="M6 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearMinusIcon.displayName = "MockupLinearMinusIcon";
