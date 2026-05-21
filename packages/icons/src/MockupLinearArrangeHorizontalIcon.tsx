import React from "react";

export interface MockupLinearArrangeHorizontalIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrangeHorizontalIcon = React.forwardRef<SVGSVGElement, MockupLinearArrangeHorizontalIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.28 10.45L21 6.73l-3.72-3.72M3 6.73h18M6.72 13.55L3 17.27l3.72 3.72M21 17.27H3"></path>
    </svg>
  )
);

MockupLinearArrangeHorizontalIcon.displayName = "MockupLinearArrangeHorizontalIcon";
