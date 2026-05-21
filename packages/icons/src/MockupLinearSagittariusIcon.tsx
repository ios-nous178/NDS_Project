import React from "react";

export interface MockupLinearSagittariusIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearSagittariusIcon = React.forwardRef<SVGSVGElement, MockupLinearSagittariusIconProps>(
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
      <path d="M12 3h9v9M21 3 3 21M6.6 6.6l10.8 10.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearSagittariusIcon.displayName = "MockupLinearSagittariusIcon";
