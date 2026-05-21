import React from "react";

export interface MockupLinearShieldSlashIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearShieldSlashIcon = React.forwardRef<SVGSVGElement, MockupLinearShieldSlashIconProps>(
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
      <path d="m7.84 20.02 1.59 1.19c1.41 1.06 3.73 1.06 5.14 0l4.3-3.21c.95-.71 1.73-2.26 1.73-3.44V7.12M18.98 4.34c-.15-.09-.31-.17-.47-.24l-4.99-1.87c-.83-.31-2.19-.31-3.02 0l-5 1.88c-1.15.43-2.09 1.79-2.09 3.01v7.43c0 1.18.78 2.73 1.73 3.44l.2.15M22 2 2 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearShieldSlashIcon.displayName = "MockupLinearShieldSlashIcon";
