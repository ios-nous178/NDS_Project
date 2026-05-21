import React from "react";

export interface MockupBoldWomanIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldWomanIcon = React.forwardRef<SVGSVGElement, MockupBoldWomanIconProps>(
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
      <path d="M19 9c0-3.87-3.13-7-7-7S5 5.13 5 9c0 3.62 2.74 6.59 6.25 6.96v2.29H9c-.41 0-.75.34-.75.75s.34.75.75.75h2.25V22c0 .41.34.75.75.75s.75-.34.75-.75v-2.25H15c.41 0 .75-.34.75-.75s-.34-.75-.75-.75h-2.25v-2.29A6.995 6.995 0 0 0 19 9Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldWomanIcon.displayName = "MockupBoldWomanIcon";
