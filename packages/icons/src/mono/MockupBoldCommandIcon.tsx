import React from "react";

export interface MockupBoldCommandIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldCommandIcon = React.forwardRef<SVGSVGElement, MockupBoldCommandIconProps>(
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
      <path d="M16 8H8v8h8V8ZM2 19c0 1.65 1.35 3 3 3s3-1.35 3-3v-3H5c-1.65 0-3 1.35-3 3ZM5 2C3.35 2 2 3.35 2 5s1.35 3 3 3h3V5c0-1.65-1.35-3-3-3ZM22 5c0-1.65-1.35-3-3-3s-3 1.35-3 3v3h3c1.65 0 3-1.35 3-3ZM19 16h-3v3c0 1.65 1.35 3 3 3s3-1.35 3-3-1.35-3-3-3Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldCommandIcon.displayName = "MockupBoldCommandIcon";
