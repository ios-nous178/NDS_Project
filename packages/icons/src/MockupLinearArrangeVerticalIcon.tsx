import React from "react";

export interface MockupLinearArrangeVerticalIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrangeVerticalIcon = React.forwardRef<SVGSVGElement, MockupLinearArrangeVerticalIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.45 6.72L6.73 3 3.01 6.72M6.73 21V3M13.55 17.28L17.27 21l3.72-3.72M17.27 3v18"></path>
    </svg>
  )
);

MockupLinearArrangeVerticalIcon.displayName = "MockupLinearArrangeVerticalIcon";
