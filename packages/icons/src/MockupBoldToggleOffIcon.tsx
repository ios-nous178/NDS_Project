import React from "react";

export interface MockupBoldToggleOffIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldToggleOffIcon = React.forwardRef<SVGSVGElement, MockupBoldToggleOffIconProps>(
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
      <path d="M16.65 3.86h-9.3C3.25 3.86 2 5.11 2 9.21v5.58c0 4.1 1.25 5.35 5.35 5.35h9.3c4.1 0 5.35-1.25 5.35-5.35V9.21c0-4.1-1.25-5.35-5.35-5.35Zm-2.56 9.26c0 2.25-1.05 3.3-3.3 3.3H8.56c-2.25 0-3.3-1.05-3.3-3.3v-2.23c0-2.25 1.05-3.3 3.3-3.3h2.23c2.25 0 3.3 1.05 3.3 3.3v2.23Z" fill="currentColor"></path>
    </svg>
  )
);

MockupBoldToggleOffIcon.displayName = "MockupBoldToggleOffIcon";
