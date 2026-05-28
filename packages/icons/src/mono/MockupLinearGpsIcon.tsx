import React from "react";

export interface MockupLinearGpsIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearGpsIcon = React.forwardRef<SVGSVGElement, MockupLinearGpsIconProps>(
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
      <path d="M12 19.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12 4V2M4 12H2M12 20v2M20 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearGpsIcon.displayName = "MockupLinearGpsIcon";
