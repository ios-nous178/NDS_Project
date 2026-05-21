import React from "react";

export interface MockupLinearWalletSearchIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearWalletSearchIcon = React.forwardRef<SVGSVGElement, MockupLinearWalletSearchIconProps>(
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
      <path d="M12 22h5c3 0 5-2 5-5v-5c0-2.7-1.7-4.7-4.2-5H7c-.3 0-.5 0-.8.1C3.6 7.4 2 9.3 2 12v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M17.8 7H7c-.3 0-.5 0-.8.1.1-.3.3-.5.6-.8L10 3c1.4-1.4 3.6-1.4 5 0l1.8 1.8c.6.6.9 1.4 1 2.2ZM22 12.5h-3c-1.1 0-2 .9-2 2s.9 2 2 2h3M5.802 21.4c1.77 0 3.2-1.43 3.2-3.2 0-1.77-1.43-3.2-3.2-3.2-1.77 0-3.2 1.43-3.2 3.2 0 1.77 1.43 3.2 3.2 3.2ZM2 22l1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearWalletSearchIcon.displayName = "MockupLinearWalletSearchIcon";
