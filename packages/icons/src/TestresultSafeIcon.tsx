import React from "react";

export interface TestresultSafeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TestresultSafeIcon = React.forwardRef<SVGSVGElement, TestresultSafeIconProps>(
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
      <g transform="translate(2.67 2.72)">
        <g id="Group 4710">
          <path
            id="Vector"
            d="M4.66699 6.70618H15.3703C17.1903 6.70618 18.667 8.18284 18.667 10.0028V15.4095C18.667 17.2295 17.1903 18.7062 15.3703 18.7062H4.66699V6.70618Z"
            fill="currentColor"
          />
          <path
            id="Vector_2"
            d="M9.33366 9.03945H4.66699V2.56612C4.66699 1.38278 5.40366 0.306118 6.48366 0.0594514C7.99699 -0.287215 9.33366 0.929451 9.33366 2.47945V9.04278V9.03945Z"
            fill="currentColor"
          />
          <path
            id="Vector_3"
            d="M3.42222 6.70618H1.24444C0.557157 6.70618 0 7.26333 0 7.95062V17.4617C0 18.149 0.557156 18.7062 1.24444 18.7062H3.42222C4.10951 18.7062 4.66667 18.149 4.66667 17.4617V7.95062C4.66667 7.26333 4.10951 6.70618 3.42222 6.70618Z"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  ),
);

TestresultSafeIcon.displayName = "TestresultSafeIcon";
