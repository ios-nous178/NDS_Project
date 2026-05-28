import React from "react";

export interface MockupLinearScreenmirroringIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearScreenmirroringIcon = React.forwardRef<SVGSVGElement, MockupLinearScreenmirroringIconProps>(
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
      <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12.6 18.5h3.8c1.5 0 2.1-.6 2.1-2.1v-1.8c0-1.5-.6-2.1-2.1-2.1h-3.8c-1.5 0-2.1.6-2.1 2.1v1.8c0 1.5.6 2.1 2.1 2.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearScreenmirroringIcon.displayName = "MockupLinearScreenmirroringIcon";
