import React from "react";

export interface MockupBoldToggleOnCircleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldToggleOnCircleIcon = React.forwardRef<SVGSVGElement, MockupBoldToggleOnCircleIconProps>(
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
      <path d="M13.86 3.86h-3.72C5.65 3.86 2 7.51 2 12s3.65 8.14 8.14 8.14h3.72c4.49 0 8.14-3.65 8.14-8.14s-3.65-8.14-8.14-8.14Zm0 12.56c-2.44 0-4.42-1.98-4.42-4.42s1.98-4.42 4.42-4.42 4.42 1.98 4.42 4.42-1.98 4.42-4.42 4.42Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldToggleOnCircleIcon.displayName = "MockupBoldToggleOnCircleIcon";
