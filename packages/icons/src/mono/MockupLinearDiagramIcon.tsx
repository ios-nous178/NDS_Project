import React from "react";

export interface MockupLinearDiagramIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearDiagramIcon = React.forwardRef<SVGSVGElement, MockupLinearDiagramIconProps>(
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
      <path d="M2 2v17c0 1.66 1.34 3 3 3h17" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="m5 17 4.59-5.36c.76-.88 2.11-.94 2.93-.11l.95.95c.82.82 2.17.77 2.93-.11L21 7" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearDiagramIcon.displayName = "MockupLinearDiagramIcon";
