import React from "react";

export interface MockupBoldStopCircleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldStopCircleIcon = React.forwardRef<SVGSVGElement, MockupBoldStopCircleIconProps>(
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
      <path d="M11.969 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.47-10-10-10Zm4.26 11.23c0 1.66-1.34 3-3 3h-2.46c-1.66 0-3-1.34-3-3v-2.46c0-1.66 1.34-3 3-3h2.46c1.66 0 3 1.34 3 3v2.46Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldStopCircleIcon.displayName = "MockupBoldStopCircleIcon";
