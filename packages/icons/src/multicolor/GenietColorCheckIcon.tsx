import React from "react";

export interface GenietColorCheckIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietColorCheckIcon = React.forwardRef<SVGSVGElement, GenietColorCheckIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0.10 0.10 23.81 23.81"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <circle cx="12" cy="12" r="10" fill="#ECF8F9"/>
<path d="M15.371 8.92874C15.6867 8.58147 16.2239 8.55558 16.5712 8.87113C16.9185 9.18683 16.9444 9.72396 16.6288 10.0713L11.6288 15.5713C11.4725 15.7433 11.2527 15.844 11.0204 15.8496C10.7881 15.8552 10.5637 15.765 10.3993 15.6006L7.39935 12.6006C7.0674 12.2687 7.0674 11.7314 7.39935 11.3994C7.7313 11.0675 8.26858 11.0675 8.60052 11.3994L10.9697 13.7686L15.371 8.92874Z" fill="#48C2C5"/>
    </svg>
  )
);

GenietColorCheckIcon.displayName = "GenietColorCheckIcon";
