import React from "react";

export interface MockupLinearSunFogIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearSunFogIcon = React.forwardRef<SVGSVGElement, MockupLinearSunFogIconProps>(
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
      <path d="M18.5 12a6.5 6.5 0 1 0-13 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="m4.99 4.99-.13-.13m14.15.13.13-.13-.13.13ZM12 2.08V2v.08ZM2.08 12H2h.08ZM22 12h-.08.08Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M4 15h16M6 18h12M9 21h6" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearSunFogIcon.displayName = "MockupLinearSunFogIcon";
