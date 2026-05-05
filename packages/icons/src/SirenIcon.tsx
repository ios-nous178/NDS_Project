import React from "react";

export interface SirenIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const SirenIcon = React.forwardRef<SVGSVGElement, SirenIconProps>(
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
      <g transform="translate(2 3)">
        <path
          id="Shape"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.588 17.413C0.979333 17.8043 1.45 18 2 18H18C18.5507 18.0007 19.0217 17.805 19.413 17.413C19.8043 17.021 20 16.55 20 16V14C20.0007 13.4507 19.805 12.98 19.413 12.588C19.021 12.196 18.55 12 18 12H17V7C17.0013 5.05133 16.3223 3.39733 14.963 2.038C13.6037 0.678668 11.9493 -0.00066528 10 4.88877e-07C8.05067 0.000668054 6.39667 0.680001 5.038 2.038C3.67933 3.396 3 5.05 3 7V12H2C1.45067 12.0007 0.98 12.1967 0.588 12.588C0.196 12.9793 0 13.45 0 14V16C0.000666667 16.5507 0.196667 17.0217 0.588 17.413ZM8.5878 5.588C8.1958 5.97933 7.9998 6.45 7.9998 7V9C8.00114 9.28333 7.90547 9.52067 7.7128 9.712C7.52014 9.90333 7.28247 9.99933 6.9998 10C6.71714 10.0007 6.4798 9.905 6.2878 9.713C6.0958 9.521 5.9998 9.28333 5.9998 9V7C5.9998 5.9 6.39147 4.95833 7.1748 4.175C7.95814 3.39167 8.8998 3 9.9998 3C10.2831 3 10.5205 3.096 10.7118 3.288C10.9031 3.48 10.9991 3.71733 10.9998 4C11.0005 4.28267 10.9048 4.52 10.7128 4.712C10.5208 4.904 10.2831 5 9.9998 5C9.45047 5.00067 8.9798 5.19667 8.5878 5.588Z"
          fill="currentColor"
        />
      </g>
    </svg>
  ),
);

SirenIcon.displayName = "SirenIcon";
