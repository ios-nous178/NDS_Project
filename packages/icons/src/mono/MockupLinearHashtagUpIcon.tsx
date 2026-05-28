import React from "react";

export interface MockupLinearHashtagUpIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearHashtagUpIcon = React.forwardRef<SVGSVGElement, MockupLinearHashtagUpIconProps>(
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
      <path d="M22 13V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M19 22v-6l-2 2M19 16l2 2M9.95 6.26 8.9 15.73M13.11 6.26l-1.05 9.47M6.53 9.42H16M6 12.58h9.47" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearHashtagUpIcon.displayName = "MockupLinearHashtagUpIcon";
