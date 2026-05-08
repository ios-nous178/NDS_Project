import React from "react";

export interface SkipBackIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const SkipBackIcon = React.forwardRef<SVGSVGElement, SkipBackIconProps>(
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
      <g transform="translate(4 4)">
    <g id="skip-back">
<path id="Combined-Shape" d="M12.9707 0.548458C13.7523 -0.0200086 14.8468 0.152804 15.4153 0.934446C15.6328 1.23356 15.75 1.5939 15.75 1.96375V14.0362C15.75 15.0027 14.9665 15.7862 14 15.7862C13.6302 15.7862 13.2698 15.669 12.9707 15.4515L5.7829 10.224C4.5546 9.3307 4.28304 7.6108 5.17634 6.3825C5.34556 6.14984 5.55023 5.94516 5.7829 5.77595L12.9707 0.548458Z" fill="currentColor"/>
<path id="Path" d="M1 0C1.50626 0 1.92465 0.291256 1.99087 0.66914L2 0.774194V15.2258C2 15.6534 1.55228 16 1 16C0.493739 16 0.0753454 15.7087 0.00912882 15.3309L0 15.2258V0.774194C0 0.346618 0.447715 0 1 0Z" fill="currentColor"/>
</g>
  </g>
    </svg>
  )
);

SkipBackIcon.displayName = "SkipBackIcon";
