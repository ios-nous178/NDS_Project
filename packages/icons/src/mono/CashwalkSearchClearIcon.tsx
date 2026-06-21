import React from "react";

export interface CashwalkSearchClearIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkSearchClearIcon = React.forwardRef<SVGSVGElement, CashwalkSearchClearIconProps>(
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
      <circle cx="12" cy="12" r="10" fill="currentColor" fill-opacity="0.4"/>
<path d="M8.39941 8.39947C8.73136 8.06753 9.26864 8.06753 9.60058 8.39947L15.6006 14.3995C15.9325 14.7314 15.9325 15.2687 15.6006 15.6006C15.2686 15.9326 14.7314 15.9326 14.3994 15.6006L8.39941 9.60064C8.06747 9.2687 8.06747 8.73142 8.39941 8.39947Z" fill="white"/>
<path d="M15.6006 8.39947C15.2686 8.06753 14.7314 8.06753 14.3994 8.39947L8.39942 14.3995C8.06747 14.7314 8.06747 15.2687 8.39942 15.6006C8.73136 15.9326 9.26864 15.9326 9.60059 15.6006L15.6006 9.60064C15.9325 9.2687 15.9325 8.73142 15.6006 8.39947Z" fill="white"/>
    </svg>
  )
);

CashwalkSearchClearIcon.displayName = "CashwalkSearchClearIcon";
