import React from "react";

export interface MockupLinearBuilding4IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearBuilding4Icon = React.forwardRef<SVGSVGElement, MockupLinearBuilding4IconProps>(
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
      <path d="M1 22h22M19.78 22.01v-4.46M19.8 10.89c-1.22 0-2.2.98-2.2 2.2v2.27c0 1.22.98 2.2 2.2 2.2 1.22 0 2.2-.98 2.2-2.2v-2.27c0-1.22-.98-2.2-2.2-2.2ZM2.1 22V6.03c0-2.01 1-3.02 2.99-3.02h6.23c1.99 0 2.98 1.01 2.98 3.02V22M5.8 8.25h4.95M5.8 12h4.95M8.25 22v-3.75" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearBuilding4Icon.displayName = "MockupLinearBuilding4Icon";
