import React from "react";

export interface MockupLinearBubbleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearBubbleIcon = React.forwardRef<SVGSVGElement, MockupLinearBubbleIconProps>(
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
      <path d="M15.59 12.26a5.13 5.13 0 1 0 0-10.26 5.13 5.13 0 0 0 0 10.26ZM6.36 19.44a3.08 3.08 0 1 0 0-6.16 3.08 3.08 0 0 0 0 6.16ZM16.62 22a2.56 2.56 0 1 0 0-5.12 2.56 2.56 0 0 0 0 5.12Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"></path>
    </svg>
  )
);

MockupLinearBubbleIcon.displayName = "MockupLinearBubbleIcon";
