import React from "react";

export interface MockupLinearHashtagIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearHashtagIcon = React.forwardRef<SVGSVGElement, MockupLinearHashtagIconProps>(
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
      <path d="M10 3 8 21M16 3l-2 18M3.5 9h18M2.5 15h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearHashtagIcon.displayName = "MockupLinearHashtagIcon";
