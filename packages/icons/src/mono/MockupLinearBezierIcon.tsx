import React from "react";

export interface MockupLinearBezierIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearBezierIcon = React.forwardRef<SVGSVGElement, MockupLinearBezierIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M3 9a2 2 0 100-4 2 2 0 000 4zM21 9a2 2 0 100-4 2 2 0 000 4zM19 7h-4M9 7H5M7.5 16.5v2c0 .61-.37 1.14-.89 1.36A1.4 1.4 0 016 20H4c-.83 0-1.5-.67-1.5-1.5v-2c0-.83.67-1.5 1.5-1.5h2c.83 0 1.5.67 1.5 1.5zM21.5 16.5v2c0 .83-.67 1.5-1.5 1.5h-2a1.4 1.4 0 01-.61-.14c-.52-.22-.89-.75-.89-1.36v-2c0-.83.67-1.5 1.5-1.5h2c.83 0 1.5.67 1.5 1.5zM15 5.5v3c0 .82-.68 1.5-1.5 1.5h-3C9.68 10 9 9.32 9 8.5v-3c0-.82.68-1.5 1.5-1.5h3c.82 0 1.5.68 1.5 1.5z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M15 7.73c2.37 1.2 4 3.78 4 6.77 0 .17-.01.33-.03.5M5.03 15c-.02-.17-.03-.33-.03-.5 0-2.99 1.63-5.57 4-6.77"></path>
    </svg>
  )
);

MockupLinearBezierIcon.displayName = "MockupLinearBezierIcon";
