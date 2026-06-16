import React from "react";

export interface TrostTestIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostTestIcon = React.forwardRef<SVGSVGElement, TrostTestIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 16 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <path d="M9.27734 0C9.56387 -0.000256694 9.84749 0.0580575 10.1123 0.170898C10.3773 0.283843 10.6185 0.44925 10.8213 0.658203L15.3594 4.3418C15.7686 4.76334 15.9995 5.33514 16 5.93164V15.75C16 16.3467 15.7695 16.9189 15.3604 17.3408C14.9513 17.7626 14.3968 17.9999 13.8184 18H2.18164C1.60299 18 1.04784 17.7628 0.638672 17.3408C0.229576 16.9189 0 16.3467 0 15.75V2.25C1.0883e-06 1.65332 0.229575 1.08112 0.638672 0.65918C1.04784 0.237224 1.60299 0 2.18164 0H9.27734ZM4.25 11.5C3.8358 11.5 3.50002 11.8358 3.5 12.25C3.5 12.6641 3.83503 12.9997 4.24902 13H11.749C12.1632 13 12.5 12.6642 12.5 12.25C12.5 11.836 12.164 11.5003 11.75 11.5H4.25ZM4.25 7C3.8358 7 3.50002 7.33581 3.5 7.75C3.5 8.16405 3.83503 8.49974 4.24902 8.5H11.749C12.1632 8.5 12.5 8.16421 12.5 7.75C12.5 7.33597 12.164 7.00026 11.75 7H4.25Z" fill="currentColor"/>
    </svg>
  )
);

TrostTestIcon.displayName = "TrostTestIcon";
