import React from "react";

export interface MockupLinearStopCircleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearStopCircleIcon = React.forwardRef<SVGSVGElement, MockupLinearStopCircleIconProps>(
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
      <path d="M11.97 22c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M10.73 16.23h2.54c2.12 0 2.96-.85 2.96-2.96v-2.54c0-2.12-.85-2.96-2.96-2.96h-2.54c-2.12 0-2.96.85-2.96 2.96v2.54c0 2.11.85 2.96 2.96 2.96Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearStopCircleIcon.displayName = "MockupLinearStopCircleIcon";
