import React from "react";

export interface CenterIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CenterIcon = React.forwardRef<SVGSVGElement, CenterIconProps>(
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
      <path d="M18 2C20.2091 2 22 3.79086 22 6V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18V6C2 3.79086 3.79086 2 6 2H18ZM12 7C11.1717 7.00011 10.5001 7.67173 10.5 8.5V10.5H8.5C7.67173 10.5001 7.00011 11.1717 7 12C7 12.8284 7.67166 13.4999 8.5 13.5H10.5V15.5C10.5 16.3284 11.1717 16.9999 12 17C12.8284 17 13.5 16.3284 13.5 15.5V13.5H15.5C16.3284 13.5 17 12.8284 17 12C16.9999 11.1717 16.3284 10.5 15.5 10.5H13.5V8.5C13.4999 7.67166 12.8284 7 12 7Z" fill="currentColor"/>
    </svg>
  )
);

CenterIcon.displayName = "CenterIcon";
