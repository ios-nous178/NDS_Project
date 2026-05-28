import React from "react";

export interface RunmileCalendarIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileCalendarIcon = React.forwardRef<SVGSVGElement, RunmileCalendarIconProps>(
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
      <g transform="translate(3 2.1504)">
    <g id="ic_calendar_stroke">
    <path id="Union" d="M13 0C13.4694 0 13.8496 0.380167 13.8496 0.849609V1.34961H14C16.2091 1.34961 18 3.14047 18 5.34961V14.3496C18 16.4896 16.3194 18.2375 14.2061 18.3447L14 18.3496H4L3.79395 18.3447C1.7488 18.241 0.108652 16.6008 0.00488281 14.5557L0 14.3496V5.34961C0 3.14047 1.79086 1.34961 4 1.34961H4.15039V0.849609C4.15039 0.380167 4.53056 0 5 0C5.46944 0 5.84961 0.380167 5.84961 0.849609V1.34961H12.1504V0.849609C12.1504 0.380167 12.5306 0 13 0ZM1.7002 14.3496C1.7002 15.6199 2.72975 16.6494 4 16.6494H14C15.2703 16.6494 16.2998 15.6199 16.2998 14.3496V8.19922H1.7002V14.3496ZM4 3.0498C2.72975 3.0498 1.7002 4.07935 1.7002 5.34961V6.5H16.2998V5.34961C16.2998 4.07935 15.2703 3.0498 14 3.0498H13.8496V3.84961C13.8496 4.31905 13.4694 4.69922 13 4.69922C12.5306 4.69922 12.1504 4.31905 12.1504 3.84961V3.0498H5.84961V3.84961C5.84961 4.31905 5.46944 4.69922 5 4.69922C4.53056 4.69922 4.15039 4.31905 4.15039 3.84961V3.0498H4Z" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmileCalendarIcon.displayName = "RunmileCalendarIcon";
