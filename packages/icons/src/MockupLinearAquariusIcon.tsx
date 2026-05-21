import React from "react";

export interface MockupLinearAquariusIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearAquariusIcon = React.forwardRef<SVGSVGElement, MockupLinearAquariusIconProps>(
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
      <path d="M12 16c3.87 0 7-3.13 7-7s-3.13-7-7-7-7 3.13-7 7M12 16v6M15 19H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearAquariusIcon.displayName = "MockupLinearAquariusIcon";
