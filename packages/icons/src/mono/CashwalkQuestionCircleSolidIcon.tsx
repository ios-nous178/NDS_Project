import React from "react";

export interface CashwalkQuestionCircleSolidIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkQuestionCircleSolidIcon = React.forwardRef<SVGSVGElement, CashwalkQuestionCircleSolidIconProps>(
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
      <g clipPath="url(#clip0_48_549)">
<path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM11.4756 15.4736C10.8808 15.4736 10.4083 15.9462 10.4082 16.541C10.4082 17.1359 10.8807 17.6084 11.4756 17.6084C12.0704 17.6083 12.543 17.124 12.543 16.541C12.5429 15.9581 12.0723 15.4737 11.4756 15.4736ZM11.8486 6.7998C10.4832 6.79992 9.39063 7.47052 9.05469 8.32617C8.73306 9.10671 9.91258 9.97558 10.6318 9.13184C10.9163 8.79604 11.3252 8.51185 11.7598 8.51172C12.5541 8.51172 12.952 8.88484 12.9521 9.65332C12.9521 10.3114 12.2202 10.9324 11.5996 11.2803C11.0543 11.5906 10.6319 12.1736 10.6318 12.9678V13.8232C10.6318 14.8529 12.4062 14.7916 12.4062 13.8232V13.2031C12.4063 12.7942 12.5426 12.5097 13.0146 12.2607C13.9336 11.7766 15.001 10.8098 15.001 9.54297C15.0009 7.86715 13.8842 6.7998 11.8486 6.7998Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_48_549">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
    </svg>
  )
);

CashwalkQuestionCircleSolidIcon.displayName = "CashwalkQuestionCircleSolidIcon";
