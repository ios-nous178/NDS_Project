import React from "react";

export interface EyeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const EyeIcon = React.forwardRef<SVGSVGElement, EyeIconProps>(
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
      <g transform="translate(0 4)">
        <g id="eye">
          <path
            id="Shape"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 0C17.4219 0 21.887 4.62766 23.6412 6.54255C24.1196 7.18085 24.1196 7.81915 23.6412 8.45745C21.887 10.3723 17.2625 15 12 15C6.57807 15 1.95349 10.5319 0.358804 8.45745C-0.119601 7.97872 -0.119601 7.18085 0.358804 6.70213C1.95349 4.62766 6.57807 0 12 0ZM6.7377 7.49999C6.7377 10.3723 9.12972 12.7659 12.0002 12.7659C14.8706 12.7659 17.2626 10.3723 17.2626 7.49999C17.2626 4.62765 14.8706 2.23403 12.0002 2.23403C9.12972 2.23403 6.7377 4.62765 6.7377 7.49999Z"
            fill="currentColor"
          />
          <ellipse
            id="Oval"
            cx="11.9997"
            cy="7.49997"
            rx="2.5515"
            ry="2.55319"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  ),
);

EyeIcon.displayName = "EyeIcon";
