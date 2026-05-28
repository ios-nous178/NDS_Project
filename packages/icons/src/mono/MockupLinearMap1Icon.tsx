import React from "react";

export interface MockupLinearMap1IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearMap1Icon = React.forwardRef<SVGSVGElement, MockupLinearMap1IconProps>(
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
      <path d="M2.29 7.78v9.73c0 1.9 1.35 2.68 2.99 1.74l2.35-1.34c.51-.29 1.36-.32 1.89-.05l5.25 2.63c.53.26 1.38.24 1.89-.05l4.33-2.48c.55-.32 1.01-1.1 1.01-1.74V6.49c0-1.9-1.35-2.68-2.99-1.74l-2.35 1.34c-.51.29-1.36.32-1.89.05L9.52 3.52c-.53-.26-1.38-.24-1.89.05L3.3 6.05c-.56.32-1.01 1.1-1.01 1.73ZM8.56 4v13M15.73 6.62V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearMap1Icon.displayName = "MockupLinearMap1Icon";
