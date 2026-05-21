import React from "react";

export interface MockupLinearMathIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearMathIcon = React.forwardRef<SVGSVGElement, MockupLinearMathIconProps>(
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
      <path d="M14.42 5.64h7.28M2.3 5.64h7.28M14.42 15.33h7.28M14.42 21.39h7.28M18.09 9.27V2M2.3 22l7.28-7.27M9.58 22 2.3 14.73" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearMathIcon.displayName = "MockupLinearMathIcon";
