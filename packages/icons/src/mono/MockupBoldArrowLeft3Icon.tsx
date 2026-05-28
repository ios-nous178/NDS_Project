import React from "react";

export interface MockupBoldArrowLeft3IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupBoldArrowLeft3Icon = React.forwardRef<SVGSVGElement, MockupBoldArrowLeft3IconProps>(
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
      <path fill="currentColor" d="M18 9.33v5.34c0 3.32-2.35 4.67-5.22 3.02l-1.28-.74c-.31-.18-.5-.51-.5-.87V7.92c0-.36.19-.69.5-.87l1.28-.74C15.65 4.66 18 6.01 18 9.33zM9.999 8.792v6.43c0 .39-.42.63-.75.43l-1.1-.64c-2.87-1.65-2.87-4.37 0-6.02l1.1-.64c.33-.19.75.05.75.44z"></path>
    </svg>
  )
);

MockupBoldArrowLeft3Icon.displayName = "MockupBoldArrowLeft3Icon";
