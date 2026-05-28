import React from "react";

export interface RunmilePenIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmilePenIcon = React.forwardRef<SVGSVGElement, RunmilePenIconProps>(
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
      <g transform="translate(3.1392 2.8296)">
    <g id="ic_pen_stroke">
    <path id="Union" d="M12.3417 0.926994C13.5777 -0.308998 15.5823 -0.308998 16.8183 0.926994L16.9306 1.04516C18.0527 2.28744 18.0152 4.20529 16.8183 5.40258L5.52534 16.6955L5.40717 16.8039C5.12154 17.047 4.77163 17.2057 4.39838 17.26L1.14448 17.7336L1.02143 17.7444C0.41417 17.7587 -0.0795657 17.2202 0.0106896 16.5998L0.484322 13.3459C0.546411 12.9195 0.745063 12.5237 1.04975 12.219L12.3417 0.926994ZM15.6162 2.12914C15.0441 1.55704 14.116 1.55704 13.5439 2.12914L2.2519 13.4211C2.20619 13.4668 2.17625 13.5271 2.16694 13.5911L1.82807 15.9153L4.15424 15.5784C4.21808 15.5691 4.27752 15.539 4.32319 15.4934L15.6162 4.20043C16.1878 3.62839 16.1879 2.70113 15.6162 2.12914Z" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmilePenIcon.displayName = "RunmilePenIcon";
