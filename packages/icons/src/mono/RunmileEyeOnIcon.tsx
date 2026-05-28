import React from "react";

export interface RunmileEyeOnIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileEyeOnIcon = React.forwardRef<SVGSVGElement, RunmileEyeOnIconProps>(
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
      <g transform="translate(0 4.5)">
    <g id="eye">
    <path id="Shape" fillRule="evenodd" clipRule="evenodd" d="M12 0C17.4219 0 21.887 4.62766 23.6412 6.54255C24.1196 7.18085 24.1196 7.81915 23.6412 8.45745C21.887 10.3723 17.2625 15 12 15C6.57807 15 1.95349 10.5319 0.358804 8.45745C-0.119601 7.97872 -0.119601 7.18085 0.358804 6.70213C1.95349 4.62766 6.57807 0 12 0ZM6.73754 7.5C6.73754 10.3723 9.12957 12.766 12 12.766C14.8704 12.766 17.2625 10.3723 17.2625 7.5C17.2625 4.62766 14.8704 2.23404 12 2.23404C9.12957 2.23404 6.73754 4.62766 6.73754 7.5Z" fill="currentColor"/>
    <ellipse id="Oval" cx="12" cy="7.5" rx="2.5515" ry="2.55319" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmileEyeOnIcon.displayName = "RunmileEyeOnIcon";
