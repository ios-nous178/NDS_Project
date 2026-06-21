import React from "react";

export interface CashwalkWarningCircleSolidIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkWarningCircleSolidIcon = React.forwardRef<SVGSVGElement, CashwalkWarningCircleSolidIconProps>(
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
      <g clipPath="url(#clip0_48_540)">
<path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 15.0771C11.3373 15.0772 10.7998 15.6147 10.7998 16.2773C10.7999 16.94 11.3374 17.4774 12 17.4775C12.6626 17.4775 13.2001 16.94 13.2002 16.2773C13.2002 15.6146 12.6627 15.0772 12 15.0771ZM11.9961 6.44629C11.2559 6.44629 10.6659 7.06538 10.7021 7.80469L10.9688 13.2363C10.9952 13.7745 11.4397 14.1973 11.9785 14.1973C12.5145 14.197 12.9574 13.7783 12.9873 13.2432L13.2891 7.8125C13.3301 7.07045 12.7393 6.44656 11.9961 6.44629Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_48_540">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
    </svg>
  )
);

CashwalkWarningCircleSolidIcon.displayName = "CashwalkWarningCircleSolidIcon";
