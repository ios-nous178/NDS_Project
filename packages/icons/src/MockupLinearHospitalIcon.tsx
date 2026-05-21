import React from "react";

export interface MockupLinearHospitalIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearHospitalIcon = React.forwardRef<SVGSVGElement, MockupLinearHospitalIconProps>(
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
      <path d="M2 22h20M17 2H7C4 2 3 3.79 3 6v16h18V6c0-2.21-1-4-4-4Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M14.06 15H9.93c-.51 0-.94.42-.94.94V22h6v-6.06a.924.924 0 0 0-.93-.94ZM12 6v5M9.5 8.5h5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearHospitalIcon.displayName = "MockupLinearHospitalIcon";
