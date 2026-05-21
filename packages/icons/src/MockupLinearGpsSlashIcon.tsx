import React from "react";

export interface MockupLinearGpsSlashIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearGpsSlashIcon = React.forwardRef<SVGSVGElement, MockupLinearGpsSlashIconProps>(
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
      <path d="M9 18.88c.92.4 1.93.62 3 .62 4.14 0 7.5-3.36 7.5-7.5 0-1.07-.22-2.08-.62-3M17.21 6.6A7.503 7.503 0 0 0 6.58 17.19M12 4V2M4 12H2M12 20v2M20 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="m14.12 9.88-4.24 4.24a2.996 2.996 0 1 1 4.24-4.24ZM22 2 2 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearGpsSlashIcon.displayName = "MockupLinearGpsSlashIcon";
