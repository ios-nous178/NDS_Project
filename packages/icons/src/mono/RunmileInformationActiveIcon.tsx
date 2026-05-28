import React from "react";

export interface RunmileInformationActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileInformationActiveIcon = React.forwardRef<SVGSVGElement, RunmileInformationActiveIconProps>(
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
      <g transform="translate(2 2)">
    <g id="ic_information_fill">
    <path id="Exclude" d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM9 7.65039C8.53056 7.65039 8.15039 8.03056 8.15039 8.5C8.15039 8.96944 8.53056 9.34961 9 9.34961H9.15039V14.5C9.15039 14.9694 9.53056 15.3496 10 15.3496H11C11.4694 15.3496 11.8496 14.9694 11.8496 14.5C11.8496 14.0306 11.4694 13.6504 11 13.6504H10.8496V8.5C10.8496 8.03056 10.4694 7.65039 10 7.65039H9ZM10 4.5C9.44772 4.5 9 4.94772 9 5.5C9 6.05228 9.44772 6.5 10 6.5C10.5523 6.5 11 6.05228 11 5.5C11 4.94772 10.5523 4.5 10 4.5Z" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmileInformationActiveIcon.displayName = "RunmileInformationActiveIcon";
