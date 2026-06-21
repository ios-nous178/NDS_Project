import React from "react";

export interface CashwalkInfoSolidIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkInfoSolidIcon = React.forwardRef<SVGSVGElement, CashwalkInfoSolidIconProps>(
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
      <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 10C11.8011 10 11.6104 10.0791 11.4697 10.2197C11.3291 10.3604 11.25 10.5511 11.25 10.75V15.751C11.25 15.9499 11.3291 16.1406 11.4697 16.2812C11.6104 16.4219 11.8011 16.501 12 16.501C12.1989 16.501 12.3896 16.4219 12.5303 16.2812C12.6709 16.1406 12.75 15.9499 12.75 15.751V10.75C12.75 10.5511 12.6709 10.3604 12.5303 10.2197C12.3896 10.0791 12.1989 10 12 10ZM12 7C11.8011 7 11.6104 7.07907 11.4697 7.21973C11.3291 7.36038 11.25 7.55109 11.25 7.75C11.25 7.94891 11.3291 8.13962 11.4697 8.28027C11.6104 8.42093 11.8011 8.5 12 8.5H12.0107C12.2096 8.49994 12.4004 8.42087 12.541 8.28027C12.6816 8.13963 12.7607 7.94886 12.7607 7.75C12.7607 7.55114 12.6816 7.36037 12.541 7.21973C12.4004 7.07913 12.2096 7.00006 12.0107 7H12Z" fill="currentColor"/>
    </svg>
  )
);

CashwalkInfoSolidIcon.displayName = "CashwalkInfoSolidIcon";
