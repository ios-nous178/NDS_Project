import React from "react";

export interface CashwalkChevronLeftIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkChevronLeftIcon = React.forwardRef<SVGSVGElement, CashwalkChevronLeftIconProps>(
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
      <path d="M7.41796 12.4737C7.17765 12.1791 7.19512 11.7444 7.46972 11.4698L13.4697 5.46978C13.7626 5.17689 14.2374 5.17689 14.5303 5.46978C14.8232 5.76268 14.8232 6.23744 14.5303 6.53033L9.06054 12.0001L14.5303 17.4698C14.8232 17.7627 14.8232 18.2374 14.5303 18.5303C14.2374 18.8232 13.7626 18.8232 13.4697 18.5303L7.46972 12.5303L7.41796 12.4737Z" fill="currentColor"/>
    </svg>
  )
);

CashwalkChevronLeftIcon.displayName = "CashwalkChevronLeftIcon";
