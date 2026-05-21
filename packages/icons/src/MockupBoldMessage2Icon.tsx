import React from "react";

export interface MockupBoldMessage2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldMessage2Icon = React.forwardRef<SVGSVGElement, MockupBoldMessage2IconProps>(
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
      <path d="M17 2.43H7c-3 0-5 2-5 5v6c0 3 2 5 5 5h4l4.45 2.96a.997.997 0 0 0 1.55-.83v-2.13c3 0 5-2 5-5v-6c0-3-2-5-5-5Zm-1.5 8.82h-7c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h7c.41 0 .75.34.75.75s-.34.75-.75.75Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldMessage2Icon.displayName = "MockupBoldMessage2Icon";
