import React from "react";

export interface MockupBoldCdIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldCdIcon = React.forwardRef<SVGSVGElement, MockupBoldCdIconProps>(
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
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 12.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldCdIcon.displayName = "MockupBoldCdIcon";
