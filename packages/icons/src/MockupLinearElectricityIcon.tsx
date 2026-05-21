import React from "react";

export interface MockupLinearElectricityIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearElectricityIcon = React.forwardRef<SVGSVGElement, MockupLinearElectricityIconProps>(
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
      <path d="M10.5 16h3c2.5 0 4-1.8 4-4V6.91c0-1.05-.86-1.91-1.91-1.91H8.42c-1.05 0-1.91.86-1.91 1.91V12C6.5 14.2 8 16 10.5 16ZM9.5 2v3M14.5 2v3M12 22v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearElectricityIcon.displayName = "MockupLinearElectricityIcon";
