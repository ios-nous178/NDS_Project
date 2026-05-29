import React from "react";

export interface CashwalkBizGnbEditIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkBizGnbEditIcon = React.forwardRef<SVGSVGElement, CashwalkBizGnbEditIconProps>(
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
      <path fillRule="evenodd" clipRule="evenodd" d="M17.6587 3C17.4087 3 17.1488 3.1 16.9588 3.29L15.1288 5.12L18.8788 8.87L20.7087 7.04C21.0988 6.65 21.0988 6.02 20.7087 5.63L18.3687 3.29C18.1688 3.09 17.9188 3 17.6587 3ZM14.0588 9.02L14.9787 9.94L5.91875 19H4.99875V18.08L14.0588 9.02ZM2.99875 17.25L14.0588 6.19L17.8088 9.94L6.74875 21H2.99875V17.25Z" fill="currentColor"/>
    </svg>
  )
);

CashwalkBizGnbEditIcon.displayName = "CashwalkBizGnbEditIcon";
