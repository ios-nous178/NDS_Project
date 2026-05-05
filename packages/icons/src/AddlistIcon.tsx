import React from "react";

export interface AddlistIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const AddlistIcon = React.forwardRef<SVGSVGElement, AddlistIconProps>(
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
        <g id="Group 53">
          <path
            id="Path"
            d="M2 1H5.92969C6.26402 1.00002 6.57626 1.16713 6.76172 1.44531L8.16797 3.55469C8.35343 3.83289 8.66565 4 9 4H18C18.5523 4 19 4.44771 19 5V16C19 16.5523 18.5523 17 18 17H2C1.44772 17 1 16.5523 1 16V2C1 1.44772 1.44772 1 2 1Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g id="Group 54">
            <path
              id="Path_2"
              d="M10 8V13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="Path_3"
              d="M7.5 10.5H12.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </g>
    </svg>
  ),
);

AddlistIcon.displayName = "AddlistIcon";
