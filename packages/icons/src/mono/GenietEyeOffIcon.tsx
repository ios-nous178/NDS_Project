import React from "react";

export interface GenietEyeOffIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietEyeOffIcon = React.forwardRef<SVGSVGElement, GenietEyeOffIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="-1.88 -2.64 23.75 23.75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <path fill="currentColor" d="M1 .234a.8.8 0 0 1 1.132 0L19 17.103a.8.8 0 0 1-1.132 1.131l-3.4-3.4h-.001l-1.28-1.28v-.001l-1.128-1.128-1.178-1.177v-.001L7.984 8.35 6.807 7.175v-.002L5.255 5.62l-.001.001-1.187-1.186.001-.001L1 1.365a.8.8 0 0 1 0-1.13ZM4.521 6.02l-.052.032c-1.446.887-2.445 2.05-2.832 3.27.561 1.499 2.975 4.614 8.363 4.614.82 0 1.57-.067 2.255-.183l1.345 1.345a14.234 14.234 0 0 1-3.6.437c-6.378 0-9.372-3.91-9.969-5.974a.802.802 0 0 1-.006-.421c.443-1.722 1.7-3.206 3.336-4.28l1.16 1.16ZM10 2.935c4.646 0 8.827 2.627 9.96 6.159a.8.8 0 0 1 .017.431c-.322 1.334-1.356 2.97-3.226 4.199l-1.16-1.16c1.617-.97 2.472-2.258 2.77-3.199-.975-2.603-4.32-4.83-8.361-4.83-.757 0-1.5.078-2.213.225L6.47 3.44A12.606 12.606 0 0 1 10 2.935ZM7.802 9.3a2.196 2.196 0 0 0 2.132 2.13l1.372 1.373A3.8 3.8 0 0 1 6.43 7.927L7.802 9.3Zm2.197-3.865a3.8 3.8 0 0 1 3.57 5.105l-1.374-1.373a2.196 2.196 0 0 0-2.13-2.13L8.691 5.664c.408-.15.848-.23 1.307-.23Z"/>
    </svg>
  )
);

GenietEyeOffIcon.displayName = "GenietEyeOffIcon";
