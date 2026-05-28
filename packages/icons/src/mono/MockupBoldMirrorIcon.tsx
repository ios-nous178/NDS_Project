import React from "react";

export interface MockupBoldMirrorIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldMirrorIcon = React.forwardRef<SVGSVGElement, MockupBoldMirrorIconProps>(
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
      <path d="M12 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM18 22.75H6c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h12c.41 0 .75.34.75.75s-.34.75-.75.75Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldMirrorIcon.displayName = "MockupBoldMirrorIcon";
