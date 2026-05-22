import React from "react";

export interface CashpobiBubbleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashpobiBubbleIcon = React.forwardRef<SVGSVGElement, CashpobiBubbleIconProps>(
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
      <path d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v8a2.5 2.5 0 01-2.5 2.5H13l-4.5 4v-4H6.5A2.5 2.5 0 014 14.5v-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  <circle cx="8.5" cy="10.5" r="1" fill="currentColor"/>
  <circle cx="12" cy="10.5" r="1" fill="currentColor"/>
  <circle cx="15.5" cy="10.5" r="1" fill="currentColor"/>
    </svg>
  )
);

CashpobiBubbleIcon.displayName = "CashpobiBubbleIcon";
