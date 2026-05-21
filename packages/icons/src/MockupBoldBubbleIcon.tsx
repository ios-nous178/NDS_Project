import React from "react";

export interface MockupBoldBubbleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldBubbleIcon = React.forwardRef<SVGSVGElement, MockupBoldBubbleIconProps>(
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
      <path d="M15.59 1.75c-2.97 0-5.38 2.41-5.38 5.38 0 2.97 2.41 5.38 5.38 5.38 2.97 0 5.38-2.41 5.38-5.38 0-2.97-2.41-5.38-5.38-5.38ZM6.36 13.031a3.329 3.329 0 1 0-.002 6.662 3.329 3.329 0 0 0 .001-6.662ZM16.62 16.621c-1.55 0-2.81 1.26-2.81 2.81s1.26 2.81 2.81 2.81 2.81-1.26 2.81-2.81-1.26-2.81-2.81-2.81Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldBubbleIcon.displayName = "MockupBoldBubbleIcon";
