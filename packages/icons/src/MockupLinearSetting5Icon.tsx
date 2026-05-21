import React from "react";

export interface MockupLinearSetting5IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearSetting5Icon = React.forwardRef<SVGSVGElement, MockupLinearSetting5IconProps>(
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
      <path d="M19 22V11M19 7V2M12 22v-5M12 13V2M5 22V11M5 7V2M3 11h4M17 11h4M10 13h4" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearSetting5Icon.displayName = "MockupLinearSetting5Icon";
