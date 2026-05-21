import React from "react";

export interface MockupLinearRadioIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearRadioIcon = React.forwardRef<SVGSVGElement, MockupLinearRadioIconProps>(
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
      <path d="M17 5H7c-3 0-5 2-5 5v7c0 3 2 5 5 5h10c3 0 5-2 5-5v-7c0-3-2-5-5-5ZM7 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M8.5 16a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM14.5 11h4M14.5 15h.5M18 15h.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearRadioIcon.displayName = "MockupLinearRadioIcon";
