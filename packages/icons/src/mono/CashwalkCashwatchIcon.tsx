import React from "react";

export interface CashwalkCashwatchIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkCashwatchIcon = React.forwardRef<SVGSVGElement, CashwalkCashwatchIconProps>(
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
      <path d="M15.75 4.64648C16.4828 4.94327 17 5.6608 17 6.5V17.5C17 18.3391 16.4826 19.0557 15.75 19.3525V22H8.25V19.3525C7.51743 19.0557 7 18.3391 7 17.5V6.5C7 5.6608 7.51725 4.94327 8.25 4.64648V2H15.75V4.64648ZM9.25 5.75C8.69772 5.75 8.25 6.19772 8.25 6.75V17.25C8.25 17.8023 8.69772 18.25 9.25 18.25H14.75C15.3023 18.25 15.75 17.8023 15.75 17.25V6.75C15.75 6.19772 15.3023 5.75 14.75 5.75H9.25ZM13.5 7C14.0523 7 14.5 7.44772 14.5 8V16C14.5 16.5523 14.0523 17 13.5 17H10.5C9.94772 17 9.5 16.5523 9.5 16V8C9.5 7.44772 9.94772 7 10.5 7H13.5Z" fill="currentColor"/>
<mask id="mask0_30_748" maskUnits="userSpaceOnUse" x="7" y="2" width="10" height="20">
<path d="M15.75 4.64648C16.4828 4.94327 17 5.6608 17 6.5V17.5C17 18.3391 16.4826 19.0557 15.75 19.3525V22H8.25V19.3525C7.51743 19.0557 7 18.3391 7 17.5V6.5C7 5.6608 7.51725 4.94327 8.25 4.64648V2H15.75V4.64648ZM9.25 5.75C8.69772 5.75 8.25 6.19772 8.25 6.75V17.25C8.25 17.8023 8.69772 18.25 9.25 18.25H14.75C15.3023 18.25 15.75 17.8023 15.75 17.25V6.75C15.75 6.19772 15.3023 5.75 14.75 5.75H9.25ZM13.5 7C14.0523 7 14.5 7.44772 14.5 8V16C14.5 16.5523 14.0523 17 13.5 17H10.5C9.94772 17 9.5 16.5523 9.5 16V8C9.5 7.44772 9.94772 7 10.5 7H13.5Z" fill="white"/>
</mask>
<g mask="url(#mask0_30_748)">
</g>
    </svg>
  )
);

CashwalkCashwatchIcon.displayName = "CashwalkCashwatchIcon";
