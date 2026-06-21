import React from "react";

export interface CashwalkMapPinIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkMapPinIcon = React.forwardRef<SVGSVGElement, CashwalkMapPinIconProps>(
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
      <path fillRule="evenodd" clipRule="evenodd" d="M4.40002 10.024C4.4417 5.85633 7.83215 2.49979 12 2.5C16.1678 2.49979 19.5583 5.85633 19.6 10.024C19.6 15.23 12.95 21.0249 12.6175 21.2719C12.262 21.576 11.738 21.576 11.3825 21.2719L11.3809 21.2706C11.074 21.0046 4.40002 15.2208 4.40002 10.024ZM8.67501 9.62496C8.67501 11.4613 10.1637 12.95 12 12.95C12.8818 12.95 13.7276 12.5996 14.3511 11.9761C14.9747 11.3525 15.325 10.5068 15.325 9.62496C15.325 7.78862 13.8363 6.29997 12 6.29997C10.1637 6.29997 8.67501 7.78862 8.67501 9.62496Z" fill="currentColor"/>
    </svg>
  )
);

CashwalkMapPinIcon.displayName = "CashwalkMapPinIcon";
