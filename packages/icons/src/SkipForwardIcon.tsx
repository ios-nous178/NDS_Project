import React from "react";

export interface SkipForwardIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const SkipForwardIcon = React.forwardRef<SVGSVGElement, SkipForwardIconProps>(
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
      <g transform="translate(4.125, 4)">
<path d="M1.75 0.213745L1.90777 0.22087C2.22155 0.249272 2.52292 0.361998 2.7793 0.548457L9.9671 5.77595C11.1954 6.66926 11.467 8.38915 10.5737 9.61745C10.4044 9.85011 10.1998 10.0548 9.9671 10.224L2.7793 15.4515C1.99766 16.02 0.903179 15.8471 0.334712 15.0655C0.117177 14.7664 0 14.4061 0 14.0362V1.96375C0 0.997247 0.783502 0.213745 1.75 0.213745Z" fill="currentColor"/>
<path d="M14.75 0C15.2563 0 15.6747 0.291256 15.7409 0.66914L15.75 0.774194V15.2258C15.75 15.6534 15.3023 16 14.75 16C14.2437 16 13.8253 15.7087 13.7591 15.3309L13.75 15.2258V0.774194C13.75 0.346618 14.1977 0 14.75 0Z" fill="currentColor"/>
</g>
    </svg>
  )
);

SkipForwardIcon.displayName = "SkipForwardIcon";
