import React from "react";

export interface MockupLinearLampIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearLampIcon = React.forwardRef<SVGSVGElement, MockupLinearLampIconProps>(
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
      <path d="M20.78 13.65v4.94H3.22v-4.94c0-4.82 3.9-8.72 8.72-8.72h.12c4.82 0 8.72 3.9 8.72 8.72ZM12 2v2.93M15.65 18.59A3.661 3.661 0 0 1 12 22c-1.93 0-3.52-1.5-3.65-3.41h7.3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearLampIcon.displayName = "MockupLinearLampIcon";
