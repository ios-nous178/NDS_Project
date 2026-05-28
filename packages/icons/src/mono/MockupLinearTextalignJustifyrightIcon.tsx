import React from "react";

export interface MockupLinearTextalignJustifyrightIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearTextalignJustifyrightIcon = React.forwardRef<SVGSVGElement, MockupLinearTextalignJustifyrightIconProps>(
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
      <path d="M12 4.5h9M12 9.5h9M3 14.5h18M3 19.5h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearTextalignJustifyrightIcon.displayName = "MockupLinearTextalignJustifyrightIcon";
