import React from "react";

export interface MockupBoldMaskRightIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldMaskRightIcon = React.forwardRef<SVGSVGElement, MockupBoldMaskRightIconProps>(
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
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Z" fill="currentColor"></path><path d="M12 7v10c-2.76 0-5-2.24-5-5s2.24-5 5-5Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldMaskRightIcon.displayName = "MockupBoldMaskRightIcon";
