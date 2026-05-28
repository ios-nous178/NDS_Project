import React from "react";

export interface MockupBoldArrowCircleDownIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldArrowCircleDownIcon = React.forwardRef<SVGSVGElement, MockupBoldArrowCircleDownIconProps>(
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
      <path fill="currentColor" d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm4.06 9.27l-3.53 3.53c-.15.15-.34.22-.53.22s-.38-.07-.53-.22l-3.53-3.53a.754.754 0 010-1.06c.29-.29.77-.29 1.06 0l3 3 3-3c.29-.29.77-.29 1.06 0 .29.29.29.76 0 1.06z"></path>
    </svg>
  )
);

MockupBoldArrowCircleDownIcon.displayName = "MockupBoldArrowCircleDownIcon";
