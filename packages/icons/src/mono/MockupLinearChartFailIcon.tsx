import React from "react";

export interface MockupLinearChartFailIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearChartFailIcon = React.forwardRef<SVGSVGElement, MockupLinearChartFailIconProps>(
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
      <path d="m17.23 20.77 3.54-3.54M20.77 20.77l-3.54-3.54M7 10.5v3M12 10.5v3M17 10.5v3M22 13V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearChartFailIcon.displayName = "MockupLinearChartFailIcon";
