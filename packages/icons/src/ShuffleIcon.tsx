import React from "react";

export interface ShuffleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ShuffleIcon = React.forwardRef<SVGSVGElement, ShuffleIconProps>(
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
      <g transform="translate(2.25 7.25)">
        <g id="Group 3">
          <path
            id="Path"
            d="M4.06579 3.49283e-05C5.74593 3.49283e-05 7.0809 1.03572 8.65121 3.06743L9.00517 3.53767L10.5179 5.59865C10.7117 5.85893 10.9172 6.13446 11.0125 6.25974L11.3759 6.72643C12.6181 8.28008 13.5546 9.00004 14.4868 9.00004H17.8026C18.2168 9.00004 18.5526 9.33582 18.5526 9.75004C18.5526 10.1642 18.2168 10.5 17.8026 10.5H14.4868C12.8846 10.5 11.6295 9.49753 10.0214 7.43154L9.60391 6.88221L8.57893 5.50029C8.25946 5.06162 7.81617 4.44933 7.65828 4.23924C6.26692 2.3878 5.18262 1.50004 4.06579 1.50004H0.75C0.335786 1.50004 2.98023e-08 1.16425 2.98023e-08 0.750035C2.98023e-08 0.335821 0.335786 3.49283e-05 0.75 3.49283e-05H4.06579Z"
            fill="currentColor"
          />
          <path
            id="Path 2"
            d="M15.7198 6.71964C16.0127 6.42674 16.4876 6.42674 16.7805 6.71964L19.2805 9.21964C19.5734 9.51253 19.5734 9.9874 19.2805 10.2803L16.7805 12.7803C16.4876 13.0732 16.0127 13.0732 15.7198 12.7803C15.4269 12.4874 15.4269 12.0125 15.7198 11.7196L17.6891 9.74997L15.7198 7.7803C15.4535 7.51403 15.4293 7.09737 15.6472 6.80375L15.7198 6.71964Z"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  ),
);

ShuffleIcon.displayName = "ShuffleIcon";
