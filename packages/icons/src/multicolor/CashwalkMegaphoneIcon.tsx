import React from "react";

export interface CashwalkMegaphoneIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkMegaphoneIcon = React.forwardRef<SVGSVGElement, CashwalkMegaphoneIconProps>(
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
      <path fillRule="evenodd" clipRule="evenodd" d="M17.8354 2.64571C18.9771 1.94357 20.4 2.83 20.4 4.24533V15.8131C20.4 17.2275 18.978 18.1149 17.8354 17.4127L14.4 15.3026V4.75581L17.8354 2.64571Z" fill="#FD9B02"/>
<path fillRule="evenodd" clipRule="evenodd" d="M14.4853 4.71643H9.04556C6.25086 4.71371 3.90872 6.76541 3.62786 9.46232C3.34699 12.1592 5.21879 14.6238 7.9576 15.1632V18.962C7.9576 20.419 9.17534 21.6001 10.6775 21.6001C12.1796 21.6001 13.3974 20.419 13.3974 18.962V15.2687H14.4853V4.71643Z" fill="#FFD200"/>
    </svg>
  )
);

CashwalkMegaphoneIcon.displayName = "CashwalkMegaphoneIcon";
