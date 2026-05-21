import React from "react";

export interface MockupBoldArrowRight2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldArrowRight2Icon = React.forwardRef<SVGSVGElement, MockupBoldArrowRight2IconProps>(
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
      <path fill="currentColor" d="M15.2 10.492l-1.97-1.97-3.21-3.21c-.68-.67-1.84-.19-1.84.77v11.84c0 .96 1.16 1.44 1.84.76l5.18-5.18c.83-.82.83-2.18 0-3.01z"></path>
    </svg>
  )
);

MockupBoldArrowRight2Icon.displayName = "MockupBoldArrowRight2Icon";
