import React from "react";

export interface CashwalkStarIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkStarIcon = React.forwardRef<SVGSVGElement, CashwalkStarIconProps>(
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
      <path d="M10.8791 2.97628C11.1847 2.35752 11.9341 2.10369 12.553 2.40889C12.7993 2.53053 12.9997 2.72997 13.1213 2.97628L15.5881 7.97432L21.1067 8.78194C21.747 8.87563 22.2029 9.4391 22.175 10.072L22.1623 10.1989C22.1226 10.4706 21.9948 10.7222 21.7981 10.9138L17.8049 14.8015L18.7483 20.2946C18.8575 20.9324 18.4621 21.54 17.8518 21.7097L17.7278 21.738C17.4569 21.7845 17.1771 21.7399 16.9338 21.612L12.0002 19.0173L7.06567 21.612C6.4955 21.9118 5.7991 21.7273 5.4475 21.2048L5.37817 21.0876C5.25027 20.8443 5.20578 20.5655 5.25219 20.2946L6.19457 14.8015L2.20239 10.9138C1.74085 10.4642 1.7008 9.74472 2.0891 9.24874L2.17895 9.1462C2.37061 8.94947 2.62202 8.82166 2.89379 8.78194L8.41137 7.97432L10.8791 2.97628Z" fill="currentColor"/>
    </svg>
  )
);

CashwalkStarIcon.displayName = "CashwalkStarIcon";
