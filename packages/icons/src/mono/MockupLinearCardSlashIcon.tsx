import React from "react";

export interface MockupLinearCardSlashIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearCardSlashIcon = React.forwardRef<SVGSVGElement, MockupLinearCardSlashIconProps>(
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
      <path d="M2 8.5h13.24M6 16.5h1.29M11 16.5h3.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M7.98 20.5h9.58c3.56 0 4.44-.88 4.44-4.39V6.89M19.99 3.75c-.62-.18-1.42-.25-2.43-.25H6.44C2.89 3.5 2 4.38 2 7.89v8.21c0 2.34.39 3.51 1.71 4.03M22 2 2 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearCardSlashIcon.displayName = "MockupLinearCardSlashIcon";
