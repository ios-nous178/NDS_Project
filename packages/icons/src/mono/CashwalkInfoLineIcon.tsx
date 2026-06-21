import React from "react";

export interface CashwalkInfoLineIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkInfoLineIcon = React.forwardRef<SVGSVGElement, CashwalkInfoLineIconProps>(
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
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.5"/>
<path d="M12 16.501C12.1989 16.501 12.3897 16.422 12.5303 16.2813C12.671 16.1407 12.75 15.9499 12.75 15.751V10.75C12.75 10.5511 12.671 10.3603 12.5303 10.2197C12.3897 10.079 12.1989 10 12 10C11.8011 10 11.6103 10.079 11.4697 10.2197C11.329 10.3603 11.25 10.5511 11.25 10.75V15.751C11.25 15.9499 11.329 16.1407 11.4697 16.2813C11.6103 16.422 11.8011 16.501 12 16.501ZM12.0105 8.5C12.2094 8.5 12.4002 8.42098 12.5408 8.28033C12.6815 8.13968 12.7605 7.94891 12.7605 7.75C12.7605 7.55109 12.6815 7.36032 12.5408 7.21967C12.4002 7.07902 12.2094 7 12.0105 7H12C11.8011 7 11.6103 7.07902 11.4697 7.21967C11.329 7.36032 11.25 7.55109 11.25 7.75C11.25 7.94891 11.329 8.13968 11.4697 8.28033C11.6103 8.42098 11.8011 8.5 12 8.5H12.0105Z" fill="currentColor"/>
    </svg>
  )
);

CashwalkInfoLineIcon.displayName = "CashwalkInfoLineIcon";
