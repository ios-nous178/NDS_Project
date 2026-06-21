import React from "react";

export interface CashwalkWarningCircleLineIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkWarningCircleLineIcon = React.forwardRef<SVGSVGElement, CashwalkWarningCircleLineIconProps>(
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
      <circle cx="12" cy="12" r="9.15" stroke="white" strokeWidth="1.7"/>
<path d="M10.702 7.8044C10.6658 7.06508 11.2554 6.4458 11.9956 6.4458C12.7391 6.4458 13.33 7.07041 13.2887 7.81277L12.987 13.2427C12.9572 13.7782 12.5143 14.1972 11.978 14.1972C11.4391 14.1972 10.995 13.7744 10.9686 13.2362L10.702 7.8044Z" fill="white"/>
<rect x="10.8" y="15.0771" width="2.4" height="2.4" rx="1.2" fill="white"/>
<path d="M20.2998 12C20.2998 7.41604 16.584 3.7002 12 3.7002C7.41604 3.7002 3.7002 7.41604 3.7002 12C3.7002 16.584 7.41604 20.2998 12 20.2998V22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22V20.2998C16.584 20.2998 20.2998 16.584 20.2998 12Z" fill="currentColor"/>
<path d="M10.7021 7.8044C10.6658 7.06508 11.2554 6.4458 11.9956 6.4458C12.7391 6.4458 13.33 7.07041 13.2887 7.81277L12.987 13.2427C12.9573 13.7782 12.5143 14.1972 11.978 14.1972C11.4391 14.1972 10.995 13.7744 10.9686 13.2362L10.7021 7.8044Z" fill="currentColor"/>
<path d="M10.8 16.2771C10.8 15.6144 11.3373 15.0771 12 15.0771C12.6628 15.0771 13.2 15.6144 13.2 16.2771C13.2 16.9399 12.6628 17.4771 12 17.4771C11.3373 17.4771 10.8 16.9399 10.8 16.2771Z" fill="currentColor"/>
    </svg>
  )
);

CashwalkWarningCircleLineIcon.displayName = "CashwalkWarningCircleLineIcon";
