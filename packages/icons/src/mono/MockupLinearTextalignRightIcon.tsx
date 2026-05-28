import React from "react";

export interface MockupLinearTextalignRightIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearTextalignRightIcon = React.forwardRef<SVGSVGElement, MockupLinearTextalignRightIconProps>(
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
      <path d="M3 4.5h18M11.53 9.5H21M3 14.5h18M11.53 19.5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearTextalignRightIcon.displayName = "MockupLinearTextalignRightIcon";
