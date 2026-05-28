import React from "react";

export interface RunmileEyeOffIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileEyeOffIcon = React.forwardRef<SVGSVGElement, RunmileEyeOffIconProps>(
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
      <g transform="translate(0 3)">
    <g id="eye-off">
    <path id="Shape" fillRule="evenodd" clipRule="evenodd" d="M0.156796 8.93661C-0.0522653 9.29924 -0.0522653 9.74743 0.156796 10.1101C1.13231 11.8068 2.42448 13.2384 3.94195 14.3485L2.30912 15.9984C2.08973 16.2174 1.96625 16.516 1.96625 16.8276C1.96625 17.1392 2.08973 17.4378 2.30912 17.6568C2.76253 18.1144 3.49706 18.1144 3.95046 17.6568L19.4557 1.98908C20.48 0.900126 18.8557 -0.72313 17.7912 0.354086L15.6388 2.53121C9.77336 0.79921 3.16154 3.5654 0.156022 8.9374L0.156796 8.93661ZM20.0658 4.69033L16.451 8.34285C16.5795 8.82005 16.6345 9.35201 16.5903 9.8605C16.4378 12.7057 13.5399 14.7944 10.8309 14.0207L8.35344 16.5241C14.2383 18.2271 20.8276 15.4977 23.8432 10.1101C24.0523 9.7502 24.0523 9.29647 23.8432 8.93661C22.8801 7.23356 21.5841 5.8403 20.0658 4.68955V4.69033ZM7.54825 10.7046L13.1691 5.02515C10.3184 4.21548 7.35006 6.52715 7.39419 9.52333C7.39419 9.93012 7.44838 10.3291 7.54825 10.7046Z" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmileEyeOffIcon.displayName = "RunmileEyeOffIcon";
