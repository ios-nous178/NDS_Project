import React from "react";

export interface TrostTestresultSafeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostTestresultSafeIcon = React.forwardRef<SVGSVGElement, TrostTestresultSafeIconProps>(
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
      <path d="M7.33203 9.42285H18.0354C19.8554 9.42285 21.332 10.8995 21.332 12.7195V18.1262C21.332 19.9462 19.8554 21.4229 18.0354 21.4229H7.33203V9.42285Z" fill="#FFD7C1"/>
<path d="M11.9987 11.7562H7.33203V5.28292C7.33203 4.09958 8.0687 3.02291 9.1487 2.77625C10.662 2.42958 11.9987 3.64625 11.9987 5.19625V11.7596V11.7562Z" fill="#FFD7C1"/>
<path d="M6.08824 9.42285H3.91046C3.22317 9.42285 2.66602 9.98001 2.66602 10.6673V20.1784C2.66602 20.8657 3.22317 21.4229 3.91046 21.4229H6.08824C6.77553 21.4229 7.33268 20.8657 7.33268 20.1784V10.6673C7.33268 9.98001 6.77553 9.42285 6.08824 9.42285Z" fill="#4968FF"/>
    </svg>
  )
);

TrostTestresultSafeIcon.displayName = "TrostTestresultSafeIcon";
